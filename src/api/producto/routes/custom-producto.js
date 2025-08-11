"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/productos-todos",
      handler: "api::producto.producto.listAllPlain",
      config: {
        auth: false, // ponlo en true si quieres protegerla
        policies: [],
        middlewares: [],
      },
    },
  ],
};
