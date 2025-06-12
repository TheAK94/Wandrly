const fs = require('fs');
const path = require('path');

const projectRoot = './'; // adjust if needed

function findWrongCasedImports(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            findWrongCasedImports(fullPath); // recurse into subdirectories
        } else if (file.name.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const regex = /require\s*\(\s*['"].*Models\/.*['"]\s*\)/i;

            if (regex.test(content)) {
                console.log(`❌ Incorrect casing found in: ${fullPath}`);
            }
        }
    });
}

findWrongCasedImports(projectRoot);
