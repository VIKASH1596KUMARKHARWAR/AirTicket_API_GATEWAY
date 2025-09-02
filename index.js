// const express = require("express");
// const morgan = require("morgan");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();
// const PORT = 3005;

// app.use(morgan("combined"));

// // Proxy setup
// app.use(
//   "/bookingservice",
//   createProxyMiddleware({
//     target: "http://localhost:3002",
//     changeOrigin: true,
//     // pathRewrite: { "^/bookingservice": "" }, // remove /bookingservice before sending
//   })
// );

// app.get("/home", (req, res) => {
//   return res.json({ message: "OK" });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on the ${PORT}`);
// });

const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3005;

app.use(morgan("combined"));

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
