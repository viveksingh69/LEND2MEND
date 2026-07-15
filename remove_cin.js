const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove from topbar
    content = content.replaceAll('<div class="left"><span>CIN: U65993WB1996PTC081112</span><span>ROC Kolkata</span></div>', '<div class="left"></div>');
    
    // Remove from footer
    content = content.replaceAll('<span>CIN U65993WB1996PTC081112 &nbsp;·&nbsp; ROC Kolkata</span>', '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const filePath = path.join(currentPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'archive' && file !== 'images' && file !== 'css' && file !== 'js') {
                walkDir(filePath);
            }
        } else if (filePath.endsWith('.html')) {
            processFile(filePath);
        }
    }
}

walkDir(dir);
console.log('All files updated.');
