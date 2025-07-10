#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Configuration
const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isStart = args.includes('--start');
const noOpen = args.includes('--no-open');
const BACKEND_DIR = path.join(__dirname, 'backend');
const FRONTEND_DIR = path.join(__dirname, 'frontend');
const FRONTEND_PORT = isDev ? process.env.FRONTEND_PORT || 5173 : 4173;
const BACKEND_PORT = process.env.BACKEND_PORT || 2002;

// Utilities
const log = (msg, type = 'info') => {
  const icons = { error: '❌', success: '✅', warning: '⚠️', info: 'ℹ️' };
  console.log(`[${chalk.gray(new Date().toLocaleTimeString())}] ${chalk[type === 'error' ? 'red' : type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'blue'](icons[type])} ${msg}`);
};

const logService = (service, msg) => console.log(`${chalk[service === 'backend' ? 'bgBlue' : 'bgGreen'].white(` ${service.charAt(0).toUpperCase() + service.slice(1)} `)} ${msg}`);

const spawnBuild = (cmd, args, cwd, label) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true, env: { ...process.env, FORCE_COLOR: true } });
  child.on('close', code => code === 0 ? resolve() : reject(new Error(`${label} failed with exit code ${code}`)));
  child.on('error', err => reject(new Error(`Failed to start ${label}: ${err.message}`)));
});

const openBrowser = async (url, delay = 3000) => {
  if (noOpen) return log('Browser opening disabled with --no-open flag');
  setTimeout(async () => {
    try {
      const open = (await import('open')).default;
      await open(url);
      log(`Opened browser at ${url}`, 'success');
    } catch (error) {
      log(`Could not open browser automatically. Please visit: ${chalk.cyan(url)}`, 'warning');
    }
  }, delay);
};

const createStreamHandler = (service) => (data) => {
  data.toString().split('\n').filter(line => line.trim()).forEach(line => {
    logService(service, service === 'frontend' && line.includes('yellow') ? chalk.yellow(line) : line);
    if (service === 'frontend' && line.includes('Local:') && line.includes('localhost')) {
      const match = line.match(/http:\/\/localhost:\d+/);
      if (match) openBrowser(match[0], 2000);
    }
  });
};

const spawnService = (service, script, env = {}) => {
  const child = spawn('npm', ['run', script], {
    cwd: service === 'backend' ? BACKEND_DIR : FRONTEND_DIR,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true, ...env }
  });
  
  const handler = createStreamHandler(service);
  child.stdout.on('data', handler);
  child.stderr.on('data', (data) => createStreamHandler(service)(chalk.yellow(data.toString())));
  child.on('close', code => code !== 0 && log(`${service} process exited with code ${code}`, 'error'));
  
  return child;
};

const setupCleanup = (...processes) => {
  const cleanup = () => {
    log('Shutting down servers...', 'warning');
    processes.forEach(p => p.kill('SIGINT'));
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

const printStartupInfo = () => {
  console.log(`\n${chalk.bgBlue.white(' YieldMax Fullstack Launcher ')}\n`);
  console.log(`${chalk.cyan('🚀 Frontend:')} ${chalk.white(`http://localhost:${FRONTEND_PORT}`)}`);
  console.log(`${chalk.cyan('⚙️  Backend: ')} ${chalk.white(`http://localhost:${BACKEND_PORT}`)}\n`);
  console.log(`${chalk.gray('Press Ctrl+C to stop all servers')}\n`);
};

// Main functions
async function buildProduction() {
  log('Building for production...', 'info');
  try {
    await spawnBuild('npm', ['run', 'build'], BACKEND_DIR, 'Backend build');
    log('Backend build completed', 'success');
    await spawnBuild('npm', ['run', 'build'], FRONTEND_DIR, 'Frontend build');
    log('Frontend build completed', 'success');
    log('Production build completed successfully!', 'success');
  } catch (error) {
    log(`Build failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

async function startServers(mode) {
  log(`Starting ${mode} servers...`, 'info');
  printStartupInfo();
  
  const backendScript = mode === 'development' ? 'dev' : 'start';
  const frontendScript = mode === 'development' ? 'dev' : 'preview';
  const env = mode === 'production' ? { NODE_ENV: 'production' } : {};
  
  const backend = spawnService('backend', backendScript, env);
  const frontend = spawnService('frontend', frontendScript, env);
  
  setupCleanup(backend, frontend);
  
  if (mode === 'production') {
    setTimeout(() => openBrowser(`http://localhost:${FRONTEND_PORT}`), 3000);
  }
  
  log(`${mode} servers started${mode === 'development' ? '. Waiting for frontend to be ready...' : '. Opening browser...'}`, 'success');
}

function showHelp() {
  console.log(`
${chalk.bgBlue.white(' YieldMax Fullstack Launcher ')}

${chalk.cyan('Usage:')} node launcher.js [options]

${chalk.cyan('Options:')}
  ${chalk.green('--dev')}        Start in development mode (with hot reload)
  ${chalk.green('--start')}      Start in production mode (builds first)
  ${chalk.green('--no-open')}    Prevent automatic browser opening
  ${chalk.green('--help')}       Show this help message

${chalk.cyan('Examples:')}
  ${chalk.gray('npm run dev')}              # Development mode with auto browser opening
  ${chalk.gray('npm run dev -- --no-open')} # Development mode without browser opening
  ${chalk.gray('npm run start')}            # Production mode with auto browser opening

${chalk.cyan('Environment Variables:')}
  ${chalk.yellow('FRONTEND_PORT')}  Frontend port (default: 5173 dev / 4173 prod)
  ${chalk.yellow('BACKEND_PORT')}   Backend port (default: 2002)
`);
}

// Main execution
async function main() {
  if (args.includes('--help')) return showHelp();
  
  if (!fs.existsSync(BACKEND_DIR) || !fs.existsSync(FRONTEND_DIR)) {
    log('Backend or Frontend directory not found', 'error');
    process.exit(1);
  }
  
  if (isDev) {
    await startServers('development');
  } else if (isStart) {
    await buildProduction();
    await startServers('production');
  } else {
    log('Please specify --dev or --start', 'error');
    showHelp();
    process.exit(1);
  }
}

main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});