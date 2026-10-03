// Run:  node check-images.js
// Checks that every image used in script.js really exists in the "images" folder
// (GitHub Pages is CASE-SENSITIVE: "Pizza.jpg" and "pizza.jpg" are different files).

const fs = require("fs");
const path = require("path");

const code = fs.readFileSync("script.js", "utf8");
const used = [...code.matchAll(/image:\s*"(images\/[^"]+)"/g)].map(m => m[1]);

if (!fs.existsSync("images")) {
    console.log('❌ No "images" folder next to script.js. Create it and put your food photos inside.');
    process.exit(1);
}

const files = fs.readdirSync("images");
const lower = new Map(files.map(f => [f.toLowerCase(), f]));
let problems = 0;

for (const p of used) {
    const name = path.basename(p);
    if (files.includes(name)) continue;
    problems++;
    const near = lower.get(name.toLowerCase());
    if (near) {
        console.log(`⚠️  ${p}  ->  file is named "${near}" (upper/lower-case mismatch)`);
    } else {
        const base = name.replace(/\.[^.]+$/, "").toLowerCase();
        const guess = files.filter(f => f.toLowerCase().startsWith(base.slice(0, 5)));
        console.log(`❌ ${p}  ->  not found${guess.length ? "  (similar: " + guess.join(", ") + ")" : ""}`);
    }
}

console.log(problems === 0
    ? `✅ All ${used.length} images found.`
    : `\n${problems} of ${used.length} images need fixing: rename the file OR change the name in script.js so they match exactly.`);
