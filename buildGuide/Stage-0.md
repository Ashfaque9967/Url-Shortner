# 🚀 Stage 0 — Project Setup (Let's Get This Party Started!)

## 📋 What We Cover
- Creating the project folder structure
- Initializing Node.js
- Setting up the JSON database file
- Confirming everything is in place before we write a single line of logic

> 💡 **The Golden Rule:** Don't move to Stage 1 until this stage works perfectly. Seriously. Future-you will thank present-you.

---

## 🗂️ Step 1 — Create Your Project Folder

Fire up your terminal and punch this in:

```bash
mkdir url-shortener
cd url-shortener
```

Boom. You just created your project's home. 🏠

---

## 🌳 Step 2 — Build the Folder Structure

Now let's create all the files and folders we'll need:

```bash
mkdir public data
touch app.js
touch data/links.json
touch public/index.html
touch public/style.css
```

Here's what each piece does:

| File / Folder | Purpose |
|---|---|
| `app.js` | 🧠 The brain — your entire backend server lives here |
| `data/links.json` | 💾 Your mini-database — stores all shortened URLs |
| `public/index.html` | 🖥️ The face — what users actually see |
| `public/style.css` | 🎨 The glow-up — makes everything look good |

---

## ⚙️ Step 3 — Initialize Node.js

```bash
npm init -y
```

This creates your `package.json`. Now open it and add one critical line:

```json
{
  "type": "module"
}
```

**Why?** This tells Node to use modern ES Module syntax (`import`/`export`) instead of the old `require()` style. We're writing *modern* JavaScript here. 😎

---

## 💾 Step 4 — Seed the JSON Database

Open `data/links.json` and add:

```json
{}
```

That's it. Just an empty object. This is where all your short code → URL mappings will live, like:

```json
{
  "my-link": "https://example.com",
  "yt": "https://youtube.com"
}
```

But for now — empty and ready. A blank canvas. 🎨

---

## ✅ Checkpoint — Does Your Structure Look Like This?

```
url-shortener/
├── data/
│   └── links.json     ← has {}
├── public/
│   ├── index.html     ← empty for now
│   └── style.css      ← empty for now
├── app.js             ← empty for now
└── package.json       ← has "type": "module"
```

If yes — **YOU'RE READY.** High five. 🙌

If no — don't panic, just re-check each step above. One file at a time.

---

## 📊 Quick Reference

| Command | What It Does |
|---|---|
| `mkdir url-shortener` | Creates the project folder |
| `cd url-shortener` | Jumps inside it |
| `mkdir public data` | Creates two subfolders |
| `touch app.js` | Creates the backend file |
| `npm init -y` | Sets up Node.js with defaults |

---

> 🔥 **Pro Tip:** Keep your terminal open in the `url-shortener/` directory for the entire project. Every command from here on runs from this root. Don't close it, don't change directory — just keep it locked in. 🎯