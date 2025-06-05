// Simple script to copy icon and package.json to dist (cross-platform)

const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
    if (!fs.existsSync(src)) {
        console.error(`Source file not found: ${src}`);
        process.exit(1);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
}

// Đổi đường dẫn này cho đúng file icon của bạn
copyFile('src/assets/apple-touch-icon.png', 'dist/nodes/dremio.png');
copyFile('package.clound.json', 'dist/package.json');
copyFile('README.md', 'dist/README.md');