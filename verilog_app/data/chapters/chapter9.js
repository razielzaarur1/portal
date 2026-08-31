(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 66: Register File (32 x 32-bit)
    // --------------------------------------------------------------------------
    {
      id: 66,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "קובץ אוגרים (Register File 32x32-bit) 🗄️",
      titleEn: "Register File (32 x 32-bit)",

      explanationHe: `
<h3>1. מהו קובץ אוגרים (Register File)? 🗄️</h3>
<p>בארכיטקטורת מחשבים (כגון RISC-V או MIPS), מעבדים אינם עובדים ישירות מול זיכרון ה-RAM הראשי עבור כל פעולה חשבונית, מכיוון שהגישה ל-RAM איטית מדי. במקום זאת, הם משתמשים במערך מהיר וקטן של אוגרים פנימיים הנקרא <strong>Register File</strong>.</p>

<p>קובץ אוגרים טיפוסי תומך בגישה מרובת-ערוצים (Multi-port access). לדוגמה, כדי לבצע את הפקודה <code dir="ltr">ADD R1, R2, R3</code> (חיבור R2 ו-R3 ושמירת התוצאה ב-R1), המעבד צריך לקרוא **שני אוגרים בו-זמנית** ולכתוב **לאוגר אחד** באותו מחזור שעון. לכן קובץ האוגרים כולל:</p>
<ul>
  <li>שני ערוצי קריאה אסינכרוניים (Combinational Reads) המוחזרים מיידית לפי כתובת.</li>
  <li>ערוץ כתיבה סינכרוני (Clocked Write) המתרחש בעליית השעון כאשר מאופשר אות כתיבה (<code dir="ltr">write_en</code>).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. אוגר האפס החומרה (The Zero Register) 0️⃣</h3>
<p>בארכיטקטורות RISC רבות, האוגר הראשון (אוגר index 0) הוא **קשיח ומחווט תמיד לערך 0**. כל כתיבה לאוגר 0 תתעלם והערך שלו תמיד יישאר 0. עובדה זו מפשטת פקודות רבות במעבד (למשל, העברת ערך בין אוגרים ניתנת למימוש כפעולת חיבור עם אוגר 0).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד: קובץ אוגרים בסיסי (16 אוגרים x 8-ביט) 📐</h3>
<p>שימו לב לשימוש במערך אוגרים דו-ממדי ב-Verilog והקצאת קריאה אסינכרונית:</p>

<pre dir="ltr"><code>module generic_reg_file (
    input clk_i,
    input wr_en_i,
    input [3:0] wr_addr_i,
    input [7:0] data_i,
    input [3:0] rd_addr_a_i,
    output [7:0] data_a_o
);
    // מערך של 16 אוגרים ברוחב 8 ביט כל אחד
    reg [7:0] storage [15:0];

    // כתיבה סינכרונית - אוגר 0 מחווט חומרתית ל-0
    always @(posedge clk_i) begin
        if (wr_en_i && wr_addr_i != 4'b0) begin
            storage[wr_addr_i] <= data_i;
        end
    end

    // קריאה אסינכרונית (קומבינטורית)
    assign data_a_o = (rd_addr_a_i == 4'b0) ? 8'b0 : storage[rd_addr_a_i];
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is a Register File? 🗄️</h3>
<p>In CPU architectures (such as RISC-V or MIPS), the processor executes arithmetic instructions using a small, ultra-fast array of internal registers called a <strong>Register File</strong>. Accessing main memory (RAM) is too slow for clock-by-clock operations.</p>

<p>To support instruction execution like <code dir="ltr">ADD R1, R2, R3</code>, the register file must provide multi-port access: **two read ports** and **one write port**. This allows reading two source operands and writing one destination operand within the same clock cycle.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Zero Register Rule 0️⃣</h3>
<p>In RISC processors, register index 0 is hardwired to zero (<code dir="ltr">0</code>). Any write operation targeted at register 0 is discarded, and reading register 0 always yields <code dir="ltr">0</code>. This is extremely helpful for implementing instructions like register-to-register copying by adding with zero.</p>
`,

      taskHe: `בנו קובץ אוגרים של 32 אוגרים, כאשר כל אוגר הוא ברוחב 32 ביט במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, מאפשר כתיבה <code dir="ltr">write_en</code>, כתובת כתיבה <code dir="ltr">write_reg</code> בגודל 5 ביט, נתוני כתיבה <code dir="ltr">write_data</code> בגודל 32 ביט, ושתי כתובות קריאה <code dir="ltr">read_reg1</code>, <code dir="ltr">read_reg2</code> בגודל 5 ביט.
2. יציאות: <code dir="ltr">read_data1</code>, <code dir="ltr">read_data2</code> בגודל 32 ביט.
3. כתיבה תתבצע בעליית שעון <code dir="ltr">posedge clk</code> אם <code dir="ltr">write_en</code> פעיל, בתנאי שהכתובת <code dir="ltr">write_reg</code> אינה 0.
4. קריאה משני הפורטים תהיה אסינכרונית (קומבינטורית). אם כתובת הקריאה היא 0, היציאה חייבת להיות 0 באופן קבוע.`,
      taskEn: `Implement a 32 x 32-bit Register File inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, write enable <code dir="ltr">write_en</code>, 5-bit write address <code dir="ltr">write_reg</code>, 32-bit write data <code dir="ltr">write_data</code>, and two 5-bit read addresses <code dir="ltr">read_reg1</code>, <code dir="ltr">read_reg2</code>.
2. Outputs: two 32-bit read data ports <code dir="ltr">read_data1</code>, <code dir="ltr">read_data2</code>.
3. Write: Synchronous on <code dir="ltr">posedge clk</code> if <code dir="ltr">write_en</code> is high and <code dir="ltr">write_reg</code> is not 0.
4. Read: Asynchronous. If the read register index is 0, the output must be hardwired to 0.`,

      starterCode: `module top_module (
    input clk,
    input write_en,
    input [4:0] write_reg,
    input [31:0] write_data,
    input [4:0] read_reg1,
    input [4:0] read_reg2,
    output [31:0] read_data1,
    output [31:0] read_data2
);
    // הגדירו את מערך האוגרים ומימשו את הלוגיקה כאן / Define register array and implement logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input write_en,
    input [4:0] write_reg,
    input [31:0] write_data,
    input [4:0] read_reg1,
    input [4:0] read_reg2,
    output [31:0] read_data1,
    output [31:0] read_data2
);
    reg [31:0] rf [31:0];
    
    integer i;
    initial begin
        for (i = 0; i < 32; i = i + 1) begin
            rf[i] = 32'b0;
        end
    end

    always @(posedge clk) begin
        if (write_en && (write_reg != 5'b0)) begin
            rf[write_reg] <= write_data;
        end
    end

    assign read_data1 = (read_reg1 == 5'b0) ? 32'b0 : rf[read_reg1];
    assign read_data2 = (read_reg2 == 5'b0) ? 32'b0 : rf[read_reg2];
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, write_en: 0, write_reg: 0, write_data: 0, read_reg1: 0, read_reg2: 5, read_data1: 0, read_data2: 0 },
        { time: 5, clk: 1, write_en: 1, write_reg: 5, write_data: 100, read_reg1: 0, read_reg2: 5, read_data1: 0, read_data2: 100 },
        { time: 10, clk: 0, write_en: 0, write_reg: 0, write_data: 0, read_reg1: 5, read_reg2: 0, read_data1: 100, read_data2: 0 },
        { time: 15, clk: 1, write_en: 1, write_reg: 0, write_data: 500, read_reg1: 0, read_reg2: 5, read_data1: 0, read_data2: 100 }
      ],

      hints: {
        he: "הגדירו מערך דו-ממדי: reg [31:0] rf [31:0]. כיתבו always @(posedge clk) ובדקו write_en && write_reg != 0. השתמשו ב-assign קומבינטורי לבדיקת index == 0 עבור קריאות.",
        en: "Define a 2D array: reg [31:0] rf [31:0]. Implement always @(posedge clk) checking write_en && write_reg != 0. Use assign statements checking if read register indexes are 0."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 67: Single-Port RAM
    // --------------------------------------------------------------------------
    {
      id: 67,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "זיכרון RAM בעל פורט בודד (Single-Port RAM) 💾",
      titleEn: "Single-Port RAM",

      explanationHe: `
<h3>1. מבוא לזיכרון גישה אקראית (RAM) 💾</h3>
<p>זיכרון גישה אקראית (Random Access Memory - RAM) מאפשר לקרוא ולכתוב נתונים לכל תא זיכרון באופן ישיר לפי כתובת (Address). בחומרה דיגיטלית ובשבבי FPGA, לא מעשי לממש זיכרונות גדולים באמצעות Flip-Flops בודדים, מכיוון שזה צורך שטח סיליקון עצום ומספר שערים עצום. במקום זאת, משתמשים ברכיבים ייעודיים הנקראים <strong>SRAM Blocks</strong>.</p>

<p>בזיכרון בעל פורט בודד (Single-Port RAM):</p>
<ul>
  <li>קיים סט כתובות יחיד (<code dir="ltr">addr</code>) המשמש גם לפעולת הכתיבה וגם לפעולת הקריאה.</li>
  <li>לא ניתן לקרוא ולכתוב לכתובות שונות בו-זמנית באותו מחזור.</li>
  <li>אות מאפשר הכתיבה (<code dir="ltr">we</code> - Write Enable) קובע את המוד: כתיבה כאשר <code dir="ltr">we=1</code>, וקריאה כאשר <code dir="ltr">we=0</code>.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמת קוד: זיכרון RAM קומפקטי (8 מילים x 4-ביט) 📐</h3>
<p>להלן מימוש פשוט של RAM בעל כתיבה סינכרונית וקריאה אסינכרונית:</p>

<pre dir="ltr"><code>module mini_ram_8x4 (
    input clk_sys,
    input wr_en,
    input [2:0] address,
    input [3:0] din,
    output [3:0] dout
);
    reg [3:0] ram_blocks [7:0];

    // כתיבה סינכרונית לשעון
    always @(posedge clk_sys) begin
        if (wr_en) begin
            ram_blocks[address] <= din;
        end
    end

    // קריאה אסינכרונית (מיידית)
    assign dout = ram_blocks[address];
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Introduction to Random Access Memory (RAM) 💾</h3>
<p>Random Access Memory (RAM) allows reading and writing data to any memory location using an address bus. In digital circuits and FPGAs, implementing large memories using individual registers is highly inefficient. Instead, hardware relies on specialized dense structures called <strong>SRAM (Static RAM) blocks</strong>.</p>

<p>In a <strong>Single-Port RAM</strong> configuration:</p>
<ul>
  <li>A single address bus (<code dir="ltr">addr</code>) is shared for both read and write operations.</li>
  <li>Only one operation (either a read or a write) can be performed per clock cycle.</li>
  <li>A Write Enable line (<code dir="ltr">we</code>) dictates the mode: write when high (<code dir="ltr">1</code>), and read when low (<code dir="ltr">0</code>).</li>
</ul>
`,

      taskHe: `בנו זיכרון RAM בעל פורט בודד בנפח של 16 מילים, ברוחב של 8 ביט למילה במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, מאפשר כתיבה <code dir="ltr">we</code>, כתובת <code dir="ltr">addr</code> בגודל 4 ביט, ונתיב כניסת נתונים <code dir="ltr">data_in</code> בגודל 8 ביט.
2. יציאות: יציאת נתונים <code dir="ltr">data_out</code> בגודל 8 ביט.
3. כתיבה: כאשר <code dir="ltr">we</code> פעיל (שווה ל-1), הנתון בכניסה <code dir="ltr">data_in</code> ייכתב לכתובת <code dir="ltr">addr</code> בעליית שעון <code dir="ltr">posedge clk</code>.
4. קריאה: יציאת הנתונים <code dir="ltr">data_out</code> צריכה להציג באופן אסינכרוני (קומבינטורי) את תוכן התא שנמצא בכתובת הנוכחית <code dir="ltr">addr</code>.`,
      taskEn: `Design a 16-word x 8-bit Single-Port RAM inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, write enable <code dir="ltr">we</code>, 4-bit address <code dir="ltr">addr</code>, and 8-bit input data <code dir="ltr">data_in</code>.
2. Outputs: 8-bit output data <code dir="ltr">data_out</code>.
3. Write: Synchronous on <code dir="ltr">posedge clk</code> when <code dir="ltr">we == 1</code>, saving <code dir="ltr">data_in</code> to the location indexed by <code dir="ltr">addr</code>.
4. Read: Asynchronous. The output <code dir="ltr">data_out</code> should continuously display the contents of the memory at address <code dir="ltr">addr</code>.`,

      starterCode: `module top_module (
    input clk,
    input we,
    input [3:0] addr,
    input [7:0] data_in,
    output [7:0] data_out
);
    // הגדירו את זיכרון ה-RAM וממשו את הלוגיקה כאן / Define RAM memory array and write logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input we,
    input [3:0] addr,
    input [7:0] data_in,
    output [7:0] data_out
);
    reg [7:0] mem [15:0];

    always @(posedge clk) begin
        if (we) begin
            mem[addr] <= data_in;
        end
    end

    assign data_out = mem[addr];
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, we: 0, addr: 2, data_in: 0, data_out: 0 },
        { time: 5, clk: 1, we: 1, addr: 2, data_in: 42, data_out: 42 },
        { time: 10, clk: 0, we: 0, addr: 2, data_in: 0, data_out: 42 },
        { time: 15, clk: 1, we: 1, addr: 8, data_in: 99, data_out: 99 },
        { time: 20, clk: 0, we: 0, addr: 2, data_in: 0, data_out: 42 },
        { time: 25, clk: 0, we: 0, addr: 8, data_in: 0, data_out: 99 }
      ],

      hints: {
        he: "הגדירו מערך זיכרון: reg [7:0] mem [15:0]. השתמשו בבלוק always @(posedge clk) בשביל לכתוב ל-mem[addr] כאשר we דלוק. השתמשו ב-assign מחוץ לבלוק לקריאה אסינכרונית.",
        en: "Declare memory array: reg [7:0] mem [15:0]. Implement always @(posedge clk) to write data_in to mem[addr] when we is asserted. Use a continuous assign for data_out = mem[addr]."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 68: Dual-Port RAM
    // --------------------------------------------------------------------------
    {
      id: 68,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "זיכרון RAM בעל פורט כפול (Dual-Port RAM) 🔄",
      titleEn: "Dual-Port RAM",

      explanationHe: `
<h3>1. למה צריך זיכרון בעל פורט כפול (Dual-Port RAM)? 🔄</h3>
<p>במערכות רבות, כגון כרטיסי מסך, אנו צריכים לעשות שתי פעולות במקביל. לדוגמה: מעבד המערכת כותב פיקסלים חדשים לזיכרון התצוגה (Frame Buffer), בעוד שמחולל אות המסך (VGA) קורא בו-זמנית את הפיקסלים כדי להציגם על המסך. אם היינו משתמשים ב-RAM בעל פורט יחיד, המעבד היה צריך להמתין לעצירת הסריקה כדי לכתוב, דבר שהיה גורם לאיטיות קשה.</p>

<p>זיכרון <strong>Dual-Port RAM</strong> פותר זאת ע"י מתן שני פורטים נפרדים לחלוטין (פורט A ופורט B), המאפשרים גישה סימולטנית לאותו מערך תאי זיכרון פיזיים.</p>

<p>קיימים שני סוגים עיקריים:</p>
<ol>
  <li><strong>True Dual-Port RAM</strong>: שני הפורטים (A ו-B) מסוגלים לקרוא ולכתוב.</li>
  <li><strong>Simple Dual-Port RAM</strong>: פורט אחד מיועד לכתיבה בלבד (Write-only) והפורט השני לקריאה בלבד (Read-only). סוג זה נפוץ במיוחד בבניית תורים (FIFOs).</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמת קוד: Simple Dual-Port RAM (8 מילים x 8-ביט) 📐</h3>

<pre dir="ltr"><code>module custom_dual_port_ram (
    input clk_sys,
    input we_port_a,
    input [2:0] addr_port_a,
    input [7:0] din_port_a,
    input [2:0] addr_port_b,
    output [7:0] dout_port_b
);
    reg [7:0] memory_blocks [7:0];

    // כתיבה דרך פורט A סנכרונית לשעון
    always @(posedge clk_sys) begin
        if (we_port_a) begin
            memory_blocks[addr_port_a] <= din_port_a;
        end
    end

    // קריאה אסינכרונית מפורט B
    assign dout_port_b = memory_blocks[addr_port_b];
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Why Dual-Port RAM? 🔄</h3>
<p>In high-throughput systems, we often need to read and write memory simultaneously. For instance, in a video framebuffer, the CPU writes rendering data while the display generator reads pixels to refresh the screen. Dual-Port RAM solves this concurrency bottleneck by providing two distinct address and data buses accessing the same storage cells.</p>

<p>Classification:</p>
<ol>
  <li><strong>True Dual-Port RAM</strong>: Both ports A and B can perform read and write cycles.</li>
  <li><strong>Simple Dual-Port RAM</strong>: One port is dedicated to writing (Write-only) and the other to reading (Read-only). This architecture is commonly used to build hardware FIFO buffers.</li>
</ol>
`,

      taskHe: `בנו זיכרון Simple Dual-Port RAM של 16 מילים ברוחב 8 ביט במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, מאפשר כתיבה עבור פורט א' <code dir="ltr">we_a</code>, כתובת פורט א' <code dir="ltr">addr_a</code> (בגודל 4 ביט), כניסת נתונים פורט א' <code dir="ltr">data_in_a</code> (בגודל 8 ביט), וכתובת קריאה לפורט ב' <code dir="ltr">addr_b</code> (בגודל 4 ביט).
2. יציאות: יציאת נתונים פורט ב' <code dir="ltr">data_out_b</code> (בגודל 8 ביט).
3. כתיבה: בעליית שעון <code dir="ltr">posedge clk</code>, אם <code dir="ltr">we_a</code> שווה ל-1, הנתון <code dir="ltr">data_in_a</code> יישמר בכתובת <code dir="ltr">addr_a</code> במערך הזיכרון.
4. קריאה: היציאה <code dir="ltr">data_out_b</code> תציג באופן אסינכרוני את תוכן התא שנמצא בכתובת הקריאה <code dir="ltr">addr_b</code>.`,
      taskEn: `Build a Simple Dual-Port RAM (16 words x 8-bit) inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, write enable for Port A <code dir="ltr">we_a</code>, Port A address <code dir="ltr">addr_a</code> (4-bit), Port A input data <code dir="ltr">data_in_a</code> (8-bit), and Port B read address <code dir="ltr">addr_b</code> (4-bit).
2. Outputs: Port B read data output <code dir="ltr">data_out_b</code> (8-bit).
3. Write (Port A): On <code dir="ltr">posedge clk</code>, if <code dir="ltr">we_a == 1</code>, write <code dir="ltr">data_in_a</code> to address <code dir="ltr">addr_a</code>.
4. Read (Port B): Drive <code dir="ltr">data_out_b</code> asynchronously with the memory contents at address <code dir="ltr">addr_b</code>.`,

      starterCode: `module top_module (
    input clk,
    input we_a,
    input [3:0] addr_a,
    input [7:0] data_in_a,
    input [3:0] addr_b,
    output [7:0] data_out_b
);
    // הגדירו את מערך הזיכרון וממשו את פורטי הכתיבה והקריאה / Define memory and implement ports here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input we_a,
    input [3:0] addr_a,
    input [7:0] data_in_a,
    input [3:0] addr_b,
    output [7:0] data_out_b
);
    reg [7:0] mem [15:0];

    always @(posedge clk) begin
        if (we_a) begin
            mem[addr_a] <= data_in_a;
        end
    end

    assign data_out_b = mem[addr_b];
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, we_a: 0, addr_a: 0, data_in_a: 0, addr_b: 5, data_out_b: 0 },
        { time: 5, clk: 1, we_a: 1, addr_a: 5, data_in_a: 77, addr_b: 5, data_out_b: 77 },
        { time: 10, clk: 0, we_a: 1, addr_a: 9, data_in_a: 88, addr_b: 5, data_out_b: 77 },
        { time: 15, clk: 1, we_a: 1, addr_a: 9, data_in_a: 88, addr_b: 5, data_out_b: 77 },
        { time: 20, clk: 0, we_a: 0, addr_a: 0, data_in_a: 0, addr_b: 9, data_out_b: 88 }
      ],

      hints: {
        he: "מערך הזיכרון משותף: reg [7:0] mem [15:0]. הבלוק ה-always מופעל ע'י clk וכותב באמצעות addr_a, ואילו assign קורא ישירות מ-mem[addr_b].",
        en: "The memory array is shared: reg [7:0] mem [15:0]. The always block responds to clk and writes using addr_a, while assign reads directly from mem[addr_b]."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 69: ROM Lookup Table
    // --------------------------------------------------------------------------
    {
      id: 69,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "טבלת חיפוש בזיכרון לקריאה בלבד (ROM Lookup Table) 📖",
      titleEn: "ROM Lookup Table",

      explanationHe: `
<h3>1. מהו זיכרון לקריאה בלבד (ROM)? 📖</h3>
<p>זיכרון לקריאה בלבד (Read-Only Memory - ROM) הוא רכיב זיכרון שתוכנו מוגדר מראש ואינו משתנה במהלך פעולת המעגל. בחומרה, הוא משמש לשמירת קבועים מוגדרים מראש, טבלאות המרת קודים, או טבלאות חישוב מתמטיות מהירות - הידועות בשם <strong>Lookup Tables (LUT)</strong>.</p>

<p>לדוגמה, אם עלינו לחשב ערכי סינוס, במקום לממש מעגל לוגי מורכב שמחשב טורים מתמטיים, אנו פשוט שומרים את הערכים מראש ב-ROM, ומשתמשים בזווית ככתובת ה-ROM כדי לקבל את ערך הסינוס במחזור שעון בודד (או ללא שעון בכלל).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מימוש LUT קומבינטורי ב-Verilog 📐</h3>
<p>ניתן לממש ROM קומבינטורי פשוט באמצעות בלוק <code dir="ltr">always @(*)</code> ומבנה <code dir="ltr">case</code> שמגדיר את ערך המוצא לכל כתובת כניסה:</p>

<pre dir="ltr"><code>module power_lut_3bit (
    input [2:0] num_in,
    output reg [5:0] power_val_o
);
    always @(*) begin
        case (num_in)
            3'd0: power_val_o = 6'd0;
            3'd1: power_val_o = 6'd1;
            3'd2: power_val_o = 6'd8;
            3'd3: power_val_o = 6'd27;
            3'd4: power_val_o = 6'd64;
            default: power_val_o = 6'd0;
        endcase
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is Read-Only Memory (ROM) & Lookup Tables? 📖</h3>
<p>Read-Only Memory (ROM) stores permanent pre-programmed static data. In digital design, ROMs are frequently used to build **Lookup Tables (LUTs)**. A LUT maps input values directly to predefined outputs, bypassing complex runtime calculations.</p>

<p>For example, instead of implementing a heavy DSP block to compute a mathematical function (like a sine wave), engineers pre-calculate the outputs and store them in ROM. The input then serves as the memory address, returning the result instantly.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Implementing a Combinational LUT 📐</h3>
<p>A combinational ROM LUT can be implemented using a standard case structure inside an <code dir="ltr">always @(*)</code> block, listing the static mapping for each input index.</p>
`,

      taskHe: `בנו טבלת חיפוש בזיכרון ROM קומבינטורי במודול <code dir="ltr">top_module</code>:
1. כניסות: כתובת <code dir="ltr">addr</code> בגודל 4 ביט.
2. יציאות: מוצא נתונים <code dir="ltr">data_out</code> בגודל 8 ביט.
3. לוגיקה: המעגל יחזיר ביציאה <code dir="ltr">data_out</code> את הריבוע של הכתובת (<code dir="ltr">addr * addr</code>). עליכם למפות את כל 16 האפשרויות (מ-0 ועד 15) במבנה <code dir="ltr">case</code> קומבינטורי.`,
      taskEn: `Design a combinational ROM Lookup Table inside <code dir="ltr">top_module</code>:
1. Inputs: 4-bit address <code dir="ltr">addr</code>.
2. Outputs: 8-bit data output <code dir="ltr">data_out</code>.
3. Logic: The circuit must return the square of the input address (<code dir="ltr">addr * addr</code>). Map all 16 input combinations (0 to 15) using a combinational <code dir="ltr">case</code> block.`,

      starterCode: `module top_module (
    input [3:0] addr,
    output reg [7:0] data_out
);
    // ממשו את טבלת ה-ROM באמצעות case כאן / Implement the ROM table using a case statement here

endmodule`,

      solutionCode: `module top_module (
    input [3:0] addr,
    output reg [7:0] data_out
);
    always @(*) begin
        case (addr)
            4'd0:  data_out = 8'd0;
            4'd1:  data_out = 8'd1;
            4'd2:  data_out = 8'd4;
            4'd3:  data_out = 8'd9;
            4'd4:  data_out = 8'd16;
            4'd5:  data_out = 8'd25;
            4'd6:  data_out = 8'd36;
            4'd7:  data_out = 8'd49;
            4'd8:  data_out = 8'd64;
            4'd9:  data_out = 8'd81;
            4'd10: data_out = 8'd100;
            4'd11: data_out = 8'd121;
            4'd12: data_out = 8'd144;
            4'd13: data_out = 8'd169;
            4'd14: data_out = 8'd196;
            4'd15: data_out = 8'd225;
            default: data_out = 8'd0;
        endcase
    end
endmodule`,

      expectedOutputs: [
        { addr: 0, data_out: 0 },
        { addr: 2, data_out: 4 },
        { addr: 5, data_out: 25 },
        { addr: 10, data_out: 100 },
        { addr: 15, data_out: 225 }
      ],

      hints: {
        he: "פתחו בלוק always @(*) begin case(addr)... והקצו את ערך הריבוע המתאים לכל מקרה: למשל 2 -> 4, 3 -> 9 וכן הלאה.",
        en: "Open an always @(*) begin case(addr)... block and assign the square value for each address: e.g. 2 -> 4, 3 -> 9, up to 15 -> 225."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 70: Synchronous FIFO Memory
    // --------------------------------------------------------------------------
    {
      id: 70,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "זיכרון FIFO סנכרוני (Synchronous FIFO) ⏳",
      titleEn: "Synchronous FIFO Memory",

      explanationHe: `
<h3>1. מהו תור FIFO? ⏳</h3>
<p>תור FIFO (ראשי תיבות: <strong>First-In, First-Out</strong> - הראשון שנכנס הוא הראשון שיוצא) הוא אחד ממבני הנתונים החשובים ביותר בחומרה. הוא משמש כחוצץ (Buffer) זמני בין שני רכיבי חומרה הפועלים במהירויות שונות או בפרוטוקולים שונים כדי למנוע אובדן נתונים.</p>

<p>ב-FIFO סנכרוני, פעולות הכתיבה והקריאה מתבצעות באותו תדר שעון. ה-FIFO מורכב מ-3 יחידות מפתח:</p>
<ol>
  <li><strong>מערך זיכרון (Storage)</strong>: זיכרון RAM בעל פורט כפול פנימי לשמירת הנתונים.</li>
  <li><strong>מצביעים (Pointers)</strong>: מצביע כתיבה (<code dir="ltr">wr_ptr</code>) המורה על התא הבא לכתיבה, ומצביע קריאה (<code dir="ltr">rd_ptr</code>) המורה על התא הבא לקריאה.</li>
  <li><strong>לוגיקת דגלים (Flags)</strong>: המחשבת האם ה-FIFO ריק (<code dir="ltr">empty</code>) או מלא (<code dir="ltr">full</code>), כדי למנוע כתיבת יתר או קריאה מזיכרון ריק.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תרשים זרימת Pointers 🔄</h3>
<p>המצביעים מתקדמים במחזוריות (Circular fashion). ברגע שהם מגיעים לסוף הזיכרון, הם עוטפים חזרה ל-0 (Wrap around). כדי לקבוע אם התור מלא או ריק, נהוג לעקוב אחר כמות האיברים הפעילים באמצעות מונה פנימי.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד: FIFO בסיסי עומק 2 📐</h3>
<p>בדוגמה זו נראה כיצד לנהל כתיבה וקריאה במקביל תוך שימוש במונה איברים פשוט:</p>

<pre dir="ltr"><code>module mini_fifo_x2 (
    input clk,
    input rst,
    input push,
    input pop,
    input [7:0] din,
    output reg [7:0] dout,
    output empty_flag
);
    reg [7:0] buffer [1:0];
    reg wr_idx, rd_idx;
    reg [1:0] count; // ערכים אפשריים: 0, 1, 2

    assign empty_flag = (count == 0);

    always @(posedge clk) begin
        if (rst) begin
            wr_idx <= 0;
            rd_idx <= 0;
            count  <= 0;
        end else begin
            case ({push && (count < 2), pop && (count > 0)})
                2'b10: begin // כתיבה בלבד
                    buffer[wr_idx] <= din;
                    wr_idx <= ~wr_idx;
                    count  <= count + 1;
                end
                2'b01: begin // קריאה בלבד
                    dout  <= buffer[rd_idx];
                    rd_idx <= ~rd_idx;
                    count  <= count - 1;
                end
                2'b11: begin // כתיבה וקריאה בו-זמנית
                    buffer[wr_idx] <= din;
                    wr_idx <= ~wr_idx;
                    dout  <= buffer[rd_idx];
                    rd_idx <= ~rd_idx;
                end
            endcase
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. What is a FIFO Queue? ⏳</h3>
<p>A FIFO (First-In, First-Out) memory buffer stores data temporarily, allowing safe communication between two hardware sub-systems. The first data element pushed into the FIFO is the first one to be read out, preserving sequential order.</p>

<p>In a <strong>Synchronous FIFO</strong>, write and read logic run on the same clock line. Core elements include:</p>
<ol>
  <li><strong>Storage Array</strong>: Dual-port RAM cells holding the queued data.</li>
  <li><strong>Read & Write Pointers</strong>: Registers indicating the current memory cells to be read from and written to. Pointers wrap around circularly.</li>
  <li><strong>Status Flags</strong>: Outputs indicating if the buffer is empty (<code dir="ltr">empty</code>) or full (<code dir="ltr">full</code>).</li>
</ol>
`,

      taskHe: `בנו זיכרון FIFO סנכרוני בעומק של 4 איברים וברוחב של 8 ביט במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, איפוס סינכרוני <code dir="ltr">reset</code>, מאפשר כתיבה <code dir="ltr">wr_en</code>, מאפשר קריאה <code dir="ltr">rd_en</code>, כניסת נתונים <code dir="ltr">data_in</code> בגודל 8 ביט.
2. יציאות: מוצא נתונים <code dir="ltr">data_out</code> בגודל 8 ביט, דגלי סטטוס <code dir="ltr">empty</code> ו-<code dir="ltr">full</code>.
3. התנהגות:
   - בעת <code dir="ltr">reset</code> (שווה ל-1): אפסו את המצביעים והמונה.
   - כתיבה מתבצעת בעליית השעון כאשר <code dir="ltr">wr_en</code> פעיל וה-FIFO אינו מלא.
   - קריאה מתבצעת בעליית השעון כאשר <code dir="ltr">rd_en</code> פעיל וה-FIFO אינו ריק (עדכנו את <code dir="ltr">data_out</code>).
   - במצב שבו שני התנאים מתקיימים במקביל (כתיבה וקריאה בו-זמנית), בצעו את שתי הפעולות יחד.`,
      taskEn: `Design a Synchronous FIFO of depth 4 and width 8 bits inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, synchronous reset <code dir="ltr">reset</code>, write enable <code dir="ltr">wr_en</code>, read enable <code dir="ltr">rd_en</code>, 8-bit input data <code dir="ltr">data_in</code>.
2. Outputs: 8-bit output data <code dir="ltr">data_out</code>, status flags <code dir="ltr">empty</code> and <code dir="ltr">full</code>.
3. Behavior:
   - On synchronous <code dir="ltr">reset == 1</code>, clear pointers and count.
   - Write: Synchronous on rising clock edge if <code dir="ltr">wr_en</code> is active and the FIFO is not full.
   - Read: Synchronous on rising clock edge if <code dir="ltr">rd_en</code> is active and the FIFO is not empty (updates <code dir="ltr">data_out</code>).
   - Simulataneous operations: Support concurrent writes and reads.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input wr_en,
    input rd_en,
    input [7:0] data_in,
    output reg [7:0] data_out,
    output empty,
    output full
);
    // הגדירו מצביעים, זיכרון ומונה פנימיים, וממשו את לוגיקת ה-FIFO כאן / Define signals and write FIFO logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input wr_en,
    input rd_en,
    input [7:0] data_in,
    output reg [7:0] data_out,
    output empty,
    output full
);
    reg [7:0] mem [3:0];
    reg [1:0] wr_ptr;
    reg [1:0] rd_ptr;
    reg [2:0] count;

    always @(posedge clk) begin
        if (reset) begin
            wr_ptr   <= 2'b0;
            rd_ptr   <= 2'b0;
            count    <= 3'b0;
            data_out <= 8'b0;
        end else begin
            case ({wr_en && !full, rd_en && !empty})
                2'b10: begin
                    mem[wr_ptr] <= data_in;
                    wr_ptr <= wr_ptr + 1'b1;
                    count  <= count + 1'b1;
                end
                2'b01: begin
                    data_out <= mem[rd_ptr];
                    rd_ptr <= rd_ptr + 1'b1;
                    count  <= count - 1'b1;
                end
                2'b11: begin
                    mem[wr_ptr] <= data_in;
                    wr_ptr <= wr_ptr + 1'b1;
                    data_out <= mem[rd_ptr];
                    rd_ptr <= rd_ptr + 1'b1;
                end
            endcase
        end
    end

    assign empty = (count == 3'd0);
    assign full  = (count == 3'd4);
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, wr_en: 0, rd_en: 0, data_in: 0, data_out: 0, empty: 1, full: 0 },
        { time: 5, clk: 1, reset: 1, wr_en: 0, rd_en: 0, data_in: 0, data_out: 0, empty: 1, full: 0 },
        { time: 10, clk: 0, reset: 0, wr_en: 1, rd_en: 0, data_in: 10, data_out: 0, empty: 1, full: 0 },
        { time: 15, clk: 1, reset: 0, wr_en: 1, rd_en: 0, data_in: 10, data_out: 0, empty: 0, full: 0 },
        { time: 20, clk: 0, reset: 0, wr_en: 1, rd_en: 0, data_in: 20, data_out: 0, empty: 0, full: 0 },
        { time: 25, clk: 1, reset: 0, wr_en: 1, rd_en: 0, data_in: 20, data_out: 0, empty: 0, full: 0 },
        { time: 30, clk: 0, reset: 0, wr_en: 0, rd_en: 1, data_in: 0, data_out: 0, empty: 0, full: 0 },
        { time: 35, clk: 1, reset: 0, wr_en: 0, rd_en: 1, data_in: 0, data_out: 10, empty: 0, full: 0 },
        { time: 40, clk: 0, reset: 0, wr_en: 0, rd_en: 1, data_in: 0, data_out: 10, empty: 0, full: 0 },
        { time: 45, clk: 1, reset: 0, wr_en: 0, rd_en: 1, data_in: 0, data_out: 20, empty: 1, full: 0 }
      ],

      hints: {
        he: "השתמשו במצביעי 2-ביט: wr_ptr ו-rd_ptr, ובמונה 3-ביט count (שיכול לקבל ערכים מ-0 עד 4). עליית clk משנה את המצביעים לפי דגל full ו-empty.",
        en: "Use 2-bit pointers: wr_ptr and rd_ptr, and a 3-bit count register (which ranges from 0 to 4). Update pointers and counter on posedge clk based on full/empty status."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 71: FIFO Pointers & Flags
    // --------------------------------------------------------------------------
    {
      id: 71,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "מצביעי FIFO ודגלי סטטוס (FIFO Pointers & Flags) 🚩",
      titleEn: "FIFO Pointers & Flags",

      explanationHe: `
<h3>1. חישוב דגלים ב-FIFO 🚩</h3>
<p>אחד האתגרים החשובים ביותר בבניית בקר FIFO הוא חישוב הדגלים <strong>ריק (Empty)</strong> ו-<strong>מלא (Full)</strong>. דגלים אלו קובעים האם ניתן להמשיך להכניס נתונים לחוצץ או לקרוא ממנו, ללא סכנת דריסת מידע.</p>

<p>קיימות שתי שיטות נפוצות לחישוב דגלים אלו:</p>
<ol>
  <li><strong>שימוש במונה איברים (Counter-based)</strong>: מחזיקים אוגר המונה כמה איברים מאוחסנים כרגע בתור.
    <ul>
      <li>כתיבה בלבד ➡️ מקדמת את המונה ב-1.</li>
      <li>קריאה בלבד ➡️ מורידה את המונה ב-1.</li>
      <li>כתיבה וקריאה בו-זמנית ➡️ המונה נשאר ללא שינוי.</li>
      <li><code dir="ltr">empty = (count == 0)</code>, <code dir="ltr">full = (count == MaxDepth)</code>.</li>
    </ul>
  </li>
  <li><strong>שימוש בביט השוואה נוסף (Pointer-based)</strong>: משתמשים במצביעים ברוחב <code dir="ltr">N+1</code> עבור זיכרון בגודל <code dir="ltr">2^N</code>. הביט הנוסף (העליון ביותר) מסמן את השלמת הסיבוב (Wrap around).
    <ul>
      <li>אם המצביעים שווים לחלוטין ➡️ התור ריק.</li>
      <li>אם המצביעים שווים בביטים התחתונים אך שונים בביט העליון ➡️ התור מלא.</li>
    </ul>
  </li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמת קוד: מעקב אחר מצביעים בלבד 📐</h3>
<p>שימו לב כיצד מצביעים זזים ומתי מתבצעת חסימה:</p>

<pre dir="ltr"><code>module pointer_tracker (
    input clk_sys,
    input rst_sys,
    input push_req,
    output reg [1:0] ptr_wr
);
    always @(posedge clk_sys) begin
        if (rst_sys) begin
            ptr_wr <= 2'b0;
        end else if (push_req) begin
            ptr_wr <= ptr_wr + 1'b1;
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. FIFO Flag Evaluation 🚩</h3>
<p>Determining whether a FIFO is **Empty** or **Full** is critical to avoid data corruption (overflow or underflow). Status flags are calculated dynamically by comparing write and read addresses.</p>

<p>Common Methods:</p>
<ol>
  <li><strong>Counter-Based Method</strong>: An internal tracker increments on a write, decrements on a read, and stays constant on simultaneous read/write cycles. When count equals maximum depth, the full flag is raised.</li>
  <li><strong>Pointer Comparison Method</strong>: Pointers are sized to <code dir="ltr">N+1</code> bits for a storage size of <code dir="ltr">2^N</code>. The extra Most Significant Bit (MSB) acts as a wrap-around tracker. If the pointers match, the FIFO is empty; if the lower bits match but the MSBs differ, the FIFO is full.</li>
</ol>
`,

      taskHe: `בנו בקר מצביעים ודגלים עבור FIFO בעומק 4 במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, איפוס סינכרוני <code dir="ltr">reset</code>, בקשת כתיבה <code dir="ltr">wr</code> ובקשת קריאה <code dir="ltr">rd</code>.
2. יציאות: מצביע כתיבה <code dir="ltr">wr_ptr</code> בגודל 2 ביט, מצביע קריאה <code dir="ltr">rd_ptr</code> בגודל 2 ביט, ומונה איברים <code dir="ltr">fifo_cnt</code> בגודל 3 ביט.
3. דרישות תפקוד:
   - בעת איפוס: הכל מתאפס ל-0.
   - כתיבה חוקית (כאשר <code dir="ltr">wr == 1</code> והתור אינו מלא) מקדמת את <code dir="ltr">wr_ptr</code> ב-1 ומגדילה את <code dir="ltr">fifo_cnt</code> ב-1.
   - קריאה חוקית (כאשר <code dir="ltr">rd == 1</code> והתור אינו ריק) מקדמת את <code dir="ltr">rd_ptr</code> ב-1 ומקטינה את <code dir="ltr">fifo_cnt</code> ב-1.
   - אם מתבצעות כתיבה וקריאה חוקיות בו-זמנית: שני המצביעים מתקדמים, אך המונה <code dir="ltr">fifo_cnt</code> נשאר ללא שינוי.`,
      taskEn: `Implement a FIFO pointer and counter controller of depth 4 inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, synchronous reset <code dir="ltr">reset</code>, write request <code dir="ltr">wr</code>, read request <code dir="ltr">rd</code>.
2. Outputs: 2-bit write pointer <code dir="ltr">wr_ptr</code>, 2-bit read pointer <code dir="ltr">rd_ptr</code>, and 3-bit FIFO count <code dir="ltr">fifo_cnt</code>.
3. Behavior:
   - On reset: all outputs must be cleared to 0.
   - Valid Write: if <code dir="ltr">wr == 1</code> and FIFO is not full (<code dir="ltr">fifo_cnt < 4</code>), advance <code dir="ltr">wr_ptr</code> and increment <code dir="ltr">fifo_cnt</code>.
   - Valid Read: if <code dir="ltr">rd == 1</code> and FIFO is not empty (<code dir="ltr">fifo_cnt > 0</code>), advance <code dir="ltr">rd_ptr</code> and decrement <code dir="ltr">fifo_cnt</code>.
   - Dual actions: if both valid write and valid read occur, advance both pointers but keep <code dir="ltr">fifo_cnt</code> unchanged.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input wr,
    input rd,
    output reg [1:0] wr_ptr,
    output reg [1:0] rd_ptr,
    output reg [2:0] fifo_cnt
);
    // כתבו את לוגיקת בקר המצביעים והמונה כאן / Write your pointer tracker and counter logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input wr,
    input rd,
    output reg [1:0] wr_ptr,
    output reg [1:0] rd_ptr,
    output reg [2:0] fifo_cnt
);
    always @(posedge clk) begin
        if (reset) begin
            wr_ptr   <= 2'b0;
            rd_ptr   <= 2'b0;
            fifo_cnt <= 3'b0;
        end else begin
            if (wr && (fifo_cnt < 3'd4) && !(rd && (fifo_cnt > 3'd0))) begin
                wr_ptr   <= wr_ptr + 1'b1;
                fifo_cnt <= fifo_cnt + 1'b1;
            end else if (rd && (fifo_cnt > 3'd0) && !(wr && (fifo_cnt < 3'd4))) begin
                rd_ptr   <= rd_ptr + 1'b1;
                fifo_cnt <= fifo_cnt - 1'b1;
            end else if (wr && (fifo_cnt < 3'd4) && rd && (fifo_cnt > 3'd0)) begin
                wr_ptr   <= wr_ptr + 1'b1;
                rd_ptr   <= rd_ptr + 1'b1;
            end
        end
    end
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, wr: 0, rd: 0, wr_ptr: 0, rd_ptr: 0, fifo_cnt: 0 },
        { time: 5, clk: 1, reset: 1, wr: 0, rd: 0, wr_ptr: 0, rd_ptr: 0, fifo_cnt: 0 },
        { time: 10, clk: 0, reset: 0, wr: 1, rd: 0, wr_ptr: 0, rd_ptr: 0, fifo_cnt: 0 },
        { time: 15, clk: 1, reset: 0, wr: 1, rd: 0, wr_ptr: 1, rd_ptr: 0, fifo_cnt: 1 },
        { time: 20, clk: 0, reset: 0, wr: 1, rd: 0, wr_ptr: 1, rd_ptr: 0, fifo_cnt: 1 },
        { time: 25, clk: 1, reset: 0, wr: 1, rd: 0, wr_ptr: 2, rd_ptr: 0, fifo_cnt: 2 },
        { time: 30, clk: 0, reset: 0, wr: 1, rd: 1, wr_ptr: 2, rd_ptr: 0, fifo_cnt: 2 },
        { time: 35, clk: 1, reset: 0, wr: 1, rd: 1, wr_ptr: 3, rd_ptr: 1, fifo_cnt: 2 }
      ],

      hints: {
        he: "מנעו קידום לא חוקי ע'י תנאים המשלבים את fifo_cnt. מנעו שינוי של fifo_cnt במצב של wr && rd כאשר שניהם חוקיים.",
        en: "Prevent illegal pointer updates by evaluating conditions using fifo_cnt. Prevent fifo_cnt from changing when wr and rd are both valid simultaneously."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 72: LIFO Stack Memory
    // --------------------------------------------------------------------------
    {
      id: 72,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "זיכרון מחסנית LIFO (LIFO Stack Memory) 📚",
      titleEn: "LIFO Stack Memory",

      explanationHe: `
<h3>1. זיכרון מחסנית (LIFO Stack) 📚</h3>
<p>זיכרון מחסנית פועל לפי עיקרון <strong>LIFO</strong> (ראשי תיבות: <strong>Last-In, First-Out</strong> - האחרון שנכנס הוא הראשון שיוצא). זהו מבנה נתונים דמוי ערמת צלחות: ניתן להניח צלחת חדשה בראש הערמה (<code dir="ltr">push</code>), או להסיר את הצלחת העליונה ביותר (<code dir="ltr">pop</code>).</p>

<p>במעבדים, מחסניות הן קריטיות לניהול קריאות לפונקציות (Function Calls) ושמירת כתובות חזרה (Return Addresses), וכן לשמירת משתנים זמניים ורישום מצב הרגיסטרים בזמן פסיקות (Interrupts).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. מצביע המחסנית (Stack Pointer - SP) 📍</h3>
<p>רכיב המחסנית בחומרה מנוהל באמצעות רגיסטרט מיוחד הנקרא <strong>Stack Pointer (SP)</strong>:</p>
<ul>
  <li>כאשר המחסנית ריקה, <code dir="ltr">SP = 0</code>.</li>
  <li>בפעולת דחיפה (<code dir="ltr">push</code>): שומרים את הנתון בכתובת <code dir="ltr">SP</code>, ומקדמים את <code dir="ltr">SP <= SP + 1</code>.</li>
  <li>בפעולת שליפה (<code dir="ltr">pop</code>): מורידים את <code dir="ltr">SP <= SP - 1</code>, וקוראים את הנתון מהתא בכתובת החדשה.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>3. דוגמת קוד: מחסנית פשוטה עומק 2 📐</h3>

<pre dir="ltr"><code>module tiny_stack_x2 (
    input clk,
    input rst,
    input push,
    input pop,
    input [7:0] din,
    output reg [7:0] dout
);
    reg [7:0] stack_mem [1:0];
    reg [1:0] stack_ptr; // 0, 1, 2

    always @(posedge clk) begin
        if (rst) begin
            stack_ptr <= 0;
            dout      <= 0;
        end else begin
            if (push && (stack_ptr < 2)) begin
                stack_mem[stack_ptr] <= din;
                stack_ptr <= stack_ptr + 1;
            end else if (pop && (stack_ptr > 0)) begin
                stack_ptr <= stack_ptr - 1;
                dout      <= stack_mem[stack_ptr - 1];
            end
        end
    end
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. LIFO Stack Memory 📚</h3>
<p>A Stack memory structure implements <strong>LIFO (Last-In, First-Out)</strong> retrieval. Similar to a physical stack of plates, new items are placed on top (via a <code dir="ltr">push</code> operation), and elements can only be removed from the top (via a <code dir="ltr">pop</code> operation).</p>

<p>In CPU architectures, stacks are fundamental for managing function calls, return addresses, local variables, and register contexts during interrupt handling.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. The Stack Pointer (SP) 📍</h3>
<p>The core controller of a stack is the **Stack Pointer (SP)** register:</p>
<ul>
  <li>When empty, <code dir="ltr">SP = 0</code>.</li>
  <li>On <code dir="ltr">push</code>: The input data is written into <code dir="ltr">mem[SP]</code>, and then <code dir="ltr">SP</code> increments by 1.</li>
  <li>On <code dir="ltr">pop</code>: The pointer decrements first <code dir="ltr">SP <= SP - 1</code>, and the top element is read from <code dir="ltr">mem[SP-1]</code>.</li>
</ul>
`,

      taskHe: `בנו זיכרון מחסנית LIFO בעומק 4 וברוחב של 8 ביט למילה במודול <code dir="ltr">top_module</code>:
1. כניסות: שעון <code dir="ltr">clk</code>, אות איפוס סינכרוני <code dir="ltr">reset</code>, מאפשר דחיפה <code dir="ltr">push</code>, מאפשר שליפה <code dir="ltr">pop</code>, כניסת נתונים <code dir="ltr">data_in</code> בגודל 8 ביט.
2. יציאות: מוצא נתונים <code dir="ltr">data_out</code> בגודל 8 ביט, דגלים <code dir="ltr">empty</code> ו-<code dir="ltr">full</code>, ומצביע המחסנית <code dir="ltr">sp</code> בגודל 3 ביט.
3. דרישות הלוגיקה:
   - באיפוס: אפסו את ה-SP ואת ה-data_out.
   - דחיפה חוקית (כשמחסנית לא מלאה ו-<code dir="ltr">push == 1</code>): הנתון <code dir="ltr">data_in</code> נשמר בכתובת <code dir="ltr">mem[sp]</code> וה-sp מקודם ב-1.
   - שליפה חוקית (כשמחסנית לא ריקה ו-<code dir="ltr">pop == 1</code>): ה-sp יורד ב-1, והנתון נקרא מכתובת <code dir="ltr">mem[sp-1]</code> לתוך <code dir="ltr">data_out</code>.
   - התעלמו מדחיפות/שליפות לא חוקיות.`,
      taskEn: `Design a LIFO Stack memory (depth 4 x width 8-bit) inside <code dir="ltr">top_module</code>:
1. Inputs: clock <code dir="ltr">clk</code>, synchronous reset <code dir="ltr">reset</code>, push enable <code dir="ltr">push</code>, pop enable <code dir="ltr">pop</code>, 8-bit input data <code dir="ltr">data_in</code>.
2. Outputs: 8-bit output data <code dir="ltr">data_out</code>, status flags <code dir="ltr">empty</code> and <code dir="ltr">full</code>, and 3-bit stack pointer <code dir="ltr">sp</code>.
3. Behavior:
   - On reset: clear both <code dir="ltr">sp</code> and <code dir="ltr">data_out</code> to 0.
   - Valid Push: if <code dir="ltr">push == 1</code> and stack is not full (<code dir="ltr">sp < 4</code>), store <code dir="ltr">data_in</code> at <code dir="ltr">mem[sp]</code> and increment <code dir="ltr">sp</code> by 1.
   - Valid Pop: if <code dir="ltr">pop == 1</code> and stack is not empty (<code dir="ltr">sp > 0</code>), decrement <code dir="ltr">sp</code> by 1 and read <code dir="ltr">data_out</code> from <code dir="ltr">mem[sp-1]</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input push,
    input pop,
    input [7:0] data_in,
    output reg [7:0] data_out,
    output empty,
    output full,
    output reg [2:0] sp
);
    // הגדירו את מערך הזיכרון וממשו את לוגיקת המחסנית כאן / Define memory and implement stack logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input push,
    input pop,
    input [7:0] data_in,
    output reg [7:0] data_out,
    output empty,
    output full,
    output reg [2:0] sp
);
    reg [7:0] mem [3:0];

    always @(posedge clk) begin
        if (reset) begin
            sp       <= 3'b0;
            data_out <= 8'b0;
        end else begin
            if (push && (sp < 3'd4)) begin
                mem[sp] <= data_in;
                sp      <= sp + 1'b1;
            end else if (pop && (sp > 3'd0)) begin
                sp       <= sp - 1'b1;
                data_out <= mem[sp - 1'b1];
            end
        end
    end

    assign empty = (sp == 3'd0);
    assign full  = (sp == 3'd4);
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, push: 0, pop: 0, data_in: 0, data_out: 0, sp: 0, empty: 1, full: 0 },
        { time: 5, clk: 1, reset: 1, push: 0, pop: 0, data_in: 0, data_out: 0, sp: 0, empty: 1, full: 0 },
        { time: 10, clk: 0, reset: 0, push: 1, pop: 0, data_in: 50, data_out: 0, sp: 0, empty: 1, full: 0 },
        { time: 15, clk: 1, reset: 0, push: 1, pop: 0, data_in: 50, data_out: 0, sp: 1, empty: 0, full: 0 },
        { time: 20, clk: 0, reset: 0, push: 1, pop: 0, data_in: 60, data_out: 0, sp: 1, empty: 0, full: 0 },
        { time: 25, clk: 1, reset: 0, push: 1, pop: 0, data_in: 60, data_out: 0, sp: 2, empty: 0, full: 0 },
        { time: 30, clk: 0, reset: 0, push: 0, pop: 1, data_in: 0, data_out: 0, sp: 2, empty: 0, full: 0 },
        { time: 35, clk: 1, reset: 0, push: 0, pop: 1, data_in: 0, data_out: 60, sp: 1, empty: 0, full: 0 },
        { time: 40, clk: 0, reset: 0, push: 0, pop: 1, data_in: 0, data_out: 60, sp: 1, empty: 0, full: 0 },
        { time: 45, clk: 1, reset: 0, push: 0, pop: 1, data_in: 0, data_out: 50, sp: 0, empty: 1, full: 0 }
      ],

      hints: {
        he: "הגדירו reg [7:0] mem [3:0]. שימו לב שבעת pop ה-sp יורד קודם לכן (למשל sp <= sp - 1) והנתון נקרא מהתא mem[sp-1] (או mem[sp] החדש).",
        en: "Define reg [7:0] mem [3:0]. Note that on pop, sp decrements first (sp <= sp - 1) and the data is read from the cell mem[sp-1] (which corresponds to the new decremented sp value)."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 73: Memory Mapped Register Bank
    // --------------------------------------------------------------------------
    {
      id: 73,
      chapter: 9,
      chapterTitleHe: "פרק 9: זיכרונות ומבני אחסון נתונים",
      chapterTitleEn: "Chapter 9: Memories & Storage Structures",
      titleHe: "בנק אוגרים ממופה זיכרון (Memory Mapped Register Bank) 🗺️",
      titleEn: "Memory Mapped Register Bank",

      explanationHe: `
<h3>1. זיכרון ממופה (Memory-Mapped I/O) 🗺️</h3>
<p>במערכות על שבב (System on Chip - SoC), מעבד המערכת מתקשר עם רכיבי חומרה היקפיים (כמו בקרי GPIO, UART או טיימרים) על ידי קריאה וכתיבה לכתובות זיכרון מיוחדות. תפיסה זו נקראת <strong>Memory-Mapped I/O</strong>.</p>

<p>בתוך הרכיב ההיקפי, הכתובות הללו ממופות למערך של אוגרי בקרה, סטטוס ונתונים פנימיים (Register Bank):</p>
<ul>
  <li><strong>אוגר בקרה (Control Register)</strong>: אוגר קריאה/כתיבה (R/W) שבו המעבד כותב הגדרות כדי להגדיר את מוד הפעולה.</li>
  <li><strong>אוגר סטטוס (Status Register)</strong>: אוגר לקריאה בלבד (Read-only) המציג את מצב הרכיב כרגע (למשל, האם הנתונים מוכנים). ניסיון כתיבה אליו מצד המעבד ייחסם.</li>
  <li><strong>אוגר נתונים (Data Register)</strong>: אוגר R/W להעברת המידע עצמו.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. דוגמת קוד: בנק אוגרים קומפקטי (2 כתובות) 📐</h3>

<pre dir="ltr"><code>module simple_mmio (
    input clk,
    input reset,
    input addr_i,
    input write_en_i,
    input [7:0] wdata_i,
    output [7:0] rdata_o
);
    reg [7:0] reg_ctrl;

    // כתיבה סינכרונית
    always @(posedge clk) begin
        if (reset) begin
            reg_ctrl <= 8'h00;
        end else if (write_en_i && addr_i == 1'b0) begin
            reg_ctrl <= wdata_i; // כתיבה לאוגר הבקרה בכתובת 0
        end
    end

    // קריאה אסינכרונית קומבינטורית
    assign rdata_o = (addr_i == 1'b0) ? reg_ctrl : 8'hE3; // כתובת 1 מחזירה סטטוס קבוע
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Memory-Mapped I/O (MMIO) 🗺️</h3>
<p>In digital systems and SoCs, the CPU manages peripheral hardware (like timers or serial ports) by issuing write and read cycles to specific memory locations. This framework is called <strong>Memory-Mapped I/O (MMIO)</strong>.</p>

<p>A typical peripheral decodes memory bus signals and maps incoming addresses to a local <strong>Register Bank</strong> consisting of:</p>
<ul>
  <li><strong>Control Register (Read/Write)</strong>: Modulates peripheral behavior.</li>
  <li><strong>Status Register (Read-Only)</strong>: Reflects the hardware state. Writes to this address are ignored.</li>
  <li><strong>Data Registers (Read/Write)</strong>: Store transient payload values.</li>
</ul>
`,

      taskHe: `בנו בנק אוגרים ממופה זיכרון במודול <code dir="ltr">top_module</code> עם 4 כתובות של 8 ביט:
1. כניסות: שעון <code dir="ltr">clk</code>, איפוס סינכרוני <code dir="ltr">reset</code>, כתובת <code dir="ltr">addr</code> (בגודל 2 ביט), מאפשר כתיבה <code dir="ltr">we</code>, וכניסת נתונים <code dir="ltr">data_in</code> בגודל 8 ביט.
2. יציאות: יציאת נתונים <code dir="ltr">data_out</code> בגודל 8 ביט, והקצאות חיצוניות ישירות לאוגרים: <code dir="ltr">reg_ctrl</code> בגודל 8 ביט, ו-<code dir="ltr">reg_data0</code> בגודל 8 ביט.
3. מיפוי כתובות (Register Map):
   - כתובת <code dir="ltr">2'b00</code>: אוגר בקרה <code dir="ltr">REG_CTRL</code> (קריאה/כתיבה). מאותחל ל-0. מחובר ליציאה <code dir="ltr">reg_ctrl</code>.
   - כתובת <code dir="ltr">2'b01</code>: אוגר סטטוס <code dir="ltr">REG_STATUS</code> (לקריאה בלבד). מחזיר תמיד ערך קבוע <code dir="ltr">8'hA5</code>. כתיבות אליו יתעלמו.
   - כתובת <code dir="ltr">2'b10</code>: אוגר נתונים <code dir="ltr">REG_DATA0</code> (קריאה/כתיבה). מאותחל ל-0. מחובר ליציאה <code dir="ltr">reg_data0</code>.
   - כתובת <code dir="ltr">2'b11</code>: אוגר נתונים <code dir="ltr">REG_DATA1</code> (קריאה/כתיבה). מאותחל ל-0.
4. קריאה: <code dir="ltr">data_out</code> מציג באופן אסינכרוני את תוכן התא שנבחר ב-<code dir="ltr">addr</code>.
5. כתיבה: בעליית שעון, אם <code dir="ltr">we == 1</code>, עדכנו את האוגר המתאים (מלבד אוגר הסטטוס לקריאה בלבד). ב-reset הכל מתאפס ל-0.`,
      taskEn: `Design a Memory Mapped Register Bank inside <code dir="ltr">top_module</code> with 4 registers of 8-bit width:
1. Inputs: clock <code dir="ltr">clk</code>, synchronous reset <code dir="ltr">reset</code>, 2-bit address <code dir="ltr">addr</code>, write enable <code dir="ltr">we</code>, 8-bit input data <code dir="ltr">data_in</code>.
2. Outputs: 8-bit read data output <code dir="ltr">data_out</code>, and two direct register outputs <code dir="ltr">reg_ctrl</code> (8-bit) and <code dir="ltr">reg_data0</code> (8-bit).
3. Register Map:
   - Address <code dir="ltr">2'b00</code> (REG_CTRL): Read/Write. Resets to 0. Connected to output <code dir="ltr">reg_ctrl</code>.
   - Address <code dir="ltr">2'b01</code> (REG_STATUS): Read-Only. Returns constant <code dir="ltr">8'hA5</code>. Write operations are ignored.
   - Address <code dir="ltr">2'b10</code> (REG_DATA0): Read/Write. Resets to 0. Connected to output <code dir="ltr">reg_data0</code>.
   - Address <code dir="ltr">2'b11</code> (REG_DATA1): Read/Write. Resets to 0.
4. Read: <code dir="ltr">data_out</code> asynchronously displays contents matching the current <code dir="ltr">addr</code>.
5. Write: On <code dir="ltr">posedge clk</code>, if <code dir="ltr">we == 1</code>, write <code dir="ltr">data_in</code> to the register indexed by <code dir="ltr">addr</code> (excluding REG_STATUS). Clear all R/W registers on <code dir="ltr">reset</code>.`,

      starterCode: `module top_module (
    input clk,
    input reset,
    input [1:0] addr,
    input we,
    input [7:0] data_in,
    output [7:0] data_out,
    output [7:0] reg_ctrl,
    output [7:0] reg_data0
);
    // הגדירו את האוגרים הפנימיים וממשו את בנק האוגרים ממופה הזיכרון כאן / Define registers and implement logic here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input reset,
    input [1:0] addr,
    input we,
    input [7:0] data_in,
    output [7:0] data_out,
    output [7:0] reg_ctrl,
    output [7:0] reg_data0
);
    reg [7:0] r_ctrl;
    reg [7:0] r_data0;
    reg [7:0] r_data1;

    always @(posedge clk) begin
        if (reset) begin
            r_ctrl  <= 8'd0;
            r_data0 <= 8'd0;
            r_data1 <= 8'd0;
        end else if (we) begin
            case (addr)
                2'b00: r_ctrl  <= data_in;
                2'b10: r_data0 <= data_in;
                2'b11: r_data1 <= data_in;
                default: ; // Write ignored for read-only REG_STATUS
            endcase
        end
    end

    assign data_out = (addr == 2'b00) ? r_ctrl :
                      (addr == 2'b01) ? 8'hA5 :
                      (addr == 2'b10) ? r_data0 :
                      r_data1;

    assign reg_ctrl  = r_ctrl;
    assign reg_data0 = r_data0;
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, reset: 1, addr: 0, we: 0, data_in: 0, data_out: 0, reg_ctrl: 0, reg_data0: 0 },
        { time: 5, clk: 1, reset: 1, addr: 0, we: 0, data_in: 0, data_out: 0, reg_ctrl: 0, reg_data0: 0 },
        { time: 10, clk: 0, reset: 0, addr: 0, we: 1, data_in: 85, data_out: 0, reg_ctrl: 0, reg_data0: 0 }, // 8'h55 is 85
        { time: 15, clk: 1, reset: 0, addr: 0, we: 1, data_in: 85, data_out: 85, reg_ctrl: 85, reg_data0: 0 },
        { time: 20, clk: 0, reset: 0, addr: 1, we: 1, data_in: 255, data_out: 165, reg_ctrl: 85, reg_data0: 0 }, // 8'hA5 is 165
        { time: 25, clk: 1, reset: 0, addr: 1, we: 1, data_in: 255, data_out: 165, reg_ctrl: 85, reg_data0: 0 },
        { time: 30, clk: 0, reset: 0, addr: 2, we: 1, data_in: 153, data_out: 0, reg_ctrl: 85, reg_data0: 0 }, // 8'h99 is 153
        { time: 35, clk: 1, reset: 0, addr: 2, we: 1, data_in: 153, data_out: 153, reg_ctrl: 85, reg_data0: 153 }
      ],

      hints: {
        he: "הגדירו שלושה רגיסטרים פנימיים. בתוך always @(posedge clk) דאגו לא לעדכן את המצב כאשר addr == 2'b01. בצעו assign מותנה ל-data_out.",
        en: "Define three internal registers. Inside always @(posedge clk) ensure that no update occurs if addr == 2'b01. Use conditional assignment to drive data_out."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
