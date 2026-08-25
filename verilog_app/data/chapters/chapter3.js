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
  <li>אם כניסת הבורר (<code dir="ltr">sel</code>) היא <code dir="ltr">0</code>, היציאה תתחבר לכניסה הראשונה.</li>
  <li>אם כניסת הבורר (<code dir="ltr">sel</code>) היא <code dir="ltr">1</code>, היציאה תתחבר לכניסה השנייה.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת ומשוואה לוגית 📊</h3>
<p>נניח שהכניסות הן $A$ ו-$B$, והבורר הוא $S$. טבלת האמת של המרבב היא:</p>
<table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin: 10px 0;">
  <thead>
    <tr style="background-color: var(--background-secondary);">
      <th>S (sel)</th>
      <th>Output (out)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>A</td>
    </tr>
    <tr>
      <td>1</td>
      <td>B</td>
    </tr>
  </tbody>
</table>

<p>המשוואה הלוגית המייצגת פעולה זו היא:</p>
<p align="center"><code dir="ltr">out = (sel & B) | (~sel & A)</code></p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מימוש ב-Verilog בעזרת האופרטור המותנה 📐</h3>
<p>למרות שניתן לממש מרבב באמצעות שערים לוגיים בסיסיים, הדרך המקובלת והקריאה ביותר ב-Verilog עבור מודולים צירופיים קטנים היא שימוש ב-<strong>אופרטור מותנה (Ternary Operator)</strong>:</p>
<pre dir="ltr"><code>assign out_signal = control_select ? input_if_true : input_if_false;</code></pre>
<p>מנועי סינתזה מזהים דפוס זה באופן מיידי ומייצרים חומרה ייעודית של מרבב מהיר.</p>
`,

      explanationEn: `
<h3>1. What is a Multiplexer (MUX)? 🎛️</h3>
<p>A multiplexer is a combinational logic circuit that functions as a data selector or switch. It has multiple data inputs, a single output, and a control input called the select line (<code dir="ltr">sel</code>).</p>
<p>Think of it as a <strong>railroad switch</strong>: depending on the select signal, only one specific input path is routed to the output. In a 2-to-1 MUX:</p>
<ul>
  <li>If the select signal (<code dir="ltr">sel</code>) is <code dir="ltr">0</code>, the output connects to the first input.</li>
  <li>If the select signal (<code dir="ltr">sel</code>) is <code dir="ltr">1</code>, the output connects to the second input.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Truth Table & Logical Representation 📊</h3>
<p>If we have inputs $A$ and $B$, and select line $S$, the truth table is:</p>
<table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin: 10px 0;">
  <thead>
    <tr style="background-color: var(--background-secondary);">
      <th>S (sel)</th>
      <th>Output (out)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>A</td>
    </tr>
    <tr>
      <td>1</td>
      <td>B</td>
    </tr>
  </tbody>
</table>

