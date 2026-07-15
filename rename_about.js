const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

// 1. Rename the file
const oldPath = path.join(dir, 'about.html');
const newPath = path.join(dir, 'corporate-identity.html');
if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('Renamed about.html to corporate-identity.html');
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace about.html with corporate-identity.html
    content = content.replace(/about\.html/g, 'corporate-identity.html');
    
    // Replace visible text
    content = content.replace(/>About Us</g, '>Corporate Identity<');
    content = content.replace(/>About us</g, '>Corporate Identity<');
    content = content.replace(/>About</g, '>Corporate Identity<');
    
    // Replace title
    content = content.replace(/<title>About Us/g, '<title>Corporate Identity');

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
