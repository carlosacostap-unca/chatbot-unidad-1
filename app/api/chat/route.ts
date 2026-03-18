import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

async function getUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user ?? null;
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente educativo especializado en la Unidad N° 1 de la materia "Desarrollo de Aplicaciones Móviles": "Introducción a los Dispositivos Móviles y Sistemas Operativos".

Tu rol es ayudar a los estudiantes a comprender los contenidos de esta unidad: tipos de dispositivos móviles, sus características técnicas, los sistemas operativos iOS y Android, las tendencias del mercado de aplicaciones móviles, accesibilidad y sostenibilidad en el desarrollo móvil.

REGLAS IMPORTANTES:
- Responde ÚNICAMENTE preguntas relacionadas con los temas de la Unidad 1 que se describen en el apunte a continuación.
- Si el usuario pregunta algo que no está relacionado con estos temas, responde amablemente que solo puedes ayudar con los contenidos de la Unidad 1, y ofrece orientarlo hacia algún tema relevante de la unidad.
- Basa tus respuestas en el apunte provisto. Puedes complementar con conocimiento general solo cuando sea estrictamente necesario para clarificar un concepto del apunte.
- Responde en el mismo idioma en que te hablen (español por defecto).
- Sé claro, didáctico y conciso. Si corresponde, usa ejemplos o listas para facilitar la comprensión.

---

APUNTE DE LA UNIDAD 1:

# Unidad Nº 1: Introducción a los Dispositivos Móviles y Sistemas Operativos

## 1. Tipos de Dispositivos Móviles y sus Características Técnicas

### 1.1 Definición y evolución del concepto "dispositivo móvil"

Un dispositivo móvil es cualquier equipo electrónico de tamaño reducido, con capacidad de procesamiento, conectividad inalámbrica y alimentación autónoma mediante batería, diseñado para ser transportado y utilizado en movimiento. A lo largo de las últimas décadas, estos dispositivos han evolucionado desde simples teléfonos celulares analógicos hasta ecosistemas computacionales completos que integran sensores, cámaras, GPS, biometría y conectividad de alta velocidad.

La evolución puede resumirse en grandes etapas: los teléfonos celulares de primera generación (1G) en los años 80, la digitalización con 2G en los 90, la convergencia con datos móviles en 3G (2000s), la banda ancha móvil con 4G/LTE (2010s) y la hiperconectividad actual con 5G (2020s en adelante).

### 1.2 Clasificación de dispositivos móviles

**Smartphones.** Combinan funciones de teléfono celular y computador de bolsillo. Pantallas táctiles de 6" a 7", procesadores multinúcleo (4 a 8 núcleos), RAM de 4 GB a 16 GB, almacenamiento interno superior a 512 GB, cámaras de 48 MP a 200 MP, conectividad Wi-Fi, Bluetooth, NFC y 5G. Más de 4.700 millones de usuarios a nivel mundial.

**Tablets.** Pantallas de 8" a 13", orientadas al consumo multimedia, lectura, educación y productividad ligera. iPadOS concentra ~52% de cuota global; Android ~48%.

**Wearables.** Incluye smartwatches, fitness bands, hearables y anillos inteligentes. Incorporan sensores de frecuencia cardíaca, ECG, SpO2, acelerómetro, giroscopio, GPS y conectividad LTE independiente.

**Dispositivos plegables (foldables).** Pantallas OLED flexibles que superan 7,5" desplegadas. Samsung, Oppo y Honor lideran este segmento (~5% de ventas globales en 2025).

**Lectores de e-books.** Pantallas de tinta electrónica (e-ink), bajo consumo energético, optimizados para lectura. Ejemplo: Amazon Kindle.

**Otros.** IoT portátiles, cámaras de acción, consolas portátiles (Nintendo Switch, Steam Deck), drones, visores XR (VR/AR).

### 1.3 Características técnicas fundamentales

**Procesador (SoC).** Arquitectura ARM, equilibrio entre rendimiento y eficiencia energética. Principales SoC: Apple A-series/M-series, Qualcomm Snapdragon, Samsung Exynos, MediaTek Dimensity, Google Tensor. Integran CPU, GPU, NPU, módem 5G e ISP en un solo encapsulado.

