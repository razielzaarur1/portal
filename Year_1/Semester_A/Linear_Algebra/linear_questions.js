// questions.js
// מאגר השאלות לאתר אלגברה לינארית

const questionsData = [
    // --- מבחן 9.7.2018 (מועד א') ---
    {
        id: 1,
        source: "מבחן 09.07.2018 מועד א' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "נתונה מערכת משוואות:\n$$\\begin{cases} 3x_1 + 4x_2 + x_3 + 2x_4 = 3 \\\\ 6x_1 + 8x_2 + 2x_3 + 5x_4 = 7 \\\\ 9x_1 + 12x_2 + 3x_3 + ax_4 = 13 \\end{cases}$$\nא. מצאו לאילו ערכי \\(a\\) יש למערכת: (i) פתרון יחיד. (ii) אף פתרון. (iii) אינסוף פתרונות.\nב. מצאו את כל הפתרונות הקיימים."
    },
    {
        id: 2,
        source: "מבחן 09.07.2018 מועד א' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון \\(W = \\text{span}\\{(1,1,1,1), (0,1,0,0), (1,0,0,0)\\}\\).\nבנוסף נתונים שלושה וקטורים:\n$$u_1 = (1,2,3,4), \\quad u_2 = (2,2,-1,0), \\quad u_3 = (-1,2,-1,-1)$$\nא. מצא את כל הוקטורים מתוך \\(\\{u_1, u_2, u_3\\}\\) ששייכים ל-\\(W\\).\nב. מצא בסיס ל-\\(W\\), שבו אחד מהוקטורים יהיה וקטור שמצאת בסעיף א'."
    },
    {
        id: 3,
        source: "מבחן 09.07.2018 מועד א' שאלה 3",
        topic: ["matrices", "complex"],
        difficulty: "medium",
        text: "מצא \\(z \\in \\mathbb{C}\\) כך שהמטריצה הבאה לא תהא הפיכה:\n$$A = \\begin{pmatrix} i & 0 & 1+2i \\\\ 1+i & 0 & z \\\\ 5 & 5i & z \\end{pmatrix}$$"
    },
    {
        id: 4,
        source: "מבחן 09.07.2018 מועד א' שאלה 4",
        topic: ["eigen", "matrices"],
        difficulty: "medium",
        text: "א. מצאו מטריצה \\(B = \\begin{pmatrix} x & y \\\\ z & t \\end{pmatrix}\\) עם וקטורים עצמיים \\(v_1 = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}, v_2 = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}\\), כאשר הערכים העצמיים הם \\(\\lambda_1 = 1, \\lambda_2 = 0\\).\nב. חשב את \\(B^7\\)."
    },
    {
        id: 5,
        source: "מבחן 09.07.2018 מועד א' שאלה 5",
        topic: ["matrices", "systems"],
        difficulty: "easy",
        text: "נתונה מטריצה התלויה בפרמטר \\(a\\):\n$$X = \\begin{pmatrix} a & 1 & 1 \\\\ 2 & a & -6 \\\\ 1 & 3 & -a \\end{pmatrix}$$\nלאילו ערכים של \\(a\\) השורות של \\(X\\) תלויות לינארית?"
    },
    {
        id: 6,
        source: "מבחן 09.07.2018 מועד א' שאלה 6",
        topic: ["spaces"], // גם מכפלה פנימית
        difficulty: "hard",
        text: "נתון תת-מרחב \\(W = \\text{span}\\{(1,2,3,4), (3,-2,0,-1)\\}\\) של המרחב \\(V=\\mathbb{R}^4\\).\nא. מצאו מערכת משוואות הומוגניות אשר מאפיינת את וקטורי \\(W\\).\nב. מצאו וקטור \\(v \\in V\\), אורתוגונלי ל-\\(W\\) עם נורמה 2 (\\(||v||=2\\))."
    },
    {
        id: 7,
        source: "מבחן 09.07.2018 מועד א' שאלה 7",
        topic: ["proofs", "spaces"],
        difficulty: "medium",
        text: "נתון \\(U = \\{(2\\alpha, \\alpha, 0, \\beta) \\mid \\alpha, \\beta \\in \\mathbb{R}\\}\\) קבוצת וקטורים ב-\\(\\mathbb{R}^4\\).\nא. הוכיחו כי \\(U\\) היא תת-מרחב של \\(V\\).\nב. מצאו בסיס וחשב את המימד של תת המרחב \\(U\\)."
    },
    {
        id: 8,
        source: "מבחן 09.07.2018 מועד א' שאלה 8",
        topic: ["spaces"],
        difficulty: "hard",
        text: "נתונים \\(U, W\\) תתי מרחבים וקטורים של \\(\\mathbb{R}^4\\):\n\\(U\\) נפרש ע\"י \\(\\left\\{ (1,3,0,4)^T, (2,0,6,0)^T, (3,3,7,0)^T, (0,-1,0,0)^T \\right\\}\\)\n\\(W\\) מוגדר ע\"י: \\(x_1 + 2x_2 - 3x_3 + x_4 = 0\\) וגם \\(x_2 - 5x_4 = 0\\)\n\nא. מצאו בסיס ומימד של \\(U\\) ו-\\(W\\).\nב. מצאו בסיס ומימד של \\(U+W\\).\nג. האם הבסיס של סעיף ב' הוא בסיס לסכום ישר? נמק."
    },

    // --- מבחן 8.8.2018 (מועד ב') ---
    {
        id: 9,
        source: "מבחן 08.08.2018 מועד ב' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "נתונה מערכת משוואות עם פרמטר \\(a\\):\n$$\\begin{cases} ax + ay + (1-a)z = 4a \\\\ 2x + 2y - 2z = 8 \\\\ x + (a+1)y + z = 6 \\end{cases}$$\nמצא עבור אלו ערכי \\(a\\): (1) פתרון יחיד. (2) אינסוף פתרונות. (3) אין פתרון."
    },
    {
        id: 10,
        source: "מבחן 08.08.2018 מועד ב' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים 2 תתי מרחבים \\(U, W\\) ב-\\(\\mathbb{R}^4\\):\n\\(W\\) = מרחב הפתרונות של: \\(x_1 + 3x_2 + 2x_4 = 0\\) וגם \\(x_1 + 3x_2 + x_3 - 2x_4 = 0\\)\n\\(U = \\text{span}\\{(1,0,3,0), (0,1,4,0), (2,-3,-6,3), (4,-1,8,2)\\}\\)\n\nא. מצא בסיס וממד ל-\\(U\\).\nב. מצא בסיס וממד ל-\\(W\\).\nג. מצא \\(c\\) כך ש-\\( (c,1,1,0) \\) שייך ל-\\(W\\).\nד. מצא בסיס וממד ל-\\(U+W\\)."
    },
    {
        id: 11,
        source: "מבחן 08.08.2018 מועד ב' שאלה 3",
        topic: ["matrices"],
        difficulty: "medium",
        text: "נתונה מטריצה \\(A\\) בפרמטר \\(k\\):\n$$A = \\begin{pmatrix} k & 0 & 0 & 0 \\\\ k-1 & 2 & 0 & 0 \\\\ k-1 & 1 & 3 & 0 \\\\ 2 & 0 & k-2 & 1 \\end{pmatrix}$$\nמצא ערכי \\(k\\) שעבורם \\(A\\) הפיכה ומתקיים: \\(\\det(A^{-1}) = \\frac{1}{3k-3}\\)."
    },
    {
        id: 12,
        source: "מבחן 08.08.2018 מועד ב' שאלה 4",
        topic: ["complex"],
        difficulty: "easy",
        text: "פתור את המשוואה המרוכבת:\n$$2z = |z+i| + i$$"
    },
    {
        id: 13,
        source: "מבחן 08.08.2018 מועד ב' שאלה 5",
        topic: ["spaces"],
        difficulty: "medium",
        text: "יהי \\(V = P_3[x]\\) מרחב הפולינומים ממעלה \\(\\le 3\\). נסמן:\n\\(U = \\{ p(x) \\in V \\mid p(0) = 0 \\}\\)\n\\(W = \\{ p(x) \\in V \\mid p''(x) = 0 \\}\\)\nמצא בסיס וממד של \\(U\\).\nמצא בסיס וממד של \\(W\\)."
    },
    {
        id: 14,
        source: "מבחן 08.08.2018 מועד ב' שאלה 6",
        topic: ["proofs", "spaces"],
        difficulty: "hard",
        text: "נתון ש-\\(\\{u_1, u_2, u_3\\}\\) בת\"ל. מגדירים:\n$$v_1 = ku_1 + u_2 + u_3$$\n$$v_2 = 3u_1 + ku_2 - u_3$$\n$$v_3 = 4u_1 - 2u_2 + ku_3$$\nמצא לאלו ערכי \\(k\\) הוקטורים \\(\\{v_1, v_2, v_3\\}\\) הם בלתי תלויים לינארית."
    },
    {
        id: 15,
        source: "מבחן 08.08.2018 מועד ב' שאלה 7",
        topic: ["spaces"],
        difficulty: "hard",
        text: "יהיו \\(U, W\\) תתי מרחבים של \\(\\mathbb{R}^4\\).\nנתון: \\(U \\cap W = \\{\\vec{0}\\}\\).\nנתון: \\((1, a+1, 3, 5a-1) \\in W\\) וגם \\((a, 2, a+2, 4) \\in W\\).\nנתון: \\(\\dim U = 2\\) ו-\\(U+W = \\mathbb{R}^4\\).\nמצא לאלו ערכי \\(a\\) מתקיים הנתון."
    },
    {
        id: 16,
        source: "מבחן 08.08.2018 מועד ב' שאלה 8",
        topic: ["proofs", "spaces"],
        difficulty: "medium",
        text: "הוכח שמתקיים: \\(\\text{span}\\{u,w\\} = \\text{span}\\{u+w, w\\}\\)."
    },

    // --- מבחן 27.2.2018 (מועד ב') ---
    {
        id: 17,
        source: "מבחן 27.02.2018 מועד ב' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "לאילו ערכים של פרמטר \\(a\\) יש למערכת פתרון יחיד, אינסוף או אף פתרון?\n$$\\begin{cases} (a-2)x - 2y = -2 \\\\ 2x + 3y = 4 \\\\ -4x + ay = a \\end{cases}$$"
    },
    {
        id: 18,
        source: "מבחן 27.02.2018 מועד ב' שאלה 2",
        topic: ["proofs", "spaces"],
        difficulty: "medium",
        text: "נתונות קבוצות ב-\\(\\mathbb{R}^6\\):\n\\(U = \\{x \\mid x_1+x_2+x_3=0\\}\\)\n\\(W = \\{(-5a+5b+5c, \\dots) \\mid a,b,c \\in \\mathbb{R}\\}\\)\nהאם הן תתי מרחבים? הוכח.\nמצא וקטור עם נורמה 5 ב-\\(U\\) שניצב לכל וקטורי \\(W\\)."
    },
    {
        id: 19,
        source: "מבחן 27.02.2018 מועד ב' שאלה 3",
        topic: ["matrices"],
        difficulty: "medium",
        text: "מצאו את הדטרמיננטה של מטריצה \\(5 \\times 5\\):\n$$\\det \\begin{pmatrix} 3 & 3 & -2 & 2 & 2 \\\\ 4 & -2 & 5 & 1 & 9 \\\\ 9 & -2 & 6 & 7 & 7 \\\\ 3 & -2 & 6 & 7 & -2 \\\\ -2 & 6 & 7 & -2 & 8 \\end{pmatrix}$$"
    },
    {
        id: 20,
        source: "מבחן 27.02.2018 מועד ב' שאלה 4",
        topic: ["complex", "matrices"],
        difficulty: "easy",
        text: "מצא את \\(A^{-1}\\) כאשר:\n$$A = \\begin{pmatrix} 0 & 2+2i \\\\ -1-2i & -i \\end{pmatrix}$$"
    },
    {
        id: 21,
        source: "מבחן 27.02.2018 מועד ב' שאלה 5",
        topic: ["spaces"],
        difficulty: "easy",
        text: "נתון \\(U = \\text{span}\\{(1,-1,1,1), (2,-3,5,3), (5,-4,-1,2), (9,-6,6,7)\\}\\).\nמצאו בסיס ומימד של \\(U\\)."
    },
    {
        id: 22,
        source: "מבחן 27.02.2018 מועד ב' שאלה 6",
        topic: ["proofs", "eigen"],
        difficulty: "hard",
        text: "נתונה \\(A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\) כאשר \\(a+b=c+d\\).\nהוכח של-\\(A\\) יש ערכים עצמיים: \\(\\lambda_1 = a+b, \\lambda_2 = a-c\\)."
    },
    {
        id: 23,
        source: "מבחן 27.02.2018 מועד ב' שאלה 7",
        topic: ["matrices", "proofs"],
        difficulty: "medium",
        text: "נתונה מטריצה \\(A\\) (מטריצת בלוקים משולשית).\nהוכח שהיא הפיכה ומצא את האיבר \\((A^{-1})_{1,1}\\)."
    },
    {
        id: 24,
        source: "מבחן 27.02.2018 מועד ב' שאלה 8",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים \\(U\\) (ע\"י משוואות) ו-\\(V\\) (ע\"י פרישה).\nמצא בסיס ל-\\(U\\).\nמצא משוואות ל-\\(V\\).\nהאם \\(V \\subseteq U\\) או \\(U \\subseteq V\\)?"
    },

    // --- מבחן 5.8.2018 (מועד ב') ---
    {
        id: 25,
        source: "מבחן 05.08.2018 מועד ב' שאלה 1",
        topic: ["systems", "proofs"],
        difficulty: "medium",
        text: "א. חקור את המערכת: \\(\\begin{cases} x_1+x_3=2 \\\\ x_2+x_3=1 \\\\ kx_1-x_2+x_3=0 \\end{cases}\\) (יחיד/אין/אינסוף).\nב. מצא את הפתרון כשהוא קיים.\nג. הראו כי \\(M = A B^T S B A^T\\) סימטרית (כאשר \\(S\\) סימטרית)."
    },
    {
        id: 26,
        source: "מבחן 05.08.2018 מועד ב' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים \\(U\\) (פרישה עם פרמטר \\(k\\)) ו-\\(W\\) (משוואה). קבע לאילו ערכי \\(k\\):\nא. \\(U \\subseteq W\\).\nב. \\(U \\neq W\\) כי הממדים שונים.\nג. \\(U \\neq W\\) כי הבסיס לא פורש."
    },
    {
        id: 27,
        source: "מבחן 05.08.2018 מועד ב' שאלה 3",
        topic: ["complex", "systems"],
        difficulty: "easy",
        text: "מערכת משוואות מעל מרוכבים:\n$$\\begin{cases} (1+i)x_1 + x_2 = 1 \\\\ 2x_1 + (1-i)x_2 = 1-2i \\end{cases}$$"
    },
    {
        id: 28,
        source: "מבחן 05.08.2018 מועד ב' שאלה 4",
        topic: ["eigen"],
        difficulty: "medium",
        text: "נתונה מטריצה \\(A\\). מצא פולינום אופייני, ע\"ע, ו\"ע. לכסן (\\(D, P\\)). חשב \\(A^2\\)."
    },
    {
        id: 29,
        source: "מבחן 05.08.2018 מועד ב' שאלה 6",
        topic: ["systems"],
        difficulty: "hard",
        text: "מערכת \\(Ax=b\\) עם פרמטר \\(k\\).\nא. לאילו \\(k\\) פתרון יחיד המקיים \\(x_1=x_3\\)?\nב. האם קיים \\(k\\) בו המטריצה לא הפיכה?"
    },
    {
        id: 30,
        source: "מבחן 05.08.2018 מועד ב' שאלה 7",
        topic: ["spaces"],
        difficulty: "medium",
        text: "מצא וקטור \\(r\\) אורתוגונלי לצירופים של \\(u,v,w\\) ומקיים תנאי נורמה."
    },
    {
        id: 31,
        source: "מבחן 05.08.2018 מועד ב' שאלה 8",
        topic: ["spaces"],
        difficulty: "hard",
        text: "נתונים \\(U, W\\) כמרחבי פתרונות. בדוק שייכות וקטורים ל-\\(U+W\\) ופרק אותם לרכיבים."
    },

    // --- מבחן 5.2.2018 (מועד א') ---
    {
        id: 32,
        source: "מבחן 05.02.2018 מועד א' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "חקור את המערכת הסימטרית:\n$$\\begin{cases} kx + y + z = 1 \\\\ x + ky + z = 1 \\\\ x + y + kz = 1 \\end{cases}$$"
    },
    {
        id: 33,
        source: "מבחן 05.02.2018 מועד א' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "מצא בסיס ומימד למרחב הפתרונות של מערכת הומוגנית ב-\\(\\mathbb{R}^5\\). הסבר מדוע זהו בסיס."
    },
    {
        id: 34,
        source: "מבחן 05.02.2018 מועד א' שאלה 3",
        topic: ["complex"],
        difficulty: "medium",
        text: "פתור את המשוואה: \\(z^2 - |z|^2 + \\bar{z} - z = -32 + 32i\\)."
    },
    {
        id: 35,
        source: "מבחן 05.02.2018 מועד א' שאלה 4",
        topic: ["eigen"],
        difficulty: "medium",
        text: "מצא ע\"ע, ו\"ע ולכסון למטריצה \\(4 \\times 4\\) (מטריצת בלוקים)."
    },
    {
        id: 36,
        source: "מבחן 05.02.2018 מועד א' שאלה 5",
        topic: ["spaces"],
        difficulty: "easy",
        text: "מצא בסיס ומימד ל-\\(U\\) (נתון כוקטור פרמטרי). האם \\(U=\\mathbb{R}^4\\)?"
    },
    {
        id: 37,
        source: "מבחן 05.02.2018 מועד א' שאלה 6",
        topic: ["proofs", "systems"],
        difficulty: "hard",
        text: "נתונים 3 וקטורים שהם פתרונות למערכת. הוכח שהמערכת חייבת להיות הומוגנית."
    },
    {
        id: 38,
        source: "מבחן 05.02.2018 מועד א' שאלה 7",
        topic: ["proofs", "spaces"],
        difficulty: "medium",
        text: "נתון ש-\\(u,v,w\\) בת\"ל. הוכח/הפרך תלות של צירופים לינאריים שלהם (שני סעיפים)."
    },
    {
        id: 39,
        source: "מבחן 05.02.2018 מועד א' שאלה 8",
        topic: ["spaces"],
        difficulty: "hard",
        text: "נתונים \\(U, W\\). מצא משוואות ל-\\(W\\). האם קיים \\(k\\) עבורו \\(W=U\\)?"
    },
// --- מבחן 05.02.2025 (מועד א') ---
    {
        id: 40,
        source: "מבחן 05.02.2025 מועד א' שאלה 1 (חלק א')",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון:\n$$\\mathbb{R}^{4}=\\text{Span}\\{(k,1,1,0),(0,k,1,0),(0,1,k,0),(0,0,1,k)\\}$$\nעבור אילו ערכים של הפרמטר \\(k\\) השוויון הנתון מתקיים?"
    },
    {
        id: 41,
        source: "מבחן 05.02.2025 מועד א' שאלה 2 (חלק א')",
        topic: ["matrices", "proofs"],
        difficulty: "medium",
        text: "נתון: \\(A,B\\) הן מטריצות \\(2\\times2\\) עם רכיבים ממשיים, \\(|B|=-1\\), ומתקיים:\n$$A^{3}=4A^{T}\\cdot B$$\nמצאו את \\(|A|\\) (דטרמיננטה של A)."
    },
    {
        id: 42,
        source: "מבחן 05.02.2025 מועד א' שאלה 3 (חלק ב')",
        topic: ["eigen"],
        difficulty: "medium",
        text: "נתון \\(A=\\begin{pmatrix}5&-2&-2\\\\ 4&-1&-2\\\\ -4&2&3\\end{pmatrix}\\).\nעבור אילו ערכים של \\(c\\) הווקטור \\(\\begin{pmatrix}c\\\\ c\\\\ 1\\end{pmatrix}\\) יהיה וקטור עצמי של \\(A\\)?"
    },
    {
        id: 43,
        source: "מבחן 05.02.2025 מועד א' שאלה 4 (חלק ב')",
        topic: ["matrices"],
        difficulty: "hard",
        text: "נתון: \\(A=\\begin{pmatrix}1&p&q\\\\ r&0&2\\\\ 0&-1&-2\\end{pmatrix}\\).\nנתון כי \\(A^{3}+A^{2}-2I_{3}=0_{3\\times3}\\).\nמצאו את הרכיב העומד בשורה מס' 3 ובעמודה מס' 3 במטריצה \\(A^{-1}\\). (הערה: התשובה אינה תלויה בפרמטרים)."
    },
    {
        id: 44,
        source: "מבחן 05.02.2025 מועד א' שאלה 5 (חלק ב')",
        topic: ["spaces", "systems"],
        difficulty: "hard",
        text: "נתבונן בתת-הקבוצה הבאה של \\(\\mathbb{R}^{3}\\) התלויה בפרמטרים \\(a,b\\):\n$$S=\\left\\{\\begin{pmatrix}x\\\\ y\\\\ z\\end{pmatrix} \\bigg| \\begin{pmatrix}1&-1&1\\\\ a&-1&1\\end{pmatrix}\\cdot\\begin{pmatrix}x\\\\ y\\\\ z\\end{pmatrix}=\\begin{pmatrix}b\\\\ a^{2}-1\\end{pmatrix}\\right\\}$$\nעבור אילו ערכים של \\(a,b\\) הקבוצה \\(S\\) היא מרחב וקטורי ממימד 1?"
    },

    // --- מבחן 09.03.2025 (מועד ב') ---
    {
        id: 45,
        source: "מבחן 09.03.2025 מועד ב' שאלה 1 (חלק א')",
        topic: ["matrices"],
        difficulty: "medium",
        text: "נתונה המטריצה \\(A=\\begin{pmatrix}1&2&a\\\\ 0&a&a\\\\ a+2&4&4a\\end{pmatrix}\\).\nא. מצא את הערכים של \\(a\\) עבורם שורות המטריצה תלויות לינארית.\nב. קבע עבור אילו ערכים של \\(a\\) דרגת המטריצה היא 2.\nג. קבע עבור אילו ערכים של \\(a\\) דרגת המטריצה היא 1."
    },
    {
        id: 46,
        source: "מבחן 09.03.2025 מועד ב' שאלה 2 (חלק א')",
        topic: ["matrices", "systems"],
        difficulty: "hard",
        text: "נתונות מטריצות ריבועיות \\(A, B\\) מאותו סדר המקיימות \\(A^{2}B=5AA^{T}+I\\).\nא. האם קיים פתרון יחיד למערכת \\((AB-5A^{T})x=0\\)?\nב. אם ידוע כי \\(A\\) סימטרית ו-\\(|A|=2\\), חשב את \\(|B-5I|\\)."
    },
    {
        id: 47,
        source: "מבחן 09.03.2025 מועד ב' שאלה 3 (חלק ב')",
        topic: ["matrices", "eigen"],
        difficulty: "medium",
        text: "נתונה המטריצה \\(A=\\begin{pmatrix}a&2&2\\\\ b&m&m\\\\ c&m&0\\end{pmatrix}\\).\nנתון \\(A\\begin{pmatrix}1\\\\ 1\\\\ 0\\end{pmatrix}=\\begin{pmatrix}1\\\\ 1\\\\ 0\\end{pmatrix}\\). נתון גם \\(|A|=-1\\).\nמצאו את \\(m\\)."
    },
    {
        id: 48,
        source: "מבחן 09.03.2025 מועד ב' שאלה 4 (חלק ב')",
        topic: ["spaces", "proofs"],
        difficulty: "hard",
        text: "נתון: \\(V\\) מרחב וקטורי, \\(U,W\\) תת-מרחבים של \\(V\\).\n\\(\\dim V=4, \\dim U=3, \\dim W=2\\).\nקיים \\(\\vec{v}\\in V\\) כך ש-\\(\\vec{v}\\in W\\) ו-\\(\\vec{v}\\notin U\\).\nמצאו את \\(\\dim(U\\cap W)\\)."
    },
    {
        id: 49,
        source: "מבחן 09.03.2025 מועד ב' שאלה 5 (חלק ב')",
        topic: ["proofs", "matrices"],
        difficulty: "hard",
        text: "נתון: \\(A,B\\) הן מטריצות \\(n\\times n\\) כך ש-\\(A+B=BA\\).\nהוכיחו \\(A^{2}B+AB^{2}=(AB)^{2}=I_{n}\\)."
    },

    // --- מבחן 04.04.2024 (מועד א') ---
    {
        id: 50,
        source: "מבחן 04.04.2024 מועד א' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "נתבונן במערכת הבאה התלויה בפרמטר הממשי \\(k\\):\n$$\\begin{pmatrix}1&1&1\\\\ 1&2&-k+1\\\\ 1&k+1&2\\end{pmatrix}\\cdot\\begin{pmatrix}x_{1}\\\\ x_{2}\\\\ x_{3}\\end{pmatrix}=\\begin{pmatrix}0\\\\ k\\\\ -1\\end{pmatrix}$$\nא. עבור אילו ערכים של \\(k\\) למערכת זו יהיה פתרון יחיד?\nב. מצאו את \\(x_{1}\\)."
    },
    {
        id: 51,
        source: "מבחן 04.04.2024 מועד א' שאלה 2",
        topic: ["proofs", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A\\) מטריצה \\(3\\times3\\) עם רכיבים ממשיים. נתון:\n$$A\\cdot\\begin{pmatrix}1\\\\ 2\\\\ 3\\end{pmatrix}=A\\cdot\\begin{pmatrix}4\\\\ 5\\\\ 6\\end{pmatrix}$$\nהוכיחו \\(\\det(A)=0\\)."
    },
    {
        id: 52,
        source: "מבחן 04.04.2024 מועד א' שאלה 3",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים שלושה וקטורים מ-\\(\\mathbb{R}^{3}\\), שנים מהם תלויים בפרמטר \\(a\\):\n\\(\\vec{u}=\\begin{pmatrix}1\\\\ 1\\\\ 1\\end{pmatrix}, \\vec{v}=\\begin{pmatrix}1\\\\ a\\\\ 1\\end{pmatrix}, \\vec{w}=\\begin{pmatrix}a\\\\ 1\\\\ a^{2}\\end{pmatrix}\\).\nנסמן \\(U=\\text{Span}(\\vec{u},\\vec{v},\\vec{w})\\). מצאו את כל הערכים של הפרמטר \\(a\\) עבורם \\(\\dim(U)=2\\)."
    },
    {
        id: 53,
        source: "מבחן 04.04.2024 מועד א' שאלה 4",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתבונן בתת-הקבוצה הבאה של \\(\\mathbb{R}^{3}\\) התלויה בפרמטרים \\(a,b\\):\n$$S=\\{(x,y,z) | ax+y+z=b, \\quad x+y+z=a+2b+3\\}$$\nא. עבור אילו ערכים של \\(a,b\\) הקבוצה \\(S\\) היא תת-מרחב של \\(\\mathbb{R}^{3}\\)?\nב. עבור אותם הערכים שמצאתם בסעיף א', מצאו בסיס ומימד של \\(S\\).\nג. עבור אילו ערכים של \\(a,b\\) הקבוצה \\(S\\) היא קבוצה ריקה?"
    },
    {
        id: 54,
        source: "מבחן 04.04.2024 מועד א' שאלה 5",
        topic: ["proofs", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A\\) מטריצה \\(3\\times3\\) עם רכיבים ממשיים. נתון:\n$$A\\cdot\\begin{pmatrix}1\\\\ 2\\\\ 3\\end{pmatrix}=A\\cdot\\begin{pmatrix}4\\\\ 0\\\\ -1\\end{pmatrix}=A\\cdot\\begin{pmatrix}0\\\\ 5\\\\ 3\\end{pmatrix}=\\begin{pmatrix}0\\\\ 0\\\\ 0\\end{pmatrix}$$\nהוכיחו ש-\\(A\\) היא מטריצת האפס."
    },

    // --- מבחן 06.08.2023 (מועד ב') ---
    {
        id: 55,
        source: "מבחן 06.08.2023 מועד ב' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "נתונה מערכת המשוואות הבאה, התלויה בפרמטר \\(m\\):\n$$\\begin{cases} mx+2y=3-(m-1)z \\\\ -(m-1)y-(m-1)z=-m+1+(m-1)x \\\\ 2-x=mz+my-z-y \\end{cases}$$\nלאילו ערכי הפרמטר \\(m\\) למערכת:\nא. אין פתרון?\nב. פתרון יחיד?\nג. אינסוף פתרונות? פתרו את המערכת במקרים אלו."
    },
    {
        id: 56,
        source: "מבחן 06.08.2023 מועד ב' שאלה 2",
        topic: ["complex", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A=\\begin{pmatrix}i+1&2\\\\ -1&i\\end{pmatrix}\\). פתרו את המערכת הבאה:\n$$A\\begin{pmatrix}z_{1}\\\\ z_{2}\\end{pmatrix}=\\begin{pmatrix}1+2i\\\\ 2-3i\\end{pmatrix}$$\n(הערה: התשובה הסופית בצורה \\(x+yi\\))."
    },
    {
        id: 57,
        source: "מבחן 06.08.2023 מועד ב' שאלה 3",
        topic: ["proofs", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A=\\begin{pmatrix}b\\\\ c\\\\ d\\end{pmatrix}\\), תהי \\(B=\\begin{pmatrix}x&y&z\\end{pmatrix}\\).\nהוכיחו ש-\\(AB\\) היא מטריצה \\(3\\times3\\) בלתי הפיכה."
    },
    {
        id: 58,
        source: "מבחן 06.08.2023 מועד ב' שאלה 4",
        topic: ["proofs", "spaces"],
        difficulty: "hard",
        text: "נסמן: \\(v_{1}=\\begin{pmatrix}x\\\\ 0\\\\ -x-2\\end{pmatrix}, v_{2}=\\begin{pmatrix}0\\\\ -x\\\\ -x-1\\end{pmatrix}, v_{3}=\\begin{pmatrix}x+1\\\\ x+2\\\\ 0\\end{pmatrix}\\).\nתהי \\(U=\\text{span}\\{v_{1},v_{2},v_{3}\\}\\) תת-מרחב של \\(\\mathbb{R}^{3}\\).\nהוכיחו \\(\\dim U=2\\) עבור כל \\(x\\) ממשי."
    },
    {
        id: 59,
        source: "מבחן 06.08.2023 מועד ב' שאלה 5",
        topic: ["proofs", "eigen"],
        difficulty: "hard",
        text: "תהי \\(A\\) מטריצה \\(n\\times n\\) עם רכיבים ממשיים. תהי \\(B\\) מטריצה \\(n\\times n\\) כך ש-\\(BA=B+I_{n}\\).\nהוכיחו ש-\\(A\\vec{v}\\ne\\vec{v}\\) עבור כל וקטור-עמודה \\(\\vec{0}\\ne\\vec{v}\\in\\mathbb{R}^{n}\\). (כלומר, 1 אינו ערך עצמי)."
    },

    // --- מבחן 04.01.2018 (מועד מיוחד) ---
    {
        id: 60,
        source: "מבחן 04.01.2018 מועד מיוחד שאלה 1",
        topic: ["systems", "matrices"],
        difficulty: "medium",
        text: "נתון \\(A=\\begin{pmatrix}k&1&1\\\\ 1&k&1\\\\ 1&1&k+2\\end{pmatrix}\\).\nא. חשב את הדטרמיננטה של \\(A\\).\nב. עבור אילו ערכים של \\(k\\) המטריצה \\(A\\) הפיכה?\nג. עבור אילו ערכים של \\(k\\) יש למערכת הבאה פתרון יחיד, אינסוף פתרונות, או אף פתרון?\n\\(\\begin{cases}kx+y+z=1-k\\\\ x+ky+z=1\\\\ x+y+(k+2)z=k+2\\end{cases}\\)"
    },
    {
        id: 61,
        source: "מבחן 04.01.2018 מועד מיוחד שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון: \\(W=\\text{span}\\left\\{\\begin{pmatrix}1\\\\ 1\\\\ 0\\\\ 0\\end{pmatrix},\\begin{pmatrix}1\\\\ 0\\\\ 1\\\\ 0\\end{pmatrix},\\begin{pmatrix}0\\\\ 1\\\\ 1\\\\ 1\\end{pmatrix}\\right\\}\\).\nא. להלן שלושה וקטורים. בדיוק אחד מהם שייך ל-\\(W\\). איזה הוא?\n\\(\\begin{pmatrix}1\\\\ 2\\\\ 3\\\\ 4\\end{pmatrix}, \\begin{pmatrix}2\\\\ 2\\\\ -1\\\\ 0\\end{pmatrix}, \\begin{pmatrix}-1\\\\ 2\\\\ -1\\\\ -1\\end{pmatrix}\\)\nב. נקרא \\(v\\) לווקטור שמצאת בסעיף א'. מצא בסיס ל-\\(W\\) שבו \\(v\\) הוא אחד מהווקטורים בבסיס."
    },
    {
        id: 62,
        source: "מבחן 04.01.2018 מועד מיוחד שאלה 3",
        topic: ["complex", "matrices"],
        difficulty: "medium",
        text: "א. מצא \\(z\\in\\mathbb{C}\\) כך שהמטריצה \\(\\begin{pmatrix}1+3i&0&1+2i\\\\ 1+i&0&z\\\\ 5&5i&z\\end{pmatrix}\\) לא תהיה הפיכה.\nב. מצא את כל הפתרונות של המשוואה הבאה: \\(z^{2}=|z+i|^{2}-5-i\\)."
    },
    {
        id: 63,
        source: "מבחן 04.01.2018 מועד מיוחד שאלה 4",
        topic: ["spaces"],
        difficulty: "medium",
        text: "להלן שני תתי-מרחב של \\(\\mathbb{R}^{3}\\):\n\\(U=\\text{span}\\left(\\begin{pmatrix}-1\\\\ 1\\\\ 1\\end{pmatrix},\\begin{pmatrix}3\\\\ 2\\\\ 3\\end{pmatrix}\\right)\\), \\(V=\\text{span}\\left(\\begin{pmatrix}4\\\\ 6\\\\ 5\\end{pmatrix},\\begin{pmatrix}0\\\\ 1\\\\ 1\\end{pmatrix}\\right)\\).\nא. מצא מערכת משוואות שמאפיינות את \\(U\\).\nב. מצא מערכת משוואות שמאפיינות את \\(V\\).\nג. מצא וקטור שונה מ-\\(\\vec{0}\\) ששייך גם ל-\\(U\\) וגם ל-\\(V\\)."
    },
    {
        id: 64,
        source: "מבחן 04.01.2018 מועד מיוחד שאלה 5",
        topic: ["spaces", "systems"],
        difficulty: "easy",
        text: "נתונים שלושה וקטורים ב-\\(\\mathbb{R}^{3}\\), התלויים בפרמטר \\(a\\):\n\\(v_{1}=\\begin{pmatrix}1\\\\ 2\\\\ 3\\end{pmatrix}, v_{2}=\\begin{pmatrix}0\\\\ 5\\\\ a\\end{pmatrix}, v_{3}=\\begin{pmatrix}-1\\\\ a\\\\ 0\\end{pmatrix}\\).\nעבור אילו ערכים של \\(a\\) מתקיים \\(\\text{span}(v_{1},v_{2},v_{3})=\\mathbb{R}^{3}\\), ועבור אילו ערכים של \\(a\\) זה לא מתקיים?"
    },
// --- מבחן 07.05.2024 (מועד ב') ---
    {
        id: 65,
        source: "מבחן 07.05.2024 מועד ב' שאלה 1",
        topic: ["spaces", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A=\\begin{pmatrix}1&2&3&4&5\\\\ 0&1&0&1&-1\\\\ 1&3&3&5&4\\end{pmatrix}\\).\nותהי \\(W=\\left\\{ x \\in \\mathbb{R}^5 \\mid A x = 0 \\right\\}\\) (מרחב הפתרונות של המערכת ההומוגנית).\nמצא בסיס ומימד ל-\\(W\\)."
    },
    {
        id: 66,
        source: "מבחן 07.05.2024 מועד ב' שאלה 2",
        topic: ["systems", "proofs"],
        difficulty: "medium",
        text: "תהי \\(A\\) מטריצה ריבועית מסדר \\(n\\times n\\) ומערכת משוואות \\(Ax=b\\) עם קבוצת פתרונות \\(W\\).\nקבעו לגבי כל אחת מהטענות הבאות אם היא נכונה או לא ונמקו בקצרה:\nא. אם \\(|A|=0\\) אז בהכרח \\(W\\) אינסופית.\nב. אם \\(W\\) אינסופית, אז בהכרח \\(|A|=0\\).\nג. אם \\(W \\neq \\{0\\}\\) אז בהכרח \\(|A|=0\\).\nד. אם קיים \\(0 \\neq w \\in W\\), כך ש-\\(2w \\in W\\) אז בהכרח \\(b=0\\)."
    },
    {
        id: 67,
        source: "מבחן 07.05.2024 מועד ב' שאלה 3",
        topic: ["matrices"],
        difficulty: "medium",
        text: "א. למערכת משוואות הומוגנית עם מטריצת מקדמים \\(3 \\times 3\\) נתון פתרון טריוויאלי בלבד. כמה פתרונות יש?\nב. מצא את כל הפתרונות של המשוואה: \\(BX=A\\)\nכאשר \\(B=\\begin{pmatrix}1&2&3\\\\ 4&5&6\\end{pmatrix}\\) ו-\\(A=\\begin{pmatrix}8&9\\\\ 10&11\\end{pmatrix}\\)."
    },
    {
        id: 68,
        source: "מבחן 07.05.2024 מועד ב' שאלה 4",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים הווקטורים \\(v_1, v_2, v_3, v_4\\) ב-\\(\\mathbb{R}^4\\).\nהאם הטענות הבאות נכונות?\n1. \\(\\text{span}\\{v_1\\} = \\text{span}\\{v_1, v_2\\}\\)\n2. \\(\\text{span}\\{v_1, v_2\\} \\neq \\text{span}\\{v_1, v_3, v_4\\}\\)\n3. \\(\\text{span}\\{v_1, v_3\\} = \\text{span}\\{v_1, v_2, v_3, v_4\\}\\)"
    },

    // --- מבחן 13.02.2020 (מועד א') ---
    {
        id: 69,
        source: "מבחן 13.02.2020 מועד א' שאלה 1",
        topic: ["systems", "spaces"],
        difficulty: "medium",
        text: "נתונה מערכת משוואות עם פרמטר \\(a\\):\n$$\\begin{cases} x_1 + x_2 + ax_3 = 2 \\\\ 3x_1 + 4x_2 + 2x_3 = a \\\\ 2x_1 + 3x_2 - x_3 = 1 \\end{cases}$$\nא. קבע עבור אילו ערכים של \\(a\\) למערכת יש פתרונות (יחיד או אינסוף).\nב. אם למערכת יש אינסוף פתרונות, כתוב אותם כ-span של וקטורים."
    },
    {
        id: 70,
        source: "מבחן 13.02.2020 מועד א' שאלה 2",
        topic: ["spaces", "proofs"],
        difficulty: "medium",
        text: "נתונות שתי קבוצות \\(U\\) ו-\\(V\\):\n\\(U\\) מוגדר ע\"י משוואות ב-\\(\\mathbb{R}^4\\).\n\\(V\\) מוגדר ע\"י וקטור פרמטרי (Span) ב-\\(\\mathbb{R}^4\\).\nא. האם \\(U, V\\) תתי מרחבים? (הוכח).\nב. האם \\(U \\subseteq V\\)?\nג. האם \\(V \\subseteq U\\)?\nד. האם \\(U = V\\)?"
    },
    {
        id: 71,
        source: "מבחן 13.02.2020 מועד א' שאלה 3",
        topic: ["eigen"],
        difficulty: "medium",
        text: "נתונה המטריצה \\(A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 2 & a & 0 \\\\ 3 & a & a \\end{pmatrix}\\).\nעבור אלו ערכי \\(a\\) המטריצה לכסינה?\nללכסן אותה עבור \\(a=0\\)."
    },
    {
        id: 72,
        source: "מבחן 13.02.2020 מועד א' שאלה 4",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון תת-מרחב \\(U = \\{(x,y,z) \\mid x+y+z=0, kx-y-z=0\\}\\).\nעבור אילו ערכים של \\(k\\) מתקיים \\(\\dim U = 0, 1, 2, 3\\)?"
    },
    {
        id: 73,
        source: "מבחן 13.02.2020 מועד א' שאלה 5",
        topic: ["complex"],
        difficulty: "easy",
        text: "פתור את המערכת המרוכבת:\n$$\\begin{cases} (1+i)x_1 + x_2 = 1 \\\\ 2x_1 + (1-i)x_2 = 1-2i \\end{cases}$$"
    },
    {
        id: 74,
        source: "מבחן 13.02.2020 מועד א' שאלה 6",
        topic: ["matrices", "systems"],
        difficulty: "hard",
        text: "מצא לאילו ערכי \\(k\\) הדטרמיננטה של המטריצה \\(\\begin{pmatrix} k & 1 & 1 & 0 \\\\ 0 & k & 1 & 1 \\\\ 1 & 0 & k & 1 \\\\ 1 & 1 & 0 & -2 \\end{pmatrix}\\) שווה לאפס.\nמצא עבור אילו ערכים של \\(k\\) יש למערכת נתונה פתרון יחיד עבורו \\(x_3=1\\)."
    },
    {
        id: 75,
        source: "מבחן 13.02.2020 מועד א' שאלה 7",
        topic: ["matrices"],
        difficulty: "medium",
        text: "נתונות מטריצות \\(A, C\\).\nהאם יש ערך \\(k\\) עבורו \\(A\\) סינגולרית (לא הפיכה)?\nנתון \\(A \\cdot B = C\\). הבע את האיבר \\(b_{2,2}\\) של \\(B\\) באמצעות \\(k\\)."
    },
    {
        id: 76,
        source: "מבחן 13.02.2020 מועד א' שאלה 8",
        topic: ["spaces", "proofs"],
        difficulty: "medium",
        text: "האם עמודות המטריצה \\(A\\) פורשות את \\(\\mathbb{R}^3\\)?\nהוכח או הפרך: אם \\(\\{v_1, v_2, v_3\\}\\) פורשים את \\(\\mathbb{R}^3\\), האם \\(\\{v_1, v_1+v_2, v_1+v_2+v_3\\}\\) גם פורשים?"
    },

    // --- מבחן 13.08.2025 (מועד ב') ---
    {
        id: 77,
        source: "מבחן 13.08.2025 מועד ב' שאלה 1",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון תת-המרחב \\(W = \\{(x,y,z)^T \\in \\mathbb{R}^3 \\mid x+z=0, kx+3z=0\\}\\).\nנתון \\(\\dim(W)=2\\).\nא. מצאו את \\(k\\).\nב. מצאו בסיס ל-\\(W\\)."
    },
    {
        id: 78,
        source: "מבחן 13.08.2025 מועד ב' שאלה 2",
        topic: ["matrices"],
        difficulty: "medium",
        text: "פתרו את המשוואה:\n$$\\det \\begin{pmatrix} a & 0 & 1 & a \\\\ 0 & a & a & 1 \\\\ 1 & a & a & 0 \\\\ a & 1 & 0 & a \\end{pmatrix} = 0$$"
    },
    {
        id: 79,
        source: "מבחן 13.08.2025 מועד ב' שאלה 3",
        topic: ["transformations", "proofs"],
        difficulty: "hard",
        text: "נתון: \\(u_1, u_2, u_3\\) בסיס ל-\\(\\mathbb{R}^3\\).\nהוכיחו שקיימת מטריצה \\(A\\) כך ש: \\(Au_1 + Au_2 = Au_3\\) וגם \\(Aw \\neq 0\\) לכל \\(w \\neq 0\\)."
    },
    {
        id: 80,
        source: "מבחן 13.08.2025 מועד ב' שאלה 4",
        topic: ["matrices"],
        difficulty: "medium",
        text: "נתון \\(B = \\begin{pmatrix} 1 & a & a \\\\ a & 1 & 1 \\\\ 1 & -1 & -a \\end{pmatrix}\\). נתון \\(|B| = a^2-1\\).\nהמטריצה \\(B\\) הפיכה. מצאו את \\(B^{-1}\\) (או שאלה קשורה להפיכות)."
    },
    {
        id: 81,
        source: "מבחן 13.08.2025 מועד ב' שאלה 5",
        topic: ["spaces", "proofs"],
        difficulty: "medium",
        text: "נתון ש-\\(u, w\\) בת\"ל. נתון \\(\\text{span}\\{p, q\\} = \\text{span}\\{u, w\\}\\).\nהוכיחו ש-\\(p, q\\) בלתי תלויים לינארית."
    },

    // --- מבחן 16.01.2019 (מועד א') ---
    {
        id: 82,
        source: "מבחן 16.01.2019 מועד א' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "חקרו את המערכת עם הפרמטר \\(c\\):\n$$\\begin{cases} x_1 + x_2 - x_3 = 1 \\\\ x_1 + cx_2 + 3x_3 = 2 \\\\ 2x_1 + 3x_2 + cx_3 = 3 \\end{cases}$$\nמצאו ערכי \\(c\\) לפתרון יחיד, אינסוף פתרונות, ואף פתרון."
    },
    {
        id: 83,
        source: "מבחן 16.01.2019 מועד א' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון \\(U\\) (מוגדר ע\"י וקטור כללי).\nא. מצא בסיס ומימד ל-\\(U\\).\nב. האם \\(U\\) פורש את \\(\\mathbb{R}^4\\)?\nג. מצא וקטור יחידה אורתוגונלי ל-\\(U\\)."
    },
    {
        id: 84,
        source: "מבחן 16.01.2019 מועד א' שאלה 3",
        topic: ["complex"],
        difficulty: "easy",
        text: "פתור את המשוואה המרוכבת: \\(\\frac{z-3}{iz+1} = 2\\)."
    },
    {
        id: 85,
        source: "מבחן 16.01.2019 מועד א' שאלה 4",
        topic: ["eigen"],
        difficulty: "medium",
        text: "נתון שלמטריצה \\(A = \\begin{pmatrix} 3 & x \\\\ 5 & y \\end{pmatrix}\\) יש וקטורים עצמיים \\(\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}\\) עם אותו ערך עצמי. מצא את \\(x, y\\)."
    },
    {
        id: 86,
        source: "מבחן 16.01.2019 מועד א' שאלה 5",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתון \\(U = \\text{span}\\{(1,2,1,5), (1,0,-1,1), (6,4,-2,14)\\}\\).\nא. מצא בסיס ומימד ל-\\(U\\).\nב. האם \\((4,6,8,10) \\in U\\)?\nג. מצא \\(k\\) כך ש-\\( (k-1, k, k+1, k-1) \\in U\\)."
    },
    {
        id: 87,
        source: "מבחן 16.01.2019 מועד א' שאלה 6",
        topic: ["systems", "proofs"],
        difficulty: "hard",
        text: "מטריצה \\(A_{5 \\times 6}\\). ידוע ש-\\(u\\) הוא פתרון למערכת ההומוגנית \\(Ax=0\\), ו-\\(v\\) וקטור בת\"ל ב-\\(u\\). האם ייתכן שאין פתרון למערכת \\(Ax=b\\)?"
    },
    {
        id: 88,
        source: "מבחן 16.01.2019 מועד א' שאלה 7",
        topic: ["eigen", "proofs"],
        difficulty: "medium",
        text: "א. הראה ש-\\(\\lambda^{-1}\\) ע\"ע של \\(A^{-1}\\) אם ורק אם \\(\\lambda\\) ע\"ע של \\(A\\).\nב. הראה שאם \\(\\lambda\\) ע\"ע של \\(A\\), אז \\(\\lambda^2\\) ע\"ע של \\(A^2\\). וקשר ללכסון."
    },
    {
        id: 89,
        source: "מבחן 16.01.2019 מועד א' שאלה 8",
        topic: ["spaces"],
        difficulty: "easy",
        text: "נתון \\(U = \\text{span}\\{(1,2,3)\\}\\) ו-\\(W\\) מישור \\(x+y-z=0\\). מה הקשר ביניהם (\\(U \\subset W\\), \\(W \\subset U\\), אורתוגונליות וכו')?"
    },

    // --- מבחן 17.07.2018 (מועד ב') ---
    {
        id: 90,
        source: "מבחן 17.07.2018 מועד ב' שאלה 1",
        topic: ["systems"],
        difficulty: "medium",
        text: "חקור את המערכת עם הפרמטר \\(a\\):\n$$\\begin{cases} ax + ay + (1-a)z = 4a \\\\ 2x + 2y - 2z = 8 \\\\ x + (a+1)y + z = 6 \\end{cases}$$"
    },
    {
        id: 91,
        source: "מבחן 17.07.2018 מועד ב' שאלה 2",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים \\(U\\) (span) ו-\\(W\\) (משוואות) ב-\\(\\mathbb{R}^4\\).\nא. בסיס וממד ל-\\(U\\).\nב. בסיס וממד ל-\\(W\\).\nג. מצא \\(c\\) כך ש-\\( (c,1,1,0) \\in W\\).\nד. בסיס וממד ל-\\(U+W\\)."
    },
    {
        id: 92,
        source: "מבחן 17.07.2018 מועד ב' שאלה 3",
        topic: ["matrices"],
        difficulty: "medium",
        text: "מטריצה \\(A\\) עם \\(k\\). מצא \\(k\\) כך שהמטריצה הפיכה ו-\\(\\det(A) = 3-3k^2\\)."
    },
    {
        id: 93,
        source: "מבחן 17.07.2018 מועד ב' שאלה 4",
        topic: ["complex"],
        difficulty: "easy",
        text: "פתור: \\(2z = |z+i| + i\\)."
    },
    {
        id: 94,
        source: "מבחן 17.07.2018 מועד ב' שאלה 5",
        topic: ["spaces"],
        difficulty: "medium",
        text: "במרחב הפולינומים \\(P_3[x]\\), תתי-מרחבים \\(U\\) (\\(p(0)=0\\)) ו-\\(W\\) (\\(p''(x)=0\\)). מצא בסיס וממד."
    },
    {
        id: 95,
        source: "מבחן 17.07.2018 מועד ב' שאלה 6",
        topic: ["proofs", "spaces"],
        difficulty: "medium",
        text: "נתונה קבוצת וקטורים \\(\\{u_i\\}\\) בת\"ל. נתונים וקטורים \\(v_i\\) המוגדרים כצירופים לינאריים של ה-\\(u_i\\) עם פרמטר \\(k\\). מצא לאילו ערכי \\(k\\) הוקטורים \\(v_i\\) תלויים לינארית."
    },
    {
        id: 96,
        source: "מבחן 17.07.2018 מועד ב' שאלה 7",
        topic: ["spaces"],
        difficulty: "hard",
        text: "נתונים על \\(U\\) ו-\\(W\\) (חיתוך 0, וקטורים ב-\\(W\\), מימד \\(U\\)). מצא \\(a\\) כך ש-\\(U+W=\\mathbb{R}^4\\)."
    },
    {
        id: 97,
        source: "מבחן 17.07.2018 מועד ב' שאלה 8",
        topic: ["proofs", "spaces"],
        difficulty: "easy",
        text: "הוכח: \\(\\text{span}\\{u, w\\} = \\text{span}\\{u+w, w\\}\\)."
    },
// --- מבחן 28.05.2024 (מועד ג') ---
    {
        id: 98,
        source: "מבחן 28.05.2024 מועד ג' שאלה 1",
        topic: ["matrices", "spaces"],
        difficulty: "medium",
        text: "נתונה המטריצה $$A=\\begin{pmatrix}1&1&2&0&2\\\\ 2&1&1&1&6\\\\ 2&2&4&1&5\\end{pmatrix}$$.\nנגדיר את המרחב \\(U\\) כמרחב הפתרונות של המערכת ההומוגנית \\(Ax=0\\).\nנתון גם ש-\\(U\\) הוא מרחב הפתרונות של \\(Bx=0\\) כאשר \\(B\\) היא מטריצה מדורגת קנונית.\nא. מצאו את המטריצה \\(B\\).\nב. מצאו בסיס ל-\\(U\\)."
    },
    {
        id: 99,
        source: "מבחן 28.05.2024 מועד ג' שאלה 2",
        topic: ["systems"],
        difficulty: "medium",
        text: "תהי המטריצה המורחבת של מערכת משוואות לינאריות:\n$$\\left(\\begin{array}{ccc|c} 1 & a & 1 & 2+a \\\\ a & a^2 & 1 & 5 \\\\ a & 3a & 1 & 5 \\end{array}\\right)$$\nמצאו לאלו ערכי \\(a\\) למערכת זו יש פתרון יחיד, אין פתרון או אינסוף פתרונות."
    },
    {
        id: 100,
        source: "מבחן 28.05.2024 מועד ג' שאלה 3",
        topic: ["spaces"],
        difficulty: "medium",
        text: "נתונים שני תתי מרחבים של \\(\\mathbb{R}^3\\):\n\\(U = \\{(a,b,c) \\mid a-b-2c=0\\}\\)\n\\(W = \\text{span}\\{(3,1,1), (1,-1,1)\\}\\)\nהאם \\(U=W\\)? נמקו היטב."
    },
    {
        id: 101,
        source: "מבחן 28.05.2024 מועד ג' שאלה 4",
        topic: ["systems", "matrices"],
        difficulty: "hard",
        text: "נתון שלמערכת $$\\begin{pmatrix}a&b&c\\\\ d&e&f\\\\ p&q&r\\end{pmatrix}\\begin{pmatrix}x_1\\\\ x_2\\\\ x_3\\end{pmatrix}=\\begin{pmatrix}1\\\\ 2\\\\ 3\\end{pmatrix}$$ אין פתרון.\nבאלו תנאים על הפרמטרים, למערכת ההומוגנית הבאה יהיה פתרון יחיד?\n$$\\begin{pmatrix}a&b&b\\\\ d&e&f\\\\ p&q&r\\end{pmatrix}\\begin{pmatrix}x_1\\\\ x_2\\\\ x_3\\end{pmatrix}=\\begin{pmatrix}0\\\\ 0\\\\ 0\\end{pmatrix}$$\n(שים לב: במטריצה השנייה האיבר ב- (1,3) הוא \\(b\\))."
    },
    {
        id: 102,
        source: "מבחן 28.05.2024 מועד ג' שאלה 5",
        topic: ["proofs", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A\\) מטריצה \\(n \\times n\\). נתון \\(A^t = cA\\) עבור מספר \\(c\\) מסוים.\nהראו שהמטריצה \\(A\\) היא מטריצה סימטרית או אנטי-סימטרית."
    },

    // --- מבחן 24.06.2025 (מועד א') ---
    {
        id: 103,
        source: "מבחן 24.06.2025 מועד א' שאלה 1 (חלק א')",
        topic: ["spaces", "proofs"],
        difficulty: "medium",
        text: "א. עבור כל ערך של \\(a\\), קבעו האם הוקטור \\(\\begin{pmatrix}2a-1\\\\ a^2\\\\ a^2+2\\end{pmatrix}\\) נמצא ב-\n\\(\\text{span}\\left\\{\\begin{pmatrix}a\\\\ 1\\\\ ?\\end{pmatrix}, \\begin{pmatrix}1\\\\ a\\\\ a\\end{pmatrix}, \\begin{pmatrix}1\\\\ 1\\\\ -1\\end{pmatrix}\\right\\}\\)\n(הערה: בשאלה המקורית יש אי-התאמה במימדים).\nב. תהי \\(A=\\begin{pmatrix}1&2&3&-1&-6\\\\ 0&0&6&4&8\\\\ 0&0&0&9&-7\\end{pmatrix}\\). הוכיחו ששורות המטריצה \\(A\\) בלתי תלויות לינארית."
    },
    {
        id: 104,
        source: "מבחן 24.06.2025 מועד א' שאלה 1 (חלק ב')",
        topic: ["proofs", "matrices"],
        difficulty: "medium",
        text: "נתון ש-\\(A, B\\) הן מטריצות סימטריות \\(n \\times n\\). נתון גם שהמטריצה \\(AB\\) סימטרית.\nהוכיחו: \\(AB=BA\\)."
    },
    {
        id: 105,
        source: "מבחן 24.06.2025 מועד א' שאלה 2 (חלק ב')",
        topic: ["spaces", "matrices"],
        difficulty: "medium",
        text: "תהי \\(A\\) מטריצה \\(2 \\times 2\\), נתון \\(A \\neq 0\\).\nנסמן \\(W = \\{x \\in \\mathbb{R}^2 \mid Ax=0\\}\\).\nנתון \\(\\begin{pmatrix}1\\\\ 0\\end{pmatrix} \\in W\\). האם \\(\\begin{pmatrix}0\\\\ 1\\end{pmatrix} \\in W\\)? נמקו."
    },
    {
        id: 106,
        source: "מבחן 24.06.2025 מועד א' שאלה 3 (חלק ב')",
        topic: ["matrices"],
        difficulty: "hard",
        text: "\\(A, B\\) מטריצות ריבועיות מאותו סדר.\nנתון \\(|A|=3\\) ו-\\(|2A|=24\\).\nנתון הקשר: \\(2AB^2A^t + 3B^{-1}A = 0\\).\nחשב את \\(|B|\\)."
    }
];
