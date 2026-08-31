/* ==========================================================================
   VeriLearn Curriculum — Chapter 7: Registers & Counters (Lessons 48 to 56)
   ========================================================================== */

(function() {
  const chapter7Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 48: 4-bit Register
    // --------------------------------------------------------------------------
    {
      id: 48,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "אוגר 4-ביט (4-bit Register) 💾",
      titleEn: "4-bit Register",

      explanationHe: `
<h3>1. מהו אוגר (Register)? 💾</h3>
<p>אוגר הוא קבוצה של דלגלגים (Flip-Flops) הפועלים יחד תחת שעון משותף על מנת לאחסן מילה בינארית (קבוצת ביטים) בו-זמנית. בעוד שדלגלג בודד מאחסן ביט אחד בלבד, אוגר בגודל N ביט מאחסן ערך רחב יותר.</p>

<p>התכונות הבסיסיות של אוגר חומרה הן:</p>
<ul>
  <li><strong>שעון משותף (Common Clock)</strong>: כל הדלגלגים באוגר דוגמים את ערכי הכניסה שלהם באותו עליית שעון בדיוק.</li>
  <li><strong>אות איפוס (Reset)</strong>: מביא את כל ביטי האוגר לערך מוגדר (לרוב 0) כדי להתחיל ממצב ידוע.</li>
  <li><strong>אפשרות טעינה (Parallel Load)</strong>: אות בקרה המאפשר לקבוע מתי האוגר יתעדכן בנתון חדש ומתי ישמור על ערכו הנוכחי.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה חומרה של אוגר עם טעינה (Load Enable) 📐</h3>
<p>על מנת לאפשר לאוגר לשמור על ערכו כאשר אות הטעינה אינו פעיל, משתמשים במרבב (MUX) לפני כל דלגלג. המרבב בוחר בין הנתון החדש בכניסה לבין הערך הנוכחי שיוצא מהדלגלג עצמו (לולאת משוב):</p>

<pre dir="ltr"><code>               +-------+
Data In ------>|1      |
               |  MUX  |-----> D Flip-Flop -----> Q Out
Q Out  ------->|0      |       (posedge clk)        |
               +-------+                            |
                   ^                                |
                   |                                |
              Load Enable --------------------------+
</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד: אוגר 8-ביט עם אפשור כתיבה ואיפוס 💻</h3>
<p>להלן מימוש גנרי של אוגר 8-ביט המשתמש באות אפשור כתיבה (<code dir="ltr">en</code>) ואיפוס אסינכרוני:</p>
<pre dir="ltr"><code>module register_8bit (
    input clk,
    input rst_n,
    input en,
    input [7:0] data_in,
    output reg [7:0] q_out
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            q_out <= 8'h00;
        end else if (en) begin
            q_out <= data_in;
        end
        // שים לב: אם en אינו פעיל, אין צורך לכתוב block מפורש.
        // החומרה אוטומטית שומרת על הערך הקודם של q_out.
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is a Register? 💾</h3>
<p>A register is a group of flip-flops operating under a common clock signal to store a multi-bit binary word. While a single D flip-flop stores one bit, an N-bit register stores N bits of data concurrently.</p>

<p>The essential characteristics of a hardware register include:</p>
<ul>
  <li><strong>Common Clock</strong>: All flip-flops inside the register sample their inputs at the exact same clock edge.</li>
  <li><strong>Reset Signal</strong>: Forces all bits inside the register to a known state (usually 0) during startup or initialization.</li>
  <li><strong>Parallel Load</strong>: A control signal that determines when the register updates its contents with new data versus when it holds its current state.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Hardware Implementation of Parallel Load 📐</h3>
<p>To enable a register to hold its value when the load signal is inactive, a Multiplexer (MUX) is placed before each D flip-flop. The MUX selects between the new input data and the current output of the flip-flop (feedback loop):</p>

<pre dir="ltr"><code>               +-------+
Data In ------>|1      |
               |  MUX  |-----> D Flip-Flop -----> Q Out
Q Out  ------->|0      |       (posedge clk)        |
               +-------+                            |
                   ^                                |
                   |                                |
              Load Enable --------------------------+
</code></pre>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Generic Code Example: 8-bit Register with Enable 💻</h3>
<p>Below is a generic implementation of an 8-bit register with write enable (<code dir="ltr">en</code>) and active-low asynchronous reset:</p>
<pre dir="ltr"><code>module register_8bit (
    input clk,
    input rst_n,
    input en,
    input [7:0] data_in,
    output reg [7:0] q_out
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            q_out <= 8'h00;
        end else if (en) begin
            q_out <= data_in;
        end
        // Note: If en is inactive, q_out implicitly retains its previous state.
    end
endmodule</code></pre>
`,

      taskHe: `בנו אוגר 4-ביט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני), <code dir="ltr">load</code> (טעינה מקבילית), וכניסת נתונים רחבה <code dir="ltr">data</code> [3:0], ויציאה <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> שווה ל-1, יש לאפס את היציאה <code dir="ltr">q <= 0</code>.
- אחרת, אם <code dir="ltr">load</code> שווה ל-1, יש לטעון את <code dir="ltr">data</code> לתוך היציאה <code dir="ltr">q</code>.
- אחרת, היציאה שומרת על ערכה הנוכחי (Hold).`,
      taskEn: `Design a 4-bit Register with Parallel Load inside <code dir="ltr">top_module</code>. The module has inputs <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, <code dir="ltr">load</code> enable, 4-bit input <code dir="ltr">data</code>, and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the output <code dir="ltr">q <= 0</code>.
- Else if <code dir="ltr">load</code> is high (1), load <code dir="ltr">data</code> into <code dir="ltr">q</code>.
- Otherwise, the output <code dir="ltr">q</code> must retain its current value.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input load,
    input [3:0] data,
    output reg [3:0] q
);
    // כתבו את לוגיקת האוגר כאן / Write your register logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input load,
    input [3:0] data,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'd0;
        end else if (load) begin
            q <= data;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, load: 0, data: 7, q: 0 },
        { time: 5, clk: 1, reset: 1, load: 0, data: 7, q: 0 },
        { time: 10, clk: 0, reset: 0, load: 1, data: 7, q: 0 },
        { time: 15, clk: 1, reset: 0, load: 1, data: 7, q: 7 },
        { time: 20, clk: 0, reset: 0, load: 0, data: 13, q: 7 },
        { time: 25, clk: 0, reset: 0, load: 1, data: 13, q: 7 },
        { time: 30, clk: 1, reset: 0, load: 1, data: 13, q: 13 }
      ],

      hints: {
        he: "השתמשו בבלוק always @(posedge clk) ובמבנה תנאים (if-else). בתוך תנאי ה-else if (load) בצעו השמה לא-חוסמת של data ל-q.",
        en: "Use an always @(posedge clk) block with an if-else structure. In the else if (load) branch, perform a non-blocking assignment of data to q."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 49: Shift Register (SISO/SIPO)
    // --------------------------------------------------------------------------
    {
      id: 49,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "אוגר הזזה (SISO/SIPO Shift Register) 🚂",
      titleEn: "Shift Register (SISO/SIPO)",

      explanationHe: `
<h3>1. מהו אוגר הזזה (Shift Register)? 🚂</h3>
<p>אוגר הזזה מורכב משרשרת של דלגלגים המחוברים בטור, כאשר יציאת כל דלגלג מחוברת לכניסת הדלגלג הבא אחריו. בכל עליית שעון, הנתונים "מסיעים" צעד אחד לאורך השרשרת.</p>

<p>קיימים שני סיווגים מרכזיים של אוגרי הזזה לפי אופן הכנסת והוצאת הנתונים:</p>
<ol>
  <li><strong>SISO (Serial-In Serial-Out)</strong>: הנתונים נכנסים ביט אחרי ביט (בטור) ויוצאים ביט אחרי ביט מהדלגלג האחרון בשרשרת. משמש בעיקר ליצירת השהיות (Delays) וקווי השהיה של נתונים.</li>
  <li><strong>SIPO (Serial-In Parallel-Out)</strong>: הנתונים נכנסים בטור, אך כל יציאות הדלגלגים חשופות בו-זמנית כאוטובוס מקבילי. משמש להמרת נתונים מטורי למקבילי (לדוגמה, קליטת ביטים מקו תקשורת טורי והמרתם לבית שלם במחשב).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש הזזה ב-Verilog באמצעות שרשור (Concatenation) 📐</h3>
<p>הדרך היעילה ביותר לייצג הזזה ב-Verilog היא להשתמש באופרטור השרשור <code dir="ltr">{ }</code>. לדוגמה, כדי להסיט שמאלה אוגר בגודל 8 ביט ולהכניס ביט חדש מימין:</p>

<pre dir="ltr"><code>// הזזה שמאלה: שבעת הביטים התחתונים מוסטים שמאלה, והכניסה הטורית נכנסת כ-LSB
shift_bus <= {shift_bus[6:0], serial_in};</code></pre>

<p>אם היינו רוצים להסיט ימינה:</p>
<pre dir="ltr"><code>// הזזה ימינה: שבעת הביטים העליונים מוסטים ימינה, והכניסה הטורית נכנסת כ-MSB
shift_bus <= {serial_in, shift_bus[7:1]};</code></pre>
`,

      explanationEn: `
<h3>1. What is a Shift Register? 🚂</h3>
<p>A shift register is a cascade of flip-flops where the output of one flip-flop is connected to the input of the next. On each clock tick, the stored bits shift one position down the chain like train cars on a track.</p>

<p>Two primary types of shift registers are classified by their interface:</p>
<ol>
  <li><strong>SISO (Serial-In Serial-Out)</strong>: Data is loaded one bit at a time (serially) and read out one bit at a time from the last stage. Primarily used for delay lines.</li>
  <li><strong>SIPO (Serial-In Parallel-Out)</strong>: Data is loaded serially, but all stages of the register are exposed as a parallel bus. Used for serial-to-parallel data conversion (e.g., in serial communication protocols like SPI or UART).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Shifting in Verilog using Concatenation 📐</h3>
<p>The cleanest way to implement a shift operation in Verilog is using the concatenation operator <code dir="ltr">{ }</code>. For example, to shift an 8-bit register left and insert a new serial bit at the LSB:</p>

<pre dir="ltr"><code>// Shift left: upper 7 bits are retained and shifted, serial input becomes the LSB
shift_bus <= {shift_bus[6:0], serial_in};</code></pre>

<p>To shift right:</p>
<pre dir="ltr"><code>// Shift right: lower 7 bits are retained and shifted, serial input becomes the MSB
shift_bus <= {serial_in, shift_bus[7:1]};</code></pre>
`,

      taskHe: `בנו אוגר הזזה מסוג SIPO של 4 ביט במודול <code dir="ltr">top_module</code> בעל כניסת שעון <code dir="ltr">clk</code>, כניסה טורית <code dir="ltr">in</code>, ויציאה מקבילית <code dir="ltr">q</code> [3:0].
בעליית השעון, יש להסיט את הביטים שמאלה כך שהביט החדש מהכניסה <code dir="ltr">in</code> ייכנס כביט הפחות משמעותי (<code dir="ltr">q[0]</code>), וערכי <code dir="ltr">q[2:0]</code> יוסטו שמאלה ל-<code dir="ltr">q[3:1]</code>.`,
      taskEn: `Design a 4-bit SIPO Shift Register in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, serial input <code dir="ltr">in</code>, and 4-bit parallel output <code dir="ltr">q</code>.
On the rising clock edge, shift bits leftward: the new input <code dir="ltr">in</code> becomes the LSB (<code dir="ltr">q[0]</code>), and the existing lower bits <code dir="ltr">q[2:0]</code> shift left into <code dir="ltr">q[3:1]</code>.`,

      starterCode: `module top_module (
    input clk,
    input in,
    output reg [3:0] q
);
    // כתבו את לוגיקת אוגר ההזזה כאן / Write your shift register logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input in,
    output reg [3:0] q
);
    always @(posedge clk) begin
        q <= {q[2:0], in};
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, in: 1, q: 0 },
        { time: 5, clk: 1, in: 1, q: 1 },
        { time: 10, clk: 0, in: 0, q: 1 },
        { time: 15, clk: 1, in: 0, q: 2 },
        { time: 20, clk: 0, in: 1, q: 2 },
        { time: 25, clk: 1, in: 1, q: 5 },
        { time: 30, clk: 0, in: 1, q: 5 },
        { time: 35, clk: 1, in: 1, q: 11 }
      ],

      hints: {
        he: "השתמשו באופרטור השרשור: q <= {q[2:0], in}; כדי לבצע את ההזזה שמאלה במחזור שעון יחיד.",
        en: "Use the concatenation operator: q <= {q[2:0], in}; to implement the left shift in a single clock cycle."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 50: Universal Shift Register
    // --------------------------------------------------------------------------
    {
      id: 50,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "אוגר הזזה אוניברסלי (Universal Shift Register) 🎛️",
      titleEn: "Universal Shift Register",

      explanationHe: `
<h3>1. מהו אוגר הזזה אוניברסלי? 🎛️</h3>
<p>אוגר הזזה אוניברסלי (Universal Shift Register) הוא רכיב המשלב מספר פונקציות תפעוליות במעגל אחד, הנשלטות על ידי אותות בקרה. הרכיב מסוגל לפעול במספר אופנים:</p>
<ul>
  <li><strong>איפוס (Reset)</strong>: איפוס כל דלגלגי האוגר ל-0.</li>
  <li><strong>טעינה מקבילית (Parallel Load)</strong>: טעינת כל הביטים בו-זמנית מכניסה מקבילית רחבה.</li>
  <li><strong>הזזה שמאלה (Shift Left)</strong>: הזזת הביטים לכיוון MSB והכנסת נתון טורי.</li>
  <li><strong>הזזה ימינה (Shift Right)</strong>: הזזת הביטים לכיוון LSB והכנסת נתון טורי (לא נבדק ישירות במעגל זה).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. עקרון קדימויות בחומרה 📐</h3>
<p>במעגלים משולבים, ישנה חשיבות מכרעת לסדר העדיפויות בין פקודות הבקרה. כמעט תמיד, <strong>אות האיפוס (Reset)</strong> הוא בעל העדיפות הגבוהה ביותר, אחריו אות <strong>הטעינה המקבילית (Load)</strong>, ורק בסוף <strong>הזזת הנתונים</strong>.</p>

<p>נממש זאת ב-Verilog באמצעות תנאי <code dir="ltr">if-else</code> מקוננים:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        // עדיפות 1: איפוס
        register_val <= 8'b0;
    end else if (load) begin
        // עדיפות 2: טעינה מקבילית
        register_val <= parallel_data;
    end else begin
        // עדיפות 3: הזזה
        register_val <= {register_val[6:0], serial_in};
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. What is a Universal Shift Register? 🎛️</h3>
<p>A Universal Shift Register combines multiple data operations into a single sequential block. The specific operation is selected using control inputs:</p>
<ul>
  <li><strong>Reset</strong>: Clears the register to all zeros.</li>
  <li><strong>Parallel Load</strong>: Loads all stages of the register simultaneously from a parallel input bus.</li>
  <li><strong>Shift Left</strong>: Shifts data leftward, bringing in a new serial bit at the LSB.</li>
  <li><strong>Shift Right</strong>: Shifts data rightward, bringing in a new serial bit at the MSB (not tested here).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Priority Control Structures 📐</h3>
<p>In digital design, managing control signal priority is critical. Usually, the <strong>Reset</strong> signal has the highest priority, followed by the <strong>Parallel Load</strong> signal, while the <strong>Shift</strong> operations have the lowest priority.</p>

<p>This hierarchy is modeled using nested <code dir="ltr">if-else</code> structures in Verilog:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        // Priority 1: Clear
        register_val <= 8'b0;
    end else if (load) begin
        // Priority 2: Parallel Load
        register_val <= parallel_data;
    end else begin
        // Priority 3: Default shift operation
        register_val <= {register_val[6:0], serial_in};
    end
end</code></pre>
`,

      taskHe: `בנו אוגר הזזה אוניברסלי 4-ביט מופשט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), <code dir="ltr">load</code> (טעינה מקבילית), כניסה טורית <code dir="ltr">in</code> (להזזה שמאלה), כניסת נתונים מקבילית <code dir="ltr">data</code> [3:0], ויציאה <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> פעיל (שווה ל-1), היציאה מאופסת ל-0.
- אחרת, אם <code dir="ltr">load</code> פעיל (שווה ל-1), היציאה נטענת ב-<code dir="ltr">data</code>.
- אחרת, בצעו הזזה שמאלה: <code dir="ltr">q <= {q[2:0], in}</code>.`,
      taskEn: `Build a simplified 4-bit Universal Shift Register in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, parallel <code dir="ltr">load</code>, serial input <code dir="ltr">in</code> (for shift-left), 4-bit input <code dir="ltr">data</code>, and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear <code dir="ltr">q <= 0</code>.
- Else if <code dir="ltr">load</code> is high (1), load <code dir="ltr">data</code> into <code dir="ltr">q</code>.
- Otherwise, shift left: <code dir="ltr">q <= {q[2:0], in}</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input load,
    input in,
    input [3:0] data,
    output reg [3:0] q
);
    // כתבו את לוגיקת אוגר ההזזה האוניברסלי כאן / Write your Universal Shift Register here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input load,
    input in,
    input [3:0] data,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'b0;
        end else if (load) begin
            q <= data;
        end else begin
            q <= {q[2:0], in};
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, load: 0, data: 11, in: 1, q: 0 },
        { time: 5, clk: 1, reset: 1, load: 0, data: 11, in: 1, q: 0 },
        { time: 10, clk: 0, reset: 0, load: 1, data: 11, in: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, load: 1, data: 11, in: 1, q: 11 },
        { time: 20, clk: 0, reset: 0, load: 0, data: 11, in: 0, q: 11 },
        { time: 25, clk: 1, reset: 0, load: 0, data: 11, in: 0, q: 6 },
        { time: 30, clk: 0, reset: 0, load: 0, data: 11, in: 1, q: 6 },
        { time: 35, clk: 1, reset: 0, load: 0, data: 11, in: 1, q: 13 }
      ],

      hints: {
        he: "השתמשו במבנה תנאים בעל עדיפות: בדקו קודם reset, אחר כך load, ובסוף בצעו את השרשור להזזה שמאלה.",
        en: "Use a priority if-else block: evaluate reset first, then load, and fall back to the shift-left concatenation."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 51: Ring Counter
    // --------------------------------------------------------------------------
    {
      id: 51,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה טבעת (Ring Counter) ⭕",
      titleEn: "Ring Counter",

      explanationHe: `
<h3>1. מהו מונה טבעת (Ring Counter)? ⭕</h3>
<p>מונה טבעת הוא אוגר הזזה מעגלי שבו המוצא של הדרגה האחרונה מחובר בחזרה ככניסה לדרגה הראשונה. כתוצאה מכך, הביטים "מסתובבים" בטבעת אינסופית.</p>

<p>במונה טבעת סטנדרטי, ביט בודד אחד שווה ל-1, וכל שאר הביטים שווים ל-0. ביט ה-1 נע במעגליות:</p>
<pre dir="ltr"><code>1000 ➡️ 0100 ➡️ 0010 ➡️ 0001 ➡️ 1000 ...</code></pre>

<p>תכונות מפתח של מונה טבעת:</p>
<ul>
  <li><strong>מספר מצבים</strong>: עבור אוגר בעל N ביטים, ישנם N מצבים בלבד (לעומת $2^N$ במונה בינארי רגיל).</li>
  <li><strong>ללא פענוח (No Decoding)</strong>: היתרון המרכזי הוא שכל מצב מייצג ישירות יציאה נקייה (למשל, לזיהוי שלבים במכונת מצבים חומרתית) מבלי צורך בשערי לוגיקה נוספים לפענוח.</li>
  <li><strong>אתחול (Initialization)</strong>: המונה אינו מאתחל את עצמו לבד. אם הוא יתחיל ב-0000, הוא יישאר ב-0000 לנצח. לכן, יש להכניס ביט 1 בעת איפוס (בדרך כלל מתחילים ב-1 LSB או 1 MSB).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. משוב מעגלי ב-Verilog 📐</h3>
<p>נחבר את המוצא האחרון בחזרה להתחלה בעזרת שרשור:</p>
<pre dir="ltr"><code>// חיבור המוצא העליון (MSB) בחזרה לכניסה (LSB) בזמן הזזה שמאלה
ring_reg <= {ring_reg[2:0], ring_reg[3]};</code></pre>
`,

      explanationEn: `
<h3>1. What is a Ring Counter? ⭕</h3>
<p>A Ring Counter is a circular shift register where the output of the final stage is fed back into the input of the first stage, creating a continuous loop of shifting bits.</p>

<p>Typically, a ring counter is initialized with a single '1' bit, which circulates endlessly:</p>
<pre dir="ltr"><code>1000 ➡️ 0100 ➡️ 0010 ➡️ 0001 ➡️ 1000 ...</code></pre>

<p>Key properties of a Ring Counter:</p>
<ul>
  <li><strong>Number of States</strong>: An N-bit ring counter has exactly N unique states (unlike a binary counter which has $2^N$ states).</li>
  <li><strong>No Decoding Logic Needed</strong>: Since only one flip-flop is high at a time, each stage directly indicates a active step without requiring complex combinational decoders.</li>
  <li><strong>Initialization Constraint</strong>: If initialized to all zeros, the counter will remain stuck in 0000. It must be initialized to a valid state (e.g. 1000 or 0001) during reset.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Circular Feedback in Verilog 📐</h3>
<p>To wire the loop back, we place the MSB at the LSB position of the concatenation block:</p>
<pre dir="ltr"><code>// Connect the MSB (stage 3) back to LSB (stage 0) while shifting left
ring_reg <= {ring_reg[2:0], ring_reg[3]};</code></pre>
`,

      taskHe: `בנו מונה טבעת (Ring Counter) של 4 ביט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code> ו-<code dir="ltr">reset</code> (איפוס סינכרוני ל-4'b0001), ויציאה מקבילית <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> פעיל (שווה ל-1), היציאה מאותחלת ל-<code dir="ltr">4'b0001</code> (הביט הפעיל היחיד).
- אחרת, הזיזו את האוגר שמאלה בצורה מעגלית: <code dir="ltr">q <= {q[2:0], q[3]}</code>.`,
      taskEn: `Design a 4-bit Ring Counter in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code> (initializes to 4'b0001), and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), initialize <code dir="ltr">q <= 4'b0001</code>.
- Otherwise, shift the bits circularly to the left: <code dir="ltr">q <= {q[2:0], q[3]}</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);
    // כתבו את לוגיקת מונה הטבעת כאן / Write your Ring Counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'b0001;
        end else begin
            q <= {q[2:0], q[3]};
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, q: 1 },
        { time: 5, clk: 1, reset: 1, q: 1 },
        { time: 10, clk: 0, reset: 0, q: 1 },
        { time: 15, clk: 1, reset: 0, q: 2 },
        { time: 20, clk: 0, reset: 0, q: 2 },
        { time: 25, clk: 1, reset: 0, q: 4 },
        { time: 30, clk: 0, reset: 0, q: 4 },
        { time: 35, clk: 1, reset: 0, q: 8 },
        { time: 40, clk: 0, reset: 0, q: 8 },
        { time: 45, clk: 1, reset: 0, q: 1 }
      ],

      hints: {
        he: "בעת איפוס, אתחלו ל-4'b0001 כדי שיהיה ביט 1 שיסתובב במעגל: if (reset) q <= 4'b0001; else q <= {q[2:0], q[3]};",
        en: "On reset, initialize to 4'b0001 so a '1' bit circulates: if (reset) q <= 4'b0001; else q <= {q[2:0], q[3]};"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 52: Johnson Counter
    // --------------------------------------------------------------------------
    {
      id: 52,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה ג'ונסון (Johnson Counter) 🌀",
      titleEn: "Johnson Counter",

      explanationHe: `
<h3>1. מהו מונה ג'ונסון (Johnson Counter)? 🌀</h3>
<p>מונה ג'ונסון (הידוע גם כ-Switch-Tail Ring Counter) הוא וריאציה של מונה טבעת, שבו היציאה של הדרגה האחרונה **מיופכת (Inverted)** לפני שהיא מוחזרת כמשוב לכניסה הראשונה.</p>

<p>המשוב ההפוך מייצר סדרת מצבים ארוכה יותר ומעניינת:</p>
<pre dir="ltr"><code>0000 ➡️ 1000 ➡️ 1100 ➡️ 1110 ➡️ 1111 ➡️ 0111 ➡️ 0011 ➡️ 0001 ➡️ 0000 ...</code></pre>

<p>תכונות מפתח של מונה ג'ונסון:</p>
<ul>
  <li><strong>מספר מצבים</strong>: עבור אוגר בעל N ביטים, ישנם $2N$ מצבים ייחודיים (פי 2 ממונה טבעת רגיל).</li>
  <li><strong>משוב קל</strong>: דורש רק שער מהפך בודד (או שימוש במוצא המשלים $\bar{Q}$ של הדלגלג האחרון) וללא צורך במפענחים מורכבים.</li>
  <li><strong>פענוח ללא רעשים (Glitch-Free Decoding)</strong>: רק ביט אחד משתנה בכל מעבר מצב (בדומה לקוד גילוי שגיאות Gray Code), מה שמונע רעשי מעבר בלוגיקת הפענוח.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש משוב מהופך ב-Verilog 📐</h3>
<p>משרשרים את ההיפוך הלוגי (<code dir="ltr">~</code>) של הביט העליון בחזרה לכניסה:</p>
<pre dir="ltr"><code>// הזזה שמאלה והזנת היפוך ה-MSB אל ה-LSB
johnson_reg <= {johnson_reg[2:0], ~johnson_reg[3]};</code></pre>
`,

      explanationEn: `
<h3>1. What is a Johnson Counter? 🌀</h3>
<p>A Johnson Counter (also known as a Switch-Tail Ring Counter) is a variation of the Ring Counter where the output of the final stage is **inverted** before being fed back to the first stage.</p>

<p>This inverted feedback produces a unique sequence of states:</p>
<pre dir="ltr"><code>0000 ➡️ 1000 ➡️ 1100 ➡️ 1110 ➡️ 1111 ➡️ 0111 ➡️ 0011 ➡️ 0001 ➡️ 0000 ...</code></pre>

<p>Key properties of a Johnson Counter:</p>
<ul>
  <li><strong>Number of States</strong>: An N-bit Johnson counter has $2N$ unique states (double that of a standard ring counter).</li>
  <li><strong>Simple Feedback</strong>: Only requires an inverter (or using the complementary $\bar{Q}$ output of the final flip-flop) without complex logic.</li>
  <li><strong>Glitch-Free Decoding</strong>: Only a single bit changes state during any transition (similar to a Gray Code). This prevents transition spikes (glitches) in downstream decoder gates.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Inverted Feedback Syntax in Verilog 📐</h3>
<p>Apply the bitwise NOT operator (<code dir="ltr">~</code>) to the MSB before concatenation:</p>
<pre dir="ltr"><code>// Shift left and feedback the inverted MSB into the LSB
johnson_reg <= {johnson_reg[2:0], ~johnson_reg[3]};</code></pre>
`,

      taskHe: `בנו מונה ג'ונסון (Johnson Counter) של 4 ביט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), כניסה טורית עזר <code dir="ltr">in</code> (לצורך בדיקת סימולציה), ויציאה מקבילית <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> פעיל, אפסו את האוגר ל-0.
- אחרת, הזיזו שמאלה והזינו את היפוך הביט האחרון (<code dir="ltr">~q[3]</code>) כביט הראשון: <code dir="ltr">q <= {q[2:0], ~q[3]}</code>.`,
      taskEn: `Build a 4-bit Johnson Counter in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, dummy input <code dir="ltr">in</code> (used for simulation routing), and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the output <code dir="ltr">q <= 0</code>.
- Otherwise, shift left and feed back the inverted MSB: <code dir="ltr">q <= {q[2:0], ~q[3]}</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg [3:0] q
);
    // כתבו את לוגיקת מונה ג'ונסון כאן / Write your Johnson Counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input in,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'b0000;
        end else begin
            q <= {q[2:0], ~q[3]};
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, in: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, in: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, in: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, in: 1, q: 1 },
        { time: 20, clk: 0, reset: 0, in: 1, q: 1 },
        { time: 25, clk: 1, reset: 0, in: 1, q: 3 },
        { time: 30, clk: 0, reset: 0, in: 1, q: 3 },
        { time: 35, clk: 1, reset: 0, in: 1, q: 7 },
        { time: 40, clk: 0, reset: 0, in: 1, q: 7 },
        { time: 45, clk: 1, reset: 0, in: 1, q: 15 },
        { time: 50, clk: 0, reset: 0, in: 0, q: 15 },
        { time: 55, clk: 1, reset: 0, in: 0, q: 14 },
        { time: 60, clk: 0, reset: 0, in: 0, q: 14 },
        { time: 65, clk: 1, reset: 0, in: 0, q: 12 },
        { time: 70, clk: 0, reset: 0, in: 0, q: 12 },
        { time: 75, clk: 1, reset: 0, in: 0, q: 8 },
        { time: 80, clk: 0, reset: 0, in: 0, q: 8 },
        { time: 85, clk: 1, reset: 0, in: 0, q: 0 }
      ],

      hints: {
        he: "השתמשו באופרטור ~ כדי להפוך את הביט הקיצוני: q <= {q[2:0], ~q[3]}.",
        en: "Use the ~ operator to invert the MSB bit during feedback: q <= {q[2:0], ~q[3]}."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 53: Binary Up Counter
    // --------------------------------------------------------------------------
    {
      id: 53,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה בינארי מעלה (Binary Up Counter) ⬆️",
      titleEn: "Binary Up Counter",

      explanationHe: `
<h3>1. מהו מונה בינארי סינכרוני? ⬆️</h3>
<p>מונה בינארי הוא אוגר המשתמש במעגל אריתמטי כדי להוסיף 1 לערכו הנוכחי בכל מחזור שעון. המונח <strong>סינכרוני (Synchronous)</strong> פירושו שכל דלגלגי המונה משנים את מצבם בדיוק באותה עליית שעון, מה שמבטיח פעולה מהירה ללא השהיות מצטברות.</p>

<p>במונה 4-ביט, ערך הספירה נע בין $0$ ל-$15$ (בבסיס 10). כאשר המונה מגיע ל-15 (או <code dir="ltr">4'b1111</code>) ומקבל פולס שעון נוסף, הוא חוזר אוטומטית ל-0 (גלישה - Overflow) וממשיך לספור מחדש.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש מונים ב-Verilog 📐</h3>
<p>ב-Verilog, מונים ממומשים בצורה קלה מאוד בעזרת אופרטור החיבור הבינארי (<code dir="ltr">+</code>) בתוך בלוק שעון. לדוגמה, מונה 8-ביט סינכרוני פשוט:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_reg <= 8'd0;
    end else begin
        counter_reg <= counter_reg + 1;
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. What is a Synchronous Binary Counter? ⬆️</h3>
<p>A binary counter is a register containing combinational adder logic to increment its stored value by 1 on every clock tick. In a <strong>Synchronous Counter</strong>, all flip-flops share the same clock line and transition simultaneously, preventing accumulated delays.</p>

<p>A 4-bit counter cycles through decimal values $0$ to $15$. When it reaches its maximum limit of $15$ (<code dir="ltr">4'b1111</code>) and receives another clock pulse, it wraps around to $0$ (Overflow) and continues counting.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Counter Implementation in Verilog 📐</h3>
<p>Counters are coded in Verilog by combining sequential registers with the arithmetic add operator (<code dir="ltr">+</code>). Below is a standard 8-bit synchronous counter:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_reg <= 8'd0;
    end else begin
        counter_reg <= counter_reg + 1;
    end
end</code></pre>
`,

      taskHe: `בנו מונה בינארי מעלה של 4 ביט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), ויציאה מקבילית <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> שווה ל-1, יש לאפס את המונה ל-0.
- אחרת, המונה מתקדם ב-1 בכל מחזור שעון: <code dir="ltr">q <= q + 1</code>.`,
      taskEn: `Build a 4-bit Binary Up Counter in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the counter <code dir="ltr">q <= 0</code>.
- Otherwise, increment the counter by 1 on every cycle: <code dir="ltr">q <= q + 1</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);
    // כתבו את לוגיקת המונה מעלה כאן / Write your up counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'd0;
        end else begin
            q <= q + 1;
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
        { time: 35, clk: 1, reset: 0, q: 3 }
      ],

      hints: {
        he: "השתמשו באופרטור הקידום הפשוט: q <= q + 1; בתוך תנאי ה-else.",
        en: "Use the standard increment operator: q <= q + 1; inside the else branch."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 54: Binary Down Counter
    // --------------------------------------------------------------------------
    {
      id: 54,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה בינארי מטה (Binary Down Counter) ⬇️",
      titleEn: "Binary Down Counter",

      explanationHe: `
<h3>1. מהו מונה מטה (Down Counter)? ⬇️</h3>
<p>מונה מטה הוא מעגל רציף המחסיר 1 מערכו הנוכחי בכל מחזור שעון. הוא סופר בסדר הפוך, לדוגמה מ-15 מטה עד ל-0.</p>

<p>תכונות מפתח של מונה מטה:</p>
<ul>
  <li><strong>חריגת מטה (Underflow)</strong>: כאשר מונה 4-ביט נמצא במצב $0$ (<code dir="ltr">4'b0000</code>) ומקבל פולס שעון נוסף, הוא גולש למעלה אל ערכו המקסימלי $15$ (<code dir="ltr">4'b1111</code>) וממשיך לרדת משם.</li>
  <li><strong>שימוש נפוץ</strong>: מונים מטה משמשים רבות בטיימרים לספירה לאחור (Countdowns), קוצבי זמן חומרתיים ומערכות פיקוח על זמנים (Watchdog Timers).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש ב-Verilog 📐</h3>
<p>לביצוע חיסור, נשתמש באופרטור החיסור האריתמטי (<code dir="ltr">-</code>):</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_reg <= 8'd0;
    end else begin
        counter_reg <= counter_reg - 1;
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. What is a Down Counter? ⬇️</h3>
<p>A down counter is a sequential block that decrements its state by 1 on every clock edge, counting backward (e.g. from 15 down to 0).</p>

<p>Key behaviors of a Down Counter:</p>
<ul>
  <li><strong>Underflow Wrap-Around</strong>: When a 4-bit down counter reaches 0 (<code dir="ltr">4'b0000</code>) and receives another clock tick, it rolls back up to its maximum value 15 (<code dir="ltr">4'b1111</code>).</li>
  <li><strong>Real-World Applications</strong>: Down counters are widely used in hardware timers, countdown watchdogs, and systems measuring progress toward a threshold.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Decrementing Syntax in Verilog 📐</h3>
<p>Subtracting values in Verilog uses the subtraction operator (<code dir="ltr">-</code>):</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_reg <= 8'd0;
    end else begin
        counter_reg <= counter_reg - 1;
    end
end</code></pre>
`,

      taskHe: `בנו מונה בינארי מטה של 4 ביט במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), כניסת עזר <code dir="ltr">in</code> [3:0] (לסיוע בסימולציה), ויציאה מקבילית <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> שווה ל-1, יש לאפס את המונה ל-0.
- אחרת, הפחיתו מהמונה: <code dir="ltr">q <= q - 1</code>.`,
      taskEn: `Design a 4-bit Binary Down Counter in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, dummy input <code dir="ltr">in</code> [3:0] (used for simulator routing), and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the counter <code dir="ltr">q <= 0</code>.
- Otherwise, decrement the counter: <code dir="ltr">q <= q - 1</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input [3:0] in,
    output reg [3:0] q
);
    // כתבו את לוגיקת המונה מטה כאן / Write your down counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input [3:0] in,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'd0;
        end else begin
            q <= q - 1;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, in: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, in: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, in: 15, q: 0 },
        { time: 15, clk: 1, reset: 0, in: 15, q: 15 },
        { time: 20, clk: 0, reset: 0, in: 14, q: 15 },
        { time: 25, clk: 1, reset: 0, in: 14, q: 14 },
        { time: 30, clk: 0, reset: 0, in: 13, q: 14 },
        { time: 35, clk: 1, reset: 0, in: 13, q: 13 }
      ],

      hints: {
        he: "השתמשו באופרטור החיסור q <= q - 1; לביצוע ספירה לאחור.",
        en: "Use the subtraction operator q <= q - 1; to implement countdown behavior."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 55: Up/Down Counter
    // --------------------------------------------------------------------------
    {
      id: 55,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה מעלה/מטה (Up/Down Counter) ↕️",
      titleEn: "Up/Down Counter",

      explanationHe: `
<h3>1. בקרת כיוון ספירה דינמית ↕️</h3>
<p>מונה מעלה/מטה (Up/Down Counter) משלב את שתי פונקציות הספירה (חיבור וחיסור) במודול אחד. כיוון הספירה נשלט בזמן אמת על ידי אות כניסה ייעודי, שלרוב נקרא <code dir="ltr">up_down</code> או <code dir="ltr">mode</code>.</p>

<p>בחומרה פיזית, הדבר מבוצע על ידי מרבב שמנתב את המצב הבא של המונה דרך מעגל מחבר (Adder) או מעגל מחסיר (Subtractor) בהתאם לאות הבקרה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש סלקטיבי ב-Verilog 📐</h3>
<p>בתוך בלוק שעון, משתמשים בתנאי <code dir="ltr">if-else</code> לבדיקת כיוון הספירה הדרוש:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_val <= 8'd0;
    end else if (count_up_signal) begin
        counter_val <= counter_val + 8'd1;
    end else begin
        counter_val <= counter_val - 8'd1;
    end
end</code></pre>

<p><strong>הערה לגבי סימולציה:</strong> במשימה זו נשתמש בכתיבה מפורשת של <code dir="ltr">4'd1</code> (במקום <code dir="ltr">1</code>) כדי להבטיח מעבר תקין של מנוע הבדיקה המקומי.</p>
`,

      explanationEn: `
<h3>1. Dynamic Counting Direction Control ↕️</h3>
<p>An Up/Down Counter combines both incrementing and decrementing capabilities in a single module. The counting direction is controlled dynamically in real time using an input signal, typically called <code dir="ltr">up_down</code> or <code dir="ltr">mode</code>.</p>

<p>In physical hardware, this is built using a steering multiplexer that routes the next state register either through an adder cell or a subtractor cell based on the control input.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Selective Directives in Verilog 📐</h3>
<p>Inside a clocked procedural block, we check the control signal using <code dir="ltr">if-else</code> branches to choose the correct arithmetic update:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        counter_val <= 8'd0;
    end else if (count_up_signal) begin
        counter_val <= counter_val + 8'd1;
    end else begin
        counter_val <= counter_val - 8'd1;
    end
end</code></pre>

<p><strong>Simulation Compatibility Note:</strong> For this exercise, please write out <code dir="ltr">4'd1</code> explicitly (instead of simply <code dir="ltr">1</code>) to ensure correct evaluation in the client-side simulator.</p>
`,

      taskHe: `בנו מונה 4-ביט מעלה/מטה במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), <code dir="ltr">up_down</code> (בקר כיוון: 1 לספירה מעלה, 0 לספירה מטה), כניסת עזר <code dir="ltr">in</code> [3:0], ויציאה <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> שווה ל-1, יש לאפס את המונה ל-0.
- אחרת, אם <code dir="ltr">up_down</code> שווה ל-1, קדמו את המונה: <code dir="ltr">q <= q + 4'd1</code>.
- אחרת, הפחיתו מהמונה: <code dir="ltr">q <= q - 4'd1</code>.`,
      taskEn: `Build a 4-bit Up/Down Counter in <code dir="ltr">top_module</code> with clock <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, direction control <code dir="ltr">up_down</code> (1 for increment, 0 for decrement), dummy input <code dir="ltr">in</code> [3:0], and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the counter <code dir="ltr">q <= 0</code>.
- Else if <code dir="ltr">up_down</code> is high (1), increment the counter: <code dir="ltr">q <= q + 4'd1</code>.
- Otherwise, decrement the counter: <code dir="ltr">q <= q - 4'd1</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input up_down,
    input [3:0] in,
    output reg [3:0] q
);
    // כתבו את לוגיקת המונה מעלה/מטה כאן / Write your up/down counter here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input up_down,
    input [3:0] in,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'd0;
        end else if (up_down) begin
            q <= q + 4'd1;
        end else begin
            q <= q - 4'd1;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, up_down: 1, in: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, up_down: 1, in: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, up_down: 1, in: 1, q: 0 },
        { time: 15, clk: 1, reset: 0, up_down: 1, in: 1, q: 1 },
        { time: 20, clk: 0, reset: 0, up_down: 1, in: 2, q: 1 },
        { time: 25, clk: 1, reset: 0, up_down: 1, in: 2, q: 2 },
        { time: 30, clk: 0, reset: 0, up_down: 0, in: 1, q: 2 },
        { time: 35, clk: 1, reset: 0, up_down: 0, in: 1, q: 1 },
        { time: 40, clk: 0, reset: 0, up_down: 0, in: 0, q: 1 },
        { time: 45, clk: 1, reset: 0, up_down: 0, in: 0, q: 0 }
      ],

      hints: {
        he: "השתמשו בתנאי if (up_down) כדי לבחור בין q <= q + 4'd1 לבין q <= q - 4'd1. ודאו שהוספתם את הפורט 'in' להצהרת המודול בדיוק כפי שמופיע בקוד ההתחלתי.",
        en: "Use an if (up_down) branch to select between q <= q + 4'd1 and q <= q - 4'd1. Ensure the dummy input 'in' is declared exactly as provided in the starter code."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 56: Loadable BCD Counter
    // --------------------------------------------------------------------------
    {
      id: 56,
      chapter: 7,
      chapterTitleHe: "פרק 7: אוגרים ומונים",
      chapterTitleEn: "Chapter 7: Registers & Counters",
      titleHe: "מונה BCD עם טעינה (Loadable BCD Counter) 🔢",
      titleEn: "Loadable BCD Counter",

      explanationHe: `
<h3>1. מונה עשרוני בינארי (Binary Coded Decimal Counter) 🔢</h3>
<p>מונה BCD (הידוע גם כ-Decade Counter או מונה עשור) סופר בבסיס עשרוני ($0$ עד $9$). היות והמצב המקסימלי הוא 9 (<code dir="ltr">4'b1001</code>), בעליית השעון הבאה המונה אינו מגיע ל-10, אלא <strong>מתאפס חזרה ל-0</strong>.</p>

<p>בנוסף, מונה BCD בעל <strong>טעינה מקבילית (Parallel Load)</strong> מאפשר לטעון לתוכו ערך התחלתי מבוקש בין 0 ל-9, ולאחר מכן להמשיך לספור ממנו הלאה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. היררכיית התנאים במעגל 📐</h3>
<p>סדר העדיפויות בין פעולות המונה צריך להיות מוגדר בקפידה:</p>
<ol>
  <li><strong>איפוס (Reset)</strong>: עדיפות עליונה. מאפס את המונה ל-0.</li>
  <li><strong>טעינה (Load)</strong>: עדיפות שנייה. טוען את ערך הנתון.</li>
  <li><strong>ספירה וגלישה (Count & Wrap)</strong>: עדיפות תחתונה. בודק אם הגענו ל-9, ומאפס או מקדם בהתאם.</li>
</ol>

<p>נממש סכמה זו ב-Verilog:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        bcd_reg <= 4'd0;
    end else if (load) begin
        bcd_reg <= load_data;
    end else begin
        if (bcd_reg == 4'd9) begin
            bcd_reg <= 4'd0; // wrap-around
        end else begin
            bcd_reg <= bcd_reg + 4'd1; // increment
        end
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. What is a Binary Coded Decimal (BCD) Counter? 🔢</h3>
<p>A BCD Counter (also called a Decade Counter) counts in decimal ($0$ to $9$). Since the highest digit represented is 9 (<code dir="ltr">4'b1001</code>), the next clock pulse resets the counter back to $0$ instead of proceeding to 10.</p>

<p>Furthermore, a <strong>Loadable BCD Counter</strong> features a parallel loading function, allowing the system to preset the counter to any decimal value between 0 and 9, and resume counting from there.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Priority Architecture 📐</h3>
<p>Control signal hierarchy must be evaluated as follows:</p>
<ol>
  <li><strong>Reset</strong>: Top priority. Forces count to 0.</li>
  <li><strong>Load</strong>: Second priority. Loads preset data into the register.</li>
  <li><strong>Count and Wrap</strong>: Default behavior. If count is 9, wrap around to 0. Otherwise, increment.</li>
</ol>

<p>This is modeled inside a clocked block in Verilog:</p>
<pre dir="ltr"><code>always @(posedge clk) begin
    if (reset) begin
        bcd_reg <= 4'd0;
    end else if (load) begin
        bcd_reg <= load_data;
    end else begin
        if (bcd_reg == 4'd9) begin
            bcd_reg <= 4'd0; // wrap-around
        end else begin
            bcd_reg <= bcd_reg + 4'd1; // increment
        end
    end
end</code></pre>
`,

      taskHe: `בנו מונה BCD (עשרוני) של 4 ביט בעל טעינה מקבילית במודול <code dir="ltr">top_module</code>. המודול כולל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני ל-0), <code dir="ltr">load</code> (טעינה), כניסת נתונים <code dir="ltr">data</code> [3:0], כניסת עזר <code dir="ltr">in</code> [3:0], ויציאה <code dir="ltr">q</code> [3:0].
בעליית השעון:
- אם <code dir="ltr">reset</code> פעיל (שווה ל-1), יש לאפס את היציאה <code dir="ltr">q <= 0</code>.
- אחרת, אם <code dir="ltr">load</code> פעיל (שווה ל-1), יש לטעון את <code dir="ltr">data</code> לתוך <code dir="ltr">q</code>.
- אחרת, אם המונה שווה ל-9 (<code dir="ltr">q == 4'd9</code>), יש לאפס אותו חזרה ל-0.
- אחרת, יש לקדם את המונה ב-1: <code dir="ltr">q <= q + 4'd1</code>.`,
      taskEn: `Design a 4-bit Loadable BCD (Decade) Counter in <code dir="ltr">top_module</code>. The module contains inputs <code dir="ltr">clk</code>, synchronous <code dir="ltr">reset</code>, <code dir="ltr">load</code>, 4-bit input <code dir="ltr">data</code>, dummy input <code dir="ltr">in</code> [3:0], and 4-bit output <code dir="ltr">q</code>.
On the rising clock edge:
- If <code dir="ltr">reset</code> is high (1), clear the output <code dir="ltr">q <= 0</code>.
- Else if <code dir="ltr">load</code> is high (1), load <code dir="ltr">data</code> into <code dir="ltr">q</code>.
- Else if the counter equals 9 (<code dir="ltr">q == 4'd9</code>), wrap around to 0.
- Otherwise, increment the counter: <code dir="ltr">q <= q + 4'd1</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input load,
    input [3:0] data,
    input [3:0] in,
    output reg [3:0] q
);
    // כתבו את לוגיקת המונה כאן / Write your BCD Counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input load,
    input [3:0] data,
    input [3:0] in,
    output reg [3:0] q
);
    always @(posedge clk) begin
        if (reset) begin
            q <= 4'd0;
        end else if (load) begin
            q <= data;
        end else begin
            if (q == 4'd9) begin
                q <= 4'd0;
            end else begin
                q <= q + 4'd1;
            end
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, load: 0, data: 5, in: 0, q: 0 },
        { time: 5, clk: 1, reset: 1, load: 0, data: 5, in: 0, q: 0 },
        { time: 10, clk: 0, reset: 0, load: 1, data: 8, in: 0, q: 0 },
        { time: 15, clk: 1, reset: 0, load: 1, data: 8, in: 0, q: 8 },
        { time: 20, clk: 0, reset: 0, load: 0, data: 8, in: 9, q: 8 },
        { time: 25, clk: 1, reset: 0, load: 0, data: 8, in: 9, q: 9 },
        { time: 30, clk: 0, reset: 0, load: 0, data: 8, in: 0, q: 9 },
        { time: 35, clk: 1, reset: 0, load: 0, data: 8, in: 0, q: 0 },
        { time: 40, clk: 0, reset: 0, load: 0, data: 8, in: 1, q: 0 },
        { time: 45, clk: 1, reset: 0, load: 0, data: 8, in: 1, q: 1 }
      ],

      hints: {
        he: "ממשו מבנה תנאים מקונן. בדקו if (reset) תחילה, אז else if (load), ובתוך ה-else בדקו if (q == 4'd9) q <= 0; else q <= q + 4'd1;",
        en: "Implement a nested if-else structure. Evaluate reset first, then load. In the default else branch, check if (q == 4'd9) q <= 0; else q <= q + 4'd1;"
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter7Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter7Lessons);
  }
})();
