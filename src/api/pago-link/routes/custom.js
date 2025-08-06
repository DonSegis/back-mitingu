"use strict";

module.exports = [
  {
    method: "GET",
    path: "/pago-links/verify/:token",
    handler: "pago-link.verify",
    config: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/pago-links/use-token/:token",
    handler: "pago-link.useToken",
    config: {
      auth: false,
    },
  },
];

const customRoutes = require("./custom");
module.exports = {
  routes: customRoutes,
};
