import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(fs.readFileSync('architecture/catalog.json'));
assert.equal(catalog.projects.length,9);
let total=0;
for (const p of catalog.projects) {
 assert.equal(p.views.length,4); assert(p.scope && p.status);
 for (const v of p.views) {
  const specBytes=fs.readFileSync('architecture/'+v.spec),html=fs.readFileSync('architecture/'+v.map);
  const spec=JSON.parse(specBytes),receipt=JSON.parse(fs.readFileSync('architecture/receipts/'+p.id+'-'+v.key+'.json'));
  assert.equal(spec.meta.quality_profile,'showcase');assert.equal(receipt.ok,true);
  assert.equal(receipt.validation.checksPassed,9);assert.equal(receipt.validation.checkCount,9);
  assert.equal(receipt.validation.errors,0);assert.equal(receipt.validation.warnings,0);
  assert.equal(receipt.specification.sha256,hash(specBytes));assert.equal(receipt.artifact.sha256,hash(html));
  assert.equal(receipt.specification.bytes,specBytes.length);assert.equal(receipt.artifact.bytes,html.length);
  assert.match(html.toString(),/name="generator" content="archify /);
  assert.match(html.toString(),/<html lang="en"/);assert.match(html.toString(),/name="viewport"/);
  assert.doesNotMatch(specBytes.toString(),/\bGITA\b/i);assert.doesNotMatch(JSON.stringify(p),/\bGITA\b/i);
  assert.match(fs.readFileSync('projects/'+p.slug,'utf8'),new RegExp('data-archify-project="'+p.id+'"'));
  total++;
 }
}
assert.equal(total,36);console.log('Archify: 36 exact delivered artifacts; 324 showcase checks; matching SHA-256; 9 scoped projects.');
