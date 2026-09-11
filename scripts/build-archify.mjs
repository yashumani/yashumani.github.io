import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

// Archify is downloaded at a pinned revision by CI, not installed in the public site.
const root = process.cwd();
const home = process.env.ARCHIFY_HOME;
if (!home || !fs.existsSync(path.join(home, 'bin/archify.mjs'))) throw new Error('Set ARCHIFY_HOME to the pinned Archify package directory.');
const definitions = JSON.parse(fs.readFileSync('architecture/definitions.json', 'utf8'));
const out = path.join(root, 'architecture');
for (const dir of ['specs', 'maps', 'receipts']) fs.mkdirSync(path.join(out, dir), { recursive: true });
const text = file => fs.readFileSync(file, 'utf8');
const plain = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&(?:nbsp|#160);/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
function object(file, name, end) {
  const source = text(file), start = source.indexOf('var ' + name + ' = '), stop = source.indexOf(end, start);
  if (start < 0 || stop < 0) throw new Error('Source extraction marker changed: ' + file);
  const context = {};
  vm.runInNewContext(source.slice(start, stop) + ';globalThis.result=' + name, context, { timeout: 1000 });
  return context.result;
}
const configs = object('js/flow-diagrams.js', 'projectConfigs', '  function el(');
configs['agentic-harness-builder.html'] = object('js/harnesslab-flow.js', 'config', '  function node(');
configs['governed-ai-brain.html'] = object('js/ai-brain-flow.js', 'config', '  function element(');
const fork = text('projects/forkwise-open-source-reviewer.html');
configs['forkwise-open-source-reviewer.html'] = { lanes: [...fork.matchAll(/<article\b[^>]*data-flow-kind="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)].map(m => ({ kind: m[1], title: m[1] + ' flow', steps: [...m[2].matchAll(/<li\b[^>]*class="flow-step[^>]*>([\s\S]*?)<\/li>/g)].map(s => [plain(s[1].match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1]), plain(s[1].match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1])]) })) };
const dq = text('projects/dq-check-platform.html');
const dqSteps = [...dq.matchAll(/<div class="architecture-node[^>]*>([\s\S]*?)<\/div>/g)].map(m => [plain(m[1].match(/<strong[^>]*>([\s\S]*?)<\/strong>/)?.[1]), plain(m[1].match(/<small[^>]*>([\s\S]*?)<\/small>/)?.[1])]);
const logicLabels = ['Validate comparison rows', 'Calculate residuals', 'Group eligible dimensions', 'Score drivers', 'Rank signed contributions', 'Search interactions', 'Rescan after every drill'];
const dqLogic = [...(dq.match(/<ol class="clean">([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m, i) => [logicLabels[i], plain(m[1])]);
configs['dq-check-platform.html'] = { lanes: [{kind:'logic',steps:dqLogic},{kind:'code',steps:dqSteps},{kind:'data',steps:dqSteps}] };
// These titles follow the published content-sync wording rather than the superseded launch copy.
const mangrokTitles = {
 logic: ['Capture recipe or open Alchemy','Protect private fields','Refine culinary analysis','Share and version safely','Prepare print output','Review legacy requests'],
 code: ['Boot the PWA shell','Run local crypto and analysis','Route optional model work','Evaluate policies and entitlements','Run print and legacy operations']
};
for (const lane of configs['mangrok-recipe-vault.html'].lanes) if (mangrokTitles[lane.kind]) lane.steps.forEach((step,i) => {step[0] = mangrokTitles[lane.kind][i];});
const positions = [[45,105],[335,105],[625,105],[915,105],[335,320],[625,320],[915,320]];
function architecture(d) {
 return { schema_version:1, diagram_type:'architecture', meta:{title:d.title, locale:'en',quality_profile:'showcase',viewBox:[1180,510]},
  components:d.nodes.map((n,i)=>({id:d.id+'-'+n[0],type:n[1],label:n[2],sublabel:n[3],pos:positions[i],size:[210,76]})),
  connections:[[0,1],[1,2],[2,3],[1,4],[2,5],[3,6]].map(([a,b],i)=>({id:d.id+'-connection-'+(i+1),from:d.id+'-'+d.nodes[a][0],to:d.id+'-'+d.nodes[b][0],label:d.labels[i],...(i<3?{variant:'emphasis'}:{fromSide:'bottom',toSide:'top',labelDy:80})})),
  cards:[{dot:'cyan',title:'Reading the map',items:['Follow the top path, then the labeled branches.','This is a component overview, not every runtime call.']},{dot:'amber',title:d.status,items:[d.scope]}]
 };
}
function workflow(d, lane) {
 const steps=lane.steps;
 if (steps.length<3 || steps.some(s=>!s[0])) throw new Error('Missing source flow: '+d.id+'/'+lane.kind);
 const ids=steps.map((_,i)=>d.id+'-'+lane.kind+'-'+(i+1));
 return {schema_version:2,diagram_type:'workflow',meta:{title:d.title+' / '+lane.kind[0].toUpperCase()+lane.kind.slice(1)+' flow',locale:'en',quality_profile:'showcase'},
 lanes:[{id:'input',label:'Input'},{id:'process',label:'Processing'},{id:'output',label:'Output'}],
 nodes:steps.map((s,i)=>({id:ids[i],lane:i===0?'input':i===steps.length-1?'output':'process',col:i===0?0:i===steps.length-1?steps.length-3:i-1,type:lane.kind==='data'?'database':'backend',label:s[0],width:Math.max(180,Math.ceil(s[0].length*7.6+30)),height:72})),
 edges:ids.slice(1).map((id,i)=>({id:ids[i]+'-next',from:ids[i],to:id,role:'main'})), mainPath:ids,
 cards:[{dot:'amber',title:d.status,items:[d.scope]}]
 };
}
const catalog=[];
for (const d of definitions) {
 const config=configs[d.slug]; if (!config || config.lanes.length!==3) throw new Error('Expected three source flows for '+d.slug);
 const views=[{key:'architecture',label:'Architecture',spec:architecture(d),steps:d.nodes.map(n=>[n[2],n[3]])},...config.lanes.map(l=>({key:l.kind,label:l.kind[0].toUpperCase()+l.kind.slice(1)+' flow',spec:workflow(d,l),steps:l.steps}))];
 const entry={id:d.id,slug:d.slug,title:d.title,status:d.status,scope:d.scope,source:'projects/'+d.slug,views:[]};
 for(const v of views){
  const id=d.id+'-'+v.key,input=path.join(out,'specs',id+'.json'),output=path.join(out,'maps',id+'.html');
  fs.writeFileSync(input,JSON.stringify(v.spec,null,2)+'\n');
  for(const command of ['validate','deliver']){
   const args=[path.join(home,'bin/archify.mjs'),command,v.spec.diagram_type,input,...(command==='deliver'?[output]:[]),'--quality','showcase','--json'];
   const r=spawnSync(process.execPath,args,{encoding:'utf8',env:{...process.env,ARCHIFY_UPDATE_CHECK_DISABLED:'1'}});
   if(r.status!==0) {console.error(id,command,r.stdout,r.stderr);process.exit(1);}
   const receipt=JSON.parse(r.stdout);
   if(command==='deliver')fs.writeFileSync(path.join(out,'receipts',id+'.json'),JSON.stringify(receipt,null,2)+'\n');
  }
  entry.views.push({key:v.key,label:v.label,map:'maps/'+id+'.html',spec:'specs/'+id+'.json',steps:v.steps});
  console.log('Delivered',id);
 }
 catalog.push(entry);
}
fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify({generator:'Archify 2.17.0-dev.1',revision:'5769acefcc2ebd696a4f9ed3ac9cb6cca1d75c70',basis:'Published portfolio cases and flow descriptions; not a new implementation audit.',projects:catalog},null,2)+'\n');
// Static readable content and links remain usable when scripts, frames, or network requests fail.
for(const d of catalog){
 const file='projects/'+d.slug;let html=text(file);
 const lists=d.views.map(v=>`<details class="archify-text"><summary>${escape(v.label)} — readable steps</summary><ol>${v.steps.map(s=>`<li><strong>${escape(s[0])}</strong><p>${escape(s[1]||'')}</p></li>`).join('')}</ol></details>`).join('');
 const block=`<!-- ARCHIFY:START --><section class="archify-workspace" data-archify-project="${d.id}" aria-labelledby="archify-title"><header class="archify-head"><div><p class="mono-label">System map / Archify</p><h2 id="archify-title">Explore the architecture</h2></div><span class="archify-status">${escape(d.status)}</span></header><p class="archify-scope">${escape(d.scope)}</p><div class="archify-tabs" role="tablist" aria-label="Diagram view">${d.views.map((v,i)=>`<button type="button" role="tab" id="archify-tab-${v.key}" aria-selected="${i===0}" aria-controls="archify-panel" tabindex="${i===0?0:-1}" data-archify-view="${v.key}">${v.label}</button>`).join('')}</div><div class="archify-actions"><a data-archify-open href="../architecture/${d.views[0].map}" target="_blank" rel="noopener">Open full interactive map ↗</a><a data-archify-source href="../architecture/${d.views[0].spec}" download>Editable JSON</a><a href="../architecture/index.html">All system maps</a></div><div id="archify-panel" role="tabpanel" aria-labelledby="archify-tab-architecture" tabindex="0"><p class="archify-load-note">Open the full map for zoom, search, focus, and export. The readable steps below are always available.</p><button type="button" class="archify-load" data-archify-load>Load diagram preview</button><div class="archify-preview" data-archify-preview></div></div><div class="archify-reader">${lists}</div><p class="archify-credit">Generated with Archify. Based on this published case and its flow descriptions, not a new deployment audit. <a href="../architecture/README.md">Method and provenance</a></p></section><!-- ARCHIFY:END -->`;
 html=html.replace(/<!-- ARCHIFY:START -->[\s\S]*?<!-- ARCHIFY:END -->\n?/g,'');
 const at=html.indexOf('<h2');if(at<0)throw new Error('Missing case section '+file);
 html=html.slice(0,at)+block+'\n'+html.slice(at);
 if(!html.includes('css/archify.css'))html=html.replace('</head>','<link rel="stylesheet" href="../css/archify.css">\n</head>');
 if(!html.includes('js/archify.js'))html=html.replace('</body>','<script src="../js/archify.js" defer></script>\n</body>');
 fs.writeFileSync(file,html);
}
console.log('Archify catalog:',catalog.length,'projects;',catalog.reduce((n,p)=>n+p.views.length,0),'views.');
await import('./integrate-archify.mjs');
