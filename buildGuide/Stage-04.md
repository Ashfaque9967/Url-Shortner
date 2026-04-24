# 📥 Stage 4 — Frontend Meets Backend (The POST Request!)

## 📋 What We Cover
- Upgrading our script to send data to the server using `fetch`
- Understanding what a POST request is and why we use it
- Reading the request body on the server side
- Parsing JSON data sent from the frontend
- Saving shortened links to `links.json`
- Handling errors like duplicate short codes

> 💡 **The Golden Rule:** Don't move to Stage 5 until submitting the form updates `links.json` on disk. Open the file after submitting — if your link is in there, this stage is done. 🎯

---

## 🧠 The Big Idea First

In Stage 2 we grabbed form data. In Stage 3 we built a server. Now we're connecting them:

```
User fills form → clicks Shorten!
        ↓
JavaScript sends a POST request to /shorten
        ↓
Server receives the request + reads the body
        ↓
Saves the link to links.json
        ↓
Sends back a success response
        ↓
Frontend shows an alert ✅
```

This is your first real **full-stack data flow.** Let that sink in. 🤯

---

## ✍️ Step 1 — Upgrade the Frontend Script

Open `public/index.html` and **replace your entire `<script>` block** with this:

```html
<script>
  const form = document.getElementById("shorten-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Read form values exactly like Stage 2
    const formData = new FormData(event.target);
    const url = formData.get("url");
    const shortcode = formData.get("shortcode");

    try {
      // Send a POST request to our backend
      const response = await fetch("/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"  // Tell server we're sending JSON
        },
        body: JSON.stringify({ url, shortcode })  // Convert JS object → JSON string
      });

      if (response.ok) {
        // Success! Link was saved
        alert("URL shortened successfully! 🎉");
        event.target.reset();  // Clear the form inputs
      } else {
        // Server returned an error (e.g. duplicate code)
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }

    } catch (err) {
      // Network-level error (server down, no internet, etc.)
      console.error("Something went wrong:", err);
    }
  });
</script>
```

---

## 🔍 Understanding `fetch` — The Star of the Show

```js
const response = await fetch("/shorten", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, shortcode })
});
```

| Part | What It Does |
|---|---|
| `"/shorten"` | 🎯 The backend route we're hitting |
| `method: "POST"` | 📤 We're *sending* data, not just requesting a page |
| `"Content-Type": "application/json"` | 📋 Tells the server the body is JSON format |
| `JSON.stringify({ url, shortcode })` | 🔄 Converts JS object to a JSON string for transmission |
| `await` | ⏳ Waits for the server to respond before continuing |

> 💡 **Why POST and not GET?** GET requests are for *fetching* data — they don't carry a body. POST requests are for *sending* data to the server. Saving a new link = sending data = POST. Simple rule: **GET = read, POST = write.**

---

## ✍️ Step 2 — Add the POST Route to the Server

Open `app.js`. First, update your imports at the top:

```js
import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";  // Added writeFile
import crypto from "crypto";  // For generating random short codes
```

Now inside `createServer`, add this block **after** your existing GET routes:

```js
// Handle POST request to /shorten
if (req.method === "POST" && req.url === "/shorten") {

  let body = "";

  // Data arrives in chunks — collect them all
  req.on("data", chunk => {
    body += chunk;
  });

  // All chunks received — now process the data
  req.on("end", async () => {

    // Parse the JSON string back into a JS object
    const { url, shortcode } = JSON.parse(body);

    // Load existing links from disk
    let links = {};
    try {
      const data = await readFile("data/links.json", "utf-8");
      links = JSON.parse(data);
    } catch {
      // File is empty or doesn't exist yet — start fresh
    }

    // Use provided shortcode OR generate a random one
    const code = shortcode || crypto.randomBytes(4).toString("hex");

    // Check if this code is already taken
    if (links[code]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Short code already exists! Try another." }));
    }

    // Save the new link
    links[code] = url;
    await writeFile("data/links.json", JSON.stringify(links, null, 2));

    // Send success response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true }));
  });
}
```

---

## 🔍 The Tricky Part — Why Do We Collect Chunks?

```js
let body = "";

req.on("data", chunk => {
  body += chunk;
});

req.on("end", async () => {
  const { url, shortcode } = JSON.parse(body);
  // ...
});
```

HTTP requests don't arrive all at once. They arrive in **chunks** (pieces). Think of it like receiving a long text message that gets split across multiple SMS bubbles.

| Event | When It Fires |
|---|---|
| `"data"` | Every time a new chunk of data arrives |
| `"end"` | When ALL chunks have arrived — safe to process now |

> ⚠️ **Never process the body inside the `"data"` event.** You might only have half the data. Always wait for `"end"`.

---

## 🎲 Random Short Code Generation

```js
const code = shortcode || crypto.randomBytes(4).toString("hex");
```

If the user didn't provide a shortcode, we generate one automatically:

- `crypto.randomBytes(4)` → generates 4 random bytes
- `.toString("hex")` → converts them to a hex string like `"a3f9c21b"`

Result: a unique 8-character code every time. No duplicates, no guessing. 🎲

---

## 🧪 Step 3 — Test the Full Flow

1. Restart your server — `Ctrl + C` then `node app.js`
2. Visit `http://localhost:3000`
3. Enter a URL and a short code → click **Shorten!**
4. Alert says "URL shortened successfully! 🎉"
5. Open `data/links.json`

You should see:

```json
{
  "yt": "https://youtube.com"
}
```

Try submitting the same shortcode again — you should get:

```
Error: Short code already exists! Try another.
```

---

## ✅ Checkpoint

| What to Check | Expected Result |
|---|---|
| Form submits without page reload | ✅ `preventDefault()` working |
| Alert shows on success | ✅ "URL shortened successfully! 🎉" |
| `links.json` is updated | ✅ Your link appears in the file |
| Duplicate code shows error | ✅ Alert shows error message |
| Form clears after success | ✅ Both inputs are empty |

---

## 📊 Quick Reference

| Concept | Key Takeaway |
|---|---|
| `fetch("/shorten", { method: "POST" })` | Sends data to the backend |
| `JSON.stringify()` | Converts JS object → JSON string (for sending) |
| `JSON.parse()` | Converts JSON string → JS object (for reading) |
| `req.on("data", chunk => ...)` | Collects incoming request body in pieces |
| `req.on("end", () => ...)` | Fires when full body has arrived — process here |
| `writeFile(path, data)` | Saves data to disk — always `await` it |
| `crypto.randomBytes(4).toString("hex")` | Generates a random 8-char shortcode |
| `res.writeHead(400, ...)` | Sends an error status back to the frontend |

---

> 🔥 **Pro Tip:** Notice how we check `req.method === "POST" && req.url === "/shorten"` together. URL alone isn't enough — a GET request to `/shorten` is completely different from a POST to `/shorten`. Always check **both** method and URL when routing in raw Node.js. This is exactly what Express does for you automatically — but now you understand what's happening under the hood. 🔧