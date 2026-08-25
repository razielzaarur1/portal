/* ==========================================================================
   VeriLearn Curriculum — Chapter 8: Finite State Machines & System Design (Lessons 57 to 65)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 57: FSM 3-Block Design Architecture
    // --------------------------------------------------------------------------
    {
      id: 57,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "ארכיטקטורת FSM בשיטת 3 בלוקים 🏗️",
      titleEn: "FSM 3-Block Design Architecture",

      explanationHe: `
<h3>1. מהו מבנה FSM של 3 בלוקים? 🏗️</h3>
<p>בתכנון חומרה דיגיטלית, כתיבת מכונת מצבים סופית (FSM) בבלוק <code>always</code> יחיד עלולה ליצור קוד מסורבל, קשה לאימות, ומועד לשגיאות תזמון או יצירת נועלים (Latches) לא רצויים. לכן, התקן המקובל בתעשייה הוא שימוש ב-<strong>ארכיטקטורת 3 בלוקים (3-Block FSM Architecture)</strong>.</p>
<p>ארכיטקטורה זו מפרידה באופן מוחלט בין שלושת המרכיבים הפיזיים של מכונת המצבים:</p>
<ol>
  <li><strong>בלוק 1 (רציף - Sequential)</strong>: אוגר המצב הנוכחי (State Register). מתעדכן רק בעליית שעון ומכיל לוגיקת איפוס (Reset).</li>
  <li><strong>בלוק 2 (צירופי - Combinational)</strong>: לוגיקת המצב הבא (Next State Logic). מחשב את המצב הבא על בסיס המצב הנוכחי והכניסות בעזרת פקודת <code>case</code>.</li>
  <li><strong>בלוק 3 (צירופי או רציף - Combinational/Sequential)</strong>: לוגיקת היציאה (Output Logic). מחשב את ערכי אותות היציאה על בסיס המצב הנוכחי (או המצב והכניסות במקרה של מילי).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמה עקרונית (שמות משתנים שונים) 📐</h3>
<p>להלן דוגמה למבנה FSM תלת-בלוקי עבור מערכת בקרת מנוע פשוטה בעלת שני מצבים (<code>ST_STOP</code> ו-<code>ST_RUN</code>):</p>
<pre dir="ltr"><code>// 1. אוגר המצב (רציף)
always @(posedge sys_clk) begin
    if (!reset_n) begin
        curr_state <= ST_STOP;
    end else begin
        curr_state <= next_state_val;
    end
end

// 2. חישוב המצב הבא (צירופי)
always @(*) begin
    // ערך ברירת מחדל למניעת נועלים (Latches)
    next_state_val = curr_state; 
    case (curr_state)
        ST_STOP: begin
            if (trigger_start) next_state_val = ST_RUN;
        end
        ST_RUN: begin
            if (trigger_stop)  next_state_val = ST_STOP;
        end
        default: next_state_val = ST_STOP;
    endcase
end

// 3. לוגיקת היציאה (צירופי)
always @(*) begin
    motor_on = (curr_state == ST_RUN);
    warning_led = (curr_state == ST_STOP);
end</code></pre>
      `,

      explanationEn: `
<h3>1. What is the 3-Block FSM Coding Style? 🏗️</h3>
<p>In digital design, combining state transitions, next-state logic, and output values into a single <code>always</code> block leads to spaghetti code that is hard to debug and prone to inferring unwanted <strong>latches</strong>. To solve this, the industry standard is the <strong>3-Block FSM Architecture</strong>.</p>
<p>This design model explicitly separates the FSM into three distinct hardware components:</p>
<ol>
  <li><strong>Block 1 (Sequential)</strong>: The State Register. It updates the current state flip-flops at the active clock edge and handles the reset logic.</li>
  <li><strong>Block 2 (Combinational)</strong>: The Next-State Logic. It decodes the next state based on the current state and inputs, typically using a <code>case</code> statement.</li>
  <li><strong>Block 3 (Combinational or Sequential)</strong>: The Output Logic. It generates output signals based strictly on the current state (Moore) or state plus inputs (Mealy).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Generic Example (Different Signal Names) 📐</h3>
<p>Here is the architectural template for a basic engine controller switching between <code>ST_STOP</code> and <code>ST_RUN</code>:</p>
<pre dir="ltr"><code>// Block 1: State Register (Sequential)
always @(posedge sys_clk) begin
    if (!reset_n) begin
        curr_state <= ST_STOP;
    end else begin
        curr_state <= next_state_val;
    end
end

// Block 2: Next-State Logic (Combinational)
always @(*) begin
    next_state_val = curr_state; // Default value avoids latches
    case (curr_state)
        ST_STOP: begin
            if (trigger_start) next_state_val = ST_RUN;
        end
        ST_RUN: begin
            if (trigger_stop)  next_state_val = ST_STOP;
        end
        default: next_state_val = ST_STOP;
    endcase
end

// Block 3: Output Decoder (Combinational)
always @(*) begin
    motor_on = (curr_state == ST_RUN);
    warning_led = (curr_state == ST_STOP);
end</code></pre>
      `,

      taskHe: `ממשו מכונת מצבים בתלת-בלוק (3-Block FSM) במודול <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני פעיל ב-1), <code dir="ltr">start</code>, ו-<code dir="ltr">stop</code>, ויציאות <code dir="ltr">output reg active_out</code> ו-<code dir="ltr">output reg done_out</code>.
המצבים והמעברים מוגדרים כך:
1. <code dir="ltr">IDLE = 2'b00</code>: אם <code dir="ltr">start == 1</code> עוברים ל-<code dir="ltr">ACTIVE</code>, אחרת נשארים ב-<code dir="ltr">IDLE</code>. היציאות הן: <code dir="ltr">active_out = 0</code>, <code dir="ltr">done_out = 0</code>.
2. <code dir="ltr">ACTIVE = 2'b01</code>: אם <code dir="ltr">stop == 1</code> עוברים ל-<code dir="ltr">DONE</code>, אחרת נשארים ב-<code dir="ltr">ACTIVE</code>. היציאות הן: <code dir="ltr">active_out = 1</code>, <code dir="ltr">done_out = 0</code>.
3. <code dir="ltr">DONE = 2'b10</code>: עוברים חזרה ל-<code dir="ltr">IDLE</code> ללא תנאי במחזור השעון הבא. היציאות הן: <code dir="ltr">active_out = 0</code>, <code dir="ltr">done_out = 1</code>.

עליכם לכתוב בדיוק 3 בלוקי <code dir="ltr">always</code> נפרדים לפי ההנחיות.`,
      taskEn: `Implement a 3-Block FSM inside <code dir="ltr">top_module</code> with inputs <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous active-high reset), <code dir="ltr">start</code>, and <code dir="ltr">stop</code>, and outputs <code dir="ltr">output reg active_out</code> and <code dir="ltr">output reg done_out</code>.
The states and transitions are defined as follows:
1. <code dir="ltr">IDLE = 2'b00</code>: If <code dir="ltr">start == 1</code> transition to <code dir="ltr">ACTIVE</code>, else stay in <code dir="ltr">IDLE</code>. Outputs: <code dir="ltr">active_out = 0</code>, <code dir="ltr">done_out = 0</code>.
2. <code dir="ltr">ACTIVE = 2'b01</code>: If <code dir="ltr">stop == 1</code> transition to <code dir="ltr">DONE</code>, else stay in <code dir="ltr">ACTIVE</code>. Outputs: <code dir="ltr">active_out = 1</code>, <code dir="ltr">done_out = 0</code>.
3. <code dir="ltr">DONE = 2'b10</code>: Transition back to <code dir="ltr">IDLE</code> unconditionally on the next clock edge. Outputs: <code dir="ltr">active_out = 0</code>, <code dir="ltr">done_out = 1</code>.

Write exactly three separate <code dir="ltr">always</code> blocks according to the architectural rules.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input start,
    input stop,
    output reg active_out,
    output reg done_out
);
    localparam IDLE   = 2'b00;
    localparam ACTIVE = 2'b01;
    localparam DONE   = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    // Block 1: State Register (Sequential)

    // Block 2: Next State Logic (Combinational)

    // Block 3: Output Logic (Combinational)

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input start,
    input stop,
    output reg active_out,
    output reg done_out
);
    localparam IDLE   = 2'b00;
    localparam ACTIVE = 2'b01;
    localparam DONE   = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    // Block 1: State Register (Sequential)
    always @(posedge clk) begin
        if (reset) begin
            state <= IDLE;
        end else begin
            state <= next_state;
        end
    end

    // Block 2: Next State Logic (Combinational)
    always @(*) begin
        case (state)
            IDLE: begin
                if (start) next_state = ACTIVE;
                else       next_state = IDLE;
            end
            ACTIVE: begin
                if (stop)  next_state = DONE;
                else       next_state = ACTIVE;
            end
            DONE: begin
                next_state = IDLE;
            end
            default: next_state = IDLE;
        endcase
    end

    // Block 3: Output Logic (Combinational)
    always @(*) begin
        case (state)
            IDLE: begin
                active_out = 1'b0;
                done_out = 1'b0;
            end
            ACTIVE: begin
                active_out = 1'b1;
                done_out = 1'b0;
            end
            DONE: begin
                active_out = 1'b0;
                done_out = 1'b1;
            end
            default: begin
                active_out = 1'b0;
                done_out = 1'b0;
            end
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, start: 0, stop: 0, active_out: 0, done_out: 0 },
        { time: 5, clk: 1, reset: 1, start: 0, stop: 0, active_out: 0, done_out: 0 },
        { time: 10, clk: 0, reset: 0, start: 1, stop: 0, active_out: 0, done_out: 0 },
        { time: 15, clk: 1, reset: 0, start: 1, stop: 0, active_out: 1, done_out: 0 }, // Transitions to ACTIVE
        { time: 20, clk: 0, reset: 0, start: 0, stop: 1, active_out: 1, done_out: 0 },
        { time: 25, clk: 1, reset: 0, start: 0, stop: 1, active_out: 0, done_out: 1 }, // Transitions to DONE
        { time: 30, clk: 0, reset: 0, start: 0, stop: 0, active_out: 0, done_out: 1 },
        { time: 35, clk: 1, reset: 0, start: 0, stop: 0, active_out: 0, done_out: 0 }  // Transitions back to IDLE
      ],

      hints: {
        he: "הפרידו ל-3 בלוקים: 1) always @(posedge clk) לעדכון state. 2) always @(*) המשתמש ב-case(state) ומעדכן את next_state. 3) always @(*) שמגדיר את active_out ו-done_out לפי state.",
        en: "Separate into 3 blocks: 1) always @(posedge clk) to update state. 2) always @(*) using case(state) to assign next_state. 3) always @(*) to drive active_out and done_out based on state."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 58: Moore State Machine
    // --------------------------------------------------------------------------
    {
      id: 58,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "מכונת מצבים מסוג מור (Moore Machine) 🤖",
      titleEn: "Moore State Machine",

      explanationHe: `
<h3>1. עקרון הפעולה של Moore FSM 🤖</h3>
<p>מכונת מצבים מסוג <strong>מור (Moore Machine)</strong> מוגדרת כך שהיציאות שלה נקבעות <strong>אך ורק על פי המצב הנוכחי</strong> של המערכת (State Register). במילים אחרות, היציאה אינה תלויה ישירות בכניסות באותו רגע:</p>
<p style="text-align: center;"><code>Output = f(State)</code></p>

<p>תרשים בלוקים של Moore FSM:</p>
<div style="display: flex; justify-content: center; margin: 1rem 0; font-family: monospace; background: var(--bg-color); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);">
  [Inputs] --&gt; [Next-State Logic] --&gt; [State Register (clk)] --&gt; [Output Logic] --&gt; [Outputs]
</div>

<h3>2. יתרונות וחסרונות של Moore Machine ⚖️</h3>
<ul>
  <li><strong>יתרון מרכזי (בטיחות תזמון)</strong>: מאחר והיציאה עוברת דרך אוגר המצב, אין נתיב קומבינטורי ישיר מהכניסה ליציאה. זה מונע רעשים וקפצוצי מתח (Glitches) בכניסה מלהשפיע מיד על היציאה, ומקל מאוד על עמידה בדרישות תזמון (Timing Closure).</li>
  <li><strong>חיסרון מרכזי (השהיה)</strong>: השינוי ביציאה יתרחש רק <strong>במחזור השעון הבא</strong> לאחר שהכניסה השתנתה (עיכוב של מחזור שעון אחד).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד עקרונית 📐</h3>
<p>שימו לב כיצד היציאה משופעלת בצורה קומבינטורית אך ורק כתלות במצב <code>state</code>:</p>
<pre dir="ltr"><code>// הגדרת יציאה של Moore FSM בבלוק קומבינטורי
always @(*) begin
    ready_signal = (curr_state == ST_COMPLETED);
end</code></pre>
      `,

      explanationEn: `
<h3>1. Moore FSM Design Principles 🤖</h3>
<p>A <strong>Moore State Machine</strong> is defined such that its output signals are determined <strong>solely by the current state</strong> of the system. In mathematical terms, the inputs have no direct combinational path to the outputs:</p>
<p style="text-align: center;"><code>Output = f(State)</code></p>

<p>Moore FSM Block Diagram:</p>
<div style="display: flex; justify-content: center; margin: 1rem 0; font-family: monospace; background: var(--bg-color); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);">
  [Inputs] --&gt; [Next-State Logic] --&gt; [State Register (clk)] --&gt; [Output Logic] --&gt; [Outputs]
</div>

<h3>2. Advantages and Disadvantages of Moore FSMs ⚖️</h3>
<ul>
  <li><strong>Primary Advantage (Timing Safety)</strong>: Since outputs are driven only by the state register flip-flops, there is no direct combinational path from inputs to outputs. This isolates modules, shields outputs from input glitches, and simplifies timing closure (no cross-module combinational paths).</li>
  <li><strong>Primary Disadvantage (Latency)</strong>: Response to an input change is delayed until the next active clock edge, adding a 1-clock-cycle latency.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Moore Output Syntax Example 📐</h3>
<p>Notice that the output assignment below checks the state register exclusively:</p>
<pre dir="ltr"><code>// Combinational Moore output assignment
always @(*) begin
    ready_signal = (curr_state == ST_COMPLETED);
end</code></pre>
      `,

      taskHe: `ממשו מכונת מצבים מסוג מור (Moore FSM) לזיהוי רצף לחיצה ארוכה על כפתור <code dir="ltr">press</code>.
המערכת כוללת 3 מצבים מוגדרים:
1. <code dir="ltr">RELEASED = 2'b00</code>: מצב ברירת המחדל (כאשר הכפתור משוחרר). אם <code dir="ltr">press == 1</code> עוברים ל-<code dir="ltr">SHIFT1</code>, אחרת נשארים ב-<code dir="ltr">RELEASED</code>.
2. <code dir="ltr">SHIFT1 = 2'b01</code>: נקלטה לחיצה אחת. אם <code dir="ltr">press == 1</code> עוברים ל-<code dir="ltr">SHIFT2</code>, אחרת חוזרים ל-<code dir="ltr">RELEASED</code>.
3. <code dir="ltr">SHIFT2 = 2'b10</code>: נקלטה לחיצה ארוכה (לפחות 2 מחזורים). אם <code dir="ltr">press == 1</code> נשארים ב-<code dir="ltr">SHIFT2</code>, אחרת חוזרים ל-<code dir="ltr">RELEASED</code>.

יציאת המודול היא <code dir="ltr">level_out</code>. היא חייבת להיות שווה ל-1 **אך ורק** כאשר המערכת נמצאת במצב <code dir="ltr">SHIFT2</code>.
השתמשו באיפוס סינכרוני <code dir="ltr">reset</code> המעביר את המערכת ל-<code dir="ltr">RELEASED</code>.`,
      taskEn: `Implement a Moore FSM to detect a sustained button <code dir="ltr">press</code>.
The FSM contains three states:
1. <code dir="ltr">RELEASED = 2'b00</code>: Default state. If <code dir="ltr">press == 1</code> transition to <code dir="ltr">SHIFT1</code>, else stay in <code dir="ltr">RELEASED</code>.
2. <code dir="ltr">SHIFT1 = 2'b01</code>: One clock cycle of press detected. If <code dir="ltr">press == 1</code> transition to <code dir="ltr">SHIFT2</code>, else return to <code dir="ltr">RELEASED</code>.
3. <code dir="ltr">SHIFT2 = 2'b10</code>: Sustained press detected (at least 2 cycles). If <code dir="ltr">press == 1</code> stay in <code dir="ltr">SHIFT2</code>, else return to <code dir="ltr">RELEASED</code>.

The output signal <code dir="ltr">level_out</code> must be driven high (1) **only** when the FSM is in state <code dir="ltr">SHIFT2</code>.
Use synchronous <code dir="ltr">reset</code> to initialize the FSM to <code dir="ltr">RELEASED</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input press,
    output reg level_out
);
    localparam RELEASED = 2'b00;
    localparam SHIFT1   = 2'b01;
    localparam SHIFT2   = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    // כתבו את מכונת המור כאן / Write your Moore FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input press,
    output reg level_out
);
    localparam RELEASED = 2'b00;
    localparam SHIFT1   = 2'b01;
    localparam SHIFT2   = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= RELEASED;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            RELEASED: next_state = press ? SHIFT1 : RELEASED;
            SHIFT1:   next_state = press ? SHIFT2 : RELEASED;
            SHIFT2:   next_state = press ? SHIFT2 : RELEASED;
            default:  next_state = RELEASED;
        endcase
    end

    always @(*) begin
        level_out = (state == SHIFT2);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, press: 0, level_out: 0 },
        { time: 5, clk: 1, reset: 1, press: 0, level_out: 0 },
        { time: 10, clk: 0, reset: 0, press: 1, level_out: 0 },
        { time: 15, clk: 1, reset: 0, press: 1, level_out: 0 }, // RELEASED -> SHIFT1
        { time: 20, clk: 0, reset: 0, press: 1, level_out: 0 },
        { time: 25, clk: 1, reset: 0, press: 1, level_out: 1 }, // SHIFT1 -> SHIFT2 (level_out = 1)
        { time: 30, clk: 0, reset: 0, press: 1, level_out: 1 },
        { time: 35, clk: 1, reset: 0, press: 0, level_out: 0 }  // SHIFT2 -> RELEASED (level_out = 0)
      ],

      hints: {
        he: "במכונת מור, היציאה נקבעת רק לפי המצב הנוכחי: רשמו level_out = (state == SHIFT2); בבלוק קומבינטורי.",
        en: "In a Moore machine, output depends only on the current state: write level_out = (state == SHIFT2); inside a combinational block."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 59: Mealy State Machine
    // --------------------------------------------------------------------------
    {
      id: 59,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "מכונת מצבים מסוג מילי (Mealy Machine) ⚡",
      titleEn: "Mealy State Machine",

      explanationHe: `
<h3>1. עקרון הפעולה של Mealy FSM ⚡</h3>
<p>מכונת מצבים מסוג <strong>מילי (Mealy Machine)</strong> היא מכונה שבה היציאות נקבעות על בסיס <strong>המצב הנוכחי וגם אותות הכניסה העכשוויים</strong> בו-זמנית:</p>
<p style="text-align: center;"><code>Output = f(State, Inputs)</code></p>

<p>תרשים בלוקים של Mealy FSM:</p>
<div style="display: flex; justify-content: center; margin: 1rem 0; font-family: monospace; background: var(--bg-color); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);">
  [Inputs] --&gt; [Output Logic] &lt;-- [State Register (clk)]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Outputs]
</div>

<h3>2. Moore vs Mealy: השוואה הנדסית 📊</h3>
<p>מכונות מילי מאפשרות בדרך כלל לתכנן מעגלים עם <strong>פחות מצבים</strong> מאשר מכונות מור. בנוסף, היציאה מגיבה באופן <strong>מיידי (באותו מחזור שעון)</strong> לשינויים בכניסה.</p>
<p>מצד שני, מאחר והכניסה עוברת ישירות ליציאה דרך שערים קומבינטוריים, המעגל פגיע לרעשים (Glitches) בכניסה, ונתיבי התזמון שלו ארוכים וקשים יותר לעמידה בתדרי שעון גבוהים.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד עקרונית 📐</h3>
<p>שימו לב לשילוב של הכניסה <code>data_valid</code> יחד עם המצב לצורך קביעת היציאה:</p>
<pre dir="ltr"><code>// חישוב יציאת מילי קומבינטורית
always @(*) begin
    trigger_out = (state == ST_ACTIVE) && (data_valid == 1'b1);
end</code></pre>
      `,

      explanationEn: `
<h3>1. The Mealy FSM Architecture ⚡</h3>
<p>A <strong>Mealy State Machine</strong> computes its output values based on <strong>BOTH the current state AND the current input values</strong>:</p>
<p style="text-align: center;"><code>Output = f(State, Inputs)</code></p>

<p>Mealy FSM Block Diagram:</p>
<div style="display: flex; justify-content: center; margin: 1rem 0; font-family: monospace; background: var(--bg-color); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);">
  [Inputs] --&gt; [Output Logic] &lt;-- [State Register (clk)]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Outputs]
</div>

<h3>2. Moore vs Mealy: Comparison 📊</h3>
<p>Mealy machines often require <strong>fewer states</strong> than Moore machines to accomplish the same function. Furthermore, outputs respond <strong>immediately (within the same cycle)</strong> to input changes without waiting for a clock edge.</p>
<p>However, because inputs propagate directly to outputs through combinational logic, any input glitches will be seen on the outputs. This combinational path can also make timing closure harder at high clock speeds.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Mealy Output Code Example 📐</h3>
<p>Notice how both the state register and the input signal determine the output value:</p>
<pre dir="ltr"><code>// Combinational Mealy output assignment
always @(*) begin
    trigger_out = (state == ST_ACTIVE) && (data_valid == 1'b1);
end</code></pre>
      `,

      taskHe: `ממשו מכונת מצבים מסוג מילי (Mealy FSM) לזיהוי קצה ירידת פולס.
כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">in_bit</code>.
יציאה: <code dir="ltr">detect_out</code>.
המצבים מוגדרים כך:
- <code dir="ltr">IDLE = 1'b0</code>: אם <code dir="ltr">in_bit == 1</code> עוברים ל-<code dir="ltr">ACTIVE</code>, אחרת נשארים ב-<code dir="ltr">IDLE</code>.
- <code dir="ltr">ACTIVE = 1'b1</code>: אם <code dir="ltr">in_bit == 1</code> נשארים ב-<code dir="ltr">ACTIVE</code>. אם <code dir="ltr">in_bit == 0</code>, עוברים חזרה ל-<code dir="ltr">IDLE</code>.

הלוגיקה של היציאה:
היציאה <code dir="ltr">detect_out</code> צריכה לעלות ל-1 **מיידית** כאשר המצב הנוכחי הוא <code dir="ltr">ACTIVE</code> והכניסה הנוכחית <code dir="ltr">in_bit</code> יורדת ל-0 (עוד לפני עליית השעון הבאה שמחזירה אותנו ל-IDLE). בכל מצב אחר היציאה היא 0.`,
      taskEn: `Implement a Mealy FSM to detect the falling edge of a pulse.
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">in_bit</code>.
Output: <code dir="ltr">detect_out</code>.
States:
- <code dir="ltr">IDLE = 1'b0</code>: If <code dir="ltr">in_bit == 1</code> transition to <code dir="ltr">ACTIVE</code>, else stay in <code dir="ltr">IDLE</code>.
- <code dir="ltr">ACTIVE = 1'b1</code>: If <code dir="ltr">in_bit == 1</code> stay in <code dir="ltr">ACTIVE</code>. If <code dir="ltr">in_bit == 0</code> transition back to <code dir="ltr">IDLE</code>.

Output Logic:
The output <code dir="ltr">detect_out</code> must go high (1) **immediately** when the current state is <code dir="ltr">ACTIVE</code> AND the current input <code dir="ltr">in_bit</code> falls to 0 (before the next rising clock edge transitions the state back to IDLE). In all other conditions, output is 0.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input in_bit,
    output reg detect_out
);
    localparam IDLE   = 1'b0;
    localparam ACTIVE = 1'b1;

    reg state;
    reg next_state;

    // כתבו את מכונת המילי כאן / Write your Mealy FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input in_bit,
    output reg detect_out
);
    localparam IDLE   = 1'b0;
    localparam ACTIVE = 1'b1;

    reg state;
    reg next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= IDLE;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            IDLE:   next_state = in_bit ? ACTIVE : IDLE;
            ACTIVE: next_state = in_bit ? ACTIVE : IDLE;
            default: next_state = IDLE;
        endcase
    end

    always @(*) begin
        detect_out = (state == ACTIVE) && (!in_bit);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, in_bit: 0, detect_out: 0 },
        { time: 5, clk: 1, reset: 1, in_bit: 0, detect_out: 0 },
        { time: 10, clk: 0, reset: 0, in_bit: 1, detect_out: 0 },
        { time: 15, clk: 1, reset: 0, in_bit: 1, detect_out: 0 }, // State transitions to ACTIVE
        { time: 20, clk: 0, reset: 0, in_bit: 0, detect_out: 1 }, // in_bit falls to 0. Output reacts immediately!
        { time: 25, clk: 1, reset: 0, in_bit: 0, detect_out: 0 }, // State transitions back to IDLE
        { time: 30, clk: 0, reset: 0, in_bit: 0, detect_out: 0 }
      ],

      hints: {
        he: "ממשו את detect_out כצירוף של המצב והכניסה הנוכחית: detect_out = (state == ACTIVE) && (!in_bit);",
        en: "Implement detect_out as a combination of the current state and input: detect_out = (state == ACTIVE) && (!in_bit);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 60: One-Hot vs Binary Encoding
    // --------------------------------------------------------------------------
    {
      id: 60,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "קידוד One-Hot מול קידוד בינארי 🔠",
      titleEn: "One-Hot vs Binary Encoding",

      explanationHe: `
<h3>1. ייצוג מצבים ברשמים (State Encoding) 🔠</h3>
<p>כאשר אנו מגדירים מצבים במכונת מצבים, הסימולטור והסינתיזטור צריכים לתרגם אותם לייצוג בינארי (0 ו-1) באוגרים הפיזיים (Flip-Flops). ישנן שתי שיטות עיקריות לייצוג זה:</p>

<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg); border-bottom: 2px solid var(--border-color);">
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: right;">תכונה</th>
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: right;">קידוד בינארי (Binary)</th>
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: right;">קידוד One-Hot</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>מספר דלגלגים (FFs)</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><code dir="ltr">log2(N)</code> (מינימלי)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><code dir="ltr">N</code> (רב)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>לוגיקה קומבינטורית</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">עמוקה ומורכבת (מפענחים)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">שטוחה ופשוטה מאוד</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>מהירות מרבית (Fmax)</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">נמוכה יותר במכונות גדולות</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">גבוהה מאוד (דילוג מהיר)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>התאמה לחומרה</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">ASIC (חסכון בשטח)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">FPGA (משופע ב-FFs)</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. השוואה דוגמתית 📐</h3>
<p>נניח שיש לנו 3 מצבים במכונה. בקידודים שונים הם יראו כך:</p>
<ul>
  <li><strong>בינארי</strong>: מצב 1 הוא <code>2'b00</code>, מצב 2 הוא <code>2'b01</code>, ומצב 3 הוא <code>2'b10</code> (נדרשים 2 ביטים).</li>
  <li><strong>One-Hot</strong>: מצב 1 הוא <code>3'b001</code>, מצב 2 הוא <code>3'b010</code>, ומצב 3 הוא <code>3'b100</code> (נדרשים 3 ביטים, ביט אחד בדיוק דולק בכל רגע).</li>
</ul>

<p>בקידוד One-Hot, כדי לבדוק האם אנו במצב 3, אין צורך להשתמש בשער לוגי שישווה את שני הביטים (<code>state == 2'b10</code>), אלא פשוט בודקים את הביט השלישי של אוגר המצב: <code>state[2]</code>.</p>
      `,

      explanationEn: `
<h3>1. State Encoding Techniques 🔠</h3>
<p>When implementing state machines, symbolic states must be mapped to physical registers (flip-flops) as binary values. There are two common ways to represent states in hardware:</p>

<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg); border-bottom: 2px solid var(--border-color);">
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: left;">Feature</th>
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: left;">Binary Encoding</th>
      <th style="padding: 8px; border: 1px solid var(--border-color); text-align: left;">One-Hot Encoding</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Register Count (FFs)</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><code dir="ltr">log2(N)</code> (Minimal)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><code dir="ltr">N</code> (High)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Combinational Logic</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">Deep & complex (requires decoders)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">Shallow & simple (checks 1 bit)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Max Frequency (Fmax)</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">Lower due to deep gate delays</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">Higher due to fast path decoding</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Optimization Target</strong></td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">ASIC (silicon area efficiency)</td>
      <td style="padding: 8px; border: 1px solid var(--border-color);">FPGA (rich in registers)</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Comparative Example 📐</h3>
<p>For an FSM with 3 states, the encodings differ as follows:</p>
<ul>
  <li><strong>Binary</strong>: State 1 is <code>2'b00</code>, State 2 is <code>2'b01</code>, and State 3 is <code>2'b10</code> (uses 2 flip-flops).</li>
  <li><strong>One-Hot</strong>: State 1 is <code>3'b001</code>, State 2 is <code>3'b010</code>, and State 3 is <code>3'b100</code> (uses 3 flip-flops; exactly one bit is high at any time).</li>
</ul>
<p>In One-Hot, checking if the FSM is in State 3 is simplified from a multi-bit comparison (<code>state == 2'b10</code>) to checking a single bit (<code>state[2]</code>).</p>
      `,

      taskHe: `ממשו מכונת מצבים בת 3 מצבים המשתמשת בקידוד One-Hot ידני:
- <code dir="ltr">STATE_A = 3'b001</code>
- <code dir="ltr">STATE_B = 3'b010</code>
- <code dir="ltr">STATE_C = 3'b100</code>

כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">go</code>.
יציאות: <code dir="ltr">out_bus</code> (3 ביטים, מציג את ערך ה-state הנוכחי), ו-<code dir="ltr">done</code> (ביט יחיד, עולה ל-1 **רק במצב STATE_C**).

לוגיקת המעברים:
- מ-<code dir="ltr">STATE_A</code>: אם <code dir="ltr">go == 1</code> עוברים ל-<code dir="ltr">STATE_B</code>, אחרת נשארים ב-<code dir="ltr">STATE_A</code>.
- מ-<code dir="ltr">STATE_B</code>: עוברים ל-<code dir="ltr">STATE_C</code> ללא תנאי (במחזור הבא).
- מ-<code dir="ltr">STATE_C</code>: עוברים חזרה ל-<code dir="ltr">STATE_A</code> ללא תנאי (במחזור הבא).

הקפידו על הגדרת אוגר מצב בגודל מתאים (3 ביטים).`,
      taskEn: `Implement a 3-state FSM using manual One-Hot encoding:
- <code dir="ltr">STATE_A = 3'b001</code>
- <code dir="ltr">STATE_B = 3'b010</code>
- <code dir="ltr">STATE_C = 3'b100</code>

Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">go</code>.
Outputs: <code dir="ltr">out_bus</code> (3-bit register representing the current state value), and <code dir="ltr">done</code> (1-bit, high **only in STATE_C**).

Transitions:
- From <code dir="ltr">STATE_A</code>: If <code dir="ltr">go == 1</code> transition to <code dir="ltr">STATE_B</code>, else stay in <code dir="ltr">STATE_A</code>.
- From <code dir="ltr">STATE_B</code>: Transition to <code dir="ltr">STATE_C</code> unconditionally.
- From <code dir="ltr">STATE_C</code>: Transition back to <code dir="ltr">STATE_A</code> unconditionally.

Make sure your state registers are declared with a width of 3 bits.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input go,
    output reg [2:0] out_bus,
    output reg done
);
    localparam STATE_A = 3'b001;
    localparam STATE_B = 3'b010;
    localparam STATE_C = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    // כתבו את מכונת ה-One-Hot כאן / Write your One-Hot FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input go,
    output reg [2:0] out_bus,
    output reg done
);
    localparam STATE_A = 3'b001;
    localparam STATE_B = 3'b010;
    localparam STATE_C = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= STATE_A;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            STATE_A: next_state = go ? STATE_B : STATE_A;
            STATE_B: next_state = STATE_C;
            STATE_C: next_state = STATE_A;
            default: next_state = STATE_A;
        endcase
    end

    always @(*) begin
        out_bus = state;
        done = (state == STATE_C);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, go: 0, out_bus: 1, done: 0 },
        { time: 5, clk: 1, reset: 1, go: 0, out_bus: 1, done: 0 }, // Reset to STATE_A (3'b001)
        { time: 10, clk: 0, reset: 0, go: 1, out_bus: 1, done: 0 },
        { time: 15, clk: 1, reset: 0, go: 1, out_bus: 2, done: 0 }, // Transitions to STATE_B (3'b010)
        { time: 20, clk: 0, reset: 0, go: 0, out_bus: 2, done: 0 },
        { time: 25, clk: 1, reset: 0, go: 0, out_bus: 4, done: 1 }, // Transitions to STATE_C (3'b100, done=1)
        { time: 30, clk: 0, reset: 0, go: 0, out_bus: 4, done: 1 },
        { time: 35, clk: 1, reset: 0, go: 0, out_bus: 1, done: 0 }  // Transitions back to STATE_A
      ],

      hints: {
        he: "בקידוד One-Hot, גודל רשם המצב הוא 3 ביטים: reg [2:0] state, next_state. המעברים מתבצעים באמצעות השוואה לערכי localparam המוגדרים.",
        en: "In One-Hot encoding, the state register width is 3 bits: reg [2:0] state, next_state. Implement transitions comparing to the defined localparams."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 61: Sequence Detector "11"
    // --------------------------------------------------------------------------
    {
      id: 61,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "גלאי רצף \"11\" (חופף) 🔍",
      titleEn: "Sequence Detector \"11\" (Overlapping)",

      explanationHe: `
<h3>1. מהו גלאי רצף חופף? 🔍</h3>
<p>גלאי רצף הוא מעגל דיגיטלי שמנטר זרם ביטים טורי (bit-stream) המגיע בכניסה (ביט אחד בכל פעימת שעון), ומעלה את היציאה ל-1 כאשר הוא מזהה תבנית ספציפית.</p>
<p>ב-<strong>גלאי רצף חופף (Overlapping Sequence Detector)</strong>, הביטים האחרונים של רצף שזוהה בהצלחה יכולים לשמש כביטים הראשונים של הרצף הבא.</p>

<p>לדוגמה, עבור זיהוי הרצף "11":</p>
<ul>
  <li>זרם כניסה: <code>0 -> 1 -> 1 -> 1 -> 0</code></li>
  <li>התנהגות חופפת: בפעימה השלישית נקלט 1, המהווה "11" עם ה-1 הקודם (זיהוי ראשון). בפעימה הרביעית נקלט עוד 1, המהווה "11" עם ה-1 שלפניו (זיהוי שני!). היציאה תישאר 1.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דיאגרמת מצבים של גלאי חופף 📐</h3>
<p>נצטרך 3 מצבים:</p>
<ol>
  <li><code>S_RESET</code>: לא קלטנו אף ביט '1'.</li>
  <li><code>S_1</code>: קלטנו ביט '1' יחיד.</li>
  <li><code>S_11</code>: קלטנו לפחות שני '1' ברצף (היציאה היא 1). אם נקלט '1' נוסף, נשארים ב-<code>S_11</code> כי ה-'1' החדש יחד עם ה-'1' הנוכחי עדיין יוצרים את הרצף "11".</li>
</ol>
      `,

      explanationEn: `
<h3>1. What is an Overlapping Sequence Detector? 🔍</h3>
<p>A sequence detector is a sequential circuit that monitors a serial input data stream (one bit per clock cycle) and raises an output signal when a target pattern is matched.</p>
<p>In an <strong>Overlapping Sequence Detector</strong>, the last bit(s) of a completed sequence can be reused as the beginning of the next pattern.</p>

<p>For example, detecting the pattern "11":</p>
<ul>
  <li>Input stream: <code>0 -> 1 -> 1 -> 1 -> 0</code></li>
  <li>Overlapping behavior: Cycle 3 detects "11" (first match). Cycle 4 detects another "11" by combining the current '1' with the previous '1' (second match!). The output remains high.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Overlapping State Architecture 📐</h3>
<p>To detect "11" with overlap, we define 3 states:</p>
<ol>
  <li><code>S_RESET</code>: No '1's received yet.</li>
  <li><code>S_1</code>: Exactly one '1' received.</li>
  <li><code>S_11</code>: Two or more consecutive '1's received (output is 1). If another '1' is received, we remain in <code>S_11</code> since the overlap condition holds.</li>
</ol>
      `,

      taskHe: `ממשו גלאי רצף חופף עבור התבנית "11".
כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">din</code>.
יציאה: <code dir="ltr">dout</code>.
המצבים מוגדרים כ:
- <code dir="ltr">S_RESET = 2'b00</code>: מצב התחלתי. אם <code dir="ltr">din == 1</code> עובר ל-<code dir="ltr">S_1</code>.
- <code dir="ltr">S_1 = 2'b01</code>: נקלט ביט '1'. אם <code dir="ltr">din == 1</code> עובר ל-<code dir="ltr">S_11</code>, אחרת חוזר ל-<code dir="ltr">S_RESET</code>.
- <code dir="ltr">S_11 = 2'b10</code>: נקלט הרצף "11" (היציאה <code dir="ltr">dout</code> צריכה להיות 1 רק במצב זה). אם <code dir="ltr">din == 1</code>, המערכת נשארת ב-<code dir="ltr">S_11</code> (כיוון שזהו גלאי חופף), אחרת חוזרת ל-<code dir="ltr">S_RESET</code>.`,
      taskEn: `Design an overlapping sequence detector for the pattern "11".
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">din</code>.
Output: <code dir="ltr">dout</code>.
States:
- <code dir="ltr">S_RESET = 2'b00</code>: Default state. If <code dir="ltr">din == 1</code> transition to <code dir="ltr">S_1</code>.
- <code dir="ltr">S_1 = 2'b01</code>: One '1' detected. If <code dir="ltr">din == 1</code> transition to <code dir="ltr">S_11</code>, else return to <code dir="ltr">S_RESET</code>.
- <code dir="ltr">S_11 = 2'b10</code>: Target sequence "11" detected (output <code dir="ltr">dout</code> is high only in this state). If <code dir="ltr">din == 1</code>, the state remains in <code dir="ltr">S_11</code> (overlapping), else transition back to <code dir="ltr">S_RESET</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 2'b00;
    localparam S_1     = 2'b01;
    localparam S_11    = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    // כתבו את גלאי הרצף כאן / Write your Sequence Detector here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 2'b00;
    localparam S_1     = 2'b01;
    localparam S_11    = 2'b10;

    reg [1:0] state;
    reg [1:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= S_RESET;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            S_RESET: next_state = din ? S_1  : S_RESET;
            S_1:     next_state = din ? S_11 : S_RESET;
            S_11:    next_state = din ? S_11 : S_RESET;
            default: next_state = S_RESET;
        endcase
    end

    always @(*) begin
        dout = (state == S_11);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, din: 0, dout: 0 },
        { time: 5, clk: 1, reset: 1, din: 0, dout: 0 }, // Reset to S_RESET
        { time: 10, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 15, clk: 1, reset: 0, din: 1, dout: 0 }, // Transitions to S_1
        { time: 20, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 25, clk: 1, reset: 0, din: 1, dout: 1 }, // Transitions to S_11 (dout=1)
        { time: 30, clk: 0, reset: 0, din: 1, dout: 1 },
        { time: 35, clk: 1, reset: 0, din: 1, dout: 1 }, // Stays in S_11 (overlap, dout=1)
        { time: 40, clk: 0, reset: 0, din: 0, dout: 1 },
        { time: 45, clk: 1, reset: 0, din: 0, dout: 0 }  // Transitions back to S_RESET (dout=0)
      ],

      hints: {
        he: "במצב S_11, אם din הוא 1, הישארו ב-S_11 על מנת ליישם את החופפיות (overlapping).",
        en: "In state S_11, if din is 1, stay in S_11 to support overlapping detection."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 62: Sequence Detector "1101" (Non-overlapping)
    // --------------------------------------------------------------------------
    {
      id: 62,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "גלאי רצף \"1101\" (לא חופף) 🔍",
      titleEn: "Sequence Detector \"1101\" (Non-overlapping)",

      explanationHe: `
<h3>1. גלאי רצף לא חופף (Non-overlapping Sequence Detector) 🔍</h3>
<p>בשונה מגלאי חופף, ב-<strong>גלאי רצף לא חופף</strong>, ברגע שהרצף זוהה במלואו, כל הביטים שהיו שותפים לרצף זה נחשבים כ-"מנוצלים". המכונה מתחילה את החיפוש הבא לחלוטין מביטים חדשים.</p>

<p>לדוגמה, עבור זיהוי הרצף "1101":</p>
<ul>
  <li>זרם כניסה: <code>1 -> 1 -> 0 -> 1 -> 1 -> 0 -> 1</code></li>
  <li>התנהגות לא-חופפת:
    <ul>
      <li>הארבעה הראשונים <code>1101</code> יוצרים התאמה, והיציאה עולה ל-1 במצב הזיהוי.</li>
      <li>הביט הבא הוא <code>1</code>. מאחר שהמכונה אינה חופפת, ה-<code>1</code> האחרון של הרצף שזוהה זה עתה אינו משמש כביט הראשון של הרצף הבא. עם זאת, הביט החדש (<code>1</code>) עצמו יכול להוות את ההתחלה של רצף חדש! לכן המכונה תעבור ממצב הזיהוי ישירות למצב שקלט ביט <code>1</code> ראשון.</li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תרשים מעבר מצבים 📐</h3>
<p>עבור תבנית "1101", נגדיר 5 מצבים:</p>
<ol>
  <li><code>S_RESET</code> (קלטנו 0 ביטים מתאימים).</li>
  <li><code>S_1</code> (קלטנו '1' ראשון).</li>
  <li><code>S_11</code> (קלטנו "11").</li>
  <li><code>S_110</code> (קלטנו "110").</li>
  <li><code>S_1101</code> (קלטנו "1101" - מצב זיהוי, יציאה = 1).</li>
</ol>
<p>כאשר אנו ב-<code>S_1101</code>:</p>
<ul>
  <li>אם הכניסה הבאה היא <code>1</code>: היא נחשבת כביט 1 תחת חיפוש חדש (מעבר ל-<code>S_1</code>).</li>
  <li>אם הכניסה הבאה היא <code>0</code>: אין התחלה של רצף (מעבר ל-<code>S_RESET</code>).</li>
</ul>
      `,

      explanationEn: `
<h3>1. Non-overlapping Sequence Detection 🔍</h3>
<p>Unlike an overlapping detector, a <strong>Non-overlapping Sequence Detector</strong> completely "consumes" the matched bits once a full sequence is detected. The FSM must start searching for the next pattern from scratch, without reusing previously matched bits.</p>

<p>For example, detecting the pattern "1101":</p>
<ul>
  <li>Input stream: <code>1 -> 1 -> 0 -> 1 -> 1 -> 0 -> 1</code></li>
  <li>Non-overlapping behavior:
    <ul>
      <li>The first four bits <code>1101</code> match, triggering a detection output.</li>
      <li>The fifth bit is <code>1</code>. Because the FSM is non-overlapping, the last '1' of the first sequence cannot be reused. However, the new incoming '1' can still be the first bit of the *next* sequence. Thus, the FSM transitions from the detection state to the single '1' state (not resetting all the way to S_RESET unless input is 0).</li>
    </ul>
  </li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. State Transitions Logic 📐</h3>
<p>For the "1101" pattern, we define 5 states:</p>
<ol>
  <li><code>S_RESET</code>: Got nothing.</li>
  <li><code>S_1</code>: Got '1'.</li>
  <li><code>S_11</code>: Got "11".</li>
  <li><code>S_110</code>: Got "110".</li>
  <li><code>S_1101</code>: Got "1101" (detection state, output = 1).</li>
</ol>
<p>From <code>S_1101</code> (non-overlapping transition):</p>
<ul>
  <li>If next input is <code>1</code>: transition to <code>S_1</code> (since this '1' can start a new sequence).</li>
  <li>If next input is <code>0</code>: transition to <code>S_RESET</code>.</li>
</ul>
      `,

      taskHe: `ממשו גלאי רצף לא חופף עבור התבנית "1101".
כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">din</code>.
יציאה: <code dir="ltr">dout</code>.
המצבים מוגדרים כך:
- <code dir="ltr">S_RESET = 3'b000</code>: מצב איפוס.
- <code dir="ltr">S_1 = 3'b001</code>: זיהה ביט '1'.
- <code dir="ltr">S_11 = 3'b010</code>: זיהה רצף "11".
- <code dir="ltr">S_110 = 3'b011</code>: זיהה רצף "110".
- <code dir="ltr">S_1101 = 3'b100</code>: זיהה רצף מלא "1101" (היציאה <code dir="ltr">dout = 1</code>).

הנחיות למעברים מיוחדים:
- מ-<code dir="ltr">S_11</code>: אם <code dir="ltr">din == 1</code> נשארים ב-<code dir="ltr">S_11</code>. אם <code dir="ltr">din == 0</code> עוברים ל-<code dir="ltr">S_110</code>.
- מ-<code dir="ltr">S_1101</code> (מצב לא חופף):
  - אם <code dir="ltr">din == 1</code> עוברים ל-<code dir="ltr">S_1</code> (תחילת רצף חדש).
  - אם <code dir="ltr">din == 0</code> עוברים ל-<code dir="ltr">S_RESET</code>.`,
      taskEn: `Implement a non-overlapping sequence detector for the pattern "1101".
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">din</code>.
Output: <code dir="ltr">dout</code>.
States:
- <code dir="ltr">S_RESET = 3'b000</code>: Reset/Idle state.
- <code dir="ltr">S_1 = 3'b001</code>: Detected first '1'.
- <code dir="ltr">S_11 = 3'b010</code>: Detected "11".
- <code dir="ltr">S_110 = 3'b011</code>: Detected "110".
- <code dir="ltr">S_1101 = 3'b100</code>: Detected full sequence "1101" (output <code dir="ltr">dout = 1</code>).

Transition Rules:
- From <code dir="ltr">S_11</code>: If <code dir="ltr">din == 1</code> stay in <code dir="ltr">S_11</code>, if <code dir="ltr">din == 0</code> transition to <code dir="ltr">S_110</code>.
- From <code dir="ltr">S_1101</code> (non-overlapping reset):
  - If <code dir="ltr">din == 1</code> transition to <code dir="ltr">S_1</code> (starts the next sequence).
  - If <code dir="ltr">din == 0</code> transition to <code dir="ltr">S_RESET</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 3'b000;
    localparam S_1     = 3'b001;
    localparam S_11    = 3'b010;
    localparam S_110   = 3'b011;
    localparam S_1101  = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    // כתבו את גלאי הרצף כאן / Write your Sequence Detector here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 3'b000;
    localparam S_1     = 3'b001;
    localparam S_11    = 3'b010;
    localparam S_110   = 3'b011;
    localparam S_1101  = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= S_RESET;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            S_RESET: next_state = din ? S_1    : S_RESET;
            S_1:     next_state = din ? S_11   : S_RESET;
            S_11:    next_state = din ? S_11   : S_110;
            S_110:   next_state = din ? S_1101 : S_RESET;
            S_1101:  next_state = din ? S_1    : S_RESET;
            default: next_state = S_RESET;
        endcase
    end

    always @(*) begin
        dout = (state == S_1101);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, din: 0, dout: 0 },
        { time: 5, clk: 1, reset: 1, din: 0, dout: 0 }, // Reset to S_RESET
        { time: 10, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 15, clk: 1, reset: 0, din: 1, dout: 0 }, // S_RESET -> S_1
        { time: 20, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 25, clk: 1, reset: 0, din: 1, dout: 0 }, // S_1 -> S_11
        { time: 30, clk: 0, reset: 0, din: 0, dout: 0 },
        { time: 35, clk: 1, reset: 0, din: 0, dout: 0 }, // S_11 -> S_110
        { time: 40, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 45, clk: 1, reset: 0, din: 1, dout: 1 }, // S_110 -> S_1101 (dout=1)
        { time: 50, clk: 0, reset: 0, din: 1, dout: 1 },
        { time: 55, clk: 1, reset: 0, din: 1, dout: 0 }, // S_1101 -> S_1 (non-overlapping match consumes bits, din=1 goes S_1)
        { time: 60, clk: 0, reset: 0, din: 0, dout: 0 },
        { time: 65, clk: 1, reset: 0, din: 0, dout: 0 }  // S_1 -> S_RESET
      ],

      hints: {
        he: "מצב S_1101 מציב dout=1. המעברים ממנו חייבים להיות ל-S_1 (אם din==1) או ל-S_RESET (אם din==0) ללא שימוש חוזר בביטים הקודמים.",
        en: "State S_1101 asserts dout=1. Its transitions must be to S_1 (if din==1) or S_RESET (if din==0) to avoid reusing completed bits."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 63: Sequence Detector "1011" (Overlapping)
    // --------------------------------------------------------------------------
    {
      id: 63,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "גלאי רצף \"1011\" (חופף) 🔍",
      titleEn: "Sequence Detector \"1011\" (Overlapping)",

      explanationHe: `
<h3>1. גלאי חופף מורכב: הרצף "1011" 🔍</h3>
<p>זיהוי רצפים מורכבים יותר עם חפיפה דורש ניתוח קפדני של הסיומת (Suffix) של הרצף שנקלט במקרה של מעבר לא צפוי או במצב הזיהוי הסופי.</p>
<p>בואו ננתח את זיהוי הרצף <strong>"1011" עם חפיפה</strong>:</p>
<ul>
  <li>נניח שהגענו למצב הזיהוי הסופי: קלטנו <code>1 -> 0 -> 1 -> 1</code> (היציאה היא 1).</li>
  <li>הביט הבא שמגיע הוא <code>0</code>. זרם הביטים הכולל כעת מסתיים ב-<code>...10110</code>.</li>
  <li>נסתכל על הסיומת הארוכה ביותר של המחרוזת הזו שעדיין מהווה תחילת רצף:
    <ul>
      <li>הסיומת היא <code>10</code>. מאחר ו-<code>10</code> הוא תחילתו של הרצף הבא (אחרי שקלטנו כבר 1 ו-0), אנו עוברים ישירות למצב <code>S_10</code> במקום להתחיל מ-<code>S_RESET</code>! זהו זיהוי חופף.</li>
    </ul>
  </li>
  <li>אם לעומת זאת הביט הבא היה <code>1</code>, הסיומת המקסימלית הייתה <code>1</code>, ולכן היינו עוברים למצב <code>S_1</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. טבלת מעברי המצבים של "1011" 📐</h3>
<ul>
  <li><code>S_RESET</code>: קיבלנו 0. אם din=1 -> S_1.</li>
  <li><code>S_1</code>: קיבלנו "1". אם din=0 -> S_10. אם din=1 -> נשארים ב-S_1 (כי "11" עדיין מסתיים ב-1 שהוא תחילת רצף).</li>
  <li><code>S_10</code>: קיבלנו "10". אם din=1 -> S_101. אם din=0 -> S_RESET (כי קיבלנו "100").</li>
  <li><code>S_101</code>: קיבלנו "101". אם din=1 -> S_1011 (זיהוי!). אם din=0 -> S_10 (כי קיבלנו "1010" שהסיומת שלו היא "10").</li>
  <li><code>S_1011</code> (זיהוי): קיבלנו "1011".
    <ul>
      <li>אם din=0 -> עוברים ל-<code>S_10</code> (חפיפה של "1" האחרון של הרצף וה-"0" החדש).</li>
      <li>אם din=1 -> עוברים ל-<code>S_1</code> (חפיפה של "1" האחרון של הרצף וה-"1" החדש).</li>
    </ul>
  </li>
</ul>
      `,

      explanationEn: `
<h3>1. Complex Overlapping Detector: "1011" 🔍</h3>
<p>Designing an overlapping detector for longer patterns requires analyzing the suffixes of the received bits to find the longest matching state when transitions occur.</p>
<p>Let's analyze the <strong>"1011" overlapping detector</strong>:</p>
<ul>
  <li>Assume we successfully matched the pattern: we received <code>1 -> 0 -> 1 -> 1</code> (current state is the detection state, output = 1).</li>
  <li>The next input bit is <code>0</code>. The combined history ends in <code>...10110</code>.</li>
  <li>Find the longest suffix of <code>...10110</code> that is a valid prefix of our pattern "1011":
    <ul>
      <li>The suffix is <code>10</code>. Since <code>10</code> represents a partially matched sequence, we transition directly to the <code>S_10</code> state (instead of resetting to <code>S_RESET</code>). This is a classic overlap reuse.</li>
    </ul>
  </li>
  <li>If the next input bit was <code>1</code>, the longest matching suffix would be <code>1</code>, routing us to <code>S_1</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. State Transition Breakdown 📐</h3>
<ul>
  <li><code>S_RESET</code>: Got nothing. If din=1 -> S_1, else stay.</li>
  <li><code>S_1</code>: Got "1". If din=0 -> S_10. If din=1 -> stay in S_1 (since "11" ends with a valid '1' prefix).</li>
  <li><code>S_10</code>: Got "10". If din=1 -> S_101. If din=0 -> S_RESET (sequence "100" broke pattern).</li>
  <li><code>S_101</code>: Got "101". If din=1 -> S_1011 (Match!). If din=0 -> S_10 (sequence "1010" ends with suffix "10").</li>
  <li><code>S_1011</code> (Detection State):
    <ul>
      <li>If din=0 -> transition to <code>S_10</code> (uses the last '1' from "1011" plus the new '0').</li>
      <li>If din=1 -> transition to <code>S_1</code> (uses the last '1' from "1011" plus the new '1').</li>
    </ul>
  </li>
</ul>
      `,

      taskHe: `ממשו גלאי רצף חופף עבור התבנית "1011".
כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">din</code>.
יציאה: <code dir="ltr">dout</code>.
המצבים מוגדרים כך:
- <code dir="ltr">S_RESET = 3'b000</code>: לא זוהה דבר.
- <code dir="ltr">S_1 = 3'b001</code>: זוהה ביט '1'.
- <code dir="ltr">S_10 = 3'b010</code>: זוהה רצף "10".
- <code dir="ltr">S_101 = 3'b011</code>: זוהה רצף "101".
- <code dir="ltr">S_1011 = 3'b100</code>: זוהה רצף מלא "1011" (היציאה <code dir="ltr">dout = 1</code>).

ממשו את לוגיקת המעברים והחפיפות בבלוקים נפרדים לפי שיטת 3 הבלוקים (או בבלוק קומבינטורי משולב) והקפידו על מעבר חופף תקין מתוך <code dir="ltr">S_1011</code>.`,
      taskEn: `Implement an overlapping sequence detector for the pattern "1011".
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">din</code>.
Output: <code dir="ltr">dout</code>.
States:
- <code dir="ltr">S_RESET = 3'b000</code>: Default state.
- <code dir="ltr">S_1 = 3'b001</code>: Detected '1'.
- <code dir="ltr">S_10 = 3'b010</code>: Detected "10".
- <code dir="ltr">S_101 = 3'b011</code>: Detected "101".
- <code dir="ltr">S_1011 = 3'b100</code>: Detected full sequence "1011" (output <code dir="ltr">dout = 1</code>).

Implement FSM transitions and overlap rules using a clear design style, taking care to route transitions correctly out of <code dir="ltr">S_1011</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 3'b000;
    localparam S_1     = 3'b001;
    localparam S_10    = 3'b010;
    localparam S_101   = 3'b011;
    localparam S_1011  = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    // כתבו את גלאי הרצף כאן / Write your Sequence Detector here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input din,
    output reg dout
);
    localparam S_RESET = 3'b000;
    localparam S_1     = 3'b001;
    localparam S_10    = 3'b010;
    localparam S_101   = 3'b011;
    localparam S_1011  = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= S_RESET;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            S_RESET: next_state = din ? S_1    : S_RESET;
            S_1:     next_state = din ? S_1    : S_10;
            S_10:    next_state = din ? S_101  : S_RESET;
            S_101:   next_state = din ? S_1011 : S_10;
            S_1011:  next_state = din ? S_1    : S_10;
            default: next_state = S_RESET;
        endcase
    end

    always @(*) begin
        dout = (state == S_1011);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, din: 0, dout: 0 },
        { time: 5, clk: 1, reset: 1, din: 0, dout: 0 }, // Reset S_RESET
        { time: 10, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 15, clk: 1, reset: 0, din: 1, dout: 0 }, // S_RESET -> S_1
        { time: 20, clk: 0, reset: 0, din: 0, dout: 0 },
        { time: 25, clk: 1, reset: 0, din: 0, dout: 0 }, // S_1 -> S_10
        { time: 30, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 35, clk: 1, reset: 0, din: 1, dout: 0 }, // S_10 -> S_101
        { time: 40, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 45, clk: 1, reset: 0, din: 1, dout: 1 }, // S_101 -> S_1011 (dout=1)
        { time: 50, clk: 0, reset: 0, din: 0, dout: 1 },
        { time: 55, clk: 1, reset: 0, din: 0, dout: 0 }, // S_1011 -> S_10 (overlapping match! last '1' + new '0' = S_10)
        { time: 60, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 65, clk: 1, reset: 0, din: 1, dout: 0 }, // S_10 -> S_101
        { time: 70, clk: 0, reset: 0, din: 1, dout: 0 },
        { time: 75, clk: 1, reset: 0, din: 1, dout: 1 }  // S_101 -> S_1011 (dout=1)
      ],

      hints: {
        he: "מתוך S_1011, אם din=0 המערכת צריכה לעבור ל-S_10 (חפיפה של '10'), ואם din=1 המערכת צריכה לעבור ל-S_1.",
        en: "From S_1011, if din=0 transition to S_10 (overlapping suffix '10'), and if din=1 transition to S_1."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 64: Traffic Light Controller with Timers
    // --------------------------------------------------------------------------
    {
      id: 64,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "בקר רמזורים משולב טיימרים 🚦",
      titleEn: "Traffic Light Controller with Timers",

      explanationHe: `
<h3>1. מכונות מצבים מבוססות זמן (Time-Dependent FSMs) 🚦</h3>
<p>במערכות דיגיטליות אמיתיות, מעברי מצב לא תמיד מתרחשים מיידית כתלות באירועים חיצוניים בלבד. פעמים רבות המערכת צריכה <strong>להישאר במצב מסוים במשך זמן מוגדר</strong> (למשל, אור ירוק ברמזור למשך 30 שניות).</p>
<p>כמי שמפתח חומרה, תצטרך לשלב רשם <strong>מונה (Counter)</strong> פנימי בתוך המערכת. המונה סופר פעימות שעון, והמכונה עוברת למצב הבא רק כאשר המונה מגיע לערך סף מוגדר מראש. ברגע המעבר, המונה מאופס בחזרה ל-0 כדי להתחיל ספירה מחדש עבור המצב החדש.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ארכיטקטורת המונה הפנימי 📐</h3>
<p>מומלץ לנהל את המונה באותו בלוק שעון רציף של המצב הנוכחי:</p>
<pre dir="ltr"><code>// דוגמה עקרונית לטיימר פנימי
always @(posedge clk) begin
    if (reset) begin
        state <= STATE_IDLE;
        timer <= 0;
    end else begin
        case (state)
            STATE_IDLE: begin
                if (timer == LIMIT_A) begin
                    state <= STATE_BUSY;
                    timer <= 0; // איפוס המונה במעבר
                end else begin
                    timer <= timer + 1;
                end
            end
            // מצבים נוספים...
        endcase
    end
end</code></pre>
      `,

      explanationEn: `
<h3>1. Time-Dependent FSMs & Timers 🚦</h3>
<p>In real-world digital applications, state transitions are often governed by time intervals rather than purely immediate external events (e.g., a traffic light must stay green for a fixed number of seconds).</p>
<p>To design a time-dependent FSM, we integrate an internal <strong>Counter/Timer register</strong>. This counter increments on every clock cycle. The FSM only transitions when the counter reaches a pre-defined threshold. Upon transitioning, the counter is reset to 0 to begin timing the next state.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Internal Counter Architecture 📐</h3>
<p>It is best practice to manage both state updates and counter increments in the same sequential block:</p>
<pre dir="ltr"><code>// Generic time-dependent FSM template
always @(posedge clk) begin
    if (reset) begin
        state <= STATE_IDLE;
        timer <= 0;
    end else begin
        case (state)
            STATE_IDLE: begin
                if (timer == LIMIT_A) begin
                    state <= STATE_BUSY;
                    timer <= 0; // Reset timer on state transition
                end else begin
                    timer <= timer + 1;
                end
            end
            // Additional states...
        endcase
    end
end</code></pre>
      `,

      taskHe: `ממשו בקר רמזורים במודול <code dir="ltr">top_module</code> המבוסס על מונה שעון פנימי המגדיר את משך השהייה בכל מצב:
1. מצב <code dir="ltr">GREEN = 2'b00</code>: נשאר פעיל למשך 4 מחזורי שעון (עבור מונה מ-0 עד 3), ואז עובר ל-<code dir="ltr">YELLOW</code>.
2. מצב <code dir="ltr">YELLOW = 2'b01</code>: נשאר פעיל למשך 2 מחזורי שעון (עבור מונה מ-0 עד 1), ואז עובר ל-<code dir="ltr">RED</code>.
3. מצב <code dir="ltr">RED = 2'b10</code>: נשאר פעיל למשך 4 מחזורי שעון (עבור מונה מ-0 עד 3), ואז עובר ל-<code dir="ltr">GREEN</code>.

כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס סינכרוני המעביר את המערכת ל-<code dir="ltr">RED</code> ומאפס את המונה ל-0).
יציאות: <code dir="ltr">light</code> (אוטובוס של 2 ביטים המציג את ערך המצב הנוכחי: 2'b00 לירוק, 2'b01 לצהוב, 2'b10 לאדום).

רמז: השתמשו ברשם מונה פנימי <code dir="ltr">reg [1:0] counter</code> שמוגדר במודול לצד המצב.`,
      taskEn: `Implement a Traffic Light Controller inside <code dir="ltr">top_module</code> using an internal clock cycle counter to time state transitions:
1. <code dir="ltr">GREEN = 2'b00</code>: Stays active for 4 clock cycles (counter counts from 0 to 3), then transitions to <code dir="ltr">YELLOW</code>.
2. <code dir="ltr">YELLOW = 2'b01</code>: Stays active for 2 clock cycles (counter counts from 0 to 1), then transitions to <code dir="ltr">RED</code>.
3. <code dir="ltr">RED = 2'b10</code>: Stays active for 4 clock cycles (counter counts from 0 to 3), then transitions to <code dir="ltr">GREEN</code>.

Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous reset which forces the FSM to state <code dir="ltr">RED</code> and resets the counter to 0).
Output: <code dir="ltr">light</code> (2-bit bus reflecting the current state: 2'b00 for Green, 2'b01 for Yellow, 2'b10 for Red).

Tip: Declare and update an internal register <code dir="ltr">reg [1:0] counter</code> to track the cycles.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    output reg [1:0] light
);
    localparam GREEN  = 2'b00;
    localparam YELLOW = 2'b01;
    localparam RED    = 2'b10;

    reg [1:0] state;
    reg [1:0] counter;

    // כתבו את בקר הרמזורים עם הטיימר כאן / Write your Traffic Light FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    output reg [1:0] light
);
    localparam GREEN  = 2'b00;
    localparam YELLOW = 2'b01;
    localparam RED    = 2'b10;

    reg [1:0] state;
    reg [1:0] counter;

    always @(posedge clk) begin
        if (reset) begin
            state <= RED;
            counter <= 2'b00;
        end else begin
            case (state)
                RED: begin
                    if (counter == 2'd3) begin
                        state <= GREEN;
                        counter <= 2'b00;
                    end else begin
                        counter <= counter + 1'b1;
                    end
                end
                GREEN: begin
                    if (counter == 2'd3) begin
                        state <= YELLOW;
                        counter <= 2'b00;
                    end else begin
                        counter <= counter + 1'b1;
                    end
                end
                YELLOW: begin
                    if (counter == 2'd1) begin
                        state <= RED;
                        counter <= 2'b00;
                    end else begin
                        counter <= counter + 1'b1;
                    end
                end
                default: begin
                    state <= RED;
                    counter <= 2'b00;
                end
            endcase
        end
    end

    always @(*) begin
        light = state;
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, light: 2 }, // Starts in RED
        { time: 5, clk: 1, reset: 1, light: 2 }, // Reset sets counter=0, state=RED
        { time: 10, clk: 0, reset: 0, light: 2 },
        { time: 15, clk: 1, reset: 0, light: 2 }, // RED cycle 1 (counter -> 1)
        { time: 20, clk: 0, reset: 0, light: 2 },
        { time: 25, clk: 1, reset: 0, light: 2 }, // RED cycle 2 (counter -> 2)
        { time: 30, clk: 0, reset: 0, light: 2 },
        { time: 35, clk: 1, reset: 0, light: 2 }, // RED cycle 3 (counter -> 3)
        { time: 40, clk: 0, reset: 0, light: 2 },
        { time: 45, clk: 1, reset: 0, light: 0 }, // Transition to GREEN, counter -> 0
        { time: 50, clk: 0, reset: 0, light: 0 },
        { time: 55, clk: 1, reset: 0, light: 0 }, // GREEN cycle 1 (counter -> 1)
        { time: 60, clk: 0, reset: 0, light: 0 },
        { time: 65, clk: 1, reset: 0, light: 0 }, // GREEN cycle 2 (counter -> 2)
        { time: 70, clk: 0, reset: 0, light: 0 },
        { time: 75, clk: 1, reset: 0, light: 0 }, // GREEN cycle 3 (counter -> 3)
        { time: 80, clk: 0, reset: 0, light: 0 },
        { time: 85, clk: 1, reset: 0, light: 1 }, // Transition to YELLOW, counter -> 0
        { time: 90, clk: 0, reset: 0, light: 1 },
        { time: 95, clk: 1, reset: 0, light: 1 }, // YELLOW cycle 1 (counter -> 1)
        { time: 100, clk: 0, reset: 0, light: 1 },
        { time: 105, clk: 1, reset: 0, light: 2 } // Transition back to RED, counter -> 0
      ],

      hints: {
        he: "בתוך בלוק always @(posedge clk), נהלו את הערך של counter עבור כל מצב. זכרו לאפס את counter <= 0 בכל פעם שמתבצע מעבר למצב חדש.",
        en: "Inside the always @(posedge clk) block, manage counter for each state. Remember to reset counter <= 0 whenever a state transition occurs."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 65: Vending Machine FSM
    // --------------------------------------------------------------------------
    {
      id: 65,
      chapter: 8,
      chapterTitleHe: "פרק 8: מכונות מצבים (FSM) ועיצוב מערכות",
      chapterTitleEn: "Chapter 8: Finite State Machines (FSM) & System Design",
      titleHe: "מכונת ממכר אוטומטית (Vending Machine FSM) 🪙",
      titleEn: "Vending Machine FSM",

      explanationHe: `
<h3>1. תכנון מכונת ממכר אוטומטית (Vending Machine) בחומרה 🪙</h3>
<p>מכונת ממכר היא דוגמה קלאסית ל-FSM המנהל עסקאות ויתרה כספית. המכונה שומרת את <strong>היתרה שנצברה (Credit)</strong> כמצבים של המכונה, ומאפשרת מעבר בין המצבים על סמך הכנסת מטבעות שונים.</p>

<p>נניח שיש לנו את המפרט הבא:</p>
<ul>
  <li>מחיר המוצר: 15 סנט.</li>
  <li>המכונה מקבלת מטבעות של 5 סנט ו-10 סנט בלבד.</li>
  <li>היציאות הן: <code>dispense</code> (אספקת המוצר) ו-<code>change</code> (החזרת עודף של 5 סנט).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הגדרת המצבים וטבלת מעברים 📐</h3>
<p>נגדיר את המצבים לפי יתרת הכסף הצבורה בסנטים:</p>
<ol>
  <li><code>S_0</code>: יתרה של 0 סנט.</li>
  <li><code>S_5</code>: יתרה של 5 סנט.</li>
  <li><code>S_10</code>: יתרה של 10 סנט.</li>
  <li><code>S_15</code>: יתרה של 15 סנט (המוצר מסופק, אין עודף).</li>
  <li><code>S_20</code>: יתרה של 20 סנט (המוצר מסופק + החזרת עודף של 5 סנט).</li>
</ol>
<p>שימו לב: כאשר המערכת מגיעה למצבים <code>S_15</code> או <code>S_20</code>, המוצר מסופק מיידית (או במחזור השעון הבא). במחזור השעון הבא, המכונה חוזרת באופן <strong>חיוני וללא תנאי</strong> למצב ההתחלתי <code>S_0</code>, ומתעלמת ממטבעות שהוכנסו בזמן ביצוע האספקה כדי למנוע טעויות חישוב.</p>
      `,

      explanationEn: `
<h3>1. Hardware Vending Machine FSM Design 🪙</h3>
<p>A vending machine is a classic FSM design problem representing a transaction system. The machine tracks the <strong>accumulated credit</strong> as FSM states and transitions based on the values of the deposited coins.</p>

<p>Consider the following specification:</p>
<ul>
  <li>Product cost: 15 cents.</li>
  <li>Accepted coins: Nickels (5 cents) and Dimes (10 cents).</li>
  <li>Outputs: <code>dispense</code> (release item) and <code>change</code> (return 5-cent nickel).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. State & Transition Layout 📐</h3>
<p>We represent the accumulated money as states:</p>
<ol>
  <li><code>S_0</code>: 0 cents credit.</li>
  <li><code>S_5</code>: 5 cents credit.</li>
  <li><code>S_10</code>: 10 cents credit.</li>
  <li><code>S_15</code>: 15 cents credit (dispense item, no change).</li>
  <li><code>S_20</code>: 20 cents credit (dispense item + return 5 cents change).</li>
</ol>
<p>System Rule: Once the FSM transitions to <code>S_15</code> or <code>S_20</code>, the output registers trigger. On the very next clock cycle, the FSM must return to <code>S_0</code> <strong>unconditionally</strong>, ignoring any newly deposited coins during the dispense phase to avoid double charging.</p>
      `,

      taskHe: `ממשו מכונת ממכר אוטומטית (Vending Machine).
מחיר מוצר הוא 15 סנט. המכונה מקבלת מטבעות של 5 סנט ו-10 סנט.
כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (סינכרוני), <code dir="ltr">[1:0] coin</code> (קידוד: <code dir="ltr">2'b00</code> ללא מטבע, <code dir="ltr">2'b01</code> מטבע של 5 סנט, <code dir="ltr">2'b10</code> מטבע של 10 סנט, <code dir="ltr">2'b11</code> לא חוקי/להתעלם).
יציאות: <code dir="ltr">dispense</code> (שווה ל-1 רק במצבים S_15 ו-S_20), <code dir="ltr">change</code> (שווה ל-1 רק במצב S_20).

המצבים:
- <code dir="ltr">S_0 = 3'b000</code> (יתרה 0)
- <code dir="ltr">S_5 = 3'b001</code> (יתרה 5)
- <code dir="ltr">S_10 = 3'b010</code> (יתרה 10)
- <code dir="ltr">S_15 = 3'b011</code> (יתרה 15 - אספקה ללא עודף)
- <code dir="ltr">S_20 = 3'b100</code> (יתרה 20 - אספקה והחזרת עודף של 5 סנט)

מעברים:
- מ-<code dir="ltr">S_0</code>: מטבע 5 סנט -> <code dir="ltr">S_5</code>, מטבע 10 סנט -> <code dir="ltr">S_10</code>.
- מ-<code dir="ltr">S_5</code>: מטבע 5 סנט -> <code dir="ltr">S_10</code>, מטבע 10 סנט -> <code dir="ltr">S_15</code>.
- מ-<code dir="ltr">S_10</code>: מטבע 5 סנט -> <code dir="ltr">S_15</code>, מטבע 10 סנט -> <code dir="ltr">S_20</code>.
- מ-<code dir="ltr">S_15</code> ו-<code dir="ltr">S_20</code>: חוזרים ל-<code dir="ltr">S_0</code> ללא תנאי במחזור הבא (התעלמו מהכניסה <code dir="ltr">coin</code> במצב זה).`,
      taskEn: `Design a Vending Machine FSM.
The product cost is 15 cents. The machine accepts Nickels (5 cents) and Dimes (10 cents).
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous), <code dir="ltr">[1:0] coin</code> (encoding: <code dir="ltr">2'b00</code> = no coin, <code dir="ltr">2'b01</code> = 5 cents, <code dir="ltr">2'b10</code> = 10 cents, <code dir="ltr">2'b11</code> is ignored).
Outputs: <code dir="ltr">dispense</code> (high only in S_15 and S_20), <code dir="ltr">change</code> (high only in S_20).

States:
- <code dir="ltr">S_0 = 3'b000</code> (0 cents credit)
- <code dir="ltr">S_5 = 3'b001</code> (5 cents credit)
- <code dir="ltr">S_10 = 3'b010</code> (10 cents credit)
- <code dir="ltr">S_15 = 3'b011</code> (15 cents credit - dispenses item, no change)
- <code dir="ltr">S_20 = 3'b100</code> (20 cents credit - dispenses item, returns 5 cents change)

Transitions:
- From <code dir="ltr">S_0</code>: coin = 5c -> <code dir="ltr">S_5</code>, coin = 10c -> <code dir="ltr">S_10</code>.
- From <code dir="ltr">S_5</code>: coin = 5c -> <code dir="ltr">S_10</code>, coin = 10c -> <code dir="ltr">S_15</code>.
- From <code dir="ltr">S_10</code>: coin = 5c -> <code dir="ltr">S_15</code>, coin = 10c -> <code dir="ltr">S_20</code>.
- From <code dir="ltr">S_15</code> and <code dir="ltr">S_20</code>: transition back to <code dir="ltr">S_0</code> unconditionally on the next clock edge (ignoring input coin).`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input [1:0] coin,
    output reg dispense,
    output reg change
);
    localparam S_0  = 3'b000;
    localparam S_5  = 3'b001;
    localparam S_10 = 3'b010;
    localparam S_15 = 3'b011;
    localparam S_20 = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    // כתבו את מכונת הממכר כאן / Write your Vending Machine FSM here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input [1:0] coin,
    output reg dispense,
    output reg change
);
    localparam S_0  = 3'b000;
    localparam S_5  = 3'b001;
    localparam S_10 = 3'b010;
    localparam S_15 = 3'b011;
    localparam S_20 = 3'b100;

    reg [2:0] state;
    reg [2:0] next_state;

    always @(posedge clk) begin
        if (reset) begin
            state <= S_0;
        end else begin
            state <= next_state;
        end
    end

    always @(*) begin
        case (state)
            S_0: begin
                if (coin == 2'b01)      next_state = S_5;
                else if (coin == 2'b10) next_state = S_10;
                else                    next_state = S_0;
            end
            S_5: begin
                if (coin == 2'b01)      next_state = S_10;
                else if (coin == 2'b10) next_state = S_15;
                else                    next_state = S_5;
            end
            S_10: begin
                if (coin == 2'b01)      next_state = S_15;
                else if (coin == 2'b10) next_state = S_20;
                else                    next_state = S_10;
            end
            S_15: begin
                next_state = S_0;
            end
            S_20: begin
                next_state = S_0;
            end
            default: next_state = S_0;
        endcase
    end

    always @(*) begin
        dispense = (state == S_15) || (state == S_20);
        change   = (state == S_20);
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, coin: 0, dispense: 0, change: 0 },
        { time: 5, clk: 1, reset: 1, coin: 0, dispense: 0, change: 0 }, // Reset to S_0
        { time: 10, clk: 0, reset: 0, coin: 2, dispense: 0, change: 0 }, // Insert 10c (coin = 2'b10)
        { time: 15, clk: 1, reset: 0, coin: 2, dispense: 0, change: 0 }, // S_0 -> S_10
        { time: 20, clk: 0, reset: 0, coin: 1, dispense: 0, change: 0 }, // Insert 5c (coin = 2'b01)
        { time: 25, clk: 1, reset: 0, coin: 1, dispense: 1, change: 0 }, // S_10 -> S_15 (dispense = 1)
        { time: 30, clk: 0, reset: 0, coin: 2, dispense: 1, change: 0 }, // Input coin ignored while in S_15
        { time: 35, clk: 1, reset: 0, coin: 2, dispense: 0, change: 0 }, // S_15 -> S_0
        { time: 40, clk: 0, reset: 0, coin: 2, dispense: 0, change: 0 }, // Insert 10c
        { time: 45, clk: 1, reset: 0, coin: 2, dispense: 0, change: 0 }, // S_0 -> S_10
        { time: 50, clk: 0, reset: 0, coin: 2, dispense: 0, change: 0 }, // Insert another 10c
        { time: 55, clk: 1, reset: 0, coin: 2, dispense: 1, change: 1 }, // S_10 -> S_20 (dispense = 1, change = 1)
        { time: 60, clk: 0, reset: 0, coin: 0, dispense: 1, change: 1 },
        { time: 65, clk: 1, reset: 0, coin: 0, dispense: 0, change: 0 }  // S_20 -> S_0
      ],

      hints: {
        he: "במצבים S_15 ו-S_20, המצב הבא צריך להיות S_0 ללא תלות בכניסת coin. היציאות נקבעות בהתאם למצב הנוכחי.",
        en: "In states S_15 and S_20, next_state must be S_0 regardless of the coin input. Drive outputs based on the current state."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
