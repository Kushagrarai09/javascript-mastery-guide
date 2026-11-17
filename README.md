# JavaScript Mastery — Interactive Study Guide

> **Live website:** [https://kushagrarai09.github.io/javascript-mastery-guide/](https://kushagrarai09.github.io/javascript-mastery-guide/)

A responsive, browser-based JavaScript learning platform built with **HTML5, CSS3, and Vanilla JavaScript**. It takes learners from JavaScript fundamentals through browser APIs, asynchronous programming, debugging, and practical development habits using structured chapters, code examples, knowledge checks, and an in-browser playground.

## At a glance

| Learning resource | Included |
| --- | ---: |
| Structured chapters | 16 |
| Lesson topics | 80 |
| Quiz question bank | 45 |
| Questions in each knowledge check | 10 |
| External dependencies / build tools | None |

## Features

### Structured JavaScript curriculum
- 16 chapters covering beginner, intermediate, and practical JavaScript concepts.
- 5 lesson topics in each chapter, with explanations, code examples, and key reminders.
- Chapter navigation and a chapter outline for jumping between topics.
- Previous/next chapter navigation.
- Chapter completion checklist and an overall progress indicator.

### Interactive knowledge checks
- A bank of 45 multiple-choice questions.
- A 10-question knowledge check displayed in the chapter lesson view.
- Select answers, submit the quiz, see your score, and read explanations for each answer.

### Browser-based JavaScript playground
- Write and run JavaScript directly in the learning page.
- View `console.log()`, warning, and error output in the result panel.
- Clear the output and experiment with the examples.
- Code executes in a sandboxed iframe rather than the main learning page.

### Search and navigation
- Search lesson titles, explanations, examples, and key reminders.
- Jump from search results directly to the matching chapter and topic.
- Responsive sidebar navigation, including a mobile menu.

### Personal learning experience
- Light and dark themes.
- Chapter completion and learning progress saved in browser `localStorage`.
- Progress remains available in the same browser and origin until its site data is cleared or progress is reset.
- Responsive layout for desktop, tablet, and mobile screens.
- A link to the [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Curriculum

The guide contains the following 16 chapters:

1. **Getting Started with JavaScript** — what JavaScript is, runtimes, adding scripts, and your first program.
2. **Variables and Data Types** — declarations, primitive and reference values, types, conversion, and template literals.
3. **Operators and Expressions** — arithmetic, comparison, logical, assignment, and precedence.
4. **Conditional Statements** — if/else, switch, truthy and falsy values, and choosing conditions.
5. **Loops and Iteration** — while, do...while, for, for...of, for...in, break, and continue.
6. **Functions** — declarations, expressions, parameters, return values, arrow functions, rest/spread, scope, closures, and callbacks.
7. **Arrays and Array Methods** — creating and updating arrays, map, filter, reduce, searching, sorting, and copying.
8. **Objects and Object-Oriented JavaScript** — properties, methods, this, destructuring, prototypes, classes, and composition.
9. **Strings, Numbers, Math and Dates** — string operations, numeric conversion, Math, Date, and international formatting.
10. **DOM Manipulation** — the DOM, selecting elements, changing content and attributes, creating elements, and traversal.
11. **Events and Forms** — event listeners, event objects, propagation, delegation, form validation, keyboard use, and accessibility.
12. **Asynchronous JavaScript** — synchronous and asynchronous execution, callbacks, promises, async/await, and the event loop.
13. **Browser APIs and Web Storage** — window APIs, LocalStorage, SessionStorage, JSON, Fetch, timers, and clipboard.
14. **Modules and Modern JavaScript** — modules, imports/exports, optional chaining, nullish coalescing, Map, Set, and modern syntax.
15. **Error Handling and Debugging** — syntax, runtime, and logic errors; try/catch/finally; custom errors; DevTools; and defensive programming.
16. **JavaScript Projects and Best Practices** — code organization, immutability, testing fundamentals, performance basics, and project practice.

## Tech stack

- **HTML5** — page structure and semantic content.
- **CSS3** — responsive layout, component styling, and light/dark themes.
- **Vanilla JavaScript (ES6+)** — chapter rendering, navigation, search, quiz interactions, progress, theme preferences, and playground behavior.
- **Browser APIs** — LocalStorage, DOM, events, and sandboxed iframe execution.

No framework, package manager, server, or compilation step is required. The site is a static front-end project.

## Project structure

```text
javascript-mastery-guide/
├── index.html   # Application shell and page structure
├── styles.css   # Responsive styling, components, and themes
├── content.js   # Chapter content, lesson topics, and quiz bank
├── app.js       # Navigation, search, quizzes, progress, and playground
└── README.md    # Project documentation
```

## Run locally

### Option 1: Open the page

Open `index.html` in a modern browser.

### Option 2: Start a local static server

From the project directory, run:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

You can also use any other static file server. There is no `npm install` or build command.

## Deploy with GitHub Pages

This repository is configured to publish from the `main` branch and the repository root.

To configure or verify the deployment:

1. Open the repository's **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Select **main** as the branch and **/(root)** as the folder.
4. Save the settings.
5. Open the **Actions** tab and wait for the Pages deployment workflow to complete.
6. Visit the live site: [https://kushagrarai09.github.io/javascript-mastery-guide/](https://kushagrarai09.github.io/javascript-mastery-guide/).

Every new commit to the configured publishing branch can trigger a new Pages deployment.

## Using the guide

1. Open the live website or run the project locally.
2. Choose a chapter from the left navigation.
3. Read each topic and review its code example and reminder.
4. Use the search field to find a concept across the lessons.
5. Complete the knowledge check and review the answer explanations.
6. Experiment in the JavaScript playground.
7. Mark the chapter complete to update your saved progress.

## Progress and browser data

Chapter completion and the selected theme are stored in the browser using `localStorage`. This data is local to the browser profile and site origin; it is not synchronized to an account or a remote database. Use **Reset progress** in the interface to clear the saved chapter completion state.

## Browser support

Use a recent version of a modern browser with JavaScript enabled. The application uses standard browser features including DOM APIs, LocalStorage, and iframe sandboxing.

## Project status

This is a static, client-side educational project. It does not include user accounts, a backend API, cloud-synced progress, or server-side data storage.

---

Made for learning JavaScript through structured lessons, experimentation, and practice.
