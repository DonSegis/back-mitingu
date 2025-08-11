// // // "use strict";

// // // /**
// // //  * producto controller
// // //  */

// // // const { createCoreController } = require("@strapi/strapi").factories;

// // // module.exports = createCoreController("api::producto.producto");

// "use strict";
// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController(
//   "api::producto.producto",
//   ({ strapi }) => ({
//     async listAllPlain(ctx) {
//       // Si quieres filtrar solo publicados, descomenta el where con publishedAt
//       const entries = await strapi.db.query("api::producto.producto").findMany({
//         select: [
//           "id",
//           "documentId",
//           "nombre",
//           "descripcion",
//           "stock",
//           "activo",
//           "costo",
//           "codigo_barra",
//           "descripcion_corta",
//           "precio",
//           "imagen_link",
//         ],
//         populate: {
//           imagen: { select: ["url"] },
//           // 👇 relación categoria con select explícito
//           categoria: { select: ["id", "documentId", "nombre"] },
//           pedido_items: { select: ["id", "documentId"] },
//         },
//         // where: { publishedAt: { $notNull: true } }, // <- opcional, si quieres solo publicados
//         orderBy: { nombre: "asc" },
//       });

//       const data = entries.map((p) => ({
//         id: p.id,
//         documentId: p.documentId,
//         nombre: p.nombre ?? "",
//         descripcion: p.descripcion ?? "",
//         stock: p.stock ?? 0,
//         activo: p.activo ?? false,
//         costo: p.costo ?? null,
//         codigo_barra: p.codigo_barra ?? null,
//         descripcion_corta: p.descripcion_corta ?? "",
//         precio: p.precio ?? 0,
//         imagen_link: p.imagen_link ?? null,
//         imagen: p?.imagen?.url ?? null,
//         categoria: p?.categoria
//           ? {
//               id: p.categoria.id,
//               documentId: p.categoria.documentId,
//               nombre: p.categoria.nombre ?? "",
//             }
//           : null,
//         pedido_items: Array.isArray(p.pedido_items)
//           ? p.pedido_items.map((it) => ({
//               id: it.id,
//               documentId: it.documentId,
//             }))
//           : [],
//       }));

//       ctx.body = data;
//     },
//   })
// );
"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::producto.producto",
  ({ strapi }) => ({
    async listAllPlain(ctx) {
      // ?preview=1 para incluir borradores (opcional)
      const preview = ["1", "true", "yes"].includes(
        String(ctx.query.preview ?? "").toLowerCase()
      );

      const where = preview ? {} : { publishedAt: { $notNull: true } };

      const entries = await strapi.db.query("api::producto.producto").findMany({
        where,
        select: [
          "id",
          "documentId",
          "nombre",
          "descripcion",
          "stock",
          "activo",
          "costo",
          "codigo_barra",
          "descripcion_corta",
          "precio",
          "imagen_link",
        ],
        populate: {
          imagen: { select: ["id", "documentId", "url"] }, // media no usa draft/publish
          categoria: preview
            ? { select: ["id", "documentId", "nombre"] }
            : {
                select: ["id", "documentId", "nombre"],
                where: { publishedAt: { $notNull: true } },
              },
          // Si pedido_items tiene draft/publish, filtramos igual:
          pedido_items: preview
            ? { select: ["id", "documentId"] }
            : {
                select: ["id", "documentId"],
                where: { publishedAt: { $notNull: true } },
              },
        },
        orderBy: { nombre: "asc" },
      });

      const data = entries.map((p) => ({
        id: p.id,
        documentId: p.documentId,
        nombre: p.nombre ?? "",
        descripcion: p.descripcion ?? "",
        stock: p.stock ?? 0,
        activo: p.activo ?? false,
        costo: p.costo ?? null,
        codigo_barra: p.codigo_barra ?? null,
        descripcion_corta: p.descripcion_corta ?? "",
        precio: p.precio ?? 0,
        imagen_link: p.imagen_link ?? null,
        imagen: {
          id: p?.imagen?.id ?? null,
          documentId: p?.imagen?.documentId ?? null,
          url: p?.imagen?.url ?? null,
        },
        categoria: p?.categoria
          ? {
              id: p.categoria.id,
              documentId: p.categoria.documentId,
              nombre: p.categoria.nombre ?? "",
            }
          : null,
        pedido_items: Array.isArray(p.pedido_items)
          ? p.pedido_items.map((it) => ({
              id: it.id,
              documentId: it.documentId,
            }))
          : [],
      }));

      ctx.body = data;
    },
  })
);
