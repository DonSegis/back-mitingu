// 'use strict';

// /**
//  * pago-link controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::pago-link.pago-link');
"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::pago-link.pago-link",
  ({ strapi }) => ({
    async verify(ctx) {
      const { token } = ctx.params;

      const link = await strapi.db.query("api::pago-link.pago-link").findOne({
        where: { token },
        populate: {
          pedido: {
            populate: ["pedido_items"],
          },
        },
      });

      if (!link) return ctx.badRequest("Token no válido.");
      if (link.usado) return ctx.badRequest("Este link ya fue usado.");
      if (new Date(link.expira_en) < new Date())
        return ctx.badRequest("El link ha expirado.");

      return {
        pedidoId: link.pedido?.id,
        token: link.token,
        documentId: link.pedido?.documentId,
        pedido_items: link.pedido?.pedido_items?.map((item) => item.id) || [],
      };
    },

    async useToken(ctx) {
      const { token } = ctx.params;

      const link = await strapi.db.query("api::pago-link.pago-link").findOne({
        where: { token },
      });

      if (!link || link.usado)
        return ctx.badRequest("Token inválido o ya usado.");

      await strapi.db.query("api::pago-link.pago-link").update({
        where: { id: link.id },
        data: { usado: true },
      });

      return { success: true };
    },
  })
);
