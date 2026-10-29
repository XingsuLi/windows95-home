# My Little World 95

A Windows 95-inspired personal interest website, with movable windows, nested folders, a taskbar, and a little music. The desktop opens with no windows. Research and Photography are ready for your content; Essays contains replaceable sample entries.

## Run locally

Open `index.html`, or run this command in the project directory:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Visit <http://127.0.0.1:4176/>. This is a static HTML/CSS/JavaScript website with no dependencies or build step.

## Explore

- Double-click desktop and folder icons to open them. On a touchscreen, tap; with a keyboard, press Enter.
- Move, resize, stack, minimize, maximize, and close individual windows.
- Explore **My Computer → My Little World (C:) → Research / Essays / Photography**.
- Use the folder tree, breadcrumbs, Back, Forward, Up, and icon/detail views. Right-click a folder to open it in a separate window.
- Open nested Start menus, or a window system menu for keyboard movement and resizing. Arrow keys adjust; Enter confirms and Esc cancels.
- Window positions and sizes are remembered only in the current browser.
- Play original synthesized melodies in CD Player. Audio starts only after pressing Play, and stops when the player is closed.

The virtual disks and folders are read-only website navigation. They do not read or change files on a visitor’s computer. There are no guestbook, comment, editor, upload, or content-submission features. Visitors can browse, arrange windows, and listen to music; none of these actions changes the published content or another visitor’s view.

The site has no write API or database. Its Content Security Policy disables form submissions and JavaScript network connections. Published content is updated through the GitHub repository by an account with write permission, not through the website.

## Make it yours

- `shared/content.js`: research entries, essays (`journal`), photographs (`photography`), and little surprises.
- `index.html`: desktop shortcuts, help, and app content.
- `app.js`: folder hierarchy, about text, menus, and window behavior.
- `style.css`: desktop, windows, and responsive styling.

## Add photography

Copy your photographs into `photos/`, then add entries to the `photography` array in `shared/content.js`:

```js
photography: [
  {
    title: 'An Afternoon Walk',
    src: 'photos/walk.jpg',
    alt: 'Trees beside a quiet path',
    caption: 'A little way from home.',
    date: '2026'
  }
]
```

Use JPEG, PNG, WebP, or AVIF files, with paths relative to the website root. An optional `thumbnail` path can point to a smaller preview. The folder shows thumbnails; double-click a photograph to open the movable Photo Viewer. It supports Previous/Next, arrow keys, Fit to Window, and Actual Size. Missing images show a readable fallback.

Keep full-resolution originals separately; publish web-sized copies and remove location metadata you do not want to share. No example photographs are presented as your work. To publish changes, update the asset version in `index.html`, commit the images and content, and push the publishing branch.

## GitHub Pages

Publish the repository root from the `codex/github-pages` branch using GitHub Pages. Keep `.nojekyll` and the relative asset paths. Pushes to the publishing branch automatically update the site; no local server is needed for the published website.

Browser storage is used only for window positions and sizes. These preferences belong to each origin and browser and do not transfer automatically between local preview and the published site.
