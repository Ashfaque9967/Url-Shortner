# 🎨 Stage 1 — Build the UI (Make It Look 🔥)

## 📋 What We Cover
- Writing the HTML structure for our app
- Hooking up a Google Font for that clean look
- Adding a form to take user input
- Placeholder for displaying shortened URLs
- Visually verifying everything before touching the backend

> 💡 **The Golden Rule:** Don't move to Stage 2 until the UI looks clean in your browser. No backend needed yet — just pure HTML + CSS vibes.

---

## 🖥️ Step 1 — Write the HTML

Open `public/index.html` and paste this in:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>URL Shortener</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body>
  <div class="container">
    <h1>URL Shortener</h1>

    <form id="shorten-form">
      <div>
        <label for="url">Enter URL:</label>
        <input type="url" id="url" name="url" placeholder="https://example.com" required>
      </div>

      <div>
        <label for="shortcode">Enter Short Code:</label>
        <input type="text" id="shortcode" name="shortcode" placeholder="my-link" required>
      </div>

      <button type="submit">Shorten!</button>
    </form>

    <h2>Shortened URL:</h2>
    <ul id="shortened-urls"></ul>

  </div>
</body>

</html>
```

---

## 🔍 Breaking It Down — What Does Each Part Do?

| Element | ID / Attribute | Purpose |
|---|---|---|
| `<form>` | `id="shorten-form"` | 🎯 JavaScript will grab this to listen for submissions |
| `<input type="url">` | `name="url"` | 🔗 Takes the long URL from the user |
| `<input type="text">` | `name="shortcode"` | ✏️ Takes the custom short code from the user |
| `<button type="submit">` | — | 🚀 Triggers the form submission |
| `<ul>` | `id="shortened-urls"` | 📋 Empty for now — this is where links will appear later |

> 💡 **Why `name` attributes?** When we use `FormData` in Stage 2, it reads inputs using their `name` attribute. No `name` = data goes missing. Don't skip it!

---

## 🎨 Step 2 — Add Your CSS

Open `public/style.css` and paste in your CSS styles.

Don't have styles yet? Here's a solid starter to get you going:

```css
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Base */
body {
  font-family: 'Urbanist', sans-serif;
  background: #ffffff;
  color: #111111;
  line-height: 1.6;
  font-size: clamp(14px, 1.2vw, 16px);
}

/* Layout */
.container {
  max-width: 640px;
  margin: 10vh auto;
  padding: 0 clamp(16px, 5vw, 32px);
}

/* Typography */
h1 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  margin-bottom: clamp(32px, 6vh, 56px);
  letter-spacing: -0.02em;
}

h2 {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  font-weight: 600;
  margin-top: clamp(40px, 8vh, 64px);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
}

label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #666;
}

/* Form spacing */
form > div {
  margin-bottom: clamp(20px, 4vh, 32px);
}

/* Inputs */
input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  font-size: 1rem;
  background: transparent;
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus {
  border-bottom: 1px solid #000;
}

/* Button */
button {
  margin-top: 12px;
  padding: 12px 0;
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:hover {
  opacity: 0.8;
}

/* List */
ul {
  list-style: none;
}

li {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  word-break: break-all;
}

/* 🔻 Tablet tweaks */
@media (max-width: 768px) {
  .container {
    margin: 8vh auto;
  }
}

/* 🔻 Mobile tweaks */
@media (max-width: 480px) {
  .container {
    margin: 6vh auto;
  }

  button {
    padding: 14px 0;
  }
}
```

---

## 🧪 Step 3 — Test It in the Browser

Open `public/index.html` **directly** in your browser (just double-click the file — no server needed yet).

Here's what you should see:

| What to Check | Expected Result |
|---|---|
| Page loads | ✅ No blank screen |
| Font looks clean | ✅ Urbanist font applied |
| Form is visible | ✅ Two inputs + one button |
| Button click | ✅ Nothing happens (totally fine!) |
| URL list area | ✅ Empty — as expected |

> ⚠️ **Button does nothing right now — that's perfect.** We haven't wired up JavaScript yet. That's Stage 2's job!

---

## ✅ Checkpoint

Your browser should show a clean, styled URL Shortener form. If it looks good — **you're crushing it.** 🎉

If styles aren't applying:
- Make sure `style.css` is in the `public/` folder
- Double-check the `<link>` tag path in your HTML is `href="style.css"` (not `./public/style.css`)

---

## 📊 Quick Reference

| File | What You Did |
|---|---|
| `public/index.html` | Built the full UI structure with form and URL list |
| `public/style.css` | Added styling — dark theme, clean inputs, purple accents |

---

> 🔥 **Pro Tip:** The `<ul id="shortened-urls"></ul>` list is empty right now — but this is intentional. In Stage 5, JavaScript will dynamically inject `<li>` elements into it every time a new link is created. We're building the skeleton first, then bringing it to life. 💀➡️🧬