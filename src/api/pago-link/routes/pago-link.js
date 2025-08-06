"use strict";

/**
 * pago-link router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::pago-link.pago-link", {
  routes: (defaultRoutes) => {
    const customRoutes = require("./custom");
    return [...defaultRoutes, ...customRoutes];
  },
});
