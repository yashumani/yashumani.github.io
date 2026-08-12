(function () {
  'use strict';
  if (!/mangrok-recipe-vault\.html$/.test(window.location.pathname)) return;

  var attempts = 0;
  function setText(node, value) { if (node) node.textContent = value; }
  function patchMangrok() {
    var section = document.querySelector('#flow-mangrok');
    if (!section) return false;
    setText(section.querySelector(':scope > header h2'), 'Mangrok — culinary AI, vault, print, and legacy architecture');
    setText(section.querySelector(':scope > header .flow-copy'), 'The architecture now includes the explainable Alchemy Lab, optional local or self-hosted model refinement, server-metered AI, governed recipe data, print operations, and human legacy review.');

    var stages = section.querySelectorAll('.architecture-stage');
    var stageData = [
      ['Experience layer','Create, preserve, and explore',['Progressive web app','Recipe and media studio','Alchemy Lab interface','IndexedDB vault']],
      ['Trust and intelligence','Protect secrets and govern AI',['Web Crypto','PBKDF2 key derivation','Supabase Auth and RLS','AI entitlement and metering']],
      ['Canonical data','Persist recipes and experiments',['Recipe records','Encrypted note payloads','Private object storage','Versions and Alchemy history']],
      ['Server and operations','Run external gates safely',['Alchemy AI Edge Function','Print-order Edge Function','Export and deletion','Human legacy review']]
    ];
    stages.forEach(function (stage, index) {
      var data = stageData[index];
      if (!data) return;
      setText(stage.querySelector('.architecture-stage-kicker, .architecture-stage-head span'), data[0]);
      setText(stage.querySelector('h3'), data[1]);
      stage.querySelectorAll('.architecture-node').forEach(function (node, nodeIndex) {
        var strong = node.querySelector('strong') || node;
        if (data[2][nodeIndex]) setText(strong, data[2][nodeIndex]);
      });
    });

    var logic = section.querySelector('.flow-lane[data-flow-kind="logic"]');
    var logicTitles = ['Capture recipe or start Alchemy','Protect secrets','Refine culinary analysis','Share and version safely','Print or preserve','Legacy review'];
    if (logic) logic.querySelectorAll('.flow-step h4').forEach(function (node, i) { if (logicTitles[i]) setText(node, logicTitles[i]); });
    var code = section.querySelector('.flow-lane[data-flow-kind="code"]');
    var codeTitles = ['PWA shell boots','Crypto and local analysis execute','AI adapter or Edge Function routes','Supabase policies and entitlements evaluate','Print and legacy operations run'];
    if (code) code.querySelectorAll('.flow-step h4').forEach(function (node, i) { if (codeTitles[i]) setText(node, codeTitles[i]); });
    var summary = section.querySelectorAll('.flow-summary article strong');
    if (summary[1]) summary[1].textContent = 'PWA, Web Crypto, local/self-hosted AI, Supabase and Edge Functions';
    section.setAttribute('data-content-reviewed', '2026-08-12');
    return true;
  }

  function run() {
    attempts += 1;
    if (patchMangrok() || attempts > 50) return;
    window.setTimeout(run, 100);
  }
  run();
})();
