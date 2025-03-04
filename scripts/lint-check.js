// scripts/lint-check.js
import { ESLint } from 'eslint';
import process from 'process';

async function main() {
  const eslint = new ESLint({
    overrideConfigFile: 'eslint.config.js',
    errorOnUnmatchedPattern: false // Add this to prevent errors if no files match
  });

  // Target all potential source directories in an Electron-Vite project
  const results = await eslint.lintFiles([
    'src/main/**/*.{ts,tsx}',
    'src/preload/**/*.{ts,tsx}',
    'src/renderer/**/*.{ts,tsx}'
  ]);

  const errorCount = results.reduce((acc, result) => acc + result.errorCount, 0);

  if (errorCount > 0) {
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = await formatter.format(results);
    console.error(resultText);
    process.exit(1); // Exit with error
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
