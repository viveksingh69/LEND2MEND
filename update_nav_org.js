const fs = require('fs');
const path = require('path');

const directoryPath = 'd:\\SAINI';
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

const stringToFind = `            <a href="management.html" role="menuitem">
              <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span>
              Management
            </a>`;

const replacementString = `            <a href="management.html" role="menuitem">
              <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span>
              Management
            </a>
            <a href="background.html" role="menuitem">
              <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></span>
              Our background
            </a>
            <a href="core-values.html" role="menuitem">
              <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
              Core values
            </a>`;

files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Some files might have slightly different indentation, so let's try a regex approach if exact match fails
    if (content.includes(stringToFind)) {
        content = content.replace(stringToFind, replacementString);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} via exact match`);
    } else {
        // Try regex
        const regex = /<a href="management\.html" role="menuitem">[\s\S]*?Management\s*<\/a>/;
        if (regex.test(content)) {
            const match = content.match(regex)[0];
            
            // Re-construct the replacement string using the indentation of the match
            const indentationMatch = content.match(/([ \t]+)<a href="management\.html"/);
            const indent = indentationMatch ? indentationMatch[1] : '            ';
            
            const regexReplacement = `${match}
${indent}<a href="background.html" role="menuitem">
${indent}  <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></span>
${indent}  Our background
${indent}</a>
${indent}<a href="core-values.html" role="menuitem">
${indent}  <span class="drop-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
${indent}  Core values
${indent}</a>`;
            
            content = content.replace(regex, regexReplacement);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file} via regex match`);
        } else {
            console.log(`Could not find management.html link in ${file}`);
        }
    }
});
