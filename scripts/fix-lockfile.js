import { execSync } from 'child_process';

// Regenerate package-lock.json to sync with package.json
execSync('npm install --package-lock-only', {
  cwd: '/vercel/share/v0-project',
  stdio: 'inherit',
});

console.log('package-lock.json has been regenerated successfully.');
