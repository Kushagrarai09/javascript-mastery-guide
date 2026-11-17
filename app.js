(function () {
  "use strict";
  const data = window.JS_MASTERY_CONTENT;
  if (!data || !Array.isArray(data.chapters)) {
    document.getElementById("lesson-area").textContent = "Course content could not be loaded. Check that content.js is available.";
    return;
  }
  const $ = selector => document.querySelector(selector);
  const nav = $("#chapter-nav"), lesson = $("#lesson-area"), outline = $("#chapter-outline");
  const state = {chapter:0, completed:new Set(JSON.parse(localStorage.getItem("js-mastery-completed") || "[]")), theme:localStorage.getItem("js-mastery-theme") || "light", search:""};
  let quizAnswers = {};
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
  function toast(message) { const el=$("#toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200); }
  function progress() {
    const percent=Math.round(state.completed.size/data.chapters.length*100);
    $("#progress-text").textContent=percent+"%"; $("#progress-bar").style.width=percent+"%";
    $("#chapter-count").textContent=data.chapters.length;
    $("#topic-count").textContent=data.chapters.reduce((sum,ch)=>sum+ch.topics.length,0);
    $("#quiz-count").textContent=data.quiz.length;
  }
  function save() { localStorage.setItem("js-mastery-completed",JSON.stringify([...state.completed])); progress(); }
  function renderNav() {
    nav.innerHTML='<div class="nav-heading">LEARNING PATH</div>'+data.chapters.map((ch,i)=>`<button class="chapter-link ${i===state.chapter?'active':''} ${state.completed.has(i)?'done':''}" data-chapter="${i}" type="button"><span class="num">${state.completed.has(i)?'✓':String(i+1).padStart(2,'0')}</span><span>${escapeHTML(ch.title)}</span></button>`).join('');
    nav.querySelectorAll("[data-chapter]").forEach(button=>button.addEventListener("click",()=>selectChapter(Number(button.dataset.chapter))));
  }
  function renderOutline(chapter) {
    outline.innerHTML=chapter.topics.map((topic,i)=>`<a class="outline-link" href="#topic-${i}">${i+1}. ${escapeHTML(topic[0])}</a>`).join('');
  }
  function renderTopic(topic,index) {
    return `<article class="topic-card" id="topic-${index}">
      <div class="chapter-kicker">SECTION ${String(index+1).padStart(2,'0')}</div>
      <h2>${escapeHTML(topic[0])}</h2>
      <p>${escapeHTML(topic[1])}</p>
      <h3>Example</h3>
      <pre><code>${escapeHTML(topic[2])}</code></pre>
      <div class="callout"><strong>Remember:</strong> ${escapeHTML(topic[3])}</div>
      <div class="topic-footer"><span>Read, run, and experiment with this concept.</span><span>JavaScript fundamentals</span></div>
    </article>`;
  }
  function renderQuiz() {
    const questions=data.quiz.slice(0,10);
    return `<section class="quiz-card"><div class="chapter-kicker">KNOWLEDGE CHECK</div><h2>Test your JavaScript understanding</h2><p class="lesson-intro">Answer these questions to check your understanding. The full question bank contains ${data.quiz.length} questions.</p><div id="quiz-questions">${questions.map((q,i)=>`<div class="quiz-item" data-index="${i}"><div class="quiz-question">${i+1}. ${escapeHTML(q.q)}</div>${q.o.map((option,j)=>`<button type="button" class="quiz-option" data-option="${j}" data-question="${i}">${String.fromCharCode(65+j)}. ${escapeHTML(option)}</button>`).join('')}<div class="quiz-feedback" id="feedback-${i}"></div></div>`).join('')}</div><button class="primary-button" id="submit-quiz" type="button">Check my answers</button><p id="quiz-result" class="quiz-feedback" aria-live="polite"></p></section>`;
  }
  function renderPlayground() {
    return `<section class="playground"><div class="chapter-kicker">HANDS-ON PRACTICE</div><h2>JavaScript playground</h2><p class="lesson-intro">Write JavaScript and run it in a sandboxed frame. Use console.log() to display output.</p><textarea id="playground-code" spellcheck="false" aria-label="JavaScript code">const language = 'JavaScript';\nconsole.log('Hello from ' + language + '!');\nconsole.log(2 + 3);</textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="primary-button" id="run-code" type="button">▶ Run code</button><button class="secondary-button" id="clear-output" type="button">Clear output</button></div><div class="playground-output" id="playground-output">Output will appear here.</div></section>`;
  }
  function bindQuiz() {
    quizAnswers={};
    document.querySelectorAll(".quiz-option").forEach(button=>button.addEventListener("click",()=>{
      const question=Number(button.dataset.question), option=Number(button.dataset.option);
      quizAnswers[question]=option;
      document.querySelectorAll(`[data-question="${question}"]`).forEach(el=>el.classList.toggle("selected",el===button));
    }));
    $("#submit-quiz").addEventListener("click",()=>{
      let score=0;
      data.quiz.slice(0,10).forEach((q,i)=>{
        const correct=quizAnswers[i]===q.a;
        if(correct) score++;
        $("#feedback-"+i).textContent=(correct?"Correct. ":"Not quite. ")+q.e;
      });
      $("#quiz-result").textContent=`You scored ${score}/10. ${score>=8?"Excellent work!":score>=5?"Good effort. Review the explanations and try again.":"Keep practicing. Revisit the sections and try again."}`;
    });
  }
  function bindPlayground() {
    $("#run-code").addEventListener("click",()=>{
      const code=$("#playground-code").value;
      const frame=document.createElement("iframe");
      frame.setAttribute("sandbox","allow-scripts");
      frame.style.display="none";
      frame.srcdoc=`<!doctype html><script>
        const send=(...args)=>parent.postMessage({source:'js-mastery-playground',kind:'log',text:args.map(v=>{try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}).join(' ')},'*');
        console.log=send; console.error=(...a)=>send('Error:',...a); console.warn=(...a)=>send('Warning:',...a);
        window.onerror=(message)=>send('Error:',message);
        try { ${code.replace(/<\/script/gi,"<\\/script")} } catch(error) { send('Error:',error.message); }
      <\/script>`;
      const output=$("#playground-output"); output.textContent="Running…";
      const listener=event=>{
        if(event.source!==frame.contentWindow || event.data?.source!=="js-mastery-playground") return;
        output.textContent=(output.textContent==="Running…"? "":output.textContent+"\n")+event.data.text;
      };
      window.addEventListener("message",listener);
      document.body.append(frame);
      setTimeout(()=>{window.removeEventListener("message",listener);frame.remove();if(output.textContent==="Running…")output.textContent="Code finished with no console output.";},700);
    });
    $("#clear-output").addEventListener("click",()=>$("#playground-output").textContent="Output cleared.");
  }
  function renderChapter() {
    const chapter=data.chapters[state.chapter];
    $("#breadcrumb-current").textContent=chapter.title;
    renderOutline(chapter);
    lesson.innerHTML=`<div class="chapter-kicker">CHAPTER ${String(state.chapter+1).padStart(2,'0')} / ${data.chapters.length}</div><h1 class="lesson-title">${escapeHTML(chapter.title)}</h1><p class="lesson-intro">${escapeHTML(chapter.intro)}</p>${chapter.topics.map(renderTopic).join('')}${renderQuiz()}${renderPlayground()}<div class="chapter-navigation"><button class="secondary-button" id="previous-chapter" ${state.chapter===0?'disabled':''}>← Previous</button><button class="primary-button" id="next-chapter" ${state.chapter===data.chapters.length-1?'disabled':''}>Next chapter →</button></div>`;
    $("#complete-chapter").textContent=state.completed.has(state.chapter)?"✓ Chapter completed":"Mark chapter complete";
    $("#complete-chapter").onclick=()=>{state.completed.add(state.chapter);save();renderNav();$("#complete-chapter").textContent="✓ Chapter completed";toast("Chapter marked complete");};
    $("#previous-chapter").addEventListener("click",()=>selectChapter(state.chapter-1));
    $("#next-chapter").addEventListener("click",()=>selectChapter(state.chapter+1));
    bindQuiz();bindPlayground();
  }
  function selectChapter(index) { if(index<0||index>=data.chapters.length)return;state.chapter=index;renderNav();renderChapter();window.scrollTo({top:0,behavior:"smooth"});if(innerWidth<=760)$("#sidebar").classList.remove("open"); }
  function search(query) {
    state.search=query.trim().toLowerCase();
    if(!state.search){renderNav();return;}
    const matches=[];
    data.chapters.forEach((chapter,index)=>chapter.topics.forEach((topic,topicIndex)=>{if(topic.join(" ").toLowerCase().includes(state.search))matches.push({chapter,index,topicIndex,topic});}));
    nav.innerHTML='<div class="nav-heading">SEARCH RESULTS</div>'+(matches.length?matches.map(match=>`<button class="chapter-link" data-search-chapter="${match.index}" data-search-topic="${match.topicIndex}" type="button"><span class="num">${match.index+1}</span><span>${escapeHTML(match.topic[0])}<small style="display:block;opacity:.7;margin-top:3px">${escapeHTML(match.chapter.title)}</small></span></button>`).join(''):'<div class="empty-state">No matching sections found.</div>');
    nav.querySelectorAll("[data-search-chapter]").forEach(button=>button.addEventListener("click",()=>{selectChapter(Number(button.dataset.searchChapter));setTimeout(()=>document.getElementById("topic-"+button.dataset.searchTopic)?.scrollIntoView({behavior:"smooth"}),80);}));
  }
  $("#search-input").addEventListener("input",event=>search(event.target.value));
  $("#theme-toggle").addEventListener("click",()=>{state.theme=state.theme==="dark"?"light":"dark";document.body.classList.toggle("dark",state.theme==="dark");localStorage.setItem("js-mastery-theme",state.theme);});
  $("#mobile-menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#reset-progress").addEventListener("click",()=>{if(confirm("Reset all saved chapter progress?")){state.completed.clear();save();renderNav();renderChapter();toast("Progress reset");}});
  document.body.classList.toggle("dark",state.theme==="dark");
  $("#search-input").addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();event.currentTarget.focus();}});
  progress();renderNav();renderChapter();
})();