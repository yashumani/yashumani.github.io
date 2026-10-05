import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const site=path.join(root,'gita-sadhana');
const readJson=async p=>JSON.parse(await readFile(path.join(site,p),'utf8'));
const counts=[47,72,43,42,29,47,30,28,34,42,55,20,35,27,20,24,28,78];
const corpus=await readJson('data/sanskrit-701.json');
const progress=await readJson('gita-progress.json');
const manifest=await readJson('content/manifest.json');
const archive=await readJson('content/complete-archive.json');

assert.equal(corpus.totalVerses,701);
assert.deepEqual(corpus.chapterCounts,counts);
assert.equal(progress.totalVerses,701);
assert.equal(progress.completedSequentialVerses,701);
assert.equal(progress.nextVerse,null);
assert.equal(progress.lastPublishedLessonId,'bg-18-078');
assert.match(progress.lastPublishedDate,/^\d{4}-\d{2}-\d{2}$/);
assert.equal(progress.updatedAt,progress.lastPublishedDate);
assert.equal(manifest.lessonFiles.length,701);
assert.equal(manifest.updatedAt,progress.updatedAt);
assert.equal(archive.schemaVersion,'GITA_PUBLIC_ARCHIVE_V1');
assert.equal(archive.publicationState,'published');
assert.equal(archive.totalVerses,701);
assert.equal(archive.canonicalVerseCount,701);
assert.equal(archive.complete,true);
assert.equal(archive.lessons.length,701);
assert.equal(archive.episodes.length,354);

const seen=new Set();
for(let i=0;i<701;i++){
  const canonical=corpus.verses[i],id=canonical.id,relative=`lessons/${id}.json`;
  assert.equal(canonical.sequenceNumber,i+1,`Corpus sequence ${i+1}`);
  assert.equal(manifest.lessonFiles[i],relative,`Manifest order ${i+1}`);
  assert(!seen.has(id),`Duplicate ${id}`);seen.add(id);
  const lesson=await readJson(`content/${relative}`);
  assert.deepEqual(archive.lessons[i],lesson,`Public archive differs from ${id}`);
  assert.equal(lesson.id,id);
  assert.equal(lesson.sequenceNumber,i+1);
  assert.equal(lesson.chapter,canonical.chapter);
  assert.equal(lesson.verseStart,canonical.verse);
  assert.equal(lesson.verseEnd,canonical.verse);
  assert.equal(lesson.sanskritDevanagari,canonical.sanskritDevanagari);
  assert.equal(lesson.transliteration,canonical.transliteration);
  assert.equal(lesson.sequentialStatus,'sequential');
  assert.equal(lesson.publishedStatus,'published');
  assert(!('localReviewState' in lesson),`Local-only state leaked into ${id}`);
  assert.match(lesson.date,/^\d{4}-\d{2}-\d{2}$/);
  for(const field of ['context','contextHindi','spokenHindi','clearEnglish','reflectionQuestion','reflectionQuestionHindi'])
    assert(lesson[field]?.trim(),`${id} missing ${field}`);
  assert(lesson.sourceNotes?.some(note=>note.url==='https://www.dlshq.org/download2/bgita.pdf'),`${id} missing primary edition provenance`);
  assert(lesson.sourceNotes?.some(note=>note.url?.includes('cddb2aabcb18b2ddf4ca965a0e673c1eee43146b')),`${id} missing pinned corpus provenance`);
}

const episodeIds=archive.episodes.flatMap(episode=>episode.lessonIds);
assert.equal(episodeIds.length,701);
assert.deepEqual(episodeIds,corpus.verses.map(verse=>verse.id),'Episode recaps do not cover the full sequence.');
for(const episode of archive.episodes){
  assert(episode.dailyHindiSummary?.trim());
  assert(episode.dailyEnglishSummary?.trim());
  assert(episode.dailyPractice?.trim());
}

const reader=await readFile(path.join(site,'complete.html'),'utf8');
const markdown=await readFile(path.join(site,'complete-listening-archive.md'),'utf8');
const siteHtml=await readFile(path.join(site,'site.htm'),'utf8');
assert(reader.includes('701 published lessons'));
assert(reader.includes('Assistant review is not human scholarly certification'));
assert(!reader.includes('../audit.json'));
assert(markdown.includes('701/701 published verse lessons'));
assert(markdown.includes('Bhagavad Gita 18.78'));
assert(siteHtml.includes('href="complete.html"'));
console.log(`Verified 701 published bilingual lessons, 354 complete episode recaps, exact pinned source and archive equality.`);
