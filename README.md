# Owen — Portfolio & Learning

A responsive, multi-page personal and academic website built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

## Pages

- `index.html` — personal home page
- `portfolio.html` — projects with category filters
- `learning.html` — educational resources, an interactive quadratic graph, study guidance, and rotating questions
- `about.html` — introduction and space for a fuller biography

## Run locally

From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The site can be hosted directly by GitHub Pages. Publishing and repository Pages settings are managed separately.

## Personalise

Update the biography in `about.html` and add your academic background and contact details when ready. Add real academic projects to `portfolio.html`; each project's `data-category` controls its category filter. The current projects refer to working features on this site. No academic results, affiliations, or qualifications are assumed.

Colours and responsive layouts live in `style.css`. Fonts use Google Fonts with local system fallbacks. There are no API keys, analytics, or required external services.
