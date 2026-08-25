/* ==========================================================================
   VeriLearn Dynamic RTL Circuit Diagram Viewer
   Renders logic block schematic diagrams dynamically matching the user's code
   ========================================================================== */

class CircuitRenderer {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  }

  clear(isCompileError = false) {
    if (!this.container) return;
    if (isCompileError) {
      this.container.innerHTML = `
        <div class="circuit-box" style="background: #0d1117; border: 1px dashed #ef4444; border-radius: var(--radius-md); padding: var(--space-md); text-align: center; color: #ef4444; font-size: 0.85rem;">
          ⚠️ Schematic unavailable due to Compile Error
        </div>
      `;
    } else {
      this.container.innerHTML = '';
    }
  }

  render(userCode) {
    if (!this.container || !userCode) return;

    // 1. Parse Input & Output Signals from User's Code
    const inputMatches = [...userCode.matchAll(/input\s+(?:reg|wire)?\s*(?:\[[^\]]+\])?\s*([a-zA-Z0-9_,\s]+)/g)];
    const outputMatches = [...userCode.matchAll(/output\s+(?:reg|wire)?\s*(?:\[[^\]]+\])?\s*([a-zA-Z0-9_,\s]+)/g)];

    let inputs = [];
    inputMatches.forEach(m => {
      m[1].split(',').forEach(s => {
        const clean = s.trim();
        if (clean && !inputs.includes(clean)) inputs.push(clean);
      });
    });

    let outputs = [];
    outputMatches.forEach(m => {
      m[1].split(',').forEach(s => {
        const clean = s.trim();
        if (clean && !outputs.includes(clean)) outputs.push(clean);
      });
    });

    if (inputs.length === 0) inputs = ['in'];
    if (outputs.length === 0) outputs = ['out'];

    // 2. Detect User Logic Constructs
    const isSequential = userCode.includes('posedge') || userCode.includes('always @(posedge');
    const isMux = userCode.includes('case') || (userCode.includes('if') && userCode.includes('else'));
    const isAdder = userCode.includes('+') || userCode.includes('-');
    const isXor = userCode.includes('^');
    const isAnd = userCode.includes('&');
    const isOr = userCode.includes('|');
    const isNot = userCode.includes('~');

    let gateType = 'WIRE BUFFER';
    let gateSymbol = '── BUFFER ──';

    if (isSequential) {
      gateType = 'SEQUENTIAL REGISTER (D-FF)';
      gateSymbol = '[ D-FF ⏹ ]';
    } else if (isMux) {
      gateType = 'MULTIPLEXER (MUX)';
      gateSymbol = '[ MUX 🔀 ]';
    } else if (isAdder) {
      gateType = 'ARITHMETIC ADDER / ALU';
      gateSymbol = '[ ADDER + ]';
    } else if (isXor) {
      gateType = 'XOR / XNOR GATE';
      gateSymbol = '[ XOR ⊕ ]';
    } else if (isAnd) {
      gateType = 'AND / NAND GATE';
      gateSymbol = '[ AND & ]';
    } else if (isOr) {
      gateType = 'OR / NOR GATE';
      gateSymbol = '[ OR ≥1 ]';
    } else if (isNot) {
      gateType = 'NOT INVERTER';
      gateSymbol = '[ NOT 1 ]';
    }

    // 3. Render Synthesized RTL Schematic
    const html = `
      <div class="circuit-box" style="background: #0d1117; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-lg); text-align: center;">
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md); font-family: var(--font-family-mono); letter-spacing: 0.5px;">
          SYNTHESIZED RTL CIRCUIT SCHEMATIC (USER IMPLEMENTATION)
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: var(--space-md); margin: var(--space-lg) 0; flex-wrap: wrap;">
          <!-- User Inputs -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${inputs.map(inp => `
              <div style="padding: 4px 10px; background: rgba(99, 102, 241, 0.15); border: 1px solid var(--accent-primary); border-radius: var(--radius-sm); font-size: 0.8rem; font-family: var(--font-family-mono); color: var(--accent-primary);">
                ${inp}
              </div>
            `).join('')}
          </div>

          <!-- Connector Wires -->
          <div style="width: 25px; height: 2px; background: var(--accent-primary);"></div>

          <!-- Synthesized Logic Component -->
          <div style="padding: 12px 20px; background: var(--bg-card); border: 2px solid var(--accent-secondary); border-radius: var(--radius-md); font-family: var(--font-family-mono); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);">
            ${gateSymbol}
          </div>

          <!-- Connector Wires -->
          <div style="width: 25px; height: 2px; background: var(--accent-secondary);"></div>

          <!-- User Outputs -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${outputs.map(out => `
              <div style="padding: 4px 10px; background: rgba(6, 182, 212, 0.15); border: 1px solid var(--accent-secondary); border-radius: var(--radius-sm); font-size: 0.8rem; font-family: var(--font-family-mono); color: var(--accent-secondary);">
                ${out}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted);">
          RTL Synthesis Component: <strong style="color: var(--accent-primary);">${gateType}</strong>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}

window.CircuitRenderer = CircuitRenderer;
