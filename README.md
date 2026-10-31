# Owen’s website

A minimal personal website. No installs or build step needed.

## Add your own content on GitHub

1. Open **content.js** in your repository and click the pencil (Edit).
2. Edit your name, introduction, or About paragraphs at the top.
3. To add work or resources, copy an example inside the relevant list and remove the leading `//` from each line. Replace its title, URL, and description with your own.
4. Click **Commit changes** and save to `main`. GitHub Pages will redeploy.

You only need to edit **content.js**. Work and resources automatically appear on both the home page and their own pages. The description is optional. Leave a list empty to show its short empty message.

### Example entry

```js
work: [
  {
    title: "My project",
    url: "files/my-project.pdf",
    description: "What the project is about."
  },
  {
    title: "Another project",
    url: "https://example.com/project"
  }
],
```

Keep quotes around text. Separate entries with commas. If you need a double quotation mark inside text, write `\"`, or use curly quotation marks. These fields are plain text, not HTML.

## Upload a PDF or image

1. Open the **files** folder on GitHub.
2. Choose **Add file → Upload files**, select your file, and commit it.
3. Add an entry in **content.js** with a matching URL, such as `files/my-notes.pdf`.

Use simple filenames, such as `physics-notes.pdf`. Filenames are case-sensitive. Use a full `https://…` URL for external websites. Anything uploaded here, including Git history, is public.

## Preview before publishing

Download the repository as a ZIP, extract it, and open **index.html** in your browser. The content lists work without a server.

Or run `python3 -m http.server 8000 --bind 127.0.0.1` from the repository directory.

## Files

- `content.js`: your name, introduction, biography, work, and resources
- `files/`: your uploaded documents and images
- `index.html`, `portfolio.html`, `learning.html`, `about.html`: page structure
- `style.css`: layout and colours
- `site.js`: displays your content
- `theme.js`: light/dark mode and splatter reveal

The site keeps plain HTML navigation and empty-state text as a fallback if JavaScript is unavailable. Theme animations respect reduced motion and browser support.
