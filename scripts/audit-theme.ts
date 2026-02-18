
import fs from 'fs';
import path from 'path';

// CONFIG
const SEARCH_DIRS = ['app', 'components'];
const IGNORE_FILES = ['app/globals.css', 'lib/theme.ts', 'tailwind.config.ts', 'tailwind.config.js'];
const VIOLATIONS = [
    { id: 'text-white', regex: /text-white(?![/-])/g, severity: 'High', message: 'Use text-foreground or text-primary-foreground' },
    { id: 'bg-black', regex: /bg-black(?![/-])/g, severity: 'High', message: 'Use bg-background or bg-foreground' },
    { id: 'hex-color', regex: /#[0-9a-fA-F]{3,6}/g, severity: 'Medium', message: 'Use semantic theme variable (e.g. bg-muted)' },
    { id: 'text-gray', regex: /text-gray-[0-9]{3}/g, severity: 'Low', message: 'Use text-muted-foreground' },
    { id: 'bg-gray', regex: /bg-gray-[0-9]{3}/g, severity: 'Low', message: 'Use bg-muted or bg-secondary' },
];

interface Violation {
    file: string;
    line: number;
    violationId: string;
    match: string;
    message: string;
    severity: string;
}

function scanFile(filePath: string, violations: Violation[]) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        VIOLATIONS.forEach(v => {
            let match;
            // Reset regex state
            const regex = new RegExp(v.regex);
            while ((match = regex.exec(line)) !== null) {
                // Ignore imports
                if (line.trim().startsWith('import') || line.trim().startsWith('export')) return;

                violations.push({
                    file: filePath,
                    line: index + 1,
                    violationId: v.id,
                    match: match[0],
                    message: v.message,
                    severity: v.severity
                });
            }
        });
    });
}

function walkDir(dir: string, violations: Violation[]) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                walkDir(filePath, violations);
            }
        } else {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
                // Check ignore list
                if (IGNORE_FILES.some(ignored => filePath.includes(ignored))) continue;
                scanFile(filePath, violations);
            }
        }
    }
}

function runAudit() {
    console.log('🚀 Starting Theme & Typography Audit...');
    const violations: Violation[] = [];

    SEARCH_DIRS.forEach(dir => {
        if (fs.existsSync(dir)) {
            walkDir(dir, violations);
        }
    });

    console.log(`\n🔍 Found ${violations.length} violations.\n`);

    // Group by severity
    const high = violations.filter(v => v.severity === 'High');
    const medium = violations.filter(v => v.severity === 'Medium');
    const low = violations.filter(v => v.severity === 'Low');

    console.log(`🔴 HIGH SEVERITY (${high.length}) - Immediate Action Required`);
    high.forEach(v => console.log(`  [${v.file}:${v.line}] ${v.match} -> ${v.message}`));

    console.log(`\n🟡 MEDIUM SEVERITY (${medium.length}) - Verify Context`);
    if (medium.length > 20) {
        console.log(`  (Showing first 20 of ${medium.length})`);
        medium.slice(0, 20).forEach(v => console.log(`  [${v.file}:${v.line}] ${v.match} -> ${v.message}`));
    } else {
        medium.forEach(v => console.log(`  [${v.file}:${v.line}] ${v.match} -> ${v.message}`));
    }

    console.log(`\n🔵 LOW SEVERITY (${low.length}) - Cleanup when possible`);
    if (low.length > 10) {
        console.log(`  (Showing first 10 of ${low.length})`);
        low.slice(0, 10).forEach(v => console.log(`  [${v.file}:${v.line}] ${v.match} -> ${v.message}`));
    } else {
        low.forEach(v => console.log(`  [${v.file}:${v.line}] ${v.match} -> ${v.message}`));
    }

    if (violations.length > 0) {
        process.exit(1);
    } else {
        console.log('\n✅ No violations found. System is strictly compliant.');
    }
}

runAudit();
