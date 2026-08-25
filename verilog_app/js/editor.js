/* ==========================================================================
   VeriLearn Mobile Code Editor & Verilog Snippets Toolbar
   ========================================================================== */

class VerilogEditor {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.initialCode = options.initialCode || '';
    this.onCodeChange = options.onChange || null;
    this.textarea = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    // Create Editor Wrapper with explicit LTR direction
    this.container.innerHTML = `
      <div class="editor-wrapper" dir="ltr">
        <!-- Editor Snippets Toolbar -->
        <div class="editor-toolbar" dir="ltr">
          <button class="snippet-btn" data-snippet="assign ">assign</button>
          <button class="snippet-btn" data-snippet="module ">module</button>
          <button class="snippet-btn" data-snippet="always @(*) begin\n    \nend">always @(*)</button>
          <button class="snippet-btn" data-snippet="always @(posedge clk) begin\n    \nend">always clk</button>
          <button class="snippet-btn" data-snippet="if () begin\n    \nend">if</button>
          <button class="snippet-btn" data-snippet="wire ">wire</button>
          <button class="snippet-btn" data-snippet="& ">&amp;</button>
          <button class="snippet-btn" data-snippet="| ">|</button>
          <button class="snippet-btn" data-snippet="~">~</button>
          <button class="snippet-btn" data-snippet="^ ">^</button>
          <button class="snippet-btn" data-snippet="; ">;</button>
        </div>

        <!-- Code Input Area -->
        <div class="editor-input-area" dir="ltr">
          <div class="line-numbers" id="line-numbers" dir="ltr">1</div>
          <textarea 
            id="verilog-code-input" 
            class="verilog-textarea" 
            dir="ltr"
            spellcheck="false" 
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off">${this.escapeHTML(this.initialCode)}</textarea>
        </div>
      </div>
    `;

    this.textarea = this.container.querySelector('#verilog-code-input');
    this.lineNumbersEl = this.container.querySelector('#line-numbers');

    this.bindEvents();
    this.updateLineNumbers();
  }

  bindEvents() {
    if (!this.textarea) return;

    // Update line numbers on input and scroll
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      if (this.onCodeChange) this.onCodeChange(this.getValue());
    });

    this.textarea.addEventListener('scroll', () => {
      if (this.lineNumbersEl) {
        this.lineNumbersEl.scrollTop = this.textarea.scrollTop;
      }
    });

    // Handle Tab key insertion
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.insertAtCursor('    ');
      }
    });

    // Snippets toolbar click handler
    this.container.querySelectorAll('.snippet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const snippet = btn.getAttribute('data-snippet');
        if (snippet) {
          this.insertAtCursor(snippet);
        }
      });
    });
  }

  updateLineNumbers() {
    if (!this.textarea || !this.lineNumbersEl) return;
    const lines = this.textarea.value.split('\n').length;
    let numbersHTML = '';
    for (let i = 1; i <= lines; i++) {
      numbersHTML += `<div>${i}</div>`;
    }
    this.lineNumbersEl.innerHTML = numbersHTML;
  }

  insertAtCursor(text) {
    if (!this.textarea) return;
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const val = this.textarea.value;

    this.textarea.value = val.substring(0, start) + text + val.substring(end);
    this.textarea.selectionStart = this.textarea.selectionEnd = start + text.length;
    this.textarea.focus();
    this.updateLineNumbers();

    if (this.onCodeChange) this.onCodeChange(this.getValue());
  }

  getValue() {
    return this.textarea ? this.textarea.value : '';
  }

  setValue(code) {
    if (!this.textarea) return;
    this.textarea.value = code;
    this.updateLineNumbers();
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.VerilogEditor = VerilogEditor;
