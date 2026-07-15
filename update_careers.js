const fs = require('fs');
const path = require('path');

const dir = 'd:\\SAINI';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove Careers from Organization dropdown
    const navCareersRegex = /\s*<a href="careers\.html" role="menuitem">[\s\S]*?Careers\s*<\/a>/;
    content = content.replace(navCareersRegex, '');
    
    // Add Careers before Contact Us in the nav
    const contactUsRegex = /(<a href="contact\.html">Contact Us<\/a>)/;
    if (content.match(contactUsRegex) && original.match(navCareersRegex)) {
        content = content.replace(contactUsRegex, '<a href="careers.html">Careers</a>\n        $1');
    }

    // Remove from Footer Organization
    const footerOrgRegex = /\s*<li><a href="careers\.html">Careers<\/a><\/li>/;
    content = content.replace(footerOrgRegex, '');

    // Add to Footer near Contact
    const footerContactRegex = /(<h5>Contact<\/h5>\s*<ul>)/;
    if (content.match(footerContactRegex) && original.match(footerOrgRegex)) {
        content = content.replace(footerContactRegex, '$1\n            <li><a href="careers.html">Careers</a></li>');
    }

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
