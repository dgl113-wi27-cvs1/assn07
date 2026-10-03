// Runs the tests listed in .github/classroom/autograding.json (the GitHub
// Classroom format) and reports the points: in the log ("Points 8/10"), as a
// table on the run page, and as a mark on the commit. No dependencies.
//
// Same rules as the old education/autograding action: for each test, run its
// `setup` (if any), then its `run` command; it passes if the command exits with
// code 0 and, when `output` is given, its output matches using `comparison`
// (exact / included / regex). `timeout` is in minutes; `points` are added up.
import { spawn } from 'node:child_process';
import { readFileSync, appendFileSync, existsSync } from 'node:fs';

const CONFIG = process.argv[2] ?? '.github/classroom/autograding.json';

function sh(command, { input = '', minutes = 1 } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, detached: true, stdio: ['pipe', 'pipe', 'pipe'],
                                   env: { ...process.env, FORCE_COLOR: '0', CI: 'true' } });
    let out = '';
    child.stdout.on('data', (d) => { out += d; process.stdout.write(d); });
    child.stderr.on('data', (d) => { out += d; process.stdout.write(d); });
    const timer = setTimeout(() => {
      try { process.kill(-child.pid, 'SIGKILL'); } catch {}
      out += `\n[stopped: took longer than ${minutes} minute(s)]`;
    }, Math.max(minutes, 0.05) * 60_000);
    child.on('close', (code) => { clearTimeout(timer); resolve({ code: code ?? -1, out }); });
    child.stdin.end(input ?? '');
  });
}

function matches(actual, expected, comparison) {
  const a = actual.replace(/\r\n/g, '\n').trim(), e = (expected ?? '').replace(/\r\n/g, '\n').trim();
  if (comparison === 'included') return a.includes(e);
  if (comparison === 'regex') return new RegExp(e).test(a);
  return a === e;
}

// The useful part of a failure: Jest's "●" block if there is one, else the last lines.
function reason(out) {
  const lines = out.replace(/\x1b\[[0-9;]*m/g, '').split('\n');
  const start = lines.findIndex((l) => l.trim().startsWith('●') && !l.includes('Console'));
  const picked = start >= 0 ? lines.slice(start, start + 14) : lines.slice(-12);
  return picked.join('\n').trim();
}

if (!existsSync(CONFIG)) {
  console.log(`No ${CONFIG} in this repository, so there is nothing to grade.`);
  process.exit(0);
}
const tests = JSON.parse(readFileSync(CONFIG, 'utf8')).tests ?? [];
const results = [];
for (const t of tests) {
  console.log(`::group::📝 ${t.name}`);
  let ok = true, detail = '';
  const minutes = Number(t.timeout) || 1;
  if (t.setup) {
    const s = await sh(t.setup, { minutes });
    if (s.code !== 0) { ok = false; detail = `setup failed (\`${t.setup}\`)\n${reason(s.out)}`; }
  }
  if (ok) {
    const r = await sh(t.run, { input: t.input, minutes });
    if (r.code !== 0) { ok = false; detail = reason(r.out); }
    else if (t.output && !matches(r.out, t.output, t.comparison)) {
      ok = false; detail = `output didn't match (${t.comparison ?? 'exact'}): expected ${JSON.stringify(t.output)}`;
    }
  }
  console.log('::endgroup::');
  console.log(`${ok ? '✅' : '❌'} ${t.name}`);
  results.push({ name: t.name, points: Number(t.points) || 0, ok, detail });
}

const available = results.reduce((s, r) => s + r.points, 0);
const earned = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
const passed = results.filter((r) => r.ok).length;
console.log(`\nPoints ${earned}/${available}`);

const md = [`## Points ${earned}/${available}`, `${passed} of ${results.length} tests passed.`, '',
            '| | Test | Points |', '|---|---|---|',
            ...results.map((r) => `| ${r.ok ? '✅' : '❌'} | ${r.name} | ${r.ok ? r.points : 0}/${r.points} |`)];
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  md.push('', '### What went wrong');
  for (const r of failed) md.push('', `<details><summary>❌ ${r.name}</summary>`, '', '```', r.detail.slice(0, 3000), '```', '</details>');
}
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join('\n') + '\n');

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_SERVER_URL, GITHUB_RUN_ID } = process.env;
if (GITHUB_TOKEN && GITHUB_REPOSITORY && GITHUB_SHA) {
  const api = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const res = await fetch(`${api}/repos/${GITHUB_REPOSITORY}/statuses/${GITHUB_SHA}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    body: JSON.stringify({
      state: failed.length ? 'failure' : 'success',
      context: 'autograde',
      description: `Points ${earned}/${available} (${passed} of ${results.length} tests passed)`,
      target_url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
    }),
  });
  if (!res.ok) console.log(`(Couldn't mark the commit: ${res.status} ${await res.text()})`);
}
process.exit(failed.length ? 1 : 0);
