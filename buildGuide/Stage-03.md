# 🌐 Stage 3 — The Backend Wakes Up (Your First Server!)

## 📋 What We Cover
- Writing a real HTTP server from scratch using Node.js
- Serving HTML and CSS files to the browser
- Understanding request routing (`req.url`)
- Reading files from disk with `fs/promises`
- Running your server and visiting it in the browser

> 💡 **The Golden Rule:** Don't move to Stage 4 until `http://localhost:3000` loads your UI with full styling. If it looks exactly like Stage 1 — but served from Node — you're golden. 🏆

---

## 🧠 The Big Idea First

So far, we opened `index.html` by double-clicking it. That works for testing, but in the real world — **browsers talk to servers, not files.**

Here's what we're building now:

```
Browser requests http://localhost:3000
        ↓
Node.js server receives the request
        ↓
Reads the correct file from disk
        ↓
Sends it back to the browser
```

No Express. No frameworks. Pure Node.js. This is how it works under the hood. 💪

---

## ✍️ Step 1 — Write the Server

Open `app.js` and paste this in:

```js
// Import only what we need — modern ES Module syntax
import { createServer } from "http";
import { readFile } from "fs/promises";

// Create the server — every incoming request hits this callback
const server = createServer(async (req, res) => {

  // Route 1: User visits the homepage
  if (req.url === "/") {
    const data = await readFile("public/index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);

  // Route 2: Browser automatically requests the CSS file
  } else if (req.url === "/style.css") {
    const data = await readFile("public/style.css");
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(data);
  }

});

// Start listening on port 3000
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
```

---

## 🔍 Breaking It Down — Every Line Explained

### `createServer`
```js
const server = createServer(async (req, res) => { ... });
```
- `req` — the **request** object. Contains everything about what the browser is asking for (URL, method, headers, body)
- `res` — the **response** object. This is what we use to send data *back* to the browser
- `async` — we need this because reading files takes time (it's async)

---

### `req.url` — The Router
```js
if (req.url === "/") { ... }
else if (req.url === "/style.css") { ... }
```
This is manual routing. When the browser visits a URL, `req.url` tells us exactly what was requested. We check it and respond accordingly.

| `req.url` value | What the browser wants |
|---|---|
| `"/"` | The homepage (`index.html`) |
| `"/style.css"` | The stylesheet |
| `"/shorten"` | (Coming in Stage 4) The POST API |

---

### `readFile` — Reading from Disk
```js
const data = await readFile("public/index.html");
```
This reads the file contents from your hard drive. It's async — meaning it takes a tiny moment — which is why we `await` it. No `await` = broken response.

---

### `res.writeHead` — Setting the Response
```js
res.writeHead(200, { "Content-Type": "text/html" });
```

| Part | Meaning |
|---|---|
| `200` | HTTP status code — means "OK, here's your stuff" |
| `"Content-Type": "text/html"` | Tells the browser what kind of data is coming |

> 💡 **Why does Content-Type matter?** Without it, the browser doesn't know if it's receiving HTML, CSS, JSON, or plain text. It might display the raw file content instead of rendering it. Always set it!

---

### `res.end(data)` — Sending the Response
```js
res.end(data);
```
This actually sends the file contents to the browser and closes the connection. Think of it as hitting "send" on an email. 📨

---

## ▶️ Step 2 — Run the Server

In your terminal (make sure you're in the `url-shortener/` folder):

```bash
node app.js
```

You should see:

```
🚀 Server running at http://localhost:3000
```

Now open your browser and visit:

```
http://localhost:3000
```

---

## ✅ Checkpoint

| What to Check | Expected Result |
|---|---|
| Terminal shows server message | ✅ `Server running at http://localhost:3000` |
| Browser loads the page | ✅ UI is visible |
| Styling is applied | ✅ Dark theme, purple accents — looks exactly like Stage 1 |
| No errors in terminal | ✅ Clean output |

> ⚠️ **Styles not loading?** Open DevTools → Network tab → refresh the page. Look for `style.css` in the list. If it shows a 404 or is missing — double check the `else if (req.url === "/style.css")` block in your server. The URL must match exactly.

> ⚠️ **`ERR_ADDRESS_IN_USE` error?** Another process is already using port 3000. Either stop it, or change `3000` to `3001` in `server.listen()`.

---

## 📊 Quick Reference

| Concept | Key Takeaway |
|---|---|
| `createServer(callback)` | Creates an HTTP server; callback fires on every request |
| `req.url` | The path the browser is requesting (e.g. `"/"`, `"/style.css"`) |
| `req.method` | The HTTP method — `"GET"`, `"POST"`, etc. |
| `readFile(path)` | Reads a file from disk — always `await` it |
| `res.writeHead(status, headers)` | Sets the HTTP status code and response headers |
| `res.end(data)` | Sends the response body and closes the connection |
| `server.listen(port, callback)` | Starts the server on the given port |

---

> 🔥 **Pro Tip:** Every time you change `app.js`, you need to **stop and restart** the server. Hit `Ctrl + C` in the terminal to stop it, then run `node app.js` again. This gets annoying fast — in a future project, you can use `nodemon` to auto-restart on every save. But for now, manual restarts keep you aware of what's changing. 🔄