# ⚡ Stage 2 — JavaScript Wakes Up (FormData Test!)

## 📋 What We Cover
- Adding our first `<script>` tag to the HTML
- Listening for form submission events
- Using `FormData` to read user input
- Verifying data flow in the browser console

> 💡 **The Golden Rule:** Don't move to Stage 3 until you can see your URL and shortcode printed in the console. If the console shows the values — the pipeline is working. That's all we care about right now.

---

## 🧠 The Big Idea First

Before writing code, understand *what* we're doing and *why*:

```
User fills form → clicks Submit → JavaScript intercepts it
→ reads the values → logs them to console
```

We are NOT sending anything to a server yet. We're just making sure we can **grab the data** from the form correctly. Baby steps. 👶

---

## ✍️ Step 1 — Add the Script

Open `public/index.html` and add this **just before the closing `</body>` tag:**

```html
<script>
  // Grab the form element by its ID
  const form = document.getElementById("shorten-form");

  // Listen for the 'submit' event on the form
  form.addEventListener("submit", (event) => {

    // Stop the browser from refreshing the page (default behaviour)
    event.preventDefault();

    // FormData reads all inputs using their `name` attributes
    const formData = new FormData(event.target);

    // Extract individual values by name
    const url = formData.get("url");
    const shortcode = formData.get("shortcode");

    // Confirm we're reading them correctly
    console.log("URL:", url);
    console.log("Shortcode:", shortcode);
  });
</script>
```

---

## 🔍 Line by Line — What's Actually Happening?

| Code | What It Does |
|---|---|
| `getElementById("shorten-form")` | 🎯 Grabs the form we built in Stage 1 |
| `addEventListener("submit", ...)` | 👂 Listens for when the user clicks "Shorten!" |
| `event.preventDefault()` | 🛑 Stops the browser from reloading the page |
| `new FormData(event.target)` | 📦 Packages all form inputs into a neat object |
| `formData.get("url")` | 🔗 Reads the value from the input with `name="url"` |
| `formData.get("shortcode")` | ✏️ Reads the value from the input with `name="shortcode"` |
| `console.log(...)` | 🖨️ Prints values so we can verify them |

> 💡 **Why `event.preventDefault()`?** By default, submitting an HTML form causes the browser to reload the page — which would wipe everything. We intercept it and handle submission ourselves with JavaScript. This is standard practice in every modern web app.

---

## 🧪 Step 2 — Test It

1. Open `public/index.html` in your browser
2. Open **DevTools** → press `F12` or `Ctrl + Shift + I`
3. Click the **Console** tab
4. Fill in both fields and hit **Shorten!**

You should see something like:

```
URL: https://youtube.com
Shortcode: yt
```

That's your data. Captured. Ready to be sent anywhere. 🎯

---

## ✅ Checkpoint

| What to Check | Expected Result |
|---|---|
| Page doesn't reload on submit | ✅ `preventDefault()` is working |
| Console shows the URL | ✅ e.g. `URL: https://youtube.com` |
| Console shows the shortcode | ✅ e.g. `Shortcode: yt` |
| No errors in console | ✅ Clean output only |

> ⚠️ **Getting `null` in the console?** It means `FormData` can't find the input. Go back to your HTML and make sure both inputs have the correct `name` attributes — `name="url"` and `name="shortcode"`. That's the most common mistake here.

---

## 📊 Quick Reference

| Concept | Key Takeaway |
|---|---|
| `FormData` | Reads form inputs using their `name` attribute |
| `event.preventDefault()` | Stops default page reload on form submit |
| `formData.get("key")` | Returns the value of the input with that `name` |
| Console logging | Best way to verify data before wiring up backend |

---

> 🔥 **Pro Tip:** Always verify your data at the frontend before connecting to a backend. If the data is wrong here, it'll be wrong everywhere. Console logs are your best friend during development — add them aggressively, remove them later. No shame in it. 🧪