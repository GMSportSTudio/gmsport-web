/**
 * scripts/comprobar_rutas_estaticas.mjs
 *
 * Comprueba que el middleware de idiomas no se traga ningún fichero de
 * `public/`. Se ejecuta antes de desplegar; no necesita ningún framework de
 * tests (este proyecto no tiene ninguno).
 *
 * QUÉ PASÓ (02/07 → 10/08/2026)
 * -----------------------------
 * `proxy.ts` decidía qué era un fichero estático con una lista blanca de
 * extensiones — `png|jpg|gif|svg|ico|mp4|webm|webp|woff|...` — y **`pdf` no
 * estaba**. Así que `/Manual_InboundStudio_latest.pdf` caía al middleware de
 * next-intl, se redirigía a `/es/Manual_InboundStudio_latest.pdf`, que no
 * existe, y devolvía 404.
 *
 * El PDF estaba en git y desplegado, así que desde fuera parecía un problema
 * del fichero y no de una regla de enrutado. Cinco semanas con los dos
 * manuales inaccesibles, descubierto porque los usuarios se quejaron.
 *
 * Ahora la regla pregunta si el último tramo de la ruta tiene extensión, que
 * cubre lo que venga. Esto lo verifica contra el contenido real de `public/`.
 *
 * Uso:
 *   node scripts/comprobar_rutas_estaticas.mjs
 */
import fs from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();

function reglaDeFichero() {
  const src = fs.readFileSync(path.join(RAIZ, "proxy.ts"), "utf8");
  const m = src.match(/const ES_FICHERO_RE = (\/.+\/[a-z]*);/);
  if (!m) {
    console.error(
      "\n✗ No encuentro ES_FICHERO_RE en proxy.ts.\n" +
      "  ¿Se ha vuelto a una lista blanca de extensiones? Eso fue lo que\n" +
      "  dejó los manuales en 404 durante cinco semanas.\n");
    process.exit(1);
  }
  const cuerpo = m[1];
  const corte = cuerpo.lastIndexOf("/");
  return new RegExp(cuerpo.slice(1, corte), cuerpo.slice(corte + 1));
}

function ficherosPublicos() {
  const salida = [];
  const recorrer = (dir, prefijo = "") => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = `${prefijo}/${e.name}`;
      if (e.isDirectory()) recorrer(path.join(dir, e.name), rel);
      else salida.push(rel);
    }
  };
  recorrer(path.join(RAIZ, "public"));
  return salida;
}

const esFichero = reglaDeFichero();
let fallos = 0;

// 1. Todo lo que hay en public/ tiene que pasar de largo.
const publicos = ficherosPublicos();
const tragados = publicos.filter((p) => !esFichero.test(p));
if (tragados.length) {
  console.error("\n✗ El middleware se tragaría estos ficheros de public/:");
  for (const t of tragados) console.error(`    ${t}`);
  console.error("  Devolverían 404 en producción.\n");
  fallos++;
} else {
  console.log(`  ✓ ${publicos.length} ficheros de public/ pasan de largo`);
}

// 2. Las rutas de la web NO deben confundirse con ficheros: si lo hicieran,
//    dejaría de funcionar el cambio de idioma.
const rutas = ["/", "/es", "/en", "/fr", "/es/precios", "/prueba", "/v1.2/precios"];
const confundidas = rutas.filter((r) => esFichero.test(r));
if (confundidas.length) {
  console.error("\n✗ Estas rutas se toman por ficheros y perderían el idioma:");
  for (const c of confundidas) console.error(`    ${c}`);
  fallos++;
} else {
  console.log("  ✓ las rutas de la web siguen yendo a next-intl");
}

// 3. Formatos que hoy no usamos. Una lista blanca fallaría en todos.
const futuros = ["/x.zip", "/x.csv", "/x.avif", "/x.mp3", "/x.pptx", "/x.json"];
const perdidos = futuros.filter((f) => !esFichero.test(f));
if (perdidos.length) {
  console.error("\n✗ Estos formatos no pasarían:", perdidos.join(" "));
  fallos++;
} else {
  console.log("  ✓ cubre formatos que todavía no usamos");
}

// 4. Toda carpeta de `app/` que NO viva bajo `[locale]` necesita DOS cosas, y
//    con una sola sigue rota:
//      · estar en INTL_EXCLUDED_PREFIXES (si no, next-intl la reescribe a
//        /es/... y devuelve 404)
//      · su propio layout.tsx con <html>+<body> (el layout raíz es
//        pass-through y Next los exige en ese nivel)
//
//    Olvidarlo no da error de compilación ni aviso: la página simplemente no
//    existe en producción. Pasó con `/prueba` —el botón «Empezar mis días» de
//    los correos— y dejó a todo el mundo sin poder activar su prueba hasta que
//    Xavi Sastre lo reportó el 24/08.
const IGNORAR = new Set(["[locale]", "(legal)", "api"]);

function prefijosExcluidos() {
  const src = fs.readFileSync(path.join(RAIZ, "proxy.ts"), "utf8");
  const m = src.match(/const INTL_EXCLUDED_PREFIXES = \[([\s\S]*?)\]/);
  if (!m) {
    console.error("\n✗ No encuentro INTL_EXCLUDED_PREFIXES en proxy.ts.\n");
    process.exit(1);
  }
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const excluidos = prefijosExcluidos();
const sinExcluir = [];
const sinLayout = [];

for (const e of fs.readdirSync(path.join(RAIZ, "app"), { withFileTypes: true })) {
  if (!e.isDirectory() || IGNORAR.has(e.name)) continue;
  const dir = path.join(RAIZ, "app", e.name);
  // Solo carpetas que son rutas de verdad (tienen page.tsx en algún nivel).
  const tieneRuta = fs.existsSync(path.join(dir, "page.tsx")) ||
    fs.readdirSync(dir, { withFileTypes: true }).some(
      (s) => s.isDirectory() && fs.existsSync(path.join(dir, s.name, "page.tsx")));
  if (!tieneRuta) continue;

  // Misma semántica que `proxy.ts`: prefijo, no coincidencia exacta.
  // `/descarga` cubre también `/descarga-canary`.
  if (!excluidos.some((x) => `/${e.name}`.startsWith(x))) sinExcluir.push(e.name);

  // Una página que solo redirige nunca llega a renderizar, así que no
  // necesita <html>+<body> propios.
  const paginaRaiz = path.join(dir, "page.tsx");
  const soloRedirige = fs.existsSync(paginaRaiz) &&
    /\bredirect\s*\(/.test(fs.readFileSync(paginaRaiz, "utf8"));
  if (soloRedirige) continue;

  const layout = path.join(dir, "layout.tsx");
  if (!fs.existsSync(layout)) {
    sinLayout.push(e.name);
  } else {
    const src = fs.readFileSync(layout, "utf8");
    if (!src.includes("<html") || !src.includes("<body")) sinLayout.push(e.name);
  }
}

if (sinExcluir.length || sinLayout.length) {
  console.error("\n✗ Rutas fuera de [locale] mal configuradas:");
  for (const r of sinExcluir) {
    console.error(`    /${r}  — falta en INTL_EXCLUDED_PREFIXES de proxy.ts (daría 404)`);
  }
  for (const r of sinLayout) {
    console.error(`    /${r}  — su layout.tsx no tiene <html>+<body>`);
  }
  console.error("");
  fallos++;
} else {
  console.log("  ✓ las rutas fuera de [locale] están excluidas y con layout propio");
}

if (fallos) process.exit(1);
console.log("");
