// caloriedatabase.js (Node backend)

import express from "express";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// Create OAuth client for FatSecret
const oauth = new OAuth({
  consumer: {
    key: "5291e0575ed74613853cde952aea4ca7",
    secret: "e2a0c004255c43c7ac3db7a6a0b8fa5e",
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

/**
 * Endpoint to search foods
 * GET /api/foodsearch?q=injera
 */
app.get("/api/foodsearch", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter `q`" });
  }

  // Build the request for FatSecret
  const request_data = {
    url: "https://platform.fatsecret.com/rest/server.api",
    method: "POST",
    data: {
      method: "foods.search",
      search_expression: query,
      format: "json",
      // optionally: page_number, max_results
    },
  };

  // Generate OAuth headers
  const authHeader = oauth.toHeader(oauth.authorize(request_data));

  try {
    const response = await axios.post(
      request_data.url,
      new URLSearchParams(request_data.data).toString(),
      {
        headers: {
          ...authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Return the JSON body to frontend
    return res.json(response.data);
  } catch (err) {
    console.error("Error calling FatSecret API:", err.response?.data || err.message);
    return res.status(500).json({ error: "FatSecret API error", detail: err.response?.data });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Calorie database backend running at http://localhost:${PORT}`);
});
