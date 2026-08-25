/* ==========================================================================
   VeriLearn Curriculum — Chapter 4: Hierarchy, Modules & Parameters (Lessons 25 to 31)
   ========================================================================== */

(function() {
  const chapterLessons = [
    // --------------------------------------------------------------------------
    // Lesson 25: Module Instantiation (Positional)
    // --------------------------------------------------------------------------
    {
      id: 25,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "אינסטנסיאציה לפי מיקום (Positional Port Mapping) 🏗️",
      titleEn: "Module Instantiation (Positional Port Mapping)",

      explanationHe: `
<h3>1. היררכיה בתכנון שבבים 🏗️</h3>
<p>בתעשיית המיקרו-אלקטרוניקה, מעבדים ומעגלים משולבים מורכבים מכילים מיליארדי טרנזיסטורים. לא ניתן לכתוב את כל הלוגיקה בקובץ יחיד או במודול שטוח אחד. בדיוק כמו בתכנות תוכנה (שבה אנו מחלקים קוד לפונקציות ומחלקות), בתכנון חומרה אנו בונים מודולים קטנים המבצעים פעולות פשוטות (כמו שערים, מפענחים או יחידות אריתמטיות), ואז משלבים אותם בתוך מודול ראשי (Top Module).</p>
<p>תהליך זה של שילוב מודול פנימי בתוך מודול אב נקרא <strong>Module Instantiation</strong> (אינסטנסיאציה של מודול).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור לפי מיקום (Positional Mapping) 📐</h3>
<p>הדרך הבסיסית ביותר לחבר מודול פנימי היא לפי <strong>סדר הפורטים</strong> שלו. בסגנון זה, אנו מעבירים את האותות מהמודול הראשי אל תת-המודול בתוך סוגריים, בדיוק לפי הסדר שבו הם הוגדרו במקור.</p>
<p>התחביר הכללי הוא:</p>
<pre dir="ltr"><code>sub_module_name instance_name (signal_a, signal_b, signal_c);</code></pre>

<p>נניח שקבוע במערכת תת-מודול של שער לוגי פשוט:</p>
<pre dir="ltr"><code>module custom_and (
    input  x,
    input  y,
    output z
);
    assign z = x & y;
endmodule</code></pre>

<p>כדי להשתמש במודול זה בתוך מודול אב ולחבר אליו אותות בשמות אחרים, נכתוב:</p>
<pre dir="ltr"><code>module parent_design (
    input  clk_in,
    input  data_in,
    output flag_out
);
    // חיבור לפי מיקום: x מתחבר ל-clk_in, y ל-data_in, ו-z ל-flag_out
    custom_and u_and (clk_in, data_in, flag_out);
endmodule</code></pre>

<p><strong>שימו לב:</strong> בשיטה זו, סדר האותות בסוגריים קריטי לחלוטין! אם נחליף את המיקום של האותות, החיבור הפיזי בשבב ישתנה ועלול לגרום לשגיאות לוגיות קשות או לקצר.</p>
`,

      explanationEn: `
<h3>1. Hardware Hierarchy in Chip Design 🏗️</h3>
<p>In the semiconductor industry, complex integrated circuits and processors contain billions of transistors. It is impossible to write all the logic in a single flat file. Just like in software engineering where we divide code into functions and classes, in hardware design we build smaller modules that perform simple operations (like gates, decoders, or arithmetic units) and combine them inside a parent module (Top Module).</p>
<p>This process of embedding a sub-module inside a parent design is called <strong>Module Instantiation</strong>.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Positional Port Mapping 📐</h3>
<p>The simplest way to connect a sub-module is based on the <strong>positional order of its ports</strong>. In this style, we pass signals from the parent module inside parentheses, matching the exact order in which the ports were declared in the sub-module definition.</p>
<p>The general syntax is:</p>
<pre dir="ltr"><code>sub_module_name instance_name (signal_a, signal_b, signal_c);</code></pre>

<p>Suppose the following sub-module is already defined in the system:</p>
<pre dir="ltr"><code>module custom_and (
    input  x,
    input  y,
    output z
);
    assign z = x & y;
endmodule</code></pre>

<p>To instantiate this module inside a parent module and connect signals with different names, we write:</p>
<pre dir="ltr"><code>module parent_design (
    input  clk_in,
    input  data_in,
    output flag_out
);
    // Positional connection: x connects to clk_in, y to data_in, and z to flag_out
    custom_and u_and (clk_in, data_in, flag_out);
endmodule</code></pre>

<p><strong>Important:</strong> In positional port mapping, the order of signals in the parentheses is absolutely critical! If you swap the signal positions, the physical connection on the chip will change, leading to major logical bugs or short circuits.</p>
`,

      taskHe: `קיים במערכת מודול מוכן בשם <code dir="ltr">mod_a</code> המוגדר כך:
<code dir="ltr">module mod_a (input in1, input in2, output out_xor);</code>
<br><br>
בנו את המודול הראשי <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">in1</code>, <code dir="ltr">in2</code> ויציאה <code dir="ltr">out_val</code>). צרו מופע של המודול <code dir="ltr">mod_a</code> בשם <code dir="ltr">u_mod</code> וחברו את כניסותיו ויציאותיו באמצעות חיבור לפי מיקום (Positional Mapping).`,

      taskEn: `A pre-defined module <code dir="ltr">mod_a</code> is available with the following signature:
<code dir="ltr">module mod_a (input in1, input in2, output out_xor);</code>
<br><br>
Build the top module <code dir="ltr">top_module</code> (which has inputs <code dir="ltr">in1</code>, <code dir="ltr">in2</code> and output <code dir="ltr">out_val</code>). Instantiate <code dir="ltr">mod_a</code> with the instance name <code dir="ltr">u_mod</code> and connect its ports to the top module signals using positional mapping.`,

      starterCode: `module top_module (
    input in1,
    input in2,
    output out_val
);
    // צור מופע של mod_a בשם u_mod כאן בחיבור לפי מיקום / Instantiate mod_a as u_mod here using positional mapping

endmodule`,

      solutionCode: `module top_module (
    input in1,
    input in2,
    output out_val
);
    mod_a u_mod (in1, in2, out_val);
endmodule`,

      expectedOutputs: [
        { time: 0, in1: 0, in2: 0, out_val: 0 },
        { time: 5, in1: 1, in2: 0, out_val: 1 },
        { time: 10, in1: 0, in2: 1, out_val: 1 },
        { time: 15, in1: 1, in2: 1, out_val: 0 }
      ],

      hints: {
        he: "השתמשו בתחביר: mod_a u_mod (in1, in2, out_val);",
        en: "Use the syntax: mod_a u_mod (in1, in2, out_val);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 26: Named Port Connection (.port)
    // --------------------------------------------------------------------------
    {
      id: 26,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "חיבור פורטים לפי שם (Named Port Connection) 📌",
      titleEn: "Named Port Connection (.port)",

      explanationHe: `
<h3>1. מדוע חיבור לפי מיקום מסוכן בתעשייה? ⚠️</h3>
<p>בשיעור הקודם חברנו פורטים לפי מיקומם. למרות שזו שיטה פשוטה ומהירה, היא נחשבת <strong>ללא בטוחה ומאוד לא מומלצת</strong> בתכנון שבבים תעשייתי. מדוע?</p>
<ul>
  <li>אם מפתח אחר ישנה את סדר הפורטים בהגדרת המודול הפנימי, כל החיבורים במודול הראשי יתבלבלו ללא התרעת שגיאה!</li>
  <li>במודולים גדולים (הכוללים מאות כניסות ויציאות), קל מאוד לטעות במיקום של חוט בודד ולחבר אותו למקום הלא נכון.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור מפורש לפי שם (Named Port Mapping) 📌</h3>
<p>כדי למנוע שגיאות אלו, נשתמש בחיבור פורטים לפי שמם הפיזי. בשיטה זו, אנו מציינים במפורש את שם הפורט של תת-המודול (עם נקודה לפניו), ובתוך סוגריים את שם האות במודול האב.</p>
<p>התחביר הוא:</p>
<pre dir="ltr"><code>sub_module_name instance_name (
    .sub_port_a(parent_signal_1),
    .sub_port_b(parent_signal_2)
);</code></pre>

<p>נניח שיש לנו תת-מודול של מקלט תקשורת:</p>
<pre dir="ltr"><code>module uart_rx (
    input  sys_clk,
    output rx_data
);
    // ...
endmodule</code></pre>

<p>במודול הראשי נחבר אותו כך:</p>
<pre dir="ltr"><code>module board_top (
    input  board_clk,
    output [7:0] led_bus
);
    // חיבור לפי שם - סדר השורות לא משנה!
    uart_rx u_receiver (
        .rx_data(led_bus[0]),
        .sys_clk(board_clk)
    );
endmodule</code></pre>
<p>כפי שניתן לראות בדוגמה, חיברנו את <code>sys_clk</code> אחרי <code>rx_data</code>, וזה תקין לחלוטין. כלי הסינתזה ידע לקשר אותם נכון לפי שמם המפורש ולא לפי מיקומם.</p>
`,

      explanationEn: `
<h3>1. Why Positional Connection is Dangerous in the Industry? ⚠️</h3>
<p>In the previous lesson, we connected ports by their position. Although simple and fast, positional mapping is considered <strong>unsafe and highly discouraged</strong> in professional chip design. Why?</p>
<ul>
  <li>If another designer changes the order of ports in the sub-module definition, all connections in the parent module will be scrambled without compile-time errors!</li>
  <li>In large modules with hundreds of inputs and outputs, it is extremely easy to misplace a single wire and connect it to the wrong port.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Named Port Mapping 📌</h3>
<p>To prevent these errors, we specify the port names explicitly. In this style, we prefix the sub-module's port name with a dot (<code>.</code>), followed by the parent signal name in parentheses.</p>
<p>The syntax is:</p>
<pre dir="ltr"><code>sub_module_name instance_name (
    .sub_port_a(parent_signal_1),
    .sub_port_b(parent_signal_2)
);</code></pre>

<p>Suppose we have a communication receiver sub-module:</p>
<pre dir="ltr"><code>module uart_rx (
    input  sys_clk,
    output rx_data
);
    // ...
endmodule</code></pre>

<p>In our top module, we instantiate it as follows:</p>
<pre dir="ltr"><code>module board_top (
    input  board_clk,
    output [7:0] led_bus
);
    // Named port mapping - the line order does not matter!
    uart_rx u_receiver (
        .rx_data(led_bus[0]),
        .sys_clk(board_clk)
    );
endmodule</code></pre>
<p>As shown in the example, we connected <code>sys_clk</code> after <code>rx_data</code>, which is perfectly valid. The synthesis tool links them accurately based on their names, not their ordering.</p>
`,

      taskHe: `קיים במערכת מודול בשם <code dir="ltr">mod_a</code> המוגדר כך:
<code dir="ltr">module mod_a (input in1, input in2, output out_and);</code>
<br><br>
במודול הראשי <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">a</code>, <code dir="ltr">b</code> ויציאה <code dir="ltr">out_val</code>), צרו מופע בשם <code dir="ltr">u_mod</code> וחברו את הפורטים **לפי שם** כך ש-<code dir="ltr">in1</code> יתחבר ל-<code dir="ltr">a</code>, <code dir="ltr">in2</code> יתחבר ל-<code dir="ltr">b</code>, ו-<code dir="ltr">out_and</code> יתחבר ל-<code dir="ltr">out_val</code>.`,

      taskEn: `A pre-defined sub-module <code dir="ltr">mod_a</code> exists with the signature:
<code dir="ltr">module mod_a (input in1, input in2, output out_and);</code>
<br><br>
Inside <code dir="ltr">top_module</code> (with inputs <code dir="ltr">a</code>, <code dir="ltr">b</code> and output <code dir="ltr">out_val</code>), instantiate <code dir="ltr">mod_a</code> as <code dir="ltr">u_mod</code> using explicit named port connections: <code dir="ltr">.in1(a)</code>, <code dir="ltr">.in2(b)</code>, and <code dir="ltr">.out_and(out_val)</code>.`,

      starterCode: `module top_module (
    input a,
    input b,
    output out_val
);
    // צור מופע של mod_a בשם u_mod כאן בחיבור לפי שם / Instantiate mod_a as u_mod here using named port mapping

endmodule`,

      solutionCode: `module top_module (
    input a,
    input b,
    output out_val
);
    mod_a u_mod (
        .in1(a),
        .in2(b),
        .out_and(out_val)
    );
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, out_val: 0 },
        { time: 5, a: 1, b: 0, out_val: 0 },
        { time: 10, a: 0, b: 1, out_val: 0 },
        { time: 15, a: 1, b: 1, out_val: 1 }
      ],

      hints: {
        he: "השתמשו בתחביר הבא: .in1(a), .in2(b), .out_and(out_val)",
        en: "Use the named syntax: .in1(a), .in2(b), .out_and(out_val)"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 27: Multiple Sub-module Instances
    // --------------------------------------------------------------------------
    {
      id: 27,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מופעים מרובים וחיבור ביניהם (Multiple Instances) 🏢",
      titleEn: "Multiple Sub-module Instances",

      explanationHe: `
<h3>1. יצירת מספר מופעים של אותו מודול 🏢</h3>
<p>אחת התכונות החשובות ביותר בהיררכיית חומרה היא היכולת לשכפל מודול אחד מספר פעמים. כמו שבתוכנה ניתן לקרוא לאותה פונקציה מספר פעמים עם פרמטרים שונים, בחומרה ניתן ליצור מופעים פיזיים מרובים של אותו המודול.</p>
<p>לדוגמה, כדי לבנות אוגר של 4-ביט, ניתן ליצור 4 מופעים נפרדים של דלגלג (Flip-Flop) יחיד. לכל מופע חובה להעניק <strong>שם מופע ייחודי</strong> (כמו <code>u_inv1</code> ו-<code>u_inv2</code>).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. חיבור מודולים בעזרת קווי קשר פנימיים (wires) 🔗</h3>
<p>כאשר פלט של מודול אחד צריך להתחבר כקלט למודול שני, עלינו להגדיר חוט פנימי מוגדר כ-<code>wire</code> במודול האב. החוט הזה משמש כ"הלחמה" או נקודת חיבור המקשרת בין המופעים.</p>

<p>דוגמה סכמטית של שרשור שני חוצצים (Buffers):</p>
<div style="text-align: center; margin: 1rem 0; font-family: monospace; background: var(--card-bg); padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
  [in_pin] ---> ( u_buf1 ) ---> [temp_wire] ---> ( u_buf2 ) ---> [out_pin]
</div>

<p>נממש דוגמה זו בקוד:</p>
<pre dir="ltr"><code>// מודול ראשי שמשרשר שני מופעים
module buffer_chain (
    input  in_pin,
    output out_pin
);
    wire temp_wire; // חוט המקשר בין יציאת הראשון לכניסת השני

    // מופע ראשון
    buffer_unit u_buf1 (
        .in_sig(in_pin),
        .out_sig(temp_wire)
    );

    // מופע שני
    buffer_unit u_buf2 (
        .in_sig(temp_wire),
        .out_sig(out_pin)
    );
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. Reusing Sub-modules with Multiple Instances 🏢</h3>
<p>One of the most powerful features of hardware hierarchy is the ability to duplicate a sub-module. Just like in software programming where you call a function multiple times, in hardware design you can instantiate multiple physical copies of a module on the silicon.</p>
<p>For example, to build a 4-bit register, you can instantiate 4 separate D Flip-Flops. Every instance must be given a <strong>unique instance name</strong> (such as <code>u_inv1</code> and <code>u_inv2</code>).</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Linking Sub-modules via Internal Wires 🔗</h3>
<p>When the output of one module needs to connect to the input of another, we declare an intermediate connection using the <code>wire</code> keyword in the top module. This wire acts as a physical solder joint that routes the signal between the two blocks.</p>

<p>Schematic diagram of chaining two buffers:</p>
<div style="text-align: center; margin: 1rem 0; font-family: monospace; background: var(--card-bg); padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
  [in_pin] ---> ( u_buf1 ) ---> [temp_wire] ---> ( u_buf2 ) ---> [out_pin]
</div>

<p>Let's represent this in code:</p>
<pre dir="ltr"><code>// Top module chaining two instances
module buffer_chain (
    input  in_pin,
    output out_pin
);
    wire temp_wire; // Connecting wire between the first buffer and second buffer

    // First instance
    buffer_unit u_buf1 (
        .in_sig(in_pin),
        .out_sig(temp_wire)
    );

    // Second instance
    buffer_unit u_buf2 (
        .in_sig(temp_wire),
        .out_sig(out_pin)
    );
endmodule</code></pre>
`,

      taskHe: `במערכת מוגדר מראש מודול מהפך בשם <code dir="ltr">inverter_block</code>:
<code dir="ltr">module inverter_block (input in_sig, output out_sig);</code>
<br><br>
בתוך המודול הראשי <code dir="ltr">top_module</code> (בעל כניסה <code dir="ltr">in_val</code> ויציאה <code dir="ltr">out_val</code>), הגדירו חוט קשר פנימי בשם <code dir="ltr">temp_wire</code>, וצרו שני מופעים של המהפך:
<ul>
  <li>המופע הראשון בשם <code dir="ltr">u_inv1</code> יקבל את הכניסה <code dir="ltr">in_val</code> ויפיק את האות הפנימי <code dir="ltr">temp_wire</code>.</li>
  <li>המופע השני בשם <code dir="ltr">u_inv2</code> יקבל את האות הפנימי <code dir="ltr">temp_wire</code> ויפיק את היציאה הראשית <code dir="ltr">out_val</code>.</li>
</ul>
חברו את המודולים **לפי שם**. פעולה זו משרשרת שני מהפכים זה אחר זה (המהפך הכפול ישמור על הערך המקורי).`,

      taskEn: `A pre-defined inverter module <code dir="ltr">inverter_block</code> exists in the system:
<code dir="ltr">module inverter_block (input in_sig, output out_sig);</code>
<br><br>
Inside your <code dir="ltr">top_module</code> (with input <code dir="ltr">in_val</code> and output <code dir="ltr">out_val</code>), declare an intermediate connection named <code dir="ltr">temp_wire</code>, and instantiate two copies of <code dir="ltr">inverter_block</code>:
<ul>
  <li>The first instance named <code dir="ltr">u_inv1</code> takes <code dir="ltr">in_val</code> and outputs to <code dir="ltr">temp_wire</code>.</li>
  <li>The second instance named <code dir="ltr">u_inv2</code> takes <code dir="ltr">temp_wire</code> and outputs to <code dir="ltr">out_val</code>.</li>
</ul>
Connect the modules **by name**. This setup chains two inverters in series (double negation yields the original input).`,

      starterCode: `module top_module (
    input in_val,
    output out_val
);
    // הגדר חוט מקשר פנימי כאן / Declare the intermediate wire here
    
    // צור מופע של המהפך הראשון u_inv1 / Instantiate first inverter u_inv1
    
    // צור מופע של המהפך השני u_inv2 / Instantiate second inverter u_inv2

endmodule`,

      solutionCode: `module top_module (
    input in_val,
    output out_val
);
    wire temp_wire;
    inverter_block u_inv1 (.in_sig(in_val), .out_sig(temp_wire));
    inverter_block u_inv2 (.in_sig(temp_wire), .out_sig(out_val));
endmodule`,

      expectedOutputs: [
        { time: 0, in_val: 0, out_val: 0 },
        { time: 5, in_val: 1, out_val: 1 },
        { time: 10, in_val: 0, out_val: 0 }
      ],

      hints: {
        he: "הצהירו על wire temp_wire; וחברו את .in_sig ו-.out_sig במופעים u_inv1 ו-u_inv2.",
        en: "Declare wire temp_wire; and map the .in_sig and .out_sig ports in instances u_inv1 and u_inv2."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 28: Parameterized Modules (parameter)
    // --------------------------------------------------------------------------
    {
      id: 28,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מודולים פרמטריים (parameter) ⚙️",
      titleEn: "Parameterized Modules (parameter)",

      explanationHe: `
<h3>1. למה צריך מודולים דינמיים? ⚙️</h3>
<p>נניח שאתם מפתחים מעבד. שלב אחד דורש חיבור של שני מספרים ברוחב 8 ביט, שלב אחר דורש חיבור של מספרים ברוחב 16 ביט, ובקרה מרכזית דורשת חיבור של 32 ביט. האם נכתוב מודול מחבר (Adder) נפרד לכל רוחב?</p>
<p>בוודאי שלא. זהו בזבוז קוד איום ופתח לשגיאות רבות. ב-Verilog אנו יכולים להגדיר קבועים מיוחדים הנקראים <strong>Parameters (פרמטרים)</strong>, המאפשרים לקבוע מאפיינים שונים של המודול (כמו רוחב אותות) בזמן הקומפילציה.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. הגדרת פרמטר במודול 📐</h3>
<p>הגדרת פרמטרים מתבצעת בעזרת התחביר <code>#(parameter NAME = default_value)</code> מיד לאחר שם המודול, ולפני הגדרת הפורטים.</p>
<p>נראה דוגמה של מודול צובר (Accumulator) גנרי:</p>
<pre dir="ltr"><code>module accumulator #(
    parameter SIZE = 16 // ערך ברירת מחדל של 16 ביט
) (
    input  [SIZE-1:0] data_in,
    output [SIZE-1:0] data_out
);
    assign data_out = data_in; // העברה ישירה
endmodule</code></pre>
<p>כאשר רושמים <code>[SIZE-1:0]</code>, רוחב האוטובוס נקבע באופן דינמי לפי ערך הפרמטר. אם <code>SIZE</code> הוא 16, רוחב האוטובוס יהיה 16 ביטים (מאינדקס 0 עד 15).</p>
`,

      explanationEn: `
<h3>1. Why Do We Need Dynamic Modules? ⚙️</h3>
<p>Suppose you are designing a processor. One block requires adding two 8-bit numbers, another block needs to add 16-bit numbers, and the central ALU operates on 32-bit values. Should you write separate adder modules for each width?</p>
<p>Absolutely not. That would result in redundant code and lead to potential mistakes. Verilog allows us to define compile-time constants called <strong>Parameters</strong>. They let us define attributes of a module (like bus widths or buffer capacities) dynamically.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Defining a Parameter inside a Module 📐</h3>
<p>Parameters are defined using the <code>#(parameter NAME = default_value)</code> syntax immediately after the module name and before the port list.</p>
<p>Let's look at a generic accumulator design:</p>
<pre dir="ltr"><code>module accumulator #(
    parameter SIZE = 16 // Default value of 16 bits
) (
    input  [SIZE-1:0] data_in,
    output [SIZE-1:0] data_out
);
    assign data_out = data_in; // Simple bypass
endmodule</code></pre>
<p>By writing <code>[SIZE-1:0]</code>, the bus width is dynamically determined by the parameter value. If <code>SIZE</code> is 16, the bus width will be 16 bits (indexed from 0 to 15).</p>
`,

      taskHe: `כתבו מודול פרמטרי בשם <code dir="ltr">top_module</code>.
<br>
המודול יקבל פרמטר בשם <code dir="ltr">WIDTH</code> עם ערך ברירת מחדל של <code dir="ltr">8</code>.
<br><br>
על המודול להכיל:
<ul>
  <li>כניסה בגודל <code dir="ltr">WIDTH</code> ביטים בשם <code dir="ltr">data_in</code> (מוגדרת כ-<code dir="ltr">input [WIDTH-1:0] data_in</code>).</li>
  <li>יציאה בגודל <code dir="ltr">WIDTH</code> ביטים בשם <code dir="ltr">data_out</code> (מוגדרת כ-<code dir="ltr">output [WIDTH-1:0] data_out</code>).</li>
</ul>
בצעו היפוך ביט-ביט (Bitwise NOT) בין הכניסה ליציאה: <code dir="ltr">assign data_out = ~data_in;</code>.`,

      taskEn: `Create a parameterized module named <code dir="ltr">top_module</code>.
<br>
The module must define a parameter named <code dir="ltr">WIDTH</code> with a default value of <code dir="ltr">8</code>.
<br><br>
The module should have:
<ul>
  <li>A vector input of size <code dir="ltr">WIDTH</code> bits named <code dir="ltr">data_in</code> (declared as <code dir="ltr">input [WIDTH-1:0] data_in</code>).</li>
  <li>A vector output of size <code dir="ltr">WIDTH</code> bits named <code dir="ltr">data_out</code> (declared as <code dir="ltr">output [WIDTH-1:0] data_out</code>).</li>
</ul>
Assign <code dir="ltr">data_out = ~data_in;</code> to perform a bitwise inversion.`,

      starterCode: `module top_module #(
    // הגדר את הפרמטר WIDTH עם ערך ברירת מחדל 8 כאן / Define WIDTH parameter with default value 8 here
) (
    // הגדר כניסה data_in ויציאה data_out ברוחב WIDTH / Define ports data_in and data_out of size WIDTH
);
    // בצע היפוך ביט-ביט / Assign bitwise inversion here

endmodule`,

      solutionCode: `module top_module #(
    parameter WIDTH = 8
) (
    input [WIDTH-1:0] data_in,
    output [WIDTH-1:0] data_out
);
    assign data_out = ~data_in;
endmodule`,

      expectedOutputs: [
        { time: 0, data_in: 240, data_out: 15 },
        { time: 5, data_in: 85, data_out: 170 },
        { time: 10, data_in: 252, data_out: 3 },
        { time: 15, data_in: 3, data_out: 252 }
      ],

      hints: {
        he: "הגדירו parameter WIDTH = 8 בתוך ה-#(...) והשתמשו ב-[WIDTH-1:0] להגדרת הפורטים.",
        en: "Declare parameter WIDTH = 8 inside the #(...) and use [WIDTH-1:0] to define the ports."
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 29: Override Parameters
    // --------------------------------------------------------------------------
    {
      id: 29,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "דריסת פרמטרים (Parameter Overriding) 🔄",
      titleEn: "Override Parameters",

      explanationHe: `
<h3>1. כיצד לדרוס ערכי פרמטרים? 🔄</h3>
<p>מודולים פרמטריים מגיעים עם ערכי ברירת מחדל. אך היתרון האמיתי שלהם מתבטא כאשר אנו יוצרים מופע של המודול במקום כלשהו, ומחליטים <strong>לדרוס (Override)</strong> את ערכי ברירת המחדל לערך אחר המתאים לאותו מופע ספציפי.</p>
<p>הדבר מאפשר שימוש חוזר רחב ומפחית משמעותית כתיבת קוד כפול.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר דריסה בעזרת סמל הדיאז 📐</h3>
<p>כאשר מבצעים אינסטנסיאציה, רושמים את סמל הדיאז <code>#</code> וסוגריים מיד לאחר שם המודול, ובתוכם מעבירים את הערך החדש עבור הפרמטר:</p>
<pre dir="ltr"><code>// דריסת פרמטר לפי שם
module_name #(
    .PARAMETER_NAME(new_value)
) instance_name (
    .port_name(signal_name)
);</code></pre>

<p>נראה דוגמה של מודול אוגר כללי:</p>
<pre dir="ltr"><code>module register #(parameter BITS = 8) (input [BITS-1:0] d, output [BITS-1:0] q);</code></pre>
<p>אם נרצה ליצור מופע שלו ברוחב 32 ביט במודול הראשי:</p>
<pre dir="ltr"><code>module cpu_top (input [31:0] data_bus, output [31:0] reg_bus);
    // דריסת הפרמטר BITS ל-32
    register #(.BITS(32)) u_reg32 (
        .d(data_bus),
        .q(reg_bus)
    );
