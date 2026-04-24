import {createServer} from "http"
import { readFile, writeFile } from "fs/promises"
import crypto from "crypto"
import { error } from "console"
import { link } from "fs"

const server = createServer(async (req, res)=>{
  if(req.method === "GET"){
    if (req.url === "/") {
      const data = await readFile("public/index.html");
      res.writeHead(200, { "content-type": "text/html" });
      res.end(data);
    } else if (req.url === "/style.css") {
      const data = await readFile("public/style.css");
      res.writeHead(200, { "content-type": "text/css" });
      res.end(data);
    } else if (req.url === "/links") {
      const data = await readFile("data/links.json", "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } else {
      const code = req.url.slice(1);

      const data = await readFile("data/links.json", "utf-8");
      const links = JSON.parse(data);

      if (links[code]) {
        res.writeHead(302, { location: links[code] });
        res.end();
      } else {
        res.writeHead(404);
        res.end("404 - short link not found");
      }
    }
  }else if(req.method === "POST" && req.url == "/shorten"){
    let body = ""

    req.on("data", chunk => {
      body+=chunk
    })

    req.on("end", async ()=>{
      const { url, shortcode} = JSON.parse(body)

      let links = {}
      try {
        const data = await readFile("data/links.json", "utf-8")
        links = JSON.parse(data)
      } catch (error) {
        
      }

      const code = shortcode || crypto.randomBytes(4).toString("hex")

      if(links[code]){
        res.writeHead(400, {"content-type": "application/json"})
        return res.end(JSON.stringify({error: "Short code already exists! try another."}))
      }

      links[code] = url
      await writeFile("data/links.json", JSON.stringify(links, null, 2))

      res.writeHead(200, {"content-type" : "application/json"})
      res.end(JSON.stringify({success: true}))
    })
  }
})

server.listen(3000, ()=>{
  console.log("server running at http://localhost:3000")
})