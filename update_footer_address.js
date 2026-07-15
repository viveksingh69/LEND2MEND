const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    const searchString = '<li><a href="contact.html">Kolkata, West Bengal</a></li>';
    const replaceString = '<li><a href="contact.html" style="line-height: 1.4; display: inline-block;">2/5, Sarat Bose Road, Sukhsagar Housing Society,<br>Block E-2, 2nd Floor, Flat 2B/1, L.R.Sarani,<br>Kolkata, West Bengal 700020</a></li>';
    
    if (content.includes(searchString)) {
        content = content.replaceAll(searchString, replaceString);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated footer address in ${filePath}`);
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
console.log('Done.');
