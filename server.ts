import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side middleware for parsing request bodies
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiInstance;
}

// REST Endpoint: Gemini AI chat assistant query router
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Falta el historial de mensajes o formato inválido." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        text: "ℹ️ El Asistente de IA está listo, pero requiere una clave **GEMINI_API_KEY** configurada.\n\nPor favor, dirígete a **Ajustes > Secretos** (Settings > Secrets) en tu panel lateral de AI Studio para registrar tu API Key e interactuar con el asistente basado en tus datos reales de boutique."
      });
    }

    // Build structured real-time knowledge base context string
    const productsInfo = context?.products
      ? context.products.map((p: any) => `- ID: ${p.id}, Nombre: ${p.name}, Precio: $${p.price} (DOP: RD$ ${(p.price * 58.5).toLocaleString()}), Stock: ${p.stock} unids (Límite crítico: ${p.criticalLimit}), Categoría: ${p.category}`).join("\n")
      : "No hay productos registrados.";

    const invoicesInfo = context?.invoices
      ? context.invoices.map((i: any) => `- Factura: ${i.id}, Cliente: ${i.customerName}, Vendedor: ${i.seller}, Total: RD$ ${i.totalAmount.toLocaleString()}, Estado: ${i.status}, Días de mora: ${i.daysOverdue}`).join("\n")
      : "No hay cobros pendientes.";

    const offersInfo = context?.offers
      ? context.offers.map((o: any) => `- Promo: ${o.title}, Descuento: ${o.discount}, Estado: ${o.active ? 'Activa' : 'Inactiva'}, Vence: ${o.expiryDate}, Código: ${o.code}`).join("\n")
      : "No hay ofertas registradas.";

    const profileInfo = context?.profile
      ? `Nombre: ${context.profile.firstName} ${context.profile.lastName}, Teléfono: ${context.profile.phone}`
      : "No especificado";

    // Format chat history for @google/genai SDK format
    // GoogleGenAI chat expects 'user' or 'model' roles.
    const contents = messages.map((m: any) => {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      };
    });

    // Generate response using gemini-3.5-flash as the standard robust model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `Eres Sofía, una ingeniosa Asistente de Inteligencia Artificial para el "Administrador de Boutique" de alta gama.
Tu misión es contestar todo tipo de consultas empresariales, analizar métricas de inventario, sugerir tácticas agresivas para reducir el saldo de cuentas vencidas y proponer ofertas atractivas.

A continuación encuentras el estado del negocio EN TIEMPO REAL:
===================================
VENDEDOR/ADMINISTRADOR ACTIVO:
${profileInfo}

INVENTARIO DE PRODUCTOS:
${productsInfo}

CUENTAS POR COBRAR (CARTERA):
${invoicesInfo}

CAMPANAS Y OFERTAS:
${offersInfo}
===================================

DIRECTRICES:
1. Sé amable, clara, profesional y responde en español con un tono cercano pero corporativo.
2. Utiliza viñetas y formato Markdown enriquecido para estructurar tus respuestas y facilitar la lectura en pantalla mediana/pequeña.
3. Puedes hacer sumas, promedios o dar resúmenes numéricos. Por ejemplo, calcula cuántas facturas están vencidas y el total adeudado. Las facturas tienen montos en pesos dominicanos (RD$). Los productos tienen dólares estadounidense ($ USD) pero puedes usar la conversión aproximada de 1 USD = 58.5 RD$ para dar contexto equivalente.
4. Si te preguntan algo ajeno a la boutique o la contabilidad comercial, responde amistosamente indicando que fuiste programada para asistir con las operaciones de esta boutique.
5. Recomienda productos específicos del catálogo o campañas en tus sugerencias tácticas.`,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Error de servidor al llamar a la Inteligencia Artificial: " + error.message });
  }
});

// Implement Vite middleware or static build handler
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    // Vite in dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Using Vite development middleware");
  } else {
    // Production compiled static assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Boutique Full-Stack server booted at http://0.0.0.0:${PORT}`);
  });
}

setupApp();
