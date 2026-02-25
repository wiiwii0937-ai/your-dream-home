import { execSync } from 'child_process';

try {
  console.log('Running npm install to sync package-lock.json...');
  const output = execSync('cd /vercel/share/v0-project && npm install --package-lock-only', {
    encoding: 'utf-8',
    timeout: 120000,
  });
  console.log(output);
  console.log('package-lock.json has been synced successfully.');
} catch (error) {
  console.error('Error:', error.message);
  if (error.stdout) console.log('stdout:', error.stdout);
  if (error.stderr) console.log('stderr:', error.stderr);
}
