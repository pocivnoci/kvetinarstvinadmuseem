/**
 * Ikony mobilní aplikace „Můj krám" (admin přidaný na plochu telefonu).
 *
 * Znak — růže na kupoli muzea — se vyřízne přímo z loga (public/logo.svg),
 * ne z ručně překreslené favikony, která na ploše telefonu vypadala divně.
 *
 * Spuštění (knihovnu na vykreslení SVG repo nepotřebuje nikde jinde,
 * proto není v package.json):
 *
 *   npm install --no-save @resvg/resvg-js
 *   node scripts/generate-app-icons.mjs
 */
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

const logo = fs.readFileSync("public/logo.svg", "utf8");
// Obsah loga bez obalového <svg> a bez XML hlavičky.
const inner = logo.slice(logo.indexOf(">", logo.indexOf("<svg")) + 1, logo.lastIndexOf("</svg>"));
// Znak v souřadnicích loga — vlevo od nápisu, s rezervou kolem tahů.
const box = { x: 363, y: 367, w: 608, h: 1136 };

/** Krémový čtverec se znakem uprostřed; heightShare = výška znaku z výšky ikony. */
function icon(heightShare, rounded) {
  const h = 1024 * heightShare;
  const w = (h * box.w) / box.h;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" ${rounded ? 'rx="208" ' : ""}fill="#F4EDE0"/>
  <svg x="${((1024 - w) / 2).toFixed(1)}" y="${((1024 - h) / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}" fill="#2A2620">${inner}</svg>
</svg>`;
}

// „any" — zakulacený čtverec, znak velký.
const any = icon(0.76, true);
// Maskovatelná pro Android: Android ikonu ořízne do kruhu (bezpečná zóna
// je kruh přes 80 % šířky), takže znak musí být menší. Plný čtverec bez
// průhledných rohů.
const maskable = icon(0.66, false);
// iPhone ikonu jen zakulatí, kruhem neořezává — znak může být větší.
// Průhledné rohy by na iPhonu zčernaly, proto taky plný čtverec.
const apple = icon(0.74, false);

const out = "public/admin-app";
function render(src, size, name) {
  const png = new Resvg(src, { fitTo: { mode: "width", value: size } }).render().asPng();
  fs.writeFileSync(`${out}/${name}`, png);
  console.log(`${name}  ${size}×${size}  ${png.length} B`);
}

render(any, 192, "icon-192.png");
render(any, 512, "icon-512.png");
render(maskable, 512, "icon-maskable-512.png");
render(apple, 180, "apple-touch-icon.png");
