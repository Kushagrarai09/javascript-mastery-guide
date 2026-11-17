(function () {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const safeStore = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };
  const data = window.JS_MASTERY_CONTENT;
  const lesson = $("#lesson-area"), practice = $("#practice-area"), nav = $("#chapter-nav"), outline = $("#chapter-outline");
  if (!data || !Array.isArray(data.chapters) || data.chapters.length !== 15) {
    if (lesson) lesson.innerHTML = '<div class="empty-state"><h2>Course content could not be loaded</h2><p>Refresh the page. If the problem continues, check that content.js is deployed alongside app.js.</p></div>';
    return;
  }
  let completed = [];
  try { completed = JSON.parse(safeStore.get("js-mastery-completed", "[]")); if (!Array.isArray(completed)) completed = []; } catch (_) { completed = []; }
  const state = { chapter: 0, view: "lesson", completed: new Set(completed.filter(n => Number.isInteger(n) && n >= 0 && n < data.chapters.length)), theme: safeStore.get("js-mastery-theme", "light") };
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function toast(message) {
    const el = $("#toast"); if (!el) return;
    el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2200);
  }
  function updateProgress() {
    const percent = Math.round(state.completed.size / data.chapters.length * 100);
    $("#progress-text").textContent = percent + "%";
    $("#progress-bar").style.width = percent + "%";
    $("#chapter-count").textContent = data.chapters.length;
    $("#topic-count").textContent = data.chapters.reduce((n, ch) => n + ch.topics.length, 0);
    $("#quiz-count").textContent = data.chapters.reduce((n, ch) => n + ch.topics.length, 0);
    const statLabels = document.querySelectorAll(".sidebar-stats span");
    if (statLabels[2]) statLabels[2].textContent = "Examples";
    const meta = document.querySelectorAll(".hero-meta span");
    if (meta[0]) meta[0].textContent = data.chapters.length + " chapters";
    if (meta[1]) meta[1].textContent = data.chapters.reduce((n, ch) => n + ch.topics.length, 0) + " detailed lessons";
    if (meta[2]) meta[2].textContent = "No MCQ quizzes · Learn by building";
  }
  function saveProgress() { safeStore.set("js-mastery-completed", JSON.stringify([...state.completed])); updateProgress(); }
  function renderNav() {
    nav.innerHTML = '<div class="nav-heading">15-CHAPTER LEARNING PATH</div>' + data.chapters.map((ch, i) =>
      '<button class="chapter-link ' + (state.view === "lesson" && i === state.chapter ? "active " : "") + (state.completed.has(i) ? "done" : "") + '" data-chapter="' + i + '" type="button"><span class="num">' + (state.completed.has(i) ? "✓" : String(i + 1).padStart(2, "0")) + '</span><span>' + esc(ch.title) + '</span></button>'
    ).join("");
    nav.querySelectorAll("[data-chapter]").forEach(button => button.addEventListener("click", () => selectChapter(Number(button.dataset.chapter))));
  }
  function renderOutline(chapter) {
    outline.innerHTML = chapter.topics.map((topic, i) => '<a class="outline-link" href="#topic-' + i + '">' + (i + 1) + ". " + esc(topic[0]) + "</a>").join("");
  }
  function topicGuidance(topic) {
    const title = topic[0], explanation = topic[1], code = topic[2], remember = topic[3];
    const lines = code.split("\n").filter(line => line.trim());
    const concepts = [
      ["Core idea", explanation],
      ["How to think about it", "Identify the input, the operation being performed, and the result you expect. Then compare that expectation with the actual output. This habit makes unfamiliar JavaScript code easier to reason about."],
      ["Read the example", "Run the example in the playground. Change one value or expression at a time, predict the output before running it, and observe how that single change affects the result."],
      ["Practical application", "Use " + title.toLowerCase() + " when building real interfaces, browser features, APIs, or application logic. Keep the implementation small, give values meaningful names, and separate responsibilities as the code grows."],
      ["Common mistakes to avoid", "Do not rely on assumptions about values or execution order. Check edge cases, inspect the actual type and value, and use clear variable names. Prefer a small reproducible example when debugging."],
      ["Key takeaway", remember]
    ];
    return '<div class="topic-detail-grid">' + concepts.map((item, i) => '<section class="detail-block ' + (i === 0 || i === 5 ? "detail-highlight" : "") + '"><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></section>').join("") + '</div>' +
      '<div class="code-reading"><h3>Code reading checklist</h3><p>As you read the example, identify these parts:</p><ol>' +
      ['What values or inputs are introduced?','Which statement or expression performs the main operation?','What output or state change should you expect?','What happens if you change an input or use an edge case?'].map(x => '<li>' + esc(x) + '</li>').join("") +
      '</ol><p class="code-line-count">' + lines.length + ' non-empty code lines in this example. Trace them in order rather than memorising the syntax.</p></div>';
  }
  function renderTopic(topic, index) {
    return '<article class="topic-card" id="topic-' + index + '">' +
      '<div class="chapter-kicker">LESSON ' + String(index + 1).padStart(2, "0") + '</div>' +
      '<h2>' + esc(topic[0]) + '</h2><p class="topic-lead">' + esc(topic[1]) + '</p>' +
      '<h3>Worked JavaScript example</h3><pre><code>' + esc(topic[2]) + '</code></pre>' +
      topicGuidance(topic) +
      '<div class="callout"><strong>Remember:</strong> ' + esc(topic[3]) + '</div>' +
      '<div class="topic-footer"><span>Read · Predict · Run · Modify · Explain</span><span>JavaScript mastery</span></div></article>';
  }
  function renderPlayground() {
    return '<section class="playground"><div class="chapter-kicker">HANDS-ON LAB</div><h2>JavaScript playground</h2><p class="lesson-intro">Experiment with the concepts from this chapter. Use console.log() to inspect values. Code runs in a sandboxed iframe.</p>' +
      '<textarea id="playground-code" spellcheck="false" aria-label="JavaScript code">const language = "JavaScript";\nconsole.log("Hello from " + language);\nconsole.log(2 + 3);</textarea>' +
      '<div class="playground-actions"><button class="primary-button" id="run-code" type="button">▶ Run code</button><button class="secondary-button" id="clear-output" type="button">Clear output</button></div><pre class="playground-output" id="playground-output">Output will appear here.</pre></section>';
  }
  function bindPlayground() {
    $("#run-code").addEventListener("click", () => {
      const code = $("#playground-code").value.replace(/<\/script/gi, "<\\/script");
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts"); frame.title = "JavaScript code execution sandbox"; frame.hidden = true;
      const bridge = 'const send=(...args)=>parent.postMessage({source:"js-mastery-playground",text:args.map(v=>{try{return typeof v==="string"?v:JSON.stringify(v)}catch(e){return String(v)}}).join(" ")},"*");console.log=send;console.error=(...a)=>send("Error:",...a);console.warn=(...a)=>send("Warning:",...a);window.onerror=m=>send("Error:",m);try{';
      frame.srcdoc = '<!doctype html><html><body><script>' + bridge + code + '}catch(e){send("Error:",e.message)}<' + '/script></body></html>';
      const output = $("#playground-output"); output.textContent = "Running…";
      const listener = event => {
        if (event.source !== frame.contentWindow || event.data?.source !== "js-mastery-playground") return;
        output.textContent = (output.textContent === "Running…" ? "" : output.textContent + "\n") + event.data.text;
      };
      window.addEventListener("message", listener); document.body.append(frame);
      setTimeout(() => { window.removeEventListener("message", listener); frame.remove(); if (output.textContent === "Running…") output.textContent = "Code finished with no console output."; }, 900);
    });
    $("#clear-output").addEventListener("click", () => { $("#playground-output").textContent = "Output cleared."; });
  }
  function renderChapter() {
    const chapter = data.chapters[state.chapter];
    state.view = "lesson"; lesson.hidden = false; practice.hidden = true;
    $("#breadcrumb-current").textContent = chapter.title;
    $("#lesson-aside").hidden = false;
    renderOutline(chapter);
    const objectives = chapter.topics.slice(0, Math.min(5, chapter.topics.length)).map(t => "<li>" + esc(t[0]) + "</li>").join("");
    lesson.innerHTML = '<div class="chapter-kicker">CHAPTER ' + String(state.chapter + 1).padStart(2, "0") + ' / 15</div>' +
      '<h1 class="lesson-title">' + esc(chapter.title) + '</h1><p class="lesson-intro">' + esc(chapter.intro) + '</p>' +
      '<section class="chapter-overview"><h2>What you will learn</h2><p>Work through each lesson in sequence. Understand the concept, inspect the example, run it, change it, and explain the result in your own words.</p><ul>' + objectives + '</ul></section>' +
      chapter.topics.map((topic, i) => renderTopic(topic, i)).join("") +
      '<section class="chapter-assignment"><div class="chapter-kicker">CHAPTER ASSIGNMENT</div><h2>Apply what you learned</h2><p>Create a small program that combines at least two concepts from this chapter. Write down the expected output before running it, test normal and edge-case inputs, and explain your solution.</p><ul><li>Build a working solution without copying the example verbatim.</li><li>Use meaningful names and keep each function focused.</li><li>Test at least three inputs, including one edge case.</li><li>Refactor once after the first working version.</li></ul></section>' +
      renderPlayground() +
      '<div class="chapter-navigation"><button class="secondary-button" id="previous-chapter" ' + (state.chapter === 0 ? "disabled" : "") + '>← Previous chapter</button><button class="primary-button" id="next-chapter" ' + (state.chapter === data.chapters.length - 1 ? "disabled" : "") + '>' + (state.chapter === data.chapters.length - 1 ? "Course complete" : "Next chapter →") + '</button></div>';
    $("#complete-chapter").textContent = state.completed.has(state.chapter) ? "✓ Chapter completed" : "Mark chapter complete";
    $("#complete-chapter").onclick = () => { state.completed.add(state.chapter); saveProgress(); renderNav(); $("#complete-chapter").textContent = "✓ Chapter completed"; toast("Chapter marked complete"); };
    $("#previous-chapter").addEventListener("click", () => selectChapter(state.chapter - 1));
    $("#next-chapter").addEventListener("click", () => selectChapter(state.chapter + 1));
    bindPlayground(); renderNav();
  }
  function selectChapter(index) {
    if (!Number.isInteger(index) || index < 0 || index >= data.chapters.length) return;
    state.chapter = index; renderChapter(); window.scrollTo({top:0,behavior:"smooth"});
    if (window.innerWidth <= 760) $("#sidebar").classList.remove("open");
  }
  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) { renderNav(); return; }
    const matches = [];
    data.chapters.forEach((chapter, index) => chapter.topics.forEach((topic, topicIndex) => {
      if (topic.join(" ").toLowerCase().includes(q)) matches.push({chapter,index,topicIndex,topic});
    }));
    nav.innerHTML = '<div class="nav-heading">SEARCH RESULTS (' + matches.length + ')</div>' + (matches.length ? matches.map(m =>
      '<button class="chapter-link" data-search-chapter="' + m.index + '" data-search-topic="' + m.topicIndex + '" type="button"><span class="num">' + (m.index + 1) + '</span><span>' + esc(m.topic[0]) + '<small>' + esc(m.chapter.title) + '</small></span></button>'
    ).join("") : '<div class="empty-state">No matching lessons found.</div>');
    nav.querySelectorAll("[data-search-chapter]").forEach(button => button.addEventListener("click", () => {
      const topicIndex = Number(button.dataset.searchTopic); selectChapter(Number(button.dataset.searchChapter));
      setTimeout(() => $("#topic-" + topicIndex)?.scrollIntoView({behavior:"smooth"}), 80);
    }));
  }
  $("#search-input").addEventListener("input", e => search(e.target.value));
  $("#theme-toggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", state.theme === "dark"); safeStore.set("js-mastery-theme", state.theme);
  });
  $("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#reset-progress").addEventListener("click", () => {
    if (confirm("Reset saved chapter progress?")) { state.completed.clear(); saveProgress(); renderChapter(); toast("Progress reset"); }
  });
  document.body.classList.toggle("dark", state.theme === "dark");
  $("#search-input").addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); e.currentTarget.focus(); }
  });
  updateProgress(); renderNav(); renderChapter();
})();