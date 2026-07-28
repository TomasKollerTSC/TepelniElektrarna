import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'screen_oled2', 'src', 'App.jsx'), 'utf8');

test('OLED 2 streams large phase videos instead of buffering six Blobs in parallel', () => {
  assert.match(source, /map\(state => \[state, videoPath\(fuel, state\)\]\)/);
  assert.doesNotMatch(source, /fetch\(videoPath/);
  assert.doesNotMatch(source, /URL\.createObjectURL|URL\.revokeObjectURL/);
});
