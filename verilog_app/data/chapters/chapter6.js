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
<h3>1. מהם מעגלים רציפים? ⏰</h3>
<p>עד כה למדנו מעגלים <strong>צירופיים</strong> — הפלט נקבע מיידית ע"י הכניסות. <strong>מעגלים רציפים</strong> (Sequential) שומרים מצב פנימי ומעדכנים אותו רק ברגעי שעון מוגדרים.</p>
<p>בלוק <code dir="ltr">always @(posedge clk)</code> רגיש ל<strong>עליית השעון</strong> בלבד — כל שאר הזמן, הפלט נשאר קבוע.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הקצאה לא-חוסמת (Non-Blocking) 📐</h3>
<p>בתוך בלוקים רציפים משתמשים ב-<code dir="ltr"><=</code> (Non-Blocking Assignment):</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    out <= in;  // non-blocking — value updated at end of time step
end</code></pre>
<p>זה מבטיח שכל הדלגלגים מעודכנים בו-זמנית, כמו בחומרה אמיתית.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. ההבדל המרכזי מ-always @(*) 💡</h3>
<ul>
  <li><code dir="ltr">always @(*)</code> — <strong>צירופי</strong>: משתמשים ב-<code dir="ltr">=</code>, מגיב לכל שינוי</li>
  <li><code dir="ltr">always @(posedge clk)</code> — <strong>רציף</strong>: משתמשים ב-<code dir="ltr"><=</code>, מגיב רק לעליית שעון</li>
</ul>
`,

      explanationEn: `
<h3>1. What is Sequential Logic? ⏰</h3>
<p>So far we've built <strong>combinational</strong> circuits — output is determined instantly by inputs. <strong>Sequential circuits</strong> store internal state and update it only at defined clock moments.</p>
<p>An <code dir="ltr">always @(posedge clk)</code> block triggers only on <strong>rising clock edges</strong> — at all other times, the output remains stable.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Non-Blocking Assignment 📐</h3>
<p>Inside sequential blocks, use <code dir="ltr"><=</code> (Non-Blocking Assignment):</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    out <= in;  // non-blocking — all FFs update simultaneously
end</code></pre>
<p>This ensures all flip-flops are updated simultaneously, matching real hardware behavior.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Key Difference from always @(*) 💡</h3>
<ul>
  <li><code dir="ltr">always @(*)</code> — <strong>combinational</strong>: use <code dir="ltr">=</code>, reacts to any input change</li>
  <li><code dir="ltr">always @(posedge clk)</code> — <strong>sequential</strong>: use <code dir="ltr"><=</code>, reacts only to clock edges</li>
</ul>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסת שעון <code dir="ltr">clk</code>, כניסת נתונים <code dir="ltr">in</code> ויציאה <code dir="ltr">output reg out</code>.
השתמשו בבלוק <code dir="ltr">always @(posedge clk)</code> כדי לעדכן את <code dir="ltr">out <= in;</code>.`,
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
      titleHe: "השמה לא-חוסמת (<=) 📐",
      titleEn: "Non-blocking Assignment Syntax",

      explanationHe: `
<h3>1. השמה לא-חוסמת 📐</h3>
<p>בבלוקים רציפים של שעון משתמשים תמיד בהשמה לא-חוסמת (<code dir="ltr">&lt;=</code>) כדי למנוע Race Conditions.</p>
`,

      explanationEn: `
<h3>1. Non-blocking Assignment Rule 📐</h3>
<p>In clocked sequential blocks, always use non-blocking assignment (<code dir="ltr">&lt;=</code>) for clean hardware synthesis.</p>
`,

      taskHe: `בנו מודול <code dir="ltr">top_module</code> בעל כניסת שעון <code dir="ltr">clk</code>, כניסת נתונים <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>.
עדכנו את <code dir="ltr">q <= d;</code> בשיעור עליית השעון.`,
      taskEn: `Build <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, data <code dir="ltr">d</code>, and output <code dir="ltr">output reg q</code>.
Update <code dir="ltr">q <= d;</code> on rising clock edge.`,

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
        he: "השתמשו באופרטור <= בתוך הבלוק.",
        en: "Use <= operator inside block."
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
      titleHe: "דלגלג D (D Flip-Flop) 💾",
      titleEn: "D Flip-Flop Architecture",

      explanationHe: `
<h3>1. מהו D Flip-Flop? 💾</h3>
<p>D Flip-Flop הוא רכיב הזיכרון הבסיסית ביותר השומר 1-ביט מידע מסונכרן לשעון.</p>
`,

      explanationEn: `
<h3>1. D Flip-Flop Memory 💾</h3>
<p>The D Flip-Flop stores 1 bit of memory synchronized to positive clock edges.</p>
`,

      taskHe: `מימו D-FF במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>) שיעדכן <code dir="ltr">q <= d;</code> בעליית השעון.`,
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
      titleHe: "דלגלג D עם איפוס סינכרוני 🔄",
      titleEn: "Synchronous Reset D Flip-Flop",

      explanationHe: `
