# JavaScript Mastery — Interactive Study Guide

> **Live website:** [https://kushagrarai09.github.io/javascript-mastery-guide/](https://kushagrarai09.github.io/javascript-mastery-guide/)

A beginner-to-advanced, browser-based JavaScript learning platform built with **HTML, CSS and Vanilla JavaScript**. The course is organised into 15 chapters and 80 lesson sections. Each chapter combines conceptual explanations, worked code examples, guided reading prompts, practical assignments and an in-browser coding playground.

**This version is intentionally quiz-free.** MCQ questions, per-chapter quizzes and the separate Knowledge Check section are not part of the learning experience. The emphasis is on understanding concepts, tracing code, experimenting and building.

## Course overview

| Resource | Included |
|---|---:|
| Chapters | 15 |
| Lesson sections | 80 |
| Lessons in Chapters 1–14 | 5 per chapter |
| Lessons in Chapter 15 | 10 |
| MCQ / Knowledge Check quizzes | None |
| Front-end technologies | HTML, CSS, Vanilla JavaScript |

## What the platform includes

### 1. Structured chapter-based learning
- A guided 15-chapter learning path, ordered from JavaScript fundamentals to practical development.
- 80 lesson sections with topic titles, explanations, code examples and key reminders.
- A chapter introduction and learning objectives to set context before studying.
- Chapter navigation with previous and next controls.
- A chapter outline for jumping directly to a lesson section.

### 2. In-depth lesson presentation
Each lesson is presented with a consistent learning sequence:
- **Core concept:** an explanation of the topic and its role in JavaScript.
- **Worked JavaScript example:** source code illustrating the concept.
- **How to think about it:** guidance for reasoning about inputs, operations and results.
- **Practical application:** examples of where the concept is useful in real applications.
- **Common mistakes:** reminders to check assumptions, types, execution order and edge cases.
- **Key takeaway:** the central idea to remember.
- **Code-reading checklist:** prompts to identify inputs, operations, expected output and edge cases.

### 3. Chapter assignments
Every chapter includes a practical assignment encouraging learners to:
- Combine at least two concepts from the chapter.
- Build a working solution rather than copy an example.
- Use meaningful names and focused functions.
- Test at least three inputs, including an edge case.
- Refactor the solution after the first working version.

### 4. Browser-based JavaScript playground
- Write and run JavaScript from inside the course.
- Use `console.log()`, `console.warn()` and `console.error()` to inspect output.
- Clear the output and experiment with your own code.
- Code executes in a sandboxed iframe, separate from the main learning page.

### 5. Search and navigation
- Search lesson names, explanations, examples and reminders.
- Open a matching chapter and jump to the relevant lesson.
- Use the sidebar chapter list to move through the course.
- Use the mobile navigation on smaller screens.

### 6. Learning progress and preferences
- Mark chapters as completed.
- View an overall chapter completion percentage.
- Save chapter completion state in browser `localStorage`.
- Save the selected light/dark theme in `localStorage`.
- Reset saved chapter progress from the interface.

Progress is stored locally in the current browser profile and site origin. It is not associated with an account and does not sync across devices.

### 7. Responsive interface and reference
- Responsive desktop, tablet and mobile layouts.
- Light and dark display themes.
- Links to the [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Complete curriculum

The current source contains the following 15 chapters and 80 lesson sections.

| # | Chapter | Lesson sections |
|---:|---|---:|
| 1 | Getting Started with JavaScript | 5 |
| 2 | Variables and Data Types | 5 |
| 3 | Operators and Expressions | 5 |
| 4 | Conditional Statements | 5 |
| 5 | Loops and Iteration | 5 |
| 6 | Functions | 5 |
| 7 | Arrays and Array Methods | 5 |
| 8 | Objects and Object-Oriented JavaScript | 5 |
| 9 | Strings, Numbers, Math and Dates | 5 |
| 10 | DOM Manipulation | 5 |
| 11 | Events and Forms | 5 |
| 12 | Asynchronous JavaScript | 5 |
| 13 | Browser APIs and Web Storage | 5 |
| 14 | Modules and Modern JavaScript | 5 |
| 15 | Error Handling, Debugging, Projects and Best Practices | 10 |
| | **Total** | **80** |

### Topics covered across the course

The curriculum moves through the following areas:

- JavaScript, runtimes, engines, browser developer tools and script setup.
- Variables, primitive data types, type checking, type conversion and operators.
- Conditional logic, loops, functions, parameters, return values, scope and callbacks.
- Arrays, array methods, objects, object-oriented JavaScript, classes, prototypes and data structures.
- Strings, numbers, mathematical operations and dates.
- DOM selection and manipulation, browser events, forms and validation.
- Asynchronous JavaScript, promises, async/await and the event loop.
- Browser APIs, web storage, JSON and Fetch.
- JavaScript modules and modern language features.
- Error handling, debugging, project structure, best practices and practical project work.

## Technology stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure and application shell |
| CSS3 | Responsive layout, visual components and themes |
| Vanilla JavaScript (ES6+) | Chapter rendering, search, navigation, progress and playground |
| Browser APIs | DOM, events, LocalStorage and sandboxed iframe execution |

This is a static front-end project. It does not require a framework, package manager, backend service, database or compilation step.

## Repository structure

```text
javascript-mastery-guide/
├── index.html   # Application shell and page structure
├── styles.css   # Responsive styling, components and themes
├── content.js   # Chapter data, lesson explanations and examples
└── app.js       # Rendering, navigation, search, progress and playground
```

## Run locally

### Option 1 — Open directly

Open `index.html` in a modern browser with JavaScript enabled.

### Option 2 — Use a local static server

From the repository directory, run:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

No `npm install`, build command or environment variables are required.

## Deploy with GitHub Pages

The project is designed to deploy as a static website from the repository root.

1. Open **Settings → Pages** in this GitHub repository.
2. Set the source to **Deploy from a branch**.
3. Select the `main` branch and the `/(root)` folder.
4. Save the configuration.
5. Open the **Actions** tab and wait for the Pages workflow to finish.
6. Visit the published site: [JavaScript Mastery](https://kushagra rai09.github.io/javascript-mastery-guide/).

New commits to the configured publishing branch trigger a new deployment.

## Suggested learning workflow

1. Start with Chapter 1 and follow the chapters in order.
2. Read the lesson explanation before looking at the code.
3. Predict what the example will do.
4. Run it in the playground and inspect the output.
5. Change one value or statement and run it again.
6. Complete the chapter assignment using your own implementation.
7. Test normal inputs and edge cases, then mark the chapter complete.

## Project scope and limitations

- The course is a static, client-side learning application.
- It does not include login, user accounts, server-side APIs or a database.
- Chapter progress and theme preference are stored locally in the browser.
- Progress is not synchronized across browsers or devices.
- The project deliberately contains no MCQ quiz UI or Knowledge Check question bank.

## Contributing

Contributions that improve explanations, code examples, accessibility, navigation, responsive behavior or playground reliability are welcome.

For content changes, keep lesson titles, explanations, examples and key reminders aligned in `content.js`. For interface changes, update `app.js`, `index.html` and `styles.css` as appropriate, then test the course locally before publishing.

## Reference

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN — JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

---

Built to help learners understand JavaScript systematically through explanations, code tracing, experimentation and project practice.
