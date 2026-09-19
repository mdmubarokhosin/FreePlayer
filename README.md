# Movi Player Pages

A production-ready static site that wraps [`movi-player`](https://www.npmjs.com/package/movi-player) v0.4.0 (served locally from `./assets/`) into a polished, embeddable video player. Drop an `<iframe>` on any page, point it at `/embed?url=<video-link>`, and play MKV, HEVC, AV1, HDR, HLS, DASH, multi-audio, embedded subtitles — directly in the browser. No transcoding. No server processing. 100% local.

Built with **Tailwind CSS** + **Bootstrap Icons**, both **pre-built and served locally** (no CDN dependency, survives COEP/COOP isolation). Ships with **light theme as the default**. Deployable to **Cloudflare Pages** in under two minutes. Once deployed, the player is reachable at:

```
https://<your-project>.pages.dev/embed?url=<video-link>
```

Drop that into an iframe on any page:

```html
<iframe
  src="https://my-player.pages.dev/embed?url=https://example.com/video.mkv"
  style="display:block;width:100%;max-width:800px;aspect-ratio:16/9;height:auto;border:0"
  allowfullscreen
  allow="fullscreen"
></iframe>
```

## What's in the box

### Two URL patterns

| URL | What it does |
|---|---|
| `/` | A polished landing page with hero, feature grid, "how it works" steps, paste-and-play demo, and a live iframe code generator that updates as you type |
| `/embed?url=<link>` | A minimal, chrome-less player page designed to be embedded inside an `<iframe>` on any other page |
| `/e?url=<link>`, `/v?url=<link>`, `/watch?url=<link>` | Short aliases for `/embed` (handled by `_redirects`) |

### Full feature parity with upstream movi-player

Both the slim (`element.slim.js`, 4.4 MB) and full (`element.js`, 11.8 MB) builds ship in `assets/`. Verified to expose the **identical 67-attribute surface** by:

1. **Code-level check** — `grep` for unique attribute names in each bundle returns exactly 67 matches in both files.
2. **Browser test** — headless Chrome confirmed identical runtime behaviour on HLS, DASH, and MP4 sources in both builds. All controls respond (Play, Seek, ±10s skip, Volume, Settings, Aspect, PiP, Fullscreen), Settings menu offers Quality / Playback speed / Aspect / Ambient / Stable volume / Crop bars / Loop, and video actually plays (seek bar advances).

| | Slim build (default) | Full build (alternative) |
|---|---|---|
| Initial JS download | 4.4 MB | 11.8 MB |
| WASM engine | Separate 5.4 MB `movi.wasm`, fetched on demand | Embedded as ~7 MB base64 inside the JS |
| First-play cost | Two HTTP requests, JS parses while WASM fetches | One HTTP request, larger single transfer |
| Cache strategy | JS + WASM each marked `immutable`, revalidated independently | Whole bundle re-downloads on version bump |
| Feature set | Full | Full (identical) |

## Project structure

```
.
├── index.html               # Landing page — hero + demo + features + how-it-works + CTA
├── embed.html               # Embeddable player — fills an iframe, no chrome
├── 404.html                 # Friendly on-brand 404
├── manifest.webmanifest     # PWA manifest (installable as an app)
├── _headers                 # COOP/COEP (SAB) + asset caching + iframe framing
├── _redirects               # /embed, /e, /v, /watch → /embed.html (200 rewrite)
├── robots.txt               # SEO + disallow /embed from indexing
├── sitemap.xml              # Single-page sitemap
├── favicon.svg              # App icon with gradient + drop shadow
├── README.md                # This file
├── .gitignore
└── assets/
    ├── element.slim.js      # movi-player slim bundle (4.4 MB, v0.4.0) — default
    ├── element.js           # movi-player full bundle (11.8 MB, v0.4.0) — embedded WASM alternative
    └── movi.wasm            # FFmpeg-WASM engine (5.4 MB) — used by the slim build
```

## Verified feature list (both builds)

### Source & playback
- **Containers:** MP4, MKV, WebM, MOV, AVI, FLV, WMV, M4V, TS, M2TS, MTS, OGV, 3GP, MPG, MPEG, MKA, M4B, OPUS, OGA, FLAC, MP3, AAC, AC-3, E-AC-3, DTS, WAV, M4A
- **Codecs:** H.264 (AVC), H.265 (HEVC), H.266 (VVC), AV1, VP8, VP9, Opus, AAC, MP3, FLAC, Vorbis, AC-3, E-AC-3, TrueHD, DTS, AMR
- **Streaming:** HLS (`.m3u8`) via hls.js, DASH (`.mpd`) via dashjs + shaka-player, with quality auto-switching and adaptive bitrate
- **HDR:** HDR10, HLG, Dolby Vision — rendered via WebGL2 `display-p3` color space on Chromium, with PQ tone-mapping fallback elsewhere
- **Encrypted playback:** ECDH P-256 + AES-256-GCM token-bound protocol (see `encrypted-server/` in the upstream repo)

### Controls & UI
- Play/Pause, Seek bar with thumbnail previews (`thumb` attr), ±10s skip buttons (`fastseek`)
- Volume slider, Mute, Playback speed (0.25x–2x, clamped to 1.5x for 4K+ sources)
- Settings menu: Quality picker, Playback speed, Aspect ratio, Ambient mode, Stable volume, Crop black bars, Loop
- Picture-in-Picture, Fullscreen, Exit fullscreen
- Aspect ratio presets (Fit/Cover/Fill/Zoom/Control)
- Rotation (0/90/180/270)
- Custom controls API: `addControl()` lets a host inject its own buttons + context-menu rows
- Host-supplied error screen via `slot="error"` + `errordisplay` event

### Subtitles & audio
- **Subtitle formats:** SRT, ASS/SSA (with karaoke + embedded font support via pluggable `SubtitleRenderer`), WebVTT, PGS (image-based), with subtitle size/colour/bg/edge/delay controls
- **Multi-audio track switching:** language-aware menu, persistent selection across loads
- **Audio output routing:** `audiooutput` attribute + `setAudioOutput()` API — route to specific device via `AudioContext.setSinkId`
- **Stable volume:** DynamicsCompressor-based loudness normalisation
- **Signalsmith stretch:** time-stretching without pitch change for non-1x playback

### Power features
- **Ambient mode:** sample average frame colour, paint as blurred glow on a wrapper element
- **Chapter markers:** from container atoms or external JSON via `chapters` attribute
- **Resume playback:** persist + restore position via `localStorage`
- **VR projections:** 360°, 180°, fisheye, SBS-3D, little-planet — with optional on-screen joystick (`vrpad`)
- **Poster generation:** `poster` + `postertime` for auto-generating a poster frame from a specific timestamp
- **Settings persistence:** `persist` attribute + `persistkey` namespace
- **Hotkeys:** full keyboard control (Space, arrows, F, M, etc.) — disable with `nohotkeys`
- **Gestures:** double-tap seek, swipe-to-seek, pinch-zoom (`doubletap`, `gesturefs`, `playsinline`)
- **Background play:** keep playing when tab is hidden (`backgroundplay`)
- **Adaptive engine priority:** `engine="wasm shaka dashjs hlsjs native"` lets you pick the order

### Full `HTMLMediaElement`-like surface
All 78 `HTMLMediaElement`/`HTMLVideoElement` members answer, including `buffered`, `seekable`, `played`, `textTracks`, `audioTracks`, `videoTracks`, `srcObject`, `canPlayType`, `captureStream`, `getVideoPlaybackQuality`, `requestVideoFrameCallback`, `setSinkId`, `fastSeek`, plus `abort`, `suspend`, `encrypted`, `waitingforkey`, `cuechange` events.

See the upstream [`AGENTS.md`](https://github.com/MrUjjwalG/movi-player/blob/main/AGENTS.md) for the complete attribute reference, and [`docs/api/element.md`](https://moviplayer.com/docs/api/element) for the public API.

## URL patterns the landing page accepts

| Pattern | What it does |
|---|---|
| `/?url=<link>` | Load and play `<link>` inline AND generate an iframe snippet for it |
| `/?url=<link>&title=My%20Video` | Set the on-screen title |
| `/?url=<link>&poster=<image-url>` | Show a poster image until play starts |
| `/?url=<link>&controls=0` | Hide the built-in control bar (drive your own UI) |

## URL patterns the embed page accepts

The embed page reflects every query param onto the `<movi-player>` element as an attribute (except `url` which is the source, and `utm_*` / `referrer` / `source` which are skipped to keep the DOM clean). So **all 67 of movi-player's attributes** are reachable via the URL:

| Param | Type | Effect |
|---|---|---|
| `url` | string (required) | The video source |
| `title` | string | On-screen title |
| `poster` | URL | Still image until play starts |
| `controls` | `0` to hide | Show/hide built-in control bar |
| `theme` | `dark`/`light` | UI theme. **Light is the default** — the embed ships `theme="light"` on the element. Pass `theme=dark` to flip the player and body to the dark palette. Without this param, the embed also respects `prefers-color-scheme: dark` (OS preference) — the player + body flip to dark for visitors whose OS is set that way. |
| `themecolor` | hex | `#8B5CF6` or `#8B5CF6 #22D3EE` |
| `autoplay` | `1` | Attempt autoplay (browser-muted rules apply) |
| `muted` | `1` | Start muted |
| `loop` | `1` | Loop at end |
| `objectfit` | `contain`/`cover`/`fill`/`zoom`/`control` | Video fill mode |
| `subtitlesize`, `subtitlecolor`, `subtitlebg`, `subtitleedge`, `subtitledelay` | — | Subtitle styling |
| `startat` | seconds | Seek to on load |
| `resume` | `1` | Persist + restore position via localStorage |
| `ambientmode` + `ambientwrapper` | — | Paint glow on a sibling element |
| `vr` | `360`/`180`/`fisheye`/`sbs`/`littleplanet` | Force VR projection |
| `engine` | space-separated list | Engine priority: `wasm shaka dashjs hlsjs native` |
| `stablevolume` | `1` | Loudness normalisation |
| `fallback` | `native` | Fall back to `<video>` if WASM fails |
| `thumb` | `1` | Seek-bar thumbnail previews |
| `fastseek` | `1` | ±10s skip buttons + arrow-key seeks |

### Cross-window messaging from the embed

The embed page posts `message` events to its parent window so the host page can react to player state without reaching into the iframe's document:

```js
window.addEventListener("message", (e) => {
  if (e.source !== document.querySelector("iframe").contentWindow) return;
  switch (e.data?.type) {
    case "movi-embed-loaded": console.log("Video ready"); break;
    case "movi-embed-error":  console.warn("Player error:", e.data.message); break;
    case "movi-embed-title":  console.log("Title:", e.data.title); break;
  }
});
```

## Local preview

```bash
# Any static file server works:
npx serve .                  # npm
python3 -m http.server 8080  # python
ruby -run -ehttpd . 8080     # ruby
```

Then visit:

- `http://localhost:8080/` — landing page (hero, demo, features, how-it-works)
- `http://localhost:8080/?url=…` — landing page with a video pre-loaded
- `http://localhost:8080/embed.html?url=…` — embeddable player (note: `/embed?url=…` without the extension only works after deploying to Cloudflare Pages — `_redirects` is a CF Pages feature)

> **Note:** `localhost` is a secure context in Chromium and Firefox, so SharedArrayBuffer works locally. Over `http://<lan-ip>`, the player falls back to plain ArrayBuffer I/O — still plays, slightly slower on large files.

## Deploy to Cloudflare Pages

### Option A — Connect GitHub (recommended)

1. **Push this folder to a new GitHub repo.** All files except `.git` are required.
2. Go to **Cloudflare dashboard → Pages → Create a project → Connect to Git**.
3. Pick the repo. Configure:
   - **Framework preset:** `None`
   - **Build command:** _(leave empty)_
   - **Build output directory:** `/` (the repo root)
   - **Root directory:** `/`
4. **Save and Deploy.** First deploy takes ~30 seconds.
5. Visit `https://<your-project>.pages.dev/` — landing page loads. Try the embed: `https://<your-project>.pages.dev/embed?url=https://example.com/video.mkv`.

Every `git push` to your default branch auto-deploys. Preview deployments are created automatically for pull requests.

### Option B — Direct upload

1. Cloudflare dashboard → Pages → **Upload assets**.
2. Zip the project folder, upload. Same URL pattern.

### Custom domain

Cloudflare Pages → your project → **Custom domains** → Set custom domain. CNAME is auto-configured if the domain is on Cloudflare; otherwise point a CNAME at `<your-project>.pages.dev`.

## CORS notes for the video source

When you set `?url=<some-mp4>`, the player fetches it directly from the visitor's browser:

- **Host sends CORS headers** (Cloudflare R2, S3, Bunny CDN, jsDelivr, GitHub raw with `?raw=true`, etc.): just works. Full byte-range seeking.
- **Host doesn't send CORS headers:** the player falls back to a no-CORS fetch — playback works for same-origin or `crossorigin="anonymous"`-compatible URLs, but byte-range seeking may be limited.
- **HLS / DASH:** m3u8 and mpd manifests play via the bundled hls.js / dashjs / shaka-player. Adaptive bitrate switching, multi-audio, and WebVTT subtitles work out of the box.

## Embedding from a cross-origin host page

If you embed `https://<your-project>.pages.dev/embed?url=…` inside an `<iframe>` on `https://blog.example.com/post`, the iframe's document is at the pages.dev origin — different from the parent. COOP=same-origin on the iframe means SAB only kicks in when the parent is the same origin (which it isn't here), so the player falls back to plain ArrayBuffer I/O. **It still plays**, just slightly slower on very large files.

For full SAB across origins, the parent page would need to set its own COOP/COEP headers (out of scope for this static project). Most use cases (MP4, HLS, DASH up to ~1080p) don't notice the difference.

## Upgrading movi-player

The player ships at version `0.4.0`. To bump to a future version:

1. Check available versions at <https://www.npmjs.com/package/movi-player>.
2. Replace the local copies:
   ```bash
   curl -fsSL -o assets/element.slim.js https://cdn.jsdelivr.net/npm/movi-player@<NEW_VERSION>/dist/element.slim.js
   curl -fsSL -o assets/element.js       https://cdn.jsdelivr.net/npm/movi-player@<NEW_VERSION>/dist/element.js
   curl -fsSL -o assets/movi.wasm        https://cdn.jsdelivr.net/npm/movi-player@<NEW_VERSION>/dist/movi.wasm
   ```
3. `index.html` and `embed.html` script tags + `wasmurl` attribute don't need to change — they reference `/assets/...` paths, not version-pinned URLs.
4. Commit and push — Cloudflare Pages auto-deploys.

## Switching between slim and full build

Both `index.html` and `embed.html` use the slim build by default (smaller JS, separate cached WASM). To switch either page to the full embedded-WASM build:

1. Change the `<script>` tag at the top:
   ```html
   <!-- from: -->
   <script type="module" src="/assets/element.slim.js"></script>
   <!-- to:   -->
   <script type="module" src="/assets/element.js"></script>
   ```
2. Remove (or comment out) the `wasmurl` attribute assignment in the inline script:
   ```js
   // Delete this line — the full build has the WASM embedded, no separate fetch.
   player.setAttribute("wasmurl", "/assets/movi.wasm");
   ```
3. Optionally delete `assets/movi.wasm` (saves 5.4 MB on disk, unused by the full build).

Both builds expose identical features — verified by attribute-surface check and headless browser test (HLS, DASH, MP4 all play correctly in both).

## Customising

- **Default to a specific video.** Hard-code a `src` on the `<movi-player>` element in `embed.html` and remove the `?url=` query-param handling.
- **Change the colour theme.** Edit the `:root` CSS custom properties at the top of `index.html` — `--accent`, `--accent-grad`, `--bg-base`, `--text-primary`, etc. are defined once and used everywhere.
- **Add your own UI controls inside the iframe.** Use `el.addControl({ icon, label, onClick })` from inside the iframe — see the [movi-player controls docs](https://moviplayer.com/docs/api/element).
- **Add ambient glow.** Wrap the iframe in a sibling element, set `?ambientmode=1&ambientwrapper=<css-selector>`.
- **Enable thumbnail scrubber previews.** `?thumb=1` is already set by default in `embed.html`; the player generates thumbnails on demand from the source.

## Light mode is the default — how it works

Both pages ship with **light theme as the explicit default**. The site is now built with **Tailwind CSS** + **Bootstrap Icons** (both via CDN — no build step). Three layers of theme handling:

1. **The baseline CSS** on `<body>` (and `<html data-theme="light">`) defines light tokens — `background: #f6f8fc` (cream), `color: #0a0f1e` (deep navy text). Tailwind utilities are used throughout with `dark:` variants that activate when `<html class="dark">` is set.

2. **`prefers-color-scheme: dark` fallback.** If a visitor's OS is set to dark mode, the inline JS auto-applies the `.dark` class to `<html>` so all `dark:` variants activate. No FOUC because the class is applied before Tailwind's CDN script paints.

3. **Manual toggle** (landing page only):
   - **UI**: a sun/moon toggle button in the top-right nav (Bootstrap Icons: `bi-sun-fill` / `bi-moon-stars-fill`). Click flips between light and dark immediately.
   - **Persistence**: the visitor's choice is saved in `localStorage["movi-theme"]`. A revisit respects it before the page renders (no FOUC).
   - **URL override on `/embed`**: pass `?theme=dark` or `?theme=light` to force a specific theme for that embed, regardless of OS or localStorage. Useful for embedding on a host page whose own design dictates the polarity — `?theme=dark` on a dark blog, `?theme=light` on a light blog.

To **force light unconditionally** and ignore both OS preference and the toggle, delete the OS-detection block in the inline `<script>` of the relevant file.

To **force dark unconditionally**, hardcode `<html class="dark">` in the HTML itself.

## Critical fix: `/embed` infinite redirect loop

Previous deployment had a `_redirects` file whose syntax caused `ERR_TOO_MANY_REDIRECTS` on the live `free-player.pages.dev` site. The fixed `_redirects`:

```
/embed  /embed.html 200
/e      /embed.html 200
/v      /embed.html 200
/watch  /embed.html 200
```

Status `200` is a rewrite (not a redirect) — Cloudflare serves `/embed.html` internally while keeping the URL as `/embed`. **The previous fix that added `/embed.html  /embed.html 200` actually CAUSED the loop**: Cloudflare matched that rule for `/embed.html`, tried to rewrite to `/embed.html`, normalised to `/embed`, matched the next rule, infinite loop. The fix is to have ONLY the `/embed → /embed.html` rule (no `/embed.html` self-rule).

## Critical fix: Tailwind CSS not loading under COEP

Previous deployment loaded Tailwind CSS via `https://cdn.tailwindcss.com/` (a Vercel-hosted JIT compiler script) and Bootstrap Icons via `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`. Both failed silently under the page's `Cross-Origin-Embedder-Policy: require-corp` header — Vercel's Tailwind CDN and jsDelivr don't send `Cross-Origin-Resource-Policy: cross-origin`, so the browser refused to apply their styles. Result: page rendered with browser-default serif fonts, no Tailwind utilities, "broken design".

**Fix** (this version):

1. **Pre-build Tailwind CSS at build time** → `assets/tailwind.css` (18 KB minified, contains only the utility classes actually used in `index.html` / `embed.html` / `404.html`). Re-build with `./rebuild-tailwind.sh` whenever you add a new utility class.
2. **Self-host Bootstrap Icons** → `assets/bootstrap-icons.css` (84 KB, points at `assets/fonts/bootstrap-icons.woff2` + `.woff`).
3. **Switch COEP from `require-corp` to `credentialless`** — same SAB-unlocking behaviour, but cross-origin no-credentials assets load without needing their own CORP header. The movi-player WASM (same-origin) keeps SAB; cross-origin CDNs we might add in the future also work.

## Rebuilding Tailwind CSS

The `assets/tailwind.css` file is **generated** from `tw-build/tailwind.css` + `tw-build/tailwind.config.js` — don't edit it directly. To rebuild:

```bash
./rebuild-tailwind.sh
```

Requirements: Node 18+ and `npm install` run once in `tw-build/` (the script handles that on first run).

When to rebuild:
- You added a new Tailwind utility class to any HTML file (e.g. `<div class="grid grid-cols-4">` → rebuild to include `grid-cols-4`)
- You added a new Bootstrap icon class (no rebuild needed — `bootstrap-icons.css` already contains all 2,000+ icon CSS classes)
- You edited custom CSS in `tw-build/tailwind.css` (the `.text-gradient`, `.code-block`, `.spinner`, decorative blob styles)

## Project structure

```
.
├── index.html              # Landing page — hero + demo + features + how-it-works + CTA
├── embed.html              # Embeddable player — fills an iframe, no chrome
├── 404.html                # Friendly on-brand 404
├── manifest.webmanifest    # PWA manifest
├── _headers                # COOP=so + COEP=credentialless (SAB still works)
├── _redirects              # /embed → /embed.html (200 rewrite, NO loop)
├── robots.txt              # SEO + disallow /embed from indexing
├── sitemap.xml             # Single-page sitemap
├── favicon.svg             # App icon with gradient + drop shadow
├── rebuild-tailwind.sh     # Rebuild assets/tailwind.css from tw-build/
├── README.md               # This file
├── .gitignore
├── tw-build/               # Tailwind SOURCE (regenerate assets/tailwind.css)
│   ├── tailwind.css        # Source: @tailwind directives + custom CSS
│   ├── tailwind.config.js  # Theme tokens + darkMode + content paths
│   └── node_modules/       # (gitignored) — Tailwind CLI
└── assets/
    ├── element.slim.js     # movi-player slim bundle (4.4 MB, v0.4.0) — default
    ├── element.js          # movi-player full bundle (11.8 MB, v0.4.0) — embedded WASM alternative
    ├── movi.wasm           # FFmpeg-WASM engine (5.4 MB) — used by the slim build
    ├── tailwind.css        # GENERATED — 18 KB minified, only used utilities
    ├── bootstrap-icons.css # 84 KB — references fonts/ below
    └── fonts/
        ├── bootstrap-icons.woff2  # 128 KB — modern browsers
        └── bootstrap-icons.woff   # 172 KB — legacy fallback
```

## License

Apache-2.0, matching the upstream `movi-player` project. See <https://github.com/MrUjjwalG/movi-player/blob/main/LICENSE>.
