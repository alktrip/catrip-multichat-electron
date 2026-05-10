#!/usr/bin/env node
/* eslint-disable no-console */
const { execSync } = require("node:child_process");

function killPort(port) {
  try {
    const cmd = `lsof -ti:${port} -sTCP:LISTEN || true`;
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (!out) return;
    const pids = out
      .split(/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), "SIGKILL");
        console.log(`[dev] killed pid ${pid} on :${port}`);
      } catch {}
    }
  } catch {}
}

killPort(5173);
