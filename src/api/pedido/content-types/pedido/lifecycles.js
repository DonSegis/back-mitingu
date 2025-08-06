"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  /**
   * Después de crear un pedido, genero un pago_link.
   */

  async afterCreate(event) {
    const { result } = event;

    // Solo para pedidos con pago por transferencia y generados desde web
    if (
      result.metodo_pago !== "transferencia" ||
      result.donde_se_genero !== "web"
    ) {
      strapi.log.info(
        `⚠ No se crea pago_link (metodo_pago='${result.metodo_pago}', donde_se_genero='${result.donde_se_genero}')`
      );
      return;
    }

    // Verificar si ya existe un pago_link
    const existing = await strapi.db
      .query("api::pago-link.pago-link")
      .findOne({ where: { pedido: result.id } });

    if (existing) {
      strapi.log.info(`ℹ Ya existe un pago_link para el pedido ${result.id}`);
      return;
    }

    // Crear token y expiración a una semana
    const token = uuidv4();
    const unaSemana = 1000 * 60 * 60 * 24 * 7;
    await strapi.entityService.create("api::pago-link.pago-link", {
      data: {
        token,
        pedido: result.id,
        expira_en: new Date(Date.now() + unaSemana),
      },
    });

    strapi.log.info(
      `✅ Pago_link creado con token ${token} para pedido ${result.id}`
    );
  },
};
// "use strict";

// const { v4: uuidv4 } = require("uuid");

// module.exports = {
//   /**
//    * Después de crear un pedido: crear solo un pago_link si:
//    * - NO existe ya uno para este pedido
//    * - metodo_pago === 'transferencia'
//    * - donde_se_genero === 'web'
//    */
//   async afterCreate(event) {
//     const { result } = event;
//     console.log("=== [pedido.afterCreate] Pedido creado:", {
//       id: result.id,
//       method: result.metodo_pago,
//       where: result.donde_se_genero,
//     });

//     // Filtrar solo transferencias web
//     if (
//       result.metodo_pago !== "transferencia" ||
//       result.donde_se_genero !== "web"
//     ) {
//       console.log(
//         "=== [pedido.afterCreate] No es transferencia/web: omitido pago_link"
//       );
//       return;
//     }

//     // Verificar si ya existe un pago_link
//     const existing = await strapi.entityService.findMany(
//       "api::pago-link.pago-link",
//       {
//         filters: { pedido: result.id },
//       }
//     );
//     if (existing.length > 0) {
//       console.log(
//         `=== [pedido.afterCreate] Ya existe pago_link para pedido ${result.id}: omitido`
//       );
//       return;
//     }

//     // Crear token y expiración a 7 días
//     const token = uuidv4();
//     const expira_en = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     await strapi.entityService.create("api::pago-link.pago-link", {
//       data: {
//         token,
//         pedido: result.id,
//         expira_en,
//       },
//     });
//     console.log(
//       `=== [pedido.afterCreate] Pago_link creado para pedido ${result.id} con token ${token}`
//     );
//   },
// };
