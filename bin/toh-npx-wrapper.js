#!/usr/bin/env node

/**
 * Toh Framework - NPX Wrapper
 * 
 * This is the entry point when running:
 * - npx toh-framework install
 * - npx toh install
 * 
 * Routes commands to the appropriate handlers.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the command from arguments
const args = process.argv.slice(2);
const command = args[0] || 'install';

// Route to CLI
const cliPath = join(__dirname, '..', 'tools', 'cli', 'toh-cli.js');

const child = spawn('node', [cliPath, ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start Toh Framework CLI:', err.message);
  process.exit(1);
});
