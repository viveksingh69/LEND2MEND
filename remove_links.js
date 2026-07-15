const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove Home
    const homeRegex = /[ \t]*<a href="index\.html">Home<\/a>\n?/g;
    content = content.replace(homeRegex, '');
    
    // Remove Contact Us
    const contactUsRegex = /[ \t]*<a href="contact\.html">Contact Us<\/a>\n?/g;
    content = content.replace(contactUsRegex, '');

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
