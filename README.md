# 🎬 Free Player

যেকোনো ভিডিও লিংক দিয়ে সরাসরি **ফুলস্ক্রিন প্লেব্যাক** — সম্পূর্ণ HTML5 দিয়ে তৈরি, npm/বিল্ড-স্টেপমুক্ত স্ট্যাটিক ওয়েবসাইট।

```
https://আপনার-সাইট.pages.dev/player.html?url=যেকোনো_ভিডিও_লিংক
```

লিংকটি খুললেই `movi-player` ইঞ্জিনের সব ফিচার, ডিজাইন ও ফাংশন নিয়ে ভিডিও ফুলস্ক্রিনে প্লে হবে।

---

## ✨ বৈশিষ্ট্য

| ফিচার | বর্ণনা |
|---|---|
| 🖼️ **Canvas রেন্ডারার** | WebAssembly সফটওয়্যার ডিকোডিং — ব্রাউজারে না চলা কোডেকেও ভিডিও দেখায় |
| 👆 **জেসচার ফুলস্ক্রিন** | ডাবল-ট্যাপ/ডাবল-ক্লিকে ফুলস্ক্রিন (`gesturefs`) |
| ⚡ **ফাস্ট সিক** | দ্রুত এগিয়ে/পিছিয়ে যাওয়া (`fastseek`) |
| 🔊 **স্টেবল ভলিউম** | ভলিউম লেভেল স্বাভাবিক রাখার প্রসেসিং (`stablevolume`) |
| 🛡️ **নেটিভ ফলব্যাক** | Canvas সাপোর্ট না থাকলে নেটিভ ভিডিওতে ফলব্যাক (`fallback="native"`) |
| 💾 **রিজিউম** | শেষ অবস্থান মনে রাখে (`resume` ফ্ল্যাগ) |
| 📱 **সম্পূর্ণ রেসপনসিভ** | মোবাইল থেকে ডেস্কটপ — সব স্ক্রিনে অপটিমাইজড |
| 🔌 **সম্পূর্ণ স্বয়ংসম্পূর্ণ** | ইঞ্জিন (`element.js`, WASM সহ) এই রিপোতেই বান্ডেলড — CDN-নির্ভরতা নেই |

---

## 📁 ফাইল স্ট্রাকচার

```
free-player/
├── index.html          # ল্যান্ডিং পেজ (URL ইনপুট, ডেমো, ফ্ল্যাগ গাইড, এমবেড জেনারেটর)
├── player.html         # ফুলস্ক্রিন প্লেয়ার (?url= প্যারামিটার)
├── 404.html            # Cloudflare Pages 404 পেজ
├── assets/
│   └── element.js      # movi-player ইঞ্জিন (অরিজিনাল ক্লোন, WASM এমবেডেড — 12.2 MB)
├── css/
│   └── style.css       # ল্যান্ডিং পেজের স্টাইল
├── js/
│   └── app.js          # ল্যান্ডিং পেজের লজিক (ভ্যানিলা JS)
├── favicon.svg         # ফেভিকন
├── _headers            # Cloudflare Pages কাস্টম হেডার (ক্যাশ + CORS)
├── .gitignore
├── LICENSE             # MIT
└── README.md
```

> **গুরুত্বপূর্ণ:** `assets/element.js` হলো `movi-player@0.4.1` npm প্যাকেজের **অপরিবর্তিত অরিজিনাল বিল্ড**।
> এর WASM ডিকোডার ফাইলের ভিতরেই এমবেড করা থাকে — তাই আলাদা কোনো `.wasm` ফাইল লাগে না এবং
> যেকোনো স্ট্যাটিক হোস্টে সরাসরি কাজ করে।

---

## 🚀 Cloudflare Pages-এ ডিপ্লয় (GitHub দিয়ে)

1. **GitHub রিপো তৈরি করুন** (যেমন `free-player`) এবং এই ফোল্ডারের সব ফাইল আপলোড করুন:
   ```bash
   git init
   git add .
   git commit -m "Free Player — initial release"
   git branch -M main
   git remote add origin https://github.com/আপনার-ইউজারনেম/free-player.git
   git push -u origin main
   ```
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**।
3. GitHub রিপোটি সিলেক্ট করে বিল্ড সেটিংস দিন:
   - **Framework preset:** `None`
   - **Build command:** _(ফাঁকা রাখুন)_
   - **Build output directory:** `/`