<p>The boolean equation is:</p>
<p align="center"><code dir="ltr">out = (sel & B) | (~sel & A)</code></p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Multiplexer in Verilog using the Ternary Operator 📐</h3>
<p>While a MUX can be built using logic gates, the standard and most readable way in Verilog for combinational logic is using the <strong>Ternary Operator (Conditional Operator)</strong>:</p>
<pre dir="ltr"><code>assign out_signal = control_select ? input_if_true : input_if_false;</code></pre>
<p>Synthesis tools automatically detect this pattern and map it to dedicated multiplexer hardware primitives.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המייצג מרבב 2-ל-1. למודול כניסות של 1-ביט בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, כניסת בקרה של 1-ביט בשם <code dir="ltr">sel</code> ויציאה של 1-ביט בשם <code dir="ltr">out</code>.
חברו את היציאה <code dir="ltr">out</code> כך שאם <code dir="ltr">sel</code> הוא <code dir="ltr">0</code> היא תקבל את <code dir="ltr">a</code>, ואם <code dir="ltr">sel</code> הוא <code dir="ltr">1</code> היא תקבל את <code dir="ltr">b</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> implementing a 2-to-1 Multiplexer. The module has 1-bit inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, a 1-bit select control <code dir="ltr">sel</code>, and a 1-bit output <code dir="ltr">out</code>.
Connect <code dir="ltr">out</code> such that it outputs <code dir="ltr">a</code> when <code dir="ltr">sel</code> is <code dir="ltr">0</code>, and <code dir="ltr">b</code> when <code dir="ltr">sel</code> is <code dir="ltr">1</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input sel,
    output out
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input sel,
    output out
);
    assign out = sel ? b : a;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, sel: 0, out: 0 },
        { time: 5, a: 1, b: 0, sel: 0, out: 1 },
        { time: 10, a: 1, b: 0, sel: 1, out: 0 },
        { time: 15, a: 1, b: 1, sel: 1, out: 1 },
        { time: 20, a: 0, b: 1, sel: 0, out: 0 }
      ],

      hints: {
        he: "השתמשו באופרטור המותנה (Ternary Operator) ב-Verilog: assign out = sel ? b : a;",
        en: "Use the Verilog ternary operator: assign out = sel ? b : a;"
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
      titleHe: "מרבב 4 ל-1 (4-to-1 MUX) 🎚️",
      titleEn: "4-to-1 MUX",

      explanationHe: `
<h3>1. מרבב 4 ל-1 (4-to-1 MUX) 🎚️</h3>
<p>כאשר יש לנו 4 מקורות מידע ונרצה לבחור אחד מהם, נצטרך מרבב 4 ל-1. כיוון שישנן 4 אפשרויות בחירה, אנו זקוקים ל-<strong>2 ביטי בקרה (Selector)</strong>, מכיוון ש-$2^2 = 4$.</p>
<p>נניח שיש לנו כניסות <code dir="ltr">in0, in1, in2, in3</code> ובורר דו-ביטי <code dir="ltr">sel[1:0]</code>:</p>
<ul>
  <li>כאשר <code dir="ltr">sel = 2'b00</code> (ערך עשרוני 0), היציאה שווה ל-<code dir="ltr">in0</code>.</li>
  <li>כאשר <code dir="ltr">sel = 2'b01</code> (ערך עשרוני 1), היציאה שווה ל-<code dir="ltr">in1</code>.</li>
  <li>כאשר <code dir="ltr">sel = 2'b10</code> (ערך עשרוני 2), היציאה שווה ל-<code dir="ltr">in2</code>.</li>
  <li>כאשר <code dir="ltr">sel = 2'b11</code> (ערך עשרוני 3), היציאה שווה ל-<code dir="ltr">in3</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש ב-Verilog באמצעות אופרטורים מותנים משורשרים 📐</h3>
<p>ניתן לשרשר (Nest) אופרטורים מותנים <code dir="ltr">? :</code> אחד בתוך השני כדי לקבל התנהגות של בחירה מרובה. לדוגמה, נניח שיש לנו בורר <code dir="ltr">select</code> וכניסות <code dir="ltr">x, y, z</code>:</p>
<pre dir="ltr"><code>assign out_val = (select == 0) ? x :
                 (select == 1) ? y : z;</code></pre>
<p>שיטה נוספת היא לבדוק ביט אחר ביט מתוך הבורר:</p>
<pre dir="ltr"><code>assign out_val = select[1] ? (select[0] ? val3 : val2) : (select[0] ? val1 : val0);</code></pre>
`,

      explanationEn: `
<h3>1. 4-to-1 Multiplexer (4-to-1 MUX) 🎚️</h3>
<p>When selecting from 4 different data sources, we need a 4-to-1 Multiplexer. Since there are 4 unique paths, we need <strong>2 select bits</strong>, because $2^2 = 4$.</p>
<p>Let's assume we have inputs <code dir="ltr">in0, in1, in2, in3</code> and a 2-bit select vector <code dir="ltr">sel[1:0]</code>:</p>
<ul>
  <li>When <code dir="ltr">sel = 2'b00</code> (decimal 0), the output is <code dir="ltr">in0</code>.</li>
  <li>When <code dir="ltr">sel = 2'b01</code> (decimal 1), the output is <code dir="ltr">in1</code>.</li>
  <li>When <code dir="ltr">sel = 2'b10</code> (decimal 2), the output is <code dir="ltr">in2</code>.</li>
  <li>When <code dir="ltr">sel = 2'b11</code> (decimal 3), the output is <code dir="ltr">in3</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Nesting Ternary Operators in Verilog 📐</h3>
<p>We can nest multiple ternary operators <code dir="ltr">? :</code> to handle multiple choices. For example, if we have a select signal and inputs <code dir="ltr">x, y, z</code>:</p>
<pre dir="ltr"><code>assign out_val = (select == 0) ? x :
                 (select == 1) ? y : z;</code></pre>
<p>Alternatively, we can index individual bits of the select vector:</p>
<pre dir="ltr"><code>assign out_val = select[1] ? (select[0] ? val3 : val2) : (select[0] ? val1 : val0);</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המייצג מרבב 4-ל-1. למודול 4 כניסות בגודל 1-ביט בשם <code dir="ltr">in0, in1, in2, in3</code>, כניסת בחירה של 2-ביט בשם <code dir="ltr">sel</code> ויציאה יחידה בשם <code dir="ltr">out</code>. חברו את היציאה לכניסה המתאימה בהתאם לערך של <code dir="ltr">sel</code>.`,
      taskEn: `Design a 4-to-1 multiplexer module named <code dir="ltr">top_module</code>. The module has four 1-bit inputs <code dir="ltr">in0, in1, in2, in3</code>, a 2-bit select vector <code dir="ltr">sel</code>, and a single output <code dir="ltr">out</code>. Route the selected input to the output based on the value of <code dir="ltr">sel</code>.`,

      starterCode: `module top_module (
    input in0,
    input in1,
    input in2,
    input in3,
    input [1:0] sel,
    output out
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input in0,
    input in1,
    input in2,
    input in3,
    input [1:0] sel,
    output out
);
    assign out = sel[1] ? (sel[0] ? in3 : in2) : (sel[0] ? in1 : in0);
endmodule`,

      expectedOutputs: [
        { time: 0, in0: 0, in1: 1, in2: 0, in3: 1, sel: 0, out: 0 },
        { time: 5, in0: 0, in1: 1, in2: 0, in3: 1, sel: 1, out: 1 },
        { time: 10, in0: 0, in1: 1, in2: 0, in3: 1, sel: 2, out: 0 },
        { time: 15, in0: 0, in1: 1, in2: 0, in3: 1, sel: 3, out: 1 },
        { time: 20, in0: 1, in1: 0, in2: 1, in3: 0, sel: 0, out: 1 }
      ],

      hints: {
        he: "שרשרו אופרטורים מותנים הבודקים את ביטי ה-sel. לדוגמה: sel[1] ? (sel[0] ? in3 : in2) : (sel[0] ? in1 : in0)",
        en: "Nest ternary operators evaluating select bits: sel[1] ? (sel[0] ? in3 : in2) : (sel[0] ? in1 : in0)"
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
      titleHe: "מרבב 8 ל-1 (8-to-1 MUX) 🎛️",
      titleEn: "8-to-1 MUX",

      explanationHe: `
<h3>1. מרבב 8 ל-1 (8-to-1 MUX) 🎛️</h3>
<p>מרבב 8 ל-1 בוחר אחד מתוך 8 ערוצי כניסה שונים. היות שישנן 8 כניסות, אנו זקוקים ל-<strong>3 ביטי בקרה (Select)</strong>, מכיוון ש-$2^3 = 8$.</p>
<p>במערכות דיגיטליות, כניסות המידע מוגדרות פעמים רבות כוקטור רחב (<code dir="ltr">input [7:0] in</code>) במקום 8 חוטים נפרדים. זה מאפשר לנו לנצל יתרון עצום של שפת Verilog.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. כוחו של אינדקס דינמי ב-Verilog 🚀</h3>
<p>במפתח קוד Verilog תקני, ניתן להשתמש במשתנה או אות שלם כאינדקס ישיר לחילוץ ביט מתוך וקטור:</p>
<pre dir="ltr"><code>assign output_val = bus[addr];</code></pre>
<p>מנוע הסינתזה מתרגם ביטוי זה אוטומטית למרבב מתאים. עם זאת, בסימולטור המקומי שלנו, אנו משתמשים במעריך ביטויים סדרתי פשוט. כדי להבטיח מעבר תקין של הסימולציה ביישומון, נממש את הבחירה באופן מפורש על ידי השוואת הבורר לכל אחד מהערכים העשרוניים (0 עד 7) וחילוץ הביט המתאים מהוקטור באמצעות אופרטורים מותנים.</p>
`,

      explanationEn: `
<h3>1. 8-to-1 Multiplexer (8-to-1 MUX) 🎛️</h3>
<p>An 8-to-1 Multiplexer selects one of 8 input lines and routes it to the output. Since there are 8 inputs, we need <strong>3 select bits</strong>, because $2^3 = 8$.</p>
<p>In digital design, these inputs are often packed together into a single multi-bit vector (<code dir="ltr">input [7:0] in</code>) instead of 8 individual wires, which allows us to simplify our code.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Dynamic Indexing in Verilog 🚀</h3>
<p>In standard Verilog, you can use a variable as an index to access a specific bit of a vector:</p>
<pre dir="ltr"><code>assign output_val = bus[addr];</code></pre>
<p>The compiler automatically creates a multiplexer. However, in our client-side simulator, expressions are evaluated sequentially. To guarantee compatibility, we can explicitly compare our selector to each decimal address value (0 to 7) and extract the corresponding bit from the vector using ternary conditionals.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המייצג מרבב 8-ל-1. למודול כניסת וקטור רחב של 8-ביט בשם <code dir="ltr">in</code>, כניסת בקרה של 3-ביט בשם <code dir="ltr">sel</code> ויציאה יחידה בשם <code dir="ltr">out</code>. השתמשו באופרטור מותנה משורשר כדי לבחור את הביט המתאים מתוך הוקטור <code dir="ltr">in</code> בהתאם לערך הבורר (למשל, עבור sel שווה ל-0 בחרו את in[0] וכו').`,
      taskEn: `Build an 8-to-1 multiplexer named <code dir="ltr">top_module</code>. The module has an 8-bit input vector <code dir="ltr">in</code>, a 3-bit select input <code dir="ltr">sel</code>, and a single output <code dir="ltr">out</code>. Use a chained conditional operator to select the appropriate bit of the vector <code dir="ltr">in</code> based on the selector value (e.g. choose in[0] when sel is 0, etc.).`,

      starterCode: `module top_module (
    input [7:0] in,
    input [2:0] sel,
    output out
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] in,
    input [2:0] sel,
    output out
);
    assign out = (sel == 0) ? in[0] :
                 (sel == 1) ? in[1] :
                 (sel == 2) ? in[2] :
                 (sel == 3) ? in[3] :
                 (sel == 4) ? in[4] :
                 (sel == 5) ? in[5] :
                 (sel == 6) ? in[6] : in[7];
endmodule`,

      expectedOutputs: [
        { time: 0, in: 170, sel: 0, out: 0 },
        { time: 5, in: 170, sel: 1, out: 1 },
        { time: 10, in: 170, sel: 2, out: 0 },
        { time: 15, in: 170, sel: 3, out: 1 },
        { time: 20, in: 170, sel: 4, out: 0 },
        { time: 25, in: 170, sel: 5, out: 1 },
        { time: 30, in: 170, sel: 6, out: 0 },
        { time: 35, in: 170, sel: 7, out: 1 }
      ],

      hints: {
        he: "כתבו שרשרת תנאים המשווה את sel למספרים 0 עד 6, ומחזירה את in[0] עד in[6] בהתאמה, ואחרת מחזירה את in[7].",
        en: "Write a chain of conditional operators comparing sel to numbers 0 to 6, returning in[0] to in[6] respectively, otherwise returning in[7]."
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
    // Lesson 21: 2-to-4 Decoder
    // --------------------------------------------------------------------------
    {
      id: 21,
      chapter: 3,
      chapterTitleHe: "פרק 3: מרבבים, מפענחים ומקודדים",
      chapterTitleEn: "Chapter 3: Multiplexers, Decoders & Encoders",
      titleHe: "מפענח 2 ל-4 (2-to-4 Decoder) 🔓",
      titleEn: "2-to-4 Decoder",

      explanationHe: `
<h3>1. מהו מפענח (Decoder)? 🔓</h3>
<p>מפענח הוא רכיב לוגי צירופי המקבל קוד בינארי של $N$ ביטים ומפעיל את אחת מתוך $2^N$ היציאות שלו (כלומר, הופך אותה ל-<code dir="ltr">1</code>, בעוד שאר היציאות נשארות <code dir="ltr">0</code>).</p>
<p>סוג זה של פלט נקרא קידוד <strong>One-Hot (סיבית חמה יחידה)</strong>, מכיוון שבכל רגע נתון רק ביט אחד בדיוק פעיל.</p>
<p>שימושים נפוצים: בחירת רכיבי זיכרון (Chip Select), פענוח פקודות במעבד, ניתוח כתובות חומרה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מפענח 2 ל-4 📐</h3>
<p>למפענח 2 ל-4 יש כניסה דו-ביטית <code dir="ltr">in[1:0]</code> ויציאה בת 4 ביטים <code dir="ltr">out[3:0]</code>:</p>
<ul>
  <li>אם הכניסה היא <code dir="ltr">0</code> (בינארי 00), היציאה היא <code dir="ltr">0001</code> (רק ביט 0 פעיל).</li>
  <li>אם הכניסה היא <code dir="ltr">1</code> (בינארי 01), היציאה היא <code dir="ltr">0010</code> (רק ביט 1 פעיל).</li>
  <li>אם הכניסה היא <code dir="ltr">2</code> (בינארי 10), היציאה היא <code dir="ltr">0100</code> (רק ביט 2 פעיל).</li>
  <li>אם הכניסה היא <code dir="ltr">3</code> (בינארי 11), היציאה היא <code dir="ltr">1000</code> (רק ביט 3 פעיל).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. טריק ההזזה שמאלה (Left Shift) 🚀</h3>
<p>במקום לכתוב תנאים מורכבים עבור כל ביט, ניתן לנצל את אופרטור ההזזה שמאלה (<code dir="ltr">&lt;&lt;</code>) ב-Verilog בצורה מבריקה:</p>
<pre dir="ltr"><code>assign out = 1 &lt;&lt; in;</code></pre>
<p>כאשר אנו מזיזים את המספר 1 שמאלה לפי הערך של הכניסה, אנו מקבלים בדיוק את הביט הפעיל בעמדה הנכונה! למשל, אם <code dir="ltr">in = 2</code>, אנו מזיזים את הביט 1 שתי עמדות שמאלה ומקבלים <code dir="ltr">4</code> (בינארי <code dir="ltr">0100</code>).</p>
`,

      explanationEn: `
<h3>1. What is a Decoder? 🔓</h3>
<p>A decoder is a combinational logic circuit that translates an $N$-bit binary input code into $2^N$ outputs, activating exactly one of them (driving it to <code dir="ltr">1</code>, while keeping all others at <code dir="ltr">0</code>).</p>
<p>This representation is called <strong>One-Hot encoding</strong>, since only a single bit is active at any given time.</p>
<p>Decoders are widely used in hardware address decoding, instruction decoders in CPUs, and chip select logic.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. 2-to-4 Decoder Logic 📐</h3>
<p>A 2-to-4 decoder has a 2-bit input <code dir="ltr">in[1:0]</code> and a 4-bit output vector <code dir="ltr">out[3:0]</code>:</p>
<ul>
  <li>If the input is <code dir="ltr">0</code> (binary 00), the output is <code dir="ltr">0001</code> (bit 0 active).</li>
  <li>If the input is <code dir="ltr">1</code> (binary 01), the output is <code dir="ltr">0010</code> (bit 1 active).</li>
  <li>If the input is <code dir="ltr">2</code> (binary 10), the output is <code dir="ltr">0100</code> (bit 2 active).</li>
  <li>If the input is <code dir="ltr">3</code> (binary 11), the output is <code dir="ltr">1000</code> (bit 3 active).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. The Left-Shift Decoder Trick 🚀</h3>
<p>Instead of writing separate boolean equations for each bit, we can use the Verilog left-shift operator (<code dir="ltr">&lt;&lt;</code>) in an elegant way:</p>
<pre dir="ltr"><code>assign out = 1 &lt;&lt; in;</code></pre>
<p>By shifting the number 1 left by the decimal value of the input, we activate exactly the bit at that index! For example, if <code dir="ltr">in = 2</code>, we shift 1 by 2 positions to get <code dir="ltr">4</code> (binary <code dir="ltr">0100</code>).</p>
`,

      taskHe: `בנו מפענח 2-ל-4 בשם <code dir="ltr">top_module</code>. כניסת המפענח היא וקטור של 2-ביט בשם <code dir="ltr">in</code>, ויציאתו היא וקטור של 4-ביט בשם <code dir="ltr">out</code>. היציאה צריכה לפעול בצורה של One-Hot (רק ביט אחד דולק בהתאם לערך הכניסה).`,
      taskEn: `Create a 2-to-4 decoder named <code dir="ltr">top_module</code>. The input is a 2-bit vector <code dir="ltr">in</code> and the output is a 4-bit vector <code dir="ltr">out</code>. The output must be One-Hot encoded, where only the bit at the index specified by the binary input is high.`,

      starterCode: `module top_module (
    input [1:0] in,
    output [3:0] out
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [1:0] in,
    output [3:0] out
);
    assign out = 1 << in;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 1 },
        { time: 5, in: 1, out: 2 },
        { time: 10, in: 2, out: 4 },
        { time: 15, in: 3, out: 8 }
      ],

      hints: {
        he: "השתמשו באופרטור הזזה שמאלה: assign out = 1 << in;",
        en: "Use the left shift operator: assign out = 1 << in;"
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
      titleHe: "מפענח 3 ל-8 (3-to-8 Decoder) 🔓",
      titleEn: "3-to-8 Decoder",

      explanationHe: `
<h3>1. מפענח 3 ל-8 (3-to-8 Decoder) 🔓</h3>
<p>מפענח 3 ל-8 מרחיב את מושג הפענוח ל-3 כניסות ו-8 יציאות. כאשר הוא מאופשר, הוא מקבל כניסה בת 3 ביטים ומפעיל את היציאה המתאימה מתוך ה-8 (מ-0 עד 7).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חשיבות כניסת האפשור (Enable) 🔌</h3>
<p>ברכיבי חומרה אמיתיים, מפענחים כוללים לרוב פין בקרה נוסף בשם <strong>Enable (אפשור)</strong>. פין זה מאפשר לשתק את הרכיב כולו:</p>
<ul>
  <li>אם כניסת ה-<strong>Enable</strong> היא <code dir="ltr">0</code>, המפענח כבוי, וכל 8 היציאות שלו יהיו שוות ל-<code dir="ltr">0</code>.</li>
  <li>אם כניסת ה-<strong>Enable</strong> היא <code dir="ltr">1</code>, המפענח פועל כרגיל ומבצע את הפענוח.</li>
</ul>
<p>פין האפשור קריטי בחיבור רכיבים מרובים לאותו אוטובוס נתונים משותף, כדי למנוע התנגשויות בחומרה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. שילוב Enable ב-Verilog 📐</h3>
<p>ניתן לשלב את אות האפשור עם לוגיקת ההזזה בעזרת אופרטור מותנה:</p>
<pre dir="ltr"><code>assign out_bus = en_signal ? (1 &lt;&lt; address) : 0;</code></pre>
<p>במידה ו-\`en_signal\` פעיל, מתבצעת ההזזה שמאלה ומקבלים קוד One-Hot, אחרת כל היציאות מאופסות.</p>
`,

      explanationEn: `
<h3>1. 3-to-8 Decoder 🔓</h3>
<p>A 3-to-8 decoder maps a 3-bit binary input to one of 8 outputs (indexed 0 to 7). When active, it turns on exactly the output line indicated by the binary input value.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Role of the Enable Signal 🔌</h3>
<p>In physical hardware, decoders often include an extra control input called <strong>Enable</strong>. This signal acts as a master switch:</p>
<ul>
  <li>If the <strong>Enable</strong> input is <code dir="ltr">0</code>, the decoder is disabled, forcing all 8 outputs to <code dir="ltr">0</code> regardless of the input code.</li>
  <li>If the <strong>Enable</strong> input is <code dir="ltr">1</code>, the decoder is active and functions normally.</li>
</ul>
<p>Enable pins are crucial when sharing a bus among multiple devices, preventing hardware contention by ensuring only one device is active at a time.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Incorporating Enable in Verilog 📐</h3>
<p>You can easily incorporate an enable signal into your left-shift decoding logic using a ternary operator:</p>
<pre dir="ltr"><code>assign out_bus = en_signal ? (1 &lt;&lt; address) : 0;</code></pre>
<p>If \`en_signal\` is active, the left shift executes, yielding a One-Hot code. Otherwise, the output is driven to all zeros.</p>
`,

      taskHe: `בנו מפענח 3-ל-8 בעל כניסת אפשור (Enable) בשם <code dir="ltr">top_module</code>. למודול כניסת נתונים של 3-ביט בשם <code dir="ltr">in</code>, כניסת אפשור של 1-ביט בשם <code dir="ltr">enable</code> ויציאת וקטור של 8-ביט בשם <code dir="ltr">out</code>. אם <code dir="ltr">enable</code> הוא 0, כל היציאות צריכות להיות 0. אם <code dir="ltr">enable</code> הוא 1, המודול יפענח את הכניסה כרגיל.`,
      taskEn: `Build a 3-to-8 decoder with an enable pin named <code dir="ltr">top_module</code>. It has a 3-bit input <code dir="ltr">in</code>, a 1-bit input <code dir="ltr">enable</code>, and an 8-bit output vector <code dir="ltr">out</code>. If <code dir="ltr">enable</code> is 0, all outputs must be 0. If <code dir="ltr">enable</code> is 1, the module should perform normal 3-to-8 decoding.`,

      starterCode: `module top_module (
    input [2:0] in,
    input enable,
    output [7:0] out
);
    // כתבו את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [2:0] in,
    input enable,
    output [7:0] out
);
    assign out = enable ? (1 << in) : 0;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 3, enable: 0, out: 0 },
        { time: 5, in: 0, enable: 1, out: 1 },
        { time: 10, in: 3, enable: 1, out: 8 },
        { time: 15, in: 7, enable: 1, out: 128 },
        { time: 20, in: 7, enable: 0, out: 0 }
      ],

      hints: {
        he: "שלבו את אות ה-enable בעזרת אופרטור מותנה. אם הוא 1, בצעו הזזה של (1 << in), אחרת החזירו 0.",
        en: "Combine the enable signal using a conditional operator. If active, shift (1 << in), otherwise return 0."
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