endmodule</code></pre>
`,

      explanationEn: `
<h3>1. How to Override Parameter Values? 🔄</h3>
<p>Parameterized modules come with default values. However, their true power is unlocked when we instantiate them and choose to <strong>override</strong> the defaults with values custom-tailored to that specific instance.</p>
<p>This increases code reusability and dramatically reduces duplicate code.</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Overriding Syntax Using the Hash Symbol 📐</h3>
<p>When instantiating a parameterized module, place a hash symbol <code>#</code> and parentheses right after the module name, inside which we pass the new values for the parameters:</p>
<pre dir="ltr"><code>// Named parameter overriding
module_name #(
    .PARAMETER_NAME(new_value)
) instance_name (
    .port_name(signal_name)
);</code></pre>

<p>Suppose we have a generic register module defined as:</p>
<pre dir="ltr"><code>module register #(parameter BITS = 8) (input [BITS-1:0] d, output [BITS-1:0] q);</code></pre>
<p>To instantiate it with a width of 32 bits inside a top module, write:</p>
<pre dir="ltr"><code>module cpu_top (input [31:0] data_bus, output [31:0] reg_bus);
    // Overriding parameter BITS to 32
    register #(.BITS(32)) u_reg32 (
        .d(data_bus),
        .q(reg_bus)
    );
