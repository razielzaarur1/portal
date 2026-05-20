const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (f.endsWith('_main.html')) {
                callback(dirPath);
            }
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // We will use regex to find the notebook button block
    // It looks like:
    // <a href="..." target="_blank" class="option-btn opt-notebook">
    //     <div class="opt-text" style="flex:1">
    //         <h4>מחברת חכמה – NotebookLM</h4>
    //         <p>עוזר AI מבוסס חומר הקורס</p>
    //     </div>
    //     <div class="opt-icon"><i class="fas fa-sparkles"></i></div>
    // </a>

    // Find the A tag
    const notebookRegex = /<a href="([^"]*notebooklm[^"]*)"[^>]*class="option-btn opt-notebook"[^>]*>([\s\S]*?)<\/a>/gi;
    
    content = content.replace(notebookRegex, (match, href, innerHtml) => {
        let isConnected = href !== 'https://notebooklm.google.com' && href !== 'https://notebooklm.google.com/';
        
        // Replace icon with image
        let newInnerHtml = innerHtml.replace(/<i class="fas fa-sparkles"><\/i>/g, '<img src="https://www.gstatic.com/images/branding/product/1x/notebooklm_48dp.png" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" alt="NotebookLM">');
        
        // Also if they used a different icon in some places
        newInnerHtml = newInnerHtml.replace(/<i class="[^"]*fa-sparkles[^"]*"><\/i>/g, '<img src="https://www.gstatic.com/images/branding/product/1x/notebooklm_48dp.png" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" alt="NotebookLM">');

        if (!isConnected) {
            // Change title
            newInnerHtml = newInnerHtml.replace(/<h4>.*?<\/h4>/, '<h4>מחברת חכמה – טרם חובר</h4>');
            newInnerHtml = newInnerHtml.replace(/<p>.*?<\/p>/, '<p>המחברת תעודכן בהמשך הסמסטר</p>');
            
            // Return modified tag with disabled styles
            return `<a href="#" onclick="return false;" class="option-btn opt-notebook" style="opacity: 0.6; cursor: not-allowed;">${newInnerHtml}</a>`;
        } else {
            // Reconstruct tag
            return `<a href="${href}" target="_blank" class="option-btn opt-notebook">${newInnerHtml}</a>`;
        }
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

// Start processing from Year_1 and Year_2
['Year_1'].forEach(year => { // Add Year_2 if it exists
    const fullPath = path.join(__dirname, year);
    if (fs.existsSync(fullPath)) {
        walkDir(fullPath, processFile);
    }
});
