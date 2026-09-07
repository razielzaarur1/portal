/* ==========================================================================
   VeriLearn Curriculum — Chapter 6: Sequential Logic & Flip-Flops (Lessons 40 to 47)
   ========================================================================== */

(function() {
  const chapter6Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 40: Sequential Logic & posedge clk
    // --------------------------------------------------------------------------
    {
      id: 40,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "מעגלים רציפים ועליות שעון (posedge clk) ⏰",
      titleEn: "Sequential Logic & Clock Edges",

      explanationHe: `
<h3>1. מהם מעגלים רציפים (Sequential Logic)? ⏰</h3>
<p>עד כה למדנו על <strong>מעגלים צירופיים (Combinational Logic)</strong> — מעגלים שבהם היציאה נקבעת במידי ובאופן רציף לפי ערכי הכניסות ברגע הנתון (כמו שערי AND, OR ומרבבים). לעומת זאת, <strong>מעגלים רציפים (Sequential Circuits)</strong> הם מעגלים בעלי תאי זיכרון הפועלים לפי אות תזמון מרכזי: <strong>אות השעון (Clock - <code dir="ltr">clk</code>)</strong>.</p>

<p>במעגל רציף, המערכת אינה מגיבה מיידית לכל שינוי קטן בכניסות, אלא מעדכנת את מצבה הפנימי ואת יציאותיה <strong>אך ורק ברגעי זמן מוגדרים ומדויקים של אות השעון</strong>. בשאר הזמן, הזיכרון שומר על ערכו ביציבות מלאה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מהי עליית שעון (<code dir="ltr">posedge clk</code>)? 📈</h3>
<p>אות השעון הוא אות ריבועי המחזורי העולה מ-0 ל-1 ויורד מ-1 ל-0. המעבר המהיר מדרגה לוגית 0 לדרגה 1 נקרא <strong>עליית שעון (Positive Edge / Rising Edge)</strong>.</p>

<p>ב-Verilog, הבלוק הפרוצדורלי <code dir="ltr">always @(posedge clk)</code> מנחה את הסינתזה והסימולטור לבצע את הלוגיקה שבתוכו <em>אך ורק במיקרו-שנייה שבה אות השעון עולה מ-0 ל-1</em>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. השוואה קריטית: <code dir="ltr">always @(*)</code> מול <code dir="ltr">always @(posedge clk)</code> 💡</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
  <thead>
    <tr style="background: rgba(99,102,241,0.1); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 8px; text-align: right;">מאפיין</th>
      <th style="padding: 8px; text-align: right;"><code dir="ltr">always @(*)</code> (צירופי)</th>
      <th style="padding: 8px; text-align: right;"><code dir="ltr">always @(posedge clk)</code> (רציף)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;"><strong>תגובה לשינויים</strong></td>
      <td style="padding: 8px;">מיידית לכל שינוי בכל כניסה</td>
      <td style="padding: 8px;">אך ורק בעליית אות השעון (<code dir="ltr">posedge clk</code>)</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>זיכרון פנימי</strong></td>
      <td style="padding: 8px;">אין זיכרון (רשת שערים)</td>
      <td style="padding: 8px;">יש זיכרון (דלגלגים / Flip-Flops)</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>סוג השמה ב-Verilog</strong></td>
      <td style="padding: 8px;">השמה חוסמת עם <code dir="ltr">=</code></td>
      <td style="padding: 8px;">השמה לא-חוסמת עם <code dir="ltr">&lt;=</code></td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. תרשים תזמון (Timing Diagram) 📐</h3>
<pre dir="ltr"><code>        +---+   +---+   +---+   +---+
clk  ---|   |___|   |___|   |___|   |___  (אות שעון)
            ^       ^       ^
         posedge  posedge posedge (נקודות הדגימה והעדכון)
</code></pre>
`,

      explanationEn: `
<h3>1. What is Sequential Logic? ⏰</h3>
<p>Unlike <strong>combinational logic</strong> where outputs react immediately to input changes (e.g., AND gates, multiplexers), <strong>sequential logic</strong> incorporates memory elements governed by a central timing control signal: the <strong>Clock (<code dir="ltr">clk</code>)</strong>.</p>

<p>Sequential circuits hold internal state and update their outputs only at precisely defined clock transitions. At all other times, memory contents remain completely stable.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. What is a Positive Clock Edge (<code dir="ltr">posedge clk</code>)? 📈</h3>
<p>The transition from logic LOW (0) to logic HIGH (1) is called a <strong>rising edge / positive edge</strong>. In Verilog, <code dir="ltr">always @(posedge clk)</code> triggers execution strictly on these rising clock edges.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Key Comparison: <code dir="ltr">always @(*)</code> vs <code dir="ltr">always @(posedge clk)</code> 💡</h3>
<ul>
  <li><code dir="ltr">always @(*)</code>: <strong>Combinational</strong> logic using blocking <code dir="ltr">=</code> assignments. Reacts instantly to any input change.</li>
  <li><code dir="ltr">always @(posedge clk)</code>: <strong>Sequential</strong> logic using non-blocking <code dir="ltr">&lt;=</code> assignments. Updates strictly on rising clock edges.</li>
</ul>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסת שעון <code dir="ltr">clk</code>, כניסת נתונים <code dir="ltr">in</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו בבלוק <code dir="ltr">always @(posedge clk)</code> כדי להקצות את הכניסה ליציאה בעליית השעון: <code dir="ltr">out <= in;</code>.`,
      taskEn: `Design <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, data input <code dir="ltr">in</code>, and output <code dir="ltr">output reg out</code>.
Use <code dir="ltr">always @(posedge clk)</code> to assign <code dir="ltr">out <= in;</code>.`,

      starterCode: `module top_module (
    input clk,
    input in,
    output reg out
);
    // כתוב את בלוק השעון כאן / Write clocked block here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input in,
    output reg out
);
    always @(posedge clk) begin
        out <= in;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, in: 0, out: 0 },
        { time: 5, clk: 1, in: 1, out: 1 }
      ],

      hints: {
        he: "השתמשו ב-always @(posedge clk) begin out <= in; end",
        en: "Use always @(posedge clk) begin out <= in; end"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 41: Non-blocking Assignment (<=)
    // --------------------------------------------------------------------------
    {
      id: 41,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "השמה לא-חוסמת (<=) מול השמה חוסמת (=) 📐",
      titleEn: "Non-blocking Assignment Syntax",

      explanationHe: `
<h3>1. ההבדל היסודי בחומרה בין <code dir="ltr">=</code> ל-<code dir="ltr">&lt;=</code> 📐</h3>
<p>ב-Verilog קיימים שני סוגי השמות שונים בתכלית בתוך בלוקים פרוצדורליים:</p>

<ul>
  <li><strong>השמה חוסמת (<code dir="ltr">=</code> Blocking Assignment):</strong> הפקודה מחושבת ומעדכנת את המשתנה <strong>מיידית ובסדר טורי</strong>, שורה אחר שורה (כמו בשפות תכנות תוכנתיות כגון C או Python). מיועדת אך ורק לבלוקים צירופיים (<code dir="ltr">always @(*)</code>).</li>
  <li><strong>השמה לא-חוסמת (<code dir="ltr">&lt;=</code> Non-Blocking Assignment):</strong> כל הביטויים בצד ימין מחושבים בו-זמנית על סמך הערכים הקיימים, ורק בסוף צעד הזמן (בעליית השעון) כל המשתנים בצד שמאל מעודכנים <strong>במקביל (Parallel)</strong>. מיועדת אך ורק לבלוקים רציפים (<code dir="ltr">always @(posedge clk)</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. למה השמה חוסמת (<code dir="ltr">=</code>) גורמת לבאגים במעגלי שעון? ⚠️</h3>
<p>נניח שאנו רוצים לשרשר שני דלגלגים ברצף (אוגר הזזה - Shift Register). אם נכתוב בטעות השמה חוסמת עם <code dir="ltr">=</code>:</p>

<pre dir="ltr"><code>// ❌ שגוי בבלוק שעון!
always @(posedge clk) begin
    q1 = d;    // q1 מתעדכן מיידית לערך של d
    q2 = q1;   // q2 מקבל מיידית את הערך החדש של q1!
end</code></pre>

<p>במקרה כזה, הערך הבינארי של <code dir="ltr">d</code> "טס" דרך שני הדלגלגים בבת אחת במקום לעבור שלב אחד בכל פעימת שעון!</p>

<p>לעומת זאת, כותבים השמה לא-חוסמת עם <code dir="ltr">&lt;=</code>:</p>

<pre dir="ltr"><code>// ✅ נכון ומדויק לחומרה!
always @(posedge clk) begin
    q1 <= d;   // דוגם את d הקיים
    q2 <= q1;  // דוגם את q1 הישן (לפני העדכון)
end</code></pre>

<p>כעת שני הדלגלגים מעודכנים במקביל לחלוטין, בדיוק כפי שקורה ברכיב סיליקון פיזי!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. כללי הברזל של Verilog (Golden Rules) 💡</h3>
<ol>
  <li>בתוך בלוק צירופי <code dir="ltr">always @(*)</code> &larr; משתמשים תמיד בהשמה חוסמת עם <code dir="ltr">=</code>.</li>
  <li>בתוך בלוק רציף <code dir="ltr">always @(posedge clk)</code> &larr; משתמשים תמיד בהשמה לא-חוסמת עם <code dir="ltr">&lt;=</code>.</li>
  <li>לעולם לא מערבבים <code dir="ltr">=</code> ו-<code dir="ltr">&lt;=</code> בתוך אותו בלוק פרוצדורלי!</li>
</ol>
`,

      explanationEn: `
<h3>1. Blocking (<code dir="ltr">=</code>) vs Non-Blocking (<code dir="ltr">&lt;=</code>) Assignments 📐</h3>
<p>Verilog provides two distinct assignment operators for procedural blocks:</p>

<ul>
  <li><strong>Blocking Assignment (<code dir="ltr">=</code>):</strong> Evaluates and updates sequentially line-by-line. Used exclusively in combinational <code dir="ltr">always @(*)</code> blocks.</li>
  <li><strong>Non-Blocking Assignment (<code dir="ltr">&lt;=</code>):</strong> Evaluates all right-hand expressions simultaneously and commits all left-hand variables concurrently at the end of the time step. Used exclusively in clocked <code dir="ltr">always @(posedge clk)</code> blocks.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Golden Rules 💡</h3>
<ol>
  <li>In combinational blocks <code dir="ltr">always @(*)</code> &rarr; use blocking <code dir="ltr">=</code>.</li>
  <li>In sequential blocks <code dir="ltr">always @(posedge clk)</code> &rarr; use non-blocking <code dir="ltr">&lt;=</code>.</li>
  <li>Never mix <code dir="ltr">=</code> and <code dir="ltr">&lt;=</code> within the same procedural block!</li>
</ol>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסת שעון <code dir="ltr">clk</code>, כניסת נתונים <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>.
עדכנו את היציאה באמצעות השמה לא-חוסמת תקנית: <code dir="ltr">q <= d;</code> בעליית השעון.`,
      taskEn: `Build <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, data <code dir="ltr">d</code>, and output <code dir="ltr">output reg q</code>.
Update <code dir="ltr">q <= d;</code> on rising clock edge using non-blocking assignment syntax.`,

      starterCode: `module top_module (
    input clk,
    input d,
    output reg q
);
    // כתוב את ההשמה הלא חוסמת כאן / Write non-blocking assignment here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input d,
    output reg q
);
    always @(posedge clk) begin
        q <= d;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, d: 0, q: 0 },
        { time: 5, clk: 1, d: 1, q: 1 }
      ],

      hints: {
        he: "השתמשו באופרטור <= בתוך הבלוק: always @(posedge clk) q <= d;",
        en: "Use <= operator inside block: always @(posedge clk) q <= d;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 42: D Flip-Flop
    // --------------------------------------------------------------------------
    {
      id: 42,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג D (D Flip-Flop Architecture) 💾",
      titleEn: "D Flip-Flop Architecture",

      explanationHe: `
<h3>1. מהו D Flip-Flop (Data / Delay Flip-Flop)? 💾</h3>
<p>ה-<strong>D Flip-Flop (דלגלג D)</strong> הוא תא הזיכרון הבסיסי והחשוב ביותר באלקטרוניקה ספרתית ובתכנון FPGA / ASIC. תפקידו לשמור <strong>ביט מידע בודד (1-bit)</strong> ולהעביר אותו ליציאה אך ורק ברגע הגעת ענף השעון.</p>

<p>האות <code dir="ltr">D</code> מייצג <strong>Data</strong> (נתון) או <strong>Delay</strong> (שהייה): הדלגלג דוגם את ערכו של האות <code dir="ltr">D</code> ברגע עליית השעון (<code dir="ltr">posedge clk</code>), וממתין/משהה את הערך הזה ביציאה <code dir="ltr">Q</code> עד לעליית השעון הבאה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. משוואת אופיין וטבלת מעברים 📐</h3>
<p>משוואת המצב הבא (Characteristic Equation) של D Flip-Flop פשוטה מאוד:</p>
<p style="text-align: center; font-size: 1.1rem; font-weight: 700; color: var(--accent-primary);"><code dir="ltr">Q_next = D</code></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; text-align: center;">
  <thead>
    <tr style="background: rgba(99,102,241,0.1); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 8px;">שעון (CLK)</th>
      <th style="padding: 8px;">כניסת הנתון (D)</th>
      <th style="padding: 8px;">היציאה הבאה (Q_next)</th>
      <th style="padding: 8px;">תיאור הפעולה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0 או 1 (ללא עלייה)</td>
      <td>X (ללא חשיבות)</td>
      <td>Q (הערך הקודם)</td>
      <td>שמירת זיכרון יציבה (No change)</td>
    </tr>
    <tr>
      <td><strong>עליית שעון (↑)</strong></td>
      <td>0</td>
      <td><strong>0</strong></td>
      <td>דגימת 0 ועדכון היציאה ל-0</td>
    </tr>
    <tr>
      <td><strong>עליית שעון (↑)</strong></td>
      <td>1</td>
      <td><strong>1</strong></td>
      <td>דגימת 1 ועדכון היציאה ל-1</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. תרשים סכמטי של D Flip-Flop 🎨</h3>
<pre dir="ltr"><code>       +------------+
       |  D Flip-Flop|
D ---->| D        Q |----> Q (output reg)
       |            |
clk -->|> CLK       |
       +------------+
</code></pre>
`,

      explanationEn: `
<h3>1. What is a D Flip-Flop (Data / Delay Flip-Flop)? 💾</h3>
<p>The <strong>D Flip-Flop</strong> is the foundational memory element in digital systems. It samples a 1-bit input <code dir="ltr">D</code> on the rising clock edge (<code dir="ltr">posedge clk</code>) and holds that value at output <code dir="ltr">Q</code> until the next clock edge.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Characteristic Equation 📐</h3>
<p style="text-align: center; font-size: 1.1rem; font-weight: 700; color: var(--accent-primary);"><code dir="ltr">Q_next = D</code></p>
<p>At any non-edge clock state, <code dir="ltr">Q</code> maintains its stored value.</p>
`,

      taskHe: `מימו D Flip-Flop במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>) שיעדכן <code dir="ltr">q <= d;</code> בעליית השעון.`,
      taskEn: `Implement a D-FF in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">d</code> and output <code dir="ltr">output reg q</code>) assigning <code dir="ltr">q <= d;</code> on clock edge.`,

      starterCode: `module top_module (
    input clk,
    input d,
    output reg q
);
    // כתוב את ה-D-FF כאן / Write D-FF logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input d,
    output reg q
);
    always @(posedge clk) begin
        q <= d;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, d: 0, q: 0 },
        { time: 5, clk: 1, d: 1, q: 1 }
      ],

      hints: {
        he: "השתמשו ב-always @(posedge clk) q <= d;",
        en: "Use always @(posedge clk) q <= d;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 43: Synchronous Reset D-FF
    // --------------------------------------------------------------------------
    {
      id: 43,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג D עם איפוס סינכרוני (Synchronous Reset) 🔄",
      titleEn: "Synchronous Reset D Flip-Flop",

      explanationHe: `
<h3>1. מהו איפוס סינכרוני (Synchronous Reset)? 🔄</h3>
<p><strong>איפוס סינכרוני</strong> הוא מנגנון איפוס הפועל <em>בסנכרון מלא לשעון</em> — כלומר, היציאה <code dir="ltr">q</code> תתאפס ל-0 <strong>אך ורק ברגע עליית השעון</strong> (<code dir="ltr">posedge clk</code>) במידה שאות ה-reset פעיל.</p>

<p>אם אות ה-reset עולה ל-1 באמצע מחזור השעון, הדלגלג אינו מגיב באותו רגע, אלא ממתין להגעת פעימת השעון הבאה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה הקוד ב-Verilog 📐</h3>
<p>באיפוס סינכרוני, אות ה-reset <strong>אינו מופיע</strong> ברשימת הרגישות (<code dir="ltr">sensitivity list</code>). הרשימה מכילה אך ורק את אות השעון <code dir="ltr">posedge clk</code>:</p>

<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        q <= 1'b0;  // איפוס סינכרוני בעליית שעון
    end else begin
        q <= d;     // קליטת נתון רגילה בעליית שעון
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מבנה החומרה המסונתז (Hardware Realization) 🛠️</h3>
<p>בעת סינתזה, איפוס סינכרוני אינו מתחבר למסוף ה-Clear הפיזי של הדלגלג, אלא יוצר <strong>שער AND / מרבב MUX צירופי</strong> בכניסת ה-D של הדלגלג:</p>

<pre dir="ltr"><code>           +-------+
D -------->| 0     |
           |  MUX  |-----> D_in ---> [D Flip-Flop] ---> Q
1'b0 ----->| 1     |                    ^
           +-------+                    |
               ^                       clk
               |
             reset
</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. יתרונות בעיצוב FPGA ותעשייה 💡</h3>
<ul>
  <li><strong>חסינות לרעשים (Glitches):</strong> מכיוון שהאיפוס נדגם רק בעליית השעון, קפצות או רעשים קצרים באות ה-reset בין פעימות השעון אינם משפיעים על המערכת.</li>
  <li><strong>ניתוח תזמון קל (STA):</strong> מסלול ה-reset מנותח ככל מסלול לוגיקה צירופי רגיל.</li>
</ul>
`,

      explanationEn: `
<h3>1. What is Synchronous Reset? 🔄</h3>
<p>A <strong>synchronous reset</strong> clears the flip-flop output <code dir="ltr">q</code> to 0 strictly on the rising clock edge (<code dir="ltr">posedge clk</code>). Even if the reset line changes asserted high mid-cycle, the output changes state only when the next clock edge arrives.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Verilog Code Structure 📐</h3>
<p>In synchronous reset, the reset signal is <strong>omitted from the sensitivity list</strong> — only <code dir="ltr">posedge clk</code> triggers the block:</p>

<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        q <= 1'b0;  // Synchronous clear
    end else begin
        q <= d;     // Normal data sample
    end
end</code></pre>
`,

      taskHe: `בנו D-FF עם איפוס סינכרוני במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>):
אם <code dir="ltr">reset == 1</code> אפסו את <code dir="ltr">q <= 0;</code> אחרת <code dir="ltr">q <= d;</code> בעליית השעון.`,
      taskEn: `Build a Synchronous Reset D-FF in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">d</code> and output <code dir="ltr">output reg q</code>):
If <code dir="ltr">reset == 1</code> clear <code dir="ltr">q <= 0;</code> else set <code dir="ltr">q <= d;</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);
    // כתוב את ה-D-FF עם Reset כאן / Write logic here

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
        { time: 0, clk: 0, reset: 1, d: 1, q: 0 },
        { time: 5, clk: 1, reset: 1, d: 1, q: 0 }
      ],

      hints: {
        he: "בתוך הבלוק: if (reset) q <= 0; else q <= d;",
        en: "Inside block: if (reset) q <= 0; else q <= d;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 44: Asynchronous Reset D-FF
    // --------------------------------------------------------------------------
    {
      id: 44,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג D עם איפוס אסינכרוני (posedge reset) ⚡",
      titleEn: "Asynchronous Reset D Flip-Flop",

      explanationHe: `
<h3>1. מהו איפוס אסינכרוני (Asynchronous Reset)? ⚡</h3>
<p><strong>איפוס אסינכרוני</strong> פועל <strong>מיידית בתוך אפס זמן</strong> ברגע שאות ה-reset הופך ל-1, <em>ללא שום תלות באות השעון!</em></p>

<p>זהו מנגנון קריטי במערכות חומרה אמיתיות (Power-On Reset): כאשר המכשיר נדלק, רוצים להביא את כל תאי הזיכרון והאוגרים למצב התחלתי מוגדר (0) מיידית, גם אם אות השעון עדיין לא התחיל לפעום.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. רשימת הרגישות (Sensitivity List) ב-Verilog 📐</h3>
<p>כדי שהבלוק יגיב מיידית לאות ה-reset, <strong>חובה להוסיף אותו לרשימת הרגישות</strong> לצד השעון בעזרת מילת המפתח <code dir="ltr">or</code>:</p>

<pre dir="ltr"><code>always @(posedge clk or posedge reset) begin
    if (reset) begin
        q <= 1'b0;  // מופעל מיידית כש-reset עולה ל-1
    end else begin
        q <= d;     // מופעל בעליית שעון כש-reset הוא 0
    end
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. השוואה מקיפה: איפוס סינכרוני מול אסינכרוני ⚖️</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
  <thead>
    <tr style="background: rgba(99,102,241,0.1); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 8px; text-align: right;">מאפיין</th>
      <th style="padding: 8px; text-align: right;">איפוס סינכרוני (Synchronous)</th>
      <th style="padding: 8px; text-align: right;">איפוס אסינכרוני (Asynchronous)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;"><strong>תזמון הפעולה</strong></td>
      <td style="padding: 8px;">רק בעליית השעון (<code dir="ltr">posedge clk</code>)</td>
      <td style="padding: 8px;"><strong>מיידית בשינוי אות ה-reset</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>רשימת רגישות</strong></td>
      <td style="padding: 8px;"><code dir="ltr">always @(posedge clk)</code></td>
      <td style="padding: 8px;"><code dir="ltr">always @(posedge clk or posedge reset)</code></td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>חיבור בחומרה</strong></td>
      <td style="padding: 8px;">לוגיקה צירופית בכניסת ה-D</td>
      <td style="padding: 8px;">מסוף ה-CLR / PRE הפנימי של הדלגלג</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>שימוש עיקרי</strong></td>
      <td style="padding: 8px;">איפוס יומיומי במעגלים מורכבים</td>
      <td style="padding: 8px;">איפוס ראשוני בעת הדלקת המכשיר (Power-On)</td>
    </tr>
  </tbody>
</table>
`,

      explanationEn: `
<h3>1. What is Asynchronous Reset? ⚡</h3>
<p>An <strong>asynchronous reset</strong> clears the flip-flop output <strong>immediately upon assertion</strong>, completely independent of the clock signal. This is essential for Power-On Reset (POR) scenarios where state elements must reach a known state before clock generation stabilizes.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Sensitivity List Requirement 📐</h3>
<p>To trigger immediately on reset events, the reset signal <strong>must be included in the sensitivity list</strong>:</p>

<pre dir="ltr"><code>always @(posedge clk or posedge reset) begin
    if (reset) begin
        q <= 1'b0;  // Executes immediately when reset goes HIGH
    end else begin
        q <= d;     // Executes on rising clock edge when reset is LOW
    end
end</code></pre>
`,

      taskHe: `בנו D-FF עם איפוס אסינכרוני במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>).
השתמשו ברשימת הרגישות האסינכרונית: <code dir="ltr">always @(posedge clk or posedge reset)</code>.`,
      taskEn: `Design an Asynchronous Reset D-FF in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">d</code> and output <code dir="ltr">output reg q</code>).
Use <code dir="ltr">always @(posedge clk or posedge reset)</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);
    // כתוב את הבלוק האסינכרוני כאן / Write async reset block here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input d,
    output reg q
);
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            q <= 1'b0;
        end else begin
            q <= d;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, d: 1, q: 0 },
        { time: 5, clk: 1, reset: 1, d: 1, q: 0 }
      ],

      hints: {
        he: "השתמשו ברשימת הרגישות: always @(posedge clk or posedge reset)",
        en: "Use sensitivity list: always @(posedge clk or posedge reset)"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 45: Enable D Flip-Flop
    // --------------------------------------------------------------------------
    {
      id: 45,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג D עם אות מאפשר (Enable D Flip-Flop) 🔑",
      titleEn: "Enable D Flip-Flop Architecture",

      explanationHe: `
<h3>1. מהו אות מאפשר (Enable - <code dir="ltr">ena</code>)? 🔑</h3>
<p>ברשתות חומרה רבות, איננו רוצים שהדלגלג יטען נתון חדש בכל פעימת שעון, אלא <strong>רק כאשר מגיעה פקודת כתיבה מפורשת</strong>. אות הבקרה שמנהל זאת נקרא <strong>אות מאפשר (Enable - <code dir="ltr">ena</code>)</strong>.</p>

<ul>
  <li>כאשר <code dir="ltr">ena == 1</code>: הדלגלג פועל כרגיל ודוגם את הנתון החדש מכניסת ה-<code dir="ltr">d</code> בעליית השעון (<code dir="ltr">q <= d</code>).</li>
  <li>כאשר <code dir="ltr">ena == 0</code>: הדלגלג להתעלם מכניסת ה-<code dir="ltr">d</code> ו<strong>שומר על ערכו הקודם</strong> (<code dir="ltr">q</code> נשאר ללא שינוי).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. סדר הקדימויות: Reset מול Enable 🚦</h3>
<p>כאשר בונים מעגל רציף המשלב גם איפוס וגם Enable, <strong>אות ה-reset חייב לקבל את הקדימות העליונה</strong>:</p>

<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        q <= 1'b0;       // 1. קדימות עליונה: איפוס
    end else if (ena) begin
        q <= d;          // 2. עדכון נתון חדש רק אם ena=1
    end
    // 3. אם ena=0 ו-reset=0, q נשאר ללא שינוי באופן אוטומטי!
end</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מבנה החומרה המסונתז (Hardware MUX Feedback) 🎨</h3>
<p>כאשר מסנתזים Enable D-FF, הסינתזה יוצרת מרבב (MUX) שמזין את היציאה <code dir="ltr">q</code> חזרה לתוך כניסת ה-D בכל מחזור שבו <code dir="ltr">ena = 0</code>:</p>

<pre dir="ltr"><code>          +-------+
d ------->| 1     |
          |  MUX  |-----> [D Flip-Flop] ---> Q
q +------>| 0     |           ^              |
  |       +-------+           |              |
  |           ^              clk             |
  |           |                              |
  |          ena                             |
  +------------------------------------------+
</code></pre>
`,

      explanationEn: `
<h3>1. What is an Enable Signal (<code dir="ltr">ena</code>)? 🔑</h3>
<p>An <strong>Enable signal (<code dir="ltr">ena</code>)</strong> acts as a write-control gate for flip-flops. When <code dir="ltr">ena == 1</code>, the flip-flop captures new data <code dir="ltr">d</code> on the clock edge. When <code dir="ltr">ena == 0</code>, it ignores <code dir="ltr">d</code> and holds its current state.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Priority Order: Reset vs Enable 🚦</h3>
<p>Reset always takes precedence over Enable:</p>

<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        q <= 1'b0;       // Priority 1: Reset
    end else if (ena) begin
        q <= d;          // Priority 2: Enable update
    end
end</code></pre>
`,

      taskHe: `בנו D-FF בעל אות מאפשר במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">ena</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>):
- אם <code dir="ltr">reset == 1</code>: <code dir="ltr">q <= 0;</code>
- אחרת אם <code dir="ltr">ena == 1</code>: <code dir="ltr">q <= d;</code>.`,
      taskEn: `Build an Enable D-FF in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">ena</code>, <code dir="ltr">d</code> and output <code dir="ltr">output reg q</code>):
- If <code dir="ltr">reset == 1</code>: <code dir="ltr">q <= 0;</code>
- Else if <code dir="ltr">ena == 1</code>: <code dir="ltr">q <= d;</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input ena,
    input d,
    output reg q
);
    // כתוב את לוגיקת ה-Enable כאן / Write Enable D-FF here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input ena,
    input d,
    output reg q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 1'b0;
        end else if (ena) begin
            q <= d;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, ena: 0, d: 1, q: 0 },
        { time: 5, clk: 1, reset: 0, ena: 1, d: 1, q: 1 }
      ],

      hints: {
        he: "בתוך הבלוק: if (reset) q <= 0; else if (ena) q <= d;",
        en: "Inside block: if (reset) q <= 0; else if (ena) q <= d;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 46: T Flip-Flop
    // --------------------------------------------------------------------------
    {
      id: 46,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג T מתהפך (T Flip-Flop Architecture) 🔄",
      titleEn: "T Flip-Flop Architecture",

      explanationHe: `
<h3>1. מהו דלגלג T (Toggle Flip-Flop)? 🔄</h3>
<p>ה-<strong>T Flip-Flop (דלגלג T)</strong> הוא דלגלג ייעודי לביצוע פעולת <strong>היפוך (Toggle)</strong>. האות <code dir="ltr">T</code> מייצג את מילת המפתח <strong>Toggle</strong> (החלפת מצב).</p>

<ul>
  <li>כאשר <code dir="ltr">t == 1</code>: בכל פעימת שעון בעלייה (<code dir="ltr">posedge clk</code>), היציאה הופכת את ערכה הבינארי (<code dir="ltr">q <= ~q</code>): מ-0 ל-1, ומ-1 ל-0.</li>
  <li>כאשר <code dir="ltr">t == 0</code>: היציאה <code dir="ltr">q</code> נשארת יציבה ללא שינוי.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. משוואת אופיין ולוגיקה פנימית 📐</h3>
<p>הלוגיקה הפנימית של דלגלג T מבוססת על שער <strong>XOR</strong> בין כניסת ה-<code dir="ltr">t</code> לבין היציאה הנוכחית <code dir="ltr">q</code>:</p>
<p style="text-align: center; font-size: 1.1rem; font-weight: 700; color: var(--accent-primary);"><code dir="ltr">Q_next = T ^ Q</code></p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. שימושים מרכזיים בחומרה 💡</h3>
<ul>
  <li><strong>מחלק תדר (Clock Divider):</strong> כאשר מחברים <code dir="ltr">t = 1</code> באופן קבוע, היציאה <code dir="ltr">q</code> מתחלפת בקצב חצי מתדר השעון ($f / 2$).</li>
  <li><strong>מונים בינאריים (Binary Counters):</strong> דלגלגי T מהווים את אבני הבניין היסודיות לבניית מונלי למעלה/למטה (Up/Down Counters).</li>
</ul>
`,

      explanationEn: `
<h3>1. What is a T Flip-Flop (Toggle Flip-Flop)? 🔄</h3>
<p>A <strong>T Flip-Flop</strong> toggles its output bit on each rising clock edge whenever <code dir="ltr">t == 1</code> (<code dir="ltr">q <= ~q</code>). When <code dir="ltr">t == 0</code>, the output holds its current state.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Characteristic Equation 📐</h3>
<p style="text-align: center; font-size: 1.1rem; font-weight: 700; color: var(--accent-primary);"><code dir="ltr">Q_next = T ^ Q</code></p>
`,

      taskHe: `בנו T Flip-Flop במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">t</code> ויציאה <code dir="ltr">output reg q</code>):
- אם <code dir="ltr">reset == 1</code>: <code dir="ltr">q <= 0;</code>
- אחרת אם <code dir="ltr">t == 1</code>: <code dir="ltr">q <= ~q;</code>.`,
      taskEn: `Design a T Flip-Flop in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">t</code> and output <code dir="ltr">output reg q</code>):
- If <code dir="ltr">reset == 1</code>: <code dir="ltr">q <= 0;</code>
- Else if <code dir="ltr">t == 1</code>: <code dir="ltr">q <= ~q;</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input t,
    output reg q
);
    // כתוב את דלגלג T כאן / Write T Flip-Flop here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input t,
    output reg q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 1'b0;
        end else if (t) begin
            q <= ~q;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, t: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, t: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, t: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, t: 1, q: 1 },
        { time: 20, clk: 0, reset: 0, t: 1, q: 1 },
        { time: 25, clk: 1, reset: 0, t: 1, q: 0 }
      ],

      hints: {
        he: "בתוך הבלוק: if (reset) q <= 0; else if (t) q <= ~q;",
        en: "Inside block: if (reset) q <= 0; else if (t) q <= ~q;"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 47: JK Flip-Flop
    // --------------------------------------------------------------------------
    {
      id: 47,
      chapter: 6,
      chapterTitleHe: "פרק 6: מעגלים רציפים ודלגלגים",
      chapterTitleEn: "Chapter 6: Sequential Logic & Flip-Flops",
      titleHe: "דלגלג JK אוניברסלי (JK Flip-Flop Architecture) 🎛️",
      titleEn: "JK Flip-Flop Architecture",

      explanationHe: `
<h3>1. מהו דלגלג JK אוניברסלי? 🎛️</h3>
<p>ה-<strong>JK Flip-Flop (דלגלג JK)</strong> הוא דלגלג אוניברסלי המשלב את כל 4 מצבי התפעול האפשריים של תא זיכרון. הרכיב נקרא על שם הממציא ג'ק קילבי (Jack Kilby, זוכה פרס נובל וממציא המעגל המשולב).</p>

<p>דלגלג JK נבנה במקור כדי לפתור את המצב המבוטל (Invalid State) שהיה קיים בדלגלגי SR ישנים כאשר שתי הכניסות היו 1.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת אמת ומצבי התפעול של JK 📐</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; text-align: center;">
  <thead>
    <tr style="background: rgba(99,102,241,0.1); border-bottom: 1px solid var(--border-color);">
      <th style="padding: 8px;">J</th>
      <th style="padding: 8px;">K</th>
      <th style="padding: 8px;">היציאה הבאה (Q_next)</th>
      <th style="padding: 8px;">שם המצב (Mode)</th>
      <th style="padding: 8px;">תיאור הפעולה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td><strong>Q</strong></td>
      <td>שמירה (Hold)</td>
      <td>היציאה נשארת ללא שינוי</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td><strong>0</strong></td>
      <td>איפוס (Reset)</td>
      <td>מאפס את היציאה ל-0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td><strong>1</strong></td>
      <td>קביעה (Set)</td>
      <td>קובע את היציאה ל-1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td><strong>~Q</strong></td>
      <td>היפוך (Toggle)</td>
      <td>הופך את ערך היציאה הקודם</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מימוש ב-Verilog באמצעות משפט <code dir="ltr">case ({j, k})</code> 💻</h3>
<p>דרך אלגנטית ונקיאה לממש דלגלג JK היא איחוד האותות <code dir="ltr">{j, k}</code> בתוך משפט <code dir="ltr">case</code>:</p>

<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        q <= 1'b0;
    end else begin
        case ({j, k})
            2'b00: q <= q;     // Hold
            2'b01: q <= 1'b0;  // Reset
            2'b10: q <= 1'b1;  // Set
            2'b11: q <= ~q;    // Toggle
        endcase
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. What is a Universal JK Flip-Flop? 🎛️</h3>
<p>The <strong>JK Flip-Flop</strong> is a universal memory element supporting all 4 fundamental operating modes: Hold, Reset, Set, and Toggle. Named after Jack Kilby, it resolves the invalid input state of older SR latches.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Operating Modes 📐</h3>
<ul>
  <li><code dir="ltr">{J, K} == 2'b00</code>: <strong>Hold</strong> (<code dir="ltr">q <= q</code>)</li>
  <li><code dir="ltr">{J, K} == 2'b01</code>: <strong>Reset</strong> (<code dir="ltr">q <= 0</code>)</li>
  <li><code dir="ltr">{J, K} == 2'b10</code>: <strong>Set</strong> (<code dir="ltr">q <= 1</code>)</li>
  <li><code dir="ltr">{J, K} == 2'b11</code>: <strong>Toggle</strong> (<code dir="ltr">q <= ~q</code>)</li>
</ul>
`,

      taskHe: `בנו JK Flip-Flop במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">j</code>, <code dir="ltr">k</code> ויציאה <code dir="ltr">output reg q</code>):
- באיפוס: <code dir="ltr">q <= 0;</code>
- בעליית שעון: לפי טבלת JK:
  - {j,k} == 2'b00: לשמור <code dir="ltr">q <= q;</code>
  - {j,k} == 2'b01: <code dir="ltr">q <= 0;</code>
  - {j,k} == 2'b10: <code dir="ltr">q <= 1;</code>
  - {j,k} == 2'b11: להתהפך <code dir="ltr">q <= ~q;</code>.`,
      taskEn: `Build a JK Flip-Flop in <code dir="ltr">top_module</code> (inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">j</code>, <code dir="ltr">k</code> and output <code dir="ltr">output reg q</code>):
- On reset: <code dir="ltr">q <= 0;</code>
- On posedge clk based on {j,k}:
  - 2'b00: hold <code dir="ltr">q <= q;</code>
  - 2'b01: <code dir="ltr">q <= 0;</code>
  - 2'b10: <code dir="ltr">q <= 1;</code>
  - 2'b11: toggle <code dir="ltr">q <= ~q;</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input j,
    input k,
    output reg q
);
    // כתוב את דלגלג JK כאן / Write JK Flip-Flop logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input j,
    input k,
    output reg q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 1'b0;
        end else begin
            case ({j, k})
                2'b00: q <= q;
                2'b01: q <= 1'b0;
                2'b10: q <= 1'b1;
                2'b11: q <= ~q;
            endcase
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, j: 0, k: 0, q: 0 },
        { time: 5, clk: 1, reset: 0, j: 1, k: 0, q: 1 }
      ],

      hints: {
        he: "השתמשו במשפט case ({j, k}) בתוך הבלוק.",
        en: "Use case ({j, k}) statement inside the block."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter6Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter6Lessons);
  }
})();
