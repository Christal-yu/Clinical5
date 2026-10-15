import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const port = Number(process.env.PORT || 4173);
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".pdf":"application/pdf",".webmanifest":"application/manifest+json"};

const server = http.createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    let filePath = path.resolve(root, `.${urlPath}`);
    if (!filePath.startsWith(root)) throw new Error("Invalid path");
    if ((await stat(filePath)).isDirectory()) filePath = path.join(filePath, "index.html");
    const data = await readFile(filePath);
    response.writeHead(200, {"content-type": types[path.extname(filePath)] || "application/octet-stream", "cache-control": "no-store"});
    response.end(data);
  } catch {
    response.writeHead(404, {"content-type":"text/plain; charset=utf-8"});
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Clinical5 preview: http://127.0.0.1:${port}`));
