import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

// Read numeric arrays from the repository's little-endian MATLAB v5 files.
// Deliberately rejects other formats instead of silently interpreting them.
export function readMat(path) {
  const buffer = readFileSync(path);
  if (buffer.toString('ascii', 126, 128) !== 'IM') throw new Error('Expected little-endian MATLAB v5 data');
  const result = {};
  const readers = {1: ['readInt8', 1], 2: ['readUInt8', 1], 3: ['readInt16LE', 2], 4: ['readUInt16LE', 2], 5: ['readInt32LE', 4], 6: ['readUInt32LE', 4], 7: ['readFloatLE', 4], 9: ['readDoubleLE', 8]};
  function elements(bytes) {
    const parts = [];
    for (let offset = 0; offset + 8 <= bytes.length;) {
      const tag = bytes.readUInt32LE(offset);
      const small = tag >>> 16;
      const type = small ? tag & 65535 : tag;
      const size = small || bytes.readUInt32LE(offset + 4);
      const start = offset + (small ? 4 : 8);
      if (start + size > bytes.length) throw new Error('Truncated MAT element');
      parts.push({type, bytes: bytes.subarray(start, start + size)});
      offset += small ? 8 : 8 + (type === 15 ? size : Math.ceil(size / 8) * 8);
    }
    return parts;
  }
  function parse(bytes) {
    for (const element of elements(bytes)) {
      if (element.type === 15) parse(inflateSync(element.bytes));
      if (element.type !== 14) continue;
      const parts = elements(element.bytes);
      const name = parts[2].bytes.toString('utf8');
      const reader = readers[parts[3]?.type];
      if (!reader) continue; // Character metadata is not part of the model.
      const rows = parts[1].bytes.readInt32LE(0);
      const cols = parts[1].bytes.readInt32LE(4);
      const [method, stride] = reader;
      if (rows * cols * stride !== parts[3].bytes.length) throw new Error(`Invalid array: ${name}`);
      result[name] = Array.from({length: rows}, (_, r) => Array.from({length: cols}, (_, c) => parts[3].bytes[method]((c * rows + r) * stride)));
    }
  }
  parse(buffer.subarray(128));
  return result;
}
