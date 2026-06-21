type Level = 'info' | 'warn' | 'error';

function log(level: Level, message: string, meta?: Record<string, unknown>): void {
  const entry = { ...meta, timestamp: new Date().toISOString(), level, message };
  const writer = level === 'info' ? console.log : console[level];
  writer(JSON.stringify(entry));
}

export default {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
