import { Router } from "express";

export const proxyRoutes = Router();

proxyRoutes.post("/", (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // This is vulnerable - it will fetch any URL provided
  fetch(url)
    .then(response => response.text())
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).json({ error: "Failed to fetch URL" });
    });
});