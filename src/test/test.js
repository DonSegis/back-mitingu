import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "30s",
};

const BASE_URL = "http://localhost:1337";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzMDUyMTAwLCJleHAiOjE3NTU2NDQxMDB9.WAHErMRt7LQJsvtDZLN08DCDvqfjrYM-8rqe-g18CZc";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export default function () {
  // === 1. GET /api/productos ===
  let res = http.get(`${BASE_URL}/api/productos?pagination[pageSize]=10`, {
    headers: HEADERS,
  });

  check(res, {
    "GET productos status 200": (r) => r.status === 200,
  });

  // === 2. POST /api/productos ===
  const newProduct = {
    nombre: `Producto Test ${Math.random()}`,
    precio: 100,
    costo: 60,
    descripcion: "Descripción de prueba",
    descripcion_corta: "Desc corta",
    categoria: 59, // Asegúrate de que esta categoría exista
    stock: 10,
    activo: true,
    codigo_barra: Math.floor(100000000000 + Math.random() * 900000000000), // 12 dígitos
  };

  res = http.post(
    `${BASE_URL}/api/productos`,
    JSON.stringify({ data: newProduct }),
    { headers: HEADERS }
  );

  check(res, {
    "POST producto status 200/201": (r) => r.status === 200 || r.status === 201,
  });

  if (res.status !== 200 && res.status !== 201) {
    console.log("❌ Error POST:", res.status, res.body);
  }

  let productId;
  try {
    const responseBody = JSON.parse(
      typeof res.body === "string"
        ? res.body
        : new TextDecoder().decode(res.body)
    );
    productId = responseBody.data?.documentId; // ✅ CORREGIDO
    console.log("✅ Producto creado con ID:", productId);
  } catch (e) {
    console.log("❌ No se pudo obtener el ID del producto creado");
  }

  // === 3. PUT /api/productos/:id ===
  if (productId) {
    const updatedProduct = {
      nombre: `Producto Actualizado ${Math.random()}`,
      precio: 200,
      costo: 120,
      descripcion: "Nueva descripción",
      descripcion_corta: "Desc corta nueva",
      categoria: 59,
      stock: 50,
      activo: true,
      codigo_barra: Math.floor(100000000000 + Math.random() * 900000000000),
    };

    console.log("➡️ Enviando PUT data:", JSON.stringify(updatedProduct));

    res = http.put(
      `${BASE_URL}/api/productos/${productId}`,
      JSON.stringify({ data: updatedProduct }),
      { headers: HEADERS }
    );

    check(res, {
      "PUT producto status 200": (r) => r.status === 200,
    });

    if (res.status !== 200) {
      console.log("❌ Error PUT:", res.status, res.body);
    }

    // === 4. GET /api/productos/:id ===
    res = http.get(
      `${BASE_URL}/api/productos/${productId}?populate[imagen][fields][0]=url&populate[categoria][fields][0]=nombre`,
      { headers: HEADERS }
    );

    check(res, {
      "GET producto actualizado status 200": (r) => r.status === 200,
    });

    // // === 5. DELETE /api/productos/:id ===
    // res = http.del(`${BASE_URL}/api/productos/${productId}`, null, {
    //   headers: HEADERS,
    // });

    // check(res, {
    //   "DELETE producto status 200": (r) => r.status === 200,
    // });

    if (res.status !== 200) {
      console.log("❌ Error DELETE:", res.status, res.body);
    } else {
      console.log("🧹 Producto eliminado correctamente.");
    }
  }

  sleep(1);
}
