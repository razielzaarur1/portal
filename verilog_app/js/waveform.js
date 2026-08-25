/* ==========================================================================
   VeriLearn HDLBits Style Timing Diagram Viewer
   Renders:
     - Yours (User output signal)
     - Ref (Reference expected signal)
     - Mismatch (0 = correct, 1 = mismatch in red)
     - Time axis timeline underneath
   ========================================================================== */

class WaveformRenderer {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  render(comparisons) {
    if (!this.container) return;
    if (!comparisons || comparisons.length === 0) {
      this.clear();
      return;
    }

    const yoursData = comparisons.map(c => ({ time: c.time, val: c.yours }));
    const refData = comparisons.map(c => ({ time: c.time, val: c.ref }));
    const mismatchData = comparisons.map(c => ({ time: c.time, val: c.mismatch }));

    const html = `
      <div class="hdlbits-timing-container" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: var(--radius-md); padding: var(--space-md); font-family: var(--font-family-sans); overflow-x: auto;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: var(--space-xs);">Timing diagrams for selected test cases</h4>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: var(--space-md); line-height: 1.4;">
          These are timing diagrams from the test cases. They compare your circuit output (<strong>Yours</strong>) against the expected reference output (<strong>Ref</strong>). The <strong>Mismatch</strong> trace shows cycle errors (0 = correct, 1 = incorrect).
        </p>

        <div class="timing-diagram-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); padding: var(--space-md); min-width: 320px;">
          <!-- Signal 1: Yours -->
          ${this.renderSignalRow('Yours', yoursData, '#2563eb')}

          <!-- Signal 2: Ref -->
          ${this.renderSignalRow('Ref', refData, '#2563eb')}

          <!-- Signal 3: Mismatch -->
          ${this.renderSignalRow('Mismatch', mismatchData, '#ef4444', true)}

          <!-- Time Axis -->
          <div style="display: flex; align-items: center; margin-top: var(--space-sm); padding-inline-start: 70px;">
            ${comparisons.map(c => `
              <div style="flex: 1; min-width: 45px; text-align: center; font-family: var(--font-family-mono); font-size: 0.7rem; color: #64748b;">
                ${c.time}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  renderSignalRow(label, data, color, isMismatch = false) {
    return `
      <div style="display: flex; align-items: center; margin-bottom: var(--space-xs);">
        <div style="width: 70px; font-family: var(--font-family-sans); font-size: 0.82rem; font-weight: 700; color: ${isMismatch ? '#ef4444' : '#1e293b'};">
          ${label}
        </div>
        <div style="flex: 1; display: flex; align-items: center; background: #ffffff; height: 32px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 0 2px;">
          ${data.map((pt, idx) => {
            const high = pt.val === 1;
            const lineColor = high && isMismatch ? '#ef4444' : color;

            return `
              <div style="flex: 1; min-width: 45px; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; border-inline-end: 1px solid #e2e8f0;">
                <div style="width: 100%; height: 2px; background: ${lineColor}; position: absolute; ${high ? 'top: 6px;' : 'bottom: 6px;'}"></div>
                ${idx > 0 && data[idx-1].val !== pt.val ? `<div style="position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; background: ${lineColor};"></div>` : ''}
                <span style="font-size: 0.72rem; font-family: var(--font-family-mono); font-weight: 600; color: ${high && isMismatch ? '#ef4444' : '#334155'}; z-index: 1;">
                  ${pt.val}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

window.WaveformRenderer = WaveformRenderer;
