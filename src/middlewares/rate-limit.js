// src/middlewares/rate-limit.js
"use strict";

const rateLimit = require("koa-ratelimit");

module.exports = (config, { strapi }) => {
  // Creamos un Map en memoria para llevar el conteo
  const db = new Map();

  return rateLimit({
    driver: "memory", // usaremos la estrategia en memoria
    db, // <-- aquí va la instancia Map
    duration: config.duration || 60000, // milisegundos
    errorMessage:
      "Demasiadas peticiones, por favor inténtalo de nuevo más tarde.",
    id: (ctx) => ctx.ip, // keying por IP
    max: config.max || 1000,
    headers: {
      remaining: "Rate-Limit-Remaining",
      reset: "Rate-Limit-Reset",
      total: "Rate-Limit-Total",
    },
  });
};
