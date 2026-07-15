const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove standalone Careers link from navigation (near Policies)
    // Looking for exactly `<a href="careers.html">Careers</a>` with whitespace around it
    const careersNavRegex = /[ \t]*<a href="careers\.html">Careers<\/a>\n?/g;
    content = content.replace(careersNavRegex, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(dir, file));
    }
});
