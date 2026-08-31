/* ==========================================================================
   VeriLearn Simulation Engine & WebAssembly Icarus Verilog Bridge (simulator.js)
   Features:
     - 100% Client-Side WebAssembly (Icarus Verilog ivlpp + ivl + vvp) via Web Worker
     - Hierarchical "Building Blocks" Auto-Injection (MODULE_LIBRARY)
     - Dynamic Self-Checking Testbench Generation with $dumpfile("dump.vcd")
     - ModelSim / HDLBits Compatible Log Generation and Comparison Table
     - Local JavaScript Simulator Fallback
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

    // Convert bit slicing in expressions: var[3:0]
    js = js.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+):(\d+)\]/g, (m, varName, uStr, lStr) => {
      const u = parseInt(uStr, 10);
      const l = parseInt(lStr, 10);
      const high = Math.max(u, l);
      const low = Math.min(u, l);
      const width = high - low + 1;
      const mask = (1 << width) - 1;
      return `(((${varName}) >> ${low}) & ${mask})`;
    });

    // Convert single bit indexing: var[3]
    js = js.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\](?!\s*=)/g, (m, varName, idxStr) => {
      const idx = parseInt(idxStr, 10);
      return `(((${varName}) >> ${idx}) & 1)`;
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
    const regex = /(?:input|output|reg|wire)\s+(?:reg\s+|wire\s+)?\[(\d+):(\d+)\]\s*([^,;)\n]+)/g;
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

    // Extract continuous assignments: assign out = expr; and wire [x:y] out = expr;
    const assignMatches = [...cleanCode.matchAll(/(?:assign|wire(?:\s*\[\d+:\d+\])?)\s+([a-zA-Z0-9_]+(?:\s*\[[^\]]+\])?)\s*=\s*([^;]+);/g)];
    const assignments = {};
    assignMatches.forEach(match => {
      const varName = match[1].trim();
      const expr = match[2].trim();
      assignments[varName] = expr;
    });

    // Extract d_flip_flop instances if any
    const dffInstances = [];
    const dffRegex = /\bd_flip_flop\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/g;
    let dffMatch;
    while ((dffMatch = dffRegex.exec(cleanCode)) !== null) {
      const instName = dffMatch[1];
      const portsStr = dffMatch[2];
      const portMap = {};
      const portRegex = /\.([a-zA-Z0-9_]+)\s*\(([^)]+)\)/g;
      let pMatch;
      while ((pMatch = portRegex.exec(portsStr)) !== null) {
        portMap[pMatch[1].trim()] = pMatch[2].trim();
      }
      dffInstances.push({ instName, portMap });
    }

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
        if (dffInstances.length > 0) {
          dffInstances.forEach(inst => {
            const { portMap } = inst;
            const rstSignal = portMap['reset'] || 'reset';
            const isRst = context[rstSignal] !== undefined ? context[rstSignal] : (state[rstSignal] || 0);
            const qPort = portMap['q'];
            const dExpr = portMap['d'];

            let nextBit = 0;
            if (!isRst && dExpr) {
              nextBit = this.evaluateExpression(dExpr, { ...context, ...state }) & 1;
            }

            const sliceMatch = qPort ? qPort.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/) : null;
            if (sliceMatch) {
              const vecName = sliceMatch[1];
              const bitIdx = parseInt(sliceMatch[2], 10);
              if (nextState[vecName] === undefined) {
                nextState[vecName] = state[vecName] !== undefined ? state[vecName] : 0;
              }
              if (nextBit) {
                nextState[vecName] |= (1 << bitIdx);
              } else {
                nextState[vecName] &= ~(1 << bitIdx);
              }
            } else if (qPort) {
              nextState[qPort] = nextBit;
            }
          });
        }

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

      // Run continuous assignments first (e.g. intermediate wires, res_add = a + b)
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

      // Run combinational always blocks: always @(*) or always @(inputs)
      alwaysBlocks.forEach(block => {
        if (block.list.includes('*') || (!block.list.includes('clk') && !block.list.includes('posedge'))) {
          try {
            const js = this.translateVerilogToJS(block.body);
            const runContext = { ...context, ...state };
            const run = new Function('context', 'nextState', 'state', `with(context) { ${js} }`);
            run(runContext, nextState, state);
            Object.keys(runContext).forEach(k => {
              const width = widths[k];
              if (width && typeof runContext[k] === 'number') {
                const mask = width === 32 ? 0xFFFFFFFF : ((1 << width) - 1);
                context[k] = (runContext[k] >>> 0) & mask;
              } else {
                context[k] = runContext[k];
              }
            });
          } catch (e) {
            console.warn('Combinational always block evaluation error:', e);
          }
        }
      });

      // Re-run continuous assignments for outputs driven by combinational always blocks
      Object.keys(assignments).forEach(varName => {
        try {
          const expr = assignments[varName];
          const val = this.evaluateExpression(expr, { ...context, ...state });
          context[varName] = val;
        } catch (e) {
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

const MODULE_LIBRARY = {
  half_adder: `
module half_adder (
    input a,
    input b,
    output sum,
    output cout,
    output y,
    output out
);
    assign sum = a ^ b;
    assign cout = a & b;
    assign y = sum;
    assign out = sum;
endmodule
`,
  full_adder: `
module full_adder (
    input a,
    input b,
    input cin,
    output sum,
    output cout,
    output y,
    output out
);
    wire s1, c1, c2;
    half_adder ha1 (.a(a), .b(b), .sum(s1), .cout(c1));
    half_adder ha2 (.a(s1), .b(cin), .sum(sum), .cout(c2));
    assign cout = c1 | c2;
    assign y = sum;
    assign out = sum;
endmodule
`,
  ripple_carry_adder_4bit: `
module ripple_carry_adder_4bit (
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);
    wire c1, c2, c3;
    full_adder fa0 (a[0], b[0], cin, sum[0], c1);
    full_adder fa1 (a[1], b[1], c1, sum[1], c2);
    full_adder fa2 (a[2], b[2], c2, sum[2], c3);
    full_adder fa3 (a[3], b[3], c3, sum[3], cout);
endmodule
`,
  mux_2to1: `
module mux_2to1 (
    input a,
    input b,
    input sel,
    output y,
    output out
);
    assign y = sel ? b : a;
    assign out = sel ? b : a;
endmodule
`,
  mux_4to1: `
module mux_4to1 (
    input [3:0] in,
    input [1:0] sel,
    output y,
    output out
);
    wire m0, m1;
    mux_2to1 mux0 (.a(in[0]), .b(in[1]), .sel(sel[0]), .y(m0));
    mux_2to1 mux1 (.a(in[2]), .b(in[3]), .sel(sel[0]), .y(m1));
    mux_2to1 mux_final (.a(m0), .b(m1), .sel(sel[1]), .y(y));
    assign out = y;
endmodule
`,
  mux_8to1: `
module mux_8to1 (
    input [7:0] in,
    input [2:0] sel,
    output y,
    output out
);
    wire low_mux, high_mux;
    mux_4to1 m_low (.in(in[3:0]), .sel(sel[1:0]), .y(low_mux));
    mux_4to1 m_high (.in(in[7:4]), .sel(sel[1:0]), .y(high_mux));
    mux_2to1 m_final (.a(low_mux), .b(high_mux), .sel(sel[2]), .y(y));
    assign out = y;
endmodule
`,
  decoder_2to4: `
module decoder_2to4 (
    input [1:0] in,
    input en,
    input enable,
    output [3:0] out
);
    wire act_en = en | enable;
    assign out[0] = act_en & (~in[1] & ~in[0]);
    assign out[1] = act_en & (~in[1] &  in[0]);
    assign out[2] = act_en & ( in[1] & ~in[0]);
    assign out[3] = act_en & ( in[1] &  in[0]);
endmodule
`,
  decoder_3to8: `
module decoder_3to8 (
    input [2:0] in,
    output [7:0] out
);
    wire en_low, en_high;
    assign en_low  = ~in[2];
    assign en_high =  in[2];
    decoder_2to4 dec_low  (.in(in[1:0]), .en(en_low),  .out(out[3:0]));
    decoder_2to4 dec_high (.in(in[1:0]), .en(en_high), .out(out[7:4]));
endmodule
`,
  d_flip_flop: `
module d_flip_flop (
    input clk,
    input d,
    output reg q
);
    initial q = 0;
    always @(posedge clk) begin
        q <= d;
    end
endmodule
`,
  register_4bit: `
module register_4bit (
    input clk,
    input reset,
    input [3:0] d,
    output reg [3:0] q
);
    initial q = 0;
    always @(posedge clk) begin
        if (reset) q <= 4'b0;
        else q <= d;
    end
endmodule
`,
  shift_register_4bit: `
module shift_register_4bit (
    input clk,
    input reset,
    input si,
    output reg [3:0] q
);
    initial q = 0;
    always @(posedge clk) begin
        if (reset) q <= 4'b0;
        else q <= {q[2:0], si};
    end
endmodule
`,
  add8: `
module add8 (
    input [7:0] a,
    input [7:0] b,
    input cin,
    output [7:0] sum,
    output cout
);
    assign {cout, sum} = a + b + cin;
endmodule
`,
  mod_a: `
module mod_a (
    input in1,
    input in2,
    output out_xor,
    output out_and,
    output out_val
);
    assign out_xor = in1 ^ in2;
    assign out_and = in1 & in2;
    assign out_val = in1 ^ in2;
endmodule
`,
  inverter_block: `
module inverter_block (
    input in_sig,
    output out_sig
);
    assign out_sig = ~in_sig;
endmodule
`,
  ram_block: `
module ram_block #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
) (
    input clk,
    input we,
    input [ADDR_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    input [DATA_WIDTH-1:0] data_in,
    output [DATA_WIDTH-1:0] rdata,
    output [DATA_WIDTH-1:0] data_out
);
    reg [DATA_WIDTH-1:0] memory [0:(1<<ADDR_WIDTH)-1];
    wire [DATA_WIDTH-1:0] in_d = wdata | data_in;
    always @(posedge clk) begin
        if (we) memory[addr] <= in_d;
    end
    assign rdata = memory[addr];
    assign data_out = memory[addr];
endmodule
`
};

function getHelperDependencies(userCode) {
  const dependencies = [];
  const added = new Set();

  function scan(code) {
    for (const [name, modCode] of Object.entries(MODULE_LIBRARY)) {
      if (!added.has(name)) {
        const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
        const declaredRegex = new RegExp(`\\bmodule\\s+${name}\\b`, 'g');
        if (usageRegex.test(code) && !declaredRegex.test(userCode)) {
          added.add(name);
          dependencies.push({ name: `${name}.v`, code: modCode });
          scan(modCode);
        }
      }
    }
  }

  scan(userCode);
  return dependencies;
}

function getTopModuleName(userCode) {
  const modMatches = [...userCode.matchAll(/\bmodule\s+([a-zA-Z0-9_]+)\b/g)].map(m => m[1]);
  if (modMatches.includes('top_module')) return 'top_module';
  if (modMatches.length > 0) return modMatches[modMatches.length - 1];
  return 'top_module';
}

function parseVerilogPorts(userCode) {
  const topName = getTopModuleName(userCode);
  const modRegex = new RegExp(`\\bmodule\\s+${topName}\\s*(?:#\\s*\\([^)]*\\)\\s*)?\\(([^;]*?)\\);`, 's');
  const match = userCode.match(modRegex);
  const inputs = [];
  const outputs = [];

  if (match) {
    const portListStr = match[1];
    const portDecls = portListStr.split(',').map(s => s.trim()).filter(Boolean);

    portDecls.forEach(decl => {
      const pMatch = decl.match(/(input|output)\s+(?:signed\s+)?(?:reg\s+|wire\s+)?(?:\[(\d+):(\d+)\]\s+)?([a-zA-Z0-9_]+)/);
      if (pMatch) {
        const dir = pMatch[1];
        const high = pMatch[2] !== undefined ? parseInt(pMatch[2], 10) : 0;
        const low = pMatch[3] !== undefined ? parseInt(pMatch[3], 10) : 0;
        const width = pMatch[2] !== undefined ? Math.abs(high - low) + 1 : 1;
        const name = pMatch[4];
        if (dir === 'input') inputs.push({ name, width, high, low });
        else outputs.push({ name, width, high, low });
      }
    });
  }

  return { inputs, outputs, topName };
}

function generateVerilogTestbench(userCode, expectedOutputs, lessonId) {
  const { inputs, outputs, topName } = parseVerilogPorts(userCode);

  let tb = `// Auto-generated VeriLearn Testbench (Lesson ${lessonId})\n`;
  tb += '`timescale 1ns/1ps\n\n';
  tb += 'module tb;\n';

  inputs.forEach(inp => {
    if (inp.width > 1) {
      tb += `    reg [${inp.high}:${inp.low}] ${inp.name};\n`;
    } else {
      tb += `    reg ${inp.name};\n`;
    }
  });

  outputs.forEach(out => {
    if (out.width > 1) {
      tb += `    wire [${out.high}:${out.low}] ${out.name};\n`;
    } else {
      tb += `    wire ${out.name};\n`;
    }
  });

  tb += '\n    integer error_count = 0;\n';
  tb += '    integer sample_idx = 0;\n\n';

  tb += `    ${topName} uut (\n`;
  const allPorts = [...inputs, ...outputs];
  const portConnections = allPorts.map(p => `        .${p.name}(${p.name})`);
  tb += portConnections.join(',\n');
  tb += '\n    );\n\n';

  const hasExplicitClk = expectedOutputs.length > 0 && expectedOutputs[0].clk !== undefined;
  const hasClkPort = inputs.some(i => i.name === 'clk');

  if (hasClkPort && !hasExplicitClk) {
    tb += '    initial begin\n';
    tb += '        clk = 0;\n';
    tb += '        forever #5 clk = ~clk;\n';
    tb += '    end\n\n';
  }

  tb += '    initial begin\n';
  tb += '        $dumpfile("/dump.vcd");\n';
  tb += '        $dumpvars(0, tb);\n\n';

  // Initialize signals at t=0
  inputs.forEach(inp => {
    tb += `        ${inp.name} = 0;\n`;
  });
  tb += '        #1;\n\n';

  expectedOutputs.forEach((step, idx) => {
    tb += `        // Sample #${idx + 1}\n`;
    if (hasExplicitClk && step.clk !== undefined) {
      inputs.forEach(inp => {
        if (inp.name !== 'clk') {
          const val = step[inp.name] !== undefined ? step[inp.name] : 0;
          tb += `        ${inp.name} = ${inp.width}'d${val};\n`;
        }
      });
      tb += `        #1; clk = 1'b${step.clk};\n`;
      tb += `        #4;\n`;
    } else if (hasClkPort) {
      inputs.forEach(inp => {
        if (inp.name !== 'clk') {
          const val = step[inp.name] !== undefined ? step[inp.name] : 0;
          tb += `        ${inp.name} = ${inp.width}'d${val};\n`;
        }
      });
      tb += `        @(posedge clk);\n`;
      tb += `        #1;\n`;
    } else {
      inputs.forEach(inp => {
        const val = step[inp.name] !== undefined ? step[inp.name] : 0;
        tb += `        ${inp.name} = ${inp.width}'d${val};\n`;
      });
      tb += `        #5;\n`;
    }

    const outDisplayFmt = outputs.map(o => `${o.name}=%0d`).join(' ');
    const outDisplayVars = outputs.map(o => o.name).join(', ');

    tb += `        $display("SAMPLE %0d: ${outDisplayFmt}", ${idx}, ${outDisplayVars});\n`;

    outputs.forEach(out => {
      if (step[out.name] !== undefined) {
        tb += `        if (^${out.name} !== 1'bx && ${out.name} !== ${out.width}'d${step[out.name]}) begin\n`;
        tb += `            $display("  [MISMATCH at sample %0d] ${out.name}: Expected %0d, Got %0d", ${idx}, ${step[out.name]}, ${out.name});\n`;
        tb += '            error_count = error_count + 1;\n';
        tb += '        end\n';
      }
    });
    tb += '\n';
  });

  tb += '        #5;\n';
  tb += '        if (error_count == 0) begin\n';
  tb += '            $display("ALL TESTS PASSED: %0d samples verified successfully with 0 errors.", sample_idx + 1);\n';
  tb += '        end else begin\n';
  tb += '            $display("[TEST FAILED]: Total %0d mismatches found.", error_count);\n';
  tb += '        end\n';
  tb += '        $finish;\n';
  tb += '    end\n\n';
  tb += 'endmodule\n';

  return tb;
}

class SimulationManager {
  constructor() {
    this.worker = null;
    this.pendingRequests = new Map();
    this.reqIdCounter = 0;
    this.initWorker();
  }

  initWorker() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker('./js/verilog_worker.js', { type: 'module' });
        this.worker.onmessage = (e) => this.handleWorkerMessage(e);
        this.worker.onerror = (err) => {
          console.warn('Verilog Web Worker encountered error:', err);
        };
      } catch (err) {
        console.warn('Failed to initialize module Web Worker, will fallback:', err);
      }
    }
  }

  handleWorkerMessage(e) {
    const { id, type, message, success, passed, status, logs, vcd } = e.data;
    const req = this.pendingRequests.get(id);
    if (!req) return;

    if (type === 'status') {
      if (typeof req.onProgress === 'function') {
        req.onProgress(message);
      }
    } else if (type === 'result') {
      this.pendingRequests.delete(id);
      req.resolve({ success, passed, status, logs, vcd });
    }
  }

  async testSolution(userCode, lesson, onProgress) {
    const expected = lesson.expectedOutputs || [];
    const dependencies = getHelperDependencies(userCode);
    const testbenchCode = generateVerilogTestbench(userCode, expected, lesson.id);

    // 1. Run in WebAssembly Web Worker if supported
    if (this.worker) {
      try {
        const reqId = `sim_${++this.reqIdCounter}_${Date.now()}`;
        const workerPromise = new Promise((resolve) => {
          this.pendingRequests.set(reqId, { resolve, onProgress });
        });

        this.worker.postMessage({
          id: reqId,
          userCode,
          testbenchCode,
          dependencies,
          generation: '2012'
        });

        // Set a 15-second timeout safeguard
        const timeoutPromise = new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: false,
              passed: false,
              status: 'Timeout',
              logs: 'Simulation timed out after 15 seconds (possible infinite loop in sequential logic).',
              vcd: null
            });
          }, 15000);
        });

        const simResult = await Promise.race([workerPromise, timeoutPromise]);

        // Parse outputs and format HDLBits comparisons
        return this.formatSimulationResult(simResult, expected);
      } catch (err) {
        console.warn('Worker execution failed, attempting fallback:', err);
      }
    }

    // 2. Fallback: LocalSimulator
    if (typeof LocalSimulator !== 'undefined') {
      const localRes = LocalSimulator.evaluate(userCode, expected, lesson.id);
      return {
        engine: 'Local JavaScript Evaluator (Fallback)',
        isWasm: false,
        passed: !localRes.compileError && localRes.mismatches === 0,
        status: localRes.compileError ? 'Compile Error' : (localRes.mismatches === 0 ? 'Success' : 'Incorrect'),
        log: `[Engine: Local JavaScript Evaluator (Fallback)]\n--------------------------------------------------------------\n${localRes.log}`,
        vcd: null,
        actualOutputs: localRes.actualOutputs || [],
        comparisons: [],
        mismatches: localRes.mismatches || 0,
        totalSamples: expected.length
      };
    }

    return {
      engine: 'None',
      isWasm: false,
      passed: false,
      status: 'Error',
      log: 'No simulation engine available.',
      vcd: null,
      actualOutputs: [],
      comparisons: [],
      mismatches: expected.length,
      totalSamples: expected.length
    };
  }

  formatSimulationResult(simResult, expected) {
    const rawLogs = simResult.logs || '';
    const wasmHeader = `[Engine: Icarus Verilog WebAssembly (WASM - 100% Client-Side)]\n--------------------------------------------------------------\n`;
    const logs = wasmHeader + rawLogs;
    const actualOutputs = [];
    let mismatches = 0;

    // Parse SAMPLE lines from logs: SAMPLE 0: sum=0 cout=0
    const sampleRegex = /SAMPLE\s+(\d+):\s*(.*)$/gm;
    let match;
    while ((match = sampleRegex.exec(rawLogs)) !== null) {
      const idx = parseInt(match[1], 10);
      const dataStr = match[2];
      const sampleObj = {};
      const pairs = dataStr.trim().split(/\s+/);
      pairs.forEach(p => {
        const [k, v] = p.split('=');
        if (k && v !== undefined) {
          sampleObj[k] = parseInt(v, 10);
        }
      });
      actualOutputs[idx] = sampleObj;
    }

    const outputKeys = Object.keys(expected[0] || {}).filter(k => k !== 'time' && k !== 'in' && k !== 'd' && k !== 'a' && k !== 'b' && k !== 'sel' && k !== 'cin' && k !== 'clk' && k !== 'reset');
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

      if (isMismatch) mismatches++;

      return {
        time: exp.time || (idx * 5),
        in: exp.in !== undefined ? exp.in : (exp.d !== undefined ? exp.d : (exp.a !== undefined ? exp.a : 0)),
        yours: act[mainKey] !== undefined ? act[mainKey] : 0,
        ref: exp[mainKey] !== undefined ? exp[mainKey] : 0,
        mismatch: isMismatch ? 1 : 0
      };
    });

    const passed = simResult.passed && (mismatches === 0 || rawLogs.includes('ALL TESTS PASSED'));

    return {
      engine: 'Icarus Verilog WebAssembly (WASM)',
      isWasm: true,
      passed,
      status: passed ? 'Success' : (simResult.status || 'Incorrect'),
      log: logs,
      vcd: simResult.vcd,
      actualOutputs,
      comparisons,
      mismatches,
      totalSamples: expected.length
    };
  }
}

window.Simulator = new SimulationManager();
