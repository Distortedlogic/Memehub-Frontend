import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import next from "next";

const port = 3000;
const dev = process.env.ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
  "/graphql": {
    target: "http://backend:5000",
    pathRewrite: {
      "^/graphql": "/graphql",
    },
    changeOrigin: true,
    ws: true,
  },
};

app
  .prepare()
  .then(() => {
    const server = express();
    if (dev) {
      server.use("/graphql", createProxyMiddleware(apiPaths["/graphql"]));
    }
    server.all("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error:::::", err);
  });