<h3>1. מהו איפוס סינכרוני? 🔄</h3>
<p><strong>איפוס סינכרוני</strong> פועל רק <em>ברגע עליית השעון</em> (<code dir="ltr">posedge clk</code>). כלומר, גם אם אות ה-reset פעיל, המעגל ישנה את מצבו רק כשהשעון עולה.</p>
<p>זה בניגוד ל<strong>איפוס אסינכרוני</strong> שפועל מיידית, ללא קשר לשעון.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה הקוד 📐</h3>
<p>באיפוס סינכרוני, אות ה-<code dir="ltr">reset</code> <strong>לא מופיע</strong> ברשימת הרגישות — רק <code dir="ltr">posedge clk</code>:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset)
        q <= 0;    // synchronous clear
    else
        q <= d;    // normal capture
end</code></pre>
<p>הסינתיזה מייצרת D-FF עם כניסת reset מחוברת ללוגיקה צירופית <em>לפני</em> הדלגלג, לא למסוף CLR של הדלגלג עצמו.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. יתרון באיפוס סינכרוני 💡</h3>
<p>בעיצוב FPGA, איפוס סינכרוני <strong>מומלץ</strong> כי הוא מונע בעיות תזמון (glitches) ושומר על ניתוח STA (Static Timing Analysis) פשוט ואמין. כלל אצבע: <em>השתמשו באיפוס סינכרוני כברירת מחדל</em>.</p>
`,

      explanationEn: `
<h3>1. What is Synchronous Reset? 🔄</h3>
<p><strong>Synchronous reset</strong> only takes effect on the <em>rising clock edge</em> (<code dir="ltr">posedge clk</code>). Even if the reset signal is asserted, the flip-flop state changes only when the clock transitions.</p>
<p>This contrasts with <strong>asynchronous reset</strong>, which acts immediately regardless of the clock.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Code Structure 📐</h3>
<p>In synchronous reset, the <code dir="ltr">reset</code> signal does <strong>not appear</strong> in the sensitivity list — only <code dir="ltr">posedge clk</code>:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset)
        q <= 0;    // synchronous clear
    else
        q <= d;    // normal data capture
end</code></pre>
<p>Synthesis produces a D-FF with reset connected to combinational logic <em>before</em> the flip-flop's D input, not to the CLR terminal.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Why Prefer Synchronous Reset? 💡</h3>
<p>In FPGA design, synchronous reset is <strong>preferred</strong> because it avoids timing glitches and keeps Static Timing Analysis (STA) simple and reliable. Rule of thumb: <em>use synchronous reset by default</em>.</p>
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
      titleHe: "דלגלג D עם איפוס אסינכרוני (posedge rst) ⚡",
      titleEn: "Asynchronous Reset D Flip-Flop",

      explanationHe: `
<h3>1. איפוס אסינכרוני ⚡</h3>
<p>איפוס אסינכרוני נוסף לרשימת הרגישות: <code dir="ltr">always @(posedge clk or posedge reset)</code> ולכן מגיב מיידית ברגע שאות האיפוס עולה.</p>
`,

      explanationEn: `
<h3>1. Asynchronous Reset ⚡</h3>
<p>An asynchronous reset is included in the sensitivity list (<code dir="ltr">always @(posedge clk or posedge reset)</code>) and clears output immediately.</p>
`,

      taskHe: `בנו D-FF עם איפוס אסינכרוני במודול <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code>, <code dir="ltr">d</code> ויציאה <code dir="ltr">output reg q</code>).
השתמשו ב-<code dir="ltr">always @(posedge clk or posedge reset)</code>.`,
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
      titleHe: "דלגלג D עם אות מאפשר (Enable) 🔑",
      titleEn: "Enable D Flip-Flop Architecture",

      explanationHe: `
<h3>1. אות מאפשר (Enable) 🔑</h3>
<p>אות <code dir="ltr">ena</code> שולט אם ה-D-FF מעדכן נתון חדש או שומר את הנתון הישן.</p>
`,

      explanationEn: `
<h3>1. Enable Control 🔑</h3>
<p>An <code dir="ltr">ena</code> signal controls whether the Flip-Flop updates or holds its previous memory state.</p>
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
      titleHe: "דלגלג T מתהפך (T Flip-Flop) 🔄",
      titleEn: "T Flip-Flop Architecture",

      explanationHe: `
<h3>1. דלגלג T מתהפך 🔄</h3>
<p>כאשר כניסת <code dir="ltr">t == 1</code>, יציאת דלגלג T הופכת את ערכה בכל מחזור שעון: <code dir="ltr">q <= ~q;</code>.</p>
`,

      explanationEn: `
<h3>1. Toggle T Flip-Flop 🔄</h3>
<p>When input <code dir="ltr">t == 1</code>, the T Flip-Flop toggles its output bit on each clock tick: <code dir="ltr">q <= ~q;</code>.</p>
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
        { time: 0, clk: 0, reset: 1, t: 1, q: 0 },
        { time: 5, clk: 1, reset: 0, t: 1, q: 1 }
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
      titleHe: "דלגלג JK קלאסי (JK Flip-Flop) 🎛️",
      titleEn: "JK Flip-Flop Architecture",

      explanationHe: `
<h3>1. דלגלג JK 🎛️</h3>
<p>דלגלג JK משלב את כל אפשרויות הזיכרון (00=שמירה, 01=איפוס, 10=סט, 11=היפוך).</p>
`,

      explanationEn: `
<h3>1. Universal JK Flip-Flop 🎛️</h3>
<p>The JK Flip-Flop supports all state modes (00=Hold, 01=Reset, 10=Set, 11=Toggle).</p>
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
