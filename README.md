# JavaScript Mastery — Interactive Study Guide

A responsive, static learning platform with 15 detailed JavaScript chapters, searchable notes, code examples, quizzes, chapter progress, a browser playground and reference links.

## Features

- 15 populated chapters and 89 learning sections
- 45 interactive quiz questions with scoring
- Detailed explanations, code examples, chapter assignments and interview questions
- Browser-based JavaScript playground
- Searchable learning content and reference library
- Progress tracking with LocalStorage
- Responsive layout and dark/light themes

## Run locally

Open `index.html` directly, or serve this directory over HTTP for the most consistent browser behavior:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`, then save.
4. Wait for the Pages deployment to finish. The site will be available at `https://kushagrarai09.github.io/javascript-mastery-guide/`.

## Project structure

```text
javascript-mastery-guide/
├── index.html   # App shell and page structure
├── styles.css   # Responsive styles and themes
├── content.js   # Chapter, topic, example, assignment and quiz data
├── app.js       # Navigation, search, quiz, progress and playground logic
└── README.md    # Project documentation
```

## Tech stack

HTML5, CSS3 and Vanilla JavaScript. No build step or package installation is required.
