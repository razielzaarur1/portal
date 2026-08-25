/* ==========================================================================
   VeriLearn Curriculum — Chapter 5: Procedural Blocks & Always (Lessons 32 to 39)
   ========================================================================== */

(function() {
  const chapter5Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 32: Combinational always @(*) Block
    // --------------------------------------------------------------------------
    {
      id: 32,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "בלוק צירופי always @(*) ומשתני reg ⚙️",
      titleEn: "Combinational always @(*) & reg",

      explanationHe: `
<h3>1. מהו בלוק פרוצדורלי <code dir="ltr">always @(*)</code>? ⚩️</h3>
<p>עד כה השתמשנו בהוראת <code dir="ltr">assign</code> לחיבור חוטים. ב-Verilog קיימת דרך נוספת ועוצמתית לתיאור מעגלים: <strong>בלוק פרוצדורלי</strong>.</p>
<p>בלוק <code dir="ltr">always @(*)</code> הוא בלוק <strong>צירופי</strong> שמחשב מחדש את הפלט בכל פעם שמשתנה אחד מאותות הכניסה.</p>
<pre dir="ltr"><code>always @(*) begin
    // logic here, re-evaluated on any input change
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מתי משתמשים ב-<code dir="ltr">always @(*)</code> ולא ב-<code dir="ltr">assign</code>? 🔄</h3>
<p>לכל דבר פשוט (AND, OR, NOT, חיבור ישיר) — <code dir="ltr">assign</code> עובד מצוין.<br>
כשצריך <strong>לוגיקת if-else</strong> או <strong>case</strong> — חייבים להשתמש ב-<code dir="ltr">always</code> ולהגדיר את הפלט כ-<code dir="ltr">reg</code>.</p>
<ul>
  <li><code dir="ltr">assign</code>: כותבים לפלט מסוג <code dir="ltr">wire</code></li>
  <li><code dir="ltr">always @(*)</code>: כותבים לפלט מסוג <code dir="ltr">reg</code></li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. כלל: הקצאה בלוקית vs. רציפה 💡</h3>
<p>בתוך <code dir="ltr">always @(*)</code> משתמשים ב-<strong>הקצאה בלוקית</strong> (Blocking Assignment) עם <code dir="ltr">=</code>:</p>
<pre dir="ltr"><code>// Inside always @(*) - use blocking =
out = a & b;</code></pre>
<p><strong>שימו לב:</strong> <code dir="ltr">always @(*)</code> מסונתז למעגל צירופי בדיוק כמו <code dir="ltr">assign</code>, רק עם יכולות נוספות.</p>
`,

      explanationEn: `
<h3>1. What is a Combinational <code dir="ltr">always @(*)</code> Block? ⚩️</h3>
<p>The <code dir="ltr">always @(*)</code> block describes combinational logic that re-evaluates automatically whenever any input signal changes.</p>
<pre dir="ltr"><code>always @(*) begin
    out = a & b; // re-evaluated on every input change
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. When to Use <code dir="ltr">always @(*)</code> vs. <code dir="ltr">assign</code>? 🔄</h3>
<p>For simple expressions (AND, OR, NOT), <code dir="ltr">assign</code> works fine.<br>
When you need <strong>if-else</strong> or <strong>case</strong> branching — you must use <code dir="ltr">always @(*)</code> with an <code dir="ltr">output reg</code>.</p>
<ul>
  <li><code dir="ltr">assign</code>: drives <code dir="ltr">wire</code> outputs</li>
  <li><code dir="ltr">always @(*)</code>: drives <code dir="ltr">reg</code> outputs</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Blocking Assignment Rule 💡</h3>
<p>Inside <code dir="ltr">always @(*)</code>, use <strong>blocking assignments</strong> with <code dir="ltr">=</code>:</p>
<pre dir="ltr"><code>always @(*) begin
    out = a & b; // blocking: evaluates immediately in order
end</code></pre>
<p><strong>Note:</strong> An <code dir="ltr">always @(*)</code> block synthesizes to the exact same combinational hardware as <code dir="ltr">assign</code>, but allows richer logic constructs.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code> ו-<code dir="ltr">b</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו בבלוק <code dir="ltr">always @(*)</code> כדי לבצע פעולת AND בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code> ולהקצות ל-<code dir="ltr">out</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, and output <code dir="ltr">output reg out</code>.
Use a combinational <code dir="ltr">always @(*)</code> block to procedurally assign <code dir="ltr">out = a & b;</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output reg out
);
    // כתוב את בלוק ה-always @(*) כאן / Write your always @(*) block here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output reg out
);
    always @(*) begin
        out = a & b;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out: 0 },
        { time: 5, a: 1, b: 1, out: 1 }
      ],

      hints: {
        he: "פתחו בלוק always @(*) begin out = a & b; end",
        en: "Use an always @(*) begin out = a & b; end block"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 33: reg vs wire deep-dive
    // --------------------------------------------------------------------------
    {
      id: 33,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "הבדלים עמוקים בין reg ל-wire 🔍",
      titleEn: "Deep-Dive: reg vs wire Types",

      explanationHe: `
<h3>1. reg מול wire בחומרה 🔍</h3>
<p>ב-Verilog קיימים שני סוגי נתונים עיקריים:</p>
<ul>
  <li><code dir="ltr">wire</code>: מייצג <strong>חיבור פיזי רציף</strong> — כמו חוט נחושת. נכתב ע"י <code dir="ltr">assign</code>. ערכו תמיד נקבע ע"י המקור המחובר.</li>
  <li><code dir="ltr">reg</code>: מייצג <strong>משתנה</strong> שמקבל הקצאות בתוך בלוקים פרוצדורליים (<code dir="ltr">always</code> / <code dir="ltr">initial</code>). <em>לא</em> בהכרח אוגר (register) בחומרה!</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. כלל השימוש 💡</h3>
<table style="width:100%; font-size: 0.85rem; border-collapse: collapse;">
  <tr style="background: rgba(99,102,241,0.1);">
    <th style="padding: 6px; text-align: left;">מצב</th>
    <th style="padding: 6px; text-align: left;">סוג הפלט</th>
    <th style="padding: 6px; text-align: left;">דרך ההקצאה</th>
  </tr>
  <tr>
    <td style="padding: 6px;">חיבור ישיר / ביטוי</td>
    <td style="padding: 6px;"><code dir="ltr">wire</code></td>
    <td style="padding: 6px;"><code dir="ltr">assign</code></td>
  </tr>
  <tr style="background: rgba(99,102,241,0.05);">
    <td style="padding: 6px;">if-else / case / אוגר</td>
    <td style="padding: 6px;"><code dir="ltr">reg</code></td>
    <td style="padding: 6px;"><code dir="ltr">always</code></td>
  </tr>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמאות 📚</h3>
<pre dir="ltr"><code>// Using wire + assign
wire out_wire;
assign out_wire = a & b;

// Using reg + always (same hardware!)
reg out_reg;
always @(*) begin
    out_reg = a & b;
end</code></pre>
<p>שתי הגישות מייצרות <strong>אותו מעגל AND</strong>. ההבדל הוא תחבירי בלבד.</p>
`,

      explanationEn: `
<h3>1. reg vs wire Data Types 🔍</h3>
<p>Verilog has two primary data type categories:</p>
<ul>
  <li><code dir="ltr">wire</code>: a <strong>continuous physical connection</strong> — like a copper track. Driven by <code dir="ltr">assign</code> or module output ports. Always reflects the source value.</li>
  <li><code dir="ltr">reg</code>: a <strong>procedural variable</strong> that holds a value and can be assigned inside <code dir="ltr">always</code> or <code dir="ltr">initial</code> blocks. Despite the name, it does <em>not</em> necessarily synthesize to a hardware register!</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Golden Rule 💡</h3>
<table style="width:100%; font-size: 0.85rem; border-collapse: collapse;">
  <tr style="background: rgba(99,102,241,0.1);">
    <th style="padding: 6px; text-align: left;">Situation</th>
    <th style="padding: 6px; text-align: left;">Output Type</th>
    <th style="padding: 6px; text-align: left;">Assignment Style</th>
  </tr>
  <tr>
    <td style="padding: 6px;">Direct connection / expression</td>
    <td style="padding: 6px;"><code dir="ltr">wire</code></td>
    <td style="padding: 6px;"><code dir="ltr">assign</code></td>
  </tr>
  <tr style="background: rgba(99,102,241,0.05);">
    <td style="padding: 6px;">if-else / case / clocked</td>
    <td style="padding: 6px;"><code dir="ltr">reg</code></td>
    <td style="padding: 6px;"><code dir="ltr">always</code></td>
  </tr>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Comparison Example 📚</h3>
<pre dir="ltr"><code>// wire + assign approach
wire out_wire;
assign out_wire = a & b;

// reg + always approach (IDENTICAL hardware!)
reg out_reg;
always @(*) begin
    out_reg = a & b;
end</code></pre>
<p>Both produce the <strong>same AND gate</strong>. The difference is purely syntactic.</p>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסה <code dir="ltr">in</code> ויציאה <code dir="ltr">output reg out</code>.
הקצו <code dir="ltr">out = in;</code> בתוך בלוק <code dir="ltr">always @(*)</code>.`,
      taskEn: `Build <code dir="ltr">top_module</code> with input <code dir="ltr">in</code> and output <code dir="ltr">output reg out</code>.
Assign <code dir="ltr">out = in;</code> inside an <code dir="ltr">always @(*)</code> block.`,

      starterCode: `module top_module (
    input in,
    output reg out
);
    // כתוב את ההקצאה בתוך always כאן / Write always block assignment here

endmodule`,

      solutionCode: `module top_module (
    input in,
    output reg out
);
    always @(*) begin
        out = in;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו ב-always @(*) begin out = in; end",
        en: "Use always @(*) begin out = in; end"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 34: Procedural If-Else
    // --------------------------------------------------------------------------
    {
      id: 34,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "משפטי התניה If-Else (בורר MUX) 🔀",
      titleEn: "Procedural If-Else Statements",

      explanationHe: `
<h3>1. משפטי if-else בחומרה 🔀</h3>
<p>משפט התניה <code dir="ltr">if-else</code> בתוך בלוק פרוצדורלי מסונתז בחומרה לבורר (Multiplexer / MUX).</p>
`,

      explanationEn: `
<h3>1. Procedural If-Else Logic 🔀</h3>
<p>Conditional <code dir="ltr">if-else</code> constructs inside <code dir="ltr">always</code> blocks synthesize into hardware multiplexers.</p>
`,

      taskHe: `בנו בורר MUX 2-ל-1 במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> ויציאה <code dir="ltr">output reg out</code>.
אם <code dir="ltr">sel == 1</code> הקצו <code dir="ltr">out = b;</code> אחרת <code dir="ltr">out = a;</code> בתוך בלוק צירופי.`,
      taskEn: `Build a 2-to-1 MUX inside <code dir="ltr">top_module</code> with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">output reg out</code>.
If <code dir="ltr">sel == 1</code> set <code dir="ltr">out = b;</code> else set <code dir="ltr">out = a;</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    // כתוב את לוגיקת ה-if-else כאן / Write if-else logic here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    always @(*) begin
        if (sel) begin
            out = b;
        end else begin
            out = a;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 1, sel: 0, out: 0 },
        { time: 5, a: 0, b: 1, sel: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו ב-if (sel) out = b; else out = a;",
        en: "Use if (sel) out = b; else out = a;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 35: Procedural Case
    // --------------------------------------------------------------------------
    {
      id: 35,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "משפט Case מרובה ענפים 🎛️",
      titleEn: "Procedural Case Statement",

      explanationHe: `
<h3>1. משפט case בחומרה 🎛️</h3>
<p>משפט <code dir="ltr">case</code> מציג מבנה נקי וקריא לבחירה בין קומבינציות מרובות.</p>
`,

      explanationEn: `
<h3>1. Procedural Case Selection 🎛️</h3>
<p>The <code dir="ltr">case</code> statement simplifies multi-way branching decoders.</p>
`,

      taskHe: `מימו MUX 2-ל-1 ע"י משפט <code dir="ltr">case (sel)</code> במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> ויציאה <code dir="ltr">output reg out</code>).
עבור <code dir="ltr">1'b0</code> הקצו <code dir="ltr">out = a;</code> ועבור <code dir="ltr">1'b1</code> הקצו <code dir="ltr">out = b;</code>.`,
      taskEn: `Implement a 2-to-1 MUX using <code dir="ltr">case (sel)</code> in <code dir="ltr">top_module</code> (inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">output reg out</code>).
For <code dir="ltr">1'b0</code> set <code dir="ltr">out = a;</code> and for <code dir="ltr">1'b1</code> set <code dir="ltr">out = b;</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    // כתוב את משפט ה-case כאן / Write case statement here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    always @(*) begin
        case (sel)
            1'b0: out = a;
            1'b1: out = b;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 1, sel: 0, out: 0 },
        { time: 5, a: 0, b: 1, sel: 1, out: 1 }
      ],

      hints: {
        he: "רשמו case (sel) 1'b0: out = a; 1'b1: out = b; endcase",
        en: "Write case (sel) 1'b0: out = a; 1'b1: out = b; endcase"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 36: casez & casex
    // --------------------------------------------------------------------------
    {
      id: 36,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "משפטי casez ו-casex (Don't Care) ❓",
      titleEn: "casez & casex Statements",

      explanationHe: `
<h3>1. תמיכה ב-Don't Care ❓</h3>
<p><code dir="ltr">casez</code> להתעלמות מביטי z ו-Don't Care (<code dir="ltr">?</code>).</p>
`,

      explanationEn: `
<h3>1. Don't Care Matching ❓</h3>
<p><code dir="ltr">casez</code> ignores high-impedance and don't care bits (<code dir="ltr">?</code>).</p>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסת 2-ביט <code dir="ltr">in</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו ב-case (in) עבור 2'b00 הקצו out = 0; עבור שאר המקרים out = 1;`,
      taskEn: `Build <code dir="ltr">top_module</code> with 2-bit input <code dir="ltr">in</code> and output <code dir="ltr">output reg out</code>.
Set out = 0 for 2'b00, else set out = 1.`,

      starterCode: `module top_module (
    input [1:0] in,
    output reg out
);
    // כתוב את ה-case כאן / Write case block here

endmodule`,

      solutionCode: `module top_module (
    input [1:0] in,
    output reg out
);
    always @(*) begin
        case (in)
            2'b00: out = 1'b0;
            default: out = 1'b1;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו ב-case (in) 2'b00: out = 0; default: out = 1; endcase",
        en: "Use case (in) 2'b00: out = 0; default: out = 1; endcase"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 37: Latch Prevention
    // --------------------------------------------------------------------------
    {
      id: 37,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "מניעת Latchים לא רצויים 🛑",
      titleEn: "Unintended Latch Prevention",

      explanationHe: `
<h3>1. מה זה Latch ולמה הוא בעייתי? 🛑</h3>
<p>כאשר כותבים בלוק <code dir="ltr">always @(*)</code> שאינו מכסה <strong>כל המצבים האפשריים</strong> של הקלט, הסינתיזה יוצרת <strong>Latch</strong> — רכיב שזוכר את ערכו הקודם. Latch לא רצוי הוא באג קלאסי בעיצוב חומרה.</p>
<p>דוגמה לבלוק שיוצר Latch (שגוי):</p>
<pre dir="ltr"><code>always @(*) begin
    if (sel) begin
        out = b; // if sel=0, out is never assigned → LATCH!
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הפתרון: הקצאת ברירת מחדל 💡</h3>
<p>הדרך הסטנדרטית למנוע Latch היא <strong>הקצאת ערך ברירת מחדל בשורה הראשונה של הבלוק</strong>. כך הפלט <em>תמיד</em> מקבל ערך, גם כשאף ענף if לא מתקיים:</p>
<pre dir="ltr"><code>always @(*) begin
    out = a;       // DEFAULT: out always gets a value first
    if (sel) begin
        out = b;   // override default only when sel=1
    end
end</code></pre>
<p>כעת כשהסינתיזה רואה שלכל מסלול יש הקצאה, היא יוצרת <strong>MUX טהור</strong> ולא Latch.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. חוק הזהב: כסה כל ענף! ✅</h3>
<p>בין אם משתמשים ב-<code dir="ltr">if-else</code> מלא, ב-<code dir="ltr">case</code> עם <code dir="ltr">default</code>, או בהקצאת ברירת מחדל — <strong>תמיד ודאו שהפלט מקבל ערך בכל נתיב אפשרי</strong> של הבלוק הצירופי.</p>
`,

      explanationEn: `
<h3>1. What is an Unintended Latch? 🛑</h3>
<p>When an <code dir="ltr">always @(*)</code> block does not assign a value to an output on <strong>every possible input combination</strong>, synthesis creates a <strong>latch</strong> — a memory element that retains its previous value. Unintended latches are a classic hardware bug.</p>
<p>Example that creates a latch (buggy code):</p>
<pre dir="ltr"><code>always @(*) begin
    if (sel) begin
        out = b; // if sel=0, out is never assigned → LATCH!
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Fix: Default Assignment 💡</h3>
<p>The standard solution is to <strong>assign a default value at the top of the always block</strong>. This guarantees the output always gets a value, even when no if-branch fires:</p>
<pre dir="ltr"><code>always @(*) begin
    out = a;       // DEFAULT: covers the "else" path implicitly
    if (sel) begin
        out = b;   // override when sel=1
    end
end</code></pre>
<p>Now synthesis sees that every path has an assignment and generates a clean <strong>2-to-1 MUX</strong>, not a latch.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Golden Rule: Cover Every Branch! ✅</h3>
<p>Whether using full <code dir="ltr">if-else</code>, a <code dir="ltr">case</code> with <code dir="ltr">default</code>, or a default assignment — always ensure <strong>every possible path through a combinational block assigns all outputs</strong>.</p>
`,

      taskHe: `במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> ויציאה <code dir="ltr">output reg out</code>), מנעו Latch ע"י הקצאת ברירת מחדל <code dir="ltr">out = a;</code> בראש הבלוק ולאחר מכן <code dir="ltr">if (sel) out = b;</code>.`,
      taskEn: `Inside <code dir="ltr">top_module</code> (inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">output reg out</code>), prevent latches by assigning <code dir="ltr">out = a;</code> at the top, followed by <code dir="ltr">if (sel) out = b;</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    // כתוב את הבלוק ללא Latch כאן / Write latch-free logic here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    always @(*) begin
        out = a;
        if (sel) begin
            out = b;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 1, sel: 0, out: 0 },
        { time: 5, a: 0, b: 1, sel: 1, out: 1 },
        { time: 10, a: 1, b: 0, sel: 0, out: 1 },
        { time: 15, a: 1, b: 0, sel: 1, out: 0 }
      ],

      hints: {
        he: "רשמו out = a; בראש הבלוק.",
        en: "Write out = a; at the top of the block."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 38: Verilog Function Blocks
    // --------------------------------------------------------------------------
    {
      id: 38,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "פונקציות צירופיות (function ... endfunction) 🧾",
      titleEn: "Verilog Function Blocks",

      explanationHe: `
<h3>1. מהי פונקציה (שיטת <code dir="ltr">function</code>) ב-Verilog? 🧾</h3>
<p>פונקציה (<code dir="ltr">function</code>) ב-Verilog היא יחידת קוד צירופית שמחזירה יציאה אחת ויכולה לקבל מספר קלטים. היא מפושטת קוד חוזר ומאפשרת שימוש חוזר (לדוגמה: פונקציית סיכום פריטים שנקראת בכמה מקומות).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר פונקציה 📚</h3>
<pre dir="ltr"><code>function [N-1:0] function_name;
    input [M-1:0] arg1;
    input [M-1:0] arg2;
    // ... combinational logic ...
    function_name = result_expression; // assign return value
endfunction</code></pre>
<p>כללי מפתח:
<ul>
  <li>אין <code dir="ltr">always</code> או <code dir="ltr">posedge</code> בתוך פונקציה (תמיד צירופית)</li>
  <li>היציאה נקראת ע"י שם הפונקציה: <code dir="ltr">function_name = result;</code></li>
  <li>קריאה לפונקציה: <code dir="ltr">assign out = my_func(a, b);</code></li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמא מעשית: פונקציית AND פשוטה 💡</h3>
<p>נכתוב פונקציה שמחשבת AND בין שני ביטים וחוברת אותה ליציאת המודול:</p>
<pre dir="ltr"><code>module top_module (
    input a,
    input b,
    output out
);
    // Declare the function
    function my_and;
        input x;
        input y;
        my_and = x & y; // return value
    endfunction

    // Use the function with assign
    assign out = my_and(a, b);
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is a Verilog <code dir="ltr">function</code> Block? 🧾</h3>
<p>A <code dir="ltr">function</code> in Verilog is a reusable, named block of combinational logic that accepts multiple inputs and returns a single value. Functions simplify code by eliminating repetition.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Function Syntax 📚</h3>
<pre dir="ltr"><code>function [N-1:0] function_name;
    input [M-1:0] arg1;
    input [M-1:0] arg2;
    // ... combinational logic ...
    function_name = result_expression; // this IS the return value
endfunction</code></pre>
<p>Key rules:
<ul>
  <li>No <code dir="ltr">always</code> or <code dir="ltr">posedge</code> inside a function (purely combinational)</li>
  <li>Return value: assign to the function's own name: <code dir="ltr">function_name = result;</code></li>
  <li>Call it: <code dir="ltr">assign out = my_func(a, b);</code></li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Practical Example: AND Function 💡</h3>
<p>Define a function that computes AND, then call it from an <code dir="ltr">assign</code>:</p>
<pre dir="ltr"><code>module top_module (
    input a,
    input b,
    output out
);
    function my_and;
        input x;
        input y;
        my_and = x & y; // return value
    endfunction

    assign out = my_and(a, b);
endmodule</code></pre>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code> ויציאה <code dir="ltr">out</code>.
הגדירו פונקציה <code dir="ltr">my_or</code> שמחשבת OR בין שני ביטים. חברו אותה אל היציאה עם <code dir="ltr">assign out = my_or(a, b);</code>.`,
      taskEn: `Build <code dir="ltr">top_module</code> with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code> and output <code dir="ltr">out</code>.
Define a <code dir="ltr">function my_or</code> that computes OR between two bits. Connect it to the output with <code dir="ltr">assign out = my_or(a, b);</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out
);
    // הגדר פונקציה my_or / Define function my_or here
    function my_or;
        input x;
        input y;
        // החזר OR של x ו-y / return x OR y
    endfunction

    assign out = my_or(a, b);
endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out
);
    function my_or;
        input x;
        input y;
        my_or = x | y;
    endfunction

    assign out = my_or(a, b);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out: 0 },
        { time: 5, a: 0, b: 1, out: 1 },
        { time: 10, a: 1, b: 0, out: 1 },
        { time: 15, a: 1, b: 1, out: 1 }
      ],

      hints: {
        he: "כתבו בתוך הפונקציה: my_or = x | y;",
        en: "Inside the function body, write: my_or = x | y;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 39: Combinational ALU Slice
    // --------------------------------------------------------------------------
    {
      id: 39,
      chapter: 5,
      chapterTitleHe: "פרק 5: בלוקים פרוצדורליים ו-Always",
      chapterTitleEn: "Chapter 5: Procedural Blocks & Always",
      titleHe: "יחידת חישוב צירופית (Combinational ALU Slice) 🧮",
      titleEn: "Combinational ALU Slice",

      explanationHe: `
<h3>1. יחידת חישוב צירופית 🧮</h3>
<p>יחידת ALU מקבלת אות נתונים ואות פעולה (<code dir="ltr">op</code>) ומבצעת חישוב חשבוני או לוגי.</p>
`,

      explanationEn: `
<h3>1. Combinational ALU Slice 🧮</h3>
<p>An ALU slice evaluates arithmetic or logical operations based on an opcode select line.</p>
`,

      taskHe: `בנו יחידת ALU 4-ביט במודול <code dir="ltr">top_module</code> בעלת כניסות 4-ביט <code dir="ltr">a</code>, <code dir="ltr">b</code>, אות op 1-ביט <code dir="ltr">op</code> ויציאת 4-ביט <code dir="ltr">output reg [3:0] out</code>.
- אם <code dir="ltr">op == 0</code> הקצו <code dir="ltr">out = a + b;</code>
- אם <code dir="ltr">op == 1</code> הקצו <code dir="ltr">out = a & b;</code>.`,
      taskEn: `Design a 4-bit ALU slice in <code dir="ltr">top_module</code> with 4-bit inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, 1-bit selector <code dir="ltr">op</code>, and 4-bit output <code dir="ltr">output reg [3:0] out</code>.
- If <code dir="ltr">op == 0</code> set <code dir="ltr">out = a + b;</code>
- If <code dir="ltr">op == 1</code> set <code dir="ltr">out = a & b;</code>.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input op,
    output reg [3:0] out
);
    // כתוב את ה-ALU כאן / Write ALU logic here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input op,
    output reg [3:0] out
);
    always @(*) begin
        if (op) begin
            out = a & b;
        end else begin
            out = a + b;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 3, b: 2, op: 0, out: 5 },
        { time: 5, a: 3, b: 2, op: 1, out: 2 }
      ],

      hints: {
        he: "בתוך הבלוק: if (op) out = a & b; else out = a + b;",
        en: "Inside block: if (op) out = a & b; else out = a + b;"
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter5Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter5Lessons);
  }
})();
