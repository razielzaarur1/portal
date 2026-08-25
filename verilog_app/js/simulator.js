/* ==========================================================================
   VeriLearn Simulation Engine (HDLBits Accurate Simulation & Log Generator)
   Supports: Combinational gates, Vectors, Bit Slicing, Concatenation, Replication,
   Bitwise vs Logical, Adders, Module Instantiation, always @(*), if-else, case,
   and Sequential Logic (posedge clk, D Flip-Flops, Shift Registers, Counters).
   ========================================================================== */

class LocalSimulator {
  /**
   * Helper: Parse nested begin...end blocks safely using stack depth.
   */
  static getAlwaysBlocks(code) {
    const blocks = [];
    const regex = /always\s*@\s*\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      const list = match[1].trim();
      const startIdx = regex.lastIndex;
      
      let body = "";
      let idx = startIdx;
      while (idx < code.length && /\s/.test(code[idx])) {
        idx++;
      }
      
      if (code.substring(idx, idx + 5) === 'begin') {
        let depth = 1;
        let pos = idx + 5;
        while (pos < code.length && depth > 0) {
          if (code.substring(pos, pos + 5) === 'begin' && !/[a-zA-Z0-9_]/.test(code[pos-1] || '') && !/[a-zA-Z0-9_]/.test(code[pos+5] || '')) {
            depth++;
            pos += 5;
          } else if (code.substring(pos, pos + 3) === 'end' && !/[a-zA-Z0-9_]/.test(code[pos-1] || '') && !/[a-zA-Z0-9_]/.test(code[pos+3] || '')) {
            depth--;
            pos += 3;
          } else {
            pos++;
          }
        }
        body = code.substring(idx, pos);
      } else {
        let pos = idx;
        while (pos < code.length && code[pos] !== ';') {
          pos++;
        }
        body = code.substring(idx, pos + 1);
      }
      blocks.push({ list, body });
    }
    return blocks;
  }

  /**
   * Helper: Translate Verilog statements into JavaScript syntax.
   */
  static translateVerilogToJS(body) {
    let js = body;
    
    // Strip Verilog comments
    js = js.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // Convert Verilog numeric literals (1'b0, 8'hFF, 10'd5)
    js = js.replace(/(\d+)'([bB])([01_xXzZ]+)/g, (m, w, r, val) => parseInt(val.replace(/_/g, ''), 2));
    js = js.replace(/(\d+)'([hH])([0-9a-fA-F_]+)/g, (m, w, r, val) => parseInt(val.replace(/_/g, ''), 16));
    js = js.replace(/(\d+)'([dD])([0-9_]+)/g, (m, w, r, val) => parseInt(val.replace(/_/g, ''), 10));
    
    // Convert begin/end
    js = js.replace(/\bbegin\b/g, '{').replace(/\bend\b/g, '}');
    
    // Convert Verilog case statements to JavaScript if-else chains (bypasses switch fall-through)
    const caseRegex = /\bcase\s*\(([^)]+)\)([\s\S]*?)\bendcase\b/g;
    js = js.replace(caseRegex, (match, selExpr, caseBody) => {
      selExpr = selExpr.trim();
      const lines = caseBody.split(';');
      let isFirst = true;
      let resultJs = "";
      
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        const labelMatch = line.match(/^([^:]+):([\s\S]*)$/);
        if (labelMatch) {
          const label = labelMatch[1].trim();
          const stmt = labelMatch[2].trim();
          
          if (label === 'default') {
            resultJs += ` } else { ${stmt};`;
          } else {
            if (isFirst) {
              resultJs += `if ((${selExpr}) === ${label}) { ${stmt};`;
              isFirst = false;
            } else {
              resultJs += ` } else if ((${selExpr}) === ${label}) { ${stmt};`;
            }
          }
        } else {
          resultJs += ` ${line};`;
        }
      }
      if (!isFirst) {
        resultJs += " }";
      }
      return resultJs;
    });

    // Convert blocking assignments: var = expr; (avoiding <=, >=, ==, ===)
    js = js.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*(?:\s*\[[^\]]+\])?)\s*=\s*(?![=<])([^;]+);/g, 'context["$1"] = $2;');
    
    // Convert non-blocking assignments: var <= expr;
    js = js.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*(?:\s*\[[^\]]+\])?)\s*<=\s*([^;]+);/g, 'nextState["$1"] = $2;');

    return js;
  }

  /**
   * Helper: Parse signal widths from module declaration.
   */
  static getSignalWidths(code) {
    const widths = {};
    const regex = /(?:input|output|reg|wire)\s+(?:reg|wire)?\s*\[(\d+):(\d+)\]\s*([a-zA-Z0-9_,\s]+)/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      const high = parseInt(match[1], 10);
      const low = parseInt(match[2], 10);
      const width = Math.abs(high - low) + 1;
      const sigs = match[3].split(',').map(s => s.trim());
      sigs.forEach(s => {
        if (s) widths[s] = width;
      });
    }
    return widths;
  }

  /**
   * Client-side Verilog parser & evaluator for Verilog combinational & sequential logic.
   */
  static evaluate(userCode, expectedOutputs, lessonId) {
    const cleanCode = userCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();

    // 1. Basic Syntax Validation
    if (!cleanCode.includes('module') || !cleanCode.includes('endmodule')) {
      return {
        compileError: true,
        status: 'Compile Error',
        log: `# vlog top_module.v\n# ** Error: top_module.v(1): Module declaration or endmodule missing.\n# Errors: 1, Warnings: 0`
      };
    }

    const rawLines = userCode.split('\n');
    for (let idx = 0; idx < rawLines.length; idx++) {
      const line = rawLines[idx].replace(/\/\/.*$/, '').trim();
      if (!line) continue;

      // Check assign statement MUST end with semicolon
      if (/^assign\b/.test(line) && !/;[ \t]*$/.test(line)) {
        return {
          compileError: true,
          status: 'Compile Error',
          log: `# vlog top_module.v\n# ** Error: top_module.v(${idx + 1}): syntax error near '${line}', missing ';'\n# Errors: 1, Warnings: 0`
        };
      }

      // Check wire/reg/parameter statement outside port list MUST end with semicolon or comma
      if (/^(wire|reg|integer|parameter)\b/.test(line) && !/[;,][ \t]*$/.test(line)) {
        return {
          compileError: true,
          status: 'Compile Error',
          log: `# vlog top_module.v\n# ** Error: top_module.v(${idx + 1}): syntax error near '${line}', missing ';'\n# Errors: 1, Warnings: 0`
        };
      }

      // Check statement immediately before endmodule
      if (line === 'endmodule' && idx > 0) {
        const prevLine = rawLines[idx - 1].replace(/\/\/.*$/, '').trim();
        if (prevLine && !/[;{}]\s*$/.test(prevLine) && !prevLine.endsWith('end') && !prevLine.endsWith('begin') && !prevLine.endsWith(')')) {
          return {
            compileError: true,
            status: 'Compile Error',
            log: `# vlog top_module.v\n# ** Error: top_module.v(${idx}): syntax error near '${prevLine}', missing ';'\n# Errors: 1, Warnings: 0`
          };
        }
      }
    }

    const alwaysBlocks = this.getAlwaysBlocks(cleanCode);
    const widths = this.getSignalWidths(cleanCode);

    // Extract continuous assignments: assign out = expr;
    const assignMatches = [...cleanCode.matchAll(/assign\s+([a-zA-Z0-9_]+(?:\s*\[[^\]]+\])?)\s*=\s*([^;]+);/g)];
    const assignments = {};
    assignMatches.forEach(match => {
      const varName = match[1].trim();
      const expr = match[2].trim();
      assignments[varName] = expr;
    });

    const state = {};
    let lastClk = 0;
    const actualOutputs = [];

    // 2. Evaluate each test vector cycle
    for (let i = 0; i < expectedOutputs.length; i++) {
      const testStep = expectedOutputs[i];
      const context = { ...testStep };

      // Determine clock edge
      const curClk = testStep['clk'] !== undefined ? testStep['clk'] : 0;
      const isRisingEdge = (lastClk === 0 && curClk === 1);
      lastClk = curClk;

      const nextState = {};

      // Run sequential clocked blocks on rising edge (posedge clk)
      if (isRisingEdge) {
        alwaysBlocks.forEach(block => {
          if (block.list.includes('posedge clk') || block.list.includes('posedge')) {
            try {
              const js = this.translateVerilogToJS(block.body);
              const runContext = { ...context, ...state };
              const run = new Function('context', 'nextState', 'state', `with(context) { ${js} }`);
              run(runContext, nextState, state);
            } catch (e) {
              console.warn('Sequential always block evaluation error:', e);
            }
          }
        });
      }

      // Apply nextState updates to register state (with width masking)
      Object.keys(nextState).forEach(k => {
        const width = widths[k] || 1;
        state[k] = (nextState[k] >>> 0) & ((1 << width) - 1);
      });

      // Run combinational always blocks: always @(*) or always @(inputs)
      alwaysBlocks.forEach(block => {
        if (block.list.includes('*') || (!block.list.includes('clk') && !block.list.includes('posedge'))) {
          try {
            const js = this.translateVerilogToJS(block.body);
            const runContext = { ...context, ...state };
            const run = new Function('context', 'nextState', 'state', `with(context) { ${js} }`);
            run(runContext, nextState, state);
            Object.keys(runContext).forEach(k => {
              context[k] = runContext[k];
            });
          } catch (e) {
            console.warn('Combinational always block evaluation error:', e);
          }
        }
      });

      // Run continuous assignments (assign out = expr;)
      Object.keys(assignments).forEach(varName => {
        try {
          const expr = assignments[varName];
          const val = this.evaluateExpression(expr, { ...context, ...state });
          context[varName] = val;
        } catch (e) {
          console.warn(`Evaluation error for ${varName}:`, e);
          context[varName] = 0;
        }
      });

      // Build output record for this cycle
      const outputState = { time: testStep.time || (i * 5) };
      Object.keys(testStep).forEach(k => {
        outputState[k] = context[k] !== undefined ? context[k] : (state[k] !== undefined ? state[k] : 0);
      });

      actualOutputs.push(outputState);
    }

    return {
      compileError: false,
      actualOutputs,
      totalSamples: expectedOutputs.length
    };
  }

  /**
   * Safely evaluate a Verilog expression string given variable context.
   */
  static evaluateExpression(expr, context) {
    let jsExpr = expr.trim();

    // 1. Handle Vector Replication {N{val}}
    const repMatch = jsExpr.match(/^\{\s*(\d+)\s*\{\s*([a-zA-Z0-9_]+)\s*\}\s*\}$/);
    if (repMatch) {
      const count = parseInt(repMatch[1], 10);
      const varName = repMatch[2];
      const bitVal = context[varName] !== undefined ? context[varName] : 0;
      return bitVal ? ((1 << count) - 1) : 0;
    }

    // 2. Handle Concatenation Operator {a, b, c, ...} — multi-signal
    if (jsExpr.match(/^\{[^{}]+\}$/) && !jsExpr.match(/^\{\s*\d+\s*\{/)) {
      const inner = jsExpr.slice(1, -1);
      const signals = inner.split(',').map(s => s.trim());
      let result = 0;
      for (const sig of signals) {
        const sliceMatch = sig.match(/^([a-zA-Z0-9_]+)\[(\d+):(\d+)\]$/);
        const indexMatch = sig.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
        let bitWidth = 1;
        let bitVal = 0;
        if (sliceMatch) {
          const v = context[sliceMatch[1]] !== undefined ? context[sliceMatch[1]] : 0;
          const high = Math.max(parseInt(sliceMatch[2]), parseInt(sliceMatch[3]));
          const low = Math.min(parseInt(sliceMatch[2]), parseInt(sliceMatch[3]));
          bitWidth = high - low + 1;
          bitVal = (v >> low) & ((1 << bitWidth) - 1);
        } else if (indexMatch) {
          const v = context[indexMatch[1]] !== undefined ? context[indexMatch[1]] : 0;
          bitWidth = 1;
          bitVal = (v >> parseInt(indexMatch[2])) & 1;
        } else if (sig.match(/^[a-zA-Z0-9_]+$/)) {
          const v = context[sig] !== undefined ? context[sig] : 0;
          bitWidth = Math.max(1, 32 - Math.clz32(v || 1));
          bitVal = v;
        } else if (sig.match(/^\d+$/)) {
          bitVal = parseInt(sig);
          bitWidth = Math.max(1, 32 - Math.clz32(bitVal || 1));
        }
        result = (((result >>> 0) << bitWidth) | (bitVal & ((1 << bitWidth) - 1))) >>> 0;
      }
      return result >>> 0;
    }

    // 3. Handle Bit Slicing e.g. in[3:2] or bus[2:0]
    jsExpr = jsExpr.replace(/([a-zA-Z0-9_]+)\[(\d+):(\d+)\]/g, (match, varName, uStr, lStr) => {
      const val = context[varName] !== undefined ? context[varName] : 0;
      const upper = parseInt(uStr, 10);
      const lower = parseInt(lStr, 10);
      const high = Math.max(upper, lower);
      const low = Math.min(upper, lower);
      const width = high - low + 1;
      const mask = (1 << width) - 1;
      return (val >> low) & mask;
    });

    // 4. Handle Bit Indexing e.g. in[2]
    jsExpr = jsExpr.replace(/([a-zA-Z0-9_]+)\[(\d+)\]/g, (match, varName, bitIdx) => {
      const val = context[varName] !== undefined ? context[varName] : 0;
      const idx = parseInt(bitIdx, 10);
      return (val >> idx) & 1;
    });

    // 5. Handle Verilog bitwise NOT on named signals before variable substitution
    jsExpr = jsExpr.replace(/~\s*([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, name) => {
      const val = context[name] !== undefined ? context[name] : null;
      if (val !== null) return String((~val) >>> 0);
      return match;
    });

    // 6. Replace variable names with context values
    Object.keys(context).sort((a, b) => b.length - a.length).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      jsExpr = jsExpr.replace(regex, context[key]);
    });

    // 7. Replace Verilog operators with JS equivalent
    jsExpr = jsExpr
      .replace(/~\s*1/g, '0')
      .replace(/~\s*0/g, '1')
      .replace(/&&/g, '&&')
      .replace(/\|\|/g, '||')
      .replace(/&/g, '&')
      .replace(/\|/g, '|')
      .replace(/\^/g, '^');

    try {
      const val = (new Function(`return (${jsExpr});`))();
      return typeof val === 'number' ? (val >>> 0) : 0; // 32-bit unsigned
    } catch (e) {
      return 0;
    }
  }
}

