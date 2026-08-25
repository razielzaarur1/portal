(function() {
  const chapter13Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 93: Pipelining Principles & Throughput
    // --------------------------------------------------------------------------
    {
      id: 93,
      chapter: 13,
      chapterTitleHe: "פרק 13: מעבדים מרובי שלבים ופייפליין (Pipelining)",
      chapterTitleEn: "Chapter 13: Pipelining & Pipelined Processors",
      titleHe: "עקרונות פייפליין וקצב עיבוד (Throughput) 🚀",
      titleEn: "Pipelining Principles & Throughput",

      explanationHe: `
<h3>1. מהו פייפליין (צינור עיבוד)? 🚀</h3>
<p>חשבו על מכבסה ציבורית המציעה ארבעה שלבים: כביסה (30 דקות), ייבוש (40 דקות), קיפול (15 דקות) וסידור בארון (10 דקות). אם נכבס בשיטה הטורית (הלא-פייפליינית) - נמתין שהבגד הראשון יסיים את כל ארבעת השלבים (95 דקות) לפני שנכניס את הבגד השני למכונת הכביסה. בשיטה זו, ננצל רק מכונה אחת בכל רגע נתון והשאר יעמדו ריקות.</p>
<p>שיטת ה-<strong>Pipelining (פייפליין)</strong> פותרת זאת: ברגע שהבגד הראשון מסיים כביסה ועובר למייבש, נכניס מיד את הבגד השני למכונת הכביסה. ברגע שהבגד הראשון עובר לקיפול, השני עובר למייבש והשלישי נכנס לכביסה. בדרך זו, כל המכונות עובדות במקביל!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. השהיה (Latency) לעומת קצב עיבוד (Throughput) ⏱️</h3>
<p>בעולם החומרה, אנו מודדים ביצועים באמצעות שני מדדים קריטיים:</p>
<ul>
  <li><strong>Latency (השהיה):</strong> הזמן שלוקח לפקודה או לנתון בודד לעבור מתחילת הצינור ועד סופו. בפייפליין של $N$ שלבים, ההשהיה של פקודה בודדת גדלה מעט (בגלל זמני ההתארגנות באוגרים), אך לא משתנה משמעותית.</li>
  <li><strong>Throughput (קצב עיבוד / תפוקה):</strong> מספר הפקודות או התוצאות שמסתיים חישובן ליחידת זמן. בפייפליין אידיאלי, קצב העיבוד שווה לתוצאה אחת <em>בכל מחזור שעון</em>, ללא קשר למספר השלבים!</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. אוגרי פייפליין (Pipeline Registers) 📐</h3>
<p>כדי לחלק מסלול חישוב ארוך ומורכב לשלבים קצרים יותר, אנו שותלים <strong>אוגרי פייפליין (Pipeline Registers)</strong> בין חלקי הלוגיקה הצירופית. האוגרים שומרים את תוצאות הביניים של שלב אחד ומזינים אותן לשלב הבא בעליית השעון הבאה.</p>
<p>הודות לכך, המסלול הקריטי (Critical Path) מתקצר משמעותית. תדר השעון המקסימלי ($f_{max}$) נקבע על פי השלב הצירופי הארוך ביותר בלבד:</p>
<div dir="ltr" style="text-align: center; margin: 1rem 0;">
  <code>f_max = 1 / T_max_stage</code>
</div>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמת קוד: פייפליין פשוט של 2 שלבים 💻</h3>
<p>הדוגמה הבאה מדגימה עיבוד פייפליין של שני שלבים לחישוב $Y = A^2 + B$:</p>
<pre dir="ltr"><code>module pipeline_example (
    input clk,
    input [7:0] a, b,
    output reg [15:0] y
);
    // אוגרי פייפליין ביניים לשלב 1
    reg [15:0] a_squared;
    reg [7:0]  b_reg;

    always @(posedge clk) begin
        // שלב 1: חישוב ריבוע של A ושמירת B
        a_squared <= a * a;
        b_reg     <= b;

        // שלב 2: חישוב הסכום הסופי
        y         <= a_squared + b_reg;
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is Pipelining? 🚀</h3>
<p>Imagine a laundry service with four distinct tasks: washing (30 mins), drying (40 mins), folding (15 mins), and storing (10 mins). In a non-pipelined system, we wait for the first batch of clothes to complete all four stages (95 minutes) before loading the second batch. Most machines sit idle during this process.</p>
<p><strong>Pipelining</strong> parallelizes execution: as soon as the first load of laundry finishes washing and moves to the dryer, the second load enters the washing machine. When the first moves to folding, the second moves to the dryer, and a third enters the washer. Now, all resources run concurrently!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Latency vs. Throughput ⏱️</h3>
<p>In digital design, we define performance using two essential metrics:</p>
<ul>
  <li><strong>Latency:</strong> The total time required for a single instruction/data input to propagate through the entire pipeline.</li>
  <li><strong>Throughput:</strong> The rate at which the system completes instructions/outputs. In an ideal pipeline, we output one result <em>every clock cycle</em>, regardless of how deep the pipeline is.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Pipeline Registers & Clock Frequency 📐</h3>
<p>To divide a complex combinational path into stages, we insert D flip-flops—called <strong>pipeline registers</strong>—at the boundaries. These registers store intermediate computation results on the rising edge of the clock, isolating each stage's combinational logic.</p>
<p>By splitting a long combinational path into $N$ shorter paths, the maximum clock frequency ($f_{max}$) increases since it is constrained only by the longest single stage delay ($T_{max\_stage}$):</p>
<div dir="ltr" style="text-align: center; margin: 1rem 0;">
  <code>f_max = 1 / T_max_stage</code>
</div>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Code Example: Generic 2-Stage Pipeline 💻</h3>
<p>The following example calculates $Y = A^2 + B$ in a 2-stage pipeline:</p>
<pre dir="ltr"><code>module pipeline_example (
    input clk,
    input [7:0] a, b,
    output reg [15:0] y
);
    // Pipeline registers for Stage 1 intermediate results
    reg [15:0] a_squared;
    reg [7:0]  b_reg;

    always @(posedge clk) begin
        // Stage 1: Square A and forward B
        a_squared <= a * a;
        b_reg     <= b;

        // Stage 2: Add squared A and forwarded B
        y         <= a_squared + b_reg;
    end
endmodule</code></pre>
`,

      taskHe: `בנו מודול פייפליין של 3 שלבים המבצע את החישוב הבא: $Y = (A + B) \\times C - D$.
הכניסות הן: <code dir="ltr">clk</code> (שעון), <code dir="ltr">reset</code> (איפוס מסונכרן אקטיבי-גבוה), <code dir="ltr">[7:0] a</code>, <code dir="ltr">[7:0] b</code>, <code dir="ltr">[7:0] c</code>, <code dir="ltr">[7:0] d</code>.
היציאה היא: <code dir="ltr">output reg [15:0] y</code>.

דרישות שלבי הצינור:
1. <strong>שלב 1:</strong> מחשב את הסכום <code dir="ltr">sum_ab <= a + b</code> (הגדירו כאוגר של 9 ביטים כדי למנוע גלישה), ושומר את הכניסות הנדרשות להמשך <code dir="ltr">c</code> ו-<code dir="ltr">d</code> באוגרי השלב הראשון <code dir="ltr">c_r1</code> ו-<code dir="ltr">d_r1</code>.
2. <strong>שלב 2:</strong> מחשב את המכפלה <code dir="ltr">prod <= sum_ab * c_r1</code> (הגדירו כאוגר של 16 ביטים), ושומר את <code dir="ltr">d_r1</code> באוגר השלב השני <code dir="ltr">d_r2</code>.
3. <strong>שלב 3:</strong> מחשב את ההפרש ושומר את התוצאה ביציאה הרשומה: <code dir="ltr">y <= prod - d_r2</code>.

בזמן איפוס (<code dir="ltr">reset</code> שווה 1), יש לאפס את כל אוגרי הביניים ואת היציאה <code dir="ltr">y</code> ל-0.`,

      taskEn: `Design a 3-stage pipelined arithmetic module that calculates $Y = (A + B) \\times C - D$.
Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous active-high), <code dir="ltr">[7:0] a</code>, <code dir="ltr">[7:0] b</code>, <code dir="ltr">[7:0] c</code>, <code dir="ltr">[7:0] d</code>.
Output: <code dir="ltr">output reg [15:0] y</code>.

Pipeline Stage Requirements:
1. <strong>Stage 1:</strong> Compute the sum <code dir="ltr">sum_ab <= a + b</code> (use a 9-bit register to prevent overflow), and register the other inputs: <code dir="ltr">c_r1 <= c</code> and <code dir="ltr">d_r1 <= d</code>.
2. <strong>Stage 2:</strong> Compute the product <code dir="ltr">prod <= sum_ab * c_r1</code> (use a 16-bit register), and forward D: <code dir="ltr">d_r2 <= d_r1</code>.
3. <strong>Stage 3:</strong> Compute the difference and write to the registered output: <code dir="ltr">y <= prod - d_r2</code>.

On <code dir="ltr">reset</code> (synchronous, active-high), clear all intermediate pipeline registers and the output <code dir="ltr">y</code> to 0.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input [7:0] a,
    input [7:0] b,
    input [7:0] c,
    input [7:0] d,
    output reg [15:0] y
);
    // שלב 1: הגדירו אוגרי ביניים / Stage 1: Define intermediate registers
    
    // שלב 2: הגדירו אוגרי ביניים / Stage 2: Define intermediate registers

    // לוגיקת פייפליין בעליית השעון / Pipelined sequential logic
    always @(posedge clk) begin
        if (reset) begin
            // איפוס האוגרים / Reset registers
        end else begin
            // ביצוע השלבים / Pipeline steps
        end
    end
endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input [7:0] a,
    input [7:0] b,
    input [7:0] c,
    input [7:0] d,
    output reg [15:0] y
);
    reg [8:0] sum_ab;
    reg [7:0] c_r1;
    reg [7:0] d_r1;
    reg [15:0] prod;
    reg [7:0] d_r2;

    always @(posedge clk) begin
        if (reset) begin
            sum_ab <= 0;
            c_r1   <= 0;
            d_r1   <= 0;
            prod   <= 0;
            d_r2   <= 0;
            y      <= 0;
        end else begin
            // Stage 1
            sum_ab <= a + b;
            c_r1   <= c;
            d_r1   <= d;

            // Stage 2
            prod   <= sum_ab * c_r1;
            d_r2   <= d_r1;

            // Stage 3
            y      <= prod - d_r2;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, a: 5, b: 3, c: 4, d: 2, y: 0 },
        { time: 5, clk: 1, reset: 1, a: 5, b: 3, c: 4, d: 2, y: 0 },
        { time: 10, clk: 0, reset: 0, a: 5, b: 3, c: 4, d: 2, y: 0 },
        { time: 15, clk: 1, reset: 0, a: 5, b: 3, c: 4, d: 2, y: 0 },
        { time: 20, clk: 0, reset: 0, a: 10, b: 2, c: 3, d: 5, y: 0 },
        { time: 25, clk: 1, reset: 0, a: 10, b: 2, c: 3, d: 5, y: 0 },
        { time: 30, clk: 0, reset: 0, a: 1, b: 1, c: 1, d: 1, y: 0 },
        { time: 35, clk: 1, reset: 0, a: 1, b: 1, c: 1, d: 1, y: 30 },
        { time: 40, clk: 0, reset: 0, a: 0, b: 0, c: 0, d: 0, y: 30 },
        { time: 45, clk: 1, reset: 0, a: 0, b: 0, c: 0, d: 0, y: 31 },
        { time: 50, clk: 0, reset: 0, a: 0, b: 0, c: 0, d: 0, y: 31 },
        { time: 55, clk: 1, reset: 0, a: 0, b: 0, c: 0, d: 0, y: 1 }
      ],

      hints: {
        he: "השתמשו בהשמות לא-חוסמות (<=) בתוך בלוק ה-always. ודאו שאתם שומרים את c ו-d באוגרי ביניים כדי שנתונים מפקודות שונות לא יתערבבו לאורך שלבי החישוב.",
        en: "Use non-blocking assignments (<=) inside the always block. Make sure you register variables like c and d to prevent data mismatch as values flow through the pipeline stages."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 94: 5-Stage RISC-V Pipeline Overview
    // --------------------------------------------------------------------------
    {
      id: 94,
      chapter: 13,
      chapterTitleHe: "פרק 13: מעבדים מרובי שלבים ופייפליין (Pipelining)",
      chapterTitleEn: "Chapter 13: Pipelining & Pipelined Processors",
      titleHe: "סקירה של מעבד RISC-V בעל 5 שלבים 🎛️",
      titleEn: "5-Stage RISC-V Pipeline Overview",

      explanationHe: `
<h3>1. חמשת השלבים של מעבד RISC-V קלאסי 🎛️</h3>
<p>מעבד RISC-V בעל מחזור יחיד (Single-Cycle) מבצע פקודה שלמה במחזור שעון אחד. משמעות הדבר היא שתדר השעון חייב להיות נמוך מאוד כדי לאפשר לפקודה האיטית ביותר (כמו קריאה מהזיכרון) להסתיים. כדי להשיג תדרי עבודה גבוהים, מחלקים את ביצוע הפקודה לחמישה שלבים נפרדים המופרדים על ידי אוגרי פייפליין:</p>
<ol>
  <li><strong>IF (Instruction Fetch - הבאת פקודה):</strong> הבאת מילת הפקודה (32 ביט) מזיכרון ההוראות בהתאם לכתובת ה-Program Counter (PC).</li>
  <li><strong>ID (Instruction Decode - פענוח פקודה):</strong> זיהוי סוג הפקודה על ידי יחידת הבקרה, חילוץ האופקוד (Opcode) והערך המיידי (Immediate), וקריאת ערכי האוגרים מרכיב האוגרים (Register File).</li>
  <li><strong>EX (Execute - ביצוע):</strong> ביצוע פעולות חשבוניות ולוגיות בתוך יחידת ה-ALU, חישוב כתובת של זיכרון או בדיקת תנאי הסתעפות.</li>
  <li><strong>MEM (Memory Access - גישה לזיכרון):</strong> קריאה או כתיבה של נתונים מזיכרון הנתונים (Data Memory), רלוונטי רק לפקודות טעינה (Load) ואחסון (Store).</li>
  <li><strong>WB (Write Back - כתיבה בחזרה):</strong> כתיבת התוצאה הסופית (שחזרה מה-ALU או מהזיכרון) בחזרה אל רכיב האוגרים לתוך אוגר היעד (rd).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. אוגרי הצינור (Pipeline Registers) 📐</h3>
<p>כדי שפקודות שונות יזרמו במקביל בצינור מבלי לדרוס זו את זו, אנו זקוקים לאוגרים שיחצצו ביניהן:</p>
<ul>
  <li><strong>IF/ID:</strong> שומר את הפקודה ואת ה-PC שנקראו.</li>
  <li><strong>ID/EX:</strong> שומר את ערכי האוגרים, ערכים מיידיים, ואותות בקרה ל-ALU.</li>
  <li><strong>EX/MEM:</strong> שומר את תוצאת ה-ALU, נתוני כתיבה לזיכרון ואותות בקרה לזיכרון.</li>
  <li><strong>MEM/WB:</strong> שומר את הנתון שנקרא מהזיכרון או מה-ALU ואת אינדקס אוגר היעד (rd).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. בקרת פייפליין: Stall ו-Flush 🛡️</h3>
<p>לעיתים אנו צריכים לעכב פקודות או לנקות את הצינור בעקבות תקלות (Hazards):</p>
<ul>
  <li><strong>Stall (עצירה):</strong> מונע מאוגרי הצינור להתעדכן במחזור השעון הבא (שומרים על ערכם הנוכחי), ובכך מעכב את הפקודה בשלבים המוקדמים.</li>
  <li><strong>Flush (ניקוי):</strong> מאפס את אוגר הפייפליין לערכי אפס (הוראת NOP — No Operation), ובכך מוחק פקודה שהוזנה בטעות (למשל עקב הסתעפות לא נכונה).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמת קוד: אוגר פייפליין בסיסי (IF/ID) 💻</h3>
<p>הקוד הבא מייצג אוגר פייפליין IF/ID פשוט עם תמיכה בעצירה (Stall) וניקוי (Flush):</p>
<pre dir="ltr"><code>module if_id_register (
    input clk,
    input reset,
    input stall,
    input flush,
    input [31:0] inst_in,
    output reg [31:0] inst_out
);
    always @(posedge clk) begin
        if (reset) begin
            inst_out <= 32'h00000013; // פקודת NOP של RISC-V (addi x0, x0, 0)
        end else if (flush) begin
            inst_out <= 32'h00000013;
        end else if (!stall) begin
            inst_out <= inst_in;
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Classic 5-Stage RISC-V Pipeline 🎛️</h3>
<p>In a Single-Cycle processor, the clock period is determined by the slowest path through all processing steps. To enable higher clock frequencies, we partition instruction execution into 5 independent pipeline stages:</p>
<ol>
  <li><strong>IF (Instruction Fetch):</strong> Retrieves the 32-bit instruction word from Instruction Memory using the Program Counter (PC).</li>
  <li><strong>ID (Instruction Decode):</strong> Extracts instruction fields, decodes control signals via the Control Unit, and reads source operands from the Register File.</li>
  <li><strong>EX (Execute):</strong> Performs mathematical/logical computations inside the ALU, calculates memory addresses, or evaluates branch targets.</li>
  <li><strong>MEM (Memory Access):</strong> Reads data from or writes data to Data Memory (used by load and store instructions).</li>
  <li><strong>WB (Write Back):</strong> Writes the final results (from the ALU or Data Memory) back to the destination register (rd) in the Register File.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Boundary Pipeline Registers 📐</h3>
<p>To run multiple instructions simultaneously, boundary registers isolate stages so they work on different instruction contexts:</p>
<ul>
  <li><strong>IF/ID:</strong> Holds the fetched instruction word and its corresponding PC.</li>
  <li><strong>ID/EX:</strong> Holds decoded register values, sign-extended immediate values, destination register indexes, and execution control signals.</li>
  <li><strong>EX/MEM:</strong> Holds ALU calculation results, write data, and memory control signals.</li>
  <li><strong>MEM/WB:</strong> Holds loaded memory data, ALU results, and write-back control signals.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Control Signals: Stall and Flush 🛡️</h3>
<p>Pipeline hazards require mechanisms to control instruction flow:</p>
<ul>
  <li><strong>Stall:</strong> Prevents specific pipeline registers from updating, freezing their current state to insert a delay.</li>
  <li><strong>Flush:</strong> Clears pipeline registers to 0 (converting them into NOP - No Operation bubbles) to discard instructions fetched due to control flow changes.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Code Example: Standard IF/ID Boundary Register 💻</h3>
<pre dir="ltr"><code>module if_id_register (
    input clk,
    input reset,
    input stall,
    input flush,
    input [31:0] inst_in,
    output reg [31:0] inst_out
);
    always @(posedge clk) begin
        if (reset) begin
            inst_out <= 32'h00000013; // RISC-V NOP instruction: addi x0, x0, 0
        end else if (flush) begin
            inst_out <= 32'h00000013;
        end else if (!stall) begin
            inst_out <= inst_in;
        end
    end
endmodule</code></pre>
`,

      taskHe: `בנו מודול אוגר פייפליין מסוג ID/EX (מפענוח לביצוע) בשם <code dir="ltr">top_module</code>.
הממשק כולל את האותות הבאים:
- כניסות בקרה ושעון: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (מסונכרן, אקטיבי-גבוה), <code dir="ltr">stall</code> (אקטיבי-גבוה), <code dir="ltr">flush</code> (אקטיבי-גבוה).
- כניסות מידע מפענח: <code dir="ltr">[31:0] pc_in</code>, <code dir="ltr">[31:0] rs1_val_in</code>, <code dir="ltr">[31:0] rs2_val_in</code>, <code dir="ltr">[31:0] imm_in</code>, <code dir="ltr">[4:0] rd_in</code>, <code dir="ltr">[3:0] alu_op_in</code>, <code dir="ltr">reg_write_in</code>.
- יציאות רשומות לשלב הביצוע: <code dir="ltr">[31:0] pc_out</code>, <code dir="ltr">[31:0] rs1_val_out</code>, <code dir="ltr">[31:0] rs2_val_out</code>, <code dir="ltr">[31:0] imm_out</code>, <code dir="ltr">[4:0] rd_out</code>, <code dir="ltr">[3:0] alu_op_out</code>, <code dir="ltr">reg_write_out</code> (כולן מוגדרות כ-<code dir="ltr">output reg</code>).

התנהגות המערכת בעליית השעון:
1. אם <code dir="ltr">reset</code> הוא 1 -> אפסו את כל היציאות ל-0.
2. אחרת, אם <code dir="ltr">flush</code> הוא 1 -> אפסו את כל היציאות ל-0 (פעולה המייצרת בועה - Bubble).
3. אחרת, אם <code dir="ltr">stall</code> הוא 1 -> שמרו על ערכן הקודם של היציאות (אל תעדכנו).
4. אחרת (במצב רגיל) -> עדכנו את היציאות לפי כניסות המידע המקבילות.`,

      taskEn: `Design a pipeline register for the ID/EX (Decode to Execute) boundary in <code dir="ltr">top_module</code>.
The interface consists of:
- Control inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous active-high), <code dir="ltr">stall</code> (active-high), <code dir="ltr">flush</code> (active-high).
- Decode stage inputs: <code dir="ltr">[31:0] pc_in</code>, <code dir="ltr">[31:0] rs1_val_in</code>, <code dir="ltr">[31:0] rs2_val_in</code>, <code dir="ltr">[31:0] imm_in</code>, <code dir="ltr">[4:0] rd_in</code>, <code dir="ltr">[3:0] alu_op_in</code>, <code dir="ltr">reg_write_in</code>.
- Execute stage registered outputs: <code dir="ltr">[31:0] pc_out</code>, <code dir="ltr">[31:0] rs1_val_out</code>, <code dir="ltr">[31:0] rs2_val_out</code>, <code dir="ltr">[31:0] imm_out</code>, <code dir="ltr">[4:0] rd_out</code>, <code dir="ltr">[3:0] alu_op_out</code>, <code dir="ltr">reg_write_out</code> (must be declared as <code dir="ltr">output reg</code>).

The register updates on <code dir="ltr">posedge clk</code> based on this priority:
1. If <code dir="ltr">reset</code> is high: clear all outputs to 0.
2. Else if <code dir="ltr">flush</code> is high: clear all outputs to 0 (to insert a bubble).
3. Else if <code dir="ltr">stall</code> is high: hold all outputs (do not update).
4. Else: load the inputs into the corresponding outputs.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input stall,
    input flush,
    input [31:0] pc_in,
    input [31:0] rs1_val_in,
    input [31:0] rs2_val_in,
    input [31:0] imm_in,
    input [4:0] rd_in,
    input [3:0] alu_op_in,
    input reg_write_in,
    output reg [31:0] pc_out,
    output reg [31:0] rs1_val_out,
    output reg [31:0] rs2_val_out,
    output reg [31:0] imm_out,
    output reg [4:0] rd_out,
    output reg [3:0] alu_op_out,
    output reg reg_write_out
);

    // כתבו את לוגיקת עדכון האוגרים כאן / Write register update logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input stall,
    input flush,
    input [31:0] pc_in,
    input [31:0] rs1_val_in,
    input [31:0] rs2_val_in,
    input [31:0] imm_in,
    input [4:0] rd_in,
    input [3:0] alu_op_in,
    input reg_write_in,
    output reg [31:0] pc_out,
    output reg [31:0] rs1_val_out,
    output reg [31:0] rs2_val_out,
    output reg [31:0] imm_out,
    output reg [4:0] rd_out,
    output reg [3:0] alu_op_out,
    output reg reg_write_out
);
    always @(posedge clk) begin
        if (reset) begin
            pc_out        <= 32'd0;
            rs1_val_out   <= 32'd0;
            rs2_val_out   <= 32'd0;
            imm_out       <= 32'd0;
            rd_out        <= 5'd0;
            alu_op_out    <= 4'd0;
            reg_write_out <= 1'b0;
        end else if (flush) begin
            pc_out        <= 32'd0;
            rs1_val_out   <= 32'd0;
            rs2_val_out   <= 32'd0;
            imm_out       <= 32'd0;
            rd_out        <= 5'd0;
            alu_op_out    <= 4'd0;
            reg_write_out <= 1'b0;
        end else if (!stall) begin
            pc_out        <= pc_in;
            rs1_val_out   <= rs1_val_in;
            rs2_val_out   <= rs2_val_in;
            imm_out       <= imm_in;
            rd_out        <= rd_in;
            alu_op_out    <= alu_op_in;
            reg_write_out <= reg_write_in;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, stall: 0, flush: 0, pc_in: 256, rs1_val_in: 50, rs2_val_in: 60, imm_in: 10, rd_in: 5, alu_op_in: 2, reg_write_in: 1, pc_out: 0, rs1_val_out: 0, rs2_val_out: 0, imm_out: 0, rd_out: 0, alu_op_out: 0, reg_write_out: 0 },
        { time: 5, clk: 1, reset: 1, stall: 0, flush: 0, pc_in: 256, rs1_val_in: 50, rs2_val_in: 60, imm_in: 10, rd_in: 5, alu_op_in: 2, reg_write_in: 1, pc_out: 0, rs1_val_out: 0, rs2_val_out: 0, imm_out: 0, rd_out: 0, alu_op_out: 0, reg_write_out: 0 },
        { time: 10, clk: 0, reset: 0, stall: 0, flush: 0, pc_in: 256, rs1_val_in: 50, rs2_val_in: 60, imm_in: 10, rd_in: 5, alu_op_in: 2, reg_write_in: 1, pc_out: 0, rs1_val_out: 0, rs2_val_out: 0, imm_out: 0, rd_out: 0, alu_op_out: 0, reg_write_out: 0 },
        { time: 15, clk: 1, reset: 0, stall: 0, flush: 0, pc_in: 256, rs1_val_in: 50, rs2_val_in: 60, imm_in: 10, rd_in: 5, alu_op_in: 2, reg_write_in: 1, pc_out: 256, rs1_val_out: 50, rs2_val_out: 60, imm_out: 10, rd_out: 5, alu_op_out: 2, reg_write_out: 1 },
        { time: 20, clk: 0, reset: 0, stall: 1, flush: 0, pc_in: 260, rs1_val_in: 100, rs2_val_in: 200, imm_in: 20, rd_in: 8, alu_op_in: 0, reg_write_in: 0, pc_out: 256, rs1_val_out: 50, rs2_val_out: 60, imm_out: 10, rd_out: 5, alu_op_out: 2, reg_write_out: 1 },
        { time: 25, clk: 1, reset: 0, stall: 1, flush: 0, pc_in: 260, rs1_val_in: 100, rs2_val_in: 200, imm_in: 20, rd_in: 8, alu_op_in: 0, reg_write_in: 0, pc_out: 256, rs1_val_out: 50, rs2_val_out: 60, imm_out: 10, rd_out: 5, alu_op_out: 2, reg_write_out: 1 },
        { time: 30, clk: 0, reset: 0, stall: 0, flush: 1, pc_in: 260, rs1_val_in: 100, rs2_val_in: 200, imm_in: 20, rd_in: 8, alu_op_in: 0, reg_write_in: 0, pc_out: 256, rs1_val_out: 50, rs2_val_out: 60, imm_out: 10, rd_out: 5, alu_op_out: 2, reg_write_out: 1 },
        { time: 35, clk: 1, reset: 0, stall: 0, flush: 1, pc_in: 260, rs1_val_in: 100, rs2_val_in: 200, imm_in: 20, rd_in: 8, alu_op_in: 0, reg_write_in: 0, pc_out: 0, rs1_val_out: 0, rs2_val_out: 0, imm_out: 0, rd_out: 0, alu_op_out: 0, reg_write_out: 0 },
        { time: 40, clk: 0, reset: 0, stall: 0, flush: 0, pc_in: 264, rs1_val_in: 77, rs2_val_in: 88, imm_in: 30, rd_in: 12, alu_op_in: 6, reg_write_in: 1, pc_out: 0, rs1_val_out: 0, rs2_val_out: 0, imm_out: 0, rd_out: 0, alu_op_out: 0, reg_write_out: 0 },
        { time: 45, clk: 1, reset: 0, stall: 0, flush: 0, pc_in: 264, rs1_val_in: 77, rs2_val_in: 88, imm_in: 30, rd_in: 12, alu_op_in: 6, reg_write_in: 1, pc_out: 264, rs1_val_out: 77, rs2_val_out: 88, imm_out: 30, rd_out: 12, alu_op_out: 6, reg_write_out: 1 }
      ],

      hints: {
        he: "ממשו את סדר העדיפויות באמצעות תנאי if-else. תחילה בדקו reset, לאחר מכן flush, ולאחר מכן בדקו כי stall אינו פעיל (!stall) לפני העתקת ערכי הכניסה.",
        en: "Implement the priorities using if-else structures. Check reset first, then flush, and then check that stall is inactive (!stall) before copying inputs to outputs."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 95: Instruction Fetch (IF) & Program Counter
    // --------------------------------------------------------------------------
    {
      id: 95,
      chapter: 13,
      chapterTitleHe: "פרק 13: מעבדים מרובי שלבים ופייפליין (Pipelining)",
      chapterTitleEn: "Chapter 13: Pipelining & Pipelined Processors",
      titleHe: "שלב הבאת הפקודה (IF) ואוגר התוכנית (PC) 🎯",
      titleEn: "Instruction Fetch (IF) & Program Counter",

      explanationHe: `
<h3>1. שלב הבאת הפקודה (IF) 🎯</h3>
<p>שלב ה-<strong>Instruction Fetch (IF)</strong> הוא השלב הראשון של צינור העיבוד. מטרתו היא לקרוא את הפקודה הבאה לביצוע מתוך זיכרון ההוראות. רכיב הליבה של שלב זה הוא ה-<strong>Program Counter (PC)</strong>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. כיצד נקבעת הכתובת הבאה של ה-PC? 📐</h3>
<p>בכל מחזור שעון, אנו צריכים לקבוע מה תהיה כתובת ה-PC הבאה. ישנם שני תרחישים עיקריים:</p>
<ol>
  <li><strong>התקדמות סדרתית:</strong> ה-PC גדל ב-4 (כלומר $PC + 4$). מכיוון שרוחב כל פקודה ב-RISC-V הוא 32 ביט (4 בתים) והזיכרון ממוען לפי בתים (Byte-addressable), הוספת 4 ל-PC מצביעה על הפקודה העוקבת מיד בזיכרון.</li>
  <li><strong>הסתעפויות וקפיצות (Branches / Jumps):</strong> כאשר מבוצעת פקודת קפיצה או פקודת תנאי שהתממשה, הכתובת הבאה מוסתת לכתובת היעד (<code>target_pc</code>) המחושבת בשלבי הביצוע או הזיכרון בצינור.</li>
</ol>
<p>כדי לבחור בין שתי אפשרויות אלו, משתמשים במולטיפלקסר (Multiplexer) מנוהל על ידי אות בקרה (למשל <code>pc_sel</code>).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. עיכובים ועצירת ה-PC ⏳</h3>
<p>כאשר מתגלה תקלת נתונים (Data Hazard) שאינה ניתנת לפתרון על ידי מעקף, אנו חייבים להקפיא (Stall) את ה-PC. במחזור השעון שבו ה-PC מוקפא, הוא שומר על ערכו הנוכחי, מה שגורם להבאת אותה פקודה פעם נוספת, ומאפשר לפקודה שלפניה להתקדם בצינור.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמת קוד: אוגר PC פשוט עם אתחול 💻</h3>
<p>הקוד הבא מתאר אוגר PC בסיסי ללא תמיכה במנגנוני בחירה מורכבים:</p>
<pre dir="ltr"><code>module simple_pc (
    input clk,
    input reset,
    input [31:0] next_pc,
    output reg [31:0] pc
);
    always @(posedge clk) begin
        if (reset) begin
            pc <= 32'd0;
        end else begin
            pc <= next_pc;
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Instruction Fetch (IF) Stage 🎯</h3>
<p>The <strong>Instruction Fetch (IF)</strong> stage is the entry point of the pipeline. Its primary job is to retrieve the next 32-bit instruction word from Instruction Memory based on the current address stored in the <strong>Program Counter (PC)</strong> register.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Program Counter (PC) Multiplexing 📐</h3>
<p>In every clock cycle, the PC must update to point to the next instruction. This address comes from one of two main sources:</p>
<ol>
  <li><strong>Sequential Path:</strong> $PC + 4$. Since standard RISC-V instructions are 32 bits (4 bytes) wide and memory is byte-addressable, incrementing the PC by 4 points to the next sequential instruction.</li>
  <li><strong>Branch/Jump Redirection Path:</strong> When a branch (e.g., <code>BEQ</code>) is taken or a jump executes, the next instruction must be fetched from the calculated target address (<code>target_pc</code>).</li>
</ol>
<p>A multiplexer controlled by a select signal (such as <code>pc_sel</code>) decides which path updates the PC.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. PC Control under Pipeline Stalls ⏳</h3>
<p>When the processor detects a hazard that requires execution to halt temporarily, we must **stall** the Program Counter. By freezing the PC, we force the processor to fetch the same instruction again, buying time for older instructions ahead in the pipeline to advance.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Code Example: Basic Synchronous PC Register 💻</h3>
<pre dir="ltr"><code>module simple_pc (
    input clk,
    input reset,
    input [31:0] next_pc,
    output reg [31:0] pc
);
    always @(posedge clk) begin
        if (reset) begin
            pc <= 32'd0;
        end else begin
            pc <= next_pc;
        end
    end
endmodule</code></pre>
`,

      taskHe: `בנו מודול שלב הבאת פקודה (IF) מפושט במודול <code dir="ltr">top_module</code>.
הממשק כולל:
- כניסות: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (איפוס מסונכרן, אקטיבי-גבוה), <code dir="ltr">stall</code> (עצירת ה-PC), <code dir="ltr">pc_sel</code> (בורר: 0 עבור $PC+4$, ו-1 עבור כתובת קפיצה/הסתעפות <code dir="ltr">target_pc</code>), ו-<code dir="ltr">[31:0] target_pc</code> (כתובת היעד להסתעפות).
- יציאות: <code dir="ltr">pc</code> (כתובת ה-PC הנוכחית, מוגדרת כ-<code dir="ltr">output reg [31:0]</code>) ו-<code dir="ltr">pc_plus_4</code> (כתובת ה-PC ועוד 4, מוגדרת כ-<code dir="ltr">output [31:0]</code>).

התנהגות המערכת:
1. הכתובת <code dir="ltr">pc_plus_4</code> היא מוצא צירופי (combinational) המחושב תמיד כ-<code dir="ltr">pc + 4</code>.
2. בעליית השעון:
   - אם <code dir="ltr">reset</code> פעיל (1): ה-<code dir="ltr">pc</code> יקבל 0.
   - אחרת, אם <code dir="ltr">stall</code> פעיל (1): ה-<code dir="ltr">pc</code> ישמור על ערכו הנוכחי (אינו מתעדכן).
   - אחרת (אם <code dir="ltr">stall</code> אינו פעיל): ה-<code dir="ltr">pc</code> יתעדכן ל-<code dir="ltr">target_pc</code> אם <code dir="ltr">pc_sel</code> הוא 1, או ל-<code dir="ltr">pc_plus_4</code> אם <code dir="ltr">pc_sel</code> הוא 0.`,

      taskEn: `Design a simplified Instruction Fetch (IF) block in <code dir="ltr">top_module</code>.
The module has:
- Inputs: <code dir="ltr">clk</code>, <code dir="ltr">reset</code> (synchronous active-high), <code dir="ltr">stall</code> (freezes the PC), <code dir="ltr">pc_sel</code> (selector: 0 selects $PC+4$, 1 selects <code dir="ltr">target_pc</code>), and <code dir="ltr">[31:0] target_pc</code> (branch/jump target address).
- Outputs: <code dir="ltr">pc</code> (current PC, declared as <code dir="ltr">output reg [31:0]</code>) and <code dir="ltr">pc_plus_4</code> (combinational output, declared as <code dir="ltr">output [31:0]</code>).

Behavior:
1. <code dir="ltr">pc_plus_4</code> is a combinational output and always equal to <code dir="ltr">pc + 4</code>.
2. On <code dir="ltr">posedge clk</code>:
   - If <code dir="ltr">reset</code> is active: <code dir="ltr">pc</code> is set to 0.
   - Else if <code dir="ltr">stall</code> is active: <code dir="ltr">pc</code> holds its current value (no change).
   - Else: if <code dir="ltr">pc_sel</code> is 1, <code dir="ltr">pc</code> is updated to <code dir="ltr">target_pc</code>; if <code dir="ltr">pc_sel</code> is 0, <code dir="ltr">pc</code> is updated to <code dir="ltr">pc_plus_4</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input stall,
    input pc_sel,
    input [31:0] target_pc,
    output reg [31:0] pc,
    output [31:0] pc_plus_4
);

    // חישוב צירופי עבור pc_plus_4 / Combinational calculation of pc_plus_4

    // עדכון ה-PC בעליית שעון / PC sequential update logic
    always @(posedge clk) begin
        if (reset) begin
            // ...
        end else if (!stall) begin
            // ...
        end
    end
endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input stall,
    input pc_sel,
    input [31:0] target_pc,
    output reg [31:0] pc,
    output [31:0] pc_plus_4
);
    assign pc_plus_4 = pc + 32'd4;

    always @(posedge clk) begin
        if (reset) begin
            pc <= 32'd0;
        end else if (!stall) begin
            pc <= pc_sel ? target_pc : pc_plus_4;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, stall: 0, pc_sel: 0, target_pc: 4096, pc: 0, pc_plus_4: 4 },
        { time: 5, clk: 1, reset: 1, stall: 0, pc_sel: 0, target_pc: 4096, pc: 0, pc_plus_4: 4 },
        { time: 10, clk: 0, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 0, pc_plus_4: 4 },
        { time: 15, clk: 1, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 4, pc_plus_4: 8 },
        { time: 20, clk: 0, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 4, pc_plus_4: 8 },
        { time: 25, clk: 1, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 8, pc_plus_4: 12 },
        { time: 30, clk: 0, reset: 0, stall: 1, pc_sel: 0, target_pc: 4096, pc: 8, pc_plus_4: 12 },
        { time: 35, clk: 1, reset: 0, stall: 1, pc_sel: 0, target_pc: 4096, pc: 8, pc_plus_4: 12 },
        { time: 40, clk: 0, reset: 0, stall: 0, pc_sel: 1, target_pc: 4096, pc: 8, pc_plus_4: 12 },
        { time: 45, clk: 1, reset: 0, stall: 0, pc_sel: 1, target_pc: 4096, pc: 4096, pc_plus_4: 4100 },
        { time: 50, clk: 0, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 4096, pc_plus_4: 4100 },
        { time: 55, clk: 1, reset: 0, stall: 0, pc_sel: 0, target_pc: 4096, pc: 4100, pc_plus_4: 4104 }
      ],

      hints: {
        he: "השתמשו בהוראת assign עבור pc_plus_4. בבלוק ה-always, בדקו תחילה את ה-reset. בקביעת הערך של pc, השתמשו באופרטור התנאי (?:) כדי לבחור בין target_pc לבין pc_plus_4 רק כאשר stall אינו פעיל.",
        en: "Use an assign statement for pc_plus_4. In the always block, evaluate reset first. For updating pc, use a ternary conditional operator (?:) to select between target_pc and pc_plus_4 only when stall is inactive."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 96: Instruction Decode (ID) & Control Unit
    // --------------------------------------------------------------------------
    {
      id: 96,
      chapter: 13,
      chapterTitleHe: "פרק 13: מעבדים מרובי שלבים ופייפליין (Pipelining)",
      chapterTitleEn: "Chapter 13: Pipelining & Pipelined Processors",
      titleHe: "שלב פענוח פקודה (ID) ויחידת הבקרה 🧩",
      titleEn: "Instruction Decode (ID) & Control Unit",

      explanationHe: `
<h3>1. שלב פענוח הפקודה (ID) 🧩</h3>
<p>בשלב ה-<strong>Instruction Decode (ID)</strong>, אנו לוקחים את הפקודה שהובאה בשלב ה-IF ומנתחים אותה. השלב הזה מבצע שתי פעולות עיקריות:</p>
<ol>
  <li><strong>קריאת רכיב האוגרים (Register File Read):</strong> קריאת ערכי המקור של האוגרים <code>rs1</code> ו-<code>rs2</code> (המיוצגים בביטים מוגדרים בפקודה).</li>
  <li><strong>יחידת הבקרה (Control Unit):</strong> זיהוי הפקודה על פי ה-Opcode שלה (ביטים [6:0] ב-RISC-V) וקביעת כל אותות הבקרה לחלקי החומרה השונים.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. אותות הבקרה של המעבד 📐</h3>
<p>יחידת הבקרה מייצרת אותות המאפשרים או מונעים מעבר מידע:</p>
<ul>
  <li><code>reg_write</code>: מאשר כתיבה לרכיב האוגרים (בשלב ה-WB).</li>
  <li><code>alu_src</code>: בוחר את הכניסה השנייה ל-ALU (0 = האוגר rs2, 1 = הערך המיידי המורחב סימן).</li>
  <li><code>mem_read</code> / <code>mem_write</code>: מאשרים קריאה או כתיבה מזיכרון הנתונים (בשלב MEM).</li>
  <li><code>branch</code>: מסמן שמדובר בפקודת הסתעפות מותנית.</li>
  <li><code>mem_to_reg</code>: קובע איזה ערך ייכתב לאוגר היעד (0 = תוצאת ה-ALU, 1 = נתון מהזיכרון).</li>
  <li><code>alu_op</code>: מקודד את סוג הפעולה הכללי עבור יחידת הבקרה המקומית של ה-ALU (למשל: 00 = חישוב כתובת זיכרון, 01 = השוואה עבור Branch, 10 = פעולת R-type/I-type).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. טבלת אמת לפענוח אופקודים ב-RISC-V 📋</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
  <thead>
    <tr style="background-color: var(--background-secondary); border-bottom: 2px solid var(--border-color);">
      <th style="padding: 8px; text-align: left;">Instruction</th>
      <th style="padding: 8px; text-align: left;">Opcode</th>
      <th style="padding: 8px; text-align: center;">RegWrite</th>
      <th style="padding: 8px; text-align: center;">ALUSrc</th>
      <th style="padding: 8px; text-align: center;">MemRead</th>
      <th style="padding: 8px; text-align: center;">MemWrite</th>
      <th style="padding: 8px; text-align: center;">Branch</th>
      <th style="padding: 8px; text-align: center;">MemToReg</th>
      <th style="padding: 8px; text-align: center;">ALUOp</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>ADD</strong></td>
      <td style="padding: 8px;"><code>0110011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">10</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>ADDI</strong></td>
      <td style="padding: 8px;"><code>0010011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">10</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>LW</strong></td>
      <td style="padding: 8px;"><code>0000011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">00</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>SW</strong></td>
      <td style="padding: 8px;"><code>0100011</code></td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">00</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>BEQ</strong></td>
      <td style="padding: 8px;"><code>1100011</code></td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">01</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמת קוד: מפענח לפקודות קפיצה בלבד 💻</h3>
<p>הדוגמה הבאה מדגימה יחידת בקרה פשוטה לפקודת JAL ופקודת LUI:</p>
<pre dir="ltr"><code>module custom_control (
    input [6:0] opcode,
    output reg is_jump,
    output reg load_upper
);
    always @(*) begin
        // ברירת מחדל
        is_jump = 1'b0;
        load_upper = 1'b0;
        
        case (opcode)
            7'b1101111: is_jump = 1'b1;     // JAL
            7'b0110111: load_upper = 1'b1;  // LUI
        endcase
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Instruction Decode (ID) Stage 🧩</h3>
<p>In the <strong>Instruction Decode (ID)</strong> stage, the 32-bit instruction fetched from memory is broken down. This stage accomplishes two main tasks:</p>
<ol>
  <li><strong>Register File Access:</strong> Reads the source registers (<code>rs1</code> and <code>rs2</code>) using the register index fields specified in the instruction.</li>
  <li><strong>Control Unit Decoding:</strong> Evaluates the RISC-V 7-bit opcode field (bits [6:0]) to set up the control signals required by other stages.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Role of Processor Control Signals 📐</h3>
<p>The Control Unit outputs signals that orchestrate data flow throughout the processor datapath:</p>
<ul>
  <li><code>reg_write</code>: Permits writing to the Register File (active during the WB stage).</li>
  <li><code>alu_src</code>: Selects the second ALU operand (0 = register rs2 data, 1 = sign-extended immediate).</li>
  <li><code>mem_read</code> / <code>mem_write</code>: Enable reading from or writing to Data Memory (active during the MEM stage).</li>
  <li><code>branch</code>: Asserts that the instruction is a conditional branch.</li>
  <li><code>mem_to_reg</code>: Selects what gets written back to the destination register rd (0 = ALU output, 1 = loaded memory value).</li>
  <li><code>alu_op</code>: Encodes the general ALU instruction category (00 = Address calc for Load/Store, 01 = Comparison for Branch, 10 = ALU instruction).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. RISC-V Opcode Truth Table 📋</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
  <thead>
    <tr style="background-color: var(--background-secondary); border-bottom: 2px solid var(--border-color);">
      <th style="padding: 8px; text-align: left;">Instruction</th>
      <th style="padding: 8px; text-align: left;">Opcode</th>
      <th style="padding: 8px; text-align: center;">RegWrite</th>
      <th style="padding: 8px; text-align: center;">ALUSrc</th>
      <th style="padding: 8px; text-align: center;">MemRead</th>
      <th style="padding: 8px; text-align: center;">MemWrite</th>
      <th style="padding: 8px; text-align: center;">Branch</th>
      <th style="padding: 8px; text-align: center;">MemToReg</th>
      <th style="padding: 8px; text-align: center;">ALUOp</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>ADD</strong></td>
      <td style="padding: 8px;"><code>0110011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">10</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>ADDI</strong></td>
      <td style="padding: 8px;"><code>0010011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">10</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>LW</strong></td>
      <td style="padding: 8px;"><code>0000011</code></td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">00</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>SW</strong></td>
      <td style="padding: 8px;"><code>0100011</code></td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">00</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;"><strong>BEQ</strong></td>
      <td style="padding: 8px;"><code>1100011</code></td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">1</td>
      <td style="padding: 8px; text-align: center;">0</td>
      <td style="padding: 8px; text-align: center;">01</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Code Example: Control Unit for Jump & Load Upper 💻</h3>
<p>The code below demonstrates a basic decoder for JAL and LUI instructions:</p>
<pre dir="ltr"><code>module custom_control (
    input [6:0] opcode,
    output reg is_jump,
    output reg load_upper
);
    always @(*) begin
        is_jump = 1'b0;
        load_upper = 1'b0;
        
        case (opcode)
            7'b1101111: is_jump = 1'b1;     // JAL
            7'b0110111: load_upper = 1'b1;  // LUI
        endcase
    end
endmodule</code></pre>
`,

      taskHe: `בנו את יחידת הבקרה (Control Unit) עבור תת-קבוצה של פקודות RISC-V במודול בשם <code dir="ltr">top_module</code>.
הכניסה היא:
- <code dir="ltr">[6:0] opcode</code> (מילת הבקרה של הפקודה).
היציאות הן (כולן מוגדרות כ-<code dir="ltr">output reg</code>):
- <code dir="ltr">reg_write</code> (1-bit): מאפשר כתיבה לרכיב האוגרים.
- <code dir="ltr">alu_src</code> (1-bit): בוחר את הכניסה השנייה ל-ALU (0 = אוגר rs2, 1 = ערך מיידי).
- <code dir="ltr">mem_read</code> (1-bit): מאפשר קריאה מזיכרון הנתונים.
- <code dir="ltr">mem_write</code> (1-bit): מאפשר כתיבה לזיכרון הנתונים.
- <code dir="ltr">branch</code> (1-bit): מסמן פקודת הסתעפות מותנית.
- <code dir="ltr">mem_to_reg</code> (1-bit): בורר ערך כתיבה חזרה (1 = מהזיכרון, 0 = ממוצא ה-ALU).
- <code dir="ltr">[1:0] alu_op</code> (2-bit): קוד בחירת פעולת ה-ALU.

עליכם לממש את טבלת האמת המוצגת בהסבר עבור ה-opcodes הבאים:
1. <code dir="ltr">7'b0110011</code> (ADD)
2. <code dir="ltr">7'b0010011</code> (ADDI)
3. <code dir="ltr">7'b0000011</code> (LW)
4. <code dir="ltr">7'b0100011</code> (SW)
5. <code dir="ltr">7'b1100011</code> (BEQ)

עבור כל opcode אחר שאינו נתמך, יש לאפס את כל היציאות ל-0.`,

      taskEn: `Design the Control Unit for a subset of RISC-V instructions in <code dir="ltr">top_module</code>.
The input is:
- <code dir="ltr">[6:0] opcode</code> (the instruction opcode field).
The outputs are (must be declared as <code dir="ltr">output reg</code>):
- <code dir="ltr">reg_write</code> (1-bit): enables Register File write.
- <code dir="ltr">alu_src</code> (1-bit): selects the second ALU operand (0 = register rs2, 1 = immediate).
- <code dir="ltr">mem_read</code> (1-bit): enables Data Memory read.
- <code dir="ltr">mem_write</code> (1-bit): enables Data Memory write.
- <code dir="ltr">branch</code> (1-bit): indicates a conditional branch.
- <code dir="ltr">mem_to_reg</code> (1-bit): selects write-back source (1 = memory, 0 = ALU).
- <code dir="ltr">[1:0] alu_op</code> (2-bit): general ALU operation code.

Implement the truth table defined in the explanation for these opcodes:
1. <code dir="ltr">7'b0110011</code> (ADD)
2. <code dir="ltr">7'b0010011</code> (ADDI)
3. <code dir="ltr">7'b0000011</code> (LW)
4. <code dir="ltr">7'b0100011</code> (SW)
5. <code dir="ltr">7'b1100011</code> (BEQ)

For any other/unsupported opcode, set all output signals to 0.`,

      starterCode: `module top_module (
    input [6:0] opcode,
    output reg reg_write,
    output reg alu_src,
    output reg mem_read,
    output reg mem_write,
    output reg branch,
    output reg mem_to_reg,
    output reg [1:0] alu_op
);

    // מימוש יחידת הבקרה בעזרת בלוק always צירופי / Combinational Control Unit
    always @(*) begin
        // כתבו את לוגיקת הפענוח כאן / Write decoding logic here
    end
endmodule`,

      solutionCode: `module top_module (
    input [6:0] opcode,
    output reg reg_write,
    output reg alu_src,
    output reg mem_read,
    output reg mem_write,
    output reg branch,
    output reg mem_to_reg,
    output reg [1:0] alu_op
);
    always @(*) begin
        case (opcode)
            7'b0110011: begin // ADD
                reg_write  = 1'b1;
                alu_src    = 1'b0;
                mem_read   = 1'b0;
                mem_write  = 1'b0;
                branch     = 1'b0;
                mem_to_reg = 1'b0;
                alu_op     = 2'b10;
            end
            7'b0010011: begin // ADDI
                reg_write  = 1'b1;
                alu_src    = 1'b1;
                mem_read   = 1'b0;
                mem_write  = 1'b0;
                branch     = 1'b0;
                mem_to_reg = 1'b0;
                alu_op     = 2'b10;
            end
            7'b0000011: begin // LW
                reg_write  = 1'b1;
                alu_src    = 1'b1;
                mem_read   = 1'b1;
                mem_write  = 1'b0;
                branch     = 1'b0;
                mem_to_reg = 1'b1;
                alu_op     = 2'b00;
            end
            7'b0100011: begin // SW
                reg_write  = 1'b0;
                alu_src    = 1'b1;
                mem_read   = 1'b0;
                mem_write  = 1'b1;
                branch     = 1'b0;
                mem_to_reg = 1'b0;
                alu_op     = 2'b00;
            end
            7'b1100011: begin // BEQ
                reg_write  = 1'b0;
                alu_src    = 1'b0;
                mem_read   = 1'b0;
                mem_write  = 1'b0;
                branch     = 1'b1;
                mem_to_reg = 1'b0;
                alu_op     = 2'b01;
            end
            default: begin
                reg_write  = 1'b0;
                alu_src    = 1'b0;
                mem_read   = 1'b0;
                mem_write  = 1'b0;
                branch     = 1'b0;
                mem_to_reg = 1'b0;
                alu_op     = 2'b00;
            end
        endcase
    end
endmodule`,

      expectedOutputs: [
        { time: 0, opcode: 51, reg_write: 1, alu_src: 0, mem_read: 0, mem_write: 0, branch: 0, mem_to_reg: 0, alu_op: 2 },
        { time: 10, opcode: 19, reg_write: 1, alu_src: 1, mem_read: 0, mem_write: 0, branch: 0, mem_to_reg: 0, alu_op: 2 },
        { time: 20, opcode: 3, reg_write: 1, alu_src: 1, mem_read: 1, mem_write: 0, branch: 0, mem_to_reg: 1, alu_op: 0 },
        { time: 30, opcode: 35, reg_write: 0, alu_src: 1, mem_read: 0, mem_write: 1, branch: 0, mem_to_reg: 0, alu_op: 0 },
        { time: 40, opcode: 99, reg_write: 0, alu_src: 0, mem_read: 0, mem_write: 0, branch: 1, mem_to_reg: 0, alu_op: 1 },
        { time: 50, opcode: 127, reg_write: 0, alu_src: 0, mem_read: 0, mem_write: 0, branch: 0, mem_to_reg: 0, alu_op: 0 }
      ],

      hints: {
        he: "השתמשו במבנה case צירופי על opcode. ודאו שכל אותות הבקרה מקבלים ערך מפורש בכל ענף של ה-case ובענף default כדי למנוע יצירת Latch לא רצוי.",
        en: "Use a combinational case statement on opcode. Ensure every control signal is explicitly assigned in each branch of the case statement and the default branch to prevent latch generation."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 97: Execute Stage (EX) & Hazard Detection
    // --------------------------------------------------------------------------
    {
      id: 97,
      chapter: 13,
      chapterTitleHe: "פרק 13: מעבדים מרובי שלבים ופייפליין (Pipelining)",
      chapterTitleEn: "Chapter 13: Pipelining & Pipelined Processors",
      titleHe: "שלב הביצוע (EX) וזיהוי תקלות בפייפליין 🛡️",
      titleEn: "Execute Stage (EX) & Hazard Detection",

      explanationHe: `
<h3>1. שלב הביצוע (EX) ותקלות פייפליין 🛡️</h3>
<p>בשלב ה-<strong>Execute (EX)</strong>, ה-ALU מבצע את הפעולה החשבונית/לוגית שנדרשה. אולם, הרצת פקודות במקביל בפייפליין מייצרת בעיה חמורה: <strong>תקלות (Hazards)</strong>. תקלה היא מצב שבו הפקודה הבאה אינה יכולה להתבצע במחזור השעון הבא עקב מגבלה לוגית.</p>
<p>קיימים שלושה סוגים של תקלות:</p>
<ol>
  <li><strong>מבניות (Structural Hazards):</strong> התנגשות על משאב חומרה פיזי (למשל, כאשר שני שלבים שונים מנסים לגשת לאותו זיכרון בו-זמנית).</li>
  <li><strong>נתונים (Data Hazards):</strong> כאשר פקודה אחת תלויה בנתון של פקודה קודמת שעדיין לא סיימה לכתוב אותו לרכיב האוגרים (בעיית RAW - Read After Write).</li>
  <li><strong>בקרה (Control Hazards):</strong> כאשר הצינור מביא פקודות חדשות בעקבות פקודת הסתעפות (Branch), אך תנאי ההסתעפות עוד לא חושב, ומתגלה בדיעבד שהבאנו פקודות לא נכונות.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. פתרון תקלות נתונים: Forwarding לעומת Stalling ⏳</h3>
<p>ישנן שתי דרכים להתמודד עם תקלות נתונים:</p>
<ul>
  <li><strong>תיווך נתונים (Forwarding / Bypassing):</strong> מעקף חומרה המנתב את תוצאת ה-ALU משלבי EX/MEM או MEM/WB ישירות לכניסת ה-ALU של פקודה עוקבת, מבלי להמתין לכתיבה לרכיב האוגרים. זהו הפתרון היעיל ביותר המונע עיכובים.</li>
  <li><strong>עצירת הצינור (Stalling / Bubble):</strong> הקפאת שלבי ה-IF וה-ID והזרקת פקודת סרק (NOP) לשלב ה-EX, כדי לאפשר לפקודה הקודמת להתקדם ולייצר את הנתון הדרוש.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. תקלת Load-Use: מקרה מיוחד הדורש עצירה 🚨</h3>
<p>כאשר פקודה קוראת מהזיכרון (כמו <code>LW</code>) ומיד אחריה מגיעה פקודה המשתמשת בנתון זה, **מעקף בלבד אינו מספיק**. הנתון מהזיכרון נקרא רק בסוף שלב ה-MEM, ואילו הפקודה העוקבת צריכה אותו כבר בתחילת שלב ה-EX שלה (שהוא מקביל לשלב ה-MEM של פקודת ה-Load). המעבד חייב להכניס **עצירה של מחזור אחד (1-cycle Stall)** הנקראת בועה (Bubble).</p>
<p>יחידת זיהוי התקלות (Hazard Detection Unit) מזהה מצב זה ומקפיאה את ה-PC ואת אוגר ה-IF/ID למחזור אחד.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. דוגמת קוד: יחידת מעקף (Forwarding Unit) מפושטת 💻</h3>
<p>הקוד הבא מראה כיצד מייצרים מעקף בסיסי של ALU בשלב EX (ללא קשר לטעינה מהזיכרון):</p>
<pre dir="ltr"><code>module forward_example (
    input [4:0] ex_rs1,
    input [4:0] mem_rd,
    input mem_reg_write,
    output reg forward_a
);
    always @(*) begin
        // אם שלב MEM כותב לאוגר שאינו x0, והוא זהה לאוגר המקור של שלב EX
        if (mem_reg_write && (mem_rd != 5'd0) && (mem_rd == ex_rs1)) begin
            forward_a = 1'b1; // בצע מעקף משלב MEM
        end else begin
            forward_a = 1'b0; // קח מהרגיסטר פייל המקורי
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. The Execute (EX) Stage & Pipeline Hazards 🛡️</h3>
<p>In the <strong>Execute (EX)</strong> stage, the ALU computes results or branch destinations. However, executing multiple instructions in parallel creates a fundamental issue: <strong>Pipeline Hazards</strong>. A hazard occurs when the pipeline cannot execute the next instruction in the subsequent clock cycle.</p>
<p>Hazards fall into three categories:</p>
<ol>
  <li><strong>Structural Hazards:</strong> Hardware resource conflicts, e.g., when two instructions attempt to access the same memory port simultaneously.</li>
  <li><strong>Data Hazards:</strong> An instruction depends on the result of a previous instruction that has not yet completed its write-back (Read-After-Write conflict).</li>
  <li><strong>Control Hazards:</strong> Decisions about conditional branches or jumps alter the instruction flow, potentially rendering already-fetched instructions invalid.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Resolving Data Hazards: Forwarding vs. Stalling ⏳</h3>
<p>Data hazards are mitigated in two main ways:</p>
<ul>
  <li><strong>Forwarding (Bypassing):</strong> Routing computed results directly from pipeline register outputs (EX/MEM or MEM/WB) to ALU inputs. This avoids delaying instructions and keeps the throughput high.</li>
  <li><strong>Stalling (Bubble Insertion):</strong> Freezing the early pipeline stages (IF, ID) and injecting a dummy instruction (NOP - No Operation) into the EX stage, allowing the hazard-producing instruction to finish computation.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. The Load-Use Hazard 🚨</h3>
<p>A special data hazard arises when an instruction reads data from memory (e.g., <code>LW</code>) and the immediate next instruction uses that data as an operand. Because data from a load instruction is only available at the end of the MEM stage, forwarding alone cannot resolve the conflict in time for the execute stage of the subsequent instruction. The processor must insert a **one-cycle stall** (a bubble) in the pipeline.</p>
<p>The Hazard Detection Unit monitors this condition and pauses the PC and the IF/ID pipeline registers for one clock cycle.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>4. Code Example: Simplified Forwarding Controller 💻</h3>
<p>Below is a simplified forwarding detection block for a source register:</p>
<pre dir="ltr"><code>module forward_example (
    input [4:0] ex_rs1,
    input [4:0] mem_rd,
    input mem_reg_write,
    output reg forward_a
);
    always @(*) begin
        // If MEM stage writes to a register other than x0, and it matches EX source
        if (mem_reg_write && (mem_rd != 5'd0) && (mem_rd == ex_rs1)) begin
            forward_a = 1'b1; // Forward from MEM stage
        end else begin
            forward_a = 1'b0; // Use normal Register File output
        end
    end
endmodule</code></pre>
`,

      taskHe: `ממשו יחידת זיהוי תקלות (Hazard Detection Unit) במודול בשם <code dir="ltr">top_module</code> עבור מעבד RISC-V.
הכניסות הן:
- <code dir="ltr">[4:0] if_id_rs1</code> (אינדקס אוגר מקור 1 של הפקודה בשלב הפענוח).
- <code dir="ltr">[4:0] if_id_rs2</code> (אינדקס אוגר מקור 2 של הפקודה בשלב הפענוח).
- <code dir="ltr">id_ex_mem_read</code> (אות המציין האם הפקודה שבשלב הביצוע קוראת מהזיכרון, כלומר LW).
- <code dir="ltr">[4:0] id_ex_rd</code> (אינדקס אוגר היעד של הפקודה שבשלב הביצוע).

היציאה היא:
- <code dir="ltr">stall</code> (1-bit, מוגדר כ-<code dir="ltr">output reg</code>): סימון עצירה של הפייפליין.

לוגיקת העבודה:
עליכם להעלות את אות ה-<code dir="ltr">stall</code> ל-1 אם מתרחשת תקלת Load-use:
- הפקודה בשלב הביצוע קוראת מהזיכרון (<code dir="ltr">id_ex_mem_read == 1</code>).
- אוגר היעד שלה אינו אוגר אפס (<code dir="ltr">id_ex_rd != 0</code>, מכיוון שב-RISC-V האוגר x0 הוא קבוע 0 ואין צורך לעצור בגללו).
- אוגר היעד (<code dir="ltr">id_ex_rd</code>) שווה לפחות לאחד מאוגרי המקור של הפקודה הנוכחית בשלב הפענוח (<code dir="ltr">if_id_rs1</code> או <code dir="ltr">if_id_rs2</code>).

בכל מצב אחר, היציאה <code dir="ltr">stall</code> צריכה להיות 0.`,

      taskEn: `Implement a Hazard Detection Unit in <code dir="ltr">top_module</code> to identify Load-use hazards in a RISC-V pipeline.
The inputs are:
- <code dir="ltr">[4:0] if_id_rs1</code> (source register 1 index in Decode stage).
- <code dir="ltr">[4:0] if_id_rs2</code> (source register 2 index in Decode stage).
- <code dir="ltr">id_ex_mem_read</code> (flag indicating the instruction in Execute stage is reading from memory, e.g., LW).
- <code dir="ltr">[4:0] id_ex_rd</code> (destination register index in Execute stage).

The output is:
- <code dir="ltr">stall</code> (1-bit, must be declared as <code dir="ltr">output reg</code>).

Logic:
Set <code dir="ltr">stall = 1</code> if a Load-use hazard occurs:
- The instruction in the EX stage is reading memory (<code dir="ltr">id_ex_mem_read == 1</code>).
- The destination register is not zero (<code dir="ltr">id_ex_rd != 0</code>, because register <code dir="ltr">x0</code> always reads 0 and never causes data hazards).
- The destination register (<code dir="ltr">id_ex_rd</code>) matches either source register of the instruction currently in the ID stage (<code dir="ltr">if_id_rs1</code> or <code dir="ltr">if_id_rs2</code>).

In any other case, set <code dir="ltr">stall = 0</code>.`,

      starterCode: `module top_module (
    input [4:0] if_id_rs1,
    input [4:0] if_id_rs2,
    input id_ex_mem_read,
    input [4:0] id_ex_rd,
    output reg stall
);

    // לוגיקת זיהוי תקלה מסוג Load-use / Load-use hazard detection logic
    always @(*) begin
        // כתבו את התנאי כאן / Write your condition here
    end
endmodule`,

      solutionCode: `module top_module (
    input [4:0] if_id_rs1,
    input [4:0] if_id_rs2,
    input id_ex_mem_read,
    input [4:0] id_ex_rd,
    output reg stall
);
    always @(*) begin
        if (id_ex_mem_read && (id_ex_rd != 5'd0) && ((id_ex_rd == if_id_rs1) || (id_ex_rd == if_id_rs2))) begin
            stall = 1'b1;
        end else begin
            stall = 1'b0;
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, if_id_rs1: 5, if_id_rs2: 6, id_ex_mem_read: 1, id_ex_rd: 5, stall: 1 },
        { time: 10, if_id_rs1: 5, if_id_rs2: 6, id_ex_mem_read: 1, id_ex_rd: 6, stall: 1 },
        { time: 20, if_id_rs1: 5, if_id_rs2: 6, id_ex_mem_read: 1, id_ex_rd: 0, stall: 0 },
        { time: 30, if_id_rs1: 5, if_id_rs2: 6, id_ex_mem_read: 0, id_ex_rd: 5, stall: 0 },
        { time: 40, if_id_rs1: 5, if_id_rs2: 6, id_ex_mem_read: 1, id_ex_rd: 12, stall: 0 }
      ],

      hints: {
        he: "שלבו את שלושת התנאים בבלוק always צירופי בעזרת האופרטור הלוגי && (וגם) והאופרטור || (או). זכרו לבדוק שספרת האוגר גדולה מאפס (id_ex_rd != 0).",
        en: "Combine the three conditions inside a combinational always block using logical AND (&&) and logical OR (||) operators. Remember to check that the destination register is not zero (id_ex_rd != 0)."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter13Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter13Lessons);
  }
})();
