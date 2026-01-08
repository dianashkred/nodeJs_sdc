const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, "public");

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".json":
      return "application/json";
    default:
      return "text/plain";
  }
}

const server = http.createServer((req, res) => {
  if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello World</h1>");
    return;
  }

  if (req.url === "/details") {
    const detailsHtml = `
      <h2>Request Details</h2>
      <p><b>Method:</b> ${req.method}</p>
      <p><b>URL:</b> ${req.url}</p>
      <p><b>HTTP Version:</b> ${req.httpVersion}</p>
      <p><b>Headers:</b></p>
      <pre>${JSON.stringify(req.headers, null, 2)}</pre>
    `;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(detailsHtml);
    return;
  }

  let filePath =
    req.url === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, req.url);

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>");
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { "Content-Type": contentType });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Basic HTTP server running at http://localhost:${PORT}`);
});
