const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace header logo (with subtitle)
    const headerRegex = /<div class="brand-mark">S<\/div>\s*<div class="brand-text">\s*<div class="name">Saini Engg\. &amp; Finance<\/div>\s*<div class="sub">Pvt\. Ltd\. &nbsp;·&nbsp; Trusted Since 1996<\/div>\s*<\/div>/g;
    const headerReplacement = '<img src="images/logo.png" alt="Sainifintech Logo" style="height: 52px; width: auto; object-fit: contain;">';
    content = content.replace(headerRegex, headerReplacement);
    
    // Replace footer logo (without subtitle)
    const footerRegex = /<div class="brand-mark">S<\/div>\s*<div class="brand-text">\s*<div class="name">Saini Engg\. &amp; Finance<\/div>\s*<\/div>/g;
    const footerReplacement = '<img src="images/logo.png" alt="Sainifintech Logo" style="height: 40px; width: auto; object-fit: contain;">';
    content = content.replace(footerRegex, footerReplacement);

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
