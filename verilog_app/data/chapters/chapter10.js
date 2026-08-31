/* ==========================================================================
   VeriLearn Curriculum — Chapter 10: Advanced Designs & Special Topics (Lessons 74 to 80)
   ========================================================================== */

(function() {
  const chapter10Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 74: Array Multiplier (4x4 bit)
    // --------------------------------------------------------------------------
    {
      id: 74,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "מכפיל מטריצה (Array Multiplier 4x4) ✖️",
      titleEn: "4x4 Bit Array Multiplier",

      explanationHe: `
<h3>1. פעולת הכפל הבינארי בחומרה ✖️</h3>
<p>פעולת הכפל היא אחת הפעולות הבסיסיות והחשובות ביותר במעבדים, במיוחד במעבדי אותות ספרתיים (DSP). כפל בינארי מבוסס על אותו עיקרון של כפל ארוך בשיטה העשרונית (באמצעות נייר ועיפרון):</p>
<ul>
    <li>מייצרים <strong>מכפלות חלקיות (Partial Products)</strong> על ידי הכפלת כל סיבית של הכופל (Multiplier) בכל סיביות המוgeneral (Multiplicand).</li>
    <li>מסיטים כל מכפלה חלקית שמאלה בהתאם למיקום הסיבית שלה.</li>
    <li>מחברים את כל המכפלות החלקיות המוסטות לקבלת התוצאה הסופית.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה של מכפיל מטריצה (Array Multiplier) 📐</h3>
<p>במבנה הפיזי של מכפיל מטריצה, אנו משתמשים בטכנולוגיה הבאה:</p>
<ul>
    <li>שערי <strong>AND</strong> משמשים לחישוב ביטי המכפלות החלקיות (מאחר ש-<code>1 x 1 = 1</code> וכל שילוב אחר נותן <code>0</code>).</li>
    <li>מטריצה דו-ממדית של <strong>מסיפים מלאים (Full Adders)</strong> ו<strong>מסיפים חציים (Half Adders)</strong> כדי לחבר את המכפלות החלקיות במקביל.</li>
</ul>
<p>לדוגמה, עבור כפל של 2 ביט ב-2 ביט (X ו-Y), המכפלות החלקיות הן:</p>
<pre dir="ltr"><code>  X1 X0
x Y1 Y0
-------
  (X0&Y0)  (X1&Y0)
+ (X0&Y1)  (X1&Y1)  <- מוסט שמאלה</code></pre>
<p>בסך הכל, כפל של שני מספרים ברוחב N ביט יפיק תוצאה ברוחב של עד <strong>2N ביט</strong>. זמן התפשטות האות (Propagation Delay) במכפיל מטריצה פשוט הוא מסדר גודל של O(N) בשל מעבר ה-Carry לאורך הרכיבים.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. כפל ב-Verilog וכתיבה סינתזבילית 💻</h3>
<p>ב-Verilog מודרני, אין צורך לממש שערי AND ומסיפים ברמת השערים (Gate-level) עבור כפל פשוט. המהדר (Synthesizer) חכם מספיק לזהות את אופרטור הכפל המובנה <code>*</code> ולתרגם אותו למכפיל החומרה האופטימלי ביותר (כמו Wallace Tree או בלוקי כפל ייעודיים ב-FPGA שנקראים DSP Slices).</p>
<p>דוגמה כללית לכפל של 3 ביט המניב תוצאה של 6 ביט:</p>
<pre dir="ltr"><code>module generic_multiplier (
    input  [2:0] val_a,
    input  [2:0] val_b,
    output [5:0] product
);
    assign product = val_a * val_b;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Binary Multiplication in Hardware ✖️</h3>
<p>Multiplication is a fundamental arithmetic operation in processors, particularly in Digital Signal Processors (DSPs). Binary multiplication follows the same paper-and-pencil algorithm used in decimal multiplication:</p>
<ul>
    <li>Generate <strong>partial products</strong> by multiplying each bit of the multiplier by the multiplicand.</li>
    <li>Shift each partial product to the left according to the weight of the multiplier bit.</li>
    <li>Sum all shifted partial products to produce the final product.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Array Multiplier Architecture 📐</h3>
<p>An Array Multiplier physically implements this 2D grid using hardware components:</p>
<ul>
    <li><strong>AND gates</strong> calculate individual partial product bits (since <code>A_i AND B_j</code> represents <code>A_i * B_j</code>).</li>
    <li>A 2D array of <strong>Half Adders (HA)</strong> and <strong>Full Adders (FA)</strong> accumulates the shifted rows.</li>
</ul>
<p>For an N-bit by N-bit multiplier, the final output requires <strong>2N bits</strong> to avoid overflow. The propagation delay of a basic array multiplier is O(N) due to the carry ripple effect through the adder cells.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Behavioral Multiplication in Verilog 💻</h3>
<p>In modern synthesizable Verilog, rather than manually routing gates and adders, we can use the high-level multiplication operator <code>*</code>. The synthesis tool automatically maps this operator to an optimized hardware structure (such as a Booth multiplier, a Wallace Tree, or specialized DSP slices inside FPGAs).</p>
<p>Generic example of a 3-bit multiplier producing a 6-bit output:</p>
<pre dir="ltr"><code>module generic_multiplier (
    input  [2:0] val_a,
    input  [2:0] val_b,
    output [5:0] product
);
    assign product = val_a * val_b;
endmodule</code></pre>
`,

      taskHe: `ממשו מכפיל של 4 ביט על 4 ביט.
כניסות המודול: <code>[3:0] a</code>, <code>[3:0] b</code>.
יציאת המודול: <code>[7:0] p</code>.
ממשו את המכפיל בצורה התנהגותית המאפשרת למהדר לבנות את המכפיל באופן אוטומטי.`,
      taskEn: `Implement a 4-bit by 4-bit multiplier.
Module inputs: <code>[3:0] a</code>, <code>[3:0] b</code>.
Module output: <code>[7:0] p</code>.
Write a behavioral implementation that allows the compiler to infer the hardware multiplier automatically.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output [7:0] p
);
    // כתבו את הקוד שלכם כאן / Write your code here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output [7:0] p
);
    assign p = a * b;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, p: 0 },
        { time: 5, a: 3, b: 5, p: 15 },
        { time: 10, a: 15, b: 15, p: 225 },
        { time: 15, a: 10, b: 10, p: 100 },
        { time: 20, a: 12, b: 8, p: 96 }
      ],

      hints: {
        he: "השתמשו באופרטור הכפל המובנה של Verilog: assign p = a * b;",
        en: "Use Verilog's built-in multiplication operator: assign p = a * b;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 75: Carry-Lookahead Adder (CLA)
    // --------------------------------------------------------------------------
    {
      id: 75,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "מסיף מקדים נשיאה (Carry-Lookahead Adder - CLA) ⚡",
      titleEn: "Carry-Lookahead Adder (CLA)",

      explanationHe: `
<h3>1. הבעיה במסיף טורי (Ripple Carry Adder) 🐢</h3>
<p>במסיף טורי (RCA), כל מסיף מלא (Full Adder) חייב להמתין להפקת ה-Carry-out מהמסיף שלפניו. זמן ההתפשטות הזה גדל ליניארית עם רוחב המילים (O(N)), מה שמהווה את צוואר הבקבוק המרכזי במהירות הפעולה של ה-ALU.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. רעיון מקדים הנשיאה (Carry-Lookahead) ⚡</h3>
<p>מסיף מקדים נשיאה (CLA) פותר בעיה זו על ידי חישוב מראש של כל אותות הנשיאה במקביל, במחיר של שטח חומרה נוסף.
עבור כל דרגה i, אנו מגדירים שני אותות עזר:</p>
<ul>
    <li><strong>Generate (ייצור נשיאה - G):</strong> דרגה i מייצרת נשיאה באופן עצמאי אם שני הקלטים שלה הם 1.
        <br><code dir="ltr">G_i = A_i & B_i</code></li>
    <li><strong>Propagate (העברת נשיאה - P):</strong> דרגה i מעבירה את הנשיאה מהדרגה הקודמת לדרגה הבאה אם לפחות אחד מהקלטים שלה הוא 1 (מיוצג לרוב על ידי XOR).
        <br><code dir="ltr">P_i = A_i ^ B_i</code></li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. משוואות ה-Carry של ה-CLA 📐</h3>
<p>בעזרת האותות הללו, אנו יכולים לכתוב ביטוי לכל נשיאה ביניים ישירות מתוך ה-Carry-in הראשי (C_0) ללא תלות בנשיאות הקודמות:</p>
<ul>
    <li><code>C_1 = G_0 | (P_0 & C_0)</code></li>
    <li><code>C_2 = G_1 | (P_1 & G_0) | (P_1 & P_0 & C_0)</code></li>
    <li><code>C_3 = G_2 | (P_2 & G_1) | (P_2 & P_1 & G_0) | (P_2 & P_1 & P_0 & C_0)</code></li>
    <li><code>C_4 = G_3 | (P_3 & G_2) | (P_3 & P_2 & G_1) | (P_3 & P_2 & P_1 & G_0) | (P_3 & P_2 & P_1 & P_0 & C_0)</code></li>
</ul>
<p>לאחר חישוב כל הנשיאות (C_1 עד C_4), הסכום הסופי מחושב במקביל:</p>
<p><code dir="ltr">Sum_i = P_i ^ C_i</code> (כאשר C_0 הוא ה-cin הראשי).</p>

<p>דוגמה כללית של CLA בגודל 2 ביט:</p>
<pre dir="ltr"><code>module cla_2bit (
    input [1:0] x,
    input [1:0] y,
    input c_in,
    output [1:0] s,
    output c_out
);
    wire [1:0] p = x ^ y;
    wire [1:0] g = x & y;

    wire c1 = g[0] | (p[0] & c_in);
    wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c_in);

    assign s[0] = p[0] ^ c_in;
    assign s[1] = p[1] ^ c1;
    assign c_out = c2;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Ripple Carry Bottleneck 🐢</h3>
<p>In a Ripple Carry Adder (RCA), each stage must wait for the carry bit to propagate from the previous Full Adder. This sequential dependency creates a critical path delay that scales linearly with word size (O(N)), limiting the clock frequency of the processor's ALU.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Carry-Lookahead Principle ⚡</h3>
<p>A Carry-Lookahead Adder (CLA) bypasses this bottleneck by computing all intermediate carries in parallel using combinational logic.
For each bit stage i, we define two auxiliary terms:</p>
<ul>
    <li><strong>Generate (G_i):</strong> Stage i produces a carry out regardless of the incoming carry.
        <br><code dir="ltr">G_i = A_i & B_i</code></li>
    <li><strong>Propagate (P_i):</strong> Stage i passes an incoming carry to the next stage.
        <br><code dir="ltr">P_i = A_i ^ B_i</code></li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. CLA Carry Equations 📐</h3>
<p>Using generate and propagate, the intermediate carries can be expressed directly in terms of the primary carry-in (C_0), eliminating sequential logic depth:</p>
<ul>
    <li><code>C_1 = G_0 | (P_0 & C_0)</code></li>
    <li><code>C_2 = G_1 | (P_1 & G_0) | (P_1 & P_0 & C_0)</code></li>
    <li><code>C_3 = G_2 | (P_2 & G_1) | (P_2 & P_1 & G_0) | (P_2 & P_1 & P_0 & C_0)</code></li>
    <li><code>C_4 = G_3 | (P_3 & G_2) | (P_3 & P_2 & G_1) | (P_3 & P_2 & P_1 & G_0) | (P_3 & P_2 & P_1 & P_0 & C_0)</code></li>
</ul>
<p>Once all carries are computed, the sum is generated in parallel:</p>
<p><code dir="ltr">Sum_i = P_i ^ C_i</code> (where C_0 is the primary carry-in).</p>

<p>Generic 2-bit CLA example:</p>
<pre dir="ltr"><code>module cla_2bit (
    input [1:0] x,
    input [1:0] y,
    input c_in,
    output [1:0] s,
    output c_out
);
    wire [1:0] p = x ^ y;
    wire [1:0] g = x & y;

    wire c1 = g[0] | (p[0] & c_in);
    wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c_in);

    assign s[0] = p[0] ^ c_in;
    assign s[1] = p[1] ^ c1;
    assign c_out = c2;
endmodule</code></pre>
`,

      taskHe: `ממשו מסיף מקדים נשיאה (CLA) בגודל 4 ביט.
כניסות: <code>[3:0] a</code>, <code>[3:0] b</code>, <code>cin</code>.
יציאות: <code>[3:0] sum</code>, <code>cout</code>.
עליכם לחשב תחילה את אותות ה-p וה-g עבור כל ביט, לאחר מכן לייצר את נשיאות הביניים לפי הנוסחאות של CLA, ולבסוף לחשב את ה-sum וה-cout.`,
      taskEn: `Implement a 4-bit Carry-Lookahead Adder (CLA).
Inputs: <code>[3:0] a</code>, <code>[3:0] b</code>, <code>cin</code>.
Outputs: <code>[3:0] sum</code>, <code>cout</code>.
Calculate the generate (g) and propagate (p) signals for each stage, compute the intermediate carries using the CLA equations, and then output the sum and cout.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);
    // ממשו את לוגיקת ה-CLA כאן / Implement the CLA logic here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);
    wire [3:0] p = a ^ b;
    wire [3:0] g = a & b;

    wire c1 = g[0] | (p[0] & cin);
    wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & cin);
    wire c3 = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & cin);
    wire c4 = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1]) | (p[3] & p[2] & p[1] & g[0]) | (p[3] & p[2] & p[1] & p[0] & cin);

    assign sum[0] = p[0] ^ cin;
    assign sum[1] = p[1] ^ c1;
    assign sum[2] = p[2] ^ c2;
    assign sum[3] = p[3] ^ c3;
    assign cout = c4;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
        { time: 5, a: 3, b: 5, cin: 0, sum: 8, cout: 0 },
        { time: 10, a: 15, b: 1, cin: 0, sum: 0, cout: 1 },
        { time: 15, a: 10, b: 5, cin: 1, sum: 0, cout: 1 },
        { time: 20, a: 12, b: 3, cin: 0, sum: 15, cout: 0 },
        { time: 25, a: 7, b: 8, cin: 1, sum: 0, cout: 1 }
      ],

      hints: {
        he: "ממשו את משוואות ה-Carry של CLA. לדוגמה: c1 = g[0] | (p[0] & cin);",
        en: "Implement the carry equations for CLA. For example: c1 = g[0] | (p[0] & cin);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 76: Barrel Shifter
    // --------------------------------------------------------------------------
    {
      id: 76,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "מזיז חביות (Barrel Shifter) 🌀",
      titleEn: "Barrel Shifter",

      explanationHe: `
<h3>1. למה צריך Barrel Shifter? 🌀</h3>
<p>אוגר הזזה (Shift Register) רגיל יכול להזיז את המידע בסיבית אחת בלבד בכל מחזור שעון. אם נרצה להזיז מילה של 32 ביט ב-15 מקומות ימינה, נצטרך להמתין 15 מחזורי שעון שלמים.</p>
<p><strong>Barrel Shifter (מזיז חביות)</strong> הוא רכיב קומבינטורי טהור המסוגל להזיז מילת נתונים במספר משתנה של סיביות <strong>בתוך מחזור שעון יחיד!</strong></p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה לוגריתמי של מזיז חביות 📐</h3>
<p>כדי לבנות מזיז חביות יעיל המאפשר הזזה של N סיביות, אנו משתמשים במבנה של דרגות מולטיפלקסרים (Multiplexers) המשורשרות זו לזו. מספר הדרגות הנדרש הוא <code>log2(N)</code>.</p>
<p>לדוגמה, עבור מזיז חביות בגודל 8 ביט, ישנן 3 דרגות (מאחר ש-<code>log2(8) = 3</code>):</p>
<ul>
    <li><strong>דרגה 0:</strong> מזיזה את המילה ב-4 סיביות אם <code>shift[2] == 1</code>, או מעבירה אותה ללא שינוי אם הוא <code>0</code>.</li>
    <li><strong>דרגה 1:</strong> מזיזה את התוצאה של דרגה 0 ב-2 סיביות אם <code>shift[1] == 1</code>, או מעבירה ללא שינוי.</li>
    <li><strong>דרגה 2:</strong> מזיזה את התוצאה של דרגה 1 בסיבית אחת אם <code>shift[0] == 1</code>, או מעבירה ללא שינוי.</li>
</ul>

<p>דוגמה כללית של מזיז שמאלה לוגי (LSL) בגודל 4 ביט המשתמש במבנה לוגריתמי:</p>
<pre dir="ltr"><code>module barrel_left_4bit (
    input [3:0] data_in,
    input [1:0] shamt,
    output [3:0] data_out
);
    // שלב ראשון: הזזה ב-2 ביט
    wire [3:0] stage1 = shamt[1] ? {data_in[1:0], 2'b00} : data_in;
    // שלב שני: הזזה ב-1 ביט
    assign data_out = shamt[0] ? {stage1[2:0], 1'b0} : stage1;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Why Use a Barrel Shifter? 🌀</h3>
<p>A standard sequential shift register can only shift data by one bit per clock cycle. Shifting a 32-bit register by 15 positions would therefore require 15 clock cycles.</p>
<p>A <strong>Barrel Shifter</strong> is a purely combinational circuit that can shift a data word by a variable number of bits <strong>in a single clock cycle</strong>!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Logarithmic Mux Stages 📐</h3>
<p>To implement an efficient variable-width shifter, we arrange multiplexers in cascaded stages. An N-bit barrel shifter requires <code>log2(N)</code> stages.</p>
<p>For an 8-bit shifter, there are 3 stages (since <code>log2(8) = 3</code>):</p>
<ul>
    <li><strong>Stage 0 (controlled by shift[2]):</strong> Shifts the input by 4 bits if active, or passes it unchanged.</li>
    <li><strong>Stage 1 (controlled by shift[1]):</strong> Shifts the previous stage by 2 bits if active, or passes it.</li>
    <li><strong>Stage 2 (controlled by shift[0]):</strong> Shifts the previous stage by 1 bit if active, or passes it.</li>
</ul>

<p>Generic example of a 4-bit logical left barrel shifter using logarithmic stages:</p>
<pre dir="ltr"><code>module barrel_left_4bit (
    input [3:0] data_in,
    input [1:0] shamt,
    output [3:0] data_out
);
    // Stage 1: Conditional shift left by 2
    wire [3:0] stage1 = shamt[1] ? {data_in[1:0], 2'b00} : data_in;
    // Stage 2: Conditional shift left by 1
    assign data_out = shamt[0] ? {stage1[2:0], 1'b0} : stage1;
endmodule</code></pre>
`,

      taskHe: `ממשו מזיז חביות לוגי ימני (Logical Right Barrel Shifter) בגודל 8 ביט.
כניסות: <code>[7:0] in</code>, <code>[2:0] shift</code>.
יציאה: <code>[7:0] out</code>.
הרכיב צריך להסיט ימינה את <code>in</code> במספר סיביות השווה ל-<code>shift</code>, ולמלא את הסיביות הפנויות משמאל ב-0. ממשו את הרכיב בצורה קומבינטורית באמצעות שלבים לוגריתמיים.`,
      taskEn: `Design an 8-bit logical right barrel shifter.
Inputs: <code>[7:0] in</code>, <code>[2:0] shift</code>.
Output: <code>[7:0] out</code>.
The circuit must shift the input <code>in</code> to the right by <code>shift</code> positions, filling the newly vacated bits on the left with 0s. Implement this combinational block using logarithmic stages.`,

      starterCode: `module top_module (
    input [7:0] in,
    input [2:0] shift,
    output [7:0] out
);
    // ממשו את מזיז החביות כאן / Implement the barrel shifter here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] in,
    input [2:0] shift,
    output [7:0] out
);
    wire [7:0] s2 = shift[2] ? {4'b0000, in[7:4]} : in;
    wire [7:0] s1 = shift[1] ? {2'b00, s2[7:2]} : s2;
    assign out = shift[0] ? {1'b0, s1[7:1]} : s1;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 255, shift: 0, out: 255 },
        { time: 5, in: 255, shift: 1, out: 127 },
        { time: 10, in: 255, shift: 3, out: 31 },
        { time: 15, in: 255, shift: 7, out: 1 },
        { time: 20, in: 160, shift: 2, out: 40 },
        { time: 25, in: 85, shift: 4, out: 5 }
      ],

      hints: {
        he: "צרו שלושה שלבי הזזה בעזרת חוטי ביניים (s2, s1 וכו'), כאשר כל שלב בודק ביט יחיד של shift.",
        en: "Create three shifting stages using intermediate wires (s2, s1, etc.), where each stage checks a single bit of shift."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 77: Full 16-bit ALU
    // --------------------------------------------------------------------------
    {
      id: 77,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "יחידה אריתמטית-לוגית מלאה (Full 16-bit ALU) 🎛️",
      titleEn: "Full 16-bit ALU",

      explanationHe: `
<h3>1. מהי יחידה אריתמטית-לוגית (ALU)? 🎛️</h3>
<p>ה-<strong>ALU (Arithmetic Logic Unit - יחידה אריתמטית-לוגית)</strong> היא הלב החישובי המרכזי של כל מעבד (CPU), יחידת עיבוד גרפית (GPU) ובקר ספרתי. תפקידה לקבל שני אופרנדים נתונים (אופרנד $A$ ואופרנד $B$), לבצע עליהם פעולה חשבונית או לוגית בהתאם לקוד בקרה (Opcode / Operation Selector), ולהפיק את תוצאת החישוב ביציאה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארכיטקטורת אבני הבניין של ה-ALU 🏗️</h3>
<p>בתכנון שבבים מקצועי, ה-ALU אינה נבנית כגוש קוד מונוליטי אחיד, אלא מורכבת מ<strong>תת-יחידות חומרתיות מודולריות (Building Blocks)</strong> שלמדנו בפרקים הקודמים:</p>

<ol>
  <li><strong>היחידה האריתמטית (Arithmetic Unit):</strong>
    <p>נשענת על מודולי המסיפים (Full Adders ו-Ripple Carry Adders מפרקים 2, 3 ו-4). היחידה מחשבת במקביל תוצאת <strong>חיבור ($A + B$)</strong> ותוצאת <strong>חיסור ($A - B$)</strong>. כזכור, חיסור מבוצע באמצעות ייצוג משלים ל-2: הפיכת הביטים של $B$ והוספת נשיאה בכניסה ($A + \sim B + 1$).</p>
  </li>
  <li><strong>היחידה הלוגית (Logic Unit):</strong>
    <p>נשענת על מערכי שערים לוגיים בסיסיים (שנלמדו בפרק 1). היחידה מחשבת במקביל פעולות סיביות על כל 16 הביטים: <strong>AND</strong> (<code dir="ltr">a &amp; b</code>), <strong>OR</strong> (<code dir="ltr">a | b</code>), <strong>XOR</strong> (<code dir="ltr">a ^ b</code>), ו-<strong>NOR</strong> (<code dir="ltr">~(a | b)</code>).</p>
  </li>
  <li><strong>יחידת ההזזה (Shift Unit):</strong>
    <p>נשענת על עקרונות ה-Barrel Shifter (משיעור 76). מבצעת הזזה לוגית שמאלה (<strong>SLL</strong> - <code dir="ltr">a &lt;&lt; b[3:0]</code>) והזזה לוגית ימינה (<strong>SRL</strong> - <code dir="ltr">a &gt;&gt; b[3:0]</code>) במספר סיביות המוגדר על ידי 4 הביטים הנמוכים של $B$.</p>
  </li>
  <li><strong>מרבב בחירת התוצאה (Multiplexer Selection Unit):</strong>
    <p>נשען על מרבב 8 ל-1 רב-ביטי (Multiplexer מפרק 3). המרבב מקבל את כל 8 התוצאות המוכנות מראש מהיחידות השונות, ובורר את התוצאה המבוקשת ליציאת ה-ALU בהתאם לקוד הבקרה <code dir="ltr">op[2:0]</code>.</p>
  </li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. תרשים בלוקים וחיווט היררכי 📐</h3>
<p>התרשים הבא ממחיש את זרימת הנתונים בתוך ה-ALU: הנתונים <code dir="ltr">a</code> ו-<code dir="ltr">b</code> מוזנים במקביל לכל יחידות החישוב, והמרבב בורר את המוצא לפי <code dir="ltr">op</code>:</p>

<pre dir="ltr"><code>                    ┌────────────────────────────────────────────────────────┐
                    │                      16-bit ALU                        │
                    │                                                        │
 a[15:0], b[15:0] ──┼─┬──────────────┬──────────────┬──────────────────────┐ │
                    │ │              │              │                      │ │
                    │ ▼              ▼              ▼                      ▼ │
                    │┌─────────────┐┌─────────────┐┌────────────────────┐ ┌───────────────┐
                    ││ Adder Block ││ Sub Block   ││ Bitwise Logic Unit │ │ Shifter Unit  │
                    ││ (a + b)     ││ (a - b)     ││ (AND, OR, XOR, NOR)│ │ (SLL, SRL)    │
                    │└──────┬──────┘└──────┬──────┘└──┬───┬───┬───┬─────┘ └───┬───────┬───┘
                    │       │res_add       │res_sub   │   │   │   │res_nor    │res_sll│res_srl
                    │       │              │          │   │   └───┼───────────┼───┐   │
                    │       │              │   res_and│   │res_or │res_xor    │   │   │
                    │       │              │          │   │   ┌───┘           │   │   │
                    │       ▼              ▼          ▼   ▼   ▼               ▼   ▼   ▼
                    │   ┌───────────────────────────────────────────────────────────────┐
                    │   │              8-to-1 Multiplexer (Mux Unit)                    │
  op[2:0] ──────────┼──►│  [000:ADD, 001:SUB, 010:AND, 011:OR, 100:XOR, 101:NOR, ...]   │
                    │   └───────────────────────────────┬───────────────────────────────┘
                    │                                   │
                    │                                   ▼
                    │                               out[15:0]
                    └────────────────────────────────────────────────────────┘</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. טבלת קודי הפעולה של ה-ALU 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>op[2:0]</th><th>סוג יחידה</th><th>פעולה</th><th>ביטוי ב-Verilog</th><th>תיאור</th></tr>
  </thead>
  <tbody>
    <tr><td><code>3'b000</code></td><td>Arithmetic</td><td>ADD</td><td><code>a + b</code></td><td>חיבור בינארי של 16 ביט</td></tr>
    <tr><td><code>3'b001</code></td><td>Arithmetic</td><td>SUB</td><td><code>a - b</code></td><td>חיסור בינארי בשיטת המשלים ל-2</td></tr>
    <tr><td><code>3'b010</code></td><td>Logic</td><td>AND</td><td><code>a &amp; b</code></td><td>וגם לוגי ביט-ביט (Bitwise AND)</td></tr>
    <tr><td><code>3'b011</code></td><td>Logic</td><td>OR</td><td><code>a | b</code></td><td>או לוגי ביט-ביט (Bitwise OR)</td></tr>
    <tr><td><code>3'b100</code></td><td>Logic</td><td>XOR</td><td><code>a ^ b</code></td><td>או-בלעדי לוגי ביט-ביט (Bitwise XOR)</td></tr>
    <tr><td><code>3'b101</code></td><td>Logic</td><td>NOR</td><td><code>~(a | b)</code></td><td>לא-או לוגי ביט-ביט (Bitwise NOR)</td></tr>
    <tr><td><code>3'b110</code></td><td>Shift</td><td>SLL</td><td><code>a &lt;&lt; b[3:0]</code></td><td>הזזה לוגית שמאלה לפי 4 ביטים נמוכים</td></tr>
    <tr><td><code>3'b111</code></td><td>Shift</td><td>SRL</td><td><code>a &gt;&gt; b[3:0]</code></td><td>הזזה לוגית ימינה לפי 4 ביטים נמוכים</td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>5. דוגמת מידול ב-Verilog 💻</h3>
<p>להלן מבנה מודולרי נקי המפריד בין יחידות החישוב השונות לבין מרבב בחירת הפעולה:</p>

<pre dir="ltr"><code>module modular_alu_example (
    input  [15:0] a,
    input  [15:0] b,
    input  [2:0]  op,
    output reg [15:0] out
);
    // אבני בניין: חישוב מראש של תוצאות היחידות השונות
    wire [15:0] res_add = a + b;
    wire [15:0] res_sub = a - b;
    wire [15:0] res_and = a & b;
    wire [15:0] res_or  = a | b;
    wire [15:0] res_xor = a ^ b;
    wire [15:0] res_nor = ~(a | b);
    wire [15:0] res_sll = a << b[3:0];
    wire [15:0] res_srl = a >> b[3:0];

    // מרבב 8-ל-1 לבחירת המוצא
    always @(*) begin
        case (op)
            3'b000: out = res_add;
            3'b001: out = res_sub;
            3'b010: out = res_and;
            3'b011: out = res_or;
            3'b100: out = res_xor;
            3'b101: out = res_nor;
            3'b110: out = res_sll;
            3'b111: out = res_srl;
            default: out = 16'h0000;
        endcase
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is an Arithmetic Logic Unit (ALU)? 🎛️</h3>
<p>The <strong>ALU (Arithmetic Logic Unit)</strong> is the fundamental computational engine at the core of every CPU (RISC-V, ARM, x86), GPU, and digital signal processor. It takes two operand words ($A$ and $B$), executes an arithmetic or logical operation instructed by an operation code (Opcode / Control Code), and outputs the resulting calculation.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Building Blocks Architecture of an ALU 🏗️</h3>
<p>In modern digital design, an ALU is never created as an unstructured monolith. Instead, it is partitioned cleanly into <strong>modular hardware sub-blocks</strong> built upon previous concepts:</p>

<ol>
  <li><strong>Arithmetic Unit (AU):</strong>
    <p>Built upon adder/subtractor circuits (hierarchically composed of Full Adders and Ripple Carry Adder chains from Chapters 2, 3, and 4). Computes both <strong>Addition ($A + B$)</strong> and <strong>Subtraction ($A - B$)</strong> in parallel. Subtraction is performed via two's complement inversion: ($A + \sim B + 1$).</p>
  </li>
  <li><strong>Logic Unit (LU):</strong>
    <p>Built upon bitwise parallel logic gates (from Chapter 1). Computes 16-bit bitwise boolean operations simultaneously: <strong>AND</strong> (<code dir="ltr">a &amp; b</code>), <strong>OR</strong> (<code dir="ltr">a | b</code>), <strong>XOR</strong> (<code dir="ltr">a ^ b</code>), and <strong>NOR</strong> (<code dir="ltr">~(a | b)</code>).</p>
  </li>
  <li><strong>Shift Unit (SU):</strong>
    <p>Built upon Barrel Shifter logarithmic stages (from Lesson 76). Computes Logical Shift Left (<strong>SLL</strong> - <code dir="ltr">a &lt;&lt; b[3:0]</code>) and Logical Shift Right (<strong>SRL</strong> - <code dir="ltr">a &gt;&gt; b[3:0]</code>) using the lower 4 bits of $B$ as the shift amount.</p>
  </li>
  <li><strong>Multiplexer Selection Unit (MUX):</strong>
    <p>Built upon an 8-to-1 multi-bit Multiplexer (from Chapter 3). Collects the candidate outputs calculated by the Arithmetic, Logic, and Shift units, routing the selected result to the output bus <code dir="ltr">out[15:0]</code> according to <code dir="ltr">op[2:0]</code>.</p>
  </li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Hierarchical Block and Wiring Diagram 📐</h3>
<p>The following diagram shows the internal dataflow: operands <code dir="ltr">a</code> and <code dir="ltr">b</code> are routed in parallel to all functional units, and the 8-to-1 MUX selects the active operation based on <code dir="ltr">op</code>:</p>

<pre dir="ltr"><code>                    ┌────────────────────────────────────────────────────────┐
                    │                      16-bit ALU                        │
                    │                                                        │
 a[15:0], b[15:0] ──┼─┬──────────────┬──────────────┬──────────────────────┐ │
                    │ │              │              │                      │ │
                    │ ▼              ▼              ▼                      ▼ │
                    │┌─────────────┐┌─────────────┐┌────────────────────┐ ┌───────────────┐
                    ││ Adder Block ││ Sub Block   ││ Bitwise Logic Unit │ │ Shifter Unit  │
                    ││ (a + b)     ││ (a - b)     ││ (AND, OR, XOR, NOR)│ │ (SLL, SRL)    │
                    │└──────┬──────┘└──────┬──────┘└──┬───┬───┬───┬─────┘ └───┬───────┬───┘
                    │       │res_add       │res_sub   │   │   │   │res_nor    │res_sll│res_srl
                    │       │              │          │   │   └───┼───────────┼───┐   │
                    │       │              │   res_and│   │res_or │res_xor    │   │   │
                    │       │              │          │   │   ┌───┘           │   │   │
                    │       ▼              ▼          ▼   ▼   ▼               ▼   ▼   ▼
                    │   ┌───────────────────────────────────────────────────────────────┐
                    │   │              8-to-1 Multiplexer (Mux Unit)                    │
  op[2:0] ──────────┼──►│  [000:ADD, 001:SUB, 010:AND, 011:OR, 100:XOR, 101:NOR, ...]   │
                    │   └───────────────────────────────┬───────────────────────────────┘
                    │                                   │
                    │                                   ▼
                    │                               out[15:0]
                    └────────────────────────────────────────────────────────┘</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. ALU Opcode Mapping Table 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>op[2:0]</th><th>Unit Block</th><th>Operation</th><th>Verilog Expression</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>3'b000</code></td><td>Arithmetic</td><td>ADD</td><td><code>a + b</code></td><td>16-bit Binary Addition</td></tr>
    <tr><td><code>3'b001</code></td><td>Arithmetic</td><td>SUB</td><td><code>a - b</code></td><td>16-bit Two's Complement Subtraction</td></tr>
    <tr><td><code>3'b010</code></td><td>Logic</td><td>AND</td><td><code>a &amp; b</code></td><td>16-bit Bitwise AND</td></tr>
    <tr><td><code>3'b011</code></td><td>Logic</td><td>OR</td><td><code>a | b</code></td><td>16-bit Bitwise OR</td></tr>
    <tr><td><code>3'b100</code></td><td>Logic</td><td>XOR</td><td><code>a ^ b</code></td><td>16-bit Bitwise XOR</td></tr>
    <tr><td><code>3'b101</code></td><td>Logic</td><td>NOR</td><td><code>~(a | b)</code></td><td>16-bit Bitwise NOR</td></tr>
    <tr><td><code>3'b110</code></td><td>Shift</td><td>SLL</td><td><code>a &lt;&lt; b[3:0]</code></td><td>Logical Shift Left by lower 4 bits of b</td></tr>
    <tr><td><code>3'b111</code></td><td>Shift</td><td>SRL</td><td><code>a &gt;&gt; b[3:0]</code></td><td>Logical Shift Right by lower 4 bits of b</td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>5. Verilog Modeling Example 💻</h3>
<p>Here is a clean modular structure decoupling the computational blocks from the output selection multiplexer:</p>

<pre dir="ltr"><code>module modular_alu_example (
    input  [15:0] a,
    input  [15:0] b,
    input  [2:0]  op,
    output reg [15:0] out
);
    // Building blocks: Sub-unit pre-computations
    wire [15:0] res_add = a + b;
    wire [15:0] res_sub = a - b;
    wire [15:0] res_and = a & b;
    wire [15:0] res_or  = a | b;
    wire [15:0] res_xor = a ^ b;
    wire [15:0] res_nor = ~(a | b);
    wire [15:0] res_sll = a << b[3:0];
    wire [15:0] res_srl = a >> b[3:0];

    // 8-to-1 Output Multiplexer
    always @(*) begin
        case (op)
            3'b000: out = res_add;
            3'b001: out = res_sub;
            3'b010: out = res_and;
            3'b011: out = res_or;
            3'b100: out = res_xor;
            3'b101: out = res_nor;
            3'b110: out = res_sll;
            3'b111: out = res_srl;
            default: out = 16'h0000;
        endcase
    end
endmodule</code></pre>
`,

      taskHe: `בנו יחידה אריתמטית-לוגית (ALU) מלאה בגודל 16 ביט במודול <code dir="ltr">top_module</code>:
1. כניסות המודול:
   - <code dir="ltr">input [15:0] a</code>: אופרנד ראשון (16 ביט).
   - <code dir="ltr">input [15:0] b</code>: אופרנד שני (16 ביט).
   - <code dir="ltr">input [2:0] op</code>: קוד בחירת פעולה (3 ביט).
2. יציאת המודול:
   - <code dir="ltr">output reg [15:0] out</code>: תוצאת החישוב (16 ביט).
3. ממשו את 8 הפעולות הבאות לפי קוד ה-<code dir="ltr">op</code>:
   - <code dir="ltr">3'b000</code>: חיבור אריתמטי (<code dir="ltr">a + b</code>)
   - <code dir="ltr">3'b001</code>: חיסור אריתמטי (<code dir="ltr">a - b</code>)
   - <code dir="ltr">3'b010</code>: וגם לוגי סיביות (<code dir="ltr">a &amp; b</code>)
   - <code dir="ltr">3'b011</code>: או לוגי סיביות (<code dir="ltr">a | b</code>)
   - <code dir="ltr">3'b100</code>: קסור לוגי סיביות (<code dir="ltr">a ^ b</code>)
   - <code dir="ltr">3'b101</code>: נור לוגי סיביות (<code dir="ltr">~(a | b)</code>)
   - <code dir="ltr">3'b110</code>: הזזה לוגית שמאלה של <code dir="ltr">a</code> לפי 4 הביטים הנמוכים של <code dir="ltr">b</code> (<code dir="ltr">a &lt;&lt; b[3:0]</code>)
   - <code dir="ltr">3'b111</code>: הזזה לוגית ימינה של <code dir="ltr">a</code> לפי 4 הביטים הנמוכים של <code dir="ltr">b</code> (<code dir="ltr">a &gt;&gt; b[3:0]</code>)`,

      taskEn: `Design a complete 16-bit Arithmetic Logic Unit (ALU) inside <code dir="ltr">top_module</code>:
1. Module Inputs:
   - <code dir="ltr">input [15:0] a</code>: First 16-bit operand.
   - <code dir="ltr">input [15:0] b</code>: Second 16-bit operand.
   - <code dir="ltr">input [2:0] op</code>: 3-bit operation selector code.
2. Module Output:
   - <code dir="ltr">output reg [15:0] out</code>: 16-bit ALU output result.
3. Implement the following 8 operations mapped to <code dir="ltr">op</code>:
   - <code dir="ltr">3'b000</code>: Arithmetic Addition (<code dir="ltr">a + b</code>)
   - <code dir="ltr">3'b001</code>: Arithmetic Subtraction (<code dir="ltr">a - b</code>)
   - <code dir="ltr">3'b010</code>: Bitwise AND (<code dir="ltr">a &amp; b</code>)
   - <code dir="ltr">3'b011</code>: Bitwise OR (<code dir="ltr">a | b</code>)
   - <code dir="ltr">3'b100</code>: Bitwise XOR (<code dir="ltr">a ^ b</code>)
   - <code dir="ltr">3'b101</code>: Bitwise NOR (<code dir="ltr">~(a | b)</code>)
   - <code dir="ltr">3'b110</code>: Logical Shift Left of <code dir="ltr">a</code> by lower 4 bits of <code dir="ltr">b</code> (<code dir="ltr">a &lt;&lt; b[3:0]</code>)
   - <code dir="ltr">3'b111</code>: Logical Shift Right of <code dir="ltr">a</code> by lower 4 bits of <code dir="ltr">b</code> (<code dir="ltr">a &gt;&gt; b[3:0]</code>)`,

      starterCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    input [2:0] op,
    output reg [15:0] out
);
    // אבני בניין: חלוקה ליחידה אריתמטית, יחידה לוגית, יחידת הזזה ומרבב
    // Building blocks: Arithmetic Unit, Logic Unit, Shift Unit & Multiplexer

    // ממשו את לוגיקת ה-ALU כאן / Implement the ALU logic here

endmodule`,

      solutionCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    input [2:0] op,
    output reg [15:0] out
);
    // 1. היחידה האריתמטית (חיבור וחיסור) / Arithmetic Unit (ADD & SUB)
    wire [15:0] res_add = a + b;
    wire [15:0] res_sub = a - b;

    // 2. היחידה הלוגית (AND, OR, XOR, NOR) / Logic Unit
    wire [15:0] res_and = a & b;
    wire [15:0] res_or  = a | b;
    wire [15:0] res_xor = a ^ b;
    wire [15:0] res_nor = ~(a | b);

    // 3. יחידת ההזזה (SLL, SRL) / Shift Unit
    wire [15:0] res_sll = a << b[3:0];
    wire [15:0] res_srl = a >> b[3:0];

    // 4. מרבב בחירת הפעולה (8-to-1 Multiplexer Selection Unit)
    always @(*) begin
        case (op)
            3'b000: out = res_add;
            3'b001: out = res_sub;
            3'b010: out = res_and;
            3'b011: out = res_or;
            3'b100: out = res_xor;
            3'b101: out = res_nor;
            3'b110: out = res_sll;
            3'b111: out = res_srl;
            default: out = 16'h0000;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 10, b: 5, op: 0, out: 15 },
        { time: 5, a: 20, b: 8, op: 1, out: 12 },
        { time: 10, a: 12, b: 10, op: 2, out: 8 },
        { time: 15, a: 12, b: 10, op: 3, out: 14 },
        { time: 20, a: 12, b: 10, op: 4, out: 6 },
        { time: 25, a: 0, b: 0, op: 5, out: 65535 },
        { time: 30, a: 3, b: 4, op: 6, out: 48 },
        { time: 35, a: 48, b: 3, op: 7, out: 6 }
      ],

      hints: {
        he: "הגדירו חוטי עזר עבור תוצאות היחידה האריתמטית (res_add, res_sub), היחידה הלוגית (res_and, res_or, res_xor, res_nor) ויחידת ההזזה (res_sll, res_srl), ולאחר מכן השתמשו ב-case(op) כמרבב 8 ל-1.",
        en: "Define intermediate wires for the Arithmetic Unit (res_add, res_sub), Logic Unit (res_and, res_or, res_xor, res_nor), and Shift Unit (res_sll, res_srl), then use case(op) as an 8-to-1 Multiplexer."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 78: ALU Flag Register
    // --------------------------------------------------------------------------
    {
      id: 78,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "רגיסטר דגלים של ה-ALU (ALU Flag Register) 🚩",
      titleEn: "ALU Flag Register",

      explanationHe: `
<h3>1. מהם דגלי מצב (ALU Flags)? 🚩</h3>
<p>בארכיטקטורת מחשבים, ה-ALU לא מחזירה רק את תוצאת החישוב, אלא גם מעדכנת מספר סיביות סטטוס בודדות הנקראות <strong>Flags (דגלים)</strong>. דגלים אלו מתארים מאפיינים מיוחדים של התוצאה האחרונה ומשמשים לביצוע קפיצות מותנות (Conditional Jumps כמו <code>JZ</code> או <code>JNE</code>).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארבעת הדגלים הקלאסיים (Z, N, C, V) 📐</h3>
<ul>
    <li><strong>Zero Flag (Z):</strong> נדלק (1) אם התוצאה היא בדיוק אפס.
        <br>נוסחה: <code>Z = (Result == 0)</code></li>
    <li><strong>Negative Flag (N):</strong> מקבל את הערך של ה-MSB של התוצאה (בייצוג משלים ל-2, סיבית זו מעידה על מספר שלילי).
        <br>נוסחה: <code>N = Result[MSB]</code></li>
    <li><strong>Carry Flag (C):</strong> נדלק אם נוצר נשיאה (Carry-out) בחיבור ללא סימן, או לווה (Borrow-out) בחיסור.
        <br>נוסחה בחיבור: Carry-out מהביט העליון ביותר.</li>
    <li><strong>Overflow Flag (V):</strong> נדלק אם מתרחשת חריגה בחישוב עם סימן (Signed Overflow).
        <p>חריגה מתרחשת כאשר מחברים שני מספרים חיוביים ומקבלים תוצאה שלילית, או מחברים שני מספרים שליליים ומקבלים תוצאה חיובית.</p>
        <p>נוסחה כללית לחיבור (A+B): <code>V = (A_msb == B_msb) && (Result_msb != A_msb)</code></p>
    </li>
</ul>

<p>דוגמה כללית של מסיף 4 ביט עם דגלי Zero ו-Negative בלבד:</p>
<pre dir="ltr"><code>module generic_adder_flags (
    input [3:0] in_a,
    input [3:0] in_b,
    output [3:0] res,
    output zero,
    output sign
);
    assign res = in_a + in_b;
    assign zero = (res == 4'b0000);
    assign sign = res[3];
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What are ALU Flags? 🚩</h3>
<p>In CPU architectures, the ALU does not just output the calculated data word; it also updates a status register containing single-bit status markers called <strong>Flags</strong>. These flags describe properties of the last arithmetic or logic result and are read by the control unit to execute conditional branch instructions (such as <code>Jump-if-Zero</code>).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Four Classic Flags (Z, N, C, V) 📐</h3>
<ul>
    <li><strong>Zero Flag (Z):</strong> Set to 1 if the output is exactly zero.
        <br>Equation: <code>Z = (Result == 0)</code></li>
    <li><strong>Negative Flag (N):</strong> Equals the MSB of the output. In two's complement, an MSB of 1 indicates a negative value.
        <br>Equation: <code>N = Result[MSB]</code></li>
    <li><strong>Carry Flag (C):</strong> Set to 1 if an unsigned addition overflows (produces a carry out) or if a subtraction requires a borrow.
        <br>Equation: Raw carry-out of the adder.</li>
    <li><strong>Overflow Flag (V):</strong> Set to 1 if signed arithmetic overflow occurs.
        <p>This happens when adding two positive numbers yields a negative result, or adding two negative numbers yields a positive result.</p>
        <p>Equation for addition (A+B): <code>V = (A_msb == B_msb) && (Result_msb != A_msb)</code></p>
    </li>
</ul>

<p>Generic example of a 4-bit adder calculating Z and N flags:</p>
<pre dir="ltr"><code>module generic_adder_flags (
    input [3:0] in_a,
    input [3:0] in_b,
    output [3:0] res,
    output zero,
    output sign
);
    assign res = in_a + in_b;
    assign zero = (res == 4'b0000);
    assign sign = res[3];
endmodule</code></pre>
`,

      taskHe: `ממשו רכיב חיבור/חיסור בגודל 8 ביט המפיק את 4 הדגלים הקלאסיים: z_flag, n_flag, c_flag, v_flag.
כניסות: <code>[7:0] a</code>, <code>[7:0] b</code>, <code>sub</code> (אם 1, בצעו חיסור <code>a - b</code>; אם 0, בצעו חיבור <code>a + b</code>).
יציאות: <code>[7:0] sum</code>, <code>z_flag</code>, <code>n_flag</code>, <code>c_flag</code>, <code>v_flag</code>.

הנחיות לחישוב הדגלים:
1. <code>z_flag</code>: שווה ל-1 אם <code>sum == 0</code>.
2. <code>n_flag</code>: שווה ל-1 אם ביט 7 של <code>sum</code> הוא 1.
3. <code>c_flag</code>: שווה ל-1 אם מתרחש carry-out בחיבור או borrow-out בחיסור (כלומר <code>a < b</code>).
4. <code>v_flag</code>: שווה ל-1 אם מתרחש overflow בייצוג עם סימן (Signed Overflow).`,
      taskEn: `Design an 8-bit adder/subtractor that computes the four classic status flags: z_flag, n_flag, c_flag, and v_flag.
Inputs: <code>[7:0] a</code>, <code>[7:0] b</code>, <code>sub</code> (if 1, perform <code>a - b</code>; if 0, perform <code>a + b</code>).
Outputs: <code>[7:0] sum</code>, <code>z_flag</code>, <code>n_flag</code>, <code>c_flag</code>, <code>v_flag</code>.

Flag Specifications:
1. <code>z_flag</code>: 1 if <code>sum == 0</code>.
2. <code>n_flag</code>: 1 if bit 7 of <code>sum</code> is 1.
3. <code>c_flag</code>: 1 if carry-out occurs during addition or borrow-out occurs during subtraction (i.e., <code>a < b</code>).
4. <code>v_flag</code>: 1 if signed arithmetic overflow occurs.`,

      starterCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    input sub,
    output [7:0] sum,
    output z_flag,
    output n_flag,
    output c_flag,
    output v_flag
);
    // כתבו את הקוד שלכם כאן / Write your code here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    input sub,
    output [7:0] sum,
    output z_flag,
    output n_flag,
    output c_flag,
    output v_flag
);
    wire [7:0] b_mux = sub ? ~b : b;
    wire cin = sub;
    wire [8:0] temp = {1'b0, a} + {1'b0, b_mux} + cin;

    assign sum = temp[7:0];
    assign z_flag = (sum == 8'b0);
    assign n_flag = sum[7];
    assign c_flag = sub ? (a < b) : temp[8];
    assign v_flag = (a[7] == b_mux[7]) && (sum[7] != a[7]);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 5, b: 10, sub: 0, sum: 15, z_flag: 0, n_flag: 0, c_flag: 0, v_flag: 0 },
        { time: 5, a: 127, b: 1, sub: 0, sum: 128, z_flag: 0, n_flag: 1, c_flag: 0, v_flag: 1 },
        { time: 10, a: 5, b: 10, sub: 1, sum: 251, z_flag: 0, n_flag: 1, c_flag: 1, v_flag: 0 },
        { time: 15, a: 10, b: 5, sub: 1, sum: 5, z_flag: 0, n_flag: 0, c_flag: 0, v_flag: 0 },
        { time: 20, a: 0, b: 0, sub: 0, sum: 0, z_flag: 1, n_flag: 0, c_flag: 0, v_flag: 0 },
        { time: 25, a: 128, b: 128, sub: 0, sum: 0, z_flag: 1, n_flag: 0, c_flag: 1, v_flag: 1 },
        { time: 30, a: 128, b: 1, sub: 1, sum: 127, z_flag: 0, n_flag: 0, c_flag: 0, v_flag: 1 }
      ],

      hints: {
        he: "חשבו את sum ו-carry בעזרת חישוב ב-9 ביטים. אל תשכחו לחשב את v_flag בעזרת ה-MSB של הקלטים והתוצאה.",
        en: "Compute sum and carry using 9-bit arithmetic. Don't forget to compute v_flag using the MSBs of the inputs and the result."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 79: Fixed-Point Adder/Subtractor
    // --------------------------------------------------------------------------
    {
      id: 79,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "מסיף/מחסיר בנקודה קבועה (Fixed-Point Adder/Subtractor) 🔢",
      titleEn: "Fixed-Point Adder/Subtractor",

      explanationHe: `
<h3>1. למה משתמשים בנקודה קבועה (Fixed-Point)? 🔢</h3>
<p>ייצוג מספרים בנקודה צפה (Floating-point) לפי תקן IEEE 754 הוא מורכב ביותר, איטי וצורך שטח חומרה (סיליקון) עצום. לכן, במערכות זמן אמת, בעיבוד אותות (DSP) ובכרטיסי רשת, נהוג להשתמש במספרים ב<strong>נקודה קבועה (Fixed-Point)</strong>.</p>
<p>בנקודה קבועה אנו מניחים שהנקודה העשרונית (או הבינארית) נמצאת במיקום קבוע מראש. בפורמט נפוץ בשם <strong>Q4.4</strong> עם סימן (Signed):</p>
<ul>
    <li>הרוחב הכללי הוא 8 ביט.</li>
    <li>ביט 7 הוא ביט הסימן (Sign bit).</li>
    <li>ביטים <code>[6:4]</code> מייצגים את החלק השלם (Integer part).</li>
    <li>ביטים <code>[3:0]</code> מייצגים את החלק השברי (Fractional part).</li>
</ul>
<p>לדוגמה, המספר <code>8'b0010_1000</code> בפורמט Q4.4 מייצג את הערך <code>2 + 0.5 = 2.5</code>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור נקודה קבועה ולוגיקת רוויה (Saturation) 📐</h3>
<p>חיבור או חיסור של שני מספרי נקודה קבועה בעלי פורמט זהה מתבצע בדיוק כמו חיבור של מספרים שלמים רגילים! אין צורך להזיז את המיקום של הנקודה.</p>
<p>עם זאת, במערכות קול או תמונה, אנו לא רוצים שבזמן גלישה (Overflow) התוצאה \"תתהפך\" לסימן השני (למשל, שרעש חזק מאוד יהפוך פתאום לשקט קיצוני). לכן מוסיפים <strong>מנגנון רוויה (Saturation)</strong>:</p>
<ul>
    <li>אם החישוב חורג מהטווח המקסימלי החיובי, אנו חוסמים אותו בערך החיובי המקסימלי האפשרי (עבור Q4.4 עם סימן, הערך הוא <code>8'h7f</code> ששווה ל-<code>+7.9375</code>).</li>
    <li>אם החישוב חורג מהטווח המינימלי השלילי, אנו חוסמים אותו בערך השלילי המינימלי האפשרי (עבור Q4.4 עם סימן, הערך הוא <code>8'h80</code> ששווה ל-<code>-8.0</code>).</li>
</ul>

<p>דוגמה כללית של מסיף שלמים 4 ביט עם חסימת רוויה חיובית ב-<code>7</code> ושלילית ב-<code>-8</code>:</p>
<pre dir="ltr"><code>module generic_saturated_adder (
    input [3:0] x,
    input [3:0] y,
    output reg [3:0] z
);
    always @(*) begin
        reg [4:0] temp;
        temp = x + y;
        // זיהוי overflow
        if (x[3] == 0 && y[3] == 0 && temp[3] == 1)
            z = 4'h7; // רוויה חיובית
        else if (x[3] == 1 && y[3] == 1 && temp[3] == 0)
            z = 4'h8; // רוויה שלילית
        else
            z = temp[3:0];
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Need for Fixed-Point Representation 🔢</h3>
<p>Floating-point arithmetic (like IEEE 754) is highly complex, power-hungry, and consumes significant silicon area. For high-speed digital signal processing (DSP) and embedded systems, <strong>Fixed-Point Arithmetic</strong> is the standard choice.</p>
<p>In fixed-point, the binary point is assumed to be at a fixed position. For example, in a signed <strong>Q4.4</strong> format:</p>
<ul>
    <li>Total width is 8 bits.</li>
    <li>Bit 7 is the sign bit.</li>
    <li>Bits <code>[6:4]</code> represent the integer part.</li>
    <li>Bits <code>[3:0]</code> represent the fractional part.</li>
</ul>
<p>For example, the binary word <code>8'b0010_1000</code> in Q4.4 format translates to the decimal value <code>2 + 0.5 = 2.5</code>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Fixed-Point Addition & Saturation Logic 📐</h3>
<p>Adding or subtracting two fixed-point numbers of the same format is mathematically identical to standard integer addition/subtraction. No point-realignment is needed.</p>
<p>However, when overflow occurs, we want to prevent wrapping (which in audio systems causes severe clipping noise, and in control systems causes instability). Instead of wrapping, we implement <strong>Saturation</strong>:</p>
<ul>
    <li>If positive overflow occurs, clamp the output to the maximum representable positive value (for signed Q4.4, this is <code>8'h7f</code>, which equals <code>+7.9375</code>).</li>
    <li>If negative overflow occurs, clamp the output to the minimum representable negative value (for signed Q4.4, this is <code>8'h80</code>, which equals <code>-8.0</code>).</li>
</ul>

<p>Generic example of a 4-bit saturated adder:</p>
<pre dir="ltr"><code>module generic_saturated_adder (
    input [3:0] x,
    input [3:0] y,
    output reg [3:0] z
);
    always @(*) begin
        reg [4:0] temp;
        temp = x + y;
        // Detect overflow
        if (x[3] == 0 && y[3] == 0 && temp[3] == 1)
            z = 4'h7; // Positive saturation
        else if (x[3] == 1 && y[3] == 1 && temp[3] == 0)
            z = 4'h8; // Negative saturation
        else
            z = temp[3:0];
    end
endmodule</code></pre>
`,

      taskHe: `ממשו מסיף/מחסיר בנקודה קבועה עם סימן בפורמט Q4.4 בעל לוגיקת רוויה (Saturation).
כניסות: <code>[7:0] a</code>, <code>[7:0] b</code>, <code>sub</code> (אם 1, בצעו חיסור <code>a - b</code>; אם 0, בצעו חיבור <code>a + b</code>).
יציאה: <code>[7:0] out</code> (מוגדרת כ-<code>reg</code>).

דרישות המערכת:
1. במידה ומתרחש overflow חיובי (חיבור של שני מספרים חיוביים המניב תוצאה שלילית, או חיסור שבו a חיובי, b שלילי והתוצאה שלילית), הדביקו ביציאה את הערך המקסימלי החיובי <code>8'h7f</code>.
2. במידה ומתרחש overflow שלילי (חיבור של שני מספרים שליליים המניב תוצאה חיובית, או חיסור שבו a שלילי, b חיובי והתוצאה חיובית), הדביקו ביציאה את הערך המינימלי השלילי <code>8'h80</code>.
3. אחרת, היציאה תקבל את ערך החישוב הרגיל (8 הביטים הנמוכים).`,
      taskEn: `Design a signed fixed-point adder/subtractor in Q4.4 format with saturation logic.
Inputs: <code>[7:0] a</code>, <code>[7:0] b</code>, <code>sub</code> (if 1, calculate <code>a - b</code>; if 0, calculate <code>a + b</code>).
Output: <code>[7:0] out</code> (declared as <code>reg</code>).

Requirements:
1. If positive overflow occurs, clamp the output to the maximum positive signed value <code>8'h7f</code>.
2. If negative overflow occurs, clamp the output to the minimum negative signed value <code>8'h80</code>.
3. Otherwise, output the normal arithmetic result (lower 8 bits).`,

      starterCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    input sub,
    output reg [7:0] out
);
    // ממשו את לוגיקת הרוויה בנקודה קבועה כאן / Implement the fixed-point saturation logic here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    input sub,
    output reg [7:0] out
);
    always @(*) begin
        reg [7:0] b_mux;
        reg [8:0] temp;
        reg overflow;
        
        b_mux = sub ? ~b : b;
        temp = a + b_mux + sub;
        overflow = (a[7] == b_mux[7]) && (temp[7] != a[7]);
        
        if (overflow) begin
            if (a[7] == 1'b0)
                out = 8'h7f;
            else
                out = 8'h80;
        end else begin
            out = temp[7:0];
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, a: 40, b: 20, sub: 0, out: 60 },      // 2.5 + 1.25 = 3.75
        { time: 5, a: 112, b: 24, sub: 0, out: 127 },    // 7.0 + 1.5 = 8.5 (overflows) -> 127
        { time: 10, a: 144, b: 24, sub: 1, out: 128 },   // -7.0 - 1.5 = -8.5 (overflows negatively) -> 128
        { time: 15, a: 255, b: 1, sub: 0, out: 0 },      // -0.0625 + 0.0625 = 0
        { time: 20, a: 0, b: 128, sub: 1, out: 127 }     // 0 - (-8.0) = 8.0 (overflows) -> 127
      ],

      hints: {
        he: "זהו overflow על ידי השוואת סימני הקלט לסימן התוצאה. במידה ויש overflow, בצעו השמה של 8'h7f או 8'h80 בהתאם לסימן של a.",
        en: "Detect overflow by comparing the input signs with the result sign. If overflow occurs, assign 8'h7f or 8'h80 depending on the sign of a."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 80: CORDIC / Division Algorithm Principles
    // --------------------------------------------------------------------------
    {
      id: 80,
      chapter: 10,
      chapterTitleHe: "פרק 10: תכנונים מתקדמים ונושאים מיוחדים",
      chapterTitleEn: "Chapter 10: Advanced Designs & Special Topics",
      titleHe: "עקרונות חלוקה ו-CORDIC בחומרה (CORDIC & Division Principles) 📐",
      titleEn: "CORDIC & Division Algorithm Principles",

      explanationHe: `
<h3>1. פעולת החילוק בחומרה 📐</h3>
<p>בשונה מחיבור או חיסור, פעולת חילוק (Division) היא אחת הפעולות היקרות והמורכבות ביותר למימוש בחומרה. לא ניתן לממש מחלק קומבינטורי פשוט במחזור שעון אחד עבור מילים רחבות ללא פגיעה קשה בתדר העבודה.</p>
<p>שיטה נפוצה למימוש מחלקים היא שיטת <strong>Restoring Division (חילוק משחזר)</strong>. האלגוריתם מבוסס על סדרת הזזות שמאלה וחיסורים של המחלק מהשארית הנוכחית:</p>
<ol>
    <li>מאפסים את רגיסטר השארית R, ומציבים במנה Q את המחולק. D הוא המחלק.</li>
    <li>מסיטים שמאלה את המערך המשותף {R, Q} בסיבית אחת.</li>
    <li>מבצעים <code>R = R - D</code>.</li>
    <li>אם R שלילי, מציבים בסיבית הנמוכה של Q את הערך 0 ו\"משחזרים\" את R על ידי <code>R = R + D</code>.</li>
    <li>אם R חיובי, מציבים בסיבית הנמוכה של Q את הערך 1 (ולא משחזרים).</li>
    <li>חוזרים על התהליך כמספר ביטי הקלט.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. אלגוריתם CORDIC 🌀</h3>
<p><strong>CORDIC (Coordinate Rotation Digital Computer)</strong> הוא אלגוריתם חומרה מתוחכם לחישוב פונקציות טריגונומטריות (סינוס, קוסינוס), פונקציות היפרבוליות, לוגריתמים וקירוב שורשים.</p>
<p>היתרון העצום של CORDIC הוא שהוא מחשב פונקציות מורכבות אלו באמצעות <strong>הזזות ביטים (shifts) וחיבורים/חיסורים בלבד</strong>, ללא כל צורך במכפילים חומרתיים יקרים! האלגוריתם מסובב וקטור בדו-מימד בסדרה של זוויות קבועות מראש (המיוצגות כטבלת קבועים של Arctan של חזקות של 2).</p>

<p>דוגמה כללית של טיפול במחלק אפס במודול לוגיקה:</p>
<pre dir="ltr"><code>module generic_safe_div (
    input [7:0] num,
    input [7:0] den,
    output reg [7:0] res,
    output reg err
);
    always @(*) begin
        if (den == 8'b0) begin
            res = 8'hFF;
            err = 1'b1;
        end else begin
            res = num / den;
            err = 1'b0;
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Hardware Division Architectures 📐</h3>
<p>Unlike addition or subtraction, division is highly expensive and complex to implement in digital hardware. A combinational divider creates massive delay paths, so practical dividers use iterative sequential architectures.</p>
<p>A classic division method is the <strong>Restoring Division</strong> algorithm. It works through a series of shift-and-subtract steps:</p>
<ol>
    <li>Initialize remainder R to 0, quotient Q to the dividend, and D to the divisor.</li>
    <li>Shift the combined register {R, Q} left by 1 bit.</li>
    <li>Subtract the divisor: <code>R = R - D</code>.</li>
    <li>If R is negative, set the LSB of Q to 0 and \"restore\" R: <code>R = R + D</code>.</li>
    <li>If R is non-negative, set the LSB of Q to 1.</li>
    <li>Repeat for each bit of the inputs.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The CORDIC Algorithm 🌀</h3>
<p><strong>CORDIC (Coordinate Rotation Digital Computer)</strong> is an elegant hardware algorithm used to compute trigonometric (sine, cosine, tangent), hyperbolic, logarithmic, and square root functions.</p>
<p>CORDIC's main advantage is that it performs these complex calculations using <strong>only bit-shifts and additions/subtractions</strong>, completely avoiding hardware multipliers. It iteratively rotates a 2D vector by precomputed binary-weighted pseudo-angles.</p>

<p>Generic example of handling division-by-zero in Verilog:</p>
<pre dir="ltr"><code>module generic_safe_div (
    input [7:0] num,
    input [7:0] den,
    output reg [7:0] res,
    output reg err
);
    always @(*) begin
        if (den == 8'b0) begin
            res = 8'hFF;
            err = 1'b1;
        end else begin
            res = num / den;
            err = 1'b0;
        end
    end
endmodule</code></pre>
`,

      taskHe: `ממשו יחידת חילוק בגודל 4 ביט המחשבת את המנה (quotient) והשארית (remainder).
כניסות: <code>[3:0] dividend</code> (המחולק), <code>[3:0] divisor</code> (המחלק).
יציאות: <code>[3:0] quotient</code> (המנה), <code>[3:0] remainder</code> (השארית) - שתיהן מוגדרות כ-<code>reg</code>.

במידה והמחלק (<code>divisor</code>) הוא 0 (חלוקה באפס), בצעו טיפול בשגיאה הבא:
1. הציבו במנה את הערך המקסימלי <code>4'hF</code>.
2. הציבו בשארית את ערך המחולק (<code>dividend</code>).
אחרת, בצעו חלוקה וחישוב שארית רגילים.`,
      taskEn: `Implement a 4-bit division module that calculates the quotient and remainder.
Inputs: <code>[3:0] dividend</code>, <code>[3:0] divisor</code>.
Outputs: <code>[3:0] quotient</code>, <code>[3:0] remainder</code> (both declared as <code>reg</code>).

If the <code>divisor</code> is 0 (division-by-zero), perform the following error handling:
1. Set the <code>quotient</code> to the maximum value <code>4'hF</code>.
2. Set the <code>remainder</code> equal to the <code>dividend</code>.
Otherwise, perform regular division and modulo operations.`,

      starterCode: `module top_module (
    input [3:0] dividend,
    input [3:0] divisor,
    output reg [3:0] quotient,
    output reg [3:0] remainder
);
    // כתבו את לוגיקת החילוק כאן / Write your division logic here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] dividend,
    input [3:0] divisor,
    output reg [3:0] quotient,
    output reg [3:0] remainder
);
    always @(*) begin
        if (divisor == 4'b0) begin
            quotient = 4'hF;
            remainder = dividend;
        end else begin
            quotient = dividend / divisor;
            remainder = dividend % divisor;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, dividend: 10, divisor: 3, quotient: 3, remainder: 1 },
        { time: 5, dividend: 15, divisor: 5, quotient: 3, remainder: 0 },
        { time: 10, dividend: 7, divisor: 0, quotient: 15, remainder: 7 },
        { time: 15, dividend: 0, divisor: 4, quotient: 0, remainder: 0 },
        { time: 20, dividend: 13, divisor: 4, quotient: 3, remainder: 1 },
        { time: 25, dividend: 9, divisor: 2, quotient: 4, remainder: 1 }
      ],

      hints: {
        he: "השתמשו בבלוק always @(*) ובדקו תחילה אם divisor == 4'b0. אם כן, בצעו את הטיפול בשגיאה.",
        en: "Use an always @(*) block and check if divisor == 4'b0 first. If so, perform the error handling."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter10Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter10Lessons);
  }
})();
