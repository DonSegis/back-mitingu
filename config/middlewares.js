// module.exports = [
//   "strapi::logger",
//   "strapi::errors",
//   "strapi::security",
//   "strapi::cors",
//   "strapi::poweredBy",
//   "strapi::query",
//   "strapi::body",
//   "strapi::session",
//   "strapi::favicon",
//   "strapi::public",
// ];
// module.exports = [
//   "strapi::logger",
//   "strapi::errors",
//   {
//     name: "strapi::security",
//     config: {
//       contentSecurityPolicy: {
//         useDefaults: true,
//         directives: {
//           "connect-src": [
//             "'self'",
//             "https://e-commerce-mitingu-production.up.railway.app",
//             "http://localhost:1420",
//             "ws://localhost:1337",
//             " http://localhost:5173/",
//             "wss://e-commerce-mitingu-production.up.railway.app",
//           ],
//         },
//       },
//     },
//   },
//   {
//     name: "strapi::cors",
//     config: {
//       origin: "*",
//       credentials: true,
//     },
//   },
//   "strapi::poweredBy",
//   "strapi::query",
//   "strapi::body",
//   "strapi::session",
//   "strapi::favicon",
//   "strapi::public",
// ];
// path: config/middlewares.js
module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": [
            "'self'",
            "https://e-commerce-mitingu-production.up.railway.app",
            "https://e-commerce-mitingu-production-3407.up.railway.app",
            "https://e-commerce-landing-page-backend-production-942c.up.railway.app/",
            "http://localhost:1420",
            "ws://localhost:1337",
            " http://localhost:5173/",
            "wss://e-commerce-mitingu-production.up.railway.app",
          ],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: { origin: "*", credentials: true },
  },
  {
    // Apunta a src/middlewares/rate-limit.js
    name: "global::rate-limit",
    config: {
      max: 10, // 10 peticiones
      duration: 2000, // cada 2s
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
