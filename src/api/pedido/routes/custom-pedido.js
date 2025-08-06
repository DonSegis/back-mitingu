"use strict";

module.exports = [
  {
    method: "POST",
    path: "/pedidos/crear-con-items",
    handler: "pedido.crearConItems",
    config: {
      auth: false,
    },
  },
];

// 📁 src/api/pedido/routes/pedido.js
const customRoutes = require("./custom-pedido");

module.exports = {
  routes: customRoutes,
};
