const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const app = express();
const PORT = 3005;

// Limit 5 requests per 2 minutes per IP
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

app.use(morgan("combined"));
app.use(limiter);

app.use("/bookingservice", async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log("Token:", token);

    const response = await axios.get(
      "http://localhost:3001/api/v1/isAuthenticated",
      {
        headers: { "x-access-token": token },
      }
    );

    console.log("Auth response:", response.data);
    console.log("hi");
    if (response.data.success) {
      next(); // authorized → proceed to target service
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error("Auth error:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({
      message: "Authentication failed",
    });
  }
});

// This way, all /bookingservice requests are authenticated first before being forwarded.

// API Gateway proxy
app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

app.get("/home", (req, res) => {
  return res.json({ message: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
