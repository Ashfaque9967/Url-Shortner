# 🚀 Stage 6 — The Final Magic (Redirect!)

## 📋 What We Cover
- Adding a catch-all route to handle short code URLs
- Reading the short code from the request URL
- Looking it up in `links.json`
- Redirecting the user to the original URL
- Handling the case where a code doesn't exist

> 💡 **The Golden Rule:** Don't call this project done until clicking a short link actually takes you somewhere. That's the whole point. That's the magic. Let's make it happen. 🎯

---

## 🧠 The Big Idea First

Every short URL looks like this:

```
http://localhost:3000/yt
```

When someone visits that URL, the browser sends a GET request to our server with `req.url = "/yt"`. We:

1. Strip the `/` to get just `"yt"`
2. Look it up in `links.json`
3. If found → redirect to the original URL
4. If not found → send a 404

```
Browser visits http://localhost:3000/yt
        ↓
Server receives req.url = "/yt"
        ↓
Strips "/" → code = "yt"
        ↓
Looks up "yt" in links.json
        ↓
Found! → 302 Redirect → https://youtube.com
        ↓
Browser lands on YouTube ✅
```

One route. Pure satisfaction. 😎

---

## ✍️ Step 1 — Add the Catch-All Redirect Route

Open `app.js`. Find your GET routing block — it currently looks like this:

```js
if (req.url === "/") {
  // serves index.html
} else if (req.url === "/style.css") {
  // serves style.css
} else if (req.url === "/links") {
  // serves links.json
}
```

Add this `else` block **at the very end** of that chain:

```js
else {
  // Everything else — treat the URL as a short code
  const code = req.url.slice(1); // "/yt" → "yt"

  // Load all saved links
  const data = await readFile("data/links.json", "utf-8");
  const links = JSON.parse(data);

  if (links[code]) {
    // ✅ Code found — redirect to original URL
    res.writeHead(302, { Location: links[code] });
    res.end();
  } else {
    // ❌ Code not found — send 404
    res.writeHead(404);
    res.end("404 — Short link not found.");
  }
}
```

---

## 🔍 Breaking It Down — Every Line Explained

### Extracting the Short Code
```js
const code = req.url.slice(1);
```

`req.url` always includes the leading `/`. We don't want that:

| `req.url` | After `.slice(1)` |
|---|---|
| `"/yt"` | `"yt"` |
| `"/my-link"` | `"my-link"` |
| `"/a3f9c21b"` | `"a3f9c21b"` |

`.slice(1)` simply chops off the first character. Clean and simple. ✂️

---

### The Redirect
```js
res.writeHead(302, { Location: links[code] });
res.end();
```

This is where the magic happens. Let's break it down:

| Part | What It Does |
|---|---|
| `302` | HTTP status code meaning "Found — go here instead" |
| `Location: links[code]` | Tells the browser *where* to go |
| `res.end()` | Closes the response — no body needed |

> 💡 **What is a 302 redirect?** When the browser receives a 302 response, it immediately makes a brand new request to the URL in the `Location` header. The user barely notices — they're just suddenly on YouTube. That's the entire magic of URL shorteners. 🪄

---

### 301 vs 302 — Which Should You Use?

| Code | Name | Meaning | Use When |
|---|---|---|---|
| `301` | Moved Permanently | This redirect is forever | Never changing the destination |
| `302` | Found (Temporary) | This redirect might change | ✅ URL shorteners — destination can be updated |

We use `302` because our links *could* be updated later. Browsers cache 301s aggressively — which means changing the destination later might not work for returning users. Always `302` for shorteners.

---

### The 404 Case
```js
res.writeHead(404);
res.end("404 — Short link not found.");
```

If someone visits `http://localhost:3000/doesnotexist` and that code isn't in `links.json` — we tell them clearly. No crash, no hang, just a clean error response. 

---

## 👀 Your Final `app.js` — The Complete Picture

Here's what your full server routing should look like now:

```js
import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import crypto from "crypto";

const server = createServer(async (req, res) => {

  // ─── GET Routes ───────────────────────────────────────────────
  if (req.method === "GET") {

    if (req.url === "/") {
      const data = await readFile("public/index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);

    } else if (req.url === "/style.css") {
      const data = await readFile("public/style.css");
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);

    } else if (req.url === "/links") {
      const data = await readFile("data/links.json", "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);

    } else {
      // ✨ Catch-all — handle short code redirects
      const code = req.url.slice(1);
      const data = await readFile("data/links.json", "utf-8");
      const links = JSON.parse(data);

      if (links[code]) {
        res.writeHead(302, { Location: links[code] });
        res.end();
      } else {
        res.writeHead(404);
        res.end("404 — Short link not found.");
      }
    }

  // ─── POST Routes ──────────────────────────────────────────────
  } else if (req.method === "POST" && req.url === "/shorten") {

    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {

      const { url, shortcode } = JSON.parse(body);

      let links = {};
      try {
        const data = await readFile("data/links.json", "utf-8");
        links = JSON.parse(data);
      } catch {}

      const code = shortcode || crypto.randomBytes(4).toString("hex");

      if (links[code]) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Short code already exists! Try another." }));
      }

      links[code] = url;
      await writeFile("data/links.json", JSON.stringify(links, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
  }

});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
```

---

## 🧪 Step 2 — Test the Redirect

1. Restart your server — `Ctrl + C` then `node app.js`
2. Visit `http://localhost:3000`
3. Shorten a URL — e.g. `https://youtube.com` with code `yt`
4. Click the short link `http://localhost:3000/yt`
5. Watch it redirect to YouTube 🎉

Also test the 404:
- Visit `http://localhost:3000/doesnotexist`
- You should see `404 — Short link not found.`

---

## ✅ Checkpoint

| What to Check | Expected Result |
|---|---|
| Clicking short link redirects | ✅ Browser lands on original URL |
| Invalid code shows 404 | ✅ "404 — Short link not found." |
| Redirect is instant | ✅ No delay, no extra page |
| Other routes still work | ✅ Homepage, CSS, links list unaffected |

---

## 📊 Quick Reference

| Concept | Key Takeaway |
|---|---|
| `req.url.slice(1)` | Strips the leading `/` to get the short code |
| `302` status code | Temporary redirect — browser follows `Location` header |
| `Location: links[code]` | Tells the browser where to redirect |
| `res.end()` | No body needed for a redirect — just close it |
| `404` status code | Short code not found — send a clear error |
| Catch-all `else` block | Must be LAST — only runs when no other route matches |

---

> 🔥 **Pro Tip:** The catch-all `else` block being **last** in the chain is critical. If you put it anywhere earlier, it would intercept requests meant for `/`, `/style.css`, or `/links` before they reach their proper routes. Order of routes in raw Node.js matters a lot — this is one of the things Express handles automatically with its router. Now you know why frameworks exist. 😄

---

# 🎉 YOU DID IT — THE APP IS COMPLETE!

Here's everything you built from scratch:

| Stage | What You Built |
|---|---|
| 🧱 Stage 0 | Project structure + Node.js setup |
| 🎨 Stage 1 | Full UI — HTML + CSS |
| ⚡ Stage 2 | Form data reading with JavaScript |
| 🌐 Stage 3 | HTTP server — serving HTML + CSS |
| 📥 Stage 4 | POST route — saving links to JSON |
| 📡 Stage 5 | GET route — fetching + displaying links |
| 🚀 Stage 6 | Redirect — the actual URL shortening magic |

You understand **real backend + frontend integration** now. No shortcuts, no black boxes. Every single line — yours. 💪