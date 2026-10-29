# My Little World 95

A Windows 95-inspired personal interest website, with movable windows, nested folders, a taskbar, and a little music. The profile, journal, and collections are sample content ready to make your own.

## Run locally

Open `index.html`, or run this command in the project directory:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Visit <http://127.0.0.1:4176/>. This is a static HTML/CSS/JavaScript website with no dependencies or build step.

## Explore

- Double-click desktop and folder icons to open them. On a touchscreen, tap; with a keyboard, press Enter.
- Move, resize, stack, minimize, maximize, and close individual windows.
- Explore **My Computer → My Little World (C:) → Favorites → Music / Books & Films / Wanderings**.
- Use the folder tree, breadcrumbs, Back, Forward, Up, and icon/detail views. Right-click a folder to open it in a separate window.
- Open nested Start menus, or a window system menu for keyboard movement and resizing. Arrow keys adjust; Enter confirms and Esc cancels.
- Change the wallpaper in Display Properties. Window bounds, wallpaper, notes, and Notepad drafts are stored only in the current browser.
- Play original synthesized melodies in CD Player. Audio starts only after pressing Play, and stops when the player is closed.

The virtual disks and folders are website navigation. They do not read or change files on a visitor’s computer. The Local Guestbook does not send messages to the site owner or share them with other visitors.

## Make it yours

- `shared/content.js`: collections, journal entries, and little surprises.
- `index.html`: welcome page, help, and app content.
- `app.js`: folder hierarchy, about text, menus, and window behavior.
- `style.css`: desktop, windows, and responsive styling.

## GitHub Pages

Publish the repository root from the `codex/github-pages` branch using GitHub Pages. Keep `.nojekyll` and the relative asset paths. Pushes to the publishing branch automatically update the site; no local server is needed for the published website.

Browser storage belongs to each origin and browser. Local preview notes and preferences do not transfer automatically to the published site.
