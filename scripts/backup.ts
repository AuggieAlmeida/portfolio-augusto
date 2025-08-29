import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

async function createBackup() {
  const date = new Date().toISOString().split('T')[0];
  const backupDir = `backups/${date}`;
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    
    // Backup source code
    await execAsync(`tar -czf ${backupDir}/source.tar.gz ./src`);
    
    // Backup assets
    await execAsync(`tar -czf ${backupDir}/assets.tar.gz ./src/assets`);
    
    // Backup configurations
    await execAsync(`tar -czf ${backupDir}/configs.tar.gz ./*.json ./*.js ./*.yml`);
    
    console.log(`Backup created successfully in ${backupDir}`);
  } catch (error) {
    console.error('Backup failed:', error);
  }
}

createBackup();