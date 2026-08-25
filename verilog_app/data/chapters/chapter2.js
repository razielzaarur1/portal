/* ==========================================================================
   VeriLearn Curriculum — Chapter 2: Vectors & Bit Manipulation (Lessons 9 to 16)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 9: Single Bit Extraction (Bit Indexing)
    // --------------------------------------------------------------------------
    {
      id: 9,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "חילוץ ביט בודד מתוך אוטובוס (Bit Indexing) 🎯",
      titleEn: "Single Bit Extraction (Bit Indexing)",

      explanationHe: `
<h3>1. למה צריך לחלץ ביט יחיד מתוך אוטובוס רחב? 🎯</h3>
<p>כאשר אנו עובדים עם אוטובוס (bus) מרובה ביטים (כמו 4 ביט, 8 ביט או יותר), לעיתים קרובות נרצה לגשת לביט יחיד וספציפי מתוכו. לדוגמה, אם האוטובוס מייצג תוצאה של חישוב, אולי נרצה לבדוק רק את ביט הסימן (MSB) כדי לדעת אם התוצאה שלילית, או לבדוק ביט דגל (Flag) במילת מצב.</p>
<p>במונחים של חומרה פיזית, פעולה זו היא חיבור פיזי של מוליך בודד (חוט) לאחד המוליכים בתוך האוטובוס הרחב.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר גישה לפי אינדקס: <code dir="ltr">bus_name[index]</code> 📐</h3>
<p>כדי לגשת לביט ספציפי, נשתמש בסוגריים מרובעים עם מספר האינדקס של הביט:</p>
<ul>
  <li>אם הגדרנו אוטובוס כניסה: <code dir="ltr">input [3:0] data;</code></li>
  <li>הביטים מסודרים מ-0 עד 3, כאשר:</li>
  <ul>
    <li><code dir="ltr">data[3]</code> הוא הביט המשמעותי ביותר (MSB - Most Significant Bit).</li>
    <li><code dir="ltr">data[0]</code> הוא הביט הפחות משמעותי (LSB - Least Significant Bit).</li>
  </ul>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמה מעשית (ניטור חיישנים) 💡</h3>
<p>נניח שיש לנו בקר המקבל אוטובוס כניסה של 8 חיישנים <code dir="ltr">input [7:0] sensors</code>. אנו רוצים לחבר רק את חיישן הטמפרטורה (הממוקם בעמדה 5 באוטובוס) אל נורת התראה <code dir="ltr">output alert_led</code>:</p>
<pre dir="ltr"><code>module sensor_monitor (
    input  [7:0] sensors,
    output alert_led
);
    // חיבור חוט ישיר לביט החמישי באוטובוס החיישנים
    assign alert_led = sensors[5];
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Accessing Individual Bits from a Bus 🎯</h3>
<p>When working with a multi-bit vector or bus, you will often need to read or write a single specific bit. For example, you might want to inspect the Most Significant Bit (MSB) to check if a signed number is negative, or tap into a specific status flag within a control register.</p>
<p>In physical hardware, this is equivalent to routing a single physical wire from one line of a wider parallel bus.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Bit Indexing Syntax: <code dir="ltr">bus_name[index]</code> 📐</h3>
<p>To access a single bit, we specify the bit's index inside square brackets directly after the vector name:</p>
<ul>
  <li>For a 4-bit bus declared as: <code dir="ltr">input [3:0] data;</code></li>
  <li>We can access individual signals:</li>
  <ul>
    <li><code dir="ltr">data[3]</code>: The Most Significant Bit (MSB).</li>
    <li><code dir="ltr">data[0]</code>: The Least Significant Bit (LSB).</li>
  </ul>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Conceptual Example (Status Indicator) 💡</h3>
<p>Imagine a motherboard receiving a status bus from a peripheral: <code dir="ltr">input [7:0] dev_status</code>. We want to route only the error signal (located at bit position 6) to an LED output <code dir="ltr">output err_led</code>:</p>
<pre dir="ltr"><code>module status_tap (
    input  [7:0] dev_status,
    output err_led
);
    // Directly routing bit 6 of the status bus to the LED
    assign err_led = dev_status[6];
endmodule</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל כניסת אוטובוס של 4 ביט בשם <code dir="ltr">in</code> (מוגדרת כ-<code dir="ltr">input [3:0] in</code>) ויציאת ביט יחידה בשם <code dir="ltr">out</code> (מוגדרת כ-<code dir="ltr">output out</code>).
חברו את היציאה <code dir="ltr">out</code> כך שתהיה שווה לביט באינדקס 2 מתוך אוטובוס הכניסה <code dir="ltr">in</code> (כלומר <code dir="ltr">in[2]</code>).`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with a 4-bit vector input <code dir="ltr">in</code> (<code dir="ltr">input [3:0] in</code>) and a 1-bit output <code dir="ltr">out</code> (<code dir="ltr">output out</code>).
Connect <code dir="ltr">out</code> to extract bit index 2 from the input bus <code dir="ltr">in</code> (i.e. <code dir="ltr">in[2]</code>).`,

      starterCode: `module top_module (
    input [3:0] in,
    output out
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output out
);
    assign out = in[2];
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 4, out: 1 },
        { time: 10, in: 2, out: 0 },
        { time: 15, in: 12, out: 1 }
      ],

      hints: {
        he: "השתמשו בסוגריים מרובעים כדי לגשת לביט באינדקס 2: in[2]",
        en: "Use square brackets to access bit index 2: in[2]"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 10: Bit Slicing (Sub-vector Extraction)
    // --------------------------------------------------------------------------
    {
      id: 10,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "חיתוך ווקטורים (Bit Slicing) ✂️",
      titleEn: "Bit Slicing (Sub-vector Extraction)",

      explanationHe: `
<h3>1. חיתוך ווקטורים (Bit Slicing) ✂️</h3>
<p>בשיעור הקודם למדנו לחלץ ביט בודד. מה קורה אם נרצה לחלץ <strong>טווח של מספר ביטים רצופים</strong> מתוך אוטובוס רחב יותר? פעולה זו נקראת חיתוך ווקטור (Bit Slicing).</p>
<p>לדוגמה, אם יש לנו כתובת זכרון בת 16 ביטים, ואנו רוצים לבדוק רק את 8 הביטים העליונים כדי לדעת באיזה דף זכרון מדובר.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר החיתוך: <code dir="ltr">bus_name[upper_bit:lower_bit]</code> 📐</h3>
<p>כדי לגזור מקטע ביטים רציף מתוך ווקטור, נגדיר את טווח האינדקסים בסוגריים מרובעים:</p>
<pre dir="ltr"><code>wire [15:0] address;

// חילוץ 8 הביטים העליונים (15 עד 8)
wire [7:0] high_byte = address[15:8];

// חילוץ 4 הביטים התחתונים (3 עד 0)
wire [3:0] low_nibble = address[3:0];</code></pre>
<p><strong>שימו לב:</strong> סדר הביטים בחיתוך חייב להתאים להגדרת המקור. אם האוטובוס הוגדר בסדר יורד <code dir="ltr">[15:0]</code>, גם החיתוך חייב להכתב בסדר יורד (האינדקס הגבוה משמאל והנמוך מימין).</p>
`,

      explanationEn: `
<h3>1. What is Bit Slicing? ✂️</h3>
<p>In the previous lesson, we tapped a single wire from a bus. Often, we want to extract a <strong>contiguous range of multiple bits</strong>. This operation is called <strong>Bit Slicing</strong>.</p>
<p>For example, extracting the upper 8 bits of a 16-bit address to identify a memory page, or extracting a sub-field of an instruction code.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Bit Slicing Syntax: <code dir="ltr">bus_name[upper:lower]</code> 📐</h3>
<p>To extract a range, we write the high and low index limits separated by a colon inside square brackets:</p>
<pre dir="ltr"><code>wire [15:0] address;

// Extracting the upper byte (bits 15 to 8):
wire [7:0] high_byte = address[15:8];

// Extracting the lower nibble (bits 3 to 0):
wire [3:0] low_nibble = address[3:0];</code></pre>
<p><strong>Important Rule:</strong> The indexing order of the slice must match the declaration of the vector. If the vector was declared as <code dir="ltr">[15:0]</code> (down to), the slice must also be written as <code dir="ltr">[upper:lower]</code> where <code dir="ltr">upper &gt;= lower</code>.</p>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל כניסת אוטובוס 4-ביט בשם <code dir="ltr">in</code> (מוגדרת כ-<code dir="ltr">input [3:0] in</code>) ויציאת אוטובוס 2-ביט בשם <code dir="ltr">out</code> (מוגדרת כ-<code dir="ltr">output [1:0] out</code>).
חברו את היציאה <code dir="ltr">out</code> כך שתחתוך ותקבל את **שני הביטים העליונים** מתוך אוטובוס הכניסה <code dir="ltr">in</code> (כלומר הביטים <code dir="ltr">in[3:2]</code>).`,
      taskEn: `Design a module named <code dir="ltr">top_module</code> with a 4-bit vector input <code dir="ltr">in</code> (<code dir="ltr">input [3:0] in</code>) and a 2-bit vector output <code dir="ltr">out</code> (<code dir="ltr">output [1:0] out</code>).
Connect <code dir="ltr">out</code> to slice and extract the **upper two bits** from the input bus <code dir="ltr">in</code> (i.e. bits <code dir="ltr">in[3:2]</code>).`,

      starterCode: `module top_module (
    input [3:0] in,
    output [1:0] out
);
    // כתוב את חיתוך הביטים כאן / Write your bit slicing assignment here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output [1:0] out
);
    assign out = in[3:2];
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 12, out: 3 },
        { time: 10, in: 8, out: 2 },
        { time: 15, in: 4, out: 1 }
      ],

      hints: {
        he: "השתמשו בתבנית החיתוך בסוגריים מרובעים: in[3:2]",
        en: "Use square brackets bit range slicing pattern: in[3:2]"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 11: Vector Concatenation
    // --------------------------------------------------------------------------
    {
      id: 11,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "שרשור ווקטורים (Concatenation) 🧱",
      titleEn: "Vector Concatenation Operator",

      explanationHe: `
<h3>1. שרשור ווקטורים (Concatenation) 🧱</h3>
<p>בעוד שחיתוך (Slicing) מפרק אוטובוס רחב לחלקים קטנים יותר, <strong>שרשור (Concatenation)</strong> מבצע את הפעולה ההפוכה: חיבור של מספר אותות או ווקטורים נפרדים ליצירת אוטובוס רחב יחיד.</p>
<p>בפיזיקה של החומרה, שרשור הוא פשוט הנחת קבוצת מוליכים זה לצד זה כדי להעבירם יחד באוטובוס אחד.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. אופרטור השרשור: <code dir="ltr">{signal_a, signal_b, ...}</code> 📐</h3>
<p>אנו משתמשים בסוגריים מסולסלים כדי לאחד אותות, ומפרידים ביניהם בפסיקים.</p>
<p><strong>כלל הסדר:</strong> האות שנכתב <strong>ראשון משמאל</strong> יהפוך לביטים העליונים (MSB), והאות הבא אחריו יתחבר לביטים הבאים מתחתיו, עד לאות הימני ביותר שיהווה את הביטים התחתונים (LSB).</p>
<pre dir="ltr"><code>wire [3:0] high_nibble;
wire [3:0] low_nibble;
wire [7:0] full_byte;

// חיבור של שני חצאי בית לקבלת בית שלם
assign full_byte = {high_nibble, low_nibble};</code></pre>
<p>בדוגמה זו, <code dir="ltr">high_nibble</code> יתחבר לביטים <code dir="ltr">full_byte[7:4]</code>, ו-<code dir="ltr">low_nibble</code> יתחבר לביטים <code dir="ltr">full_byte[3:0]</code>.</p>
`,

      explanationEn: `
<h3>1. Combining Vectors (Concatenation) 🧱</h3>
<p>While bit slicing breaks a wide bus into smaller pieces, <strong>Concatenation</strong> does the exact opposite: it bundles multiple separate wires or smaller vectors into a single, wider bus.</p>
<p>In physical hardware, concatenation is simply routing separate wires side-by-side to form a parallel bus.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Concatenation Operator: <code dir="ltr">{signal_a, signal_b, ...}</code> 📐</h3>
<p>In Verilog, we group signals using curly braces <code dir="ltr">{ }</code>, separating them with commas.</p>
<p><strong>The Ordering Rule:</strong> The leftmost signal in the concatenation forms the MSB (Most Significant Bit) portion of the result, while the rightmost signal forms the LSB (Least Significant Bit).</p>
<pre dir="ltr"><code>wire [3:0] high_nibble;
wire [3:0] low_nibble;
wire [7:0] full_byte;

// Combining two nibbles into a single byte
assign full_byte = {high_nibble, low_nibble};</code></pre>
<p>Here, <code dir="ltr">high_nibble</code> maps to <code dir="ltr">full_byte[7:4]</code>, and <code dir="ltr">low_nibble</code> maps to <code dir="ltr">full_byte[3:0]</code>.</p>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות של 2-ביט בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code> (מוגדרות כ-<code dir="ltr">input [1:0] a, b</code>) ויציאת אוטובוס של 4-ביט בשם <code dir="ltr">out</code> (מוגדרת כ-<code dir="ltr">output [3:0] out</code>).
חברו את היציאה <code dir="ltr">out</code> באמצעות שרשור כך ש-<code dir="ltr">a</code> ירכיב את 2 הביטים העליונים ו-<code dir="ltr">b</code> ירכיב את 2 הביטים התחתונים.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two 2-bit vector inputs <code dir="ltr">a</code> and <code dir="ltr">b</code> (<code dir="ltr">input [1:0] a, b</code>) and one 4-bit vector output <code dir="ltr">out</code> (<code dir="ltr">output [3:0] out</code>).
Combine <code dir="ltr">a</code> and <code dir="ltr">b</code> using concatenation so that <code dir="ltr">a</code> forms the upper 2 bits and <code dir="ltr">b</code> forms the lower 2 bits.`,

      starterCode: `module top_module (
    input [1:0] a,
    input [1:0] b,
    output [3:0] out
);
    // כתוב את שרשור הווקטורים כאן / Write your concatenation assignment here

endmodule`,

      solutionCode: `module top_module (
    input [1:0] a,
    input [1:0] b,
    output [3:0] out
);
    assign out = {a, b};
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out: 0 },
        { time: 5, a: 2, b: 1, out: 9 },
        { time: 10, a: 3, b: 0, out: 12 },
        { time: 15, a: 1, b: 3, out: 7 }
      ],

      hints: {
        he: "השתמשו בסוגריים מסולסלים כדי לשרשר את שני הווקטורים: {a, b}",
        en: "Use curly braces to concatenate the two vectors: {a, b}"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 12: Vector Replication
    // --------------------------------------------------------------------------
    {
      id: 12,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "משכפל הווקטורים (Replication Operator) 🔁",
      titleEn: "Vector Replication Operator",

      explanationHe: `
<h3>1. למה צריך לשכפל ביטים בחומרה? 🔁</h3>
<p>בתכנון רכיבי חומרה ומעבדים, לעיתים קרובות אנו צריכים לשכפל ביט יחיד או קבוצת ביטים מספר פעמים רב.</p>
<p>שימוש נפוץ מאוד הוא <strong>הרחבת סימן (Sign Extension)</strong>: כאשר אנו רוצים להמיר מספר קטן מיוצג בסימן (למשל 4 ביט) למספר רחב יותר (למשל 8 ביט) מבלי לשנות את ערכו, עלינו לשכפל את ביט הסימן (הביט העליון) לכל המקומות הריקים החדשים.</p>
<p>כתיבה ידנית כמו <code dir="ltr">{sign, sign, sign, sign}</code> היא מסורבלת ומזמינה שגיאות. לשם כך קיים אופרטור השכפול.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר אופרטור השכפול: <code dir="ltr">{n{signal}}</code> 📐</h3>
<p>התחביר משתמש בסוגריים מסולסלים כפולים, כאשר המספר החיצוני מציין את מספר השכפולים והסוגריים הפנימיים מקיפים את האות לשכפול:</p>
<pre dir="ltr"><code>wire sign_bit;
wire [3:0] extended;

// שכפול ביט הסימן 4 פעמים
assign extended = {4{sign_bit}}; // שקול ל- {sign_bit, sign_bit, sign_bit, sign_bit}</code></pre>
<p>ניתן לשכפל גם ווקטורים שלמים:</p>
<pre dir="ltr"><code>wire [1:0] pattern;
wire [5:0] repeated_pattern;

// שכפול התבנית בת 2 ביט 3 פעמים לקבלת 6 ביט
assign repeated_pattern = {3{pattern}};</code></pre>
`,

      explanationEn: `
<h3>1. Replicating Bits in Hardware 🔁</h3>
<p>In digital design, we frequently need to replicate a single bit or a vector multiple times. A primary use case is <strong>Sign Extension</strong> in arithmetic units, where a signed number is widened (e.g., from 4 bits to 8 bits) by duplicating its sign bit into the new high positions to preserve its mathematical value.</p>
<p>Typing out <code dir="ltr">{sign, sign, sign, sign}</code> is tedious and prone to typos. Verilog provides the replication operator to handle this cleanly.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Replication Operator Syntax: <code dir="ltr">{n{signal}}</code> 📐</h3>
<p>The replication syntax uses nested curly braces: the first integer <code dir="ltr">n</code> specifies the replication count, and the inner braces contain the signal or vector to replicate:</p>
<pre dir="ltr"><code>wire sign_bit;
wire [3:0] extended;

// Replicate the sign bit 4 times:
assign extended = {4{sign_bit}}; // Equivalent to {sign_bit, sign_bit, sign_bit, sign_bit}</code></pre>
<p>You can also replicate multi-bit vectors:</p>
<pre dir="ltr"><code>wire [1:0] pattern;
wire [5:0] result;

// Repeat the 2-bit pattern 3 times to form a 6-bit vector:
assign result = {3{pattern}};</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל כניסה של ביט יחיד בשם <code dir="ltr">in</code> (מוגדרת כ-<code dir="ltr">input in</code>) ויציאה של 4-ביט בשם <code dir="ltr">out</code> (מוגדרת כ-<code dir="ltr">output [3:0] out</code>).
שכפלו את ביט הכניסה <code dir="ltr">in</code> בדיוק 4 פעמים כך שימלא את כל 4 הביטים של היציאה <code dir="ltr">out</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with a 1-bit input <code dir="ltr">in</code> (<code dir="ltr">input in</code>) and a 4-bit vector output <code dir="ltr">out</code> (<code dir="ltr">output [3:0] out</code>).
Replicate the single input bit <code dir="ltr">in</code> 4 times to fill all 4 bits of the output <code dir="ltr">out</code>.`,

      starterCode: `module top_module (
    input in,
    output [3:0] out
);
    // כתוב את אופרטור השכפול כאן / Write your replication assignment here

endmodule`,

      solutionCode: `module top_module (
    input in,
    output [3:0] out
);
    assign out = {4{in}};
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 1, out: 15 },
        { time: 10, in: 0, out: 0 },
        { time: 15, in: 1, out: 15 }
      ],

      hints: {
        he: "השתמשו באופרטור השכפול המסולסל: {4{in}}",
        en: "Use the nested replication curly braces operator: {4{in}}"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 13: Bitwise vs Logical Operators
    // --------------------------------------------------------------------------
    {
      id: 13,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "אופרטורים בינאריים מול לוגיים ⚖️",
      titleEn: "Bitwise vs Logical Operators",

      explanationHe: `
<h3>1. האם יש הבדל בין <code dir="ltr">|</code> לבין <code dir="ltr">||</code>? ⚖️</h3>
<p>כן, וההבדל הוא קריטי! בלבול בין אופרטורים בינאריים ללוגיים הוא אחד הגורמים הנפוצים ביותר לבאגים בתכנון חומרה ב-Verilog.</p>
<ul>
  <li><strong>אופרטורים בינאריים (Bitwise: <code dir="ltr">&amp;</code>, <code dir="ltr">|</code>, <code dir="ltr">~</code>, <code dir="ltr">^</code>)</strong>: מבצעים את הפעולה ביט-אחר-ביט באופן עצמאי. אם אנו מבצעים פעולה על שני ווקטורים בני 4 ביטים, התוצאה תהיה ווקטור בן 4 ביטים שבו כל ביט מחושב מהביטים המתאימים בכניסה.</li>
  <li><strong>אופרטורים לוגיים (Logical: <code dir="ltr">&amp;&amp;</code>, <code dir="ltr">||</code>, <code dir="ltr">!</code>)</strong>: מתייחסים לכל ווקטור כאל ערך בוליאני אחד יחיד. בחומרה, ערך <code dir="ltr">0</code> מייצג <strong>FALSE</strong>, וכל ערך שאינו אפס מייצג <strong>TRUE</strong>. התוצאה של פעולה לוגית היא תמיד ביט בודד (1-ביט) המכיל <code dir="ltr">0</code> או <code dir="ltr">1</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. השוואה מעשית ודוגמאות 📊</h3>
<p>נניח שיש לנו שני משתנים: <code dir="ltr">A = 2'b10</code> ו-<code dir="ltr">B = 2'b01</code>.</p>
<ul>
  <li><strong>Bitwise AND (<code dir="ltr">A &amp; B</code>)</strong>:
    <ul>
      <li>ביט 1 (MSB): <code dir="ltr">1 &amp; 0 = 0</code></li>
      <li>ביט 0 (LSB): <code dir="ltr">0 &amp; 1 = 0</code></li>
      <li>תוצאה: <code dir="ltr">2'b00</code></li>
    </ul>
  </li>
  <li><strong>Logical AND (<code dir="ltr">A &amp;&amp; B</code>)</strong>:
    <ul>
      <li>ערכו של <code dir="ltr">A</code> הוא <code dir="ltr">2'b10</code> (שונה מאפס, לכן <strong>TRUE</strong>).</li>
      <li>ערכו של <code dir="ltr">B</code> הוא <code dir="ltr">2'b01</code> (שונה מאפס, לכן <strong>TRUE</strong>).</li>
      <li>מכיוון ששני הערכים הם TRUE, התוצאה היא <strong>TRUE</strong>.</li>
      <li>תוצאה: <code dir="ltr">1'b1</code></li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. טבלת השוואת אופרטורים 📋</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.82rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr>
      <th>סוג הפעולה</th>
      <th>אופרטור בינארי (Bitwise)</th>
      <th>אופרטור לוגי (Logical)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>וגם (AND)</strong></td>
      <td><code dir="ltr">&amp;</code> (תוצאה ברוחב הכניסה)</td>
      <td><code dir="ltr">&amp;&amp;</code> (תוצאה 1-ביט)</td>
    </tr>
    <tr>
      <td><strong>או (OR)</strong></td>
      <td><code dir="ltr">|</code> (תוצאה ברוחב הכניסה)</td>
      <td><code dir="ltr">||</code> (תוצאה 1-ביט)</td>
    </tr>
    <tr>
      <td><strong>לא (NOT)</strong></td>
      <td><code dir="ltr">~</code> (היפוך כל ביט בנפרד)</td>
      <td><code dir="ltr">!</code> (היפוך הלוגיקה של כל המילה)</td>
    </tr>
  </tbody>
</table>
`,

      explanationEn: `
<h3>1. Bitwise vs. Logical Operators ⚖️</h3>
<p>Confusing bitwise and logical operators is one of the most common syntax errors in Verilog. Understanding their functional difference is essential for correct hardware synthesis.</p>
<ul>
  <li><strong>Bitwise Operators (<code dir="ltr">&amp;</code>, <code dir="ltr">|</code>, <code dir="ltr">~</code>, <code dir="ltr">^</code>)</strong>: Operate on vectors bit-by-bit. If you perform a bitwise operation on two 4-bit vectors, the result is a 4-bit vector where each bit is computed independently.</li>
  <li><strong>Logical Operators (<code dir="ltr">&amp;&amp;</code>, <code dir="ltr">||</code>, <code dir="ltr">!</code>)</strong>: Treat the entire vector as a single boolean value. In hardware, a vector value of <code dir="ltr">0</code> is treated as <strong>FALSE</strong>, and any non-zero value is treated as <strong>TRUE</strong>. The output is always a single 1-bit value (<code dir="ltr">0</code> or <code dir="ltr">1</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Practical Example 📊</h3>
<p>Let's take two variables: <code dir="ltr">A = 2'b10</code> and <code dir="ltr">B = 2'b01</code>.</p>
<ul>
  <li><strong>Bitwise AND (<code dir="ltr">A &amp; B</code>)</strong>:
    <ul>
      <li>Bit 1 (MSB): <code dir="ltr">1 &amp; 0 = 0</code></li>
      <li>Bit 0 (LSB): <code dir="ltr">0 &amp; 1 = 0</code></li>
      <li>Result: <code dir="ltr">2'b00</code></li>
    </ul>
  </li>
  <li><strong>Logical AND (<code dir="ltr">A &amp;&amp; B</code>)</strong>:
    <ul>
      <li><code dir="ltr">A</code> is non-zero, so it is <strong>TRUE</strong>.</li>
      <li><code dir="ltr">B</code> is non-zero, so it is <strong>TRUE</strong>.</li>
      <li>True AND True is True.</li>
      <li>Result: <code dir="ltr">1'b1</code></li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Comparison Table 📋</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.82rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr>
      <th>Operation</th>
      <th>Bitwise Operator</th>
      <th>Logical Operator</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>AND</strong></td>
      <td><code dir="ltr">&amp;</code> (preserves width)</td>
      <td><code dir="ltr">&amp;&amp;</code> (outputs 1 bit)</td>
    </tr>
    <tr>
      <td><strong>OR</strong></td>
      <td><code dir="ltr">|</code> (preserves width)</td>
      <td><code dir="ltr">||</code> (outputs 1 bit)</td>
    </tr>
    <tr>
      <td><strong>NOT</strong></td>
      <td><code dir="ltr">~</code> (inverts each bit)</td>
      <td><code dir="ltr">!</code> (inverts boolean truth)</td>
    </tr>
  </tbody>
</table>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות 4-ביט <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ושתי יציאות:
- <code dir="ltr">out_bitwise</code> (אוטובוס 4-ביט: <code dir="ltr">output [3:0] out_bitwise</code>)
- <code dir="ltr">out_logical</code> (ביט 1 בודד: <code dir="ltr">output out_logical</code>)

חברו את <code dir="ltr">out_bitwise</code> לבצע פעולת OR בינארית (bitwise OR) בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>, ואת <code dir="ltr">out_logical</code> לבצע פעולת OR לוגית (logical OR) בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two 4-bit inputs <code dir="ltr">a</code> and <code dir="ltr">b</code> and two outputs:
- <code dir="ltr">out_bitwise</code> (4-bit vector: <code dir="ltr">output [3:0] out_bitwise</code>)
- <code dir="ltr">out_logical</code> (1-bit output: <code dir="ltr">output out_logical</code>)

Drive <code dir="ltr">out_bitwise</code> with the bitwise OR of <code dir="ltr">a</code> and <code dir="ltr">b</code>, and <code dir="ltr">out_logical</code> with the logical OR of <code dir="ltr">a</code> and <code dir="ltr">b</code>.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output [3:0] out_bitwise,
    output out_logical
);
    // כתוב את שתי הוראות ה-assign כאן / Write your two assign statements here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output [3:0] out_bitwise,
    output out_logical
);
    assign out_bitwise = a | b;
    assign out_logical = a || b;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_bitwise: 0, out_logical: 0 },
        { time: 5, a: 2, b: 1, out_bitwise: 3, out_logical: 1 },
        { time: 10, a: 8, b: 4, out_bitwise: 12, out_logical: 1 },
        { time: 15, a: 0, b: 5, out_bitwise: 5, out_logical: 1 }
      ],

      hints: {
        he: "השתמשו ב-| עבור out_bitwise וב-|| עבור out_logical.",
        en: "Use | for out_bitwise and || for out_logical."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 14: Half Adder
    // --------------------------------------------------------------------------
    {
      id: 14,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "חצי מחבר (Half Adder) ➕",
      titleEn: "Half Adder",

      explanationHe: `
<h3>1. מהו חצי מחבר (Half Adder)? ➕</h3>
<p>חצי מחבר הוא המבנה האריתמטי הבסיסי ביותר בחומרה דיגיטלית. תפקידו לקבל שתי כניסות של 1-ביט (נקרא להן <code dir="ltr">a</code> ו-<code dir="ltr">b</code>), ולחשב את החיבור האריתמטי ביניהן.</p>
<p>פעולת החיבור מפיקה שתי תוצאות:</p>
<ul>
  <li><strong>סכום (Sum)</strong>: התוצאה של החיבור בעמודה הנוכחית.</li>
  <li><strong>נשיאה החוצה (Carry Out)</strong>: הביט שגולש לעמודה הבאה במקרה ששני המשתנים הם 1 (כלומר <code dir="ltr">1 + 1 = 2</code> בבסיס 10, שהם <code dir="ltr">10</code> בבינארי).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת של חצי מחבר 📊</h3>
<p>הבה נסתכל על כל השילובים האפשריים:</p>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>a</th><th>b</th><th>Sum (סכום)</th><th>Cout (נשיאה)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. משוואות לוגיות של חצי מחבר 📐</h3>
<p>מתוך טבלת האמת נוכל לראות ש:</p>
<ul>
  <li>עמודת ה-Sum מקבלת 1 רק כאשר הכניסות שונות. זוהי בדיוק לוגיקת <strong>XOR</strong> (<code dir="ltr">sum = a ^ b</code>).</li>
  <li>עמודת ה-Cout מקבלת 1 רק כאשר שתי הכניסות הן 1. זוהי בדיוק לוגיקת <strong>AND</strong> (<code dir="ltr">cout = a &amp; b</code>).</li>
</ul>
<p><strong>למה זה נקרא "חצי" מחבר?</strong> מפני שהוא לא תומך בקבלת נשיאה משלבים קודמים (אין לו כניסת Carry In). לכן לא ניתן לשרשר אותו ישירות לבניית מחברים רחבים (כמו מחבר 16 ביט).</p>
`,

      explanationEn: `
<h3>1. What is a Half Adder? ➕</h3>
<p>A Half Adder is the most fundamental arithmetic block in digital circuit design. It adds two 1-bit inputs (typically named <code dir="ltr">a</code> and <code dir="ltr">b</code>) and computes their binary arithmetic sum.</p>
<p>This addition yields two distinct outputs:</p>
<ul>
  <li><strong>Sum</strong>: The result of the addition in the current bit position.</li>
  <li><strong>Carry Out (Cout)</strong>: The overflow bit that propagates to the next higher significance column (since <code dir="ltr">1 + 1 = 2</code> in decimal, which is written as binary <code dir="ltr">10</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Half Adder Truth Table 📊</h3>
<p>Let's map all input combinations to find the logic gates required:</p>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>a</th><th>b</th><th>Sum</th><th>Cout</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Half Adder Boolean Equations 📐</h3>
<p>From the truth table, we can derive the boolean relationships:</p>
<ul>
  <li>The Sum bit is high only when inputs are different. This corresponds to the <strong>XOR</strong> gate (<code dir="ltr">sum = a ^ b</code>).</li>
  <li>The Cout bit is high only when both inputs are high. This corresponds to the <strong>AND</strong> gate (<code dir="ltr">cout = a &amp; b</code>).</li>
</ul>
<p><strong>Why is it called a "Half" Adder?</strong> Because it lacks a carry-in port from lower significance stages. To add multi-bit numbers, we need a "Full Adder" that can accept an incoming carry bit.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המממש חצי מחבר (Half Adder).
המודול יקבל שתי כניסות של 1-ביט בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ויפיק שתי יציאות של 1-ביט בשם <code dir="ltr">sum</code> ו-<code dir="ltr">cout</code>.`,
      taskEn: `Design a module named <code dir="ltr">top_module</code> that implements a Half Adder.
The module should have two 1-bit inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, and two 1-bit outputs <code dir="ltr">sum</code> and <code dir="ltr">cout</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output sum,
    output cout
);
    // כתוב את לוגיקת חצי המחבר כאן / Write your half adder logic here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output sum,
    output cout
);
    assign sum = a ^ b;
    assign cout = a & b;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, sum: 0, cout: 0 },
        { time: 5, a: 1, b: 0, sum: 1, cout: 0 },
        { time: 10, a: 0, b: 1, sum: 1, cout: 0 },
        { time: 15, a: 1, b: 1, sum: 0, cout: 1 }
      ],

      hints: {
        he: "השתמשו באופרטור ה-XOR (^) לחישוב sum, ובאופרטור AND (&) לחישוב cout.",
        en: "Use the XOR operator (^) to calculate sum and the AND operator (&) to calculate cout."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 15: Full Adder
    // --------------------------------------------------------------------------
    {
      id: 15,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "מחבר מלא (Full Adder) ➕➕",
      titleEn: "Full Adder",

      explanationHe: `
<h3>1. מהו מחבר מלא (Full Adder)? ➕➕</h3>
<p>מחבר מלא פותר את המגבלה של חצי המחבר. בנוסף לשתי כניסות הנתונים (<code dir="ltr">a</code> ו-<code dir="ltr">b</code>), הוא מקבל כניסה שלישית: <strong>נשיאה בכניסה (Carry In - <code dir="ltr">cin</code>)</strong>, המגיעה מהחישוב של השלב הקודם (הביט הפחות משמעותי).</p>
<p>הודות לכך, ניתן לשרשר מספר מחברים מלאים זה אחר זה כדי לבצע חיבור של מספרים בכל רוחב ביטים שנרצה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת של מחבר מלא 📊</h3>
<p>נבחן את שמונת הצירופים האפשריים עבור שלוש כניסות ה-1-ביט:</p>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>a</th><th>b</th><th>cin</th><th>Sum (סכום)</th><th>Cout (נשיאה)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. המשוואות הלוגיות למחבר מלא 📐</h3>
<ul>
  <li><strong>Sum</strong>: הביט Sum יהיה 1 כאשר מספר אי-זוגי של כניסות שווה ל-1. המשוואה מבוצעת על ידי שרשור פעולות XOR:
    <code dir="ltr">sum = a ^ b ^ cin;</code>
  </li>
  <li><strong>Cout (נשיאה החוצה)</strong>: ביט הנשיאה יהיה 1 כאשר לפחות שתיים מהכניסות הן 1. נוכל לנסח זאת כחיבור לוגי (OR) של כל הזוגות האפשריים:
    <code dir="ltr">cout = (a &amp; b) | (b &amp; cin) | (a &amp; cin);</code>
  </li>
</ul>
`,

      explanationEn: `
<h3>1. What is a Full Adder? ➕➕</h3>
<p>A Full Adder overcomes the limitation of the Half Adder. In addition to the two data inputs (<code dir="ltr">a</code> and <code dir="ltr">b</code>), it accepts a third input: <strong>Carry In (<code dir="ltr">cin</code>)</strong>, which represents an overflow carry bit propagated from the previous, less-significant stage.</p>
<p>This carry-in capability makes Full Adders chainable, allowing us to build arithmetic units capable of adding binary numbers of any bit-width.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Full Adder Truth Table 📊</h3>
<p>Let's map all 8 combinations of the three 1-bit inputs:</p>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>a</th><th>b</th><th>cin</th><th>Sum</th><th>Cout</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Full Adder Boolean Logic 📐</h3>
<ul>
  <li><strong>Sum</strong>: The Sum output is high whenever an odd number of inputs are high. This is implemented by cascading XOR operations:
    <code dir="ltr">sum = a ^ b ^ cin;</code>
  </li>
  <li><strong>Cout (Carry Out)</strong>: The Carry Out output is high whenever at least two of the inputs are high. We can implement this by ORing all pairwise AND combinations:
    <code dir="ltr">cout = (a &amp; b) | (b &amp; cin) | (a &amp; cin);</code>
  </li>
</ul>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המממש מחבר מלא (Full Adder) בן ביט יחיד.
המודול יקבל שלוש כניסות 1-ביט בשם <code dir="ltr">a</code>, <code dir="ltr">b</code>, ו-<code dir="ltr">cin</code>, ויפיק שתי יציאות 1-ביט בשם <code dir="ltr">sum</code> ו-<code dir="ltr">cout</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> that implements a 1-bit Full Adder.
The module has three 1-bit inputs <code dir="ltr">a</code>, <code dir="ltr">b</code>, and <code dir="ltr">cin</code>, and two 1-bit outputs <code dir="ltr">sum</code> and <code dir="ltr">cout</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    input cin,
    output sum,
    output cout
);
    // כתוב את לוגיקת המחבר המלא כאן / Write your full adder logic here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input cin,
    output sum,
    output cout
);
    assign sum = a ^ b ^ cin;
    assign cout = (a & b) | (b & cin) | (a & cin);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
        { time: 5, a: 1, b: 0, cin: 0, sum: 1, cout: 0 },
        { time: 10, a: 0, b: 1, cin: 0, sum: 1, cout: 0 },
        { time: 15, a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
        { time: 20, a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
        { time: 25, a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
        { time: 30, a: 0, b: 1, cin: 1, sum: 0, cout: 1 },
        { time: 35, a: 1, b: 1, cin: 1, sum: 1, cout: 1 }
      ],

      hints: {
        he: "חשבו את sum באמצעות XOR משולש: a ^ b ^ cin. חשבו את cout באמצעות OR של שילובי הזוגות: (a & b) | (b & cin) | (a & cin).",
        en: "Calculate sum using triple XOR: a ^ b ^ cin. Calculate cout by ORing the pairwise products: (a & b) | (b & cin) | (a & cin)."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 16: 4-bit Ripple Carry Adder
    // --------------------------------------------------------------------------
    {
      id: 16,
      chapter: 2,
      chapterTitleHe: "פרק 2: Vectors ו-Bit Manipulation",
      chapterTitleEn: "Chapter 2: Vectors & Bit Manipulation",
      titleHe: "מחבר זוחל 4-ביט (4-bit Ripple Carry Adder) ⛓️",
      titleEn: "4-bit Ripple Carry Adder",

      explanationHe: `
<h3>1. מחבר זוחל 4-ביט (4-bit Ripple Carry Adder) ⛓️</h3>
<p>כאשר ברצוננו לחבר שני מספרים רב-ביטיים (למשל, שני מספרים בני 4 ביטים: <code dir="ltr">a[3:0]</code> ו-<code dir="ltr">b[3:0]</code>), עלינו לחקות את הדרך בה אנו פותרים תרגילי חיבור על דף ("חיבור ארוך" עם נשיאה).</p>
<p>השיטה הבסיסית ביותר לעשות זאת בחומרה נקראת <strong>מחבר זוחל (Ripple Carry Adder)</strong>. אנו מחברים 4 שלבים של מחברים מלאים (Full Adders) בשרשרת, כך שמוצא הנשיאה (<code dir="ltr">cout</code>) של כל ביט מוזן ישירות ככניסת הנשיאה (<code dir="ltr">cin</code>) של הביט הבא אחריו.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דיאגרמת המעגל 📊</h3>
<p>התרשים הבא מציג כיצד אותות הנשיאה "זוחלים" לאורך השרשרת מימין (הביט הפחות משמעותי) לשמאל (הביט הכי משמעותי):</p>
<pre dir="ltr"><code>a[3] b[3]      a[2] b[2]      a[1] b[1]      a[0] b[0]
   │   │          │   │          │   │          │   │
 ┌─▼───▼─┐      ┌─▼───▼─┐      ┌─▼───▼─┐      ┌─▼───▼─┐
 │  FA3  │◄─────┤  FA2  │◄─────┤  FA1  │◄─────┤  FA0  │◄── cin (התחלתית)
 └─┬───┬─┘  c3  └─┬───┬─┘  c2  └─┬───┬─┘  c1  └─┬───┬─┘
   │   │          │   │          │   │          │   │
   ▼   ▼          ▼   ▼          ▼   ▼          ▼   ▼
 cout sum[3]     sum[2]         sum[1]         sum[0]</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מהם חוטים פנימיים? המילה השמורה <code dir="ltr">wire</code> 📐</h3>
<p>על מנת לקשר בין מוצא של שער או יחידה אחת לכניסה של יחידה אחרת, עלינו להשתמש בחוטים פנימיים. חוטים אלו אינם חלק מפורטי הכניסה או היציאה של המודול הראשי, אלא קיימים רק בתוך המעגל.</p>
<p>ב-Verilog אנו מגדירים חוטים אלו באמצעות המילה השמורה <code dir="ltr">wire</code>:</p>
<pre dir="ltr"><code>// הגדרת שלושה חוטים פנימיים לחיבור הנשיאות
wire c1, c2, c3;</code></pre>
<p>כעת נוכל להשתמש בהם כדי להעביר את אותות הנשיאה בין השלבים:</p>
<pre dir="ltr"><code>// שלב 0 (הביט LSB)
assign sum[0] = a[0] ^ b[0] ^ cin;
assign c1     = (a[0] &amp; b[0]) | (cin &amp; (a[0] ^ b[0]));

// שלב 1
assign sum[1] = a[1] ^ b[1] ^ c1;  // משתמש ב-c1 כנשיאה בכניסה
assign c2     = (a[1] &amp; b[1]) | (c1 &amp; (a[1] ^ b[1]));</code></pre>

<p><strong>חסרון מרכזי:</strong> כפי שניתן לראות בדיאגרמה, שלב 3 אינו יכול לחשב את תוצאתו הסופית עד ששלב 2 סיים לחשב את <code dir="ltr">c3</code>, אשר תלוי ב-<code dir="ltr">c2</code> משלב 1, שתלוי ב-<code dir="ltr">c1</code> משלב 0. "זחילה" זו יוצרת השהיית התפשטות (propagation delay) שמאטה את המעגל ככל שרוחב הביטים גדל.</p>
`,

      explanationEn: `
<h3>1. 4-bit Ripple Carry Adder (RCA) ⛓️</h3>
<p>To add multi-bit numbers (like two 4-bit numbers <code dir="ltr">a[3:0]</code> and <code dir="ltr">b[3:0]</code>), we must mimic the way we perform manual decimal addition ("long addition" with carries).</p>
<p>The simplest way to implement this in hardware is a <strong>Ripple Carry Adder</strong>. We chain 4 individual 1-bit Full Adders in series, so that the carry-out (<code dir="ltr">cout</code>) of each stage feeds directly into the carry-in (<code dir="ltr">cin</code>) of the next higher bit stage.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Circuit Diagram 📊</h3>
<p>The diagram below shows how the carry signal ripples through the chain from right (LSB) to left (MSB):</p>
<pre dir="ltr"><code>a[3] b[3]      a[2] b[2]      a[1] b[1]      a[0] b[0]
   │   │          │   │          │   │          │   │
 ┌─▼───▼─┐      ┌─▼───▼─┐      ┌─▼───▼─┐      ┌─▼───▼─┐
 │  FA3  │◄─────┤  FA2  │◄─────┤  FA1  │◄─────┤  FA0  │◄── cin (initial)
 └─┬───┬─┘  c3  └─┬───┬─┘  c2  └─┬───┬─┘  c1  └─┬───┬─┘
   │   │          │   │          │   │          │   │
   ▼   ▼          ▼   ▼          ▼   ▼          ▼   ▼
 cout sum[3]     sum[2]         sum[1]         sum[0]</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Internal Connections: The <code dir="ltr">wire</code> Declaration 📐</h3>
<p>To connect the output of one gate/stage to the input of another, we need internal nodes. These nodes are not module inputs or outputs; they exist only as internal connections.</p>
<p>In Verilog, we declare these internal paths using the <code dir="ltr">wire</code> keyword:</p>
<pre dir="ltr"><code>// Declare three internal carry wires:
wire c1, c2, c3;</code></pre>
<p>We then use these wires to pass the carry bit from one stage to the next:</p>
<pre dir="ltr"><code>// Bit 0 Stage (LSB)
assign sum[0] = a[0] ^ b[0] ^ cin;
assign c1     = (a[0] &amp; b[0]) | (cin &amp; (a[0] ^ b[0]));

// Bit 1 Stage
assign sum[1] = a[1] ^ b[1] ^ c1;  // Uses c1 as carry-in
assign c2     = (a[1] &amp; b[1]) | (c1 &amp; (a[1] ^ b[1]));</code></pre>

<p><strong>Trade-off:</strong> As you can see, the final stage (FA3) cannot calculate its output until the carry bit ripples through all previous stages (FA0 &rarr; FA1 &rarr; FA2 &rarr; FA3). This creates a propagation delay that grows linearly with the number of bits, making Ripple Carry Adders slower for wide data buses.</p>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המממש מחבר זוחל 4-ביט (4-bit Ripple Carry Adder).
המודול יקבל שתי כניסות 4-ביט בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, כניסת נשיאה <code dir="ltr">cin</code> של 1-ביט, ויפיק יציאת סכום <code dir="ltr">sum</code> של 4-ביט ויציאת נשיאה סופית <code dir="ltr">cout</code> של 1-ביט.
הגדירו חוטים פנימיים (<code dir="ltr">wire c1, c2, c3;</code>) וכתבו משוואות לוגיות לכל אחד מארבעת שלבי המחבר המלא.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> that implements a 4-bit Ripple Carry Adder.
The module has two 4-bit inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, a 1-bit carry-in <code dir="ltr">cin</code>, a 4-bit sum output <code dir="ltr">sum</code>, and a 1-bit carry-out <code dir="ltr">cout</code>.
Declare internal intermediate wires (<code dir="ltr">wire c1, c2, c3;</code>) and write inline boolean equations for each of the 4 full adder stages.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);
    // הגדר חוטים פנימיים לנשיאות כאן / Declare intermediate carry wires here

    // כתוב את לוגיקת ארבעת השלבים כאן / Write the logic for the four stages here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);
    wire c1, c2, c3;

    assign sum[0] = a[0] ^ b[0] ^ cin;
    assign c1 = (a[0] & b[0]) | (cin & (a[0] ^ b[0]));

    assign sum[1] = a[1] ^ b[1] ^ c1;
    assign c2 = (a[1] & b[1]) | (c1 & (a[1] ^ b[1]));

    assign sum[2] = a[2] ^ b[2] ^ c2;
    assign c3 = (a[2] & b[2]) | (c2 & (a[2] ^ b[2]));

    assign sum[3] = a[3] ^ b[3] ^ c3;
    assign cout = (a[3] & b[3]) | (c3 & (a[3] ^ b[3]));
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
        { time: 5, a: 5, b: 3, cin: 0, sum: 8, cout: 0 },
        { time: 10, a: 12, b: 5, cin: 0, sum: 1, cout: 1 },
        { time: 15, a: 15, b: 0, cin: 1, sum: 0, cout: 1 },
        { time: 20, a: 7, b: 8, cin: 1, sum: 0, cout: 1 },
        { time: 25, a: 1, b: 2, cin: 1, sum: 4, cout: 0 }
      ],

      hints: {
        he: "הגדירו שלושה חוטים פנימיים: wire c1, c2, c3; כדי להעביר את הנשיאה מביט לביט. רשמו לוגיקת מחבר מלא עבור כל ביט בנפרד (0 עד 3), כאשר שלב 0 משתמש ב-cin ומוציא את c1, שלב 1 משתמש ב-c1 ומוציא את c2, וכן הלאה, עד ששלב 3 מוציא את cout.",
        en: "Declare three internal wires: wire c1, c2, c3; to propagate the carries. Write the full adder logic for each bit index (0 to 3) sequentially, where stage 0 uses cin and outputs c1, stage 1 uses c1 and outputs c2, and so on, until stage 3 outputs cout."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
