(function () {
  'use strict';

  var slug = window.location.pathname.split('/').pop() || '';
  if (slug !== 'ai-powered-vs-ai-generated.html' && slug !== 'neurodivergent-ai-architect.html') return;

  function setText(node, value) { if (node && value) node.textContent = value; }

  function headings() {
    return Array.prototype.slice.call(document.querySelectorAll('main.case-study-wrap > h2.case-section-heading'));
  }

  function findHeading(text) {
    return headings().find(function (heading) {
      var title = heading.querySelector('.case-section-title') || heading;
      return (title.textContent || '').trim() === text;
    });
  }

  function renameHeading(from, to) {
    var heading = findHeading(from);
    if (!heading) return null;
    var title = heading.querySelector('.case-section-title') || heading;
    setText(title, to);
    return heading;
  }

  function setParagraphsAfter(heading, values) {
    if (!heading) return;
    var current = heading.nextElementSibling;
    values.forEach(function (value) {
      while (current && current.tagName !== 'P') current = current.nextElementSibling;
      if (!current) return;
      setText(current, value);
      current = current.nextElementSibling;
    });
  }

  if (slug === 'ai-powered-vs-ai-generated.html') {
    setText(document.querySelector('.paper-meta'), 'A polished output can be useful without proving that the surrounding workflow or system is reliable.');
    setText(document.querySelector('.paper-note p'), 'My view: AI-generated describes how an artifact was made. AI-powered describes the role a model plays in a broader capability. The evidence should match the layer being claimed.');

    var first = renameHeading('Abstract', 'Why the labels get mixed up');
    setParagraphsAfter(first, [
      'A generated answer, image, code fragment, or summary can be excellent. It still does not prove repeatability, monitoring, ownership, recovery behavior, or a measured outcome.',
      'I find it more useful to name the layer being evaluated: artifact, workflow, system, or operating model.'
    ]);

    var evaluation = renameHeading('The evaluation unit', 'Name what you are evaluating');
    setParagraphsAfter(evaluation, ['The evidence changes with the claim. A screenshot can prove that an interface exists. Tests can show repeatability. Architecture, logs, and recovery behavior can show how a system operates.']);

    renameHeading('The accountability test', 'Questions I use during review');
    renameHeading('Conclusion', 'Where I land');
    var conclusion = findHeading('Where I land');
    setParagraphsAfter(conclusion, [
      'Say generated output when that is what exists. Say workflow when the process is repeatable. Call it a system when the boundaries and failure behavior can be inspected.',
      'The model may produce the artifact. The surrounding system still has to own the process.'
    ]);
  }

  if (slug === 'neurodivergent-ai-architect.html') {
    setText(document.querySelector('.paper-meta'), 'A personal note on external memory, bounded exploration, verification, stop rules, and accessible team habits.');
    setText(document.querySelector('.paper-note p'), 'This is a personal operating note. It is not a diagnostic framework and not a claim that any cognitive style makes someone a better architect.');

    var scope = renameHeading('Scope and thesis', 'What I mean by this');
    setParagraphsAfter(scope, [
      'Architecture work carries more state than one person can hold reliably: assumptions, boundaries, open questions, data contracts, dependencies, risks, tests, and release decisions.',
      'The practical question is which parts of that work can move out of one person’s head and into shared systems.'
    ]);

    renameHeading('Health framing', 'A careful boundary');
    renameHeading('Operating patterns and failure modes', 'Patterns, value, and failure modes');
    renameHeading('Externalize verification', 'Turn repeated doubt into evidence');
    renameHeading('Conclusion', 'Where I land');
    var landing = findHeading('Where I land');
    setParagraphsAfter(landing, [
      'The useful lesson is not that neurodivergence is an advantage or disadvantage in the abstract. It is that invisible cognitive work can be redesigned.',
      'External memory, bounded exploration, objective checks, and explicit stop rules make the work less hidden and easier to share.'
    ]);
  }
})();
