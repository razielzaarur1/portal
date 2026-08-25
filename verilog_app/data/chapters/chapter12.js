/* ==========================================================================
   VeriLearn Curriculum — Chapter 12: Advanced Communication Protocols (Lessons 87 to 92)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 87: PWM (Pulse Width Modulation) Controller
    // --------------------------------------------------------------------------
    {
      id: 87,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "בקר אפנון רוחב פולס (PWM) 🎛️",
      titleEn: "PWM (Pulse Width Modulation) Controller",

      explanationHe: `
<h3>1. מהו אפנון רוחב פולס (PWM)? 🎛️</h3>
<p><strong>אפנון רוחב פולס (PWM - Pulse Width Modulation)</strong> היא טכניקה נפוצה ביותר לשינוי ההספק הממוצע הנמסר לעומס חשמלי (כמו נורת LED או מנוע DC) באמצעות אות דיגיטלי בינארי מהיר. במקום לשנות את רמת המתח האנלוגי (דבר המצריך מעגל מורכב ויקר), אנו מדליקים ומכבים את האות הדיגיטלי בתדר גבוה מאוד.</p>

<p>היחס בין זמן ההדלקה (High State) לבין זמן המחזור הכולל של האות נקרא <strong>מחזור פעילות (Duty Cycle)</strong>, והוא מבוטא באחוזים:</p>
<div dir="ltr" style="text-align: center; font-weight: bold; margin: 1rem 0; font-family: var(--font-family-mono);">
    Duty Cycle (%) = (T_on / T_period) * 100%
</div>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>מחזור פעילות (Duty)</th><th>מתח ממוצע (עבור 3.3V)</th><th>התנהגות עומס (למשל מנורה)</th></tr>
  </thead>
  <tbody>
    <tr><td>0%</td><td>0V</td><td>כבויה לחלוטין</td></tr>
    <tr><td>25%</td><td>0.825V</td><td>עוצמה חלשה מאוד</td></tr>
    <tr><td>50%</td><td>1.65V</td><td>חצי עוצמה</td></tr>
    <tr><td>100%</td><td>3.3V</td><td>עוצמה מלאה</td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארכיטקטורת החומרה של בקר PWM 📐</h3>
<p>בקר PWM דיגיטלי בסיסי מורכב משני רכיבים עיקריים:</p>
<ol>
  <li><strong>מונה (Counter)</strong>: מונה מחזורי (למשל 8 ביטים) שרץ ברציפות מ-0 ועד לערך המקסימלי שלו (255) וחוזר חלילה.</li>
  <li><strong>משווה (Comparator)</strong>: מעגל המשווה את ערך המונה הנוכחי לערך הסף המבוקש (Duty). אם ערך המונה קטן מ-Duty, יציאת ה-PWM תהיה 1. אנו מעבירים את היציאה דרך אוגר למניעת רעשים.</li>
</ol>
`,

      explanationEn: `
<h3>1. What is Pulse Width Modulation (PWM)? 🎛️</h3>
<p><strong>Pulse Width Modulation (PWM)</strong> is a powerful technique used to control the average power delivered to an analog load (such as an LED or a DC motor) using a binary digital signal. Instead of varying analog voltage directly, we toggle a digital output between high (1) and low (0) levels at a very high frequency.</p>

<p>The proportion of time the signal remains high relative to its total period is called the <strong>Duty Cycle</strong>, expressed as a percentage:</p>
<div dir="ltr" style="text-align: center; font-weight: bold; margin: 1rem 0; font-family: var(--font-family-mono);">
    Duty Cycle (%) = (T_on / T_period) * 100%
</div>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; text-align: center;" border="1">
  <thead style="background: var(--bg-tertiary);">
    <tr><th>Duty Cycle</th><th>Average Voltage (For 3.3V System)</th><th>Load Output Effect (e.g., LED)</th></tr>
  </thead>
  <tbody>
    <tr><td>0%</td><td>0V</td><td>Completely Off</td></tr>
    <tr><td>25%</td><td>0.825V</td><td>Dim Output</td></tr>
    <tr><td>50%</td><td>1.65V</td><td>Medium Output</td></tr>
    <tr><td>100%</td><td>3.3V</td><td>Maximum Output</td></tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. PWM Controller Hardware Design 📐</h3>
<p>A standard digital PWM generator consists of two key components:</p>
<ol>
  <li><strong>Counter</strong>: A continuous cyclic counter (typically 8-bit or 16-bit) that counts up from 0 to its maximum value and wraps around.</li>
  <li><strong>Comparator</strong>: A comparison block that compares the counter to a predefined threshold (<code dir="ltr">duty</code>). When <code dir="ltr">counter < duty</code>, the output signal is driven high (1), else it goes low (0). We register this output to prevent glitches.</li>
</ol>
`,

      taskHe: `בנו בקר PWM בעל מונה של 8 ביטים במודול <code dir="ltr">top_module</code>.
למודול יש כניסות <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), <code dir="ltr">[7:0] duty</code>, ויציאה <code dir="ltr">output reg pwm_out</code>.
- בעליית שעון או בנפילת איפוס: אם <code dir="ltr">rst_n == 0</code>, אפסו את המונה הפנימי ואת יציאת <code dir="ltr">pwm_out</code> ל-0.
- בכל עליית שעון אחרת: קדמו את המונה ב-1, ועדכנו את <code dir="ltr">pwm_out</code> להיות 1 אם ערך המונה הנוכחי קטן מ-<code dir="ltr">duty</code>, ואחרת 0 (עדכון היציאה צריך להיות רשום באוגר).`,
      taskEn: `Design an 8-bit PWM Controller in <code dir="ltr">top_module</code>.
The module has inputs <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (active-low asynchronous reset), <code dir="ltr">[7:0] duty</code>, and output <code dir="ltr">output reg pwm_out</code>.
- On clock rising edge or reset falling edge: if <code dir="ltr">rst_n == 0</code>, reset both the internal counter and <code dir="ltr">pwm_out</code> to 0.
- On any other rising clock edge: increment the counter by 1, and set <code dir="ltr">pwm_out</code> to 1 if the counter value is strictly less than <code dir="ltr">duty</code>, else set it to 0 (register the output).`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    input [7:0] duty,
    output reg pwm_out
);
    // הגדירו מונה פנימי ברוחב 8 ביטים וכתבו את הלוגיקה כאן
    // Declare an 8-bit internal counter and implement your logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    input [7:0] duty,
    output reg pwm_out
);
    reg [7:0] counter;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            counter <= 8'd0;
            pwm_out <= 1'b0;
        end else begin
            counter <= counter + 1'b1;
            pwm_out <= (counter < duty);
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, duty: 10, pwm_out: 0 },
        { time: 5, clk: 1, rst_n: 0, duty: 10, pwm_out: 0 },
        { time: 10, clk: 0, rst_n: 1, duty: 3, pwm_out: 0 },
        { time: 15, clk: 1, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 20, clk: 0, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 25, clk: 1, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 30, clk: 0, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 35, clk: 1, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 40, clk: 0, rst_n: 1, duty: 3, pwm_out: 1 },
        { time: 45, clk: 1, rst_n: 1, duty: 3, pwm_out: 0 }
      ],

      hints: {
        he: "השתמשו בבלוק always סנכרוני לשעון ואסינכרוני ל-rst_n. בצעו השוואה: pwm_out <= (counter < duty).",
        en: "Use an always block triggered by posedge clk and negedge rst_n. Implement the registered check: pwm_out <= (counter < duty)."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 88: UART Transmitter (Tx)
    // --------------------------------------------------------------------------
    {
      id: 88,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "משדר תקשורת טורית UART Tx 📡",
      titleEn: "UART Transmitter (Tx)",

      explanationHe: `
<h3>1. פרוטוקול UART (תקשורת טורית אסינכרונית) 📡</h3>
<p>פרוטוקול <strong>UART (Universal Asynchronous Receiver-Transmitter)</strong> הוא אחד הפרוטוקולים הוותיקים והפופולריים ביותר לחיבור נקודה-לנקודה בין שבבים (כמו מעבדים, בקרי ארדואינו ומחשבים). ייחודו של הפרוטוקול הוא בכך שהוא <strong>אסינכרוני</strong> - אין קו שעון (Clock) משותף בין המשדר למקלט.</p>

<p>הסנכרון מתבצע על ידי הסכמה מראש על קצב השידור, הנמדד ביחידות של <strong>Baud Rate</strong> (כמות ביטים לשנייה, כגון 9600 או 115200).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מבנה חבילת נתונים (Frame) ב-UART 📦</h3>
<p>כאשר קו השידור פנוי, הוא נמצא במצב לוגי <strong>1 (Idle State)</strong>. כל חבילת נתונים נשלחת במבנה קבוע הבא:</p>
<ol>
  <li><strong>Start Bit</strong>: אות <strong>0</strong> למשך מחזור ביט אחד כדי להתריע למקלט על תחילת שידור.</li>
  <li><strong>Data Bits</strong>: בד"כ 8 ביטים של המידע עצמו, הנשלחים מהביט הפחות משמעותי <strong>(LSB First)</strong> לביט הכי משמעותי (MSB).</li>
  <li><strong>Stop Bit</strong>: אות <strong>1</strong> למשך מחזור ביט אחד (או יותר) לסימון סוף השידור והחזרת הקו למצב פנוי.</li>
</ol>

<div style="text-align: center; margin: 1.2rem 0;">
  <pre dir="ltr" style="display: inline-block; background: var(--bg-tertiary); padding: 0.8rem; border-radius: 4px; font-family: var(--font-family-mono); font-size: 0.85rem; line-height: 1.3;">
Idle (1) ---__ [D0] [D1] [D2] [D3] [D4] [D5] [D6] [D7] --¯¯¯¯¯ Idle (1)
            |                                         |
         Start (0)                                 Stop (1)
  </pre>
</div>
`,

      explanationEn: `
<h3>1. The UART Protocol (Asynchronous Serial Interface) 📡</h3>
<p>The <strong>UART (Universal Asynchronous Receiver-Transmitter)</strong> protocol is a fundamental hardware block for point-to-point communication. It is <strong>asynchronous</strong>, meaning it does not transmit a clock signal alongside the data. Instead, sender and receiver synchronize by agreeing beforehand on a specific baud rate (bits per second, e.g., 9600, 115200).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. UART Frame Structure 📦</h3>
<p>When the serial line is idle, it is held at logic high (1). The transmission frame consists of:</p>
<ol>
  <li><strong>Start Bit</strong>: Toggled to logic 0 for 1 bit period, notifying the receiver that data is coming.</li>
  <li><strong>Data Bits</strong>: Typically 8 bits of payload, serialized and transmitted Least Significant Bit first <strong>(LSB First)</strong>.</li>
  <li><strong>Stop Bit</strong>: Driven to logic 1 for 1 bit period, returning the line to idle.</li>
</ol>
`,

      taskHe: `בנו משדר UART טורי במודול <code dir="ltr">top_module</code>.
למודול כניסות <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), <code dir="ltr">tx_start</code> (דוחף להתחלת שידור), ו-<code dir="ltr">[7:0] tx_data</code>.
יציאות המודול הן <code dir="ltr">tx</code> ו-<code dir="ltr">tx_busy</code>.
דרישות הלוגיקה:
- כאשר איפוס פעיל (<code dir="ltr">rst_n == 0</code>), יציאת ה-<code dir="ltr">tx</code> צריכה להיות 1, ויציאת <code dir="ltr">tx_busy</code> צריכה להיות 0.
- במצב מנוחה (IDLE): היציאות הן <code dir="ltr">tx = 1</code> ו-<code dir="ltr">tx_busy = 0</code>.
- כאשר מגיע אות <code dir="ltr">tx_start == 1</code> במצב מנוחה:
  - במחזור הבא של השעון, העלו את <code dir="ltr">tx_busy = 1</code>, ושדרו את ביט ההתחלה (<code dir="ltr">tx = 0</code>).
  - לאחר מכן, שדרו 8 ביטים מתוך <code dir="ltr">tx_data</code> (החל מ-LSB, ביט 0 עד ביט 7), כל אחד למשך מחזור שעון אחד.
  - לאחר סיום 8 הביטים, שדרו את ביט הסיום (<code dir="ltr">tx = 1</code>) למשך מחזור שעון אחד.
  - לבסוף, החזירו את המערכת למצב מנוחה ואת <code dir="ltr">tx_busy = 0</code>.`,
      taskEn: `Design a UART Transmitter (Tx) in <code dir="ltr">top_module</code>.
The module has inputs <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (active-low asynchronous reset), <code dir="ltr">tx_start</code>, <code dir="ltr">[7:0] tx_data</code>, and outputs <code dir="ltr">tx</code>, <code dir="ltr">tx_busy</code>.
Requirements:
- On reset (<code dir="ltr">rst_n == 0</code>): drive <code dir="ltr">tx = 1</code> and <code dir="ltr">tx_busy = 0</code>.
- In IDLE: output <code dir="ltr">tx = 1</code> and <code dir="ltr">tx_busy = 0</code>.
- When <code dir="ltr">tx_start == 1</code> in IDLE:
  - On the next clock cycle, assert <code dir="ltr">tx_busy = 1</code> and transmit the Start Bit (<code dir="ltr">tx = 0</code>).
  - Transmit the 8 bits of <code dir="ltr">tx_data</code> (LSB first: bit 0 to bit 7), each for exactly 1 clock period.
  - Transmit the Stop Bit (<code dir="ltr">tx = 1</code>) for exactly 1 clock period.
  - Return to IDLE and de-assert <code dir="ltr">tx_busy = 0</code>.`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    input tx_start,
    input [7:0] tx_data,
    output reg tx,
    output reg tx_busy
);
    // הגדירו מצבים למכונת המצבים וכתבו את לוגיקת המשדר
    // Define states and write your UART Tx transmitter FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    input tx_start,
    input [7:0] tx_data,
    output reg tx,
    output reg tx_busy
);
    localparam IDLE  = 2'd0;
    localparam START = 2'd1;
    localparam DATA  = 2'd2;
    localparam STOP  = 2'd3;

    reg [1:0] state;
    reg [2:0] bit_cnt;
    reg [7:0] shift_reg;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= IDLE;
            tx        <= 1'b1;
            tx_busy   <= 1'b0;
            bit_cnt   <= 3'd0;
            shift_reg <= 8'd0;
        end else begin
            case (state)
                IDLE: begin
                    tx      <= 1'b1;
                    tx_busy <= 1'b0;
                    if (tx_start) begin
                        state     <= START;
                        tx        <= 1'b0; // Start bit
                        tx_busy   <= 1'b1;
                        shift_reg <= tx_data;
                        bit_cnt   <= 3'd0;
                    end
                end
                START: begin
                    state     <= DATA;
                    tx        <= shift_reg[0];
                    shift_reg <= {1'b0, shift_reg[7:1]};
                    bit_cnt   <= 3'd0;
                end
                DATA: begin
                    if (bit_cnt == 3'd7) begin
                        state <= STOP;
                        tx    <= 1'b1; // Stop bit
                    end else begin
                        tx        <= shift_reg[0];
                        shift_reg <= {1'b0, shift_reg[7:1]};
                        bit_cnt   <= bit_cnt + 1'b1;
                    end
                end
                STOP: begin
                    state   <= IDLE;
                    tx      <= 1'b1;
                    tx_busy <= 1'b0;
                end
                default: state <= IDLE;
            endcase
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 0 },
        { time: 5, clk: 1, rst_n: 0, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 0 },
        { time: 10, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 0 },
        { time: 15, clk: 1, rst_n: 1, tx_start: 1, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 20, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 25, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 30, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 35, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 40, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 45, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 50, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 55, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 60, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 65, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 70, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 75, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 80, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 85, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 90, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 0, tx_busy: 1 },
        { time: 95, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 100, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 105, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 110, clk: 0, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 1 },
        { time: 115, clk: 1, rst_n: 1, tx_start: 0, tx_data: 165, tx: 1, tx_busy: 0 }
      ],

      hints: {
        he: "השתמשו במכונת מצבים עם 4 מצבים (IDLE, START, DATA, STOP) ואוגר הזזה (shift register) שמוזן בנתונים החדשים.",
        en: "Use an FSM with 4 states (IDLE, START, DATA, STOP) and a shift register that loads tx_data and shifts right."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 89: UART Receiver (Rx)
    // --------------------------------------------------------------------------
    {
      id: 89,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "מקלט תקשורת טורית UART Rx 📥",
      titleEn: "UART Receiver (Rx)",

      explanationHe: `
<h3>1. קליטה אסינכרונית ב-UART 📥</h3>
<p>מקלט UART מתמודד עם אתגר משמעותי: הוא מקבל אות טורי אסינכרוני (<code dir="ltr">rx</code>) ללא שעון מלווה, ועליו לפענח את הביטים במדויק. סנכרון הקליטה נעשה על ידי זיהוי <strong>הקצה היורד (Falling Edge)</strong> של קו ה-<code dir="ltr">rx</code> ממצב 1 למצב 0. ירידה זו מסמנת את תחילתו של ה-<strong>Start Bit</strong>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דגימת אות מרובה וקריאת ביטים במרכז ⏱️</h3>
<p>ברכיבים אמיתיים, מקלט UART דוגם את האות הנכנס בקצב מהיר בהרבה (למשל פי 16 מקצב ה-Baud Rate). הסיבה לכך היא רצון המקלט להמתין בדיוק לחצי מזמן שידור הביט, ואז לדגום את ערך האות. <strong>דגימה במרכז (Center Sampling)</strong> מבטיחה מניעת שגיאות הנגרמות עקב רעש או סטיות קלות בתדרי השעונים של המשדר והמקלט.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. ארכיטקטורת המקלט (Rx) 📐</h3>
<p>מכונת המצבים של המקלט בדרך כלל כוללת:</p>
<ol>
  <li><strong>IDLE</strong>: האזנה לקו. אם <code dir="ltr">rx == 0</code>, עוברים למצב קליטת נתונים.</li>
  <li><strong>DATA</strong>: קריאה סדרתית של 8 ביטים לתוך אוגר הזזה (Shift Register) - מהביט הפחות משמעותי (LSB) לביט הכי משמעותי (MSB).</li>
  <li><strong>STOP</strong>: וידוא קבלת Stop Bit (<code dir="ltr">rx == 1</code>). אם הוא תקין, מעבירים את המידע שנקלט למוצא המערכת ומרימים את הדגל <code dir="ltr">rx_done</code> למחזור שעון אחד.</li>
</ol>
`,

      explanationEn: `
<h3>1. Asynchronous Reception & Bit Synchronization 📥</h3>
<p>A UART Receiver (Rx) listens to an asynchronous input line (<code dir="ltr">rx</code>) without an external clock. To synchronize, the receiver waits for a <strong>falling edge (1 to 0 transition)</strong> on the idle line, which marks the beginning of the Start Bit.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Center Sampling ⏱️</h3>
<p>To reject line noise and tolerate frequency mismatch, receivers wait until the estimated <strong>middle of the bit period (Center Sampling)</strong> before reading the input signal level. In simplified logic simulator scenarios, we assume data changes at the clock boundary and samples are read on the next clock ticks.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Receiver FSM States 📐</h3>
<ul>
  <li><strong>IDLE</strong>: Listens to the line. Transition to DATA when <code dir="ltr">rx == 0</code>.</li>
  <li><strong>DATA</strong>: Shifts in 8 bits Least Significant Bit first (LSB-first) into an internal register.</li>
  <li><strong>STOP</strong>: Verifies that <code dir="ltr">rx == 1</code>. If valid, updates <code dir="ltr">rx_data</code> and asserts a single-cycle <code dir="ltr">rx_done</code> pulse.</li>
</ul>
`,

      taskHe: `בנו מקלט UART טורי במודול <code dir="ltr">top_module</code>.
למודול כניסות <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), ו-<code dir="ltr">rx</code> (אות הכניסה הטורי).
יציאות המודול הן <code dir="ltr">output reg [7:0] rx_data</code> ו-<code dir="ltr">output reg rx_done</code>.
דרישות הלוגיקה:
- באיפוס (<code dir="ltr">rst_n == 0</code>): אפסו את <code dir="ltr">rx_data = 0</code> ו-<code dir="ltr">rx_done = 0</code>.
- במצב IDLE: האות <code dir="ltr">rx_done</code> נשאר 0. כאשר <code dir="ltr">rx == 0</code>, עברו למצב DATA.
- במצב DATA: קלטו 8 ביטים מתוך הקו <code dir="ltr">rx</code> (אחד בכל מחזור שעון) לתוך אוגר הזזה (LSB-first, ביט 0 עד ביט 7).
- במצב STOP: ודאו ש-<code dir="ltr">rx == 1</code>. אם כן, עדכנו את <code dir="ltr">rx_data</code> לערך שנקלט, והעלו את <code dir="ltr">rx_done = 1</code> למחזור שעון אחד, ולאחר מכן החזירו את המערכת למצב IDLE.`,
      taskEn: `Design a UART Receiver (Rx) in <code dir="ltr">top_module</code>.
The module has inputs <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code>, <code dir="ltr">rx</code>, and outputs <code dir="ltr">output reg [7:0] rx_data</code> and <code dir="ltr">output reg rx_done</code>.
Requirements:
- On reset (<code dir="ltr">rst_n == 0</code>): clear <code dir="ltr">rx_data = 0</code> and <code dir="ltr">rx_done = 0</code>.
- In IDLE: hold <code dir="ltr">rx_done = 0</code>. Transition to DATA state when <code dir="ltr">rx == 0</code> is detected.
- In DATA: read 8 bits from <code dir="ltr">rx</code> (one bit per clock cycle) and shift them in LSB-first (bit 0 to bit 7).
- In STOP: verify that <code dir="ltr">rx == 1</code>. If so, assign the collected byte to <code dir="ltr">rx_data</code> and assert <code dir="ltr">rx_done = 1</code> for exactly one clock cycle, then return to IDLE.`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    input rx,
    output reg [7:0] rx_data,
    output reg rx_done
);
    // הגדירו אוגרי עזר ומכונת מצבים וכתבו את הלוגיקה כאן
    // Declare helper registers and state machine, then write your UART Rx here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    input rx,
    output reg [7:0] rx_data,
    output reg rx_done
);
    localparam IDLE = 2'd0;
    localparam DATA = 2'd1;
    localparam STOP = 2'd2;

    reg [1:0] state;
    reg [2:0] bit_cnt;
    reg [7:0] shift_reg;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= IDLE;
            rx_data   <= 8'd0;
            rx_done   <= 1'b0;
            bit_cnt   <= 3'd0;
            shift_reg <= 8'd0;
        end else begin
            rx_done <= 1'b0; // Default pulse de-assertion
            case (state)
                IDLE: begin
                    if (rx == 1'b0) begin // Start bit detected
                        state     <= DATA;
                        bit_cnt   <= 3'd0;
                        shift_reg <= 8'd0;
                    end
                end
                DATA: begin
                    shift_reg <= {rx, shift_reg[7:1]};
                    if (bit_cnt == 3'd7) begin
                        state <= STOP;
                    end else begin
                        bit_cnt <= bit_cnt + 1'b1;
                    end
                end
                STOP: begin
                    state <= IDLE;
                    if (rx == 1'b1) begin // Stop bit valid
                        rx_data <= shift_reg;
                        rx_done <= 1'b1;
                    end
                end
                default: state <= IDLE;
            endcase
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 5, clk: 1, rst_n: 0, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 10, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 15, clk: 1, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 20, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 25, clk: 1, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 30, clk: 0, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 35, clk: 1, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 40, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 45, clk: 1, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 50, clk: 0, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 55, clk: 1, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 60, clk: 0, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 65, clk: 1, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 70, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 75, clk: 1, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 80, clk: 0, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 85, clk: 1, rst_n: 1, rx: 0, rx_data: 0, rx_done: 0 },
        { time: 90, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 95, clk: 1, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 100, clk: 0, rst_n: 1, rx: 1, rx_data: 0, rx_done: 0 },
        { time: 105, clk: 1, rst_n: 1, rx: 1, rx_data: 165, rx_done: 1 },
        { time: 110, clk: 0, rst_n: 1, rx: 1, rx_data: 165, rx_done: 1 },
        { time: 115, clk: 1, rst_n: 1, rx: 1, rx_data: 165, rx_done: 0 }
      ],

      hints: {
        he: "במצב DATA, בצעו הזזה ימינה של האוגר: shift_reg <= {rx, shift_reg[7:1]}; כדי לקלוט LSB תחילה.",
        en: "In DATA state, shift the register to the right: shift_reg <= {rx, shift_reg[7:1]}; to sample LSB-first."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 90: Baud Rate Generator
    // --------------------------------------------------------------------------
    {
      id: 90,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "מחולל קצב שידור (Baud Rate Generator) ⏱️",
      titleEn: "Baud Rate Generator",

      explanationHe: `
<h3>1. למה צריך מחולל קצב שידור (Baud Rate Generator)? ⏱️</h3>
<p>בקרי תקשורת כגון UART פועלים בקצבי שידור נמוכים בהרבה מתדר שעון המערכת הראשי של השבב. למשל, שעון מערכת עשוי לפעול בתדר של <strong>50MHz</strong> בעוד שקצב ה-UART הנדרש הוא <strong>115,200 Baud</strong> (הרבה פחות מ-1MHz).</p>

<p>כדי להתאים בין התדרים, אנו מתכננים <strong>מחולל קצב (Baud Rate Generator)</strong> שהוא למעשה מחלק תדר דיגיטלי מבוסס מונה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. פעימת שעון צרה (Tick) לעומת חלוקה של 50% Duty Cycle 📐</h3>
<p>בתכנון חומרה מתקדם, במקום לייצר שעון חדש בעל מחזור פעילות של 50% (דבר שיוצר שעונים מרובים ומסבך את תכנון החומרה), אנו מעדיפים לייצר <strong>פעימה צרה (Strobe או Tick)</strong> הנשארת גבוהה (1) למשך <strong>מחזור שעון מערכת בודד</strong> בדיוק פעם בכמה מחזורים. אות ה-Tick משמש כהתניה (Enable) בלוגיקה הבאה.</p>

<p>נוסחת חלוקה כללית עבור מחולל קצב:</p>
<div dir="ltr" style="text-align: center; font-weight: bold; margin: 1rem 0; font-family: var(--font-family-mono);">
    Divisor = System_Clock / (Baud_Rate)
</div>
`,

      explanationEn: `
<h3>1. Why is a Baud Rate Generator Needed? ⏱️</h3>
<p>Communication controllers like UART operate at frequencies much lower than the core system clock of the FPGA or ASIC. For example, a system clock might run at <strong>50MHz</strong>, while UART demands <strong>115,200 bits per second</strong>. To bridge this gap, we use a <strong>Baud Rate Generator</strong>, which is essentially a programmable digital clock divider.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Clock Ticks vs. Secondary Clock Domains 📐</h3>
<p>Instead of driving secondary clock networks (which can cause clock domain crossing errors and routing issues), digital designers generate a single-cycle **enable strobe (Tick)**. The logic in the transmitter/receiver registers acts only when this tick goes high for exactly one clock cycle.</p>
`,

      taskHe: `בנו מחולל קצב שידור (מחלק שעון) במודול <code dir="ltr">top_module</code>.
למודול כניסות <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), ויציאה אחת <code dir="ltr">output reg baud_tick</code>.
הדרישות:
- המערכת צריכה לחלק את שעון המערכת ב-4 (Divisor = 4).
- עליכם להשתמש במונה פנימי (2 ביטים).
- בכל פעם שהמונה מגיע ל-3, אפסו אותו במחזור הבא והעלו את היציאה <code dir="ltr">baud_tick</code> ל-1 למשך מחזור שעון אחד בדיוק. בכל שאר הזמן, <code dir="ltr">baud_tick</code> יהיה 0.
- במצב של איפוס (<code dir="ltr">rst_n == 0</code>), המונה וגם היציאה <code dir="ltr">baud_tick</code> צריכים להתאפס ל-0.`,
      taskEn: `Build a Baud Rate Generator (Clock Divider by 4) in <code dir="ltr">top_module</code>.
The module has inputs <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (active-low asynchronous reset), and output <code dir="ltr">output reg baud_tick</code>.
Requirements:
- Divide the clock by 4 (Divisor = 4).
- Use an internal 2-bit counter.
- When the counter reaches 3, reset it to 0 on the next clock edge and assert <code dir="ltr">baud_tick = 1</code> for exactly one cycle. At all other times, <code dir="ltr">baud_tick</code> must be 0.
- On reset (<code dir="ltr">rst_n == 0</code>): clear both the counter and <code dir="ltr">baud_tick</code> to 0.`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    output reg baud_tick
);
    // הגדירו מונה פנימי ברוחב 2 ביטים וממשו את מחלק התדר
    // Declare a 2-bit internal counter and implement the frequency divider

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    output reg baud_tick
);
    reg [1:0] counter;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            counter   <= 2'b0;
            baud_tick <= 1'b0;
        end else begin
            if (counter == 2'd3) begin
                counter   <= 2'b0;
                baud_tick <= 1'b1;
            end else begin
                counter   <= counter + 1'b1;
                baud_tick <= 1'b0;
            end
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, baud_tick: 0 },
        { time: 5, clk: 1, rst_n: 0, baud_tick: 0 },
        { time: 10, clk: 0, rst_n: 1, baud_tick: 0 },
        { time: 15, clk: 1, rst_n: 1, baud_tick: 0 },
        { time: 20, clk: 0, rst_n: 1, baud_tick: 0 },
        { time: 25, clk: 1, rst_n: 1, baud_tick: 0 },
        { time: 30, clk: 0, rst_n: 1, baud_tick: 0 },
        { time: 35, clk: 1, rst_n: 1, baud_tick: 0 },
        { time: 40, clk: 0, rst_n: 1, baud_tick: 0 },
        { time: 45, clk: 1, rst_n: 1, baud_tick: 1 },
        { time: 50, clk: 0, rst_n: 1, baud_tick: 1 },
        { time: 55, clk: 1, rst_n: 1, baud_tick: 0 }
      ],

      hints: {
        he: "הגדירו reg [1:0] counter. בכל פעימה בדקו: if (counter == 2'd3) counter <= 0, baud_tick <= 1.",
        en: "Define reg [1:0] counter. On posedge clk, check if the counter is 2'd3. If so, clear counter and set baud_tick to 1."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 91: SPI Master Controller
    // --------------------------------------------------------------------------
    {
      id: 91,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "בקר תקשורת SPI Master 🔌",
      titleEn: "SPI Master Controller",

      explanationHe: `
<h3>1. פרוטוקול SPI (Serial Peripheral Interface) 🔌</h3>
<p>פרוטוקול <strong>SPI (Serial Peripheral Interface)</strong> הוא פרוטוקול תקשורת טורית סינכרונית מהירה לטווח קצר, המשמש לחיבור חיישנים, כרטיסי זיכרון, ומסכים קטנים למיקרו-בקרים. בשונה מ-UART, תקשורת SPI היא <strong>סינכרונית</strong> ומבוססת על קו שעון משותף שמנוהל על ידי ה-Master.</p>

<p>החיבור הסטנדרטי כולל 4 חוטים:</p>
<ul>
  <li><strong>SCLK (Serial Clock)</strong>: השעון שמסופק על ידי ה-Master.</li>
  <li><strong>MOSI (Master Out Slave In)</strong>: קו שליחת הנתונים מהמאסטר לעבד.</li>
  <li><strong>MISO (Master In Slave Out)</strong>: קו שליחת הנתונים מהעבד למאסטר.</li>
  <li><strong>SS / CS (Slave Select / Chip Select)</strong>: אות בחירת רכיב (פעיל בנמוך - 0), המשמש לבחירת העבד שאיתו מתקשרים.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. עבודה ב-SPI Mode 0 📐</h3>
<p>פרוטוקול SPI תומך ב-4 מצבים שונים הנקבעים לפי קוטביות השעון (CPOL) ומופע השעון (CPHA). המצב הנפוץ ביותר הוא <strong>Mode 0 (CPOL=0, CPHA=0)</strong>:</p>
<ul>
  <li>השעון <code dir="ltr">SCLK</code> נמצא בנמוך (0) כאשר אין שידור.</li>
  <li>שליחת הנתונים בקו <code dir="ltr">MOSI</code> מתבצעת בנפילת השעון (Falling Edge).</li>
  <li>דגימת הנתונים בקו <code dir="ltr">MISO</code> מתבצעת בעליית השעון (Rising Edge).</li>
</ul>
`,

      explanationEn: `
<h3>1. The SPI Protocol (Serial Peripheral Interface) 🔌</h3>
<p><strong>SPI (Serial Peripheral Interface)</strong> is a high-speed, synchronous serial bus interface commonly used to communicate between microcontrollers and peripheral devices (like sensors, ADCs, flash memory, and LCDs). It is synchronous, utilizing a shared serial clock line managed by the Master.</p>

<p>A standard SPI connection uses 4 wires:</p>
<ul>
  <li><strong>SCLK (Serial Clock)</strong>: Clock output driven by the Master.</li>
  <li><strong>MOSI (Master Out Slave In)</strong>: Serial data line from Master to Slave.</li>
  <li><strong>MISO (Master In Slave Out)</strong>: Serial data line from Slave to Master.</li>
  <li><strong>SS / CS (Slave Select / Chip Select)</strong>: Active-low enable line selection.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. SPI Mode 0 Operation (CPOL=0, CPHA=0) 📐</h3>
<p>SPI supports 4 distinct clocking modes configured by clock polarity (CPOL) and clock phase (CPHA). The most common configuration is <strong>Mode 0</strong>:</p>
<ul>
  <li>The clock <code dir="ltr">SCLK</code> idles at logic low (0).</li>
  <li>Data is placed on the line at the falling edge of <code dir="ltr">SCLK</code> (or initially when SS goes low).</li>
  <li>Data is sampled at the rising edge of <code dir="ltr">SCLK</code>.</li>
</ul>
`,

      taskHe: `בנו בקר SPI Master פשוט במודול <code dir="ltr">top_module</code> במצב Mode 0.
כניסות המודול: <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), <code dir="ltr">start</code> (התחלת שידור), ו-<code dir="ltr">[7:0] tx_data</code> (המידע לשליחה).
יציאות המודול: <code dir="ltr">sclk</code>, <code dir="ltr">mosi</code>, <code dir="ltr">ss</code>, ו-<code dir="ltr">done</code>.
דרישות המימוש:
- במצב מנוחה (IDLE): היציאות יהיו <code dir="ltr">sclk = 0</code>, <code dir="ltr">mosi = 1</code>, <code dir="ltr">ss = 1</code>, <code dir="ltr">done = 0</code>.
- כאשר מגיע אות <code dir="ltr">start == 1</code> במצב מנוחה:
  - העבירו את המערכת למצב שידור, הורידו את <code dir="ltr">ss = 0</code>, ודחפו מיידית את הביט הכי משמעותי של המידע (<code dir="ltr">tx_data[7]</code>) לקו ה-<code dir="ltr">mosi</code> (MSB First).
  - לאורך השידור, בצעו ייצור של 8 מחזורי שעון ב-<code dir="ltr">sclk</code> (כל פעימת שעון מורכבת מ-2 מחזורי שעון מערכת - מחזור אחד נמוך, מחזור אחד גבוה).
  - בכל מחזור <code dir="ltr">sclk</code> נמוך: שנו את ערכו של <code dir="ltr">mosi</code> לביט הבא (מביט 7 מטה לביט 0).
  - לאחר שליחת ביט 0, החזירו את <code dir="ltr">ss = 1</code> ו-<code dir="ltr">mosi = 1</code>, הרימו את הדגל <code dir="ltr">done = 1</code> למשך מחזור שעון אחד, וחזרו למצב מנוחה.`,
      taskEn: `Design a simplified SPI Master Controller (Mode 0) in <code dir="ltr">top_module</code>.
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code>, <code dir="ltr">start</code>, <code dir="ltr">[7:0] tx_data</code>.
Outputs: <code dir="ltr">sclk</code>, <code dir="ltr">mosi</code>, <code dir="ltr">ss</code>, <code dir="ltr">done</code>.
Requirements:
- In IDLE: outputs are <code dir="ltr">sclk = 0</code>, <code dir="ltr">mosi = 1</code>, <code dir="ltr">ss = 1</code>, <code dir="ltr">done = 0</code>.
- When <code dir="ltr">start == 1</code> in IDLE:
  - Transition to transmit state, drive <code dir="ltr">ss = 0</code>, and drive the MSB of data (<code dir="ltr">tx_data[7]</code>) directly to <code dir="ltr">mosi</code> (MSB First).
  - Generate exactly 8 clock cycles on <code dir="ltr">sclk</code>. Each SPI clock cycle spans 2 system clock cycles: 1 cycle low, 1 cycle high.
  - On the falling/low phase of each SPI clock: update <code dir="ltr">mosi</code> with the next bit (from index 7 down to 0).
  - After bit 0 is transmitted, de-assert <code dir="ltr">ss = 1</code>, return <code dir="ltr">mosi = 1</code>, assert <code dir="ltr">done = 1</code> for exactly one system clock cycle, and return to IDLE.`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    input start,
    input [7:0] tx_data,
    output reg sclk,
    output reg mosi,
    output reg ss,
    output reg done
);
    // הגדירו מצבים למכונה וממשו את בקר ה-SPI Master
    // Define states and write your SPI Master Controller here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    input start,
    input [7:0] tx_data,
    output reg sclk,
    output reg mosi,
    output reg ss,
    output reg done
);
    localparam IDLE     = 2'd0;
    localparam TRANSMIT = 2'd1;
    localparam DONE     = 2'd2;

    reg [1:0] state;
    reg [3:0] bit_cnt;
    reg [7:0] shift_reg;
    reg clk_phase;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= IDLE;
            sclk      <= 1'b0;
            mosi      <= 1'b1;
            ss        <= 1'b1;
            done      <= 1'b0;
            bit_cnt   <= 4'd0;
            shift_reg <= 8'd0;
            clk_phase <= 1'b0;
        end else begin
            done <= 1'b0;
            case (state)
                IDLE: begin
                    sclk <= 1'b0;
                    mosi <= 1'b1;
                    ss   <= 1'b1;
                    if (start) begin
                        state     <= TRANSMIT;
                        ss        <= 1'b0;
                        shift_reg <= tx_data;
                        bit_cnt   <= 4'd0;
                        clk_phase <= 1'b0;
                        mosi      <= tx_data[7];
                    end
                end
                TRANSMIT: begin
                    if (!clk_phase) begin
                        sclk      <= 1'b1;
                        clk_phase <= 1'b1;
                    end else begin
                        sclk      <= 1'b0;
                        clk_phase <= 1'b0;
                        if (bit_cnt == 4'd7) begin
                            state <= DONE;
                            ss    <= 1'b1;
                            mosi  <= 1'b1;
                        end else begin
                            mosi      <= shift_reg[6 - bit_cnt];
                            bit_cnt   <= bit_cnt + 1'b1;
                        end
                    end
                end
                DONE: begin
                    done  <= 1'b1;
                    state <= IDLE;
                end
                default: state <= IDLE;
            endcase
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 },
        { time: 5, clk: 1, rst_n: 0, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 },
        { time: 10, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 },
        { time: 15, clk: 1, rst_n: 1, start: 1, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 20, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 25, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 30, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 35, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 40, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 45, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 50, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 55, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 60, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 65, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 70, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 75, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 80, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 85, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 90, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 95, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 100, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 105, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 110, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 115, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 120, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 125, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 130, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 135, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 140, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 0, ss: 0, done: 0 },
        { time: 145, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 150, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 0, ss: 0, done: 0 },
        { time: 155, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 160, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 0, done: 0 },
        { time: 165, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 170, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 1, mosi: 1, ss: 0, done: 0 },
        { time: 175, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 },
        { time: 180, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 },
        { time: 185, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 1 },
        { time: 190, clk: 0, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 1 },
        { time: 195, clk: 1, rst_n: 1, start: 0, tx_data: 165, sclk: 0, mosi: 1, ss: 1, done: 0 }
      ],

      hints: {
        he: "ממשו חלוקת שעון פנימית עבור clk_phase: בערך 0 העלו sclk=1 ובערך 1 הורידו sclk=0 ועדכנו את mosi.",
        en: "Implement an internal clk_phase toggle. When clk_phase is 0, drive sclk=1. When 1, drive sclk=0 and load the next bit to mosi."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 92: I2C Bus Protocol FSM
    // --------------------------------------------------------------------------
    {
      id: 92,
      chapter: 12,
      chapterTitleHe: "פרק 12: תקשורת ופרוטוקולים מתקדמים",
      chapterTitleEn: "Chapter 12: Advanced Communication Protocols",
      titleHe: "מכונת מצבים לפרוטוקול I2C Master 🚌",
      titleEn: "I2C Bus Protocol FSM",

      explanationHe: `
<h3>1. פרוטוקול I2C (Inter-Integrated Circuit) 🚌</h3>
<p>פרוטוקול <strong>I2C</strong> הוא פרוטוקול תקשורת סינכרוני פופולרי נוסף המאפשר חיבור של מספר רב של רכיבי עבד (Slaves) למאסטר (Master) יחיד תוך שימוש ב-<strong>2 חוטים בלבד</strong>:</p>
<ul>
  <li><strong>SCL (Serial Clock)</strong>: קו שעון משותף המסופק על ידי המאסטר.</li>
  <li><strong>SDA (Serial Data)</strong>: קו נתונים דו-כיווני (Bi-directional).</li>
</ul>

<p>הקווים מחוברים דרך נגדי משיכה למעלה (Pull-up Resistors), כלומר המצב הטבעי שלהם הוא 1, ורכיבים על הערוץ יכולים רק למשוך אותם לנמוך (0).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תנאי התחלה (START) ותנאי סיום (STOP) ⏱️</h3>
<p>בשל מחסור בקווי בקרה נפרדים, קו ה-SDA משמש גם לאיתות על מצבי הבקר:</p>
<ul>
  <li><strong>START Condition</strong>: שינוי קו SDA מ-1 ל-0 כאשר קו השעון SCL נמצא ב-1. תנאי זה מסמן תחילת שידור.</li>
  <li><strong>STOP Condition</strong>: שינוי קו SDA מ-0 ל-1 כאשר קו השעון SCL נמצא ב-1. תנאי זה מסמן סיום שידור ושחרור הערוץ.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מחזור כתובת ופעולת ACK / NACK 📐</h3>
<p>השלב הראשון לאחר תנאי START הוא שליחת הכתובת הפיזית של רכיב העבד:</p>
<ol>
  <li>המאסטר שולח 7 ביטים המייצגים את כתובת הרכיב.</li>
  <li>המאסטר שולח ביט שמיני המייצג את סוג הפעולה: <strong>0 לכתיבה (Write)</strong>, <strong>1 לקריאה (Read)</strong>.</li>
  <li>לאחר מכן מגיע פולס שעון תשיעי - <strong>Acknowledge (ACK)</strong>. המאסטר משחרר את קו ה-SDA (<code dir="ltr">sda_oe = 0</code>), ורכיב העבד שתואם לכתובת חייב למשוך את קו ה-SDA ל-0 כדי לאשר את קבלת הכתובת.</li>
</ol>
`,

      explanationEn: `
<h3>1. The I2C Protocol (Inter-Integrated Circuit) 🚌</h3>
<p><strong>I2C</strong> is a synchronous, multi-master, multi-slave, packet-switched serial bus. Its defining feature is that it requires only <strong>two bidirectional lines</strong>: SCL (Serial Clock) and SDA (Serial Data). Both lines are open-drain and pulled high by resistors.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. START and STOP Bus Conditions ⏱️</h3>
<p>Because there are no chip-select lines, bus transitions are initiated using specific waveforms on the shared lines:</p>
<ul>
  <li><strong>START Condition</strong>: High-to-low transition of SDA while SCL is high. Marks bus acquisition.</li>
  <li><strong>STOP Condition</strong>: Low-to-high transition of SDA while SCL is high. Marks bus release.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Address Phase and ACK handshake 📐</h3>
<p>Immediately after a START condition, the master transmits a 9-bit address frame:</p>
<ol>
  <li>7-bit device address (MSB first).</li>
  <li>1-bit read/write direction (Write=0, Read=1).</li>
  <li>The 9th clock period is the ACK phase. The master releases the SDA line (sets <code dir="ltr">sda_oe = 0</code>). The targeted slave must pull SDA low to signal a successful handshake.</li>
</ol>
`,

      taskHe: `בנו מכונת מצבים (FSM) עבור בקר I2C Master במודול <code dir="ltr">top_module</code>.
כניסות המודול: <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code> (איפוס אסינכרוני פעיל בנמוך), <code dir="ltr">start</code> (אות התחלה), <code dir="ltr">stop</code> (אות סיום), <code dir="ltr">[6:0] addr</code>, ו-<code dir="ltr">read_write</code>.
יציאות המודול: <code dir="ltr">scl</code>, <code dir="ltr">sda</code> (ערך לשידור), <code dir="ltr">sda_oe</code> (אישור דחיפה לקו הנתונים), ו-<code dir="ltr">busy</code>.
דרישות המימוש:
- במצב מנוחה (IDLE): היציאות הן <code dir="ltr">scl = 1</code>, <code dir="ltr">sda = 1</code>, <code dir="ltr">sda_oe = 0</code>, <code dir="ltr">busy = 0</code>.
- כאשר מגיע אות <code dir="ltr">start == 1</code> במצב מנוחה:
  - עברו למצב START: שמרו על <code dir="ltr">scl = 1</code>, והורידו את <code dir="ltr">sda = 0</code> (ו-<code dir="ltr">sda_oe = 1</code>, <code dir="ltr">busy = 1</code>).
  - במחזור השעון הבא, הורידו את <code dir="ltr">scl = 0</code> ועברו לשדר את הכתובת במצב ADDR.
- במצב ADDR: שדרו את 7 ביטי הכתובת ואז את ביט ה-read_write (סה"כ 8 ביטים, MSB First).
  - כל ביט דורש שני מחזורי שעון: מחזור SCL נמוך (בו מעדכנים את ערך ה-sda) ומחזור SCL גבוה.
- לאחר שידור 8 הביטים, עברו למצב ACK:
  - למשך מחזור שעון אחד, הורידו את <code dir="ltr">scl = 0</code> ושחררו את הנתונים (<code dir="ltr">sda = 0</code>, <code dir="ltr">sda_oe = 0</code>).
  - למשך מחזור שעון שני, העלו את <code dir="ltr">scl = 1</code>.
  - אם האות <code dir="ltr">stop == 1</code>, עברו למצב STOP. אלא אם כן צוין אחרת, חזרו ישירות ל-IDLE.
- במצב STOP:
  - במחזור ראשון: הורידו את <code dir="ltr">scl = 0</code>, והקצו <code dir="ltr">sda = 0</code>, <code dir="ltr">sda_oe = 1</code>.
  - במחזור שני: העלו את <code dir="ltr">scl = 1</code>, ואז משכו את <code dir="ltr">sda = 1</code> (תנאי STOP), שחררו את הקו (<code dir="ltr">sda_oe = 0</code>, <code dir="ltr">busy = 0</code>) וחזרו ל-IDLE.`,
      taskEn: `Build a Finite State Machine (FSM) for an I2C Master Controller in <code dir="ltr">top_module</code>.
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">rst_n</code>, <code dir="ltr">start</code>, <code dir="ltr">stop</code>, <code dir="ltr">[6:0] addr</code>, <code dir="ltr">read_write</code>.
Outputs: <code dir="ltr">scl</code>, <code dir="ltr">sda</code>, <code dir="ltr">sda_oe</code>, <code dir="ltr">busy</code>.
Requirements:
- In IDLE: outputs are <code dir="ltr">scl = 1</code>, <code dir="ltr">sda = 1</code>, <code dir="ltr">sda_oe = 0</code>, <code dir="ltr">busy = 0</code>.
- When <code dir="ltr">start == 1</code> in IDLE:
  - Transition to START state: hold <code dir="ltr">scl = 1</code>, and pull <code dir="ltr">sda = 0</code> (<code dir="ltr">sda_oe = 1</code>, <code dir="ltr">busy = 1</code>).
  - On the next clock cycle: pull <code dir="ltr">scl = 0</code> and transition to ADDR state.
- In ADDR: shift out 7-bit <code dir="ltr">addr</code> followed by 1-bit <code dir="ltr">read_write</code> (total 8 bits, MSB first).
  - Each bit takes 2 clock cycles: 1 clock cycle of SCL low (where you update <code dir="ltr">sda</code>) and 1 clock cycle of SCL high.
- After 8 bits are shifted, transition to ACK:
  - Cycle 1: pull <code dir="ltr">scl = 0</code> and release SDA (<code dir="ltr">sda = 0</code>, <code dir="ltr">sda_oe = 0</code>).
  - Cycle 2: raise <code dir="ltr">scl = 1</code>.
  - If <code dir="ltr">stop == 1</code>, transition to STOP state. Otherwise, return to IDLE.
- In STOP:
  - Cycle 1: pull <code dir="ltr">scl = 0</code>, drive <code dir="ltr">sda = 0</code>, <code dir="ltr">sda_oe = 1</code>.
  - Cycle 2: raise <code dir="ltr">scl = 1</code>, then release <code dir="ltr">sda = 1</code> (STOP condition), and clear <code dir="ltr">sda_oe = 0</code>, <code dir="ltr">busy = 0</code>, returning to IDLE.`,

      starterCode: `module top_module (
    input clk,
    input rst_n,
    input start,
    input stop,
    input [6:0] addr,
    input read_write,
    output reg scl,
    output reg sda,
    output reg sda_oe,
    output reg busy
);
    // הגדירו מצבים למכונה וממשו את בקר ה-I2C Master
    // Define states and write your I2C Master FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input rst_n,
    input start,
    input stop,
    input [6:0] addr,
    input read_write,
    output reg scl,
    output reg sda,
    output reg sda_oe,
    output reg busy
);
    localparam IDLE  = 3'd0;
    localparam START = 3'd1;
    localparam ADDR  = 3'd2;
    localparam ACK   = 3'd3;
    localparam STOP  = 3'd4;

    reg [2:0] state;
    reg [7:0] shift_reg;
    reg [2:0] bit_cnt;
    reg clk_phase;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= IDLE;
            scl       <= 1'b1;
            sda       <= 1'b1;
            sda_oe    <= 1'b0;
            busy      <= 1'b0;
            shift_reg <= 8'd0;
            bit_cnt   <= 3'd0;
            clk_phase <= 1'b0;
        end else begin
            case (state)
                IDLE: begin
                    scl    <= 1'b1;
                    sda    <= 1'b1;
                    sda_oe <= 1'b0;
                    busy   <= 1'b0;
                    if (start) begin
                        state     <= START;
                        sda       <= 1'b0; // START condition
                        sda_oe    <= 1'b1;
                        busy      <= 1'b1;
                        shift_reg <= {addr, read_write};
                        bit_cnt   <= 3'd0;
                    end
                end
                START: begin
                    scl       <= 1'b0;
                    sda       <= shift_reg[7];
                    sda_oe    <= 1'b1;
                    state     <= ADDR;
                    clk_phase <= 1'b0;
                end
                ADDR: begin
                    if (!clk_phase) begin
                        scl       <= 1'b1;
                        clk_phase <= 1'b1;
                    end else begin
                        scl       <= 1'b0;
                        clk_phase <= 1'b0;
                        if (bit_cnt == 3'd7) begin
                            state  <= ACK;
                            sda    <= 1'b0;
                            sda_oe <= 1'b0; // Release bus for slave ACK
                        end else begin
                            sda     <= shift_reg[6 - bit_cnt];
                            sda_oe  <= 1'b1;
                            bit_cnt <= bit_cnt + 1'b1;
                        end
                    end
                end
                ACK: begin
                    if (!clk_phase) begin
                        scl       <= 1'b1;
                        clk_phase <= 1'b1;
                    end else begin
                        scl       <= 1'b0;
                        clk_phase <= 1'b0;
                        if (stop) begin
                            state  <= STOP;
                            sda    <= 1'b0;
                            sda_oe <= 1'b1;
                        end else begin
                            state <= IDLE;
                        end
                    end
                end
                STOP: begin
                    if (!clk_phase) begin
                        scl       <= 1'b1;
                        sda       <= 1'b0;
                        clk_phase <= 1'b1;
                    end else begin
                        sda    <= 1'b1; // STOP condition
                        sda_oe <= 1'b0;
                        busy   <= 1'b0;
                        state  <= IDLE;
                    end
                end
                default: state <= IDLE;
            endcase
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, rst_n: 0, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 0, busy: 0 },
        { time: 5, clk: 1, rst_n: 0, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 0, busy: 0 },
        { time: 10, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 0, busy: 0 },
        { time: 15, clk: 1, rst_n: 1, start: 1, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 20, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 7: value 1
        { time: 25, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 1, sda_oe: 1, busy: 1 },
        { time: 30, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 1, sda_oe: 1, busy: 1 },
        { time: 35, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 1, busy: 1 },
        { time: 40, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 1, busy: 1 },
        
        // Bit 6: value 0
        { time: 45, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 50, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 55, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 60, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 5: value 1
        { time: 65, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 1, sda_oe: 1, busy: 1 },
        { time: 70, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 1, sda_oe: 1, busy: 1 },
        { time: 75, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 1, busy: 1 },
        { time: 80, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 1, busy: 1 },
        
        // Bit 4: value 0
        { time: 85, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 90, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 95, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 100, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 3: value 0
        { time: 105, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 110, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 115, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 120, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 2: value 0
        { time: 125, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 130, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 135, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 140, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 1: value 0
        { time: 145, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 150, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 155, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 160, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // Bit 0 (read_write): value 0
        { time: 165, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 170, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 175, clk: 1, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 180, clk: 0, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        
        // ACK:
        { time: 185, clk: 1, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 0, busy: 1 },
        { time: 190, clk: 0, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 0, busy: 1 },
        { time: 195, clk: 1, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 0, busy: 1 },
        { time: 200, clk: 0, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 0, busy: 1 },
        
        // STOP:
        { time: 205, clk: 1, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 210, clk: 0, rst_n: 1, start: 0, stop: 1, addr: 80, read_write: 0, scl: 0, sda: 0, sda_oe: 1, busy: 1 },
        { time: 215, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 220, clk: 0, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 0, sda_oe: 1, busy: 1 },
        { time: 225, clk: 1, rst_n: 1, start: 0, stop: 0, addr: 80, read_write: 0, scl: 1, sda: 1, sda_oe: 0, busy: 0 }
      ],

      hints: {
        he: "בצעו את ה-START condition ע\"י הקצאת sda=0 בזמן ש-scl=1, ובמחזור הבא הורידו את scl=0 ועברו למצב שידור כתובת.",
        en: "Implement the START condition by setting sda=0 while scl=1, then on the next cycle pull scl-0 and move to ADDR."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
