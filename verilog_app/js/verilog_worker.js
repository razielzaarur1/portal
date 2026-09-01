/* ==========================================================================
   VeriLearn WebAssembly Icarus Verilog Worker (verilog_worker.js)
   Runs ivlpp -> ivl -> vvp entirely in the browser via WebAssembly (100% Client-Side).
   ========================================================================== */

import initIvlpp from '../wasm/ivlpp.js';
import initIvl   from '../wasm/ivl.js';
import initVvp   from '../wasm/vvp.js';

// Cache WASM binary ArrayBuffers in Worker memory for blazing fast repeated compilations
const wasmCache = {};

async function loadWasmBinary(name) {
  if (wasmCache[name]) {
    return wasmCache[name];
  }

  // Resolve absolute URL reliably across all browser / mobile / iframe environments
  const wasmUrl = new URL(`../wasm/${name}`, import.meta.url).href;
  
  try {
    const res = await fetch(wasmUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} while fetching ${wasmUrl}`);
    }
    const buf = await res.arrayBuffer();
    wasmCache[name] = buf;
    return buf;
  } catch (err) {
    throw new Error(`Failed to load WebAssembly binary ${name} from ${wasmUrl}: ${err && err.message ? err.message : err}`);
  }
}

function sanitize(str) {
  if (!str) return '';
  return str.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
            .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"');
}

const ivlConf = (generation = '2012') => `basedir:/
module:system.vpi
generation:${generation}
generation:no-specify
out:/out.vvp
iwidth:32
widthcap:65536
functor:cprop
functor:nodangle
flag:DLL=vvp.tgt
`;

async function runPreprocessing(files) {
  const wasmBinary = await loadWasmBinary('ivlpp.wasm');
  const code = [];
  const m = await initIvlpp({
    wasmBinary,
    print: s => code.push(s),
    printErr: () => {}
  });

  const args = ['-L'];
  for (const f of files) {
    const filename = '/' + f.name;
    const content = f.src.endsWith('\n') ? f.src : f.src + '\n';
    m.FS.writeFile(filename, content);
    args.push(filename);
  }

  m.callMain(args);
  return code.join('\n') + '\n';
}

async function runCompilation(preprocessedSrc, generation = '2012') {
  const wasmBinary = await loadWasmBinary('ivl.wasm');
  const err = [];
  const m = await initIvl({
    wasmBinary,
    print: () => {},
    printErr: s => err.push(s)
  });

  m.FS.writeFile('/ivl.conf', ivlConf(generation));
  m.FS.writeFile('/src.v', preprocessedSrc);
  m.callMain(['-C/ivl.conf', '--', '/src.v']);

  let vvp = null;
  try {
    vvp = m.FS.readFile('/out.vvp');
  } catch (e) {
    // Compile error
  }

  const cleanErr = err.filter(l => !/system\.vpi|dynamic linking not enabled/.test(l)).join('\n');
  return { vvp, err: cleanErr };
}

async function runSimulation(vvpBytes) {
  const wasmBinary = await loadWasmBinary('vvp.wasm');
  const out = [];
  const m = await initVvp({
    wasmBinary,
    print: s => out.push(s),
    printErr: s => out.push(s)
  });

  m.FS.writeFile('/sim.vvp', vvpBytes);
  m.callMain(['/sim.vvp']);

  let vcd = null;
  try {
    vcd = m.FS.readFile('/dump.vcd', { encoding: 'utf8' });
  } catch (e) {
    // VCD optional
  }

  return {
    out: out.join('\n'),
    vcd
  };
}

self.onmessage = async function(e) {
  const { id, userCode, testbenchCode, dependencies = [], generation = '2012' } = e.data;

  try {
    self.postMessage({ id, type: 'status', message: 'Preprocessing Verilog sources...' });

    const files = [];

    // 1. Add all dependency helper modules (building blocks)
    for (const dep of dependencies) {
      if (dep && dep.name && dep.code) {
        files.push({ name: dep.name.endsWith('.v') ? dep.name : `${dep.name}.v`, src: sanitize(dep.code) });
      }
    }

    // 2. Add user design code
    files.push({ name: 'design.v', src: sanitize(userCode) });

    // 3. Add testbench code
    files.push({ name: 'tb.v', src: sanitize(testbenchCode) });

    const preprocessed = await runPreprocessing(files);

    self.postMessage({ id, type: 'status', message: 'Compiling with Icarus Verilog WASM (SystemVerilog-2012)...' });
    const compResult = await runCompilation(preprocessed, generation);

    if (!compResult.vvp) {
      self.postMessage({
        id,
        type: 'result',
        success: false,
        passed: false,
        status: 'Compile Error',
        logs: compResult.err || 'Compilation failed with syntax or elaboration errors.',
        vcd: null
      });
      return;
    }

    self.postMessage({ id, type: 'status', message: 'Running simulation with VVP runtime...' });
    const simResult = await runSimulation(compResult.vvp);

    const fullLogs = [
      compResult.err ? `[COMPILER WARNINGS]\n${compResult.err}\n` : '',
      simResult.out
    ].filter(Boolean).join('\n');

    // Parse pass/fail status
    const hasFailKeyword = /\[TEST FAILED\]|FAIL|MISMATCH|Error:|error:/i.test(simResult.out) && !/Errors:\s*0/i.test(simResult.out);
    const hasPassKeyword = /ALL TESTS PASSED|\[TEST PASSED\]|Verification Successful|PASSED/i.test(simResult.out);
    const passed = hasPassKeyword && !hasFailKeyword;

    self.postMessage({
      id,
      type: 'result',
      success: true,
      passed,
      status: passed ? 'Success' : 'Incorrect',
      logs: fullLogs,
      vcd: simResult.vcd
    });

  } catch (err) {
    self.postMessage({
      id,
      type: 'result',
      success: false,
      passed: false,
      status: 'Engine Error',
      logs: `Simulation Worker Error:\n${err && err.message ? err.message : err}`,
      vcd: null
    });
  }
};
