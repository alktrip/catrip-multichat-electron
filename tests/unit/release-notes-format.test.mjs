import test from "node:test";
import assert from "node:assert/strict";
import { releaseNotesToPlainText } from "../../dist/main/releaseNotesFormat.js";

test("releaseNotesToPlainText convierte HTML de GitHub a texto legible", () => {
  const html = `<h2>Para quién es esta versión</h2>
<p>Si en <strong>1.4.0</strong> tenías activado el autoinicio.</p>
<ul>
<li>Primer punto</li>
<li>Segundo punto</li>
</ul>`;
  const plain = releaseNotesToPlainText(html);
  assert.match(plain, /Para quién es esta versión/);
  assert.match(plain, /1\.4\.0/);
  assert.match(plain, /• Primer punto/);
  assert.doesNotMatch(plain, /<h2>/);
  assert.doesNotMatch(plain, /<strong>/);
});

test("releaseNotesToPlainText limpia markdown básico", () => {
  const md = "## Título\n\nTexto con **negrita** y `código`.";
  const plain = releaseNotesToPlainText(md);
  assert.match(plain, /Título/);
  assert.match(plain, /negrita/);
  assert.doesNotMatch(plain, /\*\*/);
});
