import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';
const { enableMotion } = loadTs('src/lib/motion.ts');

function controller(calls) {
  let enabled = false;
  return {
    isSupported: async () => { calls.push('support'); return true; },
    isEnabled: () => enabled,
    start: async () => { calls.push('start'); enabled = true; },
    stop: () => { enabled = false; }
  };
}

test('iPhone permission is requested during the tap, before asynchronous support checks', async () => {
  const calls = [];
  let grant;
  const permission = new Promise(resolve => { grant = resolve; });
  const operation = enableMotion(controller(calls), { requestPermission() { calls.push('permission'); return permission; } }, true);
  assert.deepEqual(calls, ['permission']);
  grant('granted');
  assert.equal(await operation, 'enabled');
  assert.deepEqual(calls, ['permission', 'support', 'start']);
});

test('denied permission never starts sensor control', async () => {
  const calls = [];
  assert.equal(await enableMotion(controller(calls), { requestPermission: async () => 'denied' }, true), 'denied');
  assert.deepEqual(calls, []);
});

test('a stale permission response cannot enable a disposed viewer', async () => {
  const calls = [];
  let current = true;
  let grant;
  const operation = enableMotion(controller(calls), { requestPermission: () => new Promise(resolve => { grant = resolve; }) }, true, () => current);
  current = false;
  grant('granted');
  assert.equal(await operation, 'cancelled');
  assert.deepEqual(calls, []);
});

test('Android-style sensor access works without the iPhone permission method; insecure access does not start', async () => {
  const calls = [];
  assert.equal(await enableMotion(controller(calls), {}, true), 'enabled');
  assert.deepEqual(calls, ['support', 'start']);
  calls.length = 0;
  assert.equal(await enableMotion(controller(calls), {}, false), 'insecure');
  assert.equal(await enableMotion(controller(calls), undefined, true), 'unsupported');
  assert.deepEqual(calls, []);
});
