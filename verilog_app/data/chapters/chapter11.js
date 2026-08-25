/* ==========================================================================
   VeriLearn Curriculum — Chapter 11: Clock Synchronization, Metastability & CDC (Lessons 81 to 86)
   ========================================================================== */

(function() {
  const chapter11Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 81: Metastability Principles
    // --------------------------------------------------------------------------
    {
      id: 81,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "עקרונות מטא-סטביליות (Metastability) ⚠️",
      titleEn: "Metastability Principles",

      explanationHe: `
<h3>1. מהי מטא-סטביליות (Metastability)? ⚠️</h3>
<p>במעגלים דיגיטליים סינכרוניים, רכיבי זיכרון (כמו דלגלגים - Flip-Flops) דורשים שאות המידע בכניסה יהיה יציב לחלוטין סביב עליית השעון. דרישה זו מוגדרת על ידי שני זמנים קריטיים:</p>
<ul>
  <li><strong>Setup Time ($T_{su}$):</strong> הזמן המינימלי שבו המידע בכניסה חייב להיות יציב <em>לפני</em> עליית השעון.</li>
  <li><strong>Hold Time ($T_h$):</strong> הזמן המינימלי שבו המידע בכניסה חייב להישאר יציב <em>אחרי</em> עליית השעון.</li>
</ul>

<p>אם אות המידע משתנה בתוך חלון הזמנים הקריטי הזה (למשל, עקב מעבר בין תחומי שעון שונים שאינם מסונכרנים), הדלגלג נכנס למצב <strong>מטא-סטבילי (Metastable)</strong>. במצב זה, המוצא אינו לוגי '0' ואינו לוגי '1', אלא נקודת שיווי משקל לא יציבה (בדומה לכדור המונח בדיוק על קצה של גבעה חדה).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. פיזיקה של מטא-סטביליות וזמן רזולוציה ($T_{met}$) ⏱️</h3>
<p>הדלגלג מורכב משני שערים המחוברים במשוב חיובי. כאשר מתרחשת הפרה של זמני Setup/Hold, המתח הפנימי של הדלגלג נתקע במתח ביניים. המשוב החיובי ימשוך בסופו של דבר את המתח לאחד משני הכיוונים (0 או 1 באופן אקראי), אך התהליך לוקח זמן. זמן זה נקרא <strong>זמן הרזולוציה ($T_{met}$)</strong>.</p>

<p>אם המעגלים הלוגיים הבאים בתור דוגמים את מוצא הדלגלג לפני שהוא התייצב, המטא-סטביליות תתפשט לכל רוחב השבב ותגרום לקריסת המערכת.</p>

<p>מדד האמינות של דלגלג תחת סיכון מטא-סטביליות נמדד על ידי <strong>MTBF (Mean Time Between Failures)</strong>, המוגדר לפי:</p>
<pre dir="ltr" style="text-align: center; font-weight: bold;">
MTBF = e^(T_met / tau) / (W * f_clk * f_data)
</pre>
<p>כאשר $f_{clk}$ הוא תדר השעון, $f_{data}$ הוא תדר שינוי המידע, ו-$\tau$ ו-$W$ הם קבועים פיזיקליים של הטכנולוגיה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דלגלג קלאסי כאבן הבניין הבסיסית 💾</h3>
<p>לפני שנלמד כיצד למנוע ולסנכרן אותות כדי למנוע מטא-סטביליות, נממש את אבן הבניין הבסיסית ביותר ברשת סנכרון - דלגלג D (D Flip-Flop) פשוט עם איפוס סינכרוני.</p>
`,

      explanationEn: `
<h3>1. What is Metastability? ⚠️</h3>
<p>In synchronous digital design, sequential elements (such as Flip-Flops) require their input data to be stable during a small window around the active clock edge. This window is defined by two physical constraints:</p>
<ul>
  <li><strong>Setup Time ($T_{su}$):</strong> The minimum time the input data must be stable <em>before</em> the rising clock edge.</li>
  <li><strong>Hold Time ($T_h$):</strong> The minimum time the input data must remain stable <em>after</em> the rising clock edge.</li>
</ul>

<p>If a signal transitions within this critical window (common when crossing asynchronous clock domains), the Flip-Flop enters a <strong>Metastable state</strong>. Instead of outputting a clean logic 0 or 1, the output floats at an intermediate voltage, representing an unstable equilibrium (similar to a ball balanced on the peak of a steep hill).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Physics & Resolution Time ($T_{met}$) ⏱️</h3>
<p>A flip-flop uses cross-coupled feedback loops. During a setup/hold violation, the feedback node is charged to a middle-state voltage. The feedback loop will eventually resolve the voltage to a stable '0' or '1' randomly, but this resolution takes a non-zero duration called <strong>Resolution Time ($T_{met}$)</strong>.</p>

<p>If downstream logic samples the flip-flop's output before it resolves, the metastable level propagates, causing system-wide functional failures.</p>

<p>The reliability of a sequential system under metastability is characterized by the <strong>Mean Time Between Failures (MTBF)</strong>:</p>
<pre dir="ltr" style="text-align: center; font-weight: bold;">
MTBF = e^(T_met / tau) / (W * f_clk * f_data)
</pre>
<p>Where $f_{clk}$ is the sampling clock frequency, $f_{data}$ is the input data toggle rate, and $\tau$ and $W$ are technological constants.</p>
`,

      taskHe: `ממשו דלגלג D (D Flip-Flop) פשוט עם איפוס סינכרוני במודול <code dir="ltr">top_module</code>.
על עליית השעון (<code dir="ltr">posedge clk</code>):
1. אם <code dir="ltr">reset</code> פעיל (שווה ל-1), היציאה <code dir="ltr">q</code> תתאפס ל-0.
2. אחרת, היציאה <code dir="ltr">q</code> תקבל את ערך הכניסה <code dir="ltr">d</code>.`,
      taskEn: `Implement a simple D Flip-Flop with synchronous reset in <code dir="ltr">top_module</code>.
On the rising edge of the clock (<code dir="ltr">posedge clk</code>):
1. If <code dir="ltr">reset</code> is active-high (1), the output <code dir="ltr">q</code> must be cleared to 0.
2. Otherwise, the output <code dir="ltr">q</code> should capture the input value <code dir="ltr">d</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);

    // כתבו את הקוד שלכם כאן / Write your code here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 1'b0;
        end else begin
            q <= d;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, d: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, d: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, d: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, d: 1, q: 1 },
        { time: 20, clk: 0, reset: 0, d: 0, q: 1 },
        { time: 25, clk: 1, reset: 0, d: 0, q: 0 }
      ],

      hints: {
        he: "פתחו בלוק sequential בעזרת always @(posedge clk). בתוך הבלוק בדקו את reset באמצעות תנאי if-else והקצו את הערכים בדחף (<=).",
        en: "Open a sequential block using always @(posedge clk). Inside, use an if-else block to check the reset state and assign values using non-blocking statements (<=)."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 82: 2-Stage Flip-Flop Synchronizer
    // --------------------------------------------------------------------------
    {
      id: 82,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "מסנכרן דו-דרגתי (2-Stage FF Synchronizer) 🔗",
      titleEn: "2-Stage Flip-Flop Synchronizer",

      explanationHe: `
<h3>1. למה סנכרון נחוץ בחציית תחומי שעון (CDC)? 🔗</h3>
<p>כאשר אות דיגיטלי עובר מתחום שעון אחד (Source Clock Domain) לתחום שעון אחר שאינו מסונכרן איתו (Destination Clock Domain), לא ניתן להבטיח את זמני ה-Setup וה-Hold בדלגלג הקולט. המעברים יתרחשו בזמנים אקראיים ביחס לשעון המקבל, ולכן הדלגלג הראשון בתחום היעד עלול להיכנס למצב מטא-סטבילי.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארכיטקטורת מסנכרן דו-דרגתי (Double Flip-Flop Synchronizer) 📐</h3>
<p>הפתרון הנפוץ ביותר עבור אותות בקרה בעלי שינוי איטי (Single-bit Control Signals) הוא <strong>מסנכרן דו-דרגתי (2-Stage FF Synchronizer)</strong>:</p>

<div style="text-align: center; margin: 1rem 0;">
  <code dir="ltr">async_in ➡️ [FF 1] ➡️ sync_q1 ➡️ [FF 2] ➡️ out</code>
</div>

<p>העיקרון פשוט: אם הדלגלג הראשון (<code dir="ltr">FF 1</code>) נכנס למצב מטא-סטבילי בעקבות מעבר אות בכניסה, יש לו מחזור שעון שלם (מינוס זמני ההשהיה והסנכרון של הדלגלג השני) להתייצב למצב לוגי תקין (0 או 1) לפני שהדלגלג השני (<code dir="ltr">FF 2</code>) דוגם את המוצא שלו. זהו זמן הרזולוציה המוקצה למערכת.</p>

<p>שימוש בשני דלגלגים בטור מפחית את ההסתברות למטא-סטביליות במוצא הסופי ברמה מעריכית, ומגדיל את ה-MTBF של המערכת משניות בודדות לאלפי שנים.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. הערה על סימולציה מול חומרה פיזית 💡</h3>
<p>במעגלים פיזיים אמיתיים, האות <code dir="ltr">out</code> יתייצב בדיוק לאחר שתי פעימות שעון מלאות (דיליי של 2 מחזורים). בסימולציות מופשטות וממוחשבות (כמו בסימולטור הלוקאלי שלנו), המעברים הלוגיים מיוצגים בצורה ישירה של דגימת שלב יחיד. אנו נתכנן את המודול הפיזי של שני הדלגלגים בטור, והסימולציה תאמת את תפקוד הדגימה של הרכיב תחת שעון היעד.</p>
`,

      explanationEn: `
<h3>1. The Need for Synchronization in Clock Domain Crossing (CDC) 🔗</h3>
<p>When a signal crosses from one clock domain (Source Domain) to another asynchronous clock domain (Destination Domain), setup and hold times cannot be guaranteed at the receiving flip-flop. Since transitions occur at random times relative to the destination clock, the first receiving flip-flop is highly likely to enter a metastable state.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. 2-Stage Flip-Flop Synchronizer Architecture 📐</h3>
<p>The standard solution for synchronizing single-bit control signals is a <strong>2-Stage Flip-Flop Synchronizer</strong> (also known as a double-flop synchronizer):</p>

<div style="text-align: center; margin: 1rem 0;">
  <code dir="ltr">async_in ➡️ [Flip-Flop 1] ➡️ sync_q1 ➡️ [Flip-Flop 2] ➡️ out</code>
</div>

<p><strong>How it works:</strong> If the first flip-flop (<code dir="ltr">FF 1</code>) goes metastable, it has a full clock period (minus setup times of the second flip-flop) to settle to a stable logic state ('0' or '1') before the second flip-flop (<code dir="ltr">FF 2</code>) samples its output. This dramatically reduces the probability of propagating metastability downstream, scaling the MTBF from seconds to thousands of years.</p>
`,

      taskHe: `ממשו מסנכרן דו-דרגתי עבור אות כניסה אסינכרוני <code dir="ltr">in</code> לתוך תחום השעון של <code dir="ltr">clk</code>.
השתמשו באות איפוס סינכרוני <code dir="ltr">reset</code>.
על עליית השעון (<code dir="ltr">posedge clk</code>):
- אם <code dir="ltr">reset</code> שווה ל-1, שני שלבי הסנכרון יאופסו ל-0 (היציאה <code dir="ltr">out</code> תהיה 0).
- אחרת, המידע יעבור דרך שני הדלגלגים בטור לקבלת מוצא מסונכרן ב-<code dir="ltr">out</code>.`,
      taskEn: `Implement a 2-stage Flip-Flop Synchronizer to bring an asynchronous input <code dir="ltr">in</code> into the clock domain of <code dir="ltr">clk</code>.
Use a synchronous <code dir="ltr">reset</code> signal.
On the rising edge of the clock (<code dir="ltr">posedge clk</code>):
- If <code dir="ltr">reset</code> is 1, both synchronizer stages must be cleared to 0 (resulting in output <code dir="ltr">out</code> being 0).
- Otherwise, shift the data through the two cascaded registers to produce the synchronized output <code dir="ltr">out</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg out
);

    // הגדירו את אוגר הביניים וממשו את שני השלבים
    // Define the intermediate register and implement the two stages

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg out
);
    reg q1;

    always @(posedge clk) begin
        if (reset) begin
            q1  <= 1'b0;
            out <= 1'b0;
        end else begin
            q1  <= in;
            out <= q1;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, in: 0, out: 0 },
        { time: 5, clk: 1, reset: 1, in: 0, out: 0 },
        { time: 10, clk: 0, reset: 0, in: 1, out: 0 },
        { time: 15, clk: 1, reset: 0, in: 1, out: 1 },
        { time: 20, clk: 0, reset: 0, in: 0, out: 1 },
        { time: 25, clk: 1, reset: 0, in: 0, out: 0 }
      ],

      hints: {
        he: "הגדירו משתנה פנימי מסוג reg בשם q1. בבלוק ה-always, בצעו q1 <= in ולאחר מכן out <= q1.",
        en: "Declare an internal reg signal named q1. Inside the clocked always block, write q1 <= in and out <= q1."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 83: Button Debouncer Circuit
    // --------------------------------------------------------------------------
    {
      id: 83,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "מסנן רעשי לחיצה (Button Debouncer) 🔘",
      titleEn: "Button Debouncer Circuit",

      explanationHe: `
<h3>1. תופעת הרטט המכני (Switch Bouncing) 🔘</h3>
<p>כאשר לוחצים על כפתור פיזי או מפסק, המגעים המתכתיים הפנימיים אינם נסגרים באופן מיידי וחלק. במקום זאת, הם מתנגשים ורוטטים זה בזה במשך זמן קצר (לרוב בין 1ms ל-20ms) לפני שהם מתייצבים במצבם הסופי.</p>

<p>עבור בקר חומרה דיגיטלי הפועל בתדרים של מגה-הרצים (מיליוני מחזורים בשנייה), תקופת הרטט הזו נראית כמו עשרות לחיצות מהירות נפרדות (רצף של '0' ו-'1'). ללא מנגנון סינון, לחיצה בודדת על כפתור תגרום למערכת לזהות ריבוי לחיצות שגויות.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. כיצד עובד רכיב Debouncer בחומרה? 🛠️</h3>
<p>רכיב <strong>Debouncer</strong> נועד לסנן את הרעשים הללו ולוודא שהאות מועבר הלאה רק לאחר שהוא נשאר יציב למשך זמן מוגדר. הארכיטקטורה מורכבת משני שלבים עיקריים:</p>
<ol>
  <li><strong>סנכרון ראשוני (Synchronization):</strong> העברת האות האסינכרוני של הכפתור דרך דלגלג D (או מסנכרן דו-דרגתי) כדי למנוע מטא-סטביליות בשעון המערכת.</li>
  <li><strong>בדיקת יציבות (Filtering):</strong> שימוש ברכיב השהיה (כמו מונה או אוגר הזזה) כדי לאמת שהאות נשאר יציב לאורך מספר מחזורים.</li>
</ol>

<p>במחיצה זו, נממש את שלב הדגימה והסנכרון הראשוני של אות הכפתור הרועש, המהווה את בסיס החומרה הדיגיטלי לסינון רעשים רציף.</p>
`,

      explanationEn: `
<h3>1. Switch Bouncing Phenomenon 🔘</h3>
<p>When a physical button or switch is pressed, the internal metal contacts do not close instantly. Instead, they impact and bounce off each other repeatedly for a short period (typically 1ms to 20ms) before settling into a stable state.</p>

<p>To a high-speed digital circuit operating at megahertz or gigahertz frequencies, this bouncing appears as dozens of rapid, distinct presses. Without a filter, a single physical button press triggers multiple false events in logic.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Button Debouncing in Hardware 🛠️</h3>
<p>A <strong>Button Debouncer</strong> filters out these transitions, ensuring the signal is only registered after it remains stable for a set duration. The design consists of:</p>
<ol>
  <li><strong>First-Stage Synchronization:</strong> Sampling the asynchronous button input using a D Flip-Flop to resolve metastability.</li>
  <li><strong>Integrator/Filter Stage:</strong> Using a counter or shift-register window to verify that the signal does not toggle for a predefined time frame.</li>
</ol>
`,

      taskHe: `ממשו את שלב הדגימה והסנכרון של אות הלחיצה הרועש <code dir="ltr">in</code> לתחום השעון של המערכת במודול <code dir="ltr">top_module</code>.
השתמשו באות איפוס סינכרוני <code dir="ltr">reset</code>.
על עליית השעון (<code dir="ltr">posedge clk</code>):
- אם <code dir="ltr">reset</code> הוא 1, מוצא הדוגם <code dir="ltr">out</code> יתאפס ל-0.
- אחרת, <code dir="ltr">out</code> ידגום את ערך הכניסה <code dir="ltr">in</code>.`,
      taskEn: `Implement the synchronization and sampling stage of the noisy button input <code dir="ltr">in</code> in <code dir="ltr">top_module</code>.
Use a synchronous <code dir="ltr">reset</code> signal.
On the rising edge of the clock (<code dir="ltr">posedge clk</code>):
- If <code dir="ltr">reset</code> is 1, the sampled output <code dir="ltr">out</code> must be cleared to 0.
- Otherwise, the output <code dir="ltr">out</code> must sample the noisy input <code dir="ltr">in</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg out
);

    // כתבו את קוד הדגימה של המפסק כאן
    // Write your switch sampling code here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg out
);
    always @(posedge clk) begin
        if (reset) begin
            out <= 1'b0;
        end else begin
            out <= in;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, in: 0, out: 0 },
        { time: 5, clk: 1, reset: 1, in: 0, out: 0 },
        { time: 10, clk: 0, reset: 0, in: 1, out: 0 },
        { time: 15, clk: 1, reset: 0, in: 1, out: 1 },
        { time: 20, clk: 0, reset: 0, in: 0, out: 1 },
        { time: 25, clk: 1, reset: 0, in: 0, out: 0 }
      ],

      hints: {
        he: "ממשו דלגלג קלאסי הדוגם את הכניסה in. המעבר out <= in יבטיח את סנכרון המידע בכניסה.",
        en: "Implement a classic D Flip-Flop sampling input in. Assigning out <= in ensures synchronous capturing of the noisy input."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 84: Pulse Synchronizer
    // --------------------------------------------------------------------------
    {
      id: 84,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "מסנכרן דפקים (Pulse Synchronizer) ⏱️",
      titleEn: "Pulse Synchronizer",

      explanationHe: `
<h3>1. מדוע מסנכרן רגיל (2-Stage FF) אינו מתאים לדפקים? ⏱️</h3>
<p>מסנכרן דו-דרגתי רגיל עובד מצוין עבור אותות רמה (Level Signals) שנשארים יציבים לאורך זמן. אולם, אם ננסה להעביר <strong>דפק (Pulse)</strong> באורך מחזור שעון יחיד מתחום שעון מהיר לתחום שעון איטי, השעון האיטי עלול "לפספס" את הדפק לחלוטין מכיוון שהדפק יספיק לעלות ולרדת לפני שתתרחש עליית שעון בתחום היעד.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארכיטקטורת מסנכרן דפקים (Toggle Synchronizer) 📐</h3>
<p>כדי להעביר דפק בבטחה, משתמשים במסנכרן דפקים המבוסס על שבוש פונקציות עיקריות:</p>
<ol>
  <li><strong>מחולל שינוי מצב (Toggle Generator):</strong> בתחום המקור, כל זיהוי של דפק כניסה הופך (Toggles) את הערך של רגיסטר פנימי (מ-0 ל-1 או מ-1 ל-0). בכך אנו הופכים את הדפק הזמני לאות רמה שנשאר יציב.</li>
  <li><strong>מסנכרן דו-דרגתי (2-Stage FF Synchronizer):</strong> אות הרמה שעבר שינוי מועבר בבטחה לתחום שעון היעד ומסונכרן למניעת מטא-סטביליות.</li>
  <li><strong>גלאי שינוי צירופי (XOR Edge Detector):</strong> בתחום היעד, אנו משווים את האות המסונכרן העכשווי לבין האות המסונכרן כפי שהיה במחזור הקודם. אם יש חוסר התאמה (שינוי רמה), מופק דפק חדש ברוחב מחזור יחיד בעזרת שער לוגי מסוג XOR.</li>
</ol>

<div style="text-align: center; margin: 1.2rem 0;">
  <strong>נוסחת גילוי שינוי:</strong><br>
  <code dir="ltr">pulse_out = sync_current ^ sync_previous</code>
</div>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. משימת התכן 🛠️</h3>
<p>במשימה זו, נממש את רכיב המוצא הצירופי הקריטי ביותר במסנכרן הדפקים: גלאי השינוי הלוגי המבוסס על השוואת שלב הסנכרון הנוכחי (<code dir="ltr">sync_q2</code>) לבין שלב הסנכרון הקודם (<code dir="ltr">sync_q3</code>) כדי לשחזר את הדפק המקורי.</p>
`,

      explanationEn: `
<h3>1. Why Standard Synchronizers Fail for Pulses ⏱️</h3>
<p>A standard 2-stage Flip-Flop synchronizer works perfectly for level signals. However, if a single-cycle **Pulse** from a fast clock domain crosses into a slower clock domain, the slow clock might miss the pulse entirely because it can rise and fall before the slow clock's sampling edge occurs.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Pulse (Toggle) Synchronizer Architecture 📐</h3>
<p>To safely transfer pulses across clock domains, we use a Toggle Synchronizer consisting of three stages:</p>
<ol>
  <li><strong>Toggle Generator (Source Domain):</strong> Converts the input pulse into a level transition. Every time a pulse is detected, a state register flips (0 to 1, or 1 to 0). This turns a transient pulse into a steady level.</li>
  <li><strong>2-Stage FF Synchronizer:</strong> Transfers the level signal to the destination domain.</li>
  <li><strong>Edge/Toggle Detector (Destination Domain):</strong> Employs a delay register and a combinational XOR gate to detect level transitions, reconstructed as a single-cycle output pulse.</li>
</ol>

<div style="text-align: center; margin: 1.2rem 0;">
  <strong>Edge Detection Equation:</strong><br>
  <code dir="ltr">pulse_out = sync_current ^ sync_previous</code>
</div>
`,

      taskHe: `ממשו את לוגיקת גילוי השינוי הצירופית (XOR Edge Detector) של מסנכרן הדפקים במודול <code dir="ltr">top_module</code>.
המודול מקבל שתי כניסות:
- <code dir="ltr">sync_q2</code>: המצב הנוכחי של האות המסונכרן.
- <code dir="ltr">sync_q3</code>: המצב של האות המסונכרן במחזור השעון הקודם.
המוצא <code dir="ltr">pulse_out</code> צריך לקבל ערך לוגי 1 כאשר מזוהה שינוי במצב (עלייה או ירידה), וערך 0 אחרת.`,
      taskEn: `Implement the combinational XOR edge detection logic of a Pulse Synchronizer in <code dir="ltr">top_module</code>.
The module receives two inputs:
- <code dir="ltr">sync_q2</code>: The current state of the synchronized toggle signal.
- <code dir="ltr">sync_q3</code>: The state of the synchronized toggle signal in the previous clock cycle.
The output <code dir="ltr">pulse_out</code> must be driven to 1 when a level change (transition) is detected between the two inputs, and 0 otherwise.`,

      starterCode: `module top_module (
    input sync_q2,
    input sync_q3,
    output pulse_out
);

    // כתבו את משוואת הגילוי כאן
    // Write your detection equation here

endmodule`,

      solutionCode: `module top_module (
    input sync_q2,
    input sync_q3,
    output pulse_out
);
    assign pulse_out = sync_q2 ^ sync_q3;
endmodule`,

      expectedOutputs: [
        { time: 0,  sync_q2: 0, sync_q3: 0, pulse_out: 0 },
        { time: 5,  sync_q2: 1, sync_q3: 0, pulse_out: 1 },
        { time: 10, sync_q2: 1, sync_q3: 1, pulse_out: 0 },
        { time: 15, sync_q2: 0, sync_q3: 1, pulse_out: 1 },
        { time: 20, sync_q2: 0, sync_q3: 0, pulse_out: 0 }
      ],

      hints: {
        he: "השתמשו באופרטור XOR הלוגי (^) כדי להשוות בין שני האותות sync_q2 ו-sync_q3 בתוך פקודת assign.",
        en: "Use the bitwise XOR operator (^) to compare sync_q2 and sync_q3 inside a continuous assign statement."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 85: Asynchronous Reset Synchronizer
    // --------------------------------------------------------------------------
    {
      id: 85,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "מסנכרן איפוס אסינכרוני (Asynchronous Reset Synchronizer) 🔄",
      titleEn: "Asynchronous Reset Synchronizer",

      explanationHe: `
<h3>1. הסכנה שבשחרור איפוס אסינכרוני (Reset Recovery/Removal) 🔄</h3>
<p>שימוש באות איפוס אסינכרוני (Asynchronous Reset) הוא תרגול נפוץ המאפשר לאפס את כל רכיבי החומרה בשבב באופן מיידי, ללא תלות בקיום שעון פעיל. כניסת האיפוס מופעלת מיידית ללא תלות בשעון.</p>

<p>הסכנה מתרחשת בשלב <strong>שחרור האיפוס (De-assertion)</strong>. אם אות האיפוס משתחרר בדיוק סביב עליית השעון של דלגלג מסוים, מתרחשת הפרה של זמני הסף:</p>
<ul>
  <li><strong>Recovery Time ($T_{rec}$):</strong> הזמן המינימלי הנדרש בין שחרור האיפוס לבין עליית השעון הבאה.</li>
  <li><strong>Removal Time ($T_{rem}$):</strong> הזמן המינימלי הנדרש שבו האיפוס חייב להישאר יציב <em>לאחר</em> עליית השעון.</li>
</ul>

<p>הפרה כזו עלולה לגרום לחלק מהדלגלגים לצאת מאיפוס במחזור שעון מסוים, בעוד שאחרים יצאו מאיפוס רק במחזור הבא, מה שיוביל לקריסת מכונות מצבים (FSM) וכניסת דלגלגים למטא-סטביליות.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הפתרון: שחרור מסונכרן (Assert Asynchronously, De-assert Synchronously) 📐</h3>
<p>כדי לפתור את הבעיה, בונים <strong>מסנכרן איפוס (Reset Synchronizer)</strong> המבוסס על שני דלגלגים המחוברים בטור:</p>
<ul>
  <li>כניסות האיפוס האסינכרוני של שני הדלגלגים מחוברות ישירות לאות האיפוס הראשי.</li>
  <li>הכניסה של הדלגלג הראשון מחוברת קבוע ל-'0' (או '1' בהתאם ללוגיקת האיפוס).</li>
  <li>המוצא של הדלגלג השני הוא אות האיפוס המסונכרן החדש שיופץ לכל השבב.</li>
</ul>

<p>התוצאה: כאשר אות האיפוס מופעל, הדלגלגים מאופסים באופן מיידי (אסינכרוני). כאשר אות האיפוס משתחרר, האות '0' הקבוע מועבר בטור ומסונכרן לשעון, כך שהאיפוס הכללי משתחרר באופן סינכרוני לחלוטין לכל רכיבי השבב.</p>
`,

      explanationEn: `
<h3>1. The Danger of Asynchronous Reset De-assertion 🔄</h3>
<p>Asynchronous resets are widely used because they initialize hardware registers immediately, even when no clock is active. However, the critical phase is the **de-assertion (release)** of the reset.</p>

<p>If the reset signal transitions from active to inactive too close to a clock edge, it violates timing parameters known as:</p>
<ul>
  <li><strong>Reset Recovery Time ($T_{rec}$):</strong> The minimum time required between the reset de-assertion and the next rising clock edge.</li>
  <li><strong>Reset Removal Time ($T_{rem}$):</strong> The minimum time the reset must remain active after the rising clock edge.</li>
</ul>

<p>Violating these parameters causes different registers to exit the reset state at different clock cycles, leading to corrupt finite state machine (FSM) states and metastability.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Rule: "Assert Asynchronously, De-assert Synchronously" 📐</h3>
<p>We mitigate this using a **Reset Synchronizer** (typically 2 cascaded registers):</p>
<ul>
  <li>The asynchronous reset clears both registers immediately.</li>
  <li>The data input of the first register is tied to a stable logic value (e.g. 0).</li>
  <li>The output of the second register serves as the synchronized reset for the rest of the design.</li>
</ul>
`,

      taskHe: `ממשו את שלב הדלגלג המסנכרן הראשי במערכת איפוס במודול <code dir="ltr">top_module</code>.
על עליית השעון (<code dir="ltr">posedge clk</code>):
- אם אות האיפוס <code dir="ltr">reset</code> פעיל (שווה ל-1), היציאה <code dir="ltr">q</code> חייבת להתאפס ל-0 מיידית.
- אחרת, היציאה <code dir="ltr">q</code> תעתיק את הערך היציב של כניסת המידע <code dir="ltr">d</code>.`,
      taskEn: `Implement the primary synchronizer stage of a reset control system in <code dir="ltr">top_module</code>.
On the rising edge of the clock (<code dir="ltr">posedge clk</code>):
- If the <code dir="ltr">reset</code> signal is active (1), the output <code dir="ltr">q</code> must immediately clear to 0.
- Otherwise, the output <code dir="ltr">q</code> should follow the stable data input <code dir="ltr">d</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);

    // כתבו את לוגיקת התיאום עבור האיפוס כאן
    // Write your reset coordination logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 1'b0;
        end else begin
            q <= d;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, d: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, d: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, d: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, d: 1, q: 1 },
        { time: 20, clk: 0, reset: 0, d: 0, q: 1 },
        { time: 25, clk: 1, reset: 0, d: 0, q: 0 }
      ],

      hints: {
        he: "ממשו מודול אוגר סינכרוני. בדקו את מצב ה-reset בעליית השעון כדי לקבוע אם לאפס את המוצא q או לטעון אליו את הערך d.",
        en: "Implement a synchronous register. Check the reset state on posedge clk to decide whether to clear q or load d."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 86: Clock Divider (Even/Odd Dividers)
    // --------------------------------------------------------------------------
    {
      id: 86,
      chapter: 11,
      chapterTitleHe: "פרק 11: סנכרון שעונים, מטא-סטביליות ותכנון חוצי שעון (CDC)",
      chapterTitleEn: "Chapter 11: Clock Synchronization, Metastability & Clock Domain Crossing (CDC)",
      titleHe: "מחלקי שעון (Even/Odd Clock Dividers) ⏰",
      titleEn: "Clock Divider (Even/Odd Dividers)",

      explanationHe: `
<h3>1. מדוע מחלקים שעונים בחומרה? ⏰</h3>
<p>בשבבי סיליקון מודרניים ישנו לרוב שעון ראשי מהיר (למשל 100MHz), אך תתי-מערכות מסוימות (כמו פרוטוקולי תקשורת איטיים כגון UART ,SPI או I2C) דורשות שעוני עבודה איטיים בהרבה. כדי לחסוך באנרגיה ולמנוע שימוש במחוללי שעון פיזיים מרובים (כמו PLL-ים יקרים), מייצרים שעונים איטיים באמצעות <strong>חלוקת תדר (Clock Division)</strong>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חלוקה זוגית (Even Dividers) 📈</h3>
<p>חלוקת שעון במספרים זוגיים (כמו חלוקה ב-2, 4, 8) היא פשוטה מאוד. היא מבוססת על מונים בינאריים פשוטים:</p>
<ul>
  <li>חלוקה ב-2: הפיכת מוצא הדלגלג בכל מחזור שעון (מוצא הדלגלג מתהפך בקצב של חצי מהתדר המקורי).</li>
  <li>חלוקה ב-$2^N$: שימוש במונה בינארי של $N$ ביטים. הביט ה-$k$ של המונה מייצג שעון מחולק ב-$2^{k+1}$. למשל, ביט 0 מחולק ב-2, ביט 1 מחולק ב-4, וביט 2 מחולק ב-8.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. חלוקה אי-זוגית עם 50% Duty Cycle (Odd Dividers) 📐</h3>
<p>חלוקת תדר במספר אי-זוגי (כמו חלוקה ב-3 או ב-5) עם יחס מחזור סימטרי של 50% (Duty Cycle) היא מורכבת יותר, מאחר והמעברים צריכים להתרחש גם בעליית השעון וגם בירידת השעון של השעון המקורי.</p>
<p>למשל, כדי לחלק ב-3 עם 50% Duty Cycle:</p>
<ol>
  <li>מממשים מונה פנימי של 3 מצבים (0, 1, 2) הפועל על <strong>עליית השעון (posedge clk)</strong> ומייצרים אות <code dir="ltr">clk_pos</code> ששווה ל-1 במצב 0 ושווה ל-0 בשאר המצבים (שליש מחזור פעיל).</li>
  <li>מממשים שלב דגימה קטן הפועל על <strong>ירידת השעון (negedge clk)</strong> כדי ליצור אות <code dir="ltr">clk_neg</code> הדוגם את האות <code dir="ltr">clk_pos</code>.</li>
  <li>האות הסופי מתקבל על ידי חיבור לוגי מסוג OR בין שני האותות: <code dir="ltr">clk_div3 = clk_pos | clk_neg</code>. החיבור מייצר אות שפעיל בדיוק 1.5 מחזורי שעון וכבוי 1.5 מחזורי שעון, שזהו תדר מחולק ב-3 ובעל 50% Duty Cycle!</li>
</ol>
`,

      explanationEn: `
<h3>1. Why Do We Divide Clocks? ⏰</h3>
<p>Modern System-on-Chips (SoCs) run on a high-speed primary master clock. However, peripheral protocols (like UART, SPI, or I2C) require much lower frequency clocks. To save power and avoid routing multiple physical PLL lines, we synthesize slower clocks using **Clock Dividers** in digital logic.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Even Division ($2^N$ Dividers) 📈</h3>
<p>Dividing a clock by an even integer (like 2, 4, 8) is simple. It uses a binary counter:</p>
<ul>
  <li><strong>Divide-by-2:</strong> Toggle a Flip-Flop on every clock edge ($Q_{next} = \sim Q$).</li>
  <li><strong>Divide-by-$2^N$:</strong> Run a binary counter. The bits of the counter represent divided clocks: bit 0 divides by 2, bit 1 divides by 4, bit 2 divides by 8, and so on.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Odd Division with a 50% Duty Cycle 📐</h3>
<p>Dividing by an odd number (like 3 or 5) while maintaining a clean 50% duty cycle is more advanced because transitions must occur on both the rising and falling edges of the source clock.</p>
<p>For example, to divide by 3 with a 50% duty cycle:</p>
<ol>
  <li>Design a modulo-3 counter on the **rising clock edge (posedge clk)**, generating a signal <code dir="ltr">clk_pos</code> which is high for 1 cycle and low for 2 cycles (a 33% duty cycle).</li>
  <li>Sample <code dir="ltr">clk_pos</code> on the **falling clock edge (negedge clk)** to produce a half-cycle shifted signal <code dir="ltr">clk_neg</code>.</li>
  <li>Perform a logical OR: <code dir="ltr">clk_div3 = clk_pos | clk_neg</code>. This merges the two 33% duty cycle pulses to form a symmetric clock that is active for exactly 1.5 cycles and inactive for 1.5 cycles.</li>
</ol>
`,

      taskHe: `ממשו מונה בינארי של 4 ביטים במודול <code dir="ltr">top_module</code>, המיועד לשמש בסיס לחלוקת שעון זוגית.
על עליית השעון (<code dir="ltr">posedge clk</code>):
- אם <code dir="ltr">reset</code> פעיל (שווה ל-1), המונה <code dir="ltr">q</code> יתאפס ל-4'b0000.
- אחרת, המונה <code dir="ltr">q</code> יתקדם ב-1 בכל מחזור שעון.`,
      taskEn: `Implement a 4-bit binary counter in <code dir="ltr">top_module</code>, which serves as the foundation for even clock division.
On the rising edge of the clock (<code dir="ltr">posedge clk</code>):
- If <code dir="ltr">reset</code> is active (1), the counter output <code dir="ltr">q</code> must clear to 4'b0000.
- Otherwise, the counter <code dir="ltr">q</code> should increment by 1.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);

    // כתבו את קוד המונה הציקלי שלכם כאן
    // Write your cyclic counter code here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'b0000;
        end else begin
            q <= q + 1'b1;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, q: 0 },
        { time: 5, clk: 1, reset: 1, q: 0 },
        { time: 10, clk: 0, reset: 0, q: 0 },
        { time: 15, clk: 1, reset: 0, q: 1 },
        { time: 20, clk: 0, reset: 0, q: 1 },
        { time: 25, clk: 1, reset: 0, q: 2 },
        { time: 30, clk: 0, reset: 0, q: 2 },
        { time: 35, clk: 1, reset: 0, q: 3 },
        { time: 40, clk: 0, reset: 0, q: 3 },
        { time: 45, clk: 1, reset: 0, q: 4 }
      ],

      hints: {
        he: "הגדירו תנאי updates בבלוג always. אם לא באיפוס, עדכנו q <= q + 1 כדי לקדם את הערך.",
        en: "Define update conditions in the always block. If not in reset, write q <= q + 1 to increment the counter."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter11Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter11Lessons);
  }
})();
