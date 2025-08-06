// 'use strict';

// module.exports = {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register(/*{ strapi }*/) {},

//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   bootstrap(/*{ strapi }*/) {},
// };
"use strict";

const socketIO = require("socket.io");

module.exports = {
  register() {},

  bootstrap({ strapi }) {
    const httpServer = strapi.server.httpServer;

    const io = new socketIO.Server(httpServer, {
      cors: {
        origin: "*", // en producción usa tu dominio
        methods: ["GET", "POST"],
      },
    });

    // Hacemos disponible `strapi.io` globalmente
    strapi.io = io;

    io.on("connection", (socket) => {
      strapi.log.info(`📡 Cliente conectado por WebSocket: ${socket.id}`);

      socket.on("disconnect", () => {
        strapi.log.info(`❌ Cliente desconectado: ${socket.id}`);
      });
    });

    strapi.log.info("✅ Socket.IO inicializado");
  },
};