endmodule</code></pre>
`,

      taskHe: `במערכת מוגדר מודול זיכרון פרמטרי בשם <code dir="ltr">ram_block</code> הבא:
<pre dir="ltr"><code>module ram_block #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
) (
    input clk,
    input [ADDR_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    output [DATA_WIDTH-1:0] rdata
);</code></pre>
<br>
בתוך המודול הראשי <code dir="ltr">top_module</code> (בעל כניסת שעון <code dir="ltr">clk</code>, כניסת כתובת <code dir="ltr">addr_in</code> בגודל 6 ביט, כניסת נתונים <code dir="ltr">wdata_in</code> בגודל 16 ביט, ויציאת נתונים <code dir="ltr">rdata_out</code> בגודל 16 ביט), צרו מופע שלו בשם <code dir="ltr">u_ram</code>.
<br><br>
עליכם **לדרוס** את הפרמטרים שלו כך ש-<code dir="ltr">DATA_WIDTH</code> יהיה <code dir="ltr">16</code> ו-<code dir="ltr">ADDR_WIDTH</code> יהיה <code dir="ltr">6</code>. חברו את כל הפורטים לפי שמם.`,

      taskEn: `A pre-defined parameterized memory block named <code dir="ltr">ram_block</code> exists:
<pre dir="ltr"><code>module ram_block #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
) (
    input clk,
    input [ADDR_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    output [DATA_WIDTH-1:0] rdata
);</code></pre>
<br>
Inside <code dir="ltr">top_module</code> (which has a clock <code dir="ltr">clk</code>, a 6-bit input address <code dir="ltr">addr_in</code>, a 16-bit input data <code dir="ltr">wdata_in</code>, and a 16-bit output data <code dir="ltr">rdata_out</code>), instantiate it with the name <code dir="ltr">u_ram</code>.
<br><br>
You must **override** its parameters so that <code dir="ltr">DATA_WIDTH</code> is set to <code dir="ltr">16</code> and <code dir="ltr">ADDR_WIDTH</code> is set to <code dir="ltr">6</code>. Connect all ports by name.`,

      starterCode: `module top_module (
    input clk,
    input [5:0] addr_in,
    input [15:0] wdata_in,
    output [15:0] rdata_out
);
    // צור מופע של ram_block בשם u_ram ודרוס פרמטרים כאן / Instantiate ram_block as u_ram and override parameters here

endmodule`,

      solutionCode: `module top_module (
    input clk,
    input [5:0] addr_in,
    input [15:0] wdata_in,
    output [15:0] rdata_out
);
    ram_block #(
        .DATA_WIDTH(16),
        .ADDR_WIDTH(6)
    ) u_ram (
        .clk(clk),
        .addr(addr_in),
        .wdata(wdata_in),
        .rdata(rdata_out)
    );
