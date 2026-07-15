const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace title text
    content = content.replaceAll('Saini Engg. &amp; Finance Pvt. Ltd.', 'Sainifintech');
    content = content.replaceAll('Saini Engg. & Finance Pvt. Ltd.', 'Sainifintech');
    
    // Add favicon if not present
    const faviconTag = '<link rel="icon" type="image/png" href="images/favicon.png">';
    if (!content.includes('rel="icon"')) {
        content = content.replace('</head>', `  ${faviconTag}\n</head>`);
    }

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

// First, copy the favicon
const srcFavicon = 'C:\\Users\\nhhfdl0030\\.gemini\\antigravity-ide\\brain\\8a062d7b-ecd3-4fce-916a-1e732c6df669\\media__1784104253073.png';
const destFavicon = 'd:\\SAINI\\images\\favicon.png';
fs.copyFileSync(srcFavicon, destFavicon);
console.log('Favicon copied.');

// Then process files
walkDir(dir);
console.log('All files updated.');
