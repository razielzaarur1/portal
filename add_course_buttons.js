const fs = require('fs');
const path = require('path');

// 1. Read courses.json to get name -> id
const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'grade_calc', 'courses.json'), 'utf8'));
const nameToIdMap = {};
coursesData.forEach(c => {
    nameToIdMap[c.name.trim()] = c.id;
});

// 2. Parse index.html to get html_path -> name
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const regex = /<a href="([^"]+)"[^>]*>.*?<h3>(.*?)<\/h3>/gs;
let match;
const pathToIdMap = {};

while ((match = regex.exec(indexHtml)) !== null) {
    const filePath = match[1]; // e.g. Year_1/Semester_A/Infi_1/infi1_main.html
    const courseName = match[2].trim(); // e.g. אינפי 1
    
    // We need to match courseName from index.html to courses.json
    // They might not match perfectly.
    let matchedId = nameToIdMap[courseName];
    if (!matchedId) {
        if (courseName === 'אינפי 1') matchedId = 2;
        else if (courseName === 'אינפי 2') matchedId = 6;
        else if (courseName === 'מד"ר') matchedId = 11;
        else {
            for (let name in nameToIdMap) {
                if (name.includes(courseName) || courseName.includes(name)) {
                    matchedId = nameToIdMap[name];
                    break;
                }
            }
        }
    }
    
    if (matchedId) {
        pathToIdMap[filePath] = matchedId;
    } else {
        console.warn(`Could not find course ID for: ${courseName}`);
    }
}

// 3. Process each HTML file
for (let relPath in pathToIdMap) {
    const courseId = pathToIdMap[relPath];
    const absPath = path.join(__dirname, relPath);
    
    if (!fs.existsSync(absPath)) {
        console.log(`File not found: ${absPath}`);
        continue;
    }
    
    let content = fs.readFileSync(absPath, 'utf8');
    
    // Check if already injected
    if (content.includes('id="course-drive-iframe"')) {
        console.log(`Already processed: ${relPath}`);
        continue;
    }
    
    // Change flex-direction: column to row
    content = content.replace(/flex-direction:\s*column;/g, 'flex-direction: row; flex-wrap: wrap; justify-content: center;');
    
    // Widen options container max-width to allow horizontal cards
    content = content.replace(/max-width:\s*400px;/g, 'max-width: 900px;');
    
    // Find the end of options-container
    const optionsEndIndex = content.indexOf('</div>', content.lastIndexOf('</a>'));
    if (optionsEndIndex !== -1) {
        // calculate depth to root for the iframe src
        const depth = relPath.split('/').length - 1;
        const relativePrefix = '../'.repeat(depth);
        
        const iframeHtml = `
    </div>

    <!-- מוזרק אוטומטית: חלונית הדרייב -->
    <div style="width: 100%; max-width: 1000px; margin-top: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e40af; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-folder-open"></i> קבצי הקורס
        </div>
        <iframe id="course-drive-iframe" src="${relativePrefix}drive.html?courseId=${courseId}&embed=true" style="width: 100%; height: 600px; border: none;"></iframe>
    `;
        
        // We replace the last </div> of options-container with the new html
        content = content.substring(0, optionsEndIndex) + iframeHtml + content.substring(optionsEndIndex + 6);
        
        fs.writeFileSync(absPath, content);
        console.log(`Successfully updated: ${relPath} (Course ID: ${courseId})`);
    } else {
        console.warn(`Could not find insertion point in: ${relPath}`);
    }
}