endmodule`,

      expectedOutputs: [
        { time: 0, clk: 0, addr_in: 0, wdata_in: 0, rdata_out: 0 },
        { time: 5, clk: 1, addr_in: 12, wdata_in: 42, rdata_out: 42 },
        { time: 10, clk: 0, addr_in: 12, wdata_in: 42, rdata_out: 42 }
      ],

      hints: {
        he: "השתמשו בתחביר הבא: ram_block #(.DATA_WIDTH(16), .ADDR_WIDTH(6)) u_ram (...);",
        en: "Use the named override syntax: ram_block #(.DATA_WIDTH(16), .ADDR_WIDTH(6)) u_ram (...);"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 30: Generate For-Loop
    // --------------------------------------------------------------------------
    {
      id: 30,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "לולאות ייצור חומרה (Generate For-Loop) 🔁",
      titleEn: "Generate For-Loop",

      explanationHe: `
<h3>1. לולאות רגילות מול לולאות ייצור חומרה 🔁</h3>
<p>בפרקים הבאים נלמד על לולאות <code>for</code> בתוך בלוקי <code>always</code>. לולאות אלו מתארות התנהגות רציפה. אך מה קורה אם אנחנו רוצים <strong>לשכפל מבנה פיזי של רכיבים חומרתיים</strong> (כמו 32 שערים לוגיים נפרדים או 16 מופעים של מודול)?</p>
<p>לשם כך נועד הבלוק <strong>generate</strong> בשילוב עם משתנה מיוחד שנקרא <strong>genvar</strong>.</p>
<p><strong>כלל ברזל:</strong> לולאת generate משוכפלת ו"נפתחת" (Unrolled) בזמן הקומפילציה. כלי הסינתזה פשוט מייצר עותקים פיזיים של החומרה. היא אינה רצה בזמן ריצה בשבב עצמו!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תחביר ה-Generate 📐</h3>
<p>חובה להגדיר משתנה לולאה מסוג <code>genvar</code>, לפתוח בלוק <code>generate</code> ולתת שם (label) לבלוק הפנימי של הלולאה:</p>
<pre dir="ltr"><code>genvar i;
generate
    for (i = 0; i &lt; 4; i = i + 1) begin : gen_block_name
        // הקצאה או אינסטנסיאציה של חומרה
        assign out_bus[i] = ~in_bus[i];
    end
