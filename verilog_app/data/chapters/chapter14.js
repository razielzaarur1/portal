/* ==========================================================================
   VeriLearn Curriculum — Chapter 14: Advanced Hardware Verification & Testbenches (Lessons 98 to 100)
   ========================================================================== */

(function() {
  const chapter14Lessons = [
    // --------------------------------------------------------------------------
    // Lesson 98: Self-Checking Testbench with Tasks
    // --------------------------------------------------------------------------
    {
      id: 98,
      chapter: 14,
      chapterTitleHe: "פרק 14: אימות חומרה מתקדם ו-Testbenches",
      chapterTitleEn: "Chapter 14: Advanced Hardware Verification & Testbenches",
      titleHe: "בדיקה עצמית ב-Testbench באמצעות Tasks 🧪",
      titleEn: "Self-Checking Testbench with Tasks",

      explanationHe: `
<h3>1. הצורך במשימות (Tasks) בתוך Testbenches 🧪</h3>
<p>בסימולציות חומרה רחבות היקף, קוד ה-Testbench עלול להפוך למסורבל וקשה לתחזוקה בשל חזרתיות רבה של פעולות בדיקה. בכל פעם שאנו רוצים לשלוח נתונים לרכיב הנבדק (DUT) ולבדוק אם המוצא שלו תקין, אנו נאלצים לכתוב מחדש את לוגיקת כתיבת האותות וההמתנה לשעון.</p>

<p>כדי למנוע חזרה על קוד ולייצר סביבות בדיקה קריאות ומודולריות, שפת Verilog תומכת בבלוק <strong>task</strong> (משימה). בניגוד לפונקציות (functions), משימה יכולה להכיל השהיות זמנים (כמו <code dir="ltr">#delay</code> או <code dir="ltr">@(posedge clk)</code>) ולכן היא מושלמת להנחיית תרחישי בדיקה (Test Stimulus) ואימות תוצאות.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. השוואה בין Task ל-Function ב-Verilog 📊</h3>
<p>לפני שנצלול לשימוש במשימות, חשוב להבין את ההבדלים המרכזיים בינן לבין פונקציות רגילות בחומרה:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>מאפיין</th>
      <th>Task (משימה)</th>
      <th>Function (פונקציה)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>החזרת ערך</strong></td>
      <td>אינו מחזיר ערך ישירות (משתמש ב-output)</td>
      <td>מחזיר ערך יחיד בדיוק</td>
    </tr>
    <tr>
      <td><strong>השהיית זמן (#)</strong></td>
      <td>מותרת (יכול להמתין לשעון או לעשות השהיות)</td>
      <td>אסורה בהחלט (מבוצעת בזמן אפס)</td>
    </tr>
    <tr>
      <td><strong>קריאה לפונקציות/משימות</strong></td>
      <td>יכול לקרוא למשימות אחרות ולפונקציות</td>
      <td>יכול לקרוא לפונקציות בלבד</td>
    </tr>
    <tr>
      <td><strong>שימוש טיפוסי</strong></td>
      <td>אימות, כתיבת תרחישי בדיקה (stimulus driving)</td>
      <td>חישובים מתמטיים או לוגיים קצרים בלבד</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. מבנה והגדרת Task ב-Testbench 📐</h3>
<p>להלן דוגמה כללית להגדרת משימה שמזינה אותות למעגל ובודקת את התקינות שלו (שימו לב לשמות הכלליים כדי להדגים את העיקרון):</p>

<pre dir="ltr"><code>// הגדרת משימת בדיקה גנרית
task apply_test_vector;
    input [7:0] val_a;
    input [7:0] expected_val;
    begin
        sim_input = val_a;
        #10; // המתנה קלה שהאות יתייצב
        
        // בדיקת תאימות המוצא לערך הצפוי
        if (sim_output !== expected_val) begin
            $display("ERROR: Input %h gave %h instead of %h", val_a, sim_output, expected_val);
        end else begin
            $display("SUCCESS: Input %h matches expectation.", val_a);
        end
    end
endtask

// קריאה למשימה בתוך בלוק initial
initial begin
    apply_test_vector(8'hFF, 8'h00);
    apply_test_vector(8'h0A, 8'h0F);
end</code></pre>
`,

      explanationEn: `
<h3>1. The Need for Tasks in Testbenches 🧪</h3>
<p>In large-scale hardware verification, testbench code can quickly become cluttered and difficult to maintain due to repeating verification patterns. Whenever we want to drive data into the Device Under Test (DUT) and verify its response, we typically write the same signals driving and clocking sequences over and over.</p>

<p>To eliminate redundancy and construct readable, modular test environments, Verilog provides the <strong>task</strong> block. Unlike functions, tasks can contain simulation time-consuming statements (like <code dir="ltr">#delay</code> or <code dir="ltr">@(posedge clk)</code>), making them perfect for stimulus driving and response checking.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Task vs. Function Comparison in Verilog 📊</h3>
<p>Before applying tasks, it is crucial to understand how they differ from standard hardware functions:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>Feature</th>
      <th>Task</th>
      <th>Function</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Return Value</strong></td>
      <td>Does not return a value directly (uses outputs instead)</td>
      <td>Returns exactly one value</td>
    </tr>
    <tr>
      <td><strong>Time Delays (#, @)</strong></td>
      <td>Allowed (can block/wait for clock edges or time)</td>
      <td>Strictly forbidden (must execute in zero simulation time)</td>
    </tr>
    <tr>
      <td><strong>Calling Behavior</strong></td>
      <td>Can call other tasks and functions</td>
      <td>Can only call other functions</td>
    </tr>
    <tr>
      <td><strong>Typical Use Case</strong></td>
      <td>Verification, driving testbench stimuli</td>
      <td>Mathematical operations or combinational logic</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Defining and Calling a Task 📐</h3>
<p>Here is a generic example of a verification task driving test inputs and evaluating outputs (using general variable names):</p>

<pre dir="ltr"><code>// Declaring a generic validation task
task apply_test_vector;
    input [7:0] val_a;
    input [7:0] expected_val;
    begin
        sim_input = val_a;
        #10; // Wait for the signals to settle
        
        // Assert the output value
        if (sim_output !== expected_val) begin
            $display("ERROR: Input %h gave %h instead of %h", val_a, sim_output, expected_val);
        end else begin
            $display("SUCCESS: Input %h matches expectation.", val_a);
        end
    end
endtask

// Invoking the task inside an initial block
initial begin
    apply_test_vector(8'hFF, 8'h00);
    apply_test_vector(8'h0A, 8'h0F);
end</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המייצג בקר אימות פשוט. למודול יש שתי כניסות ברוחב 4 ביטים בשם <code dir="ltr">a</code> ו-<code dir="ltr">b</code> ויציאה יחידה בשם <code dir="ltr">error_flag</code>.
1. הקצו באופן רציף (<code dir="ltr">assign</code>) את <code dir="ltr">error_flag = 1</code> כאשר <code dir="ltr">a</code> אינו שווה ל-<code dir="ltr">b</code>, ואחרת ל-0.
2. הגדירו בתוך המודול משימה (<code dir="ltr">task</code>) בשם <code dir="ltr">check_match</code> המקבלת שתי כניסות ברוחב 4 ביטים בשם <code dir="ltr">val1</code> ו-<code dir="ltr">val2</code>. בתוך המשימה, כתבו תנאי הבודק אם המשתנים שונים, ואם כן מדפיס הודעת שגיאה באמצעות <code dir="ltr">$display</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> that acts as a verification checker. The module has two 4-bit inputs named <code dir="ltr">a</code> and <code dir="ltr">b</code>, and a single output named <code dir="ltr">error_flag</code>.
1. Use a continuous <code dir="ltr">assign</code> statement to set <code dir="ltr">error_flag = 1</code> when <code dir="ltr">a</code> is not equal to <code dir="ltr">b</code>, and 0 otherwise.
2. Define a Verilog <code dir="ltr">task</code> named <code dir="ltr">check_match</code> inside the module that takes two 4-bit inputs: <code dir="ltr">val1</code> and <code dir="ltr">val2</code>. Within the task, check if they are not equal, and if so, print an error message using <code dir="ltr">$display</code>.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output error_flag
);
    // כתבו את הקצאת error_flag והגדרת ה-task כאן
    // Write your error_flag assignment and task definition here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    output error_flag
);
    assign error_flag = (a != b);

    task check_match;
        input [3:0] val1;
        input [3:0] val2;
        begin
            if (val1 != val2) begin
                $display("Mismatch detected: val1 = %d, val2 = %d", val1, val2);
            end
        end
    endtask
endmodule`,

      expectedOutputs: [
        { time: 0, a: 3, b: 3, error_flag: 0 },
        { time: 5, a: 3, b: 7, error_flag: 1 },
        { time: 10, a: 10, b: 10, error_flag: 0 },
        { time: 15, a: 0, b: 15, error_flag: 1 }
      ],

      hints: {
        he: "השתמשו ב-assign error_flag = (a != b); והגדירו משימה עם המילים השמורות task ו-endtask המקבלת שתי כניסות.",
        en: "Use assign error_flag = (a != b); and define a task with task and endtask keywords taking two inputs."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 99: System Tasks & Assertions ($fatal, $error)
    // --------------------------------------------------------------------------
    {
      id: 99,
      chapter: 14,
      chapterTitleHe: "פרק 14: אימות חומרה מתקדם ו-Testbenches",
      chapterTitleEn: "Chapter 14: Advanced Hardware Verification & Testbenches",
      titleHe: "משימות מערכת לדיווח שגיאות ($fatal ו-$error) 🛑",
      titleEn: "System Tasks & Assertions ($fatal, $error)",

      explanationHe: `
<h3>1. בקרת חומרת אימות ומשימות דיווח מערכתיות 🛑</h3>
<p>כאשר כותבים תרחישי בדיקה (Testbenches) מקצועיים, שימוש פשוט ב-<code dir="ltr">$display</code> לעיתים קרובות אינו מספיק. אנו זקוקים למנגנון אחיד שיסווג שגיאות לפי רמות חומרה שונות (Severity Levels), ידווח על כשלים בכלי הסימולציה ויאפשר הפסקה מיידית של הבדיקה במקרה של תקלה חמורה המונעת המשך סימולציה.</p>

<p>לשם כך, שפת Verilog ו-SystemVerilog כוללות משימות מערכת מובנות לדיווח ואסרציות (Assertions):</p>
<ul>
  <li><strong><code dir="ltr">$error</code></strong>: מדווח על שגיאה (כשל בבדיקה). מדפיס הודעה בפורמט מובנה הכולל את שם הקובץ ומספר השורה, אך <strong>מאפשר לסימולציה להמשיך לרוץ</strong>.</li>
  <li><strong><code dir="ltr">$fatal</code></strong>: מציין שגיאה קריטית (כגון חוסר יציבות בשעון או שגיאת זיכרון חמורה). מדפיס הודעה מיוחדת ו<strong>מפסיק את הסימולציה באופן מיידי</strong>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. רמות Severity בסימולציית Verilog 📊</h3>
<p>להלן טבלת ריכוז משימות המערכת לניהול שגיאות ב-Testbenches:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>משימת מערכת</th>
      <th>רמת חומרה / חומרה מומלצת</th>
      <th>השפעה על הסימולציה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code dir="ltr">$info</code></td>
      <td>מידע כללי (Information)</td>
      <td>מדפיס הודעה וממשיך ריצה כרגיל</td>
    </tr>
    <tr>
      <td><code dir="ltr">$warning</code></td>
      <td>אזהרה (Warning)</td>
      <td>מדפיס אזהרה, מסמן למהנדס וממשיך ריצה</td>
    </tr>
    <tr>
      <td><code dir="ltr">$error</code></td>
      <td>שגיאה (Error)</td>
      <td>מדווח על כשל בבדיקה, ממשיך סימולציה ומעלה מונה שגיאות</td>
    </tr>
    <tr>
      <td><code dir="ltr">$fatal</code></td>
      <td>שגיאה קריטית (Fatal Error)</td>
      <td>מדפיס הודעת שגיאה חמורה ומפסיק את הסימולציה מיידית</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. שימוש ב-$error בבלוקים צירופיים 📐</h3>
<p>ניתן לשלב משימות מערכת אלו בתוך בלוקים תהליכיים רגילים כחלק מלוגיקת האימות:</p>

<pre dir="ltr"><code>// דוגמה גנרית לבדיקת גבולות של קוד פעולה (OPCODE)
always @(*) begin
    if (op_code_signal > 4'd12) begin
        // הדפסת שגיאה שאינה עוצרת את הסימולציה
        $error("Invalid instruction detected: op=%d", op_code_signal);
    end
end</code></pre>
`,

      explanationEn: `
<h3>1. Standard Error Reporting and Severity Levels 🛑</h3>
<p>When writing professional testbenches, simple print statements like <code dir="ltr">$display</code> are often not enough. Verification environments require a standardized mechanism to classify errors by severity, alert simulation tools, and gracefully stop execution if a catastrophic failure occurs.</p>

<p>To address this, Verilog and SystemVerilog provide built-in severity reporting tasks:</p>
<ul>
  <li><strong><code dir="ltr">$error</code></strong>: Reports a verification mismatch or test failure. It prints a standard warning including the file name and line number, but <strong>allows simulation to continue running</strong> to capture other potential errors.</li>
  <li><strong><code dir="ltr">$fatal</code></strong>: Represents a critical system failure (e.g., clock loss or memory lock). It logs a severity-critical error and <strong>terminates the simulation immediately</strong>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Severity Levels in Verification 📊</h3>
<p>Below is a summary of standard simulation reporting tasks:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>System Task</th>
      <th>Severity Level</th>
      <th>Simulation Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code dir="ltr">$info</code></td>
      <td>Informational</td>
      <td>Prints the message and continues simulation.</td>
    </tr>
    <tr>
      <td><code dir="ltr">$warning</code></td>
      <td>Warning</td>
      <td>Prints a warning and continues simulation.</td>
    </tr>
    <tr>
      <td><code dir="ltr">$error</code></td>
      <td>Error</td>
      <td>Indicates check failure, continues simulation, increments error count.</td>
    </tr>
    <tr>
      <td><code dir="ltr">$fatal</code></td>
      <td>Fatal</td>
      <td>Terminates the simulation run immediately.</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Utilizing $error in Combinational Checks 📐</h3>
<p>These reporting tasks can be integrated directly inside procedural code blocks to execute monitoring logic:</p>

<pre dir="ltr"><code>// Generic out-of-range instruction verification
always @(*) begin
    if (op_code_signal > 4'd12) begin
        // Logs an error message but lets the simulator continue
        $error("Invalid instruction detected: op=%d", op_code_signal);
    end
end</code></pre>
`,

      taskHe: `בנו מודול בשם <code dir="ltr">top_module</code> המבצע בדיקת גבולות של כניסת נתונים.
למודול יש כניסת נתונים ברוחב 4 ביט בשם <code dir="ltr">in</code>, יציאת נתונים ברוחב 4 ביט בשם <code dir="ltr">out</code>, ויציאה יחידה בשם <code dir="ltr">error_flag</code>.
1. חברו את היציאה <code dir="ltr">out</code> לכניסה <code dir="ltr">in</code> (השמה רציפה).
2. בצעו השמה רציפה ל-<code dir="ltr">error_flag</code> כך שיהיה שווה ל-1 כאשר ערך הכניסה <code dir="ltr">in</code> גדול מ-9, ואחרת ל-0.
3. הוסיפו בלוק <code dir="ltr">always @(*)</code> שבתוכו תנאי: אם הכניסה <code dir="ltr">in</code> גדולה מ-9, תופעל משימת המערכת <code dir="ltr">$error</code>.`,
      taskEn: `Create a module named <code dir="ltr">top_module</code> that performs boundary check verification.
The module has a 4-bit input named <code dir="ltr">in</code>, a 4-bit output named <code dir="ltr">out</code>, and a single output named <code dir="ltr">error_flag</code>.
1. Connect the output <code dir="ltr">out</code> directly to the input <code dir="ltr">in</code> (continuous assignment).
2. Continuously assign <code dir="ltr">error_flag</code> to 1 when the input <code dir="ltr">in</code> is greater than 9, and 0 otherwise.
3. Design an <code dir="ltr">always @(*)</code> block with a condition: if <code dir="ltr">in</code> exceeds 9, trigger the <code dir="ltr">$error</code> system task.`,

      starterCode: `module top_module (
    input [3:0] in,
    output [3:0] out,
    output error_flag
);
    // כתבו את הקצאות האותות ובלוק ה-always כאן
    // Write your signal assignments and always block here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] in,
    output [3:0] out,
    output error_flag
);
    assign out = in;
    assign error_flag = (in > 9);

    always @(*) begin
        if (in > 9) begin
            $error("Boundary check failed: Input %d exceeds 9!", in);
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, in: 2, out: 2, error_flag: 0 },
        { time: 5, in: 9, out: 9, error_flag: 0 },
        { time: 10, in: 10, out: 10, error_flag: 1 },
        { time: 15, in: 13, out: 13, error_flag: 1 }
      ],

      hints: {
        he: "השתמשו ב-assign error_flag = (in > 9); ובבלוק always @(*) שבודק if (in > 9) ומפעיל $error(...);",
        en: "Use assign error_flag = (in > 9); and an always @(*) block checking if (in > 9) to run $error(...);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 100: Capstone Project: Full Verification of RISC-V Core Component
    // --------------------------------------------------------------------------
    {
      id: 100,
      chapter: 14,
      chapterTitleHe: "פרק 14: אימות חומרה מתקדם ו-Testbenches",
      chapterTitleEn: "Chapter 14: Advanced Hardware Verification & Testbenches",
      titleHe: "פרויקט מסכם: אימות מלא של רכיב מעבד RISC-V 🚀",
      titleEn: "Capstone Project: Full Verification of RISC-V Core Component",

      explanationHe: `
<h3>1. אימות רכיבי מעבד (RISC-V CPU Verification) 🚀</h3>
<p>בתכנון מעבדי RISC-V מודרניים, ה-<strong>ALU (Arithmetic Logic Unit - יחידה אריתמטית לוגית)</strong> הוא הלב המבצע את כל חישובי המתמטיקה והלוגיקה (חיבור, חיסור, פעולות AND/OR ועוד). שגיאה קטנה ב-ALU תשבש את כל פעילות המחשב. לכן, כתיבת תרחיש בדיקה מקיף שמכסה את כל מקרי הקצה היא חיונית ביותר.</p>

<p>בפרויקט מסכם זה, נבנה רכיב ALU בסיסי שמשמש כליבת חישוב במעבד RISC-V ונאמת את פעולתו באמצעות קבוצה של מקרי קצה (Corner Cases) ודגלים לזיהוי שגיאות.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מפרט האותות של רכיב ה-ALU 📐</h3>
<p>לפני כתיבת הקוד, נביט במפרט האותות של ה-ALU המתוכנן:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>כניסה / יציאה</th>
      <th>רוחב (Bits)</th>
      <th>כיוון</th>
      <th>תיאור התפקיד ברכיב ה-ALU</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code dir="ltr">a</code></td>
      <td>4</td>
      <td>Input (כניסה)</td>
      <td>אופרנד ראשון לחישוב</td>
    </tr>
    <tr>
      <td><code dir="ltr">b</code></td>
      <td>4</td>
      <td>Input (כניסה)</td>
      <td>אופרנד שני לחישוב</td>
    </tr>
    <tr>
      <td><code dir="ltr">sel</code></td>
      <td>1</td>
      <td>Input (כניסה)</td>
      <td>בורר הפעולה: 0 לחיבור (+), 1 ל-AND בינארי (&amp;)</td>
    </tr>
    <tr>
      <td><code dir="ltr">out</code></td>
      <td>4</td>
      <td>Output (יציאה)</td>
      <td>תוצאת החישוב האריתמטי או הלוגי</td>
    </tr>
    <tr>
      <td><code dir="ltr">zero</code></td>
      <td>1</td>
      <td>Output (יציאה)</td>
      <td>דגל המציין האם תוצאת ה-ALU שווה בדיוק לאפס</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. לוגיקת המעגל ודגל ה-Zero 🎯</h3>
<p>רכיבי ALU במעבדי RISC-V מעדכנים תמיד דגלי מצב (Flags) לטובת ביצוע פקודות הסתעפות (Branches). דגל ה-<strong>zero</strong> עונה ל-1 לוגי כאשר תוצאת החישוב היא בדיוק אפס, מה שמאפשר לבדוק למשל אם שני רגיסטרים שווים זה לזה באמצעות פעולת חיסור.</p>

<p>דוגמה גנרית לחיווי דגל אפס במעגלים צירופיים:</p>
<pre dir="ltr"><code>// דוגמה לקביעת דגל אפס מתוך אות תוצאה
assign flag_zero_status = (computed_result_wire == 8'd0);</code></pre>
`,

      explanationEn: `
<h3>1. CPU Component Verification (RISC-V ALU) 🚀</h3>
<p>In modern RISC-V processor designs, the <strong>ALU (Arithmetic Logic Unit)</strong> is the computational heart executing all mathematical and logical functions (addition, subtraction, logical AND/OR, etc.). A single bug in the ALU compromises the entire computer system. Therefore, writing comprehensive test vectors covering all boundary/corner cases is crucial.</p>

<p>In this Capstone project, we will implement a basic ALU component commonly used in RISC-V cores and verify its performance under varying configurations using boundary test steps and status flags.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. ALU Interface Specification 📐</h3>
<p>Below is the detailed signal specification for our custom ALU design:</p>

<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; margin: 1rem 0; border-color: var(--border-color);">
  <thead>
    <tr style="background-color: var(--table-header-bg);">
      <th>Signal</th>
      <th>Width (Bits)</th>
      <th>Direction</th>
      <th>ALU Functional Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code dir="ltr">a</code></td>
      <td>4</td>
      <td>Input</td>
      <td>First operand for the operation</td>
    </tr>
    <tr>
      <td><code dir="ltr">b</code></td>
      <td>4</td>
      <td>Input</td>
      <td>Second operand for the operation</td>
    </tr>
    <tr>
      <td><code dir="ltr">sel</code></td>
      <td>1</td>
      <td>Input</td>
      <td>Operation select: 0 for ADD (+), 1 for bitwise AND (&amp;)</td>
    </tr>
    <tr>
      <td><code dir="ltr">out</code></td>
      <td>4</td>
      <td>Output</td>
      <td>ALU arithmetic or logical output result</td>
    </tr>
    <tr>
      <td><code dir="ltr">zero</code></td>
      <td>1</td>
      <td>Output</td>
      <td>Zero flag, high when the ALU output is exactly 0</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. Zero Flag Logic 🎯</h3>
<p>ALUs in RISC-V processors output status flags to control conditional program branches. The <strong>zero</strong> flag is asserted high (1) whenever the calculated result is exactly zero. This helps determine whether two registers are equal (by checking if their difference is zero).</p>

<p>Generic assignment example for a zero flag:</p>
<pre dir="ltr"><code>// Zero flag output based on computed result
assign flag_zero_status = (computed_result_wire == 8'd0);</code></pre>
`,

      taskHe: `בנו מודול ALU פשוט עבור מעבד RISC-V בשם <code dir="ltr">top_module</code> בעל כניסות <code dir="ltr">a</code> ו-<code dir="ltr">b</code> (ברוחב 4 ביט כל אחת), כניסת בקרה <code dir="ltr">sel</code> (1-ביט), ויציאות <code dir="ltr">out</code> (ברוחב 4 ביט) ו-<code dir="ltr">zero</code> (1-ביט).
מימו את לוגיקת ה-ALU הבאה באמצעות השמות רציפות (<code dir="ltr">assign</code>):
1. אם <code dir="ltr">sel == 1</code>, תוצאת היציאה <code dir="ltr">out</code> תהיה המכפלה הלוגית של הכניסות (פעולת AND בינארית: <code dir="ltr">a & b</code>).
2. אם <code dir="ltr">sel == 0</code>, תוצאת היציאה <code dir="ltr">out</code> תהיה סכום הכניסות (פעולת חיבור: <code dir="ltr">a + b</code>).
3. הקצו את <code dir="ltr">zero</code> להיות 1 אם <code dir="ltr">out</code> שווה ל-0, ואחרת ל-0.`,
      taskEn: `Build a simplified RISC-V ALU inside <code dir="ltr">top_module</code> with 4-bit inputs <code dir="ltr">a</code> and <code dir="ltr">b</code>, a 1-bit control input <code dir="ltr">sel</code>, a 4-bit output <code dir="ltr">out</code>, and a 1-bit status output <code dir="ltr">zero</code>.
Implement the ALU logic using continuous <code dir="ltr">assign</code> statements:
1. If <code dir="ltr">sel == 1</code>, the output <code dir="ltr">out</code> should be the bitwise AND of inputs (<code dir="ltr">a & b</code>).
2. If <code dir="ltr">sel == 0</code>, the output <code dir="ltr">out</code> should be the arithmetic sum of inputs (<code dir="ltr">a + b</code>).
3. Assign <code dir="ltr">zero</code> to 1 if <code dir="ltr">out</code> is exactly equal to 0, and 0 otherwise.`,

      starterCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input sel,
    output [3:0] out,
    output zero
);
    // כתבו את מימוש ה-ALU וקביעת דגל ה-zero כאן
    // Write your ALU implementation and zero flag assignment here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] a,
    input [3:0] b,
    input sel,
    output [3:0] out,
    output zero
);
    assign out = sel ? (a & b) : (a + b);
    assign zero = (out == 0);
endmodule`,

      expectedOutputs: [
        { time: 0, a: 5, b: 3, sel: 0, out: 8, zero: 0 },
        { time: 5, a: 5, b: 3, sel: 1, out: 1, zero: 0 },
        { time: 10, a: 0, b: 0, sel: 0, out: 0, zero: 1 },
        { time: 15, a: 12, b: 3, sel: 1, out: 0, zero: 1 }
      ],

      hints: {
        he: "השתמשו באופרטור התנאי ? : למימוש ה-ALU: assign out = sel ? (a & b) : (a + b); וקבעו את zero בעזרת השוואה לאפס.",
        en: "Use the ternary operator ? : for the ALU: assign out = sel ? (a & b) : (a + b); and determine zero using comparisons with 0."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapter14Lessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapter14Lessons);
  }
})();
