# 📡 Stage 5 — Show Me The Links! (Fetch + Display)

## 📋 What We Cover
- Creating a GET `/links` route on the backend
- Fetching all saved links from the frontend
- Dynamically rendering links into the page using JavaScript
- Auto-refreshing the list after every new submission
- Loading existing links on page load

> 💡 **The Golden Rule:** Don't move to Stage 6 until shortened links appear on the page automatically — both on load AND after submitting a new one. If you can see your links without opening `links.json` manually, you've nailed it. 🎯

---

## 🧠 The Big Idea First

Right now, links get saved to `links.json` — but the user has no idea. They get an alert and... nothing. That's not good enough. Let's fix it:

```
Page loads
    ↓
Frontend asks GET /links
    ↓
Server reads links.json and sends it back as JSON
    ↓
JavaScript loops through the data
    ↓
Builds <li> elements and injects them into the <ul>
    ↓
User sees all their links — live on the page ✅
```

And every time a new link is added — we repeat this process automatically. Real-time feel, zero page refresh. 🔥

---

## ✍️ Step 1 — Add GET `/links` Route to Backend

Open `app.js`. Inside `createServer`, add this new route in the GET block — **after** the `/style.css` route and **before** any POST handling:

```js
// Route 3: Send all saved links as JSON
else if (req.url === "/links") {
  const data = await readFile("data/links.json", "utf-8");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(data);
}
```

That's it for the backend this stage. One route, three lines. Clean. 🧹

---

## 🔍 Why a Separate `/links` Route?

We could technically serve `links.json` directly as a static file — but that's not how real apps work. A dedicated API route gives us control:

| Approach | Problem |
|---|---|
| Serving `links.json` as a static file | Exposes raw file, no control over format |
| Dedicated `/links` API route | ✅ Clean, controlled, ready to upgrade later |

Later, if you switch from a JSON file to a database — only this one route changes. The frontend stays exactly the same. That's good architecture. 🏛️

---

## ✍️ Step 2 — Upgrade the Frontend Script (FINAL Version)

Open `public/index.html` and **replace your entire `<script>` block** with this final version:

```html
<script>
  const form = document.getElementById("shorten-form");
  const list = document.getElementById("shortened-urls");

  // ─── Fetch and Display All Links ──────────────────────────────
  const fetchLinks = async () => {
    const res = await fetch("/links");
    const data = await res.json();  // Parse JSON response → JS object

    // Clear the list before re-rendering (avoid duplicates)
    list.innerHTML = "";

    // Loop through every saved link and build a list item
    for (const [code, url] of Object.entries(data)) {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="${window.location.origin}/${code}" target="_blank">
          ${window.location.origin}/${code}
        </a>
        → ${url}
      `;

      list.appendChild(li);
    }
  };

  // ─── Handle Form Submission ────────────────────────────────────
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const url = formData.get("url");
    const shortcode = formData.get("shortcode");

    const response = await fetch("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, shortcode })
    });

    if (response.ok) {
      alert("URL shortened successfully! 🎉");
      event.target.reset();
      fetchLinks();  // ← Refresh the list immediately after saving
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  });

  // ─── Load Links on Page Load ───────────────────────────────────
  fetchLinks();  // ← Runs once immediately when the page opens
</script>
```

---

## 🔍 Breaking Down `fetchLinks` — The Real Magic

### Reading the Response
```js
const res = await fetch("/links");
const data = await res.json();
```
- `fetch("/links")` — hits our new backend route
- `res.json()` — parses the JSON response into a real JS object like `{ "yt": "https://youtube.com" }`

---

### Clearing Before Re-rendering
```js
list.innerHTML = "";
```
Every time we call `fetchLinks`, we wipe the list first. Without this, every refresh would **add duplicate entries** on top of existing ones. 👻

---

### Looping Through the Data
```js
for (const [code, url] of Object.entries(data)) {
```
`Object.entries()` converts an object into an array of `[key, value]` pairs:

```js
// Input
{ "yt": "https://youtube.com", "gh": "https://github.com" }

// Object.entries() output
[
  ["yt", "https://youtube.com"],
  ["gh", "https://github.com"]
]
```

We destructure each pair directly as `[code, url]`. Clean and readable. ✨

---

### Building Each List Item
```js
li.innerHTML = `
  <a href="${window.location.origin}/${code}" target="_blank">
    ${window.location.origin}/${code}
  </a>
  → ${url}
`;
```

| Part | Output |
|---|---|
| `window.location.origin` | `http://localhost:3000` |
| `/${code}` | `/yt` |
| Combined | `http://localhost:3000/yt` |
| `target="_blank"` | Opens in a new tab |

So each list item looks like:
```
http://localhost:3000/yt → https://youtube.com
```

---

### The Two `fetchLinks()` Calls
```js
// Inside submit handler — runs after every new link is saved
fetchLinks();

// Outside everything — runs once when the page first loads
fetchLinks();
```

This means:
- **On page load** → existing links appear instantly
- **After submission** → list updates without any manual refresh

That's the silky smooth UX we're going for. 😎

---

## 🧪 Step 3 — Test It

1. Restart server — `Ctrl + C` then `node app.js`
2. Visit `http://localhost:3000`
3. Your previously saved links should appear immediately on load
4. Submit a new link → list updates instantly, no refresh needed

---

## ✅ Checkpoint

| What to Check | Expected Result |
|---|---|
| Links load on page open | ✅ Existing links from `links.json` appear |
| New link appears after submit | ✅ List refreshes automatically |
| Short URL format is correct | ✅ Shows `http://localhost:3000/yt` |
| Original URL shown next to it | ✅ `→ https://youtube.com` |
| No duplicate entries on refresh | ✅ `list.innerHTML = ""` clearing works |

---

## 📊 Quick Reference

| Concept | Key Takeaway |
|---|---|
| `GET /links` route | Returns all saved links as JSON |
| `fetch("/links")` | Hits the backend and gets the data |
| `res.json()` | Parses JSON response into a JS object |
| `Object.entries(data)` | Converts object to `[key, value]` pairs for looping |
| `list.innerHTML = ""` | Clears list before re-rendering to avoid duplicates |
| `window.location.origin` | Gives the base URL e.g. `http://localhost:3000` |
| `fetchLinks()` on load | Shows saved links immediately when page opens |
| `fetchLinks()` after submit | Refreshes list after every new link is added |

---

> 🔥 **Pro Tip:** Notice that `fetchLinks` is defined as a standalone function — not tucked inside the event listener. This is intentional. A function defined inside an event listener can only be called from inside that listener. By keeping it outside, we can call it from **anywhere** — on load, after submit, or even on a timer if we wanted live updates. Always think about reusability when writing functions. 🧠