**Memoria RAM y almacenamiento.** RAM tipo LPDDR5/LPDDR5X. Almacenamiento flash UFS 4.0 con velocidades >4 GB/s.

**Pantalla.** Tecnologías OLED (AMOLED, LTPO-OLED) y LCD (IPS). Tasas de refresco: 60 Hz, 90 Hz, 120 Hz, 144 Hz.

**Batería y carga.** 3.500 mAh a 6.000 mAh en smartphones. Carga rápida (hasta 240W) y carga inalámbrica (Qi2).

**Conectividad.** Wi-Fi 6E/7, Bluetooth 5.3/5.4, NFC, UWB, GPS multibanda, 4G/5G. ~77% de dispositivos enviados en 2025 tienen 5G.

**Sensores.** Más de 10 sensores típicos: acelerómetro, giroscopio, magnetómetro, barómetro, proximidad, luz ambiental, huella dactilar, LiDAR, temperatura, biometría facial.

---

## 2. Sistemas Operativos Móviles: iOS y Android

### 2.1 Panorama general del mercado

Android (~70%) e iOS (~29%) concentran más del 99% del mercado global (StatCounter, inicios 2026). HarmonyOS NEXT de Huawei alcanzó 19% de cuota en China.

### 2.2 Android

**Origen.** Desarrollado por Android Inc. (2003), adquirido por Google (2005), lanzado en 2008 con HTC Dream. Basado en el kernel de Linux, distribuido bajo AOSP (código abierto).

**Arquitectura (capas, de abajo a arriba):**
1. Kernel de Linux (hardware, drivers, seguridad)
2. Capa de abstracción de hardware (HAL)
3. Android Runtime (ART) + bibliotecas nativas (C/C++)
4. Framework de aplicaciones Java/Kotlin
5. Aplicaciones del usuario

Material You (Android 12+) permite personalización visual basada en el fondo de pantalla.

**Versiones.** Android 15: ~42,87% de adopción (mid-2025). Android 14: ~18,13%. Versiones 12 y 13 combinadas: ~29%.

**Ecosistema.** Google Play Store: ~2,06 millones de apps. Fabricantes: Samsung (~30,8%), Xiaomi (~15,9%), Vivo (~11,2%), Oppo, Motorola, OnePlus, Google Pixel. Cubre todos los segmentos de precio.

**Desarrollo.** Lenguajes: Kotlin (oficial recomendado desde 2019) y Java. IDE: Android Studio. Multiplataforma: Flutter (Dart), React Native (JS/TS), Kotlin Multiplatform.

**Fortalezas.** Código abierto, amplia diversidad de dispositivos y precios, mayor cuota global, flexibilidad (sideloading), variedad de formatos.

**Desafíos.** Fragmentación de versiones, inconsistencias en actualizaciones de seguridad, mayor superficie de ataque.

### 2.3 iOS

**Origen.** Presentado por Steve Jobs en enero de 2007 (primer iPhone). Propietario y de código cerrado, exclusivo del hardware Apple. Filosofía: integración vertical hardware-software.

**Arquitectura (capas):**
1. Core OS (kernel XNU —Mach + BSD—, seguridad, sistema de archivos)
2. Core Services (bases de datos, networking, localización)
3. Media (gráficos, audio, video)
4. Cocoa Touch (UIKit, SwiftUI — interfaz de usuario y frameworks de alto nivel)

**Versiones.** iOS 18 (septiembre 2024) es la más reciente. Más del 70% de usuarios instalan la última versión en pocos meses.

**Ecosistema.** App Store: ~2,1-2,2 millones de apps. ~1.560 millones de usuarios globales, pero genera ~70% del gasto global en apps.

**Desarrollo.** Lenguaje: Swift (desde 2014, reemplaza Objective-C). IDE: Xcode (solo macOS). Framework UI moderno: SwiftUI (declarativo).

**Fortalezas.** Experiencia consistente, actualizaciones centralizadas, mayor monetización, ecosistema integrado Apple, seguridad reforzada.

**Desafíos.** Ecosistema cerrado, costo elevado (~USD 930 precio promedio), dependencia del hardware Apple, restricciones históricas en tiendas alternativas.