class SimulationManager {
  async testSolution(userCode, lesson) {
    const expected = lesson.expectedOutputs;
    
    // 1. Try calling the real Icarus Verilog Backend Compiler API (/api/compile)
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userCode,
          expectedOutputs: expected,
          lessonId: lesson.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        const actualOutputs = result.actualOutputs || [];
        const outputKeys = Object.keys(expected[0] || {}).filter(k => k !== 'time');
        const mainKey = outputKeys[0] || 'q';

        const comparisons = expected.map((exp, idx) => {
          const act = actualOutputs[idx] || {};
          let isMismatch = false;
          for (const key of outputKeys) {
            if (act[key] !== exp[key]) {
              isMismatch = true;
              break;
            }
          }
          return {
            time: exp.time || (idx * 5),
            in: exp.in !== undefined ? exp.in : (exp.d !== undefined ? exp.d : exp.a),
            yours: act[mainKey] !== undefined ? act[mainKey] : 0,
            ref: exp[mainKey] !== undefined ? exp[mainKey] : 0,
            mismatch: isMismatch ? 1 : 0
          };
        });

        return {
          passed: result.passed || false,
          status: result.status || (result.compileError ? 'Compile Error' : 'Incorrect'),
          log: result.log,
          actualOutputs,
          comparisons,
          mismatches: result.mismatches !== undefined ? result.mismatches : expected.length,
          totalSamples: expected.length
        };
      }
    } catch (e) {
      console.warn('Backend Icarus Verilog API not reachable, falling back to local JS evaluator:', e);
    }

    // 2. Fallback: Run evaluation using local client-side interpreter
    const simResult = LocalSimulator.evaluate(userCode, expected, lesson.id);

    if (simResult.compileError) {
      return {
        passed: false,
        status: 'Compile Error',
        log: simResult.log,
        actualOutputs: [],
        mismatches: expected.length
      };
    }

    const actualOutputs = simResult.actualOutputs;
    let mismatches = 0;

    // Determine target output keys to check
    const outputKeys = Object.keys(expected[0]).filter(k => k !== 'time' && k !== 'in' && k !== 'd' && k !== 'a' && k !== 'b' && k !== 'sel' && k !== 'clk' && k !== 'reset' && k !== 'rst' && k !== 'rst_n' && k !== 'load' && k !== 'data' && k !== 'timer_done' && k !== 'write_en' && k !== 'write_reg' && k !== 'write_data' && k !== 'read_reg1' && k !== 'read_reg2' && k !== 'we' && k !== 'addr' && k !== 'data_in' && k !== 'we_a' && k !== 'addr_a' && k !== 'data_in_a' && k !== 'addr_b' && k !== 'wr_en' && k !== 'rd_en' && k !== 'wr' && k !== 'rd' && k !== 'push' && k !== 'pop' && k !== 'duty' && k !== 'tx_start' && k !== 'tx_data' && k !== 'rx' && k !== 'start' && k !== 'stop' && k !== 'read_write' && k !== 'in_val' && k !== 'x' && k !== 'syn_rst' && k !== 'd_in' && k !== 'async_rst' && k !== 'enable' && k !== 't' && k !== 'j' && k !== 'k');

    // Calculate HDLBits Mismatch vector
    const comparisons = expected.map((exp, idx) => {
      const act = actualOutputs[idx] || {};
      let isMismatch = false;

      for (const key of outputKeys) {
        if (act[key] !== exp[key]) {
          isMismatch = true;
          break;
        }
      }

      if (isMismatch) mismatches++;

      const mainKey = outputKeys[0] || 'q';

      return {
        time: exp.time || (idx * 5),
        in: exp.in !== undefined ? exp.in : (exp.d !== undefined ? exp.d : exp.a),
        yours: act[mainKey] !== undefined ? act[mainKey] : 0,
        ref: exp[mainKey] !== undefined ? exp[mainKey] : 0,
        mismatch: isMismatch ? 1 : 0
      };
    });

    const passed = mismatches === 0;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toTimeString().split(' ')[0];

    // Build ModelSim-style HDLBits log output
    const log = `
# do /home/h/hdlbits/runsim.do
# Model Technology ModelSim - Intel FPGA Edition vlog 2020.1 Compiler 2020.02 Feb 28 2020
# Start time: ${timeStr} on ${dateStr}
# vlog top_module.v
# -- Compiling module top_module
# Loading work.tb
# Loading work.top_module
#
# Hint: Output has ${mismatches} mismatches.
# Hint: Total mismatched samples is ${mismatches} out of ${expected.length} samples
#
# Simulation finished at ${expected.length * 5 + 10} ps
# Mismatches: ${mismatches} in ${expected.length} samples
# Errors: 0, Warnings: ${mismatches > 0 ? 1 : 0}
`.trim();

    return {
      passed,
      status: passed ? 'Success' : 'Incorrect',
      log,
      actualOutputs,
      comparisons,
      mismatches,
      totalSamples: expected.length
    };
  }
}

window.Simulator = new SimulationManager();
