#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const TASK_FILE = path.join(process.cwd(), 'TASKS.md');

function readTasks() {
  if (!fs.existsSync(TASK_FILE)) {
    throw new Error('TASKS.md not found; deploy gate cannot proceed.');
  }
  const content = fs.readFileSync(TASK_FILE, 'utf8');
  const lines = content.split('\n');
  const tasks = [];

  for (const line of lines) {
    const match = line.match(/`tasks\/(P[0-2]-\d{2}\.md)` — .*? — ([✅🟡❌])/u);
    if (match) {
      tasks.push({ id: match[1].replace('tasks/', '').replace('.md', ''), status: match[2] });
    }
  }
  return tasks;
}

function main() {
  try {
    const tasks = readTasks();
    const blockers = tasks.filter((t) => t.id.startsWith('P0') || t.id.startsWith('P1'));
    const incomplete = blockers.filter((t) => t.status !== '✅');

    if (incomplete.length > 0) {
      console.error('🚫 Deploy gate failed: P0/P1 tasks remain incomplete.');
      console.error('Incomplete:', incomplete.map((t) => t.id).join(', '));
      process.exit(1);
    }

    console.warn('✅ Deploy gate passed: all P0/P1 tasks are complete.');
    process.exit(0);
  } catch (error) {
    console.error('🚫 Deploy gate error:', error.message);
    process.exit(1);
  }
}

main();