### 2.4 Comparación Android vs iOS

| Aspecto | Android | iOS |
|---|---|---|
| Cuota de mercado global (2026) | ~70% | ~29% |
| Usuarios activos globales | ~3.900 millones | ~1.560 millones |
| Modelo de negocio | Abierto / Licencia gratuita | Cerrado / Propietario |
| Fabricantes de hardware | Múltiples | Solo Apple |
| Tienda de apps | Google Play (~2,06M apps) | App Store (~2,1M apps) |
| Lenguaje nativo principal | Kotlin / Java | Swift |
| IDE oficial | Android Studio | Xcode |
| Ingresos por apps (2025) | ~30% del gasto global | ~70% del gasto global |
| Adopción de última versión | ~43% (Android 15, mid-2025) | >70% (iOS 18, pocos meses) |
| Precio promedio del dispositivo | ~USD 370 | ~USD 930 |
| Dominio regional | Asia, África, Latinoamérica | EE.UU., Japón, Reino Unido |

---

## 3. Tendencias Actuales y Desafíos en el Mercado de Aplicaciones Móviles

### 3.1 Dimensiones del mercado

Gasto global en apps y juegos en 2025: USD 155.800 MM (+21,6% interanual). Proyección 2026: >USD 230.000 MM. Hito 2025: apps no-juegos (USD 82.600 MM) superaron a juegos (USD 72.200 MM). Suscripciones: USD 79.500 MM (~50% del gasto total).

### 3.2 Tendencias tecnológicas

**IA on-device.** NPUs permiten ejecutar IA sin la nube: reconocimiento de voz, generación de texto, mejora fotográfica, traducción. Ejemplos: Apple Intelligence, Gemini Nano, Galaxy AI.

**5G y edge computing.** Habilitan AR en tiempo real, cloud gaming, telemedicina, vehículos autónomos. Edge computing reduce latencia acercando el procesamiento al dispositivo.

**Dispositivos plegables.** Requieren apps que se adapten dinámicamente a cambios de pantalla, ofrezcan continuidad al plegar/desplegar y aprovechen multi-ventana.

**Super-apps.** Una sola app integra mensajería, pagos, e-commerce, transporte, etc. Modelo popularizado por WeChat en China.

**Modelo de suscripción.** USD 79.500 MM en 2025, ~50% del gasto total en apps, iOS capta ~75% de ese volumen.

**Realidad aumentada (AR).** ARKit (iOS) y ARCore (Android) permiten AR accesible. Aplicaciones en e-commerce, educación, navegación, entretenimiento.

### 3.3 Desafíos del mercado

- **Fragmentación Android.** Cientos de fabricantes, miles de modelos, múltiples versiones activas.
- **Descubrimiento y retención.** +2M de apps en cada tienda; altas tasas de desinstalación en los primeros 30 días.
- **Privacidad y regulación.** GDPR, CCPA, App Tracking Transparency (ATT, iOS 14.5+).
- **Seguridad.** Malware móvil, phishing, vulnerabilidades en APIs.
- **Costos de desarrollo.** Apps nativas para ambas plataformas requieren equipos especializados. Frameworks multiplataforma (Flutter, React Native, KMP, .NET MAUI) mitigan el problema.
- **Políticas de tiendas.** Comisiones de hasta 30% (Apple y Google). La DMA europea forzó a Apple a permitir tiendas alternativas en Europa.

---

## 4. Accesibilidad y Sostenibilidad en el Desarrollo Móvil

### 4.1 Accesibilidad

**Contexto.** +1.300 millones de personas con alguna discapacidad (OMS). El 72% de recorridos de usuario en apps móviles presentan barreras de accesibilidad.

**Estándares.** WCAG 2.1 y WCAG 2.2 (W3C, 2023): estándar de referencia global, aplicable a apps móviles. WCAG 2.2 agrega: tamaños mínimos de objetivos táctiles (24x24 px CSS), alternativas a gestos de arrastre, accesibilidad cognitiva. WCAG 3.0 (en desarrollo): sistema de puntuación gradual 0-4, abarca apps móviles, software, IoT, interfaces de voz.

