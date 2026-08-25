/* ==========================================================================
   VeriLearn Curriculum — Chapter 1: Introduction to Verilog (Lessons 1 to 8)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 1: Hello, Wire!
    // --------------------------------------------------------------------------
    {
      id: 1,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "Hello, Wire! (תיל בסיסי)",
      titleEn: "Hello, Wire! (Basic Wire)",
      
      explanationHe: `
<h3>1. מה זו שפת Verilog ואיך חושבים בחומרה? 🔌</h3>
<p>שלא כמו שפות תכנות רגילות (כמו Python או Java) שבהן שורות הקוד מבוצעות אחת אחרי השנייה ברצף, <strong>Verilog היא שפת תיאור חומרה (HDL)</strong>.</p>
<p>כשאתה כותב קוד ב-Verilog, אתה לא מריץ פקודות על מעבד — אתה <strong>מתאר מעגל חשמלי פיזי</strong> שכולל רכיבים וחוטים שמחוברים ביניהם. כל החיבורים מתקיימים בו-זמנית ובאופן קבוע.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה הרכיב: המודול (Module) 📦</h3>
<p>כל מעגל חשמלי ב-Verilog נארז בתוך יחידה שנקראת <strong>module</strong> (מודול). חשבו על מודול כעל שבב אלקטרוני בעל פינים של כניסה (<code dir="ltr">input</code>) ויציאה (<code dir="ltr">output</code>).</p>
<p>מבנה מודול כללי נראה כך:</p>

<pre dir="ltr"><code>module my_chip (
    input  signal_a,
    output signal_b
);
    // המעגל הפנימי ייכתב כאן
endmodule</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. איך מחברים חוט פיזי? ההוראה <code dir="ltr">assign</code> ⚡</h3>
<p>הרכיב הבסיסי ביותר באלקטרוניקה הוא חוט נחושת פשוט (Wire). חוט מעביר אות כניסה ישירות אל היציאה.</p>
<p>כדי ליצור חיבור רציף וקבוע בין יציאה לבין כניסה, משתמשים במילה השמורה <code dir="ltr">assign</code> לפי התבנית הבאה:</p>

<pre dir="ltr"><code>assign destination_port = source_port;</code></pre>

<p><strong>כללי מפתח שחשוב לזכור:</strong></p>
<ul>
  <li>היעד (<code dir="ltr">destination</code>) נכתב בצד <strong>שמאל</strong> של השוויון (זה הפורט שמקבל אליו את האות).</li>
  <li>המקור (<code dir="ltr">source</code>) נכתב בצד <strong>ימין</strong> של השוויון (זה הפורט שממנו מגיע האות).</li>
  <li>כל הוראה ב-Verilog חייבת להסתיים בנקודה-פסיק (<code dir="ltr">;</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמה מעשית (חיבור מתג לנורה) 💡</h3>
<p>נניח שיש לנו מתג בקיר המחובר ישירות לנורת תאורה. נתאר זאת בחומרה בעזרת מודול גנרי:</p>
<pre dir="ltr"><code>module light_switch (
    input  switch_state,
    output bulb_power
);
    // חיבור המתג לנורה באופן ישיר
    assign bulb_power = switch_state;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is Verilog and How Hardware Design Works 🔌</h3>
<p>Unlike traditional programming languages (like Python or C) where instructions execute step-by-step, <strong>Verilog is a Hardware Description Language (HDL)</strong>.</p>
<p>When writing Verilog code, you are not writing software algorithms — you are <strong>describing physical electronic circuits</strong>. These circuits consist of wires, logic gates, and registers that operate concurrently.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Basic Building Block: The Module 📦</h3>
<p>In Verilog, digital circuits are packaged inside units called <strong>modules</strong>. Think of a module as an integrated circuit chip with input pins (<code dir="ltr">input</code>) and output pins (<code dir="ltr">output</code>).</p>
<p>A general module syntax looks like this:</p>

<pre dir="ltr"><code>module my_chip (
    input  signal_a,
    output signal_b
);
    // Circuit logic goes here
endmodule</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Connecting Signals: The <code dir="ltr">assign</code> Statement ⚡</h3>
<p>The simplest connection in hardware is a wire. A wire continuously passes an incoming signal directly to an output.</p>
<p>To create a continuous connection from a source signal to a target output port, we use the <code dir="ltr">assign</code> keyword using this pattern:</p>

<pre dir="ltr"><code>assign destination_port = source_port;</code></pre>

<p><strong>Key Rules to Remember:</strong></p>
<ul>
  <li>The target output pin (<code dir="ltr">destination</code>) goes on the <strong>left</strong> side of the equal sign.</li>
  <li>The source input pin (<code dir="ltr">source</code>) goes on the <strong>right</strong> side of the equal sign.</li>
  <li>Every Verilog statement must terminate with a semicolon (<code dir="ltr">;</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Generic Example (Switch to Bulb Connection) 💡</h3>
<p>Consider a simple wall switch connected directly to a light bulb. We can model this connection as follows:</p>
<pre dir="ltr"><code>module light_switch (
    input  switch_state,
    output bulb_power
);
    // Connecting the switch directly to the bulb
    assign bulb_power = switch_state;
endmodule</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל פין כניסה יחיד בשם <code dir="ltr">in</code> ופין יציאה יחיד בשם <code dir="ltr">out</code>. עליכם לחבר את הכניסה <code dir="ltr">in</code> ישירות ליציאה <code dir="ltr">out</code> כך שכל שינוי בכניסה יזרום מיידית ליציאה.`,
      taskEn: `Design a module named <code dir="ltr">top_module</code> with one input pin named <code dir="ltr">in</code> and one output pin named <code dir="ltr">out</code>. Connect <code dir="ltr">in</code> directly to <code dir="ltr">out</code> so that the input signal continuously flows to the output.`,

      starterCode: `module top_module (
    input in,
    output out
);
    // כתוב את חיבור החוט כאן / Write your wire assignment here

endmodule`,

      solutionCode: `module top_module (
    input in,
    output out
);
    assign out = in;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 1, out: 1 },
        { time: 10, in: 0, out: 0 },
        { time: 15, in: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו בתבנית: assign [שם פורט היציאה] = [שם פורט הכניסה]; ואל תשכחו נקודה-פסיק בסוף.",
        en: "Use the pattern: assign [output_port] = [input_port]; and don't forget the ending semicolon."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 2: AND Gate
    // --------------------------------------------------------------------------
    {
      id: 2,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "שער AND (שער וגם) 🔀",
      titleEn: "AND Gate (Logical Conjunction) 🔀",

      explanationHe: `
<h3>1. מהם שערים לוגיים בחומרה? 🔀</h3>
<p>מעגלים דיגיטליים לא רק מעבירים אותות, אלא מבצעים עליהם חישובים לוגיים. הרכיב הבסיסי ביותר שמבצע חישוב הוא <strong>שער לוגי (Logic Gate)</strong>.</p>
<p>ב-Verilog, אנו משתמשים באופרטורים בינאריים לוגיים כדי לבצע פעולות בין אותות. האופרטורים המרכזיים הם:</p>
<ul>
  <li><strong>שער AND (וגם) — סמל <code dir="ltr">&</code></strong>: היציאה תהיה <code dir="ltr">1</code> <strong>רק אם כל הכניסות</strong> הן <code dir="ltr">1</code>. אם לפחות כניסה אחת היא <code dir="ltr">0</code>, היציאה תהיה <code dir="ltr">0</code>.</li>
  <li><strong>שער OR (או) — סמל <code dir="ltr">|</code></strong>: היציאה תהיה <code dir="ltr">1</code> אם <strong>לפחות אחת הכניסות</strong> היא <code dir="ltr">1</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת לשער AND (Truth Table) 📊</h3>
<p>טבלת אמת מציגה את ערך היציאה עבור כל שילוב אפשרי של הכניסות:</p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>כניסה 1</th><th>כניסה 2</th><th>יציאת AND (<code dir="ltr">&</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. איך כותבים שער לוגי ב-Verilog? 💻</h3>
<p>משלבים את האופרטור הלוגי המבוקש בתוך הוראת <code dir="ltr">assign</code>. לדוגמה, במעגל בטיחות תעשייתי שבו המכונה תפעל רק אם גם מפתח ההפעלה לחוץ וגם מכסה המגן סגור, נכתוב קוד כזה:</p>

<pre dir="ltr"><code>module machine_control (
    input  key_switch,
    input  guard_closed,
    output machine_enable
);
    // הפעלה רק כאשר שני התנאים מתקיימים
    assign machine_enable = key_switch & guard_closed;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What are Logic Gates in Hardware? 🔀</h3>
<p>Digital circuits do not just route signals; they perform logic computations on them. The fundamental building block of digital logic is the <strong>Logic Gate</strong>.</p>
<p>In Verilog, bitwise logical operators perform operations between hardware signals:</p>
<ul>
  <li><strong>AND Gate — Symbol <code dir="ltr">&</code></strong>: Output is <code dir="ltr">1</code> <strong>only when ALL inputs</strong> are <code dir="ltr">1</code>. If any input is <code dir="ltr">0</code>, the output is <code dir="ltr">0</code>.</li>
  <li><strong>OR Gate — Symbol <code dir="ltr">|</code></strong>: Output is <code dir="ltr">1</code> if <strong>at least one input</strong> is <code dir="ltr">1</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. AND Gate Truth Table 📊</h3>
<p>A truth table defines the output logic level for every possible combination of inputs:</p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>Input 1</th><th>Input 2</th><th>AND Output (<code dir="ltr">&</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Writing Logic Gates in Verilog 💻</h3>
<p>Combine the desired logic operator inside an <code dir="ltr">assign</code> statement. For example, in an industrial machine controller where the motor only starts if the ignition key is turned and the safety guard is closed, we can write:</p>

<pre dir="ltr"><code>module machine_control (
    input  key_switch,
    input  guard_closed,
    output machine_enable
);
    // Machine is enabled only when both inputs are active (high)
    assign machine_enable = key_switch & guard_closed;
endmodule</code></pre>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ויציאה אחת בשם <code dir="ltr">out</code>. חברו את היציאה <code dir="ltr">out</code> כך שיפעל כפונקציית AND לוגית בין <code dir="ltr">a</code> לבין <code dir="ltr">b</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, and one output <code dir="ltr">out</code>. Drive <code dir="ltr">out</code> with the logical AND of <code dir="ltr">a</code> and <code dir="ltr">b</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out
);
    assign out = a & b;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out: 0 },
        { time: 5, a: 1, b: 0, out: 0 },
        { time: 10, a: 0, b: 1, out: 0 },
        { time: 15, a: 1, b: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו באופרטור & בין שני אותות הכניסה a ו-b בהוראת assign.",
        en: "Use the & operator between the two input signals a and b in an assign statement."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 3: NOT Gate
    // --------------------------------------------------------------------------
    {
      id: 3,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "שער NOT (מהפך אות) 🔄",
      titleEn: "NOT Gate (Inverter) 🔄",

      explanationHe: `
<h3>1. מהו שער NOT (Inverter)? 🔄</h3>
<p>שער NOT (נקרא גם מהפך / Inverter) הוא שער לוגי בעל כניסה אחת בלבד ויציאה אחת. תפקידו להפוך את המצב הלוגי של האות:</p>
<ul>
  <li>אם הכניסה היא <code dir="ltr">0</code> (LOW / GND), היציאה תהיה <code dir="ltr">1</code> (HIGH / VCC).</li>
  <li>אם הכניסה היא <code dir="ltr">1</code> (HIGH / VCC), היציאה תהיה <code dir="ltr">0</code> (LOW / GND).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת לשער NOT 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>כניסה</th><th>יציאת NOT (<code dir="ltr">~</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td><strong>0</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. סמל האופרטור ב-Verilog 💻</h3>
<p>ב-Verilog, האופרטור עבור היפוך ביט (Bitwise NOT) הוא סימן הטילדה: <code dir="ltr">~</code>.</p>
<p>נניח שיש לנו כפתור לחיצה המייצר אות גבוה (<code dir="ltr">1</code>) בלחיצה, אך אנו זקוקים לאות הפוך (Active-Low) המיוצג על ידי יציאה נמוכה (<code dir="ltr">0</code>) בלחיצה. נוכל לכתוב:</p>

<pre dir="ltr"><code>module signal_inverter (
    input  button_pressed,
    output active_low_alert
);
    // היפוך האות ליצירת אות פעיל בנמוך
    assign active_low_alert = ~button_pressed;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is a NOT Gate (Inverter)? 🔄</h3>
<p>A NOT Gate (also known as an Inverter) has a single input and a single output. It flips the logic level of the input signal:</p>
<ul>
  <li>If the input is <code dir="ltr">0</code> (LOW), the output becomes <code dir="ltr">1</code> (HIGH).</li>
  <li>If the input is <code dir="ltr">1</code> (HIGH), the output becomes <code dir="ltr">0</code> (LOW).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. NOT Gate Truth Table 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>Input</th><th>NOT Output (<code dir="ltr">~</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td><strong>0</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Operator Symbol in Verilog 💻</h3>
<p>In Verilog, the bitwise NOT operator is represented by the tilde symbol: <code dir="ltr">~</code>.</p>
<p>For example, if you have a pushbutton that goes high when pressed, but you need to drive an active-low status line (which goes low when the button is active), you can write:</p>

<pre dir="ltr"><code>module signal_inverter (
    input  button_pressed,
    output active_low_alert
);
    // Invert the button signal to make it active-low
    assign active_low_alert = ~button_pressed;
endmodule</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל כניסה בשם <code dir="ltr">in</code> ויציאה בשם <code dir="ltr">out</code>. חברו את היציאה <code dir="ltr">out</code> כך שתהיה ההיפוך הלוגי (NOT) של הכניסה <code dir="ltr">in</code>.`,
      taskEn: `Design a module named <code dir="ltr">top_module</code> with input <code dir="ltr">in</code> and output <code dir="ltr">out</code>. Connect <code dir="ltr">out</code> to be the logical inverse (NOT) of <code dir="ltr">in</code>.`,

      starterCode: `module top_module (
    input in,
    output out
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input in,
    output out
);
    assign out = ~in;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 1 },
        { time: 5, in: 1, out: 0 },
        { time: 10, in: 0, out: 1 },
        { time: 15, in: 1, out: 0 }
      ],

      hints: {
        he: "השתמשו באופרטור ההיפוך ~ על כניסת ה-in.",
        en: "Use the negation operator ~ on the input signal in."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 4: Multi-output
    // --------------------------------------------------------------------------
    {
      id: 4,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "יציאות מרובות במודול 🔀🔀",
      titleEn: "Multi-output Modules 🔀🔀",

      explanationHe: `
<h3>1. מודולים בעלי יציאות מרובות 🔀🔀</h3>
<p>בשבבים אמיתיים בחומרה, מודול יחיד לרוב לא מפיק יציאה אחת בלבד, אלא מפיק <strong>מספר יציאות שונות במקביל</strong>.</p>
<p>לדוגמה, מערכת בקרת התראה יכולה לקבל חוט חיישן תנועה וחוט חיישן עשן, ולהפיק במקביל גם נורית אזהרה וגם צופר חירום.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. עבודה במקביל (Parallel Execution) ⚡</h3>
<p>ב-Verilog, כל הוראת <code dir="ltr">assign</code> עובדת <strong>במקביל ובאופן בלתי תלוי</strong> להוראות <code dir="ltr">assign</code> אחרות במודול. סדר הכתיבה של שורות ה-<code dir="ltr">assign</code> בקוד <strong>אינו משנה דבר</strong> – המעבדים האלקטרוניים ייווצרו על הסיליקון כרכיבים נפרדים הפועלים יחדיו בו-זמנית.</p>

<p>דוגמה תפיסתית למודול המציג שתי יציאות נפרדות:</p>

<pre dir="ltr"><code>module alarm_system (
    input  smoke_detected,
    input  motion_detected,
    output beacon_light,
    output audio_siren
);
    // שתי היציאות מחושבות במקביל ללא קשר לסדר השורות
    assign beacon_light = smoke_detected | motion_detected;
    assign audio_siren = smoke_detected & motion_detected;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Modules with Multiple Outputs 🔀🔀</h3>
<p>In real integrated circuits, a single chip rarely drives just one output pin. Usually, a module processes inputs and drives <strong>multiple output ports simultaneously</strong>.</p>
<p>For example, a security system may receive smoke and motion sensor lines and drive both an alarm siren and an evacuation light independently and at the same time.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Parallelism in Hardware (Concurrent Execution) ⚡</h3>
<p>In Verilog, all <code dir="ltr">assign</code> statements execute <strong>in parallel</strong>. They represent physical wire connections. The order of writing these assignments does not matter at all. The synthesizer translates them into concurrent circuit components on silicon.</p>

<p>A conceptual example of a multi-output module:</p>

<pre dir="ltr"><code>module alarm_system (
    input  smoke_detected,
    input  motion_detected,
    output beacon_light,
    output audio_siren
);
    // These two assignments run in parallel
    assign beacon_light = smoke_detected | motion_detected;
    assign audio_siren = smoke_detected & motion_detected;
endmodule</code></pre>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ושתי יציאות: <code dir="ltr">out_and</code> ו-<code dir="ltr">out_or</code>.
חברו את <code dir="ltr">out_and</code> לבצע פעולת AND בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>, ואת <code dir="ltr">out_or</code> לבצע פעולת OR בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, and two outputs: <code dir="ltr">out_and</code> and <code dir="ltr">out_or</code>.
Drive <code dir="ltr">out_and</code> with the AND logic (<code dir="ltr">a & b</code>) and drive <code dir="ltr">out_or</code> with the OR logic (<code dir="ltr">a | b</code>).`,

      starterCode: `module top_module (
    input a,
    input b,
    output out_and,
    output out_or
);
    // כתוב את שתי הוראות ה-assign כאן / Write your two assign statements here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out_and,
    output out_or
);
    assign out_and = a & b;
    assign out_or = a | b;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_and: 0, out_or: 0 },
        { time: 5, a: 1, b: 0, out_and: 0, out_or: 1 },
        { time: 10, a: 0, b: 1, out_and: 0, out_or: 1 },
        { time: 15, a: 1, b: 1, out_and: 1, out_or: 1 }
      ],

      hints: {
        he: "כיתבו שתי שורות assign נפרדות: אחת עבור out_and ואחת עבור out_or.",
        en: "Write two separate assign statements: one for out_and and one for out_or."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 5: Wire Bus (Vectors)
    // --------------------------------------------------------------------------
    {
      id: 5,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "אוטובוס אותות ו-Vectors 🚌",
      titleEn: "Wire Bus & Signal Vectors 🚌",

      explanationHe: `
<h3>1. מהו חוט בודד מול אוטובוס אותות (Vector / Bus)? 🚌</h3>
<p>כדי להעביר מספר מרובה ביטים בבת אחת בחומרה (למשל, מספר של 8 או 32 ביט), לא נרצה להגדיר 32 כניסות בודדות של חוטים. במקום זאת, אנו מניחים מספר חוטים מקבילים ומאגדים אותם לחבילה אחת הנקראת <strong>אוטובוס נתונים (Bus או Vector)</strong>.</p>

<pre dir="ltr"><code>input  [3:0] in_bus;   // אוטובוס של 4 ביט (אינדקסים 3, 2, 1, 0)
output [7:0] out_bus;  // אוטובוס של 8 ביט (אינדקסים 7 עד 0)</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הגדרת טווח אינדקסים 📐</h3>
<p>התחביר <code dir="ltr">[MSB:LSB]</code> מגדיר את גודל האוטובוס, כאשר <code dir="ltr">MSB</code> הוא הביט המשמעותי ביותר (Most Significant Bit) ו-<code dir="ltr">LSB</code> הוא הביט הפחות משמעותי (Least Significant Bit).</p>
<ul>
  <li>הגדרת <code dir="ltr">[7:0]</code> מייצגת אוטובוס בגודל 8 ביטים, כאשר האינדקס הגבוה ביותר הוא 7 והנמוך הוא 0.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. חיבור אוטובוסים גנרי 💻</h3>
<p>כאשר יש לנו שני וקטורים בעלי אותו אורך, אנו יכולים לחבר אותם ישירות באמצעות הוראת <code dir="ltr">assign</code> יחידה. החיבור יחבר אוטומטית כל חוט פנימי לחוט המתאים לו באותו אינדקס.</p>

<pre dir="ltr"><code>module bus_repeater (
    input  [7:0] data_in,
    output [7:0] data_out
);
    // חיבור מקבילי של כל 8 הפינים בבת אחת
    assign data_out = data_in;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Single Wire vs Signal Bus (Vector) 🚌</h3>
<p>To transfer multi-bit data simultaneously in hardware (like an 8-bit byte or 32-bit word), engineers group multiple physical copper tracks side-by-side on silicon. This bundle is called a <strong>Bus or Vector</strong>.</p>
<p>Instead of declaring individual names for dozens of inputs, we group them under a single multi-bit vector name.</p>

<pre dir="ltr"><code>input  [3:0] in_bus;   // 4-bit bus (indexed 3, 2, 1, 0)
output [7:0] out_bus;  // 8-bit bus (indexed 7 down to 0)</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Vector Bit Order Syntax: <code dir="ltr">[MSB:LSB]</code> 📐</h3>
<p>The syntax <code dir="ltr">[MSB:LSB]</code> declares the indices of the bus. <code dir="ltr">MSB</code> stands for Most Significant Bit (highest weight) and <code dir="ltr">LSB</code> stands for Least Significant Bit (lowest weight).</p>
<ul>
  <li>Declaring <code dir="ltr">[7:0]</code> defines an 8-bit vector where index 7 is the MSB and index 0 is the LSB.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Generic Vector Assignment 💻</h3>
<p>When you have two vectors of the exact same width, you can connect them in one step. Verilog will automatically wire each bit from the source vector to the target vector at corresponding indices:</p>

<pre dir="ltr"><code>module bus_repeater (
    input  [7:0] data_in,
    output [7:0] data_out
);
    // Parallel connection of all 8 wires at once
    assign data_out = data_in;
endmodule</code></pre>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל כניסת ווקטור של 4 ביט בשם <code dir="ltr">in</code> (מוגדרת כ-<code dir="ltr">input [3:0] in</code>) ויציאת ווקטור של 4 ביט בשם <code dir="ltr">out</code> (מוגדרת כ-<code dir="ltr">output [3:0] out</code>). חברו את האוטובוס <code dir="ltr">in</code> ישירות לאוטובוס <code dir="ltr">out</code>.`,
      taskEn: `Design a module named <code dir="ltr">top_module</code> with a 4-bit vector input <code dir="ltr">in</code> (declared as <code dir="ltr">input [3:0] in</code>) and a 4-bit vector output <code dir="ltr">out</code> (declared as <code dir="ltr">output [3:0] out</code>). Connect the 4-bit bus <code dir="ltr">in</code> directly to the 4-bit bus <code dir="ltr">out</code>.`,

      starterCode: `module top_module (
    input [3:0] in,
    output [3:0] out
);
    // חבר את אוטובוס 4 הביטים כאן / Connect the 4-bit vector bus here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output [3:0] out
);
    assign out = in;
endmodule`,

      expectedOutputs: [
        { time: 0, in: 0, out: 0 },
        { time: 5, in: 5, out: 5 },
        { time: 10, in: 15, out: 15 },
        { time: 15, in: 10, out: 10 }
      ],

      hints: {
        he: "השתמשו בהוראת assign out = in; בדיוק כמו בחוט בודד!",
        en: "Use assign out = in; just like a single wire!"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 6: NAND & NOR Gates
    // --------------------------------------------------------------------------
    {
      id: 6,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "שערי NAND ו-NOR 🔌",
      titleEn: "NAND & NOR Gates 🔌",

      explanationHe: `
<h3>1. שערי NAND ו-NOR לוגיים 🔌</h3>
<p>נוסף לשערי ה-AND וה-OR הבסיסיים, בעולם האלקטרוניקה קיימים שערים הפוכים המשלבים מהפך (NOT) בקצה השער:</p>
<ul>
  <li><strong>שער NAND (Not AND)</strong>: היציאה שלו היא <code dir="ltr">0</code> <strong>רק כאשר כל הכניסות</strong> הן <code dir="ltr">1</code>. בכל מצב אחר היציאה היא <code dir="ltr">1</code>.</li>
  <li><strong>שער NOR (Not OR)</strong>: היציאה שלו היא <code dir="ltr">1</code> <strong>רק כאשר כל הכניסות</strong> הן <code dir="ltr">0</code>. בכל מצב אחר היציאה היא <code dir="ltr">0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלאות אמת (Truth Tables) 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>כניסה A</th><th>כניסה B</th><th>יציאת NAND</th><th>יציאת NOR</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. בניית שערים אלו ב-Verilog 💻</h3>
<p>שערים אלו נבנים באמצעות שילוב אופרטור ההיפוך (<code dir="ltr">~</code>) עם האופרטורים הלוגיים. מומלץ להשתמש בסוגריים כדי לקבוע את סדר הפעולות (ביצוע הפעולה הלוגית תחילה, ולאחר מכן היפוכה):</p>
<ul>
  <li>פעולת NAND מבוצעת על ידי: <code dir="ltr">~(x & y)</code></li>
  <li>פעולת NOR מבוצעת על ידי: <code dir="ltr">~(x | y)</code></li>
</ul>

<p>דוגמה תפיסתית עבור מנורת התרעה המופעלת כאשר אין אספקה תקינה משני מקורות מתח נפרדים:</p>
<pre dir="ltr"><code>module power_fail_detector (
    input  power_line_a,
    input  power_line_b,
    output power_fault
);
    // המנורה תידלק (1) אם לפחות אחד הקווים נמוך (0). כלומר, NAND
    assign power_fault = ~(power_line_a & power_line_b);
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. NAND and NOR Logic Gates 🔌</h3>
<p>In physical digital systems, NAND and NOR gates are highly prevalent. They combine the base operations (AND / OR) with an inverted output:</p>
<ul>
  <li><strong>NAND Gate (Not AND)</strong>: Outputs <code dir="ltr">0</code> <strong>only when all inputs</strong> are <code dir="ltr">1</code>. Otherwise, it outputs <code dir="ltr">1</code>.</li>
  <li><strong>NOR Gate (Not OR)</strong>: Outputs <code dir="ltr">1</code> <strong>only when all inputs</strong> are <code dir="ltr">0</code>. Otherwise, it outputs <code dir="ltr">0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. NAND & NOR Truth Tables 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>Input A</th><th>Input B</th><th>NAND Output</th><th>NOR Output</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Synthesis in Verilog 💻</h3>
<p>To implement NAND and NOR gates in Verilog, we combine the bitwise negation symbol (<code dir="ltr">~</code>) with the respective logical operators. Parentheses must be used to ensure the logic gate functions correctly by inverting the outcome of the logic operation:</p>
<ul>
  <li>NAND operation: <code dir="ltr">~(x & y)</code></li>
  <li>NOR operation: <code dir="ltr">~(x | y)</code></li>
</ul>

<p>Generic example of a power fail alarm system that activates if at least one power source is lost:</p>
<pre dir="ltr"><code>module power_fail_detector (
    input  power_line_a,
    input  power_line_b,
    output power_fault
);
    // Fault occurs if power line A AND B are not both high (NAND logic)
    assign power_fault = ~(power_line_a & power_line_b);
endmodule</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ושתי יציאות בשם <code dir="ltr">out_nand</code> ו-<code dir="ltr">out_nor</code>. חברו את <code dir="ltr">out_nand</code> כך שיהיה שער NAND בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>, ואת <code dir="ltr">out_nor</code> כך שיהיה שער NOR בין <code dir="ltr">a</code> ל-<code dir="ltr">b</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two inputs a and b, and two outputs out_nand and out_nor. Drive out_nand with the NAND logical operation of a and b, and drive out_nor with the NOR logical operation of a and b.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out_nand,
    output out_nor
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out_nand,
    output out_nor
);
    assign out_nand = ~(a & b);
    assign out_nor = ~(a | b);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_nand: 1, out_nor: 1 },
        { time: 5, a: 1, b: 0, out_nand: 1, out_nor: 0 },
        { time: 10, a: 0, b: 1, out_nand: 1, out_nor: 0 },
        { time: 15, a: 1, b: 1, out_nand: 0, out_nor: 0 }
      ],

      hints: {
        he: "כדי לבצע NAND, השתמשו ב- ~(a & b). כדי לבצע NOR, השתמשו ב- ~(a | b). אל תשכחו את סוגריים!",
        en: "To compute NAND, use ~(a & b). To compute NOR, use ~(a | b). Do not forget the parentheses!"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 7: XOR & XNOR Gates
    // --------------------------------------------------------------------------
    {
      id: 7,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "שערי XOR ו-XNOR 🔀",
      titleEn: "XOR & XNOR Gates 🔀",

      explanationHe: `
<h3>1. שערי XOR ו-XNOR (לוגיקת שוויון ושוני) 🔀</h3>
<p>שערי XOR ו-XNOR ממלאים תפקיד מפתח במעגלים דיגיטליים המשווים נתונים או מבצעים חישובים אריתמטיים:</p>
<ul>
  <li><strong>שער XOR (Exclusive OR)</strong>: מחזיר <code dir="ltr">1</code> אם הכניסות <strong>שונות</strong> זו מזו. אם הכניסות זהות, הוא מחזיר <code dir="ltr">0</code>.</li>
  <li><strong>שער XNOR (Exclusive NOR)</strong>: מחזיר <code dir="ltr">1</code> אם הכניסות <strong>זהות</strong> (כלומר שוות) זו לזו. אם הן שונות, הוא מחזיר <code dir="ltr">0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלאות אמת (Truth Tables) 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>כניסה A</th><th>כניסה B</th><th>יציאת XOR (<code dir="ltr">^</code>)</th><th>יציאת XNOR (<code dir="ltr">~^</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. אופרטורים ב-Verilog 💻</h3>
<ul>
  <li>אופרטור ה-XOR מיוצג על ידי סימן הקרט: <code dir="ltr">^</code>.</li>
  <li>אופרטור ה-XNOR מיוצג על ידי שילוב מהפך: <code dir="ltr">~^</code> (או <code dir="ltr">^~</code>), או באופן פשוט יותר על ידי היפוך תוצאת XOR בסוגריים: <code dir="ltr">~(x ^ y)</code>.</li>
</ul>

<p>דוגמה גנרית למעגל המשווה בין ערכי שני חיישנים לזיהוי חוסר התאמה:</p>
<pre dir="ltr"><code>module deviation_sensor (
    input  sensor_x,
    input  sensor_y,
    output mismatch_alert
);
    // האזעקה תופעל רק אם ערכי החיישנים שונים
    assign mismatch_alert = sensor_x ^ sensor_y;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. XOR and XNOR Logic Gates (Equality & Difference) 🔀</h3>
<p>XOR and XNOR gates are essential building blocks for comparison circuits and arithmetic structures (such as adders):</p>
<ul>
  <li><strong>XOR Gate (Exclusive OR)</strong>: Outputs <code dir="ltr">1</code> if and only if the inputs are <strong>different</strong>. If inputs are identical, the output is <code dir="ltr">0</code>.</li>
  <li><strong>XNOR Gate (Exclusive NOR)</strong>: Outputs <code dir="ltr">1</code> if and only if the inputs are <strong>identical</strong> (equal). If inputs differ, the output is <code dir="ltr">0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. XOR & XNOR Truth Tables 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>Input A</th><th>Input B</th><th>XOR Output (<code dir="ltr">^</code>)</th><th>XNOR Output (<code dir="ltr">~^</code>)</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Verilog Operators 💻</h3>
<ul>
  <li>The XOR operation uses the caret operator: <code dir="ltr">^</code>.</li>
  <li>The XNOR operation can be written using combined symbols: <code dir="ltr">~^</code> or <code dir="ltr">^~</code>, or by wrapping a standard XOR with negation: <code dir="ltr">~(x ^ y)</code>.</li>
</ul>

<p>Generic example of a deviation warning system detecting when two redundant hardware signals disagree:</p>
<pre dir="ltr"><code>module deviation_sensor (
    input  sensor_x,
    input  sensor_y,
    output mismatch_alert
);
    // Alert activates if sensor signals differ
    assign mismatch_alert = sensor_x ^ sensor_y;
endmodule</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> בעל שתי כניסות בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ושתי יציאות בשם <code dir="ltr">out_xor</code> ו-<code dir="ltr">out_xnor</code>. חברו את <code dir="ltr">out_xor</code> כך שיחשב XOR בין הכניסות, ואת <code dir="ltr">out_xnor</code> כך שיחשב XNOR (שוויון) בין הכניסות.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with two inputs a and b, and two outputs out_xor and out_xnor. Drive out_xor with the XOR of a and b, and drive out_xnor with the XNOR of a and b.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out_xor,
    output out_xnor
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out_xor,
    output out_xnor
);
    assign out_xor = a ^ b;
    assign out_xnor = ~(a ^ b);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_xor: 0, out_xnor: 1 },
        { time: 5, a: 1, b: 0, out_xor: 1, out_xnor: 0 },
        { time: 10, a: 0, b: 1, out_xor: 1, out_xnor: 0 },
        { time: 15, a: 1, b: 1, out_xor: 0, out_xnor: 1 }
      ],

      hints: {
        he: "השתמשו באופרטור ^ עבור XOR, ובביטוי כמו ~(a ^ b) או a ~^ b עבור XNOR.",
        en: "Use the ^ operator for XOR, and an expression like ~(a ^ b) or a ~^ b for XNOR."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 8: Triple-Input Gates
    // --------------------------------------------------------------------------
    {
      id: 8,
      chapter: 1,
      chapterTitleHe: "פרק 1: מבוא ל-Verilog",
      chapterTitleEn: "Chapter 1: Introduction to Verilog",
      titleHe: "שערים לוגיים עם שלוש כניסות 🔌🔌🔌",
      titleEn: "Triple-Input Logic Gates 🔌🔌🔌",

      explanationHe: `
<h3>1. שערים לוגיים בעלי כניסות מרובות 🔌🔌🔌</h3>
<p>בעולם החומרה, שערים אינם מוגבלים לשתי כניסות בלבד. מתכננים משתמשים בשערים בעלי 3 כניסות, 4 כניסות ואף יותר (למשל, שער AND בעל 8 כניסות).</p>
<ul>
  <li><strong>שער AND3</strong>: מוציא <code dir="ltr">1</code> <strong>רק כאשר כל שלוש הכניסות</strong> הן <code dir="ltr">1</code>.</li>
  <li><strong>שער OR3</strong>: מוציא <code dir="ltr">1</code> אם <strong>לפחות אחת משלוש הכניסות</strong> היא <code dir="ltr">1</code>.</li>
  <li><strong>שער XOR3</strong>: מתפקד כבודק זוגיות (Parity) — מוציא <code dir="ltr">1</code> אם יש <strong>מספר אי-זוגי של כניסות בעלות ערך 1</strong>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלאות אמת (Truth Tables) 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>A</th><th>B</th><th>C</th><th>AND3</th><th>OR3</th><th>XOR3</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. כתיבה בשרשרת ב-Verilog 💻</h3>
<p>ניתן לשרשר אופרטורים באותה שורה. קומפיילר החומרה יתרגם אותם למבנה היררכי או לשערים רחבים באופן אוטומטי.</p>
<pre dir="ltr"><code>assign output_signal = input_x & input_y & input_z;</code></pre>

<p>דוגמה גנרית לבקר המפעיל נורת חיווי כאשר לפחות אחד משלושת תאי הדלק ריק (נמוך):</p>
<pre dir="ltr"><code>module tank_monitor (
    input  tank1_empty,
    input  tank2_empty,
    input  tank3_empty,
    output any_empty
);
    // הפעלת נורית אם טנק 1, 2 או 3 ריק
    assign any_empty = tank1_empty | tank2_empty | tank3_empty;
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Multi-Input Logic Gates 🔌🔌🔌</h3>
<p>Logic gates are not limited to just two inputs. Digital designs frequently use 3-input, 4-input, or even wider logic gates to process multiple conditions simultaneously.</p>
<ul>
  <li><strong>3-Input AND (AND3)</strong>: Outputs <code dir="ltr">1</code> <strong>only when all 3 inputs</strong> are <code dir="ltr">1</code>.</li>
  <li><strong>3-Input OR (OR3)</strong>: Outputs <code dir="ltr">1</code> if <strong>at least one input</strong> is <code dir="ltr">1</code>.</li>
  <li><strong>3-Input XOR (XOR3)</strong>: Acts as a parity detector. It outputs <code dir="ltr">1</code> if there is an <strong>odd number of 1s</strong> on its inputs.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. 3-Input Truth Tables 📊</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-family-mono); font-size: 0.85rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>A</th><th>B</th><th>C</th><th>AND3</th><th>OR3</th><th>XOR3</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>0</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
    <tr><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Operator Chaining in Verilog 💻</h3>
<p>You can connect multiple binary operators together in a single continuous assignment. The synthesis tool automatically creates cascaded hardware gates or maps them to wide gates in the silicon cells:</p>
<pre dir="ltr"><code>assign output_signal = input_x & input_y & input_z;</code></pre>

<p>Generic example of a system warning indicator showing if any of three temperature sensors are out of bounds (OR logic):</p>
<pre dir="ltr"><code>module tank_monitor (
    input  temp_hi_1,
    input  temp_hi_2,
    input  temp_hi_3,
    output alert_triggered
);
    // Trigger the alert if sensor 1, 2, OR 3 reports high temperature
    assign alert_triggered = temp_hi_1 | temp_hi_2 | temp_hi_3;
endmodule</code></pre>
`,

      taskHe: `צרו מודול בשם <code dir="ltr">top_module</code> בעל שלוש כניסות: <code dir="ltr">a</code>, <code dir="ltr">b</code> ו-<code dir="ltr">c</code>, ושלוש יציאות: <code dir="ltr">out_and3</code>, <code dir="ltr">out_or3</code>, ו-<code dir="ltr">out_xor3</code>.
חברו את <code dir="ltr">out_and3</code> לפעולת AND בין שלוש הכניסות (a וגם b וגם c).
חברו את <code dir="ltr">out_or3</code> לפעולת OR בין שלוש הכניסות (a או b או c).
חברו את <code dir="ltr">out_xor3</code> לפעולת XOR בין שלוש הכניסות (a ^ b ^ c).`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> with three inputs: a, b, and c, and three outputs: out_and3, out_or3, and out_xor3.
Drive out_and3 with the AND of all three inputs.
Drive out_or3 with the OR of all three inputs.
Drive out_xor3 with the XOR of all three inputs.`,

      starterCode: `module top_module (
    input a,
    input b,
    input c,
    output out_and3,
    output out_or3,
    output out_xor3
);
    // כתוב את הפתרון כאן / Write your solution here

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    input c,
    output out_and3,
    output out_or3,
    output out_xor3
);
    assign out_and3 = a & b & c;
    assign out_or3 = a | b | c;
    assign out_xor3 = a ^ b ^ c;
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, c: 0, out_and3: 0, out_or3: 0, out_xor3: 0 },
        { time: 5, a: 1, b: 0, c: 0, out_and3: 0, out_or3: 1, out_xor3: 1 },
        { time: 10, a: 0, b: 1, c: 0, out_and3: 0, out_or3: 1, out_xor3: 1 },
        { time: 15, a: 1, b: 1, c: 0, out_and3: 0, out_or3: 1, out_xor3: 0 },
        { time: 20, a: 0, b: 0, c: 1, out_and3: 0, out_or3: 1, out_xor3: 1 },
        { time: 25, a: 1, b: 0, c: 1, out_and3: 0, out_or3: 1, out_xor3: 0 },
        { time: 30, a: 0, b: 1, c: 1, out_and3: 0, out_or3: 1, out_xor3: 0 },
        { time: 35, a: 1, b: 1, c: 1, out_and3: 1, out_or3: 1, out_xor3: 1 }
      ],

      hints: {
        he: "ניתן לשרשר אופרטורים בזה אחר זה, לדוגמה: assign out_and3 = a & b & c;.",
        en: "You can chain operators one after another, for example: assign out_and3 = a & b & c;."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
