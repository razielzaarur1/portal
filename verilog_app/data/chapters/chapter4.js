/* ==========================================================================
   VeriLearn Curriculum — Chapter 4: Hierarchy, Modules & Parameters (Lessons 25 to 31)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 25: Module Instantiation (Positional Port Mapping)
    // --------------------------------------------------------------------------
    {
      id: 25,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "אינסטנסיאציה לפי מיקום (Positional Port Mapping) 🏗️",
      titleEn: "Module Instantiation (Positional Port Mapping)",

      explanationHe: `
<h3>1. היררכיה בתכנון שבבים ופילוסופיית "אבני הבניין" 🏗️</h3>
<p>בתעשיית המיקרו-אלקטרוניקה, מעבדים מודרניים ומעגלים משולבים (ASIC/FPGA) מכילים מיליארדי טרנזיסטורים. בלתי אפשרי לכתוב מעגל כזה כקובץ יחיד או במודול שטוח אחד.</p>
<p>בפרקים 2 ו-3 בנינו את אבני הבניין היסודיות של עולם החומרה:</p>
<ul>
  <li><strong>חצי מחבר (<code dir="ltr">half_adder</code>)</strong> – שחיבר שני ביטים בודדים (שיעור 14).</li>
  <li><strong>מחבר מלא (<code dir="ltr">full_adder</code>)</strong> – שחיבר שני ביטים עם נשיאה בכניסה (שיעור 15).</li>
  <li><strong>מרבב 2-ל-1 (<code dir="ltr">mux_2to1</code>)</strong> – ששימש כבורר נתונים מהיר (שיעור 17).</li>
</ul>
<p>בדיוק כפי שבתוכנה אנו מחלקים קוד לפונקציות ולמחלקות, בתכנון חומרה אנו בונים מודולים עצמאיים ובדוקים, ולאחר מכן משלבים אותם בתוך מודול ראשי (Top Module). תהליך שילוב מודול פנימי נקרא <strong>Module Instantiation</strong> (אינסטנסיאציה של מודול).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור לפי מיקום (Positional Port Mapping) 📐</h3>
<p>הדרך הבסיסית ביותר לחבר תת-מודול היא לפי <strong>סדר הפורטים המקורי</strong> שלו. אנו מעבירים את שמות האותות בתוך סוגריים, בדיוק לפי הסדר שבו הוגדרו במודול הפנימי.</p>

<p>התחביר הכללי:</p>
<pre dir="ltr"><code>sub_module_name instance_name (signal_1, signal_2, signal_3, ...);</code></pre>

<p>ניזכר בהגדרת חצי המחבר (<code dir="ltr">half_adder</code>) משיעור 14:</p>
<pre dir="ltr"><code>module half_adder (
    input  a,
    input  b,
    output sum,
    output cout
);
    assign sum  = a ^ b;
    assign cout = a & b;
endmodule</code></pre>

<p>כדי להשתמש ב-<code dir="ltr">half_adder</code> בתוך מודול אב ולחבר אליו אותות בשמות שונים (<code dir="ltr">x</code>, <code dir="ltr">y</code>, <code dir="ltr">s</code>, <code dir="ltr">c</code>):</p>
<pre dir="ltr"><code>module arithmetic_unit (
    input  x,
    input  y,
    output s,
    output c
);
    // חיבור לפי מיקום: x מתחבר ל-a, y מתחבר ל-b, s מתחבר ל-sum, ו-c מתחבר ל-cout
    half_adder u_ha (x, y, s, c);
endmodule</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. תרשים חיבור האותות לפי מיקום 📊</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.5; text-align: center;">
  אותות מודול האב:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▲<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1st&nbsp;│&nbsp;&nbsp;&nbsp;2nd&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3rd&nbsp;│&nbsp;&nbsp;&nbsp;4th&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
  תת-מודול (half_adder): ( .a&nbsp;&nbsp;,&nbsp;&nbsp;.b&nbsp;&nbsp;───►&nbsp;&nbsp;.sum&nbsp;&nbsp;,&nbsp;&nbsp;.cout )
</div>

<p><strong>שימו לב:</strong> בחיבור לפי מיקום, סדר האותות בסוגריים קריטי לחלוטין! אם תחליפו בטעות בין <code dir="ltr">s</code> ל-<code dir="ltr">c</code>, החיבור הפיזי בשבב ישתנה לחלוטין ויגרום לשגיאות לוגיות קשות.</p>
`,

      explanationEn: `
<h3>1. Hardware Hierarchy & The "Building Blocks" Philosophy 🏗️</h3>
<p>In modern microelectronics and chip design (ASIC/FPGA), integrated circuits contain billions of transistors. It is impossible to describe such complexity in a single flat file or monolithic module.</p>
<p>In Chapters 2 and 3, we built foundational hardware building blocks:</p>
<ul>
  <li><strong><code dir="ltr">half_adder</code></strong> – adds two single bits (Lesson 14).</li>
  <li><strong><code dir="ltr">full_adder</code></strong> – adds two bits with a carry-in (Lesson 15).</li>
  <li><strong><code dir="ltr">mux_2to1</code></strong> – selects between two data inputs based on a control line (Lesson 17).</li>
</ul>
<p>Just as software developers break complex programs into functions and classes, hardware engineers create self-contained, verified modules and instantiate them inside higher-level modules (Top Module). This process is called <strong>Module Instantiation</strong>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Positional Port Mapping 📐</h3>
<p>The simplest way to connect a sub-module is by <strong>the positional order of its ports</strong>. Signals from the parent module are passed inside parentheses, matching the exact order declared in the sub-module definition.</p>

<p>General Syntax:</p>
<pre dir="ltr"><code>sub_module_name instance_name (signal_1, signal_2, signal_3, ...);</code></pre>

<p>Recall the <code dir="ltr">half_adder</code> definition from Lesson 14:</p>
<pre dir="ltr"><code>module half_adder (
    input  a,
    input  b,
    output sum,
    output cout
);
    assign sum  = a ^ b;
    assign cout = a & b;
endmodule</code></pre>

<p>To use <code dir="ltr">half_adder</code> inside a parent design with signals named <code dir="ltr">x</code>, <code dir="ltr">y</code>, <code dir="ltr">s</code>, and <code dir="ltr">c</code>:</p>
<pre dir="ltr"><code>module arithmetic_unit (
    input  x,
    input  y,
    output s,
    output c
);
    // Positional connection: x -> a, y -> b, s -> sum, c -> cout
    half_adder u_ha (x, y, s, c);
endmodule</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Positional Signal Mapping Diagram 📊</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.5; text-align: center;">
  Parent Signals:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▲<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1st&nbsp;│&nbsp;&nbsp;&nbsp;2nd&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3rd&nbsp;│&nbsp;&nbsp;&nbsp;4th&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
  Sub-module (half_adder): ( .a&nbsp;&nbsp;,&nbsp;&nbsp;.b&nbsp;&nbsp;───►&nbsp;&nbsp;.sum&nbsp;&nbsp;,&nbsp;&nbsp;.cout )
</div>

<p><strong>Crucial Rule:</strong> Positional mapping depends strictly on port order. If you swap <code dir="ltr">s</code> and <code dir="ltr">c</code>, the physical wiring changes on silicon, causing major logic bugs.</p>
`,

      taskHe: `קיים במערכת מודול מוכן בשם <code dir="ltr">mod_a</code> המוגדר כך:
<code dir="ltr">module mod_a (input in1, input in2, output out_xor);</code>
(מודול זה מבצע פעולת XOR בדומה למוצא ה-sum של <code dir="ltr">half_adder</code>).
<br><br>
בנו את המודול הראשי <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">in1</code>, <code dir="ltr">in2</code> ויציאה <code dir="ltr">out_val</code>). צרו מופע של המודול <code dir="ltr">mod_a</code> בשם <code dir="ltr">u_mod</code> וחברו את כניסותיו ויציאותיו באמצעות חיבור לפי מיקום (Positional Mapping).`,

      taskEn: `A pre-defined module <code dir="ltr">mod_a</code> is available with the following signature:
<code dir="ltr">module mod_a (input in1, input in2, output out_xor);</code>
(This module computes an XOR operation, exactly like the sum output of a <code dir="ltr">half_adder</code>).
<br><br>
Build the top module <code dir="ltr">top_module</code> (which has inputs <code dir="ltr">in1</code>, <code dir="ltr">in2</code> and output <code dir="ltr">out_val</code>). Instantiate <code dir="ltr">mod_a</code> with the instance name <code dir="ltr">u_mod</code> and connect its ports to the top module signals using positional mapping.`,

      starterCode: `module top_module (
    input in1,
    input in2,
    output out_val
);
    // צור מופע של mod_a בשם u_mod כאן בחיבור לפי מיקום / Instantiate mod_a as u_mod here using positional mapping

endmodule`,

      solutionCode: `module top_module (
    input in1,
    input in2,
    output out_val
);
    mod_a u_mod (in1, in2, out_val);
endmodule`,

      expectedOutputs: [
        { time: 0, in1: 0, in2: 0, out_val: 0 },
        { time: 5, in1: 1, in2: 0, out_val: 1 },
        { time: 10, in1: 0, in2: 1, out_val: 1 },
        { time: 15, in1: 1, in2: 1, out_val: 0 }
      ],

      hints: {
        he: "השתמשו בתחביר: mod_a u_mod (in1, in2, out_val);",
        en: "Use the syntax: mod_a u_mod (in1, in2, out_val);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 26: Named Port Connection (.port)
    // --------------------------------------------------------------------------
    {
      id: 26,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "חיבור פורטים לפי שם (Named Port Connection) 📌",
      titleEn: "Named Port Connection (.port)",

      explanationHe: `
<h3>1. מדוע חיבור לפי מיקום מסוכן בתעשייה? ⚠️</h3>
<p>בשיעור הקודם חיברנו פורטים לפי מיקומם. למרות שזו שיטה קצרה, היא נחשבת <strong>ללא בטוחה ומאוד לא מומלצת</strong> בתכנון שבבים מקצועי (ASIC/FPGA). מדוע?</p>
<ul>
  <li>אם מפתח ישנה את סדר הפורטים בהגדרת תת-המודול (למשל מ-<code dir="ltr">a, b, sum, cout</code> ל-<code dir="ltr">a, b, cout, sum</code>), כל החיבורים במודול הראשי יתבלבלו ללא התרעת קומפילציה!</li>
  <li>במודולים גדולים (הכוללים עשרות ומאות פורטים), קל מאוד לטעות במיקום של חוט בודד.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור מפורש לפי שם (Named Port Mapping) 📌</h3>
<p>התקן המקצועי בתעשייה הוא ציון מפורש של שם הפורט של תת-המודול (עם נקודה לפניו <code dir="ltr">.port_name</code>), ובתוך הסוגריים את שם האות במודול האב <code dir="ltr">(parent_signal)</code>.</p>
<p>התחביר הכללי:</p>
<pre dir="ltr"><code>sub_module_name instance_name (
    .sub_port_a(parent_signal_1),
    .sub_port_b(parent_signal_2)
);</code></pre>

<p>נשתמש במרבב 2-ל-1 (<code dir="ltr">mux_2to1</code>) שבנינו בשיעור 17:</p>
<pre dir="ltr"><code>module mux_2to1 (
    input  a,
    input  b,
    input  sel,
    output out
);
    assign out = sel ? b : a;
endmodule</code></pre>

<p>במודול הראשי נחבר אותו לפי שם – <strong>וסדר השורות כלל לא משנה!</strong></p>
<pre dir="ltr"><code>module data_selector (
    input  ch0,
    input  ch1,
    input  mode,
    output q_out
);
    // חיבור לפי שם - sel נכתב ראשון, אחריו b ואז a!
    mux_2to1 u_mux (
        .sel(mode),
        .b(ch1),
        .a(ch0),
        .out(q_out)
    );
endmodule</code></pre>

<p>באופן דומה, עבור המחבר המלא (<code dir="ltr">full_adder</code> משיעור 15):</p>
<pre dir="ltr"><code>full_adder u_fa (
    .a(data_a),
    .b(data_b),
    .cin(carry_in),
    .sum(sum_out),
    .cout(carry_out)
);</code></pre>
`,

      explanationEn: `
<h3>1. Why Positional Connection is Dangerous in the Industry? ⚠️</h3>
<p>In the previous lesson, we connected ports positionally. While concise, positional mapping is considered <strong>unsafe and highly discouraged</strong> in professional chip design (ASIC/FPGA). Why?</p>
<ul>
  <li>If a designer refactors the sub-module and reorders ports (e.g. from <code dir="ltr">a, b, sum, cout</code> to <code dir="ltr">a, b, cout, sum</code>), all connections in the parent module will be silently scrambled without compile errors!</li>
  <li>In complex IP blocks with dozens or hundreds of I/O pins, misplaced connections are almost impossible to catch without formal verification.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Explicit Named Port Mapping 📌</h3>
<p>The universal industry standard is to explicitly map each sub-module port (prefixed with a dot <code dir="ltr">.port_name</code>) to the parent signal inside parentheses <code dir="ltr">(parent_signal)</code>.</p>
<p>General Syntax:</p>
<pre dir="ltr"><code>sub_module_name instance_name (
    .sub_port_a(parent_signal_1),
    .sub_port_b(parent_signal_2)
);</code></pre>

<p>Let's look at the <code dir="ltr">mux_2to1</code> multiplexer built in Lesson 17:</p>
<pre dir="ltr"><code>module mux_2to1 (
    input  a,
    input  b,
    input  sel,
    output out
);
    assign out = sel ? b : a;
endmodule</code></pre>

<p>In the top-level design, we instantiate it by name — <strong>and port declaration order does not matter!</strong></p>
<pre dir="ltr"><code>module data_selector (
    input  ch0,
    input  ch1,
    input  mode,
    output q_out
);
    // Named port mapping - sel is listed first, followed by b and a!
    mux_2to1 u_mux (
        .sel(mode),
        .b(ch1),
        .a(ch0),
        .out(q_out)
    );
endmodule</code></pre>

<p>Similarly, for our <code dir="ltr">full_adder</code> building block (Lesson 15):</p>
<pre dir="ltr"><code>full_adder u_fa (
    .a(data_a),
    .b(data_b),
    .cin(carry_in),
    .sum(sum_out),
    .cout(carry_out)
);</code></pre>
`,

      taskHe: `קיים במערכת מודול בשם <code dir="ltr">mod_a</code> המוגדר כך:
<code dir="ltr">module mod_a (input in1, input in2, output out_and);</code>
(מודול זה מבצע פעולת AND, בדומה למוצא ה-cout של <code dir="ltr">half_adder</code>).
<br><br>
במודול הראשי <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code> ויציאה <code dir="ltr">out_val</code>), צרו מופע בשם <code dir="ltr">u_mod</code> וחברו את הפורטים **לפי שם** כך ש-<code dir="ltr">in1</code> יתחבר ל-<code dir="ltr">a</code>, <code dir="ltr">in2</code> יתחבר ל-<code dir="ltr">b</code>, ו-<code dir="ltr">out_and</code> יתחבר ל-<code dir="ltr">out_val</code>.`,

      taskEn: `A pre-defined sub-module <code dir="ltr">mod_a</code> exists with the signature:
<code dir="ltr">module mod_a (input in1, input in2, output out_and);</code>
(This module performs an AND operation, similar to the carry-out of a <code dir="ltr">half_adder</code>).
<br><br>
Inside <code dir="ltr">top_module</code> (with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code> and output <code dir="ltr">out_val</code>), instantiate <code dir="ltr">mod_a</code> as <code dir="ltr">u_mod</code> using explicit named port connections: <code dir="ltr">.in1(a)</code>, <code dir="ltr">.in2(b)</code>, and <code dir="ltr">.out_and(out_val)</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out_val
);
    // צור מופע של mod_a בשם u_mod כאן בחיבור לפי שם / Instantiate mod_a as u_mod here using named port mapping

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out_val
);
    mod_a u_mod (
        .in1(a),
        .in2(b),
        .out_and(out_val)
    );
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_val: 0 },
        { time: 5, a: 1, b: 0, out_val: 0 },
        { time: 10, a: 0, b: 1, out_val: 0 },
        { time: 15, a: 1, b: 1, out_val: 1 }
      ],

      hints: {
        he: "השתמשו בתחביר הבא: .in1(a), .in2(b), .out_and(out_val)",
        en: "Use the named syntax: .in1(a), .in2(b), .out_and(out_val)"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 27: Multiple Sub-module Instances
    // --------------------------------------------------------------------------
    {
      id: 27,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מופעים מרובים וחיבור ביניהם (Multiple Instances) 🏢",
      titleEn: "Multiple Sub-module Instances",

      explanationHe: `
<h3>1. שכפול מודולים לבניית מערכות מורכבות 🏢</h3>
<p>אחת העוצמות הגדולות של תכנון חומרה מודולרי היא היכולת לשכפל אבן בניין בסיסית מספר רב של פעמים על גבי הסיליקון.</p>
<p>בשיעור 16 ראינו כיצד יצרנו מחבר 4-ביט שלם (<code dir="ltr">ripple_carry_adder_4bit</code>) על ידי יצירת 4 מופעים נפרדים של <code dir="ltr">full_adder</code> (<code dir="ltr">fa0</code>, <code dir="ltr">fa1</code>, <code dir="ltr">fa2</code>, <code dir="ltr">fa3</code>).</p>
<p>דוגמה קלאסית נוספת: בניית <strong>מרבב 4-ל-1</strong> באמצעות שלושה מופעים של מרבב 2-ל-1 (<code dir="ltr">mux_2to1</code> משיעור 17)!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. קווי קשר פנימיים (Internal Wires) 🔗</h3>
<p>כאשר מוצא של מופע אחד צריך להתחבר כקלט למופע אחר, עלינו להצהיר על חוט פנימי באמצעות <code dir="ltr">wire</code> במודול האב. חוט זה מתפקד כמוליך נחושת פנימי המחבר בין שני הרכיבים.</p>

<p>דוגמה לבניית מרבב 4-ל-1 היררכי משלושה מרבבי 2-ל-1:</p>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4;">
  in0, in1 ──► [ u_mux0 (mux_2to1) ] ──► (wire mux_low)&nbsp;&nbsp;──┐<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [ u_mux2 (mux_2to1) ] ──► out<br>
  in2, in3 ──► [ u_mux1 (mux_2to1) ] ──► (wire mux_high) ──┘
</div>

<p>נממש מבנה זה בקוד Verilog:</p>
<pre dir="ltr"><code>module mux_4to1_hierarchical (
    input  in0, in1, in2, in3,
    input  [1:0] sel,
    output out
);
    wire mux_low;  // חוט מקשר לתוצאת שלב ראשון (in0 מול in1)
    wire mux_high; // חוט מקשר לתוצאת שלב ראשון (in2 מול in3)

    // שלב 1: בחירה ראשונית לפי sel[0]
    mux_2to1 u_mux0 (.a(in0), .b(in1), .sel(sel[0]), .out(mux_low));
    mux_2to1 u_mux1 (.a(in2), .b(in3), .sel(sel[0]), .out(mux_high));

    // שלב 2: בחירה סופית בין שני החצאים לפי sel[1]
    mux_2to1 u_mux2 (.a(mux_low), .b(mux_high), .sel(sel[1]), .out(out));
endmodule</code></pre>

<p><strong>כללי מפתח:</strong></p>
<ol>
  <li>לכל מופע חובה לתת <strong>שם מופע ייחודי</strong> (למשל <code dir="ltr">u_inv1</code>, <code dir="ltr">u_inv2</code>).</li>
  <li>חיבורים בין מופעים מתבצעים תמיד דרך הצהרות <code dir="ltr">wire</code> מקומיות.</li>
</ol>
`,

      explanationEn: `
<h3>1. Reusing Sub-modules to Build Complex Systems 🏢</h3>
<p>One of the core strengths of modular hardware design is the ability to stamp out multiple physical instances of a foundational building block on silicon.</p>
<p>In Lesson 16, we saw this when building a 4-bit Ripple Carry Adder (<code dir="ltr">ripple_carry_adder_4bit</code>) using 4 instances of <code dir="ltr">full_adder</code> (<code dir="ltr">fa0</code>, <code dir="ltr">fa1</code>, <code dir="ltr">fa2</code>, <code dir="ltr">fa3</code>).</p>
<p>Another classic architectural pattern: Building a <strong>4-to-1 Multiplexer</strong> using three instances of our 2-to-1 MUX (<code dir="ltr">mux_2to1</code> from Lesson 17)!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Internal Wires for Inter-instance Routing 🔗</h3>
<p>When the output of one instance feeds into the input of another, we declare an internal connection using the <code dir="ltr">wire</code> keyword in the top module. This wire acts as a physical interconnect trace on the silicon substrate.</p>

<p>Block diagram of a hierarchical 4-to-1 MUX constructed from three 2-to-1 MUXes:</p>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4;">
  in0, in1 ──► [ u_mux0 (mux_2to1) ] ──► (wire mux_low)&nbsp;&nbsp;──┐<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [ u_mux2 (mux_2to1) ] ──► out<br>
  in2, in3 ──► [ u_mux1 (mux_2to1) ] ──► (wire mux_high) ──┘
</div>

<p>Implementing this hierarchy in Verilog:</p>
<pre dir="ltr"><code>module mux_4to1_hierarchical (
    input  in0, in1, in2, in3,
    input  [1:0] sel,
    output out
);
    wire mux_low;  // intermediate wire from lower pair
    wire mux_high; // intermediate wire from upper pair

    // Stage 1: Select between pairs using sel[0]
    mux_2to1 u_mux0 (.a(in0), .b(in1), .sel(sel[0]), .out(mux_low));
    mux_2to1 u_mux1 (.a(in2), .b(in3), .sel(sel[0]), .out(mux_high));

    // Stage 2: Final selection between the two stage 1 outputs using sel[1]
    mux_2to1 u_mux2 (.a(mux_low), .b(mux_high), .sel(sel[1]), .out(out));
endmodule</code></pre>

<p><strong>Key Rules:</strong></p>
<ol>
  <li>Each instance must have a <strong>unique instance name</strong> (e.g. <code dir="ltr">u_inv1</code>, <code dir="ltr">u_inv2</code>).</li>
  <li>Signals routed between sub-modules must be declared as internal <code dir="ltr">wire</code> nodes.</li>
</ol>
`,

      taskHe: `במערכת מוגדר מראש מודול מהפך בשם <code dir="ltr">inverter_block</code>:
<code dir="ltr">module inverter_block (input in_sig, output out_sig);</code>
<br><br>
בתוך המודול הראשי <code dir="ltr">top_module</code> (בעל כניסה <code dir="ltr">in_val</code> ויציאה <code dir="ltr">out_val</code>), הגדירו חוט קשר פנימי בשם <code dir="ltr">temp_wire</code>, וצרו שני מופעים של המהפך:
<ul>
  <li>המופע הראשון בשם <code dir="ltr">u_inv1</code> יקבל את הכניסה <code dir="ltr">in_val</code> ויפיק את האות הפנימי <code dir="ltr">temp_wire</code>.</li>
  <li>המופע השני בשם <code dir="ltr">u_inv2</code> יקבל את האות הפנימי <code dir="ltr">temp_wire</code> ויפיק את היציאה הראשית <code dir="ltr">out_val</code>.</li>
</ul>
חברו את המודולים **לפי שם**. פעולה זו משרשרת שני מהפכים זה אחר זה (המהפך הכפול ישמור על הערך המקורי).`,

      taskEn: `A pre-defined inverter module <code dir="ltr">inverter_block</code> exists in the system:
<code dir="ltr">module inverter_block (input in_sig, output out_sig);</code>
<br><br>
Inside your <code dir="ltr">top_module</code> (with input <code dir="ltr">in_val</code> and output <code dir="ltr">out_val</code>), declare an intermediate connection named <code dir="ltr">temp_wire</code>, and instantiate two copies of <code dir="ltr">inverter_block</code>:
<ul>
  <li>The first instance named <code dir="ltr">u_inv1</code> takes <code dir="ltr">in_val</code> and outputs to <code dir="ltr">temp_wire</code>.</li>
  <li>The second instance named <code dir="ltr">u_inv2</code> takes <code dir="ltr">temp_wire</code> and outputs to <code dir="ltr">out_val</code>.</li>
</ul>
Connect the modules **by name**. This setup chains two inverters in series (double negation yields the original input).`,

      starterCode: `module top_module (
    input in_val,
    output out_val
);
    // הגדר חוט מקשר פנימי כאן / Declare the intermediate wire here
    
    // צור מופע של המהפך הראשון u_inv1 / Instantiate first inverter u_inv1
    
    // צור מופע של המהפך השני u_inv2 / Instantiate second inverter u_inv2

endmodule`,

      solutionCode: `module top_module (
    input in_val,
    output out_val
);
    wire temp_wire;
    inverter_block u_inv1 (.in_sig(in_val), .out_sig(temp_wire));
    inverter_block u_inv2 (.in_sig(temp_wire), .out_sig(out_val));
endmodule`,

      expectedOutputs: [
        { time: 0, in_val: 0, out_val: 0 },
        { time: 5, in_val: 1, out_val: 1 },
        { time: 10, in_val: 0, out_val: 0 }
      ],

      hints: {
        he: "הצהירו על wire temp_wire; וחברו את .in_sig ו-.out_sig במופעים u_inv1 ו-u_inv2.",
        en: "Declare wire temp_wire; and map the .in_sig and .out_sig ports in instances u_inv1 and u_inv2."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 28: Parameterized Modules (parameter)
    // --------------------------------------------------------------------------
    {
      id: 28,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מודולים פרמטריים (parameter) ⚙️",
      titleEn: "Parameterized Modules (parameter)",

      explanationHe: `
<h3>1. למה צריך מודולים דינמיים? ⚙️</h3>
<p>נניח שאתם מפתחים מעבד. שלב אחד דורש חיבור של שני מספרים ברוחב 8 ביט, שלב אחר דורש חיבור של מספרים ברוחב 16 ביט, ובקרה מרכזית דורשת חיבור של 32 ביט. האם נכתוב מודול מחבר (Adder) נפרד לכל רוחב?</p>
<p>בוודאי שלא. זהו בזבוז קוד איום ופתח לשגיאות רבות. ב-Verilog אנו יכולים להגדיר קבועים מיוחדים הנקראים <strong>Parameters (פרמטרים)</strong>, המאפשרים לקבוע מאפיינים שונים של המודול (כמו רוחב אותות) בזמן הקומפילציה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הגדרת פרמטר במודול 📐</h3>
<p>הגדרת פרמטרים מתבצעת בעזרת התחביר <code>#(parameter NAME = default_value)</code> מיד לאחר שם המודול, ולפני הגדרת הפורטים.</p>
<p>נראה דוגמה של מודול צובר (Accumulator) גנרי:</p>
<pre dir="ltr"><code>module accumulator #(
    parameter SIZE = 16 // ערך ברירת מחדל של 16 ביט
) (
    input  [SIZE-1:0] data_in,
    output [SIZE-1:0] data_out
);
    assign data_out = data_in; // העברה ישירה
endmodule</code></pre>
<p>כאשר רושמים <code>[SIZE-1:0]</code>, רוחב האוטובוס נקבע באופן דינמי לפי ערך הפרמטר. אם <code>SIZE</code> הוא 16, רוחב האוטובוס יהיה 16 ביטים (מאינדקס 0 עד 15).</p>
`,

      explanationEn: `
<h3>1. Why Do We Need Dynamic Modules? ⚙️</h3>
<p>Suppose you are designing a processor. One block requires adding two 8-bit numbers, another block needs to add 16-bit numbers, and the central ALU operates on 32-bit values. Should you write separate adder modules for each width?</p>
<p>Absolutely not. That would result in redundant code and lead to potential mistakes. Verilog allows us to define compile-time constants called <strong>Parameters</strong>. They let us define attributes of a module (like bus widths or buffer capacities) dynamically.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Defining a Parameter inside a Module 📐</h3>
<p>Parameters are defined using the <code>#(parameter NAME = default_value)</code> syntax immediately after the module name and before the port list.</p>
<p>Let's look at a generic accumulator design:</p>
<pre dir="ltr"><code>module accumulator #(
    parameter SIZE = 16 // Default value of 16 bits
) (
    input  [SIZE-1:0] data_in,
    output [SIZE-1:0] data_out
);
    assign data_out = data_in; // Simple bypass
endmodule</code></pre>
<p>By writing <code>[SIZE-1:0]</code>, the bus width is dynamically determined by the parameter value. If <code>SIZE</code> is 16, the bus width will be 16 bits (indexed from 0 to 15).</p>
`,

      taskHe: `כתבו מודול פרמטרי בשם <code dir="ltr">top_module</code>.
<br>
המודול יקבל פרמטר בשם <code dir="ltr">WIDTH</code> עם ערך ברירת מחדל של <code dir="ltr">8</code>.
<br><br>
על המודול להכיל:
<ul>
  <li>כניסה בגודל <code dir="ltr">WIDTH</code> ביטים בשם <code dir="ltr">data_in</code> (מוגדרת כ-<code dir="ltr">input [WIDTH-1:0] data_in</code>).</li>
  <li>יציאה בגודל <code dir="ltr">WIDTH</code> ביטים בשם <code dir="ltr">data_out</code> (מוגדרת כ-<code dir="ltr">output [WIDTH-1:0] data_out</code>).</li>
</ul>
בצעו היפוך ביט-ביט (Bitwise NOT) בין הכניסה ליציאה: <code dir="ltr">assign data_out = ~data_in;</code>.`,

      taskEn: `Create a parameterized module named <code dir="ltr">top_module</code>.
<br>
The module must define a parameter named <code dir="ltr">WIDTH</code> with a default value of <code dir="ltr">8</code>.
<br><br>
The module should have:
<ul>
  <li>A vector input of size <code dir="ltr">WIDTH</code> bits named <code dir="ltr">data_in</code> (declared as <code dir="ltr">input [WIDTH-1:0] data_in</code>).</li>
  <li>A vector output of size <code dir="ltr">WIDTH</code> bits named <code dir="ltr">data_out</code> (declared as <code dir="ltr">output [WIDTH-1:0] data_out</code>).</li>
</ul>
Assign <code dir="ltr">data_out = ~data_in;</code> to perform a bitwise inversion.`,

      starterCode: `module top_module #(
    // הגדר את הפרמטר WIDTH עם ערך ברירת מחדל 8 כאן / Define WIDTH parameter with default value 8 here
) (
    // הגדר כניסה data_in ויציאה data_out ברוחב WIDTH / Define ports data_in and data_out of size WIDTH
);
    // בצע היפוך ביט-ביט / Assign bitwise inversion here

endmodule`,

      solutionCode: `module top_module #(
    parameter WIDTH = 8
) (
    input [WIDTH-1:0] data_in,
    output [WIDTH-1:0] data_out
);
    assign data_out = ~data_in;
endmodule`,

      expectedOutputs: [
        { time: 0, data_in: 240, data_out: 15 },
        { time: 5, data_in: 85, data_out: 170 },
        { time: 10, data_in: 252, data_out: 3 },
        { time: 15, data_in: 3, data_out: 252 }
      ],

      hints: {
        he: "הגדירו parameter WIDTH = 8 בתוך ה-#(...) והשתמשו ב-[WIDTH-1:0] להגדרת הפורטים.",
        en: "Declare parameter WIDTH = 8 inside the #(...) and use [WIDTH-1:0] to define the ports."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 29: Override Parameters
    // --------------------------------------------------------------------------
    {
      id: 29,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "דריסת פרמטרים (Parameter Overriding) 🔄",
      titleEn: "Override Parameters",

      explanationHe: `
<h3>1. כיצד לדרוס ערכי פרמטרים? 🔄</h3>
<p>מודולים פרמטריים מגיעים עם ערכי ברירת מחדל. אך היתרון האמיתי שלהם מתבטא כאשר אנו יוצרים מופע של המודול במקום כלשהו, ומחליטים <strong>לדרוס (Override)</strong> את ערכי ברירת המחדל לערך אחר המתאים לאותו מופע ספציפי.</p>
<p>הדבר מאפשר שימוש חוזר רחב ומפחית משמעותית כתיבת קוד כפול.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר דריסה בעזרת סמל הדיאז 📐</h3>
<p>כאשר מבצעים אינסטנסיאציה, רושמים את סמל הדיאז <code>#</code> וסוגריים מיד לאחר שם המודול, ובתוכם מעבירים את הערך החדש עבור הפרמטר:</p>
<pre dir="ltr"><code>// דריסת פרמטר לפי שם
module_name #(
    .PARAMETER_NAME(new_value)
) instance_name (
    .port_name(signal_name)
);</code></pre>

<p>נראה דוגמה של מודול אוגר כללי:</p>
<pre dir="ltr"><code>module register #(parameter BITS = 8) (input [BITS-1:0] d, output [BITS-1:0] q);</code></pre>
<p>אם נרצה ליצור מופע שלו ברוחב 32 ביט במודול הראשי:</p>
<pre dir="ltr"><code>module cpu_top (input [31:0] data_bus, output [31:0] reg_bus);
    // דריסת הפרמטר BITS ל-32
    register #(.BITS(32)) u_reg32 (
        .d(data_bus),
        .q(reg_bus)
    );
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. How to Override Parameter Values? 🔄</h3>
<p>Parameterized modules come with default values. However, their true power is unlocked when we instantiate them and choose to <strong>override</strong> the defaults with values custom-tailored to that specific instance.</p>
<p>This increases code reusability and dramatically reduces duplicate code.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Overriding Syntax Using the Hash Symbol 📐</h3>
<p>When instantiating a parameterized module, place a hash symbol <code>#</code> and parentheses right after the module name, inside which we pass the new values for the parameters:</p>
<pre dir="ltr"><code>// Named parameter overriding
module_name #(
    .PARAMETER_NAME(new_value)
) instance_name (
    .port_name(signal_name)
);</code></pre>

<p>Suppose we have a generic register module defined as:</p>
<pre dir="ltr"><code>module register #(parameter BITS = 8) (input [BITS-1:0] d, output [BITS-1:0] q);</code></pre>
<p>To instantiate it with a width of 32 bits inside a top module, write:</p>
<pre dir="ltr"><code>module cpu_top (input [31:0] data_bus, output [31:0] reg_bus);
    // Overriding parameter BITS to 32
    register #(.BITS(32)) u_reg32 (
        .d(data_bus),
        .q(reg_bus)
    );
endmodule</code></pre>
`,

      taskHe: `במערכת מוגדר מודול זיכרון פרמטרי בשם <code dir="ltr">ram_block</code> הבא:
<pre dir="ltr"><code>module ram_block #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
) (
    input clk,
    input [ADDR_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    output [DATA_WIDTH-1:0] rdata
);</code></pre>
<br>
בתוך המודול הראשי <code dir="ltr">top_module</code> (בעל כניסת שעון <code dir="ltr">clk</code>, כניסת כתובת <code dir="ltr">addr_in</code> בגודל 6 ביט, כניסת נתונים <code dir="ltr">wdata_in</code> בגודל 16 ביט, ויציאת נתונים <code dir="ltr">rdata_out</code> בגודל 16 ביט), צרו מופע שלו בשם <code dir="ltr">u_ram</code>.
<br><br>
עליכם **לדרוס** את הפרמטרים שלו כך ש-<code dir="ltr">DATA_WIDTH</code> יהיה <code dir="ltr">16</code> ו-<code dir="ltr">ADDR_WIDTH</code> יהיה <code dir="ltr">6</code>. חברו את כל הפורטים לפי שמם.`,

      taskEn: `A pre-defined parameterized memory block named <code dir="ltr">ram_block</code> exists:
<pre dir="ltr"><code>module ram_block #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
) (
    input clk,
    input [ADDR_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    output [DATA_WIDTH-1:0] rdata
);</code></pre>
<br>
Inside <code dir="ltr">top_module</code> (which has a clock <code dir="ltr">clk</code>, a 6-bit input address <code dir="ltr">addr_in</code>, a 16-bit input data <code dir="ltr">wdata_in</code>, and a 16-bit output data <code dir="ltr">rdata_out</code>), instantiate it with the name <code dir="ltr">u_ram</code>.
<br><br>
You must **override** its parameters so that <code dir="ltr">DATA_WIDTH</code> is set to <code dir="ltr">16</code> and <code dir="ltr">ADDR_WIDTH</code> is set to <code dir="ltr">6</code>. Connect all ports by name.`,

      starterCode: `module top_module (
    input clk,
    input [5:0] addr_in,
    input [15:0] wdata_in,
    output [15:0] rdata_out
);
    // צור מופע של ram_block בשם u_ram ודרוס פרמטרים כאן / Instantiate ram_block as u_ram and override parameters here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input [5:0] addr_in,
    input [15:0] wdata_in,
    output [15:0] rdata_out
);
    ram_block #(
        .DATA_WIDTH(16),
        .ADDR_WIDTH(6)
    ) u_ram (
        .clk(clk),
        .addr(addr_in),
        .wdata(wdata_in),
        .rdata(rdata_out)
    );
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, addr_in: 0, wdata_in: 0, rdata_out: 0 },
        { time: 5, clk: 1, addr_in: 12, wdata_in: 42, rdata_out: 42 },
        { time: 10, clk: 0, addr_in: 12, wdata_in: 42, rdata_out: 42 }
      ],

      hints: {
        he: "השתמשו בתחביר הבא: ram_block #(.DATA_WIDTH(16), .ADDR_WIDTH(6)) u_ram (...);",
        en: "Use the named override syntax: ram_block #(.DATA_WIDTH(16), .ADDR_WIDTH(6)) u_ram (...);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 30: Generate For-Loop
    // --------------------------------------------------------------------------
    {
      id: 30,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "לולאות ייצור חומרה (Generate For-Loop) 🔁",
      titleEn: "Generate For-Loop",

      explanationHe: `
<h3>1. לולאות רגילות מול לולאות ייצור חומרה 🔁</h3>
<p>בפרקים הבאים נלמד על לולאות <code>for</code> בתוך בלוקי <code>always</code>. לולאות אלו מתארות התנהגות רציפה. אך מה קורה אם אנחנו רוצים <strong>לשכפל מבנה פיזי של רכיבים חומרתיים</strong> (כמו 32 שערים לוגיים נפרדים או 16 מופעים של מודול)?</p>
<p>לשם כך נועד הבלוק <strong>generate</strong> בשילוב עם משתנה מיוחד שנקרא <strong>genvar</strong>.</p>
<p><strong>כלל ברזל:</strong> לולאת generate משוכפלת ו"נפתחת" (Unrolled) בזמן הקומפילציה. כלי הסינתזה פשוט מייצר עותקים פיזיים של החומרה. היא אינה רצה בזמן ריצה בשבב עצמו!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר ה-Generate 📐</h3>
<p>חובה להגדיר משתנה לולאה מסוג <code>genvar</code>, לפתוח בלוק <code>generate</code> ולתת שם (label) לבלוק הפנימי של הלולאה:</p>
<pre dir="ltr"><code>genvar i;
generate
    for (i = 0; i &lt; 4; i = i + 1) begin : gen_block_name
        // הקצאה או אינסטנסיאציה של חומרה
        assign out_bus[i] = ~in_bus[i];
    end
endgenerate</code></pre>
<p>שימו לב ששם הבלוק (<code>gen_block_name</code>) חיוני מכיוון שכלי הסינתזה משתמש בו כדי ליצור שמות ייחודיים לרכיבים שנוצרים (למשל: <code>gen_block_name[0]</code>, <code>gen_block_name[1]</code> וכו').</p>
`,

      explanationEn: `
<h3>1. Behavioral Loops vs. Hardware Generation Loops 🔁</h3>
<p>We will learn about standard <code>for</code> loops inside <code>always</code> blocks in later chapters. Those loops describe sequential behavior. But what if we want to <strong>duplicate physical hardware structures</strong> (like 32 separate logic gates or 16 sub-module instances)?</p>
<p>For this purpose, Verilog provides the <strong>generate</strong> block, used alongside a special loop variable called a <strong>genvar</strong>.</p>
<p><strong>Rule of Thumb:</strong> A generate loop is unrolled during compile-time (synthesis). The compiler duplicates the physical gates. It does NOT run dynamically at runtime on the physical chip!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Generate Loop Syntax 📐</h3>
<p>You must declare a loop index variable using the <code>genvar</code> keyword, open a <code>generate</code> block, and provide a unique label/name for the loop body block:</p>
<pre dir="ltr"><code>genvar i;
generate
    for (i = 0; i &lt; 4; i = i + 1) begin : gen_block_name
        // Hardware assignment or instantiation
        assign out_bus[i] = ~in_bus[i];
    end
endgenerate</code></pre>
<p>The loop body label (<code>gen_block_name</code>) is mandatory because the synthesis tool uses it to generate unique hierarchical names for the instantiated components (e.g. <code>gen_block_name[0]</code>, <code>gen_block_name[1]</code>, etc.).</p>
`,

      taskHe: `כתבו מודול בשם <code dir="ltr">top_module</code> המבצע פעולת XOR ביט-ביט בין שני וקטורים בגודל 8 ביט: <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ומפיק יציאה בגודל 8 ביט בשם <code dir="ltr">y</code>.
<br><br>
עליכם להשתמש בבלוק <code dir="ltr">generate</code> ובסגנון לולאת <code dir="ltr">for</code> עם משתנה <code dir="ltr">genvar i</code> כדי לבצע את ההשמות <code dir="ltr">y[i] = a[i] ^ b[i]</code>. העניקו ללולאה את השם <code dir="ltr">xor_loop</code>.`,

      taskEn: `Create a module named <code dir="ltr">top_module</code> that performs a bitwise XOR between two 8-bit vector inputs: <code dir="ltr">a</code> and <code dir="ltr">b</code>, producing an 8-bit output <code dir="ltr">y</code>.
<br><br>
You must use a <code dir="ltr">generate</code> block with a <code dir="ltr">for</code> loop and a <code dir="ltr">genvar i</code> to assign <code dir="ltr">y[i] = a[i] ^ b[i]</code>. Name the loop body block <code dir="ltr">xor_loop</code>.`,

      starterCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    output [7:0] y
);
    // הגדר genvar כאן / Declare your genvar here
    
    // כתוב בלוק generate המכיל לולאת for לביצוע ה-XOR / Write generate block with for-loop here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    output [7:0] y
);
    genvar i;
    generate
        for (i = 0; i < 8; i = i + 1) begin : xor_loop
            assign y[i] = a[i] ^ b[i];
        end
    endgenerate
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, y: 0 },
        { time: 5, a: 15, b: 240, y: 255 },
        { time: 10, a: 85, b: 85, y: 0 }
      ],

      hints: {
        he: "הגדירו genvar i; בתוך המודול, ואז רשמו generate ... for (...) begin : xor_loop ... end endgenerate",
        en: "Declare genvar i; inside the module, then write generate ... for (...) begin : xor_loop ... end endgenerate"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 31: Hierarchical 16-bit Adder
    // --------------------------------------------------------------------------
    {
      id: 31,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מחבר 16-ביט היררכי (Hierarchical 16-bit Adder) 🧮",
      titleEn: "Hierarchical 16-bit Adder",

      explanationHe: `
<h3>1. פסגת ההיררכיה: בניית מעגלים גדולים מאבני בניין 🧮</h3>
<p>כדי לסכם את עקרונות התכנון ההיררכי שלמדנו, נתבונן בכל המסלול שעברנו עד כה:</p>
<ol>
  <li><strong>רמת השערים (Gate Level):</strong> שערים לוגיים בסיסיים כמו AND, OR, ו-XOR (פרק 1).</li>
  <li><strong>אבני הבניין היסודיות (1-Bit):</strong> חצי מחבר (<code dir="ltr">half_adder</code> משיעור 14) ומחבר מלא (<code dir="ltr">full_adder</code> משיעור 15).</li>
  <li><strong>תת-מערכת 4-ביט:</strong> מחבר זוחל (<code dir="ltr">ripple_carry_adder_4bit</code> משיעור 16) שנבנה משרשור 4 מופעים של <code dir="ltr">full_adder</code>.</li>
  <li><strong>מערכת-על 16-ביט:</strong> כעת נבנה <strong>מחבר 16-ביט מלא</strong> (<code dir="ltr">hierarchical_adder_16bit</code>) על ידי שרשור 4 מופעים של המחבר הזוחל של 4-ביט!</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. שרשור מחברי 4-ביט והולכת נשיאה (Carry Chain) 📐</h3>
<p>כדי לחבר שני מספרים בני 16 ביט (<code dir="ltr">a[15:0]</code> ו-<code dir="ltr">b[15:0]</code>) עם נשיאה בכניסה (<code dir="ltr">cin</code>), אנו מחלקים את הווקטורים ל-4 רבעים (Nibbles של 4 ביט כל אחד):</p>
<ul>
  <li><strong>רבע 0 (<code dir="ltr">rca0</code>):</strong> מחבר את <code dir="ltr">a[3:0]</code> עם <code dir="ltr">b[3:0]</code> ואת <code dir="ltr">cin</code>, ומייצר את <code dir="ltr">sum[3:0]</code> ונשיאת ביניים <code dir="ltr">c4</code>.</li>
  <li><strong>רבע 1 (<code dir="ltr">rca1</code>):</strong> מחבר את <code dir="ltr">a[7:4]</code> עם <code dir="ltr">b[7:4]</code> ואת הנשיאה <code dir="ltr">c4</code>, ומייצר את <code dir="ltr">sum[7:4]</code> ונשיאת ביניים <code dir="ltr">c8</code>.</li>
  <li><strong>רבע 2 (<code dir="ltr">rca2</code>):</strong> מחבר את <code dir="ltr">a[11:8]</code> עם <code dir="ltr">b[11:8]</code> ואת הנשיאה <code dir="ltr">c8</code>, ומייצר את <code dir="ltr">sum[11:8]</code> ונשיאת ביניים <code dir="ltr">c12</code>.</li>
  <li><strong>רבע 3 (<code dir="ltr">rca3</code>):</strong> מחבר את <code dir="ltr">a[15:12]</code> עם <code dir="ltr">b[15:12]</code> ואת הנשיאה <code dir="ltr">c12</code>, ומייצר את <code dir="ltr">sum[15:12]</code> ואת הנשיאה הסופית <code dir="ltr">cout</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. תרשים ההיררכיה וזרימת האותות 📊</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4; font-size: 0.85rem; overflow-x: auto;">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===============================================================<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hierarchical_adder_16bit (top_module)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a[15:0], b[15:0], cin ===&gt; sum[15:0], cout<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===============================================================<br><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘<br>
  cin ───► .cin   .cout ── c4 ───► .cin   .cout ── c8 ───► .cin   .cout ── c12 ──► .cin   .cout ───► cout<br>
  a[3:0]─► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a[7:4]─► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;a[11:8]► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;a[15:12]►.a     .sum  ──┐<br>
  b[3:0]─► .b           │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b[7:4]─► .b           │&nbsp;&nbsp;&nbsp;&nbsp;b[11:8]► .b           │&nbsp;&nbsp;&nbsp;&nbsp;b[15:12]►.b           │<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[3:0]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[7:4]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[11:8]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[15:12]<br>
</div>
`,

      explanationEn: `
<h3>1. The Pinnacle of Hierarchy: Composing Systems from Sub-modules 🧮</h3>
<p>To conclude our journey into hardware hierarchy and modularity, let us review the complete progression of abstraction:</p>
<ol>
  <li><strong>Gate Level:</strong> Primitive gates (AND, OR, XOR) in Chapter 1.</li>
  <li><strong>Foundational Building Blocks (1-Bit):</strong> <code dir="ltr">half_adder</code> (Lesson 14) and <code dir="ltr">full_adder</code> (Lesson 15).</li>
  <li><strong>4-Bit Sub-system:</strong> <code dir="ltr">ripple_carry_adder_4bit</code> (Lesson 16), constructed by chaining 4 instances of <code dir="ltr">full_adder</code>.</li>
  <li><strong>16-Bit Top-Level System:</strong> Now, we construct a <strong>full 16-bit Adder</strong> (<code dir="ltr">hierarchical_adder_16bit</code>) by chaining 4 instances of our 4-bit ripple carry adder!</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Chaining 4-bit Adders & Carry Propagation 📐</h3>
<p>To add two 16-bit operands (<code dir="ltr">a[15:0]</code> and <code dir="ltr">b[15:0]</code>) with a carry-in (<code dir="ltr">cin</code>), we partition the vectors into four 4-bit nibbles:</p>
<ul>
  <li><strong>Nibble 0 (<code dir="ltr">rca0</code>):</strong> Adds <code dir="ltr">a[3:0]</code> and <code dir="ltr">b[3:0]</code> with <code dir="ltr">cin</code>, producing <code dir="ltr">sum[3:0]</code> and intermediate carry <code dir="ltr">c4</code>.</li>
  <li><strong>Nibble 1 (<code dir="ltr">rca1</code>):</strong> Adds <code dir="ltr">a[7:4]</code> and <code dir="ltr">b[7:4]</code> with carry-in <code dir="ltr">c4</code>, producing <code dir="ltr">sum[7:4]</code> and intermediate carry <code dir="ltr">c8</code>.</li>
  <li><strong>Nibble 2 (<code dir="ltr">rca2</code>):</strong> Adds <code dir="ltr">a[11:8]</code> and <code dir="ltr">b[11:8]</code> with carry-in <code dir="ltr">c8</code>, producing <code dir="ltr">sum[11:8]</code> and intermediate carry <code dir="ltr">c12</code>.</li>
  <li><strong>Nibble 3 (<code dir="ltr">rca3</code>):</strong> Adds <code dir="ltr">a[15:12]</code> and <code dir="ltr">b[15:12]</code> with carry-in <code dir="ltr">c12</code>, producing <code dir="ltr">sum[15:12]</code> and final carry-out <code dir="ltr">cout</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Hierarchy & Carry Propagation Diagram 📊</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4; font-size: 0.85rem; overflow-x: auto;">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===============================================================<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hierarchical_adder_16bit (top_module)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a[15:0], b[15:0], cin ===&gt; sum[15:0], cout<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===============================================================<br><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────┐<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rca3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;ripple_carry_&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;adder_4bit&nbsp;&nbsp;&nbsp;│<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────┬───────┘<br>
  cin ───► .cin   .cout ── c4 ───► .cin   .cout ── c8 ───► .cin   .cout ── c12 ──► .cin   .cout ───► cout<br>
  a[3:0]─► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a[7:4]─► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;a[11:8]► .a     .sum  ──┐&nbsp;&nbsp;&nbsp;&nbsp;a[15:12]►.a     .sum  ──┐<br>
  b[3:0]─► .b           │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b[7:4]─► .b           │&nbsp;&nbsp;&nbsp;&nbsp;b[11:8]► .b           │&nbsp;&nbsp;&nbsp;&nbsp;b[15:12]►.b           │<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[3:0]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[7:4]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[11:8]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum[15:12]<br>
</div>
`,

      taskHe: `במערכת מוגדר מראש מודול של מחבר זוחל 4-ביט בשם <code dir="ltr">ripple_carry_adder_4bit</code> (משיעור 16):
<pre dir="ltr"><code>module ripple_carry_adder_4bit (
    input  [3:0] a,
    input  [3:0] b,
    input  cin,
    output [3:0] sum,
    output cout
);</code></pre>
<br>
בנו את המודול הראשי <code dir="ltr">top_module</code> (מחבר 16-ביט היררכי) בעל כניסות <code dir="ltr">a</code> ו-<code dir="ltr">b</code> בגודל 16 ביט, כניסת נשיאה ראשית <code dir="ltr">cin</code>, יציאת סכום <code dir="ltr">sum</code> בגודל 16 ביט, ויציאת נשיאה סופית <code dir="ltr">cout</code>.
<br><br>
עליכם להגדיר חוטים פנימיים לנשיאות הביניים (<code dir="ltr">wire c4, c8, c12;</code>) וליצור 4 מופעים של <code dir="ltr">ripple_carry_adder_4bit</code>:
<ul>
  <li><code dir="ltr">rca0</code>: מחבר את <code dir="ltr">a[3:0]</code> ו-<code dir="ltr">b[3:0]</code> עם נשיאה בכניסה <code dir="ltr">cin</code>, מפיק <code dir="ltr">sum[3:0]</code> ונשיאה החוצה <code dir="ltr">c4</code>.</li>
  <li><code dir="ltr">rca1</code>: מחבר את <code dir="ltr">a[7:4]</code> ו-<code dir="ltr">b[7:4]</code> עם נשיאה בכניסה <code dir="ltr">c4</code>, מפיק <code dir="ltr">sum[7:4]</code> ונשיאה החוצה <code dir="ltr">c8</code>.</li>
  <li><code dir="ltr">rca2</code>: מחבר את <code dir="ltr">a[11:8]</code> ו-<code dir="ltr">b[11:8]</code> עם נשיאה בכניסה <code dir="ltr">c8</code>, מפיק <code dir="ltr">sum[11:8]</code> ונשיאה החוצה <code dir="ltr">c12</code>.</li>
  <li><code dir="ltr">rca3</code>: מחבר את <code dir="ltr">a[15:12]</code> ו-<code dir="ltr">b[15:12]</code> עם נשיאה בכניסה <code dir="ltr">c12</code>, מפיק <code dir="ltr">sum[15:12]</code> ונשיאה סופית <code dir="ltr">cout</code>.</li>
</ul>
חברו את הפורטים **לפי שם** (Named Port Connection).`,

      taskEn: `A pre-defined 4-bit ripple carry adder module named <code dir="ltr">ripple_carry_adder_4bit</code> (from Lesson 16) is available in the library:
<pre dir="ltr"><code>module ripple_carry_adder_4bit (
    input  [3:0] a,
    input  [3:0] b,
    input  cin,
    output [3:0] sum,
    output cout
);</code></pre>
<br>
Build the top module <code dir="ltr">top_module</code> (hierarchical 16-bit adder) with 16-bit inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, carry-in <code dir="ltr">cin</code>, 16-bit sum output <code dir="ltr">sum</code>, and carry-out <code dir="ltr">cout</code>.
<br><br>
Declare internal intermediate carry wires (<code dir="ltr">wire c4, c8, c12;</code>) and instantiate 4 copies of <code dir="ltr">ripple_carry_adder_4bit</code>:
<ul>
  <li><code dir="ltr">rca0</code>: adds <code dir="ltr">a[3:0]</code> and <code dir="ltr">b[3:0]</code> with carry-in <code dir="ltr">cin</code>, outputting <code dir="ltr">sum[3:0]</code> and carry-out <code dir="ltr">c4</code>.</li>
  <li><code dir="ltr">rca1</code>: adds <code dir="ltr">a[7:4]</code> and <code dir="ltr">b[7:4]</code> with carry-in <code dir="ltr">c4</code>, outputting <code dir="ltr">sum[7:4]</code> and carry-out <code dir="ltr">c8</code>.</li>
  <li><code dir="ltr">rca2</code>: adds <code dir="ltr">a[11:8]</code> and <code dir="ltr">b[11:8]</code> with carry-in <code dir="ltr">c8</code>, outputting <code dir="ltr">sum[11:8]</code> and carry-out <code dir="ltr">c12</code>.</li>
  <li><code dir="ltr">rca3</code>: adds <code dir="ltr">a[15:12]</code> and <code dir="ltr">b[15:12]</code> with carry-in <code dir="ltr">c12</code>, outputting <code dir="ltr">sum[15:12]</code> and final carry-out <code dir="ltr">cout</code>.</li>
</ul>
Connect all ports **by name** (Named Port Connection).`,

      starterCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    input cin,
    output [15:0] sum,
    output cout
);
    // הגדירו חוטי נשיאה פנימיים c4, c8, c12 / Declare intermediate carry wires c4, c8, c12
    
    // צרו 4 מופעים של ripple_carry_adder_4bit בשמות rca0, rca1, rca2, rca3 / Instantiate 4 copies of ripple_carry_adder_4bit (rca0, rca1, rca2, rca3)

endmodule`,

      solutionCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    input cin,
    output [15:0] sum,
    output cout
);
    wire c4, c8, c12;

    ripple_carry_adder_4bit rca0 (
        .a(a[3:0]),
        .b(b[3:0]),
        .cin(cin),
        .sum(sum[3:0]),
        .cout(c4)
    );

    ripple_carry_adder_4bit rca1 (
        .a(a[7:4]),
        .b(b[7:4]),
        .cin(c4),
        .sum(sum[7:4]),
        .cout(c8)
    );

    ripple_carry_adder_4bit rca2 (
        .a(a[11:8]),
        .b(b[11:8]),
        .cin(c8),
        .sum(sum[11:8]),
        .cout(c12)
    );

    ripple_carry_adder_4bit rca3 (
        .a(a[15:12]),
        .b(b[15:12]),
        .cin(c12),
        .sum(sum[15:12]),
        .cout(cout)
    );
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
        { time: 5, a: 255, b: 1, cin: 0, sum: 256, cout: 0 },
        { time: 10, a: 4095, b: 1, cin: 0, sum: 4096, cout: 0 },
        { time: 15, a: 65535, b: 0, cin: 1, sum: 0, cout: 1 },
        { time: 20, a: 32768, b: 32768, cin: 0, sum: 0, cout: 1 },
        { time: 25, a: 12345, b: 23456, cin: 1, sum: 35802, cout: 0 }
      ],

      hints: {
        he: "הגדירו חוטים מקשרים לנשיאות: wire c4, c8, c12; ולאחר מכן צרו 4 מופעים של ripple_carry_adder_4bit (למשל: rca0 מחבר את a[3:0], b[3:0], cin ומפיק sum[3:0] ו-c4; rca1 מחבר את a[7:4], b[7:4], c4 ומפיק sum[7:4] ו-c8, וכן הלאה).",
        en: "Declare internal carry wires: wire c4, c8, c12; then instantiate 4 copies of ripple_carry_adder_4bit (e.g. rca0 connecting a[3:0], b[3:0], cin and outputting sum[3:0], c4; rca1 connecting a[7:4], b[7:4], c4 and outputting sum[7:4], c8, and so on)."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