endgenerate</code></pre>
<p>שימו לב ששם הבלוק (<code>gen_block_name</code>) חיוני מכיוון שכלי הסינתזה משתמש בו כדי ליצור שמות ייחודיים לרכיבים שנוצרים (למשל: <code>gen_block_name[0]</code>, <code>gen_block_name[1]</code> וכו').</p>
`,

      explanationEn: `
<h3>1. Behavioral Loops vs. Hardware Generation Loops 🔁</h3>
<p>We will learn about standard <code>for</code> loops inside <code>always</code> blocks in later chapters. Those loops describe sequential behavior. But what if we want to <strong>duplicate physical hardware structures</strong> (like 32 separate logic gates or 16 sub-module instances)?</p>
<p>For this purpose, Verilog provides the <strong>generate</strong> block, used alongside a special loop variable called a <strong>genvar</strong>.</p>
<p><strong>Rule of Thumb:</strong> A generate loop is unrolled during compile-time (synthesis). The compiler duplicates the physical gates. It does NOT run dynamically at runtime on the physical chip!</p>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Generate Loop Syntax 📐</h3>
<p>You must declare a loop index variable using the <code>genvar</code> keyword, open a <code>generate</code> block, and provide a unique label/name for the loop body block:</p>
<pre dir="ltr"><code>genvar i;
generate
    for (i = 0; i &lt; 4; i = i + 1) begin : gen_block_name
        // Hardware assignment or instantiation
        assign out_bus[i] = ~in_bus[i];
    end
endgenerate</code></pre>
<p>The loop body label (<code>gen_block_name</code>) is mandatory because the synthesis tool uses it to generate unique hierarchical names for the instantiated components (e.g. <code>gen_block_name[0]</code>, <code>gen_block_name[1]</code>, etc.).</p>
`,

      taskHe: `כתבו מודול בשם <code dir="ltr">top_module</code> המבצע פעולת XOR ביט-ביט בין שני וקטורים בגודל 8 ביט: <code dir="ltr">a</code> ו-<code dir="ltr">b</code>, ומפיק יציאה בגודל 8 ביט בשם <code dir="ltr">y</code>.
<br><br>
עליכם להשתמש בבלוק <code dir="ltr">generate</code> ובסגנון לולאת <code dir="ltr">for</code> עם משתנה <code dir="ltr">genvar i</code> כדי לבצע את ההשמות <code dir="ltr">y[i] = a[i] ^ b[i]</code>. העניקו ללולאה את השם <code dir="ltr">xor_loop</code>.`,

      taskEn: `Create a module named <code dir="ltr">top_module</code> that performs a bitwise XOR between two 8-bit vector inputs: <code dir="ltr">a</code> and <code dir="ltr">b</code>, producing an 8-bit output <code dir="ltr">y</code>.
<br><br>
You must use a <code dir="ltr">generate</code> block with a <code dir="ltr">for</code> loop and a <code dir="ltr">genvar i</code> to assign <code dir="ltr">y[i] = a[i] ^ b[i]</code>. Name the loop body block <code dir="ltr">xor_loop</code>.`,

      starterCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    output [7:0] y
);
    // הגדר genvar כאן / Declare your genvar here
    
    // כתוב בלוק generate המכיל לולאת for לביצוע ה-XOR / Write generate block with for-loop here

endmodule`,

      solutionCode: `module top_module (
    input [7:0] a,
    input [7:0] b,
    output [7:0] y
);
    genvar i;
    generate
        for (i = 0; i < 8; i = i + 1) begin : xor_loop
            assign y[i] = a[i] ^ b[i];
        end
    endgenerate
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, y: 0 },
        { time: 5, a: 15, b: 240, y: 255 },
        { time: 10, a: 85, b: 85, y: 0 }
      ],

      hints: {
        he: "הגדירו genvar i; בתוך המודול, ואז רשמו generate ... for (...) begin : xor_loop ... end endgenerate",
        en: "Declare genvar i; inside the module, then write generate ... for (...) begin : xor_loop ... end endgenerate"
      }
    },

    // --------------------------------------------------------------------------
    // Lesson 31: Hierarchical 16-bit Adder
    // --------------------------------------------------------------------------
    {
      id: 31,
      chapter: 4,
      chapterTitleHe: "פרק 4: היררכיה, מודולים ופרמטרים",
      chapterTitleEn: "Chapter 4: Hierarchy, Modules & Parameters",
      titleHe: "מפענח חיבור 16-ביט היררכי (Hierarchical Adder) 🧮",
      titleEn: "Hierarchical 16-bit Adder",

      explanationHe: `
<h3>1. אינטגרציה היררכית מעשית 🧮</h3>
<p>כדי לסכם את מה שלמדנו על מודולים, היררכיה ואינסטנסיאציה, נתכנן רכיב חומרה משמעותי: <strong>מפענח חיבור (Adder) של 16 ביט</strong>, המורכב משני מודולים נפרדים של מפענח חיבור של 8 ביט.</p>
<p>ברמת החומרה, כדי לחבר שני מספרים בני 16 ביט, אנו מחלקים את המספרים לשני חצאים:</p>
<ul>
  <li>החצי התחתון (הביטים 0 עד 7) מחושב על ידי מפענח החיבור הראשון.</li>
  <li>הנשיאה (Carry out) מהמפענח הראשון צריכה לעבור כנשיאה בכניסה (Carry in) למפענח החיבור השני, המחשב את הביטים 8 עד 15.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. תרשים הולכת אות הנשיאה 📐</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4;">
  a[15:8], b[15:8]   ------>  [ u_add_high (add8) ]  ------> sum_val[15:8]<br>
                                   ^<br>
                                   | (carry_mid)<br>
                                   |<br>
  a[7:0],  b[7:0]    ------>  [ u_add_low  (add8) ]  ------> sum_val[7:0]<br>
  cin = 1'b0 (קבוע)  ------>
</div>
<p>בדוגמה זו אנו משתמשים בחוט פנימי (נקרא לו <code>carry_mid</code>) המחבר את היציאה <code>cout</code> של המפענח התחתון אל הכניסה <code>cin</code> של המפענח העליון.</p>
`,

      explanationEn: `
<h3>1. Practical Hierarchical Integration 🧮</h3>
<p>To synthesize what we have learned about modules, hierarchy, and port connections, we will design a significant hardware component: a <strong>16-bit binary Adder</strong>, constructed by connecting two pre-defined 8-bit adders.</p>
<p>In digital design, to add two 16-bit numbers, we divide them into two 8-bit halves:</p>
<ul>
  <li>The lower half (bits 0 to 7) is calculated by the first 8-bit adder.</li>
  <li>The carry output (Carry out) from the first adder must flow into the carry input (Carry in) of the second 8-bit adder, which computes the higher half (bits 8 to 15).</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.2rem 0;">

<h3>2. Carry Propagation Diagram 📐</h3>
<div style="font-family: monospace; background: var(--card-bg); padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px; line-height: 1.4;">
  a[15:8], b[15:8]   ------>  [ u_add_high (add8) ]  ------> sum_val[15:8]<br>
                                   ^<br>
                                   | (carry_mid)<br>
                                   |<br>
  a[7:0],  b[7:0]    ------>  [ u_add_low  (add8) ]  ------> sum_val[7:0]<br>
  cin = 1'b0 (const) ------>
</div>
<p>In this architecture, we declare an internal wire (e.g. <code>carry_mid</code>) to route the <code>cout</code> signal from the lower adder into the <code>cin</code> port of the upper adder.</p>
`,

      taskHe: `במערכת מוגדר מראש מודול של מחבר 8-ביט בשם <code dir="ltr">add8</code>:
<pre dir="ltr"><code>module add8 (
    input [7:0] a,
    input [7:0] b,
    input cin,
    output [7:0] sum,
    output cout
);</code></pre>
<br>
בנו את המודול הראשי <code dir="ltr">top_module</code> (בעל כניסות <code dir="ltr">a</code> ו-<code dir="ltr">b</code> בגודל 16 ביט, ויציאה <code dir="ltr">sum_val</code> בגודל 16 ביט).
<br><br>
עליכם ליצור שני מופעים של <code dir="ltr">add8</code>:
<ul>
  <li>המופע הראשון יקרא <code dir="ltr">u_add_low</code> ויחשב את 8 הביטים התחתונים (חיבור <code dir="ltr">a[7:0]</code> ו-<code dir="ltr">b[7:0]</code>) עם כניסת נשיאה קבועה של אפס (<code dir="ltr">1'b0</code>). הנשיאה שמופקת ממנו תתחבר לחוט פנימי בשם <code dir="ltr">carry_mid</code>.</li>
  <li>המופע השני יקרא <code dir="ltr">u_add_high</code> ויחשב את 8 הביטים העליונים (חיבור <code dir="ltr">a[15:8]</code> ו-<code dir="ltr">b[15:8]</code>) עם כניסת נשיאה המחוברת ל-<code dir="ltr">carry_mid</code>. את יציאת ה-cout שלו השאירו פתוחה/לא מחוברת (<code dir="ltr">()</code>).</li>
</ul>
חברו את המודולים **לפי שם**.`,

      taskEn: `A pre-defined 8-bit adder module named <code dir="ltr">add8</code> is available in the library:
<pre dir="ltr"><code>module add8 (
    input [7:0] a,
    input [7:0] b,
    input cin,
    output [7:0] sum,
    output cout
);</code></pre>
<br>
Build the top module <code dir="ltr">top_module</code> (which has 16-bit inputs <code dir="ltr">a</code>, <code dir="ltr">b</code> and a 16-bit output <code dir="ltr">sum_val</code>).
<br><br>
Instantiate two copies of <code dir="ltr">add8</code>:
<ul>
  <li>The first instance named <code dir="ltr">u_add_low</code> computes the lower 8 bits (connecting <code dir="ltr">a[7:0]</code> and <code dir="ltr">b[7:0]</code>) with carry-in tied to <code dir="ltr">1'b0</code>. The carry-out should connect to an internal wire named <code dir="ltr">carry_mid</code>.</li>
  <li>The second instance named <code dir="ltr">u_add_high</code> computes the upper 8 bits (connecting <code dir="ltr">a[15:8]</code> and <code dir="ltr">b[15:8]</code>) with carry-in connected to <code dir="ltr">carry_mid</code>. Leave its carry-out port unconnected (empty parenthesis <code dir="ltr">()</code>).</li>
</ul>
Connect the modules **by name**.`,

      starterCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    output [15:0] sum_val
);
    // הגדר חוט מקשר פנימי לנשיאה / Declare the intermediate carry wire
    
    // צור מופע של המחבר התחתון u_add_low / Instantiate lower 8-bit adder u_add_low
    
    // צור מופע של המחבר העליון u_add_high / Instantiate upper 8-bit adder u_add_high

endmodule`,

      solutionCode: `module top_module (
    input [15:0] a,
    input [15:0] b,
    output [15:0] sum_val
);
    wire carry_mid;
    add8 u_add_low (
        .a(a[7:0]),
        .b(b[7:0]),
        .cin(1'b0),
        .sum(sum_val[7:0]),
        .cout(carry_mid)
    );
    add8 u_add_high (
        .a(a[15:8]),
        .b(b[15:8]),
        .cin(carry_mid),
        .sum(sum_val[15:8]),
        .cout()
    );
endmodule`,

      expectedOutputs: [
        { time: 0, a: 0, b: 0, sum_val: 0 },
        { time: 5, a: 1000, b: 2000, sum_val: 3000 },
        { time: 10, a: 32768, b: 32768, sum_val: 0 },
        { time: 15, a: 500, b: 600, sum_val: 1100 }
      ],

      hints: {
        he: "הגדירו wire carry_mid; והעבירו sum_val[7:0] למחבר התחתון ו-sum_val[15:8] למחבר העליון.",
        en: "Declare wire carry_mid; and pass sum_val[7:0] to the lower adder and sum_val[15:8] to the upper adder."
      }
    }
  ];

  if (typeof window.registerChapter === 'function') {
    window.registerChapter(chapterLessons);
  } else {
    window.CURRICULUM = (window.CURRICULUM || []).concat(chapterLessons);
  }
})();