4. **Save and Deploy** চাপুন — কয়েক সেকেন্ডেই সাইট লাইভ হবে:
   `https://free-player-xxx.pages.dev`

> **Direct Upload** পদ্ধতিতেও ডিপ্লয় করতে পারেন: Pages → Create → **Upload assets** → zip-এর ভিতরের ফাইলগুলো ড্র্যাগ করুন (ফাইল সাইজ লিমিট: ২৫ MB/ফাইল — আমাদের ১২.২ MB ফাইল ঠিকঠাক আসবে)।

---

## 🖥️ লোকালি চালানো

যেকোনো স্ট্যাটিক সার্ভার দিয়ে ফোল্ডারটি সার্ভ করুন:

```bash
# Python
python3 -m http.server 8080

# অথবা Node (npx ছাড়া অন্য কিছু লাগবে না)
npx serve .
```

এরপর ব্রাউজারে: `http://localhost:8080`

> সরাসরি `file://` দিয়ে খুললে ব্রাউজারের ES module নীতির কারণে প্লেয়ার লোড হবে না — লোকাল HTTP সার্ভার ব্যবহার করুন।

---

## 🔗 ব্যবহারবিধি

### মূল লিংক
```
/player.html?url=https://example.com/video.mp4
```

### URL ফ্ল্যাগসমূহ

| ফ্ল্যাগ | মান | কাজ |
|---|---|---|
| `url` / `src` | ভিডিও লিংক | যে ভিডিও প্লে হবে (আবশ্যক) |
| `autoplay` | `1` | স্বয়ংক্রিয় প্লে (ব্রাউজার নীতি অনুযায়ী) |
| `muted` | `1` | মিউট অবস্থায় শুরু |
| `loop` | `1` | ভিডিও লুপ হবে |
| `t` | সেকেন্ড | নির্দিষ্ট সময় থেকে শুরু (যেমন `t=90`) |
| `poster` | ছবির লিংক | প্লে হওয়ার আগে থাম্বনেইল |
| `resume` | `1` | শেষ অবস্থান থেকে চালাবে |
| `fit` | `contain` / `cover` / `fill` / `zoom` / `control` | ভিডিও ফিট মোড |
| `theme` | `dark` / `light` | কন্ট্রোল থিম |
| `rotate` | `0` / `90` / `180` / `270` | ভিডিও ঘুরিয়ে দেখা |
| `engine` | `wasm` / `native` / `hlsjs` / `dashjs` / `shaka` | ইঞ্জিন নির্বাচন |

**উদাহরণ:**
```
/player.html?url=https://example.com/movie.mp4&autoplay=1&muted=1&t=30&poster=https://example.com/thumb.jpg
```

### iframe এমবেড
```html
<iframe src="https://আপনার-সাইট.pages.dev/player.html?url=ভিডিও_লিংক"
  style="width:100%;aspect-ratio:16/9;border:0"
  allowfullscreen allow="fullscreen"></iframe>
```

---

## ⚠️ ভিডিও সোর্সের শর্ত

প্লেয়ার শুধু **লিংক** প্লে করে — কোনো ভিডিও হোস্ট বা সংরক্ষণ করে না। স্মুথ প্লেব্যাকের জন্য ভিডিও সার্ভারে থাকতে হবে:

- **CORS** হেডার (`Access-Control-Allow-Origin: *`)
- **Range রিকোয়েস্ট** সাপোর্ট (`Accept-Ranges: bytes`)
- সরাসরি `http://` বা `https://` লিংক (HLS `.m3u8` / DASH `.mpd` স্ট্রিমও কাজ করে)

---

## 🛠️ প্রযুক্তি

- সম্পূর্ণ **HTML5 + CSS + ভ্যানিলা JavaScript** — কোনো npm, বান্ডলার বা বিল্ড স্টেপ নেই
- প্লেয়ার ইঞ্জিন: [movi-player](https://www.npmjs.com/package/movi-player) (MIT) — WebAssembly ডিমাক্সার/ডিকোডার বিল্ট-ইন
- হোস্টিং-অপ্টিমাইজড: Cloudflare Pages `_headers` কনফিগ অন্তর্ভুক্ত

## 📄 লাইসেন্স

MIT — বিস্তারিত [`LICENSE`](LICENSE) দেখুন। বান্ডেলড ইঞ্জিন `element.js` এর স্বত্ব ও লাইসেন্স আপস্ট্রিম `movi-player` প্যাকেজের।
