// src/utils/serverMonitor.ts
// Based on the example from ready-serversMongoose
import { Request } from 'express';
import * as os from 'os';
import * as osUtils from 'os-utils'; // Note: os-utils might not be perfectly accurate
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'colors';

import config from '../config/index.js'; // Use .js
import { listLogFiles } from '../helpers/logUtils.js'; // Use .js - Needs to be created

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/utils

// --- State for Monitoring ---
let lastServerUpdateTime = new Date();
// Store response times in memory (replace with a more robust solution if needed)
// This array is populated by middleware in app.ts
// export let responseTimes: { route: string; time: number; label: string }[] = [];

// --- Helper Functions ---

/** Updates the last known server activity time */
export function updateServerTime() {
  lastServerUpdateTime = new Date();
}

/** Formats uptime in seconds to a readable string (e.g., "1d 2h 3m") */
function formatUptime(uptimeInSeconds: number): string {
  const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
  uptimeInSeconds %= (24 * 60 * 60);
  const hours = Math.floor(uptimeInSeconds / (60 * 60));
  uptimeInSeconds %= (60 * 60);
  const minutes = Math.floor(uptimeInSeconds / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

/** Formats a date into a relative time string (e.g., "5m ago") */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Generates HTML for CPU usage metrics */
function generateCpuUsageHtml(): Promise<string> {
  return new Promise((resolve) => {
    osUtils.cpuUsage((v: number) => { // v is CPU usage as a fraction (0 to 1)
      const totalCores = os.cpus().length;
      const cpuUsagePercentage = (v * 100).toFixed(2);
      const freePercentage = ((1 - v) * 100).toFixed(2);
      // Note: os-utils cpuUsage/free is system-wide, not per-core breakdown easily
      resolve(`
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${cpuUsagePercentage}%</div>
            <div class="metric-label">CPU Usage</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${freePercentage}%</div>
            <div class="metric-label">CPU Free</div>
          </div>
           <div class="metric-card">
            <div class="metric-value">${totalCores}</div>
            <div class="metric-label">Total Cores</div>
          </div>
        </div>
      `);
    });
  });
}

/** Generates HTML for Memory usage metrics */
function generateMemoryUsageHtml(): string {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

     return `
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${formatBytes(usedMem)}</div>
            <div class="metric-label">Memory Used</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${formatBytes(freeMem)}</div>
            <div class="metric-label">Memory Free</div>
          </div>
           <div class="metric-card">
            <div class="metric-value">${formatBytes(totalMem)}</div>
            <div class="metric-label">Total Memory</div>
          </div>
        </div>
      `;
}

/** Generates HTML table for recent API response times */
function generateResponseTimesTable(
    times: { route: string; time: number; label: string }[]
): string {
  if (!times || times.length === 0) {
    return '<p>No recent API response time data available.</p>';
  }

  // Get the last N entries (e.g., last 20)
  const recentTimes = times.slice(-20).reverse(); // Show most recent first

  let tableHtml = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Time (ms)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  `;

  recentTimes.forEach(entry => {
    let statusClass = 'status-success'; // Low
    if (entry.label === 'Medium') statusClass = 'status-warning';
    if (entry.label === 'High') statusClass = 'status-error';

    tableHtml += `
      <tr>
        <td>${entry.route}</td>
        <td>${entry.time}ms</td>
        <td><span class="status ${statusClass}"></span>${entry.label}</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  return tableHtml;
}

/** Generates HTML section linking to log files */
function generateLogLinksHtml(): string {
  const errorLogs = listLogFiles('errors'); // Assumes function exists in helpers/logUtils.ts
  const successLogs = listLogFiles('successes'); // Use 'successes' to match logger setup

  const createLinks = (logs: string[], type: 'errors' | 'successes') => {
    if (!logs || logs.length === 0) return \`<p>No $\{type} logs found.</p>\`;
    return logs
      .map(file => `<a href="/logs/${type}/${file}" target="_blank" class="log-link">${file}</a>`)
      .join('<br>');
  };

  return `
    <div class="log-container">
      <div class="log-section">
        <h3 style="color: #dc3545;">Error Logs</h3>
        <div class="log-links error-logs">${createLinks(errorLogs, 'errors')}</div>
      </div>
      <div class="log-section">
        <h3 style="color: #28a745;">Success Logs</h3>
        <div class="log-links success-logs">${createLinks(successLogs, 'successes')}</div>
      </div>
      <style>
        /* Styles from ready-serversMongoose example */
         .log-container { display: flex; gap: 2rem; margin: 1rem 0; flex-wrap: wrap;}
         .log-section { flex: 1; min-width: 250px; padding: 1rem; background: #1a1a1f; border-radius: 8px; border: 1px solid var(--border); }
         .log-links { margin-top: 1rem; max-height: 200px; overflow-y: auto; }
         .log-link { display: block; color: #aaa; text-decoration: none; margin: 0.25rem 0; padding: 0.25rem 0.5rem; border-radius: 4px; transition: background-color 0.2s; word-break: break-all; }
         .log-link:hover { background-color: #2a2a2f; text-decoration: underline; color: #eee; }
         .error-logs .log-link:hover { color: #ff8a8a; }
         .success-logs .log-link:hover { color: #8aff8a; }
      </style>
    </div>
  `;
}


// --- Main HTML Generation ---
async function serverMonitorPage(
    req: Request,
    responseTimes: { route: string; time: number; label: string }[]
): Promise<string> {
  const cpuUsageHtml = await generateCpuUsageHtml();
  const memoryUsageHtml = generateMemoryUsageHtml();
  const responseTimesTableHtml = generateResponseTimesTable(responseTimes);
  const logLinksHtml = generateLogLinksHtml();
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;
  const uptime = os.uptime();
  const hostname = os.hostname();
  const cpuModel = os.cpus()[0]?.model || 'N/A';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.server_name} - System Monitor</title>
        <style>
          /* Styles adapted from ready-serversMongoose example */
          :root {
            --bg-primary: #0f0f14; --bg-secondary: #1a1a1f; --accent: #00e5ff;
            --text-primary: #e0e0e0; --text-secondary: #a0a0a0; --border: #303035;
            --status-success: #00ff88; --status-warning: #ffdd00; --status-error: #ff5555;
            --space-sm: 0.5rem; --space-md: 1rem; --space-lg: 1.5rem; --glow: 0 0 8px var(--accent);
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; padding: var(--space-md); line-height: 1.5; }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { margin-bottom: var(--space-lg); padding: var(--space-lg); border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
          .header::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent); box-shadow: var(--glow); animation: scan 3s linear infinite; }
          @keyframes scan { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .header-title { margin-bottom: var(--space-sm); display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap;}
          .header-title h1 { color: var(--accent); font-size: 1.8em; margin-right: var(--space-md); text-shadow: 0 0 5px var(--accent); }
          .server-status { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9em; color: var(--status-success); animation: pulse 1.5s infinite ease-in-out; display: inline-flex; align-items: center; }
          .server-status::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background: var(--status-success); margin-right: var(--space-sm); box-shadow: 0 0 5px var(--status-success); }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          .header-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--border); }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
          .meta-value { color: var(--text-primary); font-size: 0.95rem; font-weight: 500; word-break: break-word; }
          .api-docs-link { display: inline-block; margin-top: var(--space-md); background-color: var(--accent); color: var(--bg-primary); padding: 0.4rem 0.8rem; border-radius: 4px; text-decoration: none; font-weight: 500; transition: background-color 0.2s; }
          .api-docs-link:hover { background-color: #00c4dd; }
          .tabs { margin-bottom: var(--space-lg); }
          .tab-nav { display: flex; gap: 1px; margin-bottom: -1px; overflow-x: auto; }
          .tab-button { padding: var(--space-sm) var(--space-md); background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); border-bottom: none; border-radius: 4px 4px 0 0; cursor: pointer; flex-shrink: 0; text-align: center; font-family: inherit; font-size: 0.9em; position: relative; transition: color 0.2s, background-color 0.2s; }
          .tab-button:hover { color: var(--accent); }
          .tab-button.active { background: var(--bg-primary); color: var(--accent); border-bottom: 1px solid var(--bg-primary); }
          .tab-button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--accent); box-shadow: var(--glow); }
          .tab-content { display: none; padding: var(--space-lg); background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 0 0 8px 8px; }
          .tab-content.active { display: block; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md); }
          .metric-card { background: var(--bg-primary); padding: var(--space-md); border: 1px solid var(--border); border-radius: 4px; text-align: center; }
          .metric-value { font-size: 1.6rem; color: var(--accent); text-shadow: var(--glow); margin-bottom: var(--space-sm); }
          .metric-label { color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; }
          .table-wrapper { overflow-x: auto; margin-top: var(--space-md); }
          .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
          .data-table th, .data-table td { padding: var(--space-sm) var(--space-md); text-align: left; border-bottom: 1px solid var(--border); }
          .data-table th { color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; }
          .data-table tr:hover { background: rgba(0, 229, 255, 0.05); }
          .status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: var(--space-sm); }
          .status-success { background: var(--status-success); box-shadow: 0 0 5px var(--status-success); }
          .status-warning { background: var(--status-warning); box-shadow: 0 0 5px var(--status-warning); }
          .status-error { background: var(--status-error); box-shadow: 0 0 5px var(--status-error); }
          h2 { margin-top: var(--space-lg); margin-bottom: var(--space-md); color: var(--text-secondary); font-size: 1.2em; border-bottom: 1px solid var(--border); padding-bottom: var(--space-sm); }
          h3 { color: var(--accent); font-size: 1em; margin-bottom: var(--space-sm); }
          p { margin-bottom: var(--space-md); }
          @media (max-width: 768px) { .header-title { flex-direction: column; align-items: flex-start; } .metric-value { font-size: 1.3rem; } .data-table { font-size: 0.8rem; } }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab-button');
            const contents = document.querySelectorAll('.tab-content');
            if(tabs.length > 0 && contents.length > 0) {
                tabs[0].classList.add('active');
                contents[0].classList.add('active');
            }
            tabs.forEach((tab, index) => {
              tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                if(contents[index]) contents[index].classList.add('active');
              });
            });
            // Auto-refresh functionality (optional)
            // setInterval(() => { window.location.reload(); }, 30000); // Refresh every 30 seconds
          });
        </script>
      </head>
      <body>
        <div class="container">
          <header class="header">
             <div class="header-title">
               <h1>${config.server_name} Monitor_</h1>
               <div class="server-status"><span>Running</span></div>
             </div>
             <p>Environment: ${config.env} | Node: ${nodeVersion}</p>
             <a class="api-docs-link" href="/api-docs" target="_blank">API Docs (Swagger)</a>
             <div class="header-meta">
                <div class="meta-item"><span class="meta-label">Hostname</span><span class="meta-value">${hostname}</span></div>
                <div class="meta-item"><span class="meta-label">Platform</span><span class="meta-value">${platform} (${arch})</span></div>
                <div class="meta-item"><span class="meta-label">CPU</span><span class="meta-value">${cpuModel}</span></div>
                <div class="meta-item"><span class="meta-label">Uptime</span><span class="meta-value">${formatUptime(uptime)}</span></div>
                <div class="meta-item"><span class="meta-label">Last Activity</span><span class="meta-value">${formatTimeAgo(lastServerUpdateTime)}</span></div>
             </div>
          </header>

          <div class="tabs">
            <div class="tab-nav">
              <button class="tab-button">System Usage</button>
              <button class="tab-button">API History</button>
              <button class="tab-button">Logs</button>
            </div>
            <div class="tab-content">
              <h2>CPU Usage</h2>
              ${cpuUsageHtml}
              <h2>Memory Usage</h2>
              ${memoryUsageHtml}
            </div>
            <div class="tab-content">
              <h2>Recent API Response Times</h2>
              ${responseTimesTableHtml}
            </div>
            <div class="tab-content">
              <h2>Log Files</h2>
              ${logLinksHtml}
            </div>
          </div>

        </div>
      </body>
    </html>
  `;
}

export default serverMonitorPage;
