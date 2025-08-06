// "use strict";

// /**
//  * pedido router
//  */

// const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter("api::pedido.pedido");
"use strict";

/**
 * pedido router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
const customRoutes = require("./custom-pedido");

module.exports = createCoreRouter("api::pedido.pedido", {
  routes: (defaultRoutes) => [...defaultRoutes, ...customRoutes],
});
