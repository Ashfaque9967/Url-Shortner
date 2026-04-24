import {createServer} from "http"
import { readFile } from "fs/promises"

const server = createServer(async (req, res)=>{
  if(req.url === "/"){
    const data = await readFile("public/index.html")
    res.writeHead(200, {"content-type": "text/html"})
    res.end(data)
  } else if (req.url === "/style.css"){
    const data = await readFile("public/style.css")
    res.writeHead(200, {"content-type": "text/css"})
    res.end(data)
  }
})

server.listen(3000, ()=>{
  console.log("server running at http://localhost:3000")
})