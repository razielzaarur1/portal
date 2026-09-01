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
<h3>1. משפטי התניה if-else בחומרה 🔀</h3>
<p>בתוך בלוקים פרוצדורליים (<code dir="ltr">always @(*)</code>), משפט ההתניה <code dir="ltr">if-else</code> מאפשר לבחור איזה ערך להקצות לפלט בהתאם לתנאים לוגיים. בחומרה, משפט <code dir="ltr">if-else</code> מתורגם ישירות ל-<strong>מרבב (Multiplexer / MUX)</strong> בעל עדיפות (Priority Multiplexer).</p>

<pre dir="ltr"><code>always @(*) begin
    if (sel == 1'b1) begin
        out = in1;  // מתבצע כאשר sel=1
    end else begin
        out = in0;  // מתבצע כאשר sel=0
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. כללי תחביר חשובים ב-Verilog 📋</h3>
<ul>
  <li><strong>בלוקי begin / end:</strong> כאשר גוף התנאי מכיל יותר משורה אחת, חובה לתחום אותו ב-<code dir="ltr">begin</code> ו-<code dir="ltr">end</code> (מקביל ל-<code dir="ltr">{ }</code> ב-C/Java).</li>
  <li><strong>השמות חוסמות (<code dir="ltr">=</code>):</strong> בתוך בלוק צירופי <code dir="ltr">always @(*)</code>, משתמשים בהשמה חוסמת עם <code dir="ltr">=</code> כדי שהפקודות יתבצעו לפי סדר הקריאה.</li>
  <li><strong>כיסוי ענף ה-else:</strong> במעגל צירופי, <em>חובה</em> תמיד להגדיר ענף <code dir="ltr">else</code> מלא (או ערך ברירת מחדל), כדי שהחומרה לא תייצר Latch לא רצוי!</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. שרשור תנאים (if - else if - else) 🪜</h3>
<p>כאשר יש יותר משני מצבים, ניתן לשרשר תנאים. המבנה מייצר שרשרת מרבבים מדורגת שבה התנאי הראשון מקבל את הקדימות הגבוהה ביותר:</p>

<pre dir="ltr"><code>// מרבב 4 ל-1 באמצעות שרשרת if-else
always @(*) begin
    if (sel == 2'b00) begin
        out = in0;
    end else if (sel == 2'b01) begin
        out = in1;
    end else if (sel == 2'b10) begin
        out = in2;
    end else begin
        out = in3;
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. תרשים חומרה של MUX 2-ל-1 📐</h3>
<pre dir="ltr"><code>       +-------+
a ---->| 0     |
       |  MUX  |-----> out (output reg)
b ---->| 1     |
       +-------+
           ^
           |
          sel
</code></pre>
`,

      explanationEn: `
<h3>1. Procedural If-Else Logic 🔀</h3>
<p>Inside procedural blocks (<code dir="ltr">always @(*)</code>), the <code dir="ltr">if-else</code> conditional construct allows selecting which data to drive to an output based on Boolean conditions. In hardware, <code dir="ltr">if-else</code> synthesizes directly into a <strong>Multiplexer (MUX)</strong>.</p>

<pre dir="ltr"><code>always @(*) begin
    if (sel == 1'b1) begin
        out = in1;  // Evaluated when sel=1
    end else begin
        out = in0;  // Evaluated when sel=0
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Key Verilog Syntax Rules 📋</h3>
<ul>
  <li><strong>begin / end blocks:</strong> When a branch contains multiple statements, wrap them inside <code dir="ltr">begin</code> ... <code dir="ltr">end</code> (equivalent to <code dir="ltr">{ }</code> in C/Java).</li>
  <li><strong>Blocking assignments (<code dir="ltr">=</code>):</strong> Inside combinational <code dir="ltr">always @(*)</code> blocks, use blocking <code dir="ltr">=</code> assignments.</li>
  <li><strong>Complete else coverage:</strong> Always provide an <code dir="ltr">else</code> branch to avoid creating unintended latch memory.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Multi-Way Chaining (if - else if - else) 🪜</h3>
<p>For more than two cases, conditions can be chained to form a priority MUX tree:</p>

<pre dir="ltr"><code>always @(*) begin
    if (sel == 2'b00) begin
        out = in0;
    end else if (sel == 2'b01) begin
        out = in1;
    end else if (sel == 2'b10) begin
        out = in2;
    end else begin
        out = in3;
    end
end</code></pre>
`,

      taskHe: `בנו בורר MUX 2-ל-1 במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו בבלוק <code dir="ltr">always @(*)</code> ובמשפט <code dir="ltr">if-else</code>:
- כאשר <code dir="ltr">sel == 1'b1</code>: הקצו <code dir="ltr">out = b;</code>
- אחרת (<code dir="ltr">else</code>): הקצו <code dir="ltr">out = a;</code>`,

      taskEn: `Build a 2-to-1 MUX inside <code dir="ltr">top_module</code> with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">output reg out</code>.
Use a combinational <code dir="ltr">always @(*)</code> block and an <code dir="ltr">if-else</code> construct:
- When <code dir="ltr">sel == 1'b1</code>: assign <code dir="ltr">out = b;</code>
- Otherwise (<code dir="ltr">else</code>): assign <code dir="ltr">out = a;</code>`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    // כתבו את בלוק ה-always @(*) עם משפט if-else כאן
    // Write your always @(*) block with if-else construct here

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
        { time: 5, a: 0, b: 1, sel: 1, out: 1 },
        { time: 10, a: 1, b: 0, sel: 0, out: 1 },
        { time: 15, a: 1, b: 0, sel: 1, out: 0 }
      ],

      hints: {
        he: "פתחו בלוק always @(*) begin ובתוכו רשמו: if (sel) out = b; else out = a; בסיום סגרו ב-end.",
        en: "Open an always @(*) begin block, write: if (sel) out = b; else out = a; and close with end."
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
<h3>1. מהו משפט case ולמה הוא עדיף על if-else? 🎛️</h3>
<p>משפט <code dir="ltr">case</code> ב-Verilog מספק מבנה נקי, קריא ויעיל במיוחד לבחירה בין מספר רב של ערכים אפשריים. בעוד ששרשרת <code dir="ltr">if-else</code> ארוכה יוצרת היררכיית עדיפות מדורגת (Priority Chain) שעלולה להאט את המעגל, משפט <code dir="ltr">case</code> מסונתז ל-<strong>מרבב מקבילי טהור (Parallel MUX / Decoder)</strong> שבו כל הענפים מוערכים בו-זמנית ובמהירות מרבית.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה התחביר של case ב-Verilog 📐</h3>
<pre dir="ltr"><code>always @(*) begin
    case (selector_signal)
        val_0: out = data0;
        val_1: out = data1;
        val_2: begin
            // ניתן לתחום ב-begin/end אם יש מספר פקודות
            out = data2;
        end
        default: out = default_val; // חובה למניעת Latches!
    endcase
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמה מעשית: מרבב 4 ל-1 עם case 💻</h3>
<pre dir="ltr"><code>module mux_4to1_case (
    input [3:0] in,
    input [1:0] sel,
    output reg out
);
    always @(*) begin
        case (sel)
            2'b00: out = in[0];
            2'b01: out = in[1];
            2'b10: out = in[2];
            2'b11: out = in[3];
            default: out = 1'b0;
        endcase
    end
endmodule</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. קיבוץ מספר ערכים לאותו ענף 💡</h3>
<p>ב-Verilog ניתן להפריד מספר ערכים בפסיק כדי שיבצעו את אותה הפעולה בדיוק:</p>
<pre dir="ltr"><code>case (code)
    2'b01, 2'b10: is_middle = 1'b1;
    default:      is_middle = 1'b0;
endcase</code></pre>
`,

      explanationEn: `
<h3>1. Procedural Case Statement 🎛️</h3>
<p>The <code dir="ltr">case</code> statement provides a clean, highly readable, and efficient way to handle multi-way branching. While long <code dir="ltr">if-else</code> chains infer priority encoders, a <code dir="ltr">case</code> statement synthesizes into a <strong>parallel multiplexer / decoder</strong> where all options evaluate concurrently.</p>

<pre dir="ltr"><code>always @(*) begin
    case (sel)
        2'b00: out = in0;
        2'b01: out = in1;
        2'b10: out = in2;
        2'b11: out = in3;
        default: out = 1'b0; // Always include default!
    endcase
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Key Rules 📋</h3>
<ul>
  <li><strong>Exact matching:</strong> In standard <code dir="ltr">case</code>, bits are matched identically (0 matches 0, 1 matches 1).</li>
  <li><strong>Default branch:</strong> Always provide a <code dir="ltr">default:</code> branch to cover unhandled combinations and avoid unintended latch synthesis.</li>
  <li><strong>Comma-separated lists:</strong> Multiple values can trigger the same branch (e.g. <code dir="ltr">2'b01, 2'b10:</code>).</li>
</ul>
`,

      taskHe: `בנו בורר MUX 2-ל-1 במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו בבלוק <code dir="ltr">always @(*)</code> ובמשפט <code dir="ltr">case (sel)</code>:
- עבור <code dir="ltr">1'b0</code>: הקצו <code dir="ltr">out = a;</code>
- עבור <code dir="ltr">1'b1</code>: הקצו <code dir="ltr">out = b;</code>
- הוסיפו ענף <code dir="ltr">default: out = 1'b0;</code> וסגרו ב-<code dir="ltr">endcase</code>.`,

      taskEn: `Implement a 2-to-1 MUX using a <code dir="ltr">case (sel)</code> statement in <code dir="ltr">top_module</code> (inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">output reg out</code>).
- For <code dir="ltr">1'b0</code>: assign <code dir="ltr">out = a;</code>
- For <code dir="ltr">1'b1</code>: assign <code dir="ltr">out = b;</code>
- Add a <code dir="ltr">default: out = 1'b0;</code> branch and terminate with <code dir="ltr">endcase</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output reg out
);
    // כתבו את בלוק ה-always עם משפט case כאן
    // Write your always block with case statement here

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
            default: out = 1'b0;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 1, sel: 0, out: 0 },
        { time: 5, a: 0, b: 1, sel: 1, out: 1 },
        { time: 10, a: 1, b: 0, sel: 0, out: 1 },
        { time: 15, a: 1, b: 0, sel: 1, out: 0 }
      ],

      hints: {
        he: "בתוך הבלוק: case (sel) 1'b0: out = a; 1'b1: out = b; default: out = 1'b0; endcase",
        en: "Inside the block: case (sel) 1'b0: out = a; 1'b1: out = b; default: out = 1'b0; endcase"
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
      titleHe: "משפטי casez ו-casex (תמיכה ב-Don't Care) ❓",
      titleEn: "casez & casex Statements (Don't Care)",

      explanationHe: `
<h3>1. למה צריך Don't Care ומהו casez? ❓</h3>
<p>במשפט <code dir="ltr">case</code> רגיל, כל ביט מושווה במדויק (1 מושווה ל-1, ו-0 מושווה ל-0). עם זאת, במעגלים רבים (כגון <strong>מקודד קדימויות — Priority Encoder</strong> או פענוח כתובות חלקי), מעניין אותנו רק ערכם של חלק מהביטים, ולגבי שאר הביטים מתקיים מצב <strong>Don't Care</strong> (לא משנה אם הם '0' או '1').</p>

<p>משפט <strong><code dir="ltr">casez</code></strong> מאפשר להשתמש בתו <strong><code dir="ltr">?</code></strong> (או <code dir="ltr">z</code>) בתוך דפוסי ההשוואה, כאשר התו <code dir="ltr">?</code> מתאים (Matches) לכל ערך אפשרי!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמה קלאסית: מקודד קדימויות 4 ל-2 🥇</h3>
<p>מקודד קדימויות מקבל 4 אותות בקשה (<code dir="ltr">req[3:0]</code>) ומוציא את האינדקס של הבקשה הפעילה הגבוהה ביותר. אם <code dir="ltr">req[3] == 1</code>, כל שאר הביטים <code dir="ltr">req[2:0]</code> אינם משפיעים כלל:</p>

<pre dir="ltr"><code>always @(*) begin
    casez (req)
        4'b1???: grant = 2'd3; // אם req[3]=1, מתעלמים מ-req[2:0]
        4'b01??: grant = 2'd2; // אם req[3]=0 ו-req[2]=1, מתעלמים מ-req[1:0]
        4'b001?: grant = 2'd1; // אם req[3:2]=0 ו-req[1]=1, מתעלמים מ-req[0]
        4'b0001: grant = 2'd0; // אם רק req[0]=1
        default: grant = 2'd0; // אם אין אף בקשה פעילה
    endcase
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. ההבדל הקריטי בין casez ל-casex ⚠️</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
  <thead>
    <tr style="background: rgba(99,102,241,0.1); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 8px; text-align: right;">פקודה</th>
      <th style="padding: 8px; text-align: right;">מתעלם מ-</th>
      <th style="padding: 8px; text-align: right;">המלצת שימוש בתעשייה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;"><code dir="ltr">casez</code></td>
      <td style="padding: 8px;"><code dir="ltr">z</code> ו-<code dir="ltr">?</code> (High-Impedance / Don't Care)</td>
      <td style="padding: 8px; color: #10b981;"><strong>תקן מומלץ ובטוח (Industry Standard)</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px;"><code dir="ltr">casex</code></td>
      <td style="padding: 8px;"><code dir="ltr">z</code>, <code dir="ltr">?</code> וגם <strong><code dir="ltr">x</code></strong> (Unknown)</td>
      <td style="padding: 8px; color: #ef4444;">לא מומלץ (עלול להסתיר שגיאות אתחול ואיפוס בסימולציה)</td>
    </tr>
  </tbody>
</table>
`,

      explanationEn: `
<h3>1. Why Don't Care and casez? ❓</h3>
<p>Standard <code dir="ltr">case</code> performs exact binary bit matching. However, in designs like <strong>Priority Encoders</strong> or address decoders, only specific MSB bits matter while the remaining bits are in a <strong>Don't Care</strong> condition.</p>

<p>The <strong><code dir="ltr">casez</code></strong> construct treats the character <strong><code dir="ltr">?</code></strong> (and <code dir="ltr">z</code>) as wildcard / don't-care bits that match any incoming logic value (0 or 1).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Classic Example: 4-to-2 Priority Encoder 🥇</h3>
<pre dir="ltr"><code>always @(*) begin
    casez (req)
        4'b1???: grant = 2'd3; // Highest priority: bit 3 active
        4'b01??: grant = 2'd2; // Bit 2 active (when bit 3 is 0)
        4'b001?: grant = 2'd1; // Bit 1 active
        4'b0001: grant = 2'd0; // Bit 0 active
        default: grant = 2'd0;
    endcase
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. casez vs. casex ⚠️</h3>
<ul>
  <li><code dir="ltr">casez</code>: Treats only <code dir="ltr">z</code> and <code dir="ltr">?</code> as don't-care. <strong>Recommended industry best-practice</strong>.</li>
  <li><code dir="ltr">casex</code>: Also treats unknown <code dir="ltr">x</code> as don't care, which risks masking simulation initialization bugs.</li>
</ul>
`,

      taskHe: `בנו מקודד קדימויות 4-ביט במודול <code dir="ltr">top_module</code> בעל כניסת וקטור <code dir="ltr">in</code> [3:0] ויציאת וקטור <code dir="ltr">output reg [1:0] out</code>.
השתמשו בבלוק <code dir="ltr">always @(*)</code> ובמשפט <code dir="ltr">casez (in)</code> עם תווי Don't Care (<code dir="ltr">?</code>):
- כאשר <code dir="ltr">in[3] == 1</code> (<code dir="ltr">4'b1???</code>): הקצו <code dir="ltr">out = 2'd3;</code>
- כאשר <code dir="ltr">in[2] == 1</code> (<code dir="ltr">4'b01??</code>): הקצו <code dir="ltr">out = 2'd2;</code>
- כאשר <code dir="ltr">in[1] == 1</code> (<code dir="ltr">4'b001?</code>): הקצו <code dir="ltr">out = 2'd1;</code>
- כאשר <code dir="ltr">in[0] == 1</code> (<code dir="ltr">4'b0001</code>): הקצו <code dir="ltr">out = 2'd0;</code>
- אחרת (<code dir="ltr">default</code>): הקצו <code dir="ltr">out = 2'd0;</code>`,

      taskEn: `Build a 4-bit Priority Encoder in module <code dir="ltr">top_module</code> with input vector <code dir="ltr">in</code> [3:0] and output <code dir="ltr">output reg [1:0] out</code>.
Use a combinational <code dir="ltr">always @(*)</code> block and a <code dir="ltr">casez (in)</code> construct with Don't Care wildcards (<code dir="ltr">?</code>):
- When <code dir="ltr">in[3] == 1</code> (<code dir="ltr">4'b1???</code>): assign <code dir="ltr">out = 2'd3;</code>
- When <code dir="ltr">in[2] == 1</code> (<code dir="ltr">4'b01??</code>): assign <code dir="ltr">out = 2'd2;</code>
- When <code dir="ltr">in[1] == 1</code> (<code dir="ltr">4'b001?</code>): assign <code dir="ltr">out = 2'd1;</code>
- When <code dir="ltr">in[0] == 1</code> (<code dir="ltr">4'b0001</code>): assign <code dir="ltr">out = 2'd0;</code>
- Otherwise (<code dir="ltr">default</code>): assign <code dir="ltr">out = 2'd0;</code>`,

      starterCode: `module top_module (
    input [3:0] in,
    output reg [1:0] out
);
    // כתבו את מקודד הקדימויות בעזרת casez ו-? כאן
    // Write your priority encoder using casez and ? here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output reg [1:0] out
);
    always @(*) begin
        casez (in)
            4'b1???: out = 2'd3;
            4'b01??: out = 2'd2;
            4'b001?: out = 2'd1;
            4'b0001: out = 2'd0;
            default: out = 2'd0;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 1, out: 0 },
        { time: 10, in: 2, out: 1 },
        { time: 15, in: 3, out: 1 },
        { time: 20, in: 4, out: 2 },
        { time: 25, in: 7, out: 2 },
        { time: 30, in: 8, out: 3 },
        { time: 35, in: 15, out: 3 }
      ],

      hints: {
        he: "בתוך always @(*) רשמו: casez (in) 4'b1???: out = 2'd3; 4'b01??: out = 2'd2; 4'b001?: out = 2'd1; 4'b0001: out = 2'd0; default: out = 2'd0; endcase",
        en: "Inside always @(*) write: casez (in) 4'b1???: out = 2'd3; 4'b01??: out = 2'd2; 4'b001?: out = 2'd1; 4'b0001: out = 2'd0; default: out = 2'd0; endcase"
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
