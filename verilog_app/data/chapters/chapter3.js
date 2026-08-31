(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 17: 2-to-1 Multiplexer (MUX)
    // --------------------------------------------------------------------------
    {
      id: 17,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מרבב 2 ל-1 (2-to-1 Multiplexer) 🎛️",
      titleEn: "2-to-1 Multiplexer (MUX)",

      explanationHe: `
<h3>1. מהו מרבב (Multiplexer / MUX)? 🎛️</h3>
<p>מרבב הוא רכיב לוגי צירופי הפועל כנתב או בורר אותות. יש לו מספר כניסות מידע, יציאה אחת, וכניסת בקרה (בורר - Selector).</p>
<p>חשבו על מרבב כעל <strong>מסוט של רכבת</strong>: בהתאם למצב הבורר, כיוון התנועה נקבע ונתיב אחד בלבד מחובר ליציאה. במרבב 2-ל-1:</p>
<ul>
  <li>אם כניסת הבורר (<code dir="ltr">sel</code>) היא <code dir="ltr">0</code>, היציאה <code dir="ltr">y</code> תתחבר לכניסה הראשונה (<code dir="ltr">a</code>).</li>
  <li>אם כניסת הבורר (<code dir="ltr">sel</code>) היא <code dir="ltr">1</code>, היציאה <code dir="ltr">y</code> תתחבר לכניסה השנייה (<code dir="ltr">b</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש ב-Verilog באמצעות האופרטור המותנה 📐</h3>
<p>הדרך המקובלת והקריאה ביותר ב-Verilog עבור מרבב 2-ל-1 היא שימוש ב-<strong>אופרטור מותנה (Ternary Operator)</strong>:</p>
<pre dir="ltr"><code>assign y = sel ? b : a;</code></pre>
<p>רכיב זה ישמש אותנו כאבן בניין לבניית מרבב 4-ל-1 ומרבב 8-ל-1 בשיעורים הבאים!</p>
`,

      explanationEn: `
<h3>1. What is a Multiplexer (MUX)? 🎛️</h3>
<p>A multiplexer is a combinational logic circuit that functions as a data selector or switch. It has multiple data inputs, a single output, and a control input called the select line (<code dir="ltr">sel</code>).</p>
<p>In a 2-to-1 MUX:</p>
<ul>
  <li>If <code dir="ltr">sel == 0</code>, output <code dir="ltr">y</code> connects to <code dir="ltr">a</code>.</li>
  <li>If <code dir="ltr">sel == 1</code>, output <code dir="ltr">y</code> connects to <code dir="ltr">b</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Ternary Operator Implementation 📐</h3>
<pre dir="ltr"><code>assign y = sel ? b : a;</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">mux_2to1</code> המייצג מרבב 2-ל-1. למודול כניסות של 1-ביט בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, כניסת בקרה של 1-ביט בשם <code dir="ltr">sel</code> ויציאה של 1-ביט בשם <code dir="ltr">y</code>.`,
      taskEn: `Design a 2-to-1 Multiplexer module named <code dir="ltr">mux_2to1</code> with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, <code dir="ltr">sel</code> and output <code dir="ltr">y</code>.`,

      starterCode: `module mux_2to1 (
    input a,
    input b,
    input sel,
    output y
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module mux_2to1 (
    input a,
    input b,
    input sel,
    output y
);
    assign y = sel ? b : a;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, sel: 0, y: 0 },
        { time: 5, a: 1, b: 0, sel: 0, y: 1 },
        { time: 10, a: 1, b: 0, sel: 1, y: 0 },
        { time: 15, a: 1, b: 1, sel: 1, y: 1 },
        { time: 20, a: 0, b: 1, sel: 0, y: 0 }
      ],

      hints: {
        he: "השתמשו באופרטור המותנה ב-Verilog: assign y = sel ? b : a;",
        en: "Use the Verilog ternary operator: assign y = sel ? b : a;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 18: 4-to-1 MUX
    // --------------------------------------------------------------------------
    {
      id: 18,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מרבב 4 ל-1 — הרכבה מ-3 מרבבי 2 ל-1 🎚️",
      titleEn: "4-to-1 MUX (Hierarchical)",

      explanationHe: `
<h3>1. עץ מרבבים: הרכבת מרבב 4 ל-1 מתוך 3 מרבבי 2 ל-1 🧱</h3>
<p>במקום לכתוב לוגיקה מורכבת ושטוחה, אנו מרכיבים מרבב 4-ל-1 באמצעות עץ היררכי המורכב מ-3 יחידות של <strong><code dir="ltr">mux_2to1</code></strong> שבנינו בשיעור 17:</p>

<pre dir="ltr"><code>in[0] ────┐
          ├─►[ mux_2to1 u0 ]── m0 ──┐
in[1] ────┘        ▲                │
                   │ sel[0]         ├─►[ mux_2to1 u2 ]──── y
in[2] ────┐                         │        ▲
          ├─►[ mux_2to1 u1 ]── m1 ──┘        │ sel[1]
in[3] ────┘        ▲
                   │ sel[0]</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. איך זה עובד? 💡</h3>
<ul>
  <li>השלב הראשון בורר בין זוגות באמצעות <code dir="ltr">sel[0]</code>:
    <br><code dir="ltr">u0</code> בורר בין <code dir="ltr">in[0]</code> ל-<code dir="ltr">in[1]</code> ומפיק את <code dir="ltr">m0</code>.
    <br><code dir="ltr">u1</code> בורר בין <code dir="ltr">in[2]</code> ל-<code dir="ltr">in[3]</code> ומפיק את <code dir="ltr">m1</code>.
  </li>
  <li>השלב השני (<code dir="ltr">u2</code>) בורר בין <code dir="ltr">m0</code> ל-<code dir="ltr">m1</code> באמצעות <code dir="ltr">sel[1]</code>!</li>
</ul>
`,

      explanationEn: `
<h3>1. MUX Tree: 4-to-1 MUX from 3 2-to-1 MUXes 🧱</h3>
<p>A 4-to-1 multiplexer can be constructed hierarchically using a tree of three <strong><code dir="ltr">mux_2to1</code></strong> instances:</p>

<pre dir="ltr"><code>in[0] ────┐
          ├─►[ mux_2to1 u0 ]── m0 ──┐
in[1] ────┘        ▲                │
                   │ sel[0]         ├─►[ mux_2to1 u2 ]──── y
in[2] ────┐                         │        ▲
          ├─►[ mux_2to1 u1 ]── m1 ──┘        │ sel[1]
in[3] ────┘        ▲
                   │ sel[0]</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">mux_4to1</code> המייצג מרבב 4-ל-1 על ידי חיבור <strong>3 מופעים של <code dir="ltr">mux_2to1</code></strong>.
<br><br>
למודול כניסת וקטור של 4-ביט בשם <code dir="ltr">in</code>, כניסת בחירה של 2-ביט בשם <code dir="ltr">sel</code> ויציאה של 1-ביט בשם <code dir="ltr">y</code>.
<br><br>
תת-המודול <code dir="ltr">mux_2to1</code> מוגדר במערכת עם הממשק:
<code dir="ltr">module mux_2to1 (input a, input b, input sel, output y);</code>`,
      taskEn: `Build a 4-to-1 Multiplexer in module <code dir="ltr">mux_4to1</code> by instantiating <strong>3 copies of <code dir="ltr">mux_2to1</code></strong>.
Inputs: 4-bit vector <code dir="ltr">in</code>, 2-bit selector <code dir="ltr">sel</code>; output: <code dir="ltr">y</code>.`,

      starterCode: `module mux_4to1 (
    input [3:0] in,
    input [1:0] sel,
    output y
);
    // הגדירו חוטים פנימיים וחברו 3 מופעי mux_2to1 כאן / Declare wires and instantiate 3 mux_2to1 instances here

endmodule`,

      solutionCode: `module mux_4to1 (
    input [3:0] in,
    input [1:0] sel,
    output y
);
    wire m0, m1;

    mux_2to1 u0 (.a(in[0]), .b(in[1]), .sel(sel[0]), .y(m0));
    mux_2to1 u1 (.a(in[2]), .b(in[3]), .sel(sel[0]), .y(m1));
    mux_2to1 u2 (.a(m0),   .b(m1),    .sel(sel[1]), .y(y));
endmodule`,

      expectedOutputs: [
        { time: 0, in: 10, sel: 0, y: 0 },
        { time: 5, in: 10, sel: 1, y: 1 },
        { time: 10, in: 10, sel: 2, y: 0 },
        { time: 15, in: 10, sel: 3, y: 1 },
        { time: 20, in: 5,  sel: 0, y: 1 }
      ],

      hints: {
        he: "הגדירו חוטים פנימיים: wire m0, m1; חברו את u0 ל-in[0], in[1] עם sel[0], את u1 ל-in[2], in[3] עם sel[0], ואת u2 ל-m0, m1 עם sel[1].",
        en: "Declare internal wires: wire m0, m1; instantiate u0 and u1 selected by sel[0], then u2 selected by sel[1]."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 19: 8-to-1 MUX
    // --------------------------------------------------------------------------
    {
      id: 19,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מרבב 8 ל-1 — הרכבה מ-2 מרבבי 4 ל-1 ומרבב 2 ל-1 🎛️",
      titleEn: "8-to-1 MUX (Hierarchical)",

      explanationHe: `
<h3>1. הרכבת מרבב 8 ל-1 מתוך מודולים קודמים 🧱</h3>
<p>ממשיכים לבנות את מגדל הלבנים! מרבב 8-ל-1 מורכב ישירות מ-<strong>שני מרבבי 4-ל-1 (<code dir="ltr">mux_4to1</code>)</strong> עבור 8 הכניסות, ו-<strong>מרבב 2-ל-1 (<code dir="ltr">mux_2to1</code>)</strong> אחד שבורר בין שני החצאים באמצעות ביט ה-MSB של הבורר (<code dir="ltr">sel[2]</code>):</p>

<pre dir="ltr"><code>in[3:0] ────►[ mux_4to1 u0 ]── m0 ──┐
                 ▲ sel[1:0]         │
                                    ├─►[ mux_2to1 u2 ]──── y
in[7:4] ────►[ mux_4to1 u1 ]── m1 ──┘        ▲ sel[2]
                 ▲ sel[1:0]</code></pre>
`,

      explanationEn: `
<h3>1. 8-to-1 MUX from 2 4-to-1 MUXes and 1 2-to-1 MUX 🧱</h3>
<p>An 8-to-1 Multiplexer is composed of <strong>two <code dir="ltr">mux_4to1</code></strong> instances handling 4 inputs each (selected by <code dir="ltr">sel[1:0]</code>), and <strong>one <code dir="ltr">mux_2to1</code></strong> selecting between the two halves using <code dir="ltr">sel[2]</code>.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">mux_8to1</code> המייצג מרבב 8-ל-1 על ידי שילוב <strong>2 מופעים של <code dir="ltr">mux_4to1</code></strong> ו-<strong>מופע יחיד של <code dir="ltr">mux_2to1</code></strong>.
<br><br>
למודול כניסת וקטור 8-ביט בשם <code dir="ltr">in</code>, כניסת בחירה 3-ביט בשם <code dir="ltr">sel</code>, ויציאה 1-ביט בשם <code dir="ltr">y</code>.`,
      taskEn: `Build an 8-to-1 Multiplexer in module <code dir="ltr">mux_8to1</code> by combining <strong>2 instances of <code dir="ltr">mux_4to1</code></strong> and <strong>1 instance of <code dir="ltr">mux_2to1</code></strong>.
Inputs: 8-bit vector <code dir="ltr">in</code>, 3-bit selector <code dir="ltr">sel</code>; output: <code dir="ltr">y</code>.`,

      starterCode: `module mux_8to1 (
    input [7:0] in,
    input [2:0] sel,
    output y
);
    // הגדירו חוטים פנימיים וחברו 2 מופעי mux_4to1 ומופע mux_2to1 / Declare wires and instantiate sub-modules

endmodule`,

      solutionCode: `module mux_8to1 (
    input [7:0] in,
    input [2:0] sel,
    output y
);
    wire m0, m1;

    mux_4to1 u0 (.in(in[3:0]), .sel(sel[1:0]), .y(m0));
    mux_4to1 u1 (.in(in[7:4]), .sel(sel[1:0]), .y(m1));
    mux_2to1 u2 (.a(m0), .b(m1), .sel(sel[2]), .y(y));
endmodule`,

      expectedOutputs: [
        { time: 0, in: 170, sel: 0, y: 0 },
        { time: 5, in: 170, sel: 1, y: 1 },
        { time: 10, in: 170, sel: 2, y: 0 },
        { time: 15, in: 170, sel: 3, y: 1 },
        { time: 20, in: 170, sel: 4, y: 0 },
        { time: 25, in: 170, sel: 5, y: 1 },
        { time: 30, in: 170, sel: 6, y: 0 },
        { time: 35, in: 170, sel: 7, y: 1 }
      ],

      hints: {
        he: "חברו את u0 ל-in[3:0] עם sel[1:0], את u1 ל-in[7:4] עם sel[1:0], ואת u2 ל-m0,m1 עם sel[2].",
        en: "Instantiate u0 with in[3:0] and sel[1:0], u1 with in[7:4] and sel[1:0], and u2 with m0,m1 and sel[2]."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 20: Demultiplexer (DEMUX)
    // --------------------------------------------------------------------------
    {
      id: 20,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מפלג (Demultiplexer - DEMUX) 🔀",
      titleEn: "Demultiplexer (DEMUX)",

      explanationHe: `
<h3>1. מהו מפלג (Demultiplexer / DEMUX)? 🔀</h3>
<p>מפלג הוא הרכיב ההפוך לחלוטין ממרבב. הוא מקבל <strong>כניסת נתונים יחידה</strong>, ומנתב אותה ל-<strong>אחת מתוך מספר יציאות</strong> על פי מצב כניסת הבורר (Selector).</p>
<p>היציאות שלא נבחרו מקבלות ערך ברירת מחדל, לרוב <code dir="ltr">0</code> (כבוי).</p>
<p>דוגמה תפיסתית: <strong>מערכת הפצת דואר</strong>. מכתב יחיד מגיע (כניסה) והדוור מנתב אותו לתיבה הספציפית (יציאה) על פי הכתובת (בורר).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. לוגיקה פנימית של DEMUX 1-ל-4 📐</h3>
<p>במפלג 1-ל-4 בעל כניסה <code dir="ltr">in</code>, בורר <code dir="ltr">sel[1:0]</code> וארבע יציאות <code dir="ltr">out0, out1, out2, out3</code>:</p>
<ul>
  <li>אם <code dir="ltr">sel = 2'b00</code>: היציאה <code dir="ltr">out0</code> מקבלת את ערך הכניסה <code dir="ltr">in</code>, וכל שאר היציאות מקבלות <code dir="ltr">0</code>.</li>
  <li>אם <code dir="ltr">sel = 2'b01</code>: היציאה <code dir="ltr">out1</code> מקבלת את ערך הכניסה <code dir="ltr">in</code>, וכל שאר היציאות מקבלות <code dir="ltr">0</code>.</li>
  <li>וכן הלאה.</li>
</ul>

<p>המשוואה הלוגית עבור כל יציאה ניתנת למימוש באמצעות שער AND פשוט. לדוגמה:</p>
<p align="center"><code dir="ltr">out0 = in & (sel == 2'b00);</code></p>
<p>ב-Verilog, נוכל לכתוב תנאי מפורש לכל יציאה בעזרת האופרטור המותנה.</p>
`,

      explanationEn: `
<h3>1. What is a Demultiplexer (DEMUX)? 🔀</h3>
<p>A demultiplexer performs the exact opposite function of a multiplexer. It takes a <strong>single data input</strong> and routes it to <strong>one of multiple outputs</strong>, selected by control signals.</p>
<p>All other unselected outputs are driven to a default inactive value, usually <code dir="ltr">0</code>.</p>
<p>Think of it as a <strong>mail sorter</strong>: a single parcel enters, and depending on the address (select line), it is placed into one specific mailbox (output).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Internal Logic of a 1-to-4 DEMUX 📐</h3>
<p>In a 1-to-4 demultiplexer with input <code dir="ltr">in</code>, selector <code dir="ltr">sel[1:0]</code>, and outputs <code dir="ltr">out0, out1, out2, out3</code>:</p>
<ul>
  <li>If <code dir="ltr">sel = 2'b00</code>, then <code dir="ltr">out0 = in</code>, while all others are <code dir="ltr">0</code>.</li>
  <li>If <code dir="ltr">sel = 2'b01</code>, then <code dir="ltr">out1 = in</code>, while all others are <code dir="ltr">0</code>.</li>
  <li>And so on.</li>
</ul>

<p>The logic equation for each output can be represented using an AND condition. For instance:</p>
<p align="center"><code dir="ltr">out0 = in & (sel == 2'b00);</code></p>
<p>In Verilog, we can write a dedicated assignment for each output using the conditional operator.</p>
`,

      taskHe: `בנו מפלג (DEMUX) 1-ל-4 בשם <code dir="ltr">top_module</code>. למודול כניסת נתונים יחידה של 1-ביט בשם <code dir="ltr">in</code>, כניסת בחירה דו-ביטית בשם <code dir="ltr">sel</code>, וארבע יציאות של 1-ביט בשם <code dir="ltr">out0, out1, out2, out3</code>. נתבו את <code dir="ltr">in</code> ליציאה המתאימה לפי <code dir="ltr">sel</code>, כאשר היציאות האחרות מקבלות <code dir="ltr">0</code>.`,
      taskEn: `Create a 1-to-4 demultiplexer named <code dir="ltr">top_module</code>. The module has a 1-bit data input <code dir="ltr">in</code>, a 2-bit select input <code dir="ltr">sel</code>, and four 1-bit outputs <code dir="ltr">out0, out1, out2, out3</code>. Route <code dir="ltr">in</code> to the output specified by <code dir="ltr">sel</code>. All other outputs must be forced to <code dir="ltr">0</code>.`,

      starterCode: `module top_module (
    input in,
    input [1:0] sel,
    output out0,
    output out1,
    output out2,
    output out3
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input in,
    input [1:0] sel,
    output out0,
    output out1,
    output out2,
    output out3
);
    assign out0 = (sel == 0) ? in : 0;
    assign out1 = (sel == 1) ? in : 0;
    assign out2 = (sel == 2) ? in : 0;
    assign out3 = (sel == 3) ? in : 0;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, sel: 0, out0: 0, out1: 0, out2: 0, out3: 0 },
        { time: 5, in: 1, sel: 0, out0: 1, out1: 0, out2: 0, out3: 0 },
        { time: 10, in: 1, sel: 1, out0: 0, out1: 1, out2: 0, out3: 0 },
        { time: 15, in: 1, sel: 2, out0: 0, out1: 0, out2: 1, out3: 0 },
        { time: 20, in: 1, sel: 3, out0: 0, out1: 0, out2: 0, out3: 1 },
        { time: 25, in: 0, sel: 3, out0: 0, out1: 0, out2: 0, out3: 0 }
      ],

      hints: {
        he: "עבור כל יציאה, כתבו הוראת assign המשתמשת באופרטור מותנה. היציאה תהיה שווה ל-in אם הבורר מתאים לאינדקס שלה, ואחרת 0.",
        en: "For each output, write an assign statement using a conditional operator. Drive the output with `in` if `sel` matches its index, otherwise drive it to `0`."
      }
    },

    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Lesson 21: 2-to-4 Decoder
    // --------------------------------------------------------------------------
    {
      id: 21,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מפענח 2 ל-4 עם כניסת אפשור (2-to-4 Decoder) 🔓",
      titleEn: "2-to-4 Decoder with Enable",

      explanationHe: `
<h3>1. מהו מפענח 2 ל-4 (2-to-4 Decoder)? 🔓</h3>
<p>מפענח (Decoder) הוא מעגל צירופי הממיר קוד בינארי של $N$ ביטים לכדי $2^N$ קווי יציאה נפרדים בקידוד <strong>One-Hot</strong> (בכל רגע נתון, לכל היותר יציאה אחת בלבד פעילה בערך '1', ושאר היציאות הן '0').</p>

<p>עבור מפענח 2 ל-4 עם כניסת כתובת <code dir="ltr">in[1:0]</code> וכניסת אפשור <code dir="ltr">en</code> (Enable):</p>
<ul>
  <li>אם <code dir="ltr">en == 0</code>: המפענח מושבת, וכל 4 היציאות כבויות (<code dir="ltr">out = 4'b0000</code>).</li>
  <li>אם <code dir="ltr">en == 1</code>: בדיוק הביט שבאינדקס של <code dir="ltr">in</code> נדלק ל-1:
    <ul>
      <li><code dir="ltr">in = 2'b00 (0)</code> &larr; <code dir="ltr">out[0] = 1</code> (<code dir="ltr">out = 4'b0001</code>)</li>
      <li><code dir="ltr">in = 2'b01 (1)</code> &larr; <code dir="ltr">out[1] = 1</code> (<code dir="ltr">out = 4'b0010</code>)</li>
      <li><code dir="ltr">in = 2'b10 (2)</code> &larr; <code dir="ltr">out[2] = 1</code> (<code dir="ltr">out = 4'b0100</code>)</li>
      <li><code dir="ltr">in = 2'b11 (3)</code> &larr; <code dir="ltr">out[3] = 1</code> (<code dir="ltr">out = 4'b1000</code>)</li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת ולוגיקת שערים (Minterms) 📐</h3>
<p>כל יציאה של המפענח מייצגת מכפלת מכפלות (Minterm) בוליאנית של אותות הכניסה יחד עם אות האפשור <code dir="ltr">en</code>:</p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; text-align: center;">
  <thead>
    <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 6px;">en</th>
      <th style="padding: 6px;">in[1]</th>
      <th style="padding: 6px;">in[0]</th>
      <th style="padding: 6px;">out[3]</th>
      <th style="padding: 6px;">out[2]</th>
      <th style="padding: 6px;">out[1]</th>
      <th style="padding: 6px;">out[0]</th>
      <th style="padding: 6px;">משוואה בוליאנית (Minterm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>X</td><td>X</td><td>0</td><td>0</td><td>0</td><td>0</td><td>מושבת (0)</td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td><code dir="ltr">out[0] = en &amp; ~in[1] &amp; ~in[0]</code></td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td>0</td><td><code dir="ltr">out[1] = en &amp; ~in[1] &amp; in[0]</code></td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td>0</td><td>0</td><td><code dir="ltr">out[2] = en &amp; in[1] &amp; ~in[0]</code></td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td>0</td><td>0</td><td>0</td><td><code dir="ltr">out[3] = en &amp; in[1] &amp; in[0]</code></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דרך המימוש ב-Verilog 💻</h3>
<p>כפי שלמדנו בשיעורי השערים (AND, NOT) וחילוץ הביטים (<code dir="ltr">in[1]</code>, <code dir="ltr">in[0]</code>), נוכל לממש את המפענח בצורה ישירה וטבעית בעזרת 4 משפטי <code dir="ltr">assign</code> רציפים:</p>

<pre dir="ltr"><code>assign out[0] = en &amp; (~in[1] &amp; ~in[0]);
assign out[1] = en &amp; (~in[1] &amp;  in[0]);
assign out[2] = en &amp; ( in[1] &amp; ~in[0]);
assign out[3] = en &amp; ( in[1] &amp;  in[0]);</code></pre>

<p><em>הערת העשרה (קיצור דרך אלגנטי):</em> ב-Verilog קיים גם אופרטור הזזה שמאלה (<code dir="ltr">&lt;&lt;</code>). הביטוי <code dir="ltr">4'b0001 &lt;&lt; in</code> מזיז את הביט הבודד שמאלה במספר צעדים השווה לערך המספרי של <code dir="ltr">in</code>, ומניב בדיוק את אותה התוצאה!</p>
`,

      explanationEn: `
<h3>1. What is a 2-to-4 Decoder? 🔓</h3>
<p>A decoder converts an $N$-bit binary address into $2^N$ individual One-Hot output lines. At any given moment, only the selected output line is activated ('1'), while all other lines remain '0'.</p>

<p>For a 2-to-4 decoder with 2-bit input <code dir="ltr">in[1:0]</code> and enable signal <code dir="ltr">en</code>:</p>
<ul>
  <li>If <code dir="ltr">en == 0</code>: Decoder is disabled, all outputs are 0 (<code dir="ltr">out = 4'b0000</code>).</li>
  <li>If <code dir="ltr">en == 1</code>: Exactly the bit at index <code dir="ltr">in</code> is set to 1:
    <ul>
      <li><code dir="ltr">in = 0</code> &rarr; <code dir="ltr">out[0] = 1</code> (<code dir="ltr">out = 4'b0001</code>)</li>
      <li><code dir="ltr">in = 1</code> &rarr; <code dir="ltr">out[1] = 1</code> (<code dir="ltr">out = 4'b0010</code>)</li>
      <li><code dir="ltr">in = 2</code> &rarr; <code dir="ltr">out[2] = 1</code> (<code dir="ltr">out = 4'b0100</code>)</li>
      <li><code dir="ltr">in = 3</code> &rarr; <code dir="ltr">out[3] = 1</code> (<code dir="ltr">out = 4'b1000</code>)</li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Gate Logic & Minterms 📐</h3>
<p>Each output line corresponds to a boolean minterm combined with the <code dir="ltr">en</code> signal:</p>
<ul>
  <li><code dir="ltr">out[0] = en &amp; ~in[1] &amp; ~in[0]</code></li>
  <li><code dir="ltr">out[1] = en &amp; ~in[1] &amp; in[0]</code></li>
  <li><code dir="ltr">out[2] = en &amp; in[1] &amp; ~in[0]</code></li>
  <li><code dir="ltr">out[3] = en &amp; in[1] &amp; in[0]</code></li>
</ul>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">decoder_2to4</code>.
כניסות: וקטור 2-ביט <code dir="ltr">in</code>, כניסת אפשור 1-ביט <code dir="ltr">en</code>.
יציאה: וקטור 4-ביט <code dir="ltr">out</code>.

ממשו את 4 היציאות <code dir="ltr">out[0]..out[3]</code> על פי משוואות השערים (Minterms) והאפשור <code dir="ltr">en</code>:
- <code dir="ltr">out[0]</code> פעיל כאשר <code dir="ltr">in == 2'b00</code> ו-<code dir="ltr">en == 1</code>
- <code dir="ltr">out[1]</code> פעיל כאשר <code dir="ltr">in == 2'b01</code> ו-<code dir="ltr">en == 1</code>
- <code dir="ltr">out[2]</code> פעיל כאשר <code dir="ltr">in == 2'b10</code> ו-<code dir="ltr">en == 1</code>
- <code dir="ltr">out[3]</code> פעיל כאשר <code dir="ltr">in == 2'b11</code> ו-<code dir="ltr">en == 1</code>`,

      taskEn: `Design a 2-to-4 Decoder with Enable in module <code dir="ltr">decoder_2to4</code>.
Inputs: 2-bit vector <code dir="ltr">in</code>, 1-bit enable <code dir="ltr">en</code>.
Output: 4-bit vector <code dir="ltr">out</code>.

Implement each output bit <code dir="ltr">out[0]..out[3]</code> using boolean minterms gated by <code dir="ltr">en</code>:
- <code dir="ltr">out[0]</code> active when <code dir="ltr">in == 2'b00</code> and <code dir="ltr">en == 1</code>
- <code dir="ltr">out[1]</code> active when <code dir="ltr">in == 2'b01</code> and <code dir="ltr">en == 1</code>
- <code dir="ltr">out[2]</code> active when <code dir="ltr">in == 2'b10</code> and <code dir="ltr">en == 1</code>
- <code dir="ltr">out[3]</code> active when <code dir="ltr">in == 2'b11</code> and <code dir="ltr">en == 1</code>`,

      starterCode: `module decoder_2to4 (
    input [1:0] in,
    input en,
    output [3:0] out
);
    // כתבו את השמות השערים עבור כל אחד מ-4 הביטים של out
    // Write your continuous assignments for out[0], out[1], out[2], out[3]

endmodule`,

      solutionCode: `module decoder_2to4 (
    input [1:0] in,
    input en,
    output [3:0] out
);
    assign out[0] = en & (~in[1] & ~in[0]);
    assign out[1] = en & (~in[1] &  in[0]);
    assign out[2] = en & ( in[1] & ~in[0]);
    assign out[3] = en & ( in[1] &  in[0]);
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, en: 0, out: 0 },
        { time: 5, in: 0, en: 1, out: 1 },
        { time: 10, in: 1, en: 1, out: 2 },
        { time: 15, in: 2, en: 1, out: 4 },
        { time: 20, in: 3, en: 1, out: 8 },
        { time: 25, in: 3, en: 0, out: 0 }
      ],

      hints: {
        he: "השתמשו ב-4 משפטי assign נפרדים עבור out[0], out[1], out[2], out[3]. לכל ביט, שלבו את שער ה-AND עם אות האפשור en והיפוכי הכניסות in[1] ו-in[0]. למשל: assign out[0] = en & (~in[1] & ~in[0]);",
        en: "Write 4 separate assign statements for out[0], out[1], out[2], out[3]. For each bit, AND the enable signal en with the corresponding inverted/non-inverted in[1] and in[0] bits. For example: assign out[0] = en & (~in[1] & ~in[0]);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 22: 3-to-8 Decoder
    // --------------------------------------------------------------------------
    {
      id: 22,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מפענח 3 ל-8 — הרכבה מ-2 מפענחי 2 ל-4 🔓",
      titleEn: "3-to-8 Decoder (Hierarchical)",

      explanationHe: `
<h3>1. הרכבת מפענח 3 ל-8 מתוך 2 מפענחי 2 ל-4 🧱</h3>
<p>נמשיך בבניית מגדל הלבנים! מפענח 3-ל-8 מורכב משני מופעים של <strong><code dir="ltr">decoder_2to4</code></strong>:</p>
<ul>
  <li>הביטים הנמוכים <code dir="ltr">in[1:0]</code> מחוברים לכניסת הכתובת של שני המפענחים.</li>
  <li>ביט ה-MSB (<code dir="ltr">in[2]</code>) קובע איזה מפענח יאופשר:
    <ul>
      <li>כאשר <code dir="ltr">in[2] = 0</code>: המפענח התחתון <code dir="ltr">d0</code> מקבל <code dir="ltr">en &amp; ~in[2]</code> ומפעיל יציאות 0-3 (<code dir="ltr">low</code>).</li>
      <li>כאשר <code dir="ltr">in[2] = 1</code>: המפענח העליון <code dir="ltr">d1</code> מקבל <code dir="ltr">en &amp; in[2]</code> ומפעיל יציאות 4-7 (<code dir="ltr">high</code>).</li>
    </ul>
  </li>
  <li>איחוד היציאות: <code dir="ltr">assign out = {high, low};</code></li>
</ul>
`,

      explanationEn: `
<h3>1. Hierarchical 3-to-8 Decoder from 2 2-to-4 Decoders 🧱</h3>
<p>We build a 3-to-8 decoder by instantiating two <strong><code dir="ltr">decoder_2to4</code></strong> blocks:</p>
<ul>
  <li>Address bits <code dir="ltr">in[1:0]</code> connect to both sub-decoders.</li>
  <li>MSB <code dir="ltr">in[2]</code> enables the lower decoder <code dir="ltr">d0</code> when 0, and the upper decoder <code dir="ltr">d1</code> when 1.</li>
  <li>Outputs concatenate: <code dir="ltr">assign out = {high, low};</code></li>
</ul>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">decoder_3to8</code> על ידי שילוב <strong>2 מופעים של <code dir="ltr">decoder_2to4</code></strong>.
<br><br>
כניסות: וקטור 3-ביט <code dir="ltr">in</code> ואות אפשור <code dir="ltr">en</code>. יציאה: וקטור 8-ביט <code dir="ltr">out</code>.
<br><br>
הממשק של <code dir="ltr">decoder_2to4</code> הוא:
<code dir="ltr">module decoder_2to4 (input [1:0] in, input en, output [3:0] out);</code>`,
      taskEn: `Build a 3-to-8 Decoder in module <code dir="ltr">decoder_3to8</code> by instantiating <strong>2 copies of <code dir="ltr">decoder_2to4</code></strong>.
Inputs: 3-bit vector <code dir="ltr">in</code>, 1-bit <code dir="ltr">en</code>; output: 8-bit vector <code dir="ltr">out</code>.`,

      starterCode: `module decoder_3to8 (
    input [2:0] in,
    input en,
    output [7:0] out
);
    // הגדירו חוטים פנימיים וחברו 2 מופעי decoder_2to4 כאן / Declare wires and instantiate 2 decoder_2to4 modules

endmodule`,

      solutionCode: `module decoder_3to8 (
    input [2:0] in,
    input en,
    output [7:0] out
);
    wire [3:0] low, high;

    decoder_2to4 d0 (.in(in[1:0]), .en(en & ~in[2]), .out(low));
    decoder_2to4 d1 (.in(in[1:0]), .en(en &  in[2]), .out(high));

    assign out = {high, low};
endmodule`,

      expectedOutputs: [
        { time: 0, in: 3, en: 0, out: 0 },
        { time: 5, in: 0, en: 1, out: 1 },
        { time: 10, in: 3, en: 1, out: 8 },
        { time: 15, in: 7, en: 1, out: 128 },
        { time: 20, in: 7, en: 0, out: 0 }
      ],

      hints: {
        he: "הגדירו wire [3:0] low, high; חברו את d0 עם en & ~in[2], את d1 עם en & in[2], ואחדו ב-assign out = {high, low};",
        en: "Declare wire [3:0] low, high; instantiate d0 with en & ~in[2], d1 with en & in[2], and concatenate assign out = {high, low};"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 23: Priority Encoder
    // --------------------------------------------------------------------------
    {
      id: 23,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מקודד קדימות (Priority Encoder) 🥇",
      titleEn: "Priority Encoder",

      explanationHe: `
<h3>1. מהו מקודד (Encoder)? 🥇</h3>
<p>מקודד הוא הרכיב ההפוך לחלוטין ממפענח. הוא מקבל כניסה המיוצגת כקוד One-Hot (שבה רק כניסה אחת פעילה), ומפיק קוד בינארי המייצג את האינדקס של הכניסה הפעילה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הבעיה ופתרונה: מקודד קדימות (Priority Encoder) 📐</h3>
<p>במעגלים מעשיים, עלול להיווצר מצב שבו <strong>יותר מכניסה אחת פעילה בו-זמנית</strong>. למשל, אם גם כניסה 1 וגם כניסה 3 הן <code dir="ltr">1</code>, מה המקודד יפלוט?</p>
<p><strong>מקודד קדימות</strong> פותר זאת על ידי הגדרת עדיפויות מראש. לרוב, הכניסה בעלת האינדקס הגבוה ביותר מקבלת את העדיפות הראשונה (Priority). בנוסף, מקובל להוסיף יציאת דגל בשם <code dir="ltr">valid</code> המציינת האם לפחות כניסה אחת הייתה פעילה.</p>
<p>עבור מקודד קדימות 4 ל-2:</p>
<ul>
  <li>אם כניסה 3 פעילה (<code dir="ltr">in[3] = 1</code>) -> הפלט הוא <code dir="ltr">3</code> (בינארי 11) ו-<code dir="ltr">valid = 1</code> (שאר הכניסות אינן משפיעות).</li>
  <li>אם כניסה 3 כבויה אך כניסה 2 פעילה (<code dir="ltr">in[3]=0, in[2]=1</code>) -> הפלט הוא <code dir="ltr">2</code> (בינארי 10) ו-<code dir="ltr">valid = 1</code>.</li>
  <li>אם כל הכניסות הן <code dir="ltr">0</code> -> היציאה <code dir="ltr">valid</code> תהיה <code dir="ltr">0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מימוש ב-Verilog 💻</h3>
<p>ניתן לממש קדימות באמצעות שרשור של אופרטורים מותנים הבודקים את הכניסות לפי סדר החשיבות שלהן:</p>
<pre dir="ltr"><code>assign code = signal[2] ? 2 :
              signal[1] ? 1 : 0;
assign has_activity = (signal != 0);</code></pre>
<p><strong>טיפ סימולטור:</strong> מנוע הבדיקה שלנו מעריך ביטויים פרוצדורליים פשוטים. על מנת להבטיח מעבר תקין, מומלץ להשתמש בבדיקות שוויון ישירות של הוקטור לאפס (כמו <code dir="ltr">in != 0</code>) עבור אות ה-valid, כפי שמוצג בדוגמה לעיל, במקום אופרטורים של צמצום (Reduction) כגון <code dir="ltr">|in</code> שאינם נתמכים במעריך הביטויים של הדפדפן.</p>
`,

      explanationEn: `
<h3>1. What is an Encoder? 🥇</h3>
<p>An encoder performs the exact opposite function of a decoder. It takes a One-Hot active input (where only one input line is active) and translates it into a binary representation of that active index.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Problem & Solution: Priority Encoder 📐</h3>
<p>In physical circuits, multiple inputs might become active at the same time. If both input 1 and input 3 are high, a simple encoder would produce garbage outputs.</p>
<p>A <strong>Priority Encoder</strong> solves this by prioritizing inputs. Usually, the highest index has the highest priority. It also typically provides a <code dir="ltr">valid</code> output flag to indicate whether any input is active at all.</p>
<p>For a 4-to-2 Priority Encoder:</p>
<ul>
  <li>If input 3 is high (<code dir="ltr">in[3] = 1</code>), the binary output is <code dir="ltr">3</code> (11) and <code dir="ltr">valid = 1</code>, ignoring inputs 0, 1, and 2.</li>
  <li>If input 3 is low but input 2 is high (<code dir="ltr">in[3]=0, in[2]=1</code>), the output is <code dir="ltr">2</code> (10) and <code dir="ltr">valid = 1</code>.</li>
  <li>If all inputs are low, <code dir="ltr">valid = 0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Implementing Priority in Verilog 💻</h3>
<p>Priority can be implemented by chaining conditional ternary operators, evaluating from the highest priority to the lowest:</p>
<pre dir="ltr"><code>assign code = signal[2] ? 2 :
              signal[1] ? 1 : 0;
assign has_activity = (signal != 0);</code></pre>
<p>Note: Our client-side simulator evaluates these expressions directly. To ensure correct evaluation, use a direct comparison of the input vector to zero (e.g. \`signal != 0\`) rather than unary reduction operators like \`|signal\` which are unsupported by the client-side parser.</p>
`,

      taskHe: `בנו מקודד קדימות 4-ל-2 בשם <code dir="ltr">top_module</code>. למודול כניסה של 4-ביט בשם <code dir="ltr">in</code> ויציאות: יציאת קוד של 2-ביט בשם <code dir="ltr">out</code> ויציאת 1-ביט בשם <code dir="ltr">valid</code>. העדיפות הגבוהה ביותר צריכה להינתן לאינדקס הגבוה ביותר (ביט 3). היציאה <code dir="ltr">valid</code> תהיה 1 אם לפחות אחד מביטי הכניסה פעיל (1), ו-0 אם כל ביטי הכניסה הם 0.`,
      taskEn: `Design a 4-to-2 Priority Encoder named <code dir="ltr">top_module</code>. The module has a 4-bit input <code dir="ltr">in</code> and two outputs: a 2-bit code output <code dir="ltr">out</code> and a 1-bit status output <code dir="ltr">valid</code>. Priority must be given to the highest index (bit 3). The output <code dir="ltr">valid</code> should be 1 if at least one input bit is high (1), and 0 if all inputs are low (0).`,

      starterCode: `module top_module (
    input [3:0] in,
    output [1:0] out,
    output valid
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output [1:0] out,
    output valid
);
    assign out = in[3] ? 3 :
                 in[2] ? 2 :
                 in[1] ? 1 : 0;
    assign valid = (in != 0);
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0, valid: 0 },
        { time: 5, in: 1, out: 0, valid: 1 },
        { time: 10, in: 2, out: 1, valid: 1 },
        { time: 15, in: 6, out: 2, valid: 1 },
        { time: 20, in: 8, out: 3, valid: 1 },
        { time: 25, in: 12, out: 3, valid: 1 }
      ],

      hints: {
        he: "בדקו את כניסות הוקטור בסדר יורד באמצעות אופרטורים מותנים: in[3] ? 3 : in[2] ? 2 ... ועבור valid בדקו האם in שונה מ-0.",
        en: "Check the vector inputs in descending order using nested conditionals: in[3] ? 3 : in[2] ? 2 ... and check if in is not equal to 0 for valid."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 24: Seven-Segment Decoder
    // --------------------------------------------------------------------------
    {
      id: 24,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מפענח לתצוגת שבעה מקטעים (Seven-Segment Decoder) 🔢",
      titleEn: "Seven-Segment Decoder",

      explanationHe: `
<h3>1. מהו מפענח לתצוגת שבעה מקטעים (7-Segment Decoder)? 🔢</h3>
<p>תצוגת שבעה מקטעים היא רכיב נפוץ להצגת ספרות (ולעתים אותיות). התצוגה מורכבת מ-7 נוריות LED המסודרות בצורת שמונה הניתנות לשליטה בנפרד.</p>
<p>המקטעים מסומנים באותיות מ-<strong>a</strong> עד <strong>g</strong>:</p>
<pre dir="ltr" style="background-color: var(--background-secondary); padding: 10px; border-radius: 4px;">
    -- a --
   |       |
   f       b
   |       |
    -- g --
   |       |
   e       c
   |       |
    -- d --
</pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. פענוח בינארי לתצוגה 📐</h3>
<p>מפענח שבעה מקטעים מקבל קוד בינארי בן 4 ביטים (המייצג ספרה מ-0 עד 9) ומפיק וקטור פלט בן 7 ביטים השולט על הדלקת המקטעים המתאימים.</p>
<p>במערכות בעלות <strong>אנודה משותפת (Common Anode)</strong>, הנוריות מופעלות ב-<strong>Active-Low</strong> (הביט <code dir="ltr">0</code> מדליק מקטע). במערכות בעלות <strong>קתודה משותפת (Common Cathode)</strong>, הן מופעלות ב-<strong>Active-High</strong> (הביט <code dir="ltr">1</code> מדליק מקטע).</p>
<p>בשיעור זה נממש מפענח <strong>קתודה משותפת (Active-High)</strong> כאשר סידור הביטים בוקטור הפלט <code dir="ltr">segments[6:0]</code> מוגדר כ- <code dir="ltr">{g, f, e, d, c, b, a}</code> (הביט הלוגי ה-0 מייצג את מקטע a, והביט ה-6 מייצג את מקטע g):</p>
<ul>
  <li>עבור הספרה 0: נדליק את a, b, c, d, e, f (כולם פרט ל-g). התוצאה הבינארית: <code dir="ltr">7'b0111111</code> (ערך עשרוני 63).</li>
  <li>עבור הספרה 1: נדליק את b, c. התוצאה הבינארית: <code dir="ltr">7'b0000110</code> (ערך עשרוני 6).</li>
  <li>עבור הספרה 2: נדליק את a, b, d, e, g. התוצאה הבינארית: <code dir="ltr">7'b1011011</code> (ערך עשרוני 91).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מימוש ב-Verilog 💻</h3>
<p>בתעשייה נהוג לממש זאת באמצעות בלוק צירופי <code dir="ltr">always @(*)</code> ומשפט <code dir="ltr">case</code>. אולם בסימולטור המקומי שלנו, על מנת להבטיח הערכה נכונה ותאימות מלאה, מומלץ להשתמש בשרשרת אופרטורים מותנים <code dir="ltr">? :</code> עם ערכים עשרוניים עבור התוצאות (למשל, 63 עבור 0, 6 עבור 1, וכו'), כפי שלמדנו בפרקים הקודמים.</p>
`,

      explanationEn: `
<h3>1. What is a Seven-Segment Decoder? 🔢</h3>
<p>A seven-segment display is an electronic component used to display decimal numerals. It consists of 7 individual light-emitting diodes (LEDs) arranged in a figure-eight configuration.</p>
<p>The segments are labeled from <strong>a</strong> to <strong>g</strong>:</p>
<pre dir="ltr" style="background-color: var(--background-secondary); padding: 10px; border-radius: 4px;">
    -- a --
   |       |
   f       b
   |       |
    -- g --
   |       |
   e       c
   |       |
    -- d --
</pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Decoding Logic 📐</h3>
<p>A seven-segment decoder takes a 4-bit binary input (representing values from 0 to 9) and outputs a 7-bit vector to drive the segments.</p>
<p>Displays can be <strong>Active-Low</strong> (Common Anode, where a \`0\` turns the segment ON) or <strong>Active-High</strong> (Common Cathode, where a \`1\` turns the segment ON).</p>
<p>In this lesson, we will implement an <strong>Active-High</strong> (Common Cathode) decoder. The 7-bit output vector <code dir="ltr">segments[6:0]</code> is mapped as <code dir="ltr">{g, f, e, d, c, b, a}</code> (bit 0 corresponds to segment a, bit 6 corresponds to segment g):</p>
<ul>
  <li>Digit 0: segments a, b, c, d, e, f are ON, g is OFF. Binary: <code dir="ltr">7'b0111111</code> (decimal 63).</li>
  <li>Digit 1: segments b, c are ON, others are OFF. Binary: <code dir="ltr">7'b0000110</code> (decimal 6).</li>
  <li>Digit 2: segments a, b, d, e, g are ON. Binary: <code dir="ltr">7'b1011011</code> (decimal 91).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Implementing in Verilog 💻</h3>
<p>In standard environments, decoders are typically written using procedural <code dir="ltr">always @(*)</code> and \`case\` blocks. In our lightweight client-side simulator, to guarantee full simulation support and correct output logging, we will implement this logic using a chained ternary conditional operator with decimal integers as outputs.</p>
`,

      taskHe: `בנו מפענח לתצוגת שבעה מקטעים (קתודה משותפת - Active High) בשם <code dir="ltr">top_module</code>. למודול כניסה בינארית של 4-ביט בשם <code dir="ltr">in</code> (הערכים מייצגים ספרות מ-0 עד 9) ויציאה של 7-ביט בשם <code dir="ltr">segments</code> הממופה לפי הסדר <code dir="ltr">{g, f, e, d, c, b, a}</code> (כאשר a הוא ביט 0 ו-g הוא ביט 6). הדליקו את המקטעים המתאימים לכל ספרה לפי התיאור התיאורטי.`,
      taskEn: `Build an active-high (common cathode) Seven-Segment Decoder named <code dir="ltr">top_module</code>. The module has a 4-bit binary input <code dir="ltr">in</code> (representing digits 0 to 9) and a 7-bit output <code dir="ltr">segments</code> mapped as <code dir="ltr">{g, f, e, d, c, b, a}</code> (where a is bit 0 and g is bit 6). Drive the outputs high to turn ON the correct segments for each digit.`,

      starterCode: `module top_module (
    input [3:0] in,
    output [6:0] segments
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output [6:0] segments
);
    assign segments = (in == 0) ? 63  :
                      (in == 1) ? 6   :
                      (in == 2) ? 91  :
                      (in == 3) ? 79  :
                      (in == 4) ? 102 :
                      (in == 5) ? 109 :
                      (in == 6) ? 125 :
                      (in == 7) ? 7   :
                      (in == 8) ? 127 :
                      (in == 9) ? 111 : 0;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, segments: 63 },
        { time: 5, in: 1, segments: 6 },
        { time: 10, in: 2, segments: 91 },
        { time: 15, in: 3, segments: 79 },
        { time: 20, in: 4, segments: 102 },
        { time: 25, in: 5, segments: 109 },
        { time: 30, in: 6, segments: 125 },
        { time: 35, in: 7, segments: 7 },
        { time: 40, in: 8, segments: 127 },
        { time: 45, in: 9, segments: 111 }
      ],

      hints: {
        he: "השתמשו באופרטור מותנה משורשר כדי לבדוק האם in שווה לכל ספרה מ-0 עד 9 והחזירו את הייצוג העשרוני שלה (למשל, עבור 0 החזירו 63, עבור 1 החזירו 6, ועבור 2 החזירו 91).",
        en: "Use a chained conditional operator to check if in matches digits 0 to 9, and return their decimal segment representations (e.g., 63 for 0, 6 for 1, and 91 for 2)."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