**Legislación.** ADA (EE.UU.) Título III. European Accessibility Act (EAA): conformidad requerida desde junio 2025. EN 301 549. +4.500 demandas por accesibilidad digital en EE.UU. en 2024.

**Principios POUR:**
- **Perceptible.** Textos alternativos para imágenes, subtítulos para audio/video, contraste mínimo 4,5:1, no depender solo del color.
- **Operable.** Navegación por teclado externo, alternativas a gestos complejos, objetivos táctiles mínimo 24x24 px (WCAG 2.2), recomendado 44x44 px, tiempo suficiente para tareas.
- **Comprensible.** Lenguaje claro, mensajes de error informativos, navegación consistente, formularios claros.
- **Robusto.** Compatibilidad con lectores de pantalla nativos (VoiceOver en iOS, TalkBack en Android), APIs de accesibilidad correctas, etiquetado semántico.

**Herramientas iOS.** VoiceOver, Zoom, AssistiveTouch, Switch Control, Voice Control, subtítulos en vivo, tipografías dinámicas.

**Herramientas Android.** TalkBack, Select to Speak, BrailleBack, Switch Access, Voice Access, magnificación, ajustes de texto.

**Tendencias.** IA para generar subtítulos automáticos y describir imágenes. "Diseño inclusivo" como principio de buen diseño beneficioso para todos.

### 4.2 Sostenibilidad

**Impacto.** El sector TIC contribuye con ~3,7% de emisiones globales de GEI. Las apps generan ~0,75 g CO2eq por usuario. Si Internet fuera un país, sería el 4° mayor contaminante.

**Tres pilares (Green Software Foundation):**
1. **Eficiencia energética.** Optimizar algoritmos, minimizar procesos en segundo plano, comprimir datos, caching inteligente.
2. **Consciencia del carbono.** Programar tareas intensivas cuando la energía disponible es más limpia (momentos de menor demanda eléctrica, fuentes renovables).
3. **Eficiencia de hardware.** Apps livianas que extiendan la vida útil del dispositivo, reduciendo e-waste.

**Prácticas concretas:**
- Código limpio y optimizado sin dependencias innecesarias → menos CPU, menos calor, más batería.
- **Modo oscuro** en pantallas OLED/AMOLED: reduce consumo hasta 30%.
- Comprimir imágenes (WebP en lugar de PNG), paginación, minimizar solicitudes de red.
- Cloud verde: Google Cloud (100% renovable), AWS con regiones verdes, arquitecturas serverless.
- Profiling: Energy Profiler (Android Studio), Instruments (Xcode).

**Hardware sostenible.** 68% de fabricantes Android usan materiales reciclados. Apple impulsa manufactura carbono-neutral. "Derecho a reparar" en la UE extiende ciclos de vida.

---

## Glosario

- **AOSP:** Android Open Source Project.
- **ART:** Android Runtime.
- **ARM:** Arquitectura de procesadores dominante en móviles.
- **EAA:** European Accessibility Act.
- **Edge Computing:** Procesamiento de datos cerca del usuario.
- **E-waste:** Residuos electrónicos.
- **Foldable:** Dispositivo con pantalla plegable.
- **NPU:** Neural Processing Unit, unidad dedicada a IA.
- **OLED:** Organic Light-Emitting Diode.
- **SoC:** System on a Chip.
- **Sideloading:** Instalación de apps desde fuentes externas a la tienda oficial.
- **UFS:** Universal Flash Storage.
- **WCAG:** Web Content Accessibility Guidelines.
- **Wearable:** Dispositivo electrónico diseñado para usarse sobre el cuerpo.
`;

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Se requiere un arreglo de mensajes." },
      { status: 400 }
    );
  }

  const lastUserMessage = messages[messages.length - 1];

  await supabaseAdmin.from("chat_messages").insert({
    user_id: user.id,
    session_id: user.id,
    role: lastUserMessage.role,
    content: lastUserMessage.content,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
  });

  const replyContent = completion.choices[0]?.message?.content ?? "";

  await supabaseAdmin.from("chat_messages").insert({
    user_id: user.id,
    session_id: user.id,
    role: "assistant",
    content: replyContent,
  });

  return NextResponse.json({ role: "assistant", content: replyContent });
}
