#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

console.log('🔒 Secure Backup Process Starting...');

// Create secure backup directory
const backupDir = `backup-secure-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}`;
const backupPath = path.join('..', backupDir);

try {
  // Create backup directory
  fs.mkdirSync(backupPath, { recursive: true });
  
  // Copy project excluding sensitive files
  console.log('📦 Creating secure backup...');
  execSync(`rsync -av --exclude='.env*' --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.log' --exclude='*.backup' . ${backupPath}/`, { stdio: 'inherit' });
  
  // Create backup info
  const backupInfo = {
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
    commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    security: 'credentials-excluded',
    note: 'Secure backup without sensitive data'
  };
  
  fs.writeFileSync(path.join(backupPath, 'backup-info.json'), JSON.stringify(backupInfo, null, 2));
  
  console.log(`✅ Secure backup created: ${backupDir}`);
  console.log('🔐 No sensitive data included');
  
  // Remove old insecure backups
  const parentDir = path.dirname(process.cwd());
  const files = fs.readdirSync(parentDir);
  const oldBackups = files.filter(f => f.startsWith('backup-') && f !== backupDir);
  
  if (oldBackups.length > 0) {
    console.log('🧹 Removing old potentially insecure backups...');
    oldBackups.forEach(backup => {
      const oldPath = path.join(parentDir, backup);
      if (fs.existsSync(oldPath)) {
        execSync(`rm -rf "${oldPath}"`, { stdio: 'inherit' });
        console.log(`❌ Removed: ${backup}`);
      }
    });
  }
  
  console.log('✅ Secure backup process completed');
  
} catch (error) {
  console.error('❌ Backup failed:', error.message);
  process.exit(1);
}