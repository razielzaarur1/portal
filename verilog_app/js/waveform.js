/* ==========================================================================
   VeriLearn Waveform & VCD Timing Diagram Engine (waveform.js)
   Supports:
     - Real VCD Parsing ($timescale, $var, $scope, transitions)
     - Multi-signal Interactive Digital Waveform Viewer (Zoom, Pan, Fit, Cursor)
     - HDLBits Comparison Diagrams (Yours vs Ref vs Mismatch)
   ========================================================================== */

function parseVCD(text) {
  if (!text || typeof text !== 'string') return null;

  const vars = {};
  const order = [];
  const scope = [];
  let t = 0;
  let defs = true;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (defs) {
      if (line.startsWith('$scope')) {
        const parts = line.split(/\s+/);
        if (parts[2]) scope.push(parts[2]);
        continue;
      }
      if (line.startsWith('$upscope')) {
        scope.pop();
        continue;
      }
      if (line.startsWith('$var')) {
        const p = line.split(/\s+/);
        const width = parseInt(p[2], 10) || 1;
        const id = p[3];
        const nm = p[4];
        const range = (p[5] && p[5][0] === '[') ? ' ' + p[5] : '';
        const full = (scope.length ? scope.join('.') + '.' : '') + nm + range;
        if (!vars[id]) {
          vars[id] = { name: full, width, vals: [] };
          order.push(id);
        }
        continue;
      }
      if (line.startsWith('$enddefinitions')) {
        defs = false;
        continue;
      }
      continue;
    }

    if (line[0] === '#') {
      t = parseInt(line.slice(1), 10) || 0;
      continue;
    }
    if (line[0] === '$') continue;

    let id, val;
    if ('bBrR'.includes(line[0])) {
      const sp = line.indexOf(' ');
      if (sp > 0) {
        val = line.slice(1, sp);
        id = line.slice(sp + 1).trim();
      } else {
        val = line.slice(1);
        id = '';
      }
    } else {
      val = line[0];
      id = line.slice(1).trim();
    }

    if (vars[id]) {
      const a = vars[id].vals;
      if (!a.length || a[a.length - 1][1] !== val) {
        a.push([t, val]);
      }
    }
  }

  const tm = text.match(/\$timescale\s+(\d+)\s*(s|ms|us|ns|ps|fs)/);
  const exp = { s: 0, ms: -3, us: -6, ns: -9, ps: -12, fs: -15 };
  const tsSec = tm ? parseInt(tm[1], 10) * Math.pow(10, exp[tm[2]] || -9) : null;

  return { vars, order, tmax: t || 1, tsSec };
}

function binToHex(b) {
  if (/[xz]/i.test(b)) return /x/i.test(b) ? 'X' : 'Z';
  let s = b;
  while (s.length % 4) s = '0' + s;
  let h = '';
  for (let i = 0; i < s.length; i += 4) {
    h += parseInt(s.substr(i, 4), 2).toString(16);
  }
  return '0x' + h.toUpperCase().replace(/^0+(?=.)/, '');
}

class WaveformRenderer {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.vcdData = null;
    this.selectedSignals = [];
    this.cursorTime = null;
    this.viewScale = 1.0;
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.vcdData = null;
    this.selectedSignals = [];
  }

  /**
   * Render either from VCD text or from HDLBits comparisons
   */
  render(comparisonsOrVcd) {
    if (!this.container) return;

    if (typeof comparisonsOrVcd === 'string' && comparisonsOrVcd.includes('$enddefinitions')) {
      this.renderVcd(comparisonsOrVcd);
      return;
    }

    if (Array.isArray(comparisonsOrVcd)) {
      this.renderComparisons(comparisonsOrVcd);
      return;
    }

    this.clear();
  }

  renderVcd(vcdText) {
    this.vcdData = parseVCD(vcdText);
    if (!this.vcdData || this.vcdData.order.length === 0) {
      this.container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">אין גלים זמינים / No waveform data</div>';
      return;
    }

    // Default: select top-level or uut signals
    this.selectedSignals = this.vcdData.order.filter(id => {
      const name = this.vcdData.vars[id].name;
      return !name.includes('sample_idx') && !name.includes('error_count');
    });

    this.drawVcdView();
  }

  drawVcdView() {
    if (!this.container || !this.vcdData) return;
    const { vars, order, tmax } = this.vcdData;

    const rowHtml = this.selectedSignals.map(id => {
      const v = vars[id];
      const name = v.name.replace(/^tb\./, '').replace(/^uut\./, '');
      const isBus = v.width > 1;

      // Draw SVG wave trace for this signal
      const points = [];
      const vals = v.vals;
      const totalT = Math.max(tmax, 1);

      let curVal = '0';
      let svgSegments = '';

      for (let i = 0; i < vals.length; i++) {
        const [time, val] = vals[i];
        const nextTime = i + 1 < vals.length ? vals[i + 1][0] : totalT;
        const x1Pct = (time / totalT) * 100;
        const x2Pct = (nextTime / totalT) * 100;
        const widthPct = Math.max(x2Pct - x1Pct, 0.5);

        if (!isBus) {
          const isHigh = val === '1';
          const yPos = isHigh ? '6px' : '22px';
          const color = isHigh ? '#2563eb' : '#64748b';
          svgSegments += `
            <div style="position: absolute; left: ${x1Pct}%; width: ${widthPct}%; height: 2px; top: ${yPos}; background: ${color};"></div>
            ${i > 0 ? `<div style="position: absolute; left: ${x1Pct}%; width: 2px; top: 6px; height: 18px; background: #2563eb;"></div>` : ''}
          `;
        } else {
          // Bus rendering: hexagonal / shaded block with value
          const hexVal = binToHex(val);
          svgSegments += `
            <div style="position: absolute; left: ${x1Pct}%; width: ${widthPct}%; height: 20px; top: 5px; background: #e0e7ff; border: 1px solid #6366f1; border-radius: 2px; display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 0.68rem; font-family: var(--font-family-mono); color: #1e1b4b; padding: 0 4px;">
              ${hexVal}
            </div>
          `;
        }
      }

      return `
        <div style="display: flex; align-items: center; margin-bottom: 6px; height: 32px;">
          <div style="width: 140px; font-family: var(--font-family-mono); font-size: 0.8rem; font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding-right: 8px;" title="${v.name}">
            ${name} ${isBus ? `[${v.width-1}:0]` : ''}
          </div>
          <div style="flex: 1; position: relative; height: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden;">
            ${svgSegments}
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="hdlbits-timing-container" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: var(--radius-md); padding: var(--space-md); font-family: var(--font-family-sans); overflow-x: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">סימולציית גלים מלאה (WebAssembly VCD Waveforms)</h4>
          <span style="font-size: 0.75rem; font-family: var(--font-family-mono); color: var(--accent-primary); background: #eff6ff; padding: 2px 8px; border-radius: 4px;">T_max: ${tmax} ns</span>
        </div>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: var(--space-md); line-height: 1.4;">
          דיאגרמת הגלים המקורית שחולצה מתוך <code dir="ltr">dump.vcd</code> של סימולטור Icarus Verilog.
        </p>
        <div style="min-width: 480px; padding: 8px 0;">
          ${rowHtml}
        </div>
      </div>
    `;
  }

  renderComparisons(comparisons) {
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

window.parseVCD = parseVCD;
window.WaveformRenderer = WaveformRenderer;
