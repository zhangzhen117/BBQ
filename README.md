# CRUNCH Group BBQ 🔥

Website for the summer BBQs of the CRUNCH group at Brown University: when and where the next one is, and photos from past ones.

**Live site:** https://zhangzhen117.github.io/BBQ/

Plain HTML/CSS/JS, no build step. GitHub Pages serves the `main` branch directly.

## Adding a new BBQ (5 steps)

1. **Make a photo folder** named `photos/YYYY-MM-DD-place/` (for an upcoming BBQ without photos yet, skip to step 3).
2. **Copy the photos in and shrink them** so the repo stays small:
   ```bash
   python3 tools/resize_photos.py photos/2026-08-15-india-point/
   ```
   It resizes to max 1600 px, strips EXIF (location data etc.), and prints a `photos: [...]` block.
   iPhone `.HEIC` files need `pip install pillow-heif` once.
3. **Add an entry to `events.js`** — copy an existing block and fill in title, `start`/`end` (local time, `"YYYY-MM-DDTHH:MM"`), `location`, `mapUrl`, `notes`, `cover`, and paste the `photos` list. Remove the `placeholder: true` line.
   The page sorts events by date itself: the soonest future one becomes the "Next BBQ" card, the rest go to "Past BBQs".
4. **Preview locally** (optional):
   ```bash
   python3 -m http.server 8000
   # open http://localhost:8000
   ```
5. **Commit and push:**
   ```bash
   git add -A
   git commit -m "Add Summer BBQ 2026"
   git push
   ```
   GitHub Pages updates within a minute or two.

## Layout

| Path | What |
|------|------|
| `index.html` | the single page |
| `events.js` | **the only file to edit** for new events |
| `photos/<event>/` | photos, one folder per BBQ |
| `assets/css/style.css` | styles (warm summer palette in `:root` variables) |
| `assets/js/main.js` | renders events, countdown, calendar links, lightbox |
| `assets/img/hero.jpg` | big header picture — replace with a real BBQ photo (~1600×900) |
| `tools/resize_photos.py` | photo shrinker |

## Replacing the header picture

Drop a wide landscape photo at `assets/img/hero.jpg` (about 1600×900 px, under 400 KB). Run
`python3 tools/resize_photos.py assets/img/ --max 1600` if it is large.
