(function () {
  "use strict";
  const data = window.JS_MASTERY_CONTENT;
  if (!data || !Array.isArray(data.chapters) || !Array.isArray(data.quiz)) {
    document.getElementById("lesson-area").textContent = "Course content could not be loaded. Check that content.js is available.";
    return;
  }
  const $ = selector => document.querySelector(selector);
  const nav = $("#chapter-nav"), lesson = $("#lesson-area"), practice = $("#practice-area"), outline = $("#chapter-outline");
  const state = {
    chapter: 0,
    view: "lesson",
    completed: new Set(JSON.parse(localStorage.getItem("js-mastery-completed") || "[]")),
    theme: localStorage.getItem("js-mastery-theme") || "light",
    search: ""
  };
  let practiceState = { questions: [], answers: {}, submitted: false, mode: "all" };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2200);
  }
  function progress() {
    const percent = Math.round(state.completed.size / data.chapters.length * 100);
    $("#progress-text").textContent = percent + "%";
    $("#progress-bar").style.width = percent + "%";
    $("#chapter-count").textContent = data.chapters.length;
    $("#topic-count").textContent = data.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
    $("#quiz-count").textContent = data.quiz.length;
    document.querySelectorAll(".hero-meta span")[0].textContent = data.chapters.length + " chapters";
    document.querySelectorAll(".hero-meta span")[1].textContent = data.chapters.reduce((sum, ch) => sum + ch.topics.length, 0) + " learning sections";
    document.querySelectorAll(".hero-meta span")[2].textContent = data.quiz.length + " Knowledge Check questions";
  }
  function save() { localStorage.setItem("js-mastery-completed", JSON.stringify([...state.completed])); progress(); }

  function renderNav() {
    nav.innerHTML = '<div class="nav-heading">LEARNING PATH</div>' + data.chapters.map((ch, i) =>
      `<button class="chapter-link ${state.view === "lesson" && i === state.chapter ? "active" : ""} ${state.completed.has(i) ? "done" : ""}" data-chapter="${i}" type="button"><span class="num">${state.completed.has(i) ? "✓" : String(i + 1).padStart(2, "0")}</span><span>${escapeHTML(ch.title)}</span></button>`
    ).join("");
    nav.querySelectorAll("[data-chapter]").forEach(button => button.addEventListener("click", () => selectChapter(Number(button.dataset.chapter))));
    $("#mcq-nav").classList.toggle("active", state.view === "practice");
  }
  function renderOutline(chapter) {
    outline.innerHTML = chapter.topics.map((topic, i) => `<a class="outline-link" href="#topic-${i}">${i + 1}. ${escapeHTML(topic[0])}</a>`).join("");
  }
  function renderTopic(topic, index) {
    return `<article class="topic-card" id="topic-${index}">
      <div class="chapter-kicker">SECTION ${String(index + 1).padStart(2, "0")}</div>
      <h2>${escapeHTML(topic[0])}</h2><p>${escapeHTML(topic[1])}</p>
      <h3>Example</h3><pre><code>${escapeHTML(topic[2])}</code></pre>
      <div class="callout"><strong>Remember:</strong> ${escapeHTML(topic[3])}</div>
      <div class="topic-footer"><span>Read, run, and experiment with this concept.</span><span>JavaScript fundamentals</span></div>
    </article>`;
  }
  function renderPlayground() {
    return `<section class="playground"><div class="chapter-kicker">HANDS-ON PRACTICE</div><h2>JavaScript playground</h2>
      <p class="lesson-intro">Write JavaScript and run it in a sandboxed frame. Use console.log() to display output.</p>
      <textarea id="playground-code" spellcheck="false" aria-label="JavaScript code">const language = 'JavaScript';\nconsole.log('Hello from ' + language + '!');\nconsole.log(2 + 3);</textarea>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="primary-button" id="run-code" type="button">▶ Run code</button><button class="secondary-button" id="clear-output" type="button">Clear output</button></div>
      <div class="playground-output" id="playground-output">Output will appear here.</div>
    </section>`;
  }
  function bindPlayground() {
    $("#run-code").addEventListener("click", () => {
      const code = $("#playground-code").value;
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts"); frame.style.display = "none";
      frame.srcdoc = `<!doctype html><script>
        const send=(...args)=>parent.postMessage({source:'js-mastery-playground',text:args.map(v=>{try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}).join(' ')},'*');
        console.log=send; console.error=(...a)=>send('Error:',...a); console.warn=(...a)=>send('Warning:',...a);
        window.onerror=(message)=>send('Error:',message);
        try { ${code.replaceAll("</script", "<\\/script") } catch(error) { send('Error:',error.message); }
      <\\/script>`;
      const output = $("#playground-output"); output.textContent = "Running…";
      const listener = event => {
        if (event.source !== frame.contentWindow || event.data?.source !== "js-mastery-playground") return;
        output.textContent = (output.textContent === "Running…" ? "" : output.textContent + "\\n") + event.data.text;
      };
      window.addEventListener("message", listener); document.body.append(frame);
      setTimeout(() => { window.removeEventListener("message", listener); frame.remove(); if (output.textContent === "Running…") output.textContent = "Code finished with no console output."; }, 700);
    });
    $("#clear-output").addEventListener("click", () => $("#playground-output").textContent = "Output cleared.");
  }
  function renderChapter() {
    const chapter = data.chapters[state.chapter];
    state.view = "lesson"; lesson.hidden = false; practice.hidden = true;
    $("#breadcrumb-current").textContent = chapter.title;
    renderOutline(chapter);
    lesson.innerHTML = `<div class="chapter-kicker">CHAPTER ${String(state.chapter + 1).padStart(2, "0")} / ${data.chapters.length}</div>
      <h1 class="lesson-title">${escapeHTML(chapter.title)}</h1><p class="lesson-intro">${escapeHTML(chapter.intro)}</p>
      ${chapter.topics.map(renderTopic).join("")}${renderPlayground()}
      ${state.chapter === data.chapters.length - 1 ? '<div class="chapter-practice-promo"><div><span class="chapter-kicker">YOU HAVE REACHED THE END</span><h2>Ready for the Knowledge Check?</h2><p>Test your understanding across the full JavaScript curriculum in one dedicated practice area.</p></div><button class="primary-button" id="open-final-knowledge-check" type="button">Start Knowledge Check →</button></div>' : ''}
      <div class="chapter-navigation"><button class="secondary-button" id="previous-chapter" ${state.chapter === 0 ? "disabled" : ""}>← Previous</button><button class="primary-button" id="next-chapter" ${state.chapter === data.chapters.length - 1 ? "disabled" : ""}>Next chapter →</button></div>`;
    $("#complete-chapter").textContent = state.completed.has(state.chapter) ? "✓ Chapter completed" : "Mark chapter complete";
    $("#complete-chapter").onclick = () => { state.completed.add(state.chapter); save(); renderNav(); $("#complete-chapter").textContent = "✓ Chapter completed"; toast("Chapter marked complete"); };
    const finalCheckButton = $("#open-final-knowledge-check");
    if (finalCheckButton) finalCheckButton.addEventListener("click", openPractice);
    $("#previous-chapter").addEventListener("click", () => selectChapter(state.chapter - 1));
    $("#next-chapter").addEventListener("click", () => selectChapter(state.chapter + 1));
    bindPlayground(); renderNav();
  }

  function makePracticeQuestions(mode) {
    if (mode === "random") {
      const pool = [...data.quiz];
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      return pool.slice(0, 10);
    }
    return [...data.quiz];
  }
  function renderPractice() {
    state.view = "practice"; lesson.hidden = true; practice.hidden = false;
    $("#breadcrumb-current").textContent = "Knowledge Check";
    outline.innerHTML = '<p class="aside-muted">Work through questions, submit your answers, and review explanations. Your lesson completion progress is separate from quiz scores.</p>';
    $("#complete-chapter").textContent = "Back to lessons";
    $("#complete-chapter").onclick = () => selectChapter(state.chapter);
    const questions = practiceState.questions;
    const submitted = practiceState.submitted;
    const score = questions.reduce((sum, q, i) => sum + (practiceState.answers[i] === q.a ? 1 : 0), 0);
    practice.innerHTML = `
      <div class="chapter-kicker">FINAL CHAPTER KNOWLEDGE CHECK</div>
      <h1 class="lesson-title">JavaScript Knowledge Check</h1>
      <p class="lesson-intro">Practice JavaScript concepts without interrupting your chapter lessons. Choose the full question bank or a shuffled 10-question round.</p>
      <div class="practice-summary">
        <div><strong>${data.quiz.length}</strong><span>Total questions</span></div>
        <div><strong>${Object.keys(practiceState.answers).length}</strong><span>Answered</span></div>
        <div><strong>${submitted ? score + "/" + questions.length : "—"}</strong><span>${submitted ? "Your score" : "Score after submit"}</span></div>
      </div>
      <div class="practice-toolbar">
        <label for="practice-mode">Question set</label>
        <select id="practice-mode"><option value="all" ${practiceState.mode === "all" ? "selected" : ""}>All 45 questions</option><option value="random" ${practiceState.mode === "random" ? "selected" : ""}>Random 10-question round</option></select>
        <button class="secondary-button" id="restart-practice" type="button">↻ New practice set</button>
      </div>
      <div class="practice-progress"><span style="width:${questions.length ? Object.keys(practiceState.answers).length / questions.length * 100 : 0}%"></span></div>
      <div class="practice-questions">
        ${questions.map((q, i) => `<article class="practice-question ${submitted ? (practiceState.answers[i] === q.a ? "is-correct" : "is-wrong") : ""}">
          <div class="practice-question-meta"><span>QUESTION ${String(i + 1).padStart(2, "0")}</span><span>${practiceState.answers[i] !== undefined ? "Answered" : "Not answered"}</span></div>
          <h2>${escapeHTML(q.q)}</h2>
          <div class="practice-options">${q.o.map((option, j) => `<label class="practice-option ${practiceState.answers[i] === j ? "selected" : ""} ${submitted && j === q.a ? "correct-answer" : ""}"><input type="radio" name="question-${i}" value="${j}" ${practiceState.answers[i] === j ? "checked" : ""} ${submitted ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + j)}</span><span>${escapeHTML(option)}</span>${submitted && j === q.a ? '<b class="option-mark">✓</b>' : ""}</label>`).join("")}</div>
          ${submitted ? `<div class="answer-explanation"><strong>${practiceState.answers[i] === q.a ? "Correct answer" : "Review this answer"}</strong><p>${escapeHTML(q.e)}</p></div>` : ""}
        </article>`).join("")}
      </div>
      <div class="practice-submit">
        ${submitted ? `<div class="score-panel"><span class="chapter-kicker">PRACTICE RESULT</span><strong>${score} / ${questions.length}</strong><p>${Math.round(score / questions.length * 100)}% correct · ${score === questions.length ? "Perfect score. Excellent work!" : "Review the explanations and try another round."}</p></div><button class="primary-button" id="retry-practice" type="button">Practice again →</button>` : `<p>${Object.keys(practiceState.answers).length} of ${questions.length} answered</p><button class="primary-button" id="submit-practice" type="button">Submit answers and see results</button>`}
      </div>`;
    if (!submitted) {
      practice.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener("change", () => {
        practiceState.answers[Number(input.name.replace("question-", ""))] = Number(input.value);
        renderPracticePreservingScroll();
      }));
      $("#submit-practice").addEventListener("click", () => {
        if (Object.keys(practiceState.answers).length !== questions.length) {
          toast("Please answer all questions before submitting."); return;
        }
        practiceState.submitted = true; renderPractice(); window.scrollTo({top:0,behavior:"smooth"});
      });
    } else {
      $("#retry-practice").addEventListener("click", () => startPractice(practiceState.mode));
    }
    $("#restart-practice").addEventListener("click", () => startPractice($("#practice-mode").value));
    $("#practice-mode").addEventListener("change", event => startPractice(event.target.value));
    renderNav();
  }
  function renderPracticePreservingScroll() {
    const y = window.scrollY; renderPractice(); window.scrollTo(0, y);
  }
  function startPractice(mode) {
    practiceState = {questions: makePracticeQuestions(mode), answers: {}, submitted: false, mode};
    renderPractice(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function openPractice() {
    if (!practiceState.questions.length) startPractice("all");
    else renderPractice();
    if (innerWidth <= 760) $("#sidebar").classList.remove("open");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function selectChapter(index) {
    if (index < 0 || index >= data.chapters.length) return;
    state.chapter = index; renderChapter(); window.scrollTo({top:0,behavior:"smooth"});
    if (innerWidth <= 760) $("#sidebar").classList.remove("open");
  }
  function search(query) {
    state.search = query.trim().toLowerCase();
    if (!state.search) { renderNav(); return; }
    const matches = [];
    data.chapters.forEach((chapter, index) => chapter.topics.forEach((topic, topicIndex) => {
      if (topic.join(" ").toLowerCase().includes(state.search)) matches.push({chapter,index,topicIndex,topic});
    }));
    nav.innerHTML = '<div class="nav-heading">SEARCH RESULTS</div>' + (matches.length ? matches.map(match =>
      `<button class="chapter-link" data-search-chapter="${match.index}" data-search-topic="${match.topicIndex}" type="button"><span class="num">${match.index + 1}</span><span>${escapeHTML(match.topic[0])}<small style="display:block;opacity:.7;margin-top:3px">${escapeHTML(match.chapter.title)}</small></span></button>`
    ).join("") : '<div class="empty-state">No matching sections found.</div>');
    nav.querySelectorAll("[data-search-chapter]").forEach(button => button.addEventListener("click", () => {
      selectChapter(Number(button.dataset.searchChapter));
      setTimeout(() => document.getElementById("topic-" + button.dataset.searchTopic)?.scrollIntoView({behavior:"smooth"}), 80);
    }));
  }

  $("#search-input").addEventListener("input", event => search(event.target.value));
  $("#mcq-nav").addEventListener("click", openPractice);
  $("#theme-toggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", state.theme === "dark");
    localStorage.setItem("js-mastery-theme", state.theme);
  });
  $("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#reset-progress").addEventListener("click", () => {
    if (confirm("Reset all saved chapter progress?")) { state.completed.clear(); save(); renderNav(); renderChapter(); toast("Progress reset"); }
  });
  document.body.classList.toggle("dark", state.theme === "dark");
  $("#search-input").addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); event.currentTarget.focus(); }
  });
  progress(); renderNav(); renderChapter();
})();