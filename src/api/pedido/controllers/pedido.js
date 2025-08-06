"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::pedido.pedido", ({ strapi }) => ({
  /**
   * Crear pedido con items, validar stock, descontar y emitir sockets.
   */
  // async crearConItems(ctx) {
  //   console.log("=== [crearConItems] Inicio de flujo");
  //   let pedidoDoc = null;

  //   try {
  //     const data = ctx.request.body?.data ?? ctx.request.body;
  //     console.log("=== [crearConItems] Payload recibido:", data);
  //     const {
  //       codigo_pedido,
  //       nombre_usuario,
  //       email_usuario,
  //       direccion_usuario,
  //       telefono,
  //       donde_se_genero,
  //       estado,
  //       fecha,
  //       pedido_items = [],
  //       total,
  //       transferencia = false,
  //       baucher,
  //       metodo_pago,
  //       comprobante_tranferencia, // opcional
  //     } = data;

  //     // 0) Validaciones básicas
  //     if (
  //       !codigo_pedido ||
  //       !nombre_usuario ||
  //       !email_usuario ||
  //       !telefono ||
  //       !estado ||
  //       !fecha ||
  //       !total ||
  //       !Array.isArray(pedido_items) ||
  //       pedido_items.length === 0
  //     ) {
  //       console.log("=== [crearConItems] ❌ Validación básica fallida");
  //       return ctx.badRequest({
  //         error: "Faltan datos obligatorios o items inválidos.",
  //       });
  //     }
  //     console.log("=== [crearConItems] ✅ Validaciones básicas OK");

  //     // 1) Validar stock de cada producto
  //     for (const item of pedido_items) {
  //       const productoId =
  //         typeof item.producto === "object" ? item.producto.id : item.producto;
  //       console.log(
  //         `=== [crearConItems] Validando stock producto ${productoId}`
  //       );
  //       const selectRes = await strapi.db.connection.raw(
  //         `SELECT stock FROM "productos" WHERE id = ?`,
  //         [productoId]
  //       );
  //       const stockActual = selectRes.rows?.[0]?.stock ?? 0;
  //       console.log(
  //         `    stockActual = ${stockActual}, requerido = ${item.cantidad}`
  //       );
  //       if (stockActual < item.cantidad) {
  //         console.log("=== [crearConItems] ❌ Stock insuficiente, abortando");
  //         return ctx.badRequest({
  //           error: `Stock insuficiente para producto ${productoId}. Disponible: ${stockActual}`,
  //         });
  //       }
  //     }
  //     console.log("=== [crearConItems] ✅ Stocks OK");

  //     // 2) Crear y publicar el pedido
  //     console.log("=== [crearConItems] Creando pedido...");
  //     pedidoDoc = await strapi.documents("api::pedido.pedido").create({
  //       data: {
  //         codigo_pedido,
  //         nombre_usuario,
  //         email_usuario,
  //         direccion_usuario,
  //         telefono,
  //         donde_se_genero,
  //         estado,
  //         fecha,
  //         total,
  //         transferencia,
  //         baucher,
  //         metodo_pago,
  //         ...(comprobante_tranferencia && {
  //           comprobante_tranferencia,
  //         }),
  //       },
  //       status: "published",
  //     });
  //     console.log(
  //       "=== [crearConItems] ✅ Pedido creado:",
  //       pedidoDoc.documentId
  //     );

  //     // 3) Crear items y descontar stock
  //     for (const item of pedido_items) {
  //       const productoId =
  //         typeof item.producto === "object" ? item.producto.id : item.producto;
  //       console.log(
  //         `=== [crearConItems] Creando pedido-item para producto ${productoId}`
  //       );
  //       await strapi.documents("api::pedido-item.pedido-item").create({
  //         data: {
  //           cantidad: item.cantidad,
  //           precio_unitario: item.precio_unitario,
  //           producto: productoId,
  //           pedido: pedidoDoc.id,
  //         },
  //         status: "published",
  //       });
  //       console.log("    pedido-item creado");

  //       console.log(
  //         `=== [crearConItems] Descontando stock producto ${productoId}`
  //       );
  //       const updateRes = await strapi.db.connection.raw(
  //         `UPDATE "productos" SET stock = stock - ? WHERE id = ? RETURNING stock`,
  //         [item.cantidad, productoId]
  //       );
  //       const newStock = updateRes.rows?.[0]?.stock ?? 0;
  //       console.log(`    nuevo stock = ${newStock}`);

  //       console.log("    Emitiendo socket stockUpdated");
  //       strapi.io.emit("stockUpdated", {
  //         productId: productoId,
  //         stock: newStock,
  //       });
  //     }

  //     // 4) Buscar pedido completo
  //     console.log(
  //       "=== [crearConItems] Buscando pedido completo para respuesta..."
  //     );
  //     const fullPedido = await strapi
  //       .documents("api::pedido.pedido")
  //       .findFirst({
  //         where: { documentId: pedidoDoc.documentId },
  //         status: "published",
  //         populate: {
  //           pedido_items: { populate: ["producto"] },
  //           comprobante_tranferencia: true,
  //         },
  //       });
  //     console.log("=== [crearConItems] ✅ Pedido completo obtenido");

  //     console.log("=== [crearConItems] Emitiendo socket orderCreated");
  //     strapi.io.emit("orderCreated", fullPedido);
  //     console.log("=== [crearConItems] Flujo completado 👍");

  //     return ctx.send({
  //       message: "Pedido creado con éxito.",
  //       data: fullPedido,
  //     });
  //   } catch (err) {
  //     console.error("=== [crearConItems] ❌ Error interno:", err);
  //     // rollback parcial
  //     if (pedidoDoc?.id) {
  //       console.log("=== [crearConItems] Rollback: eliminando pedido parcial");
  //       await strapi.documents("api::pedido.pedido").delete({
  //         documentId: pedidoDoc.documentId,
  //       });
  //     }
  //     ctx.status = err.status || 500;
  //     return ctx.send({
  //       error: err.message || "Error interno al crear pedido.",
  //     });
  //   }
  // },
  async crearConItems(ctx) {
    console.log("=== [crearConItems] Inicio de flujo");
    let pedidoDoc = null;

    try {
      const data = ctx.request.body?.data ?? ctx.request.body;
      console.log("=== [crearConItems] Payload recibido:", data);
      const {
        codigo_pedido,
        nombre_usuario,
        email_usuario,
        direccion_usuario,
        telefono,
        donde_se_genero,
        estado,
        fecha,
        pedido_items = [],
        total,
        transferencia = false,
        baucher,
        metodo_pago,
        comprobante_tranferencia,
      } = data;

      // 0) Validaciones básicas
      if (
        !codigo_pedido ||
        !nombre_usuario ||
        !email_usuario ||
        !telefono ||
        !estado ||
        !fecha ||
        !total ||
        !Array.isArray(pedido_items) ||
        pedido_items.length === 0
      ) {
        console.log("=== [crearConItems] ❌ Validación básica fallida");
        return ctx.badRequest({
          error: "Faltan datos obligatorios o items inválidos.",
        });
      }
      console.log("=== [crearConItems] ✅ Validaciones básicas OK");

      // 1) Validar stock de cada producto (by documentId o id numérico)
      for (const item of pedido_items) {
        const raw = item.producto;
        let productRecord;

        if (typeof raw === "string") {
          // lookup por documentId
          console.log(`🔍 lookup PRODUCTO por documentId = ${raw}`);
          productRecord = await strapi.db
            .query("api::producto.producto")
            .findOne({
              where: { documentId: raw },
              select: ["id", "stock", "documentId"],
            });
        } else {
          // lookup por id numérico
          console.log(`🔍 lookup PRODUCTO por id = ${raw}`);
          productRecord = await strapi.db
            .query("api::producto.producto")
            .findOne({
              where: { id: raw },
              select: ["id", "stock", "documentId"],
            });
        }

        if (!productRecord) {
          console.log(`❌ Producto no encontrado (raw = ${raw})`);
          return ctx.badRequest({ error: `Producto ${raw} no encontrado.` });
        }

        console.log(
          `    Encontrado: id=${productRecord.id} documentId=${productRecord.documentId} stock=${productRecord.stock}`
        );
        if (productRecord.stock < item.cantidad) {
          console.log("❌ Stock insuficiente, abortando");
          return ctx.badRequest({
            error: `Stock insuficiente para producto ${productRecord.documentId}. Disponible: ${productRecord.stock}`,
          });
        }

        // guardamos el id interno para usarlo luego
        item._internalProductId = productRecord.id;
      }
      console.log("=== [crearConItems] ✅ Stocks OK");

      // 2) Crear y publicar el pedido
      console.log("=== [crearConItems] Creando pedido...");
      pedidoDoc = await strapi.documents("api::pedido.pedido").create({
        data: {
          codigo_pedido,
          nombre_usuario,
          email_usuario,
          direccion_usuario,
          telefono,
          donde_se_genero,
          estado,
          fecha,
          total,
          transferencia,
          baucher,
          metodo_pago,
          ...(comprobante_tranferencia && { comprobante_tranferencia }),
        },
        status: "published",
      });
      console.log(
        "=== [crearConItems] ✅ Pedido creado:",
        pedidoDoc.documentId
      );

      // 3) Crear items y descontar stock
      for (const item of pedido_items) {
        const productoId = item._internalProductId;
        console.log(
          `=== [crearConItems] Creando pedido-item para productoId ${productoId}`
        );
        await strapi.documents("api::pedido-item.pedido-item").create({
          data: {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            producto: productoId,
            pedido: pedidoDoc.id,
          },
          status: "published",
        });
        console.log("    pedido-item creado");

        console.log(
          `=== [crearConItems] Descontando stock producto ${productoId}`
        );
        const updateRes = await strapi.db.connection.raw(
          `UPDATE "productos" 
             SET stock = stock - ? 
           WHERE id = ? 
         RETURNING stock`,
          [item.cantidad, productoId]
        );
        const newStock = updateRes.rows?.[0]?.stock ?? 0;
        console.log(`    nuevo stock = ${newStock}`);

        console.log("    Emitiendo socket stockUpdated");
        strapi.io.emit("stockUpdated", {
          productId: productoId,
          stock: newStock,
        });
      }

      // 4) Buscar pedido completo (por documentId) para la respuesta
      console.log(
        "=== [crearConItems] Buscando pedido completo para respuesta..."
      );
      const fullPedido = await strapi
        .documents("api::pedido.pedido")
        .findFirst({
          where: { documentId: pedidoDoc.documentId },
          status: "published",
          populate: {
            pedido_items: { populate: ["producto"] },
            comprobante_tranferencia: true,
          },
        });
      console.log("=== [crearConItems] ✅ Pedido completo obtenido");

      console.log("=== [crearConItems] Emitiendo socket orderCreated");
      strapi.io.emit("orderCreated", fullPedido);
      console.log("=== [crearConItems] Flujo completado 👍");

      return ctx.send({
        message: "Pedido creado con éxito.",
        data: fullPedido,
      });
    } catch (err) {
      console.error("=== [crearConItems] ❌ Error interno:", err);
      // rollback parcial
      if (pedidoDoc?.id) {
        console.log("=== [crearConItems] Rollback: eliminando pedido parcial");
        await strapi.documents("api::pedido.pedido").delete({
          documentId: pedidoDoc.documentId,
        });
      }
      ctx.status = err.status || 500;
      return ctx.send({
        error: err.message || "Error interno al crear pedido.",
      });
    }
  },

  /**
   * Override de update:
   * • Solo modifica campos enviados.
   * • Maneja upload de comprobante_tranferencia y lo relaciona.
   * • Preserva pedido_items.
   * • Devuelve stock si cambia a "cancelado".
   * • Emite sockets y logs.
   */
  async update(ctx) {
    console.log("=== [pedido.update] Inicio de flujo");
    const { id: docId } = ctx.params;
    console.log("    documentId =", docId);

    // archivos subidos
    const files = ctx.request.files ?? {};
    console.log("    files recibidos =", Object.keys(files));

    // datos JSON
    const incoming = ctx.request.body.data ?? {};
    console.log("    incoming.data =", incoming);

    try {
      // 1) Cargo versión publicada para preservar items
      console.log("    Cargando pedido previo...");
      const previo = await strapi.documents("api::pedido.pedido").findFirst({
        where: { documentId: ctx.params.id },
        status: "published",
        populate: {
          pedido_items: { populate: ["producto"] },
          comprobante_tranferencia: true,
        },
      });
      if (!previo) {
        console.log("    ❌ Pedido no publicado");
        return ctx.notFound({ error: "Pedido no publicado." });
      }
      console.log(
        "    previo.estado =",
        previo.estado,
        "| items =",
        previo.pedido_items.map((i) => i.id),
        "| comprobante previo =",
        previo.comprobante_tranferencia?.id
      );

      // 2) Armo objeto de actualización
      const dataToUpdate = { ...incoming };
      // siempre preservo items
      if (previo.pedido_items.length) {
        dataToUpdate.pedido_items = previo.pedido_items.map((i) => i.id);
      }
      console.log("    dataToUpdate inicial:", dataToUpdate);

      // 3) Si llega un comprobante nuevo, Strapi lo procesará
      const filesToUpdate = {};
      if (files.comprobante_tranferencia) {
        console.log("    📁 Procesando comprobante_tranferencia");
        filesToUpdate.comprobante_tranferencia = files.comprobante_tranferencia;
      }

      // 4) Devolver stock al cancelar
      const willCancel = incoming.estado === "cancelado";
      const wasCancel = previo.estado === "cancelado";
      console.log(`    willCancel=${willCancel}, wasCancel=${wasCancel}`);
      if (willCancel && !wasCancel) {
        console.log("    🚨 Cancelación: devolviendo stock...");
        const sumas = previo.pedido_items.reduce((acc, it) => {
          acc[it.producto.id] = (acc[it.producto.id] || 0) + it.cantidad;
          return acc;
        }, {});
        console.log("    sumas a devolver:", sumas);

        for (const [pid, qty] of Object.entries(sumas)) {
          console.log(`    Devolviendo ${qty} unidades al producto ${pid}`);
          const upd = await strapi.db.connection.raw(
            `UPDATE "productos"
                 SET stock = stock + ?
               WHERE id = ?
             RETURNING stock`,
            [qty, pid]
          );
          const restored = upd.rows?.[0]?.stock ?? 0;
          console.log(`    stock restaurado = ${restored}`);
          strapi.io.emit("stockUpdated", {
            productId: Number(pid),
            stock: restored,
          });
        }
      }

      // 5) Aplico update incluyendo archivos
      console.log("    📤 Aplicando entityService.update con data+files...");
      const updated = await strapi.entityService.update(
        "api::pedido.pedido",
        previo.id,
        {
          data: dataToUpdate,
          files: filesToUpdate,
          populate: {
            pedido_items: { populate: ["producto"] },
            comprobante_tranferencia: true,
          },
        }
      );

      console.log("    ✅ Pedido actualizado:", {
        id: updated.id,
        estado: updated.estado,
        items: updated.pedido_items.map((i) => i.id),
        comprobante: updated.comprobante_tranferencia?.id,
      });

      console.log("    Emitiendo socket orderUpdated");
      strapi.io.emit("orderUpdated", updated);

      return ctx.send({ message: "Pedido actualizado.", data: updated });
    } catch (err) {
      console.error("=== [pedido.update] ❌ Error interno:", err);
      ctx.status = err.status || 500;
      return ctx.send({
        error: err.message || "Error interno al actualizar pedido.",
      });
    }
  },
}));
