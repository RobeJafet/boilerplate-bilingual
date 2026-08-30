#!/usr/bin/env node
/**
 * Scaffolds a new section module: Component.tsx, schema.ts, query.ts,
 * types.ts, index.ts, and registers it in sections/registry.ts.
 *
 * Usage:
 *   pnpm new:section <name> [--usableIn=home,page] [--title="Display Title"]
 *
 * If <name> or --usableIn are omitted, you'll be prompted for them.
 * `sections/types.ts` needs no changes — the `Section` union is derived
 * automatically from `SECTIONS` in registry.ts.
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const VALID_DOC_TYPES = ["home", "page"];
const SECTIONS_DIR = path.join(process.cwd(), "sections");
const REGISTRY_PATH = path.join(SECTIONS_DIR, "registry.ts");

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      flags[key] = value ?? "true";
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function writeFile(filePath, contents) {
  fs.writeFileSync(filePath, contents, "utf8");
  console.log(`  + ${path.relative(process.cwd(), filePath)}`);
}

function typesTemplate({ name, PascalName }) {
  return `export type ${PascalName}Section = {
    _type: "${name}";
    _key: string;
};
`;
}

function schemaTemplate({ name, title }) {
  return `import { defineField, defineType } from "sanity";

export default defineType({
    name: '${name}',
    title: '${title}',
    type: 'object',
    fields: [],
    preview: {
        prepare() {
            return {
                title: "Seccion ${title}",
            }
        }
    }
});
`;
}

function queryTemplate({ name }) {
  return `import { groq } from "next-sanity";

export const query = groq\`
    _type == "${name}" => {
        _type,
        _key,
    }
\`;
`;
}

function componentTemplate({ name, PascalName }) {
  return `import { ${PascalName}Section } from './types';

export default function ${PascalName}(section: ${PascalName}Section) {
    return (
        <section className="${name}">
        </section>
    );
}
`;
}

function indexTemplate({ name, PascalName, usableIn }) {
  const usableInLiteral = usableIn.map((doc) => `'${doc}'`).join(", ");
  return `import ${PascalName} from './Component';
import schema from './schema';
import { query } from './query';
import { ${PascalName}Section } from './types';

export const ${name}Module: SectionModule<${PascalName}Section> = {
    name: '${name}',
    schema,
    query,
    Component: ${PascalName},
    usableIn: [${usableInLiteral}],
};
`;
}

function registerInRegistry({ name }) {
  const original = fs.readFileSync(REGISTRY_PATH, "utf8");
  const importLine = `import { ${name}Module } from './${name}/index';`;

  if (original.includes(importLine)) {
    console.log(`  = registry.ts ya importa ${name}Module (sin cambios)`);
    return;
  }

  const importRegex = /^import .+;$/gm;
  const matches = [...original.matchAll(importRegex)];
  let content = original;
  if (matches.length === 0) {
    content = `${importLine}\n${original}`;
  } else {
    const lastImport = matches[matches.length - 1];
    const insertPos = lastImport.index + lastImport[0].length;
    content =
      original.slice(0, insertPos) + `\n${importLine}` + original.slice(insertPos);
  }

  const arrayRegex =
    /(export const SECTIONS = \[[\s\S]*?)(\n\] as const(?: satisfies readonly SectionModule\[\])?;)/;
  if (!arrayRegex.test(content)) {
    throw new Error("No pude encontrar el array SECTIONS en registry.ts");
  }
  content = content.replace(arrayRegex, `$1\n    ${name}Module,$2`);

  fs.writeFileSync(REGISTRY_PATH, content, "utf8");
  console.log(`  + sections/registry.ts (import + entrada en SECTIONS)`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const rl = readline.createInterface({ input, output });

  let rawName = positional[0];
  if (!rawName) {
    rawName = (await rl.question("Nombre de la sección (ej. testimonials): ")).trim();
  }
  if (!rawName) {
    rl.close();
    console.error("Necesito un nombre de sección.");
    process.exit(1);
  }

  const name = rawName;
  const PascalName = rawName;
  const title = flags.title ?? rawName;

  let usableInRaw = flags.usableIn;
  if (!usableInRaw) {
    usableInRaw = await rl.question(
      `¿Dónde se puede usar? (${VALID_DOC_TYPES.join(", ")}), separado por comas [home]: `
    );
  }
  rl.close();

  const usableIn = (usableInRaw || "home").split(",").map((s) => s.trim()).filter(Boolean);
  for (const doc of usableIn) {
    if (!VALID_DOC_TYPES.includes(doc)) {
      console.error(`"${doc}" no es válido. Usa alguno de: ${VALID_DOC_TYPES.join(", ")}`);
      process.exit(1);
    }
  }

  const sectionDir = path.join(SECTIONS_DIR, name);
  if (fs.existsSync(sectionDir)) {
    console.error(`Ya existe sections/${name}/. Elige otro nombre o bórrala primero.`);
    process.exit(1);
  }

  fs.mkdirSync(sectionDir, { recursive: true });
  console.log(`\nCreando sections/${name}/`);

  writeFile(path.join(sectionDir, "types.ts"), typesTemplate({ name, PascalName }));
  writeFile(path.join(sectionDir, "schema.ts"), schemaTemplate({ name, title }));
  writeFile(path.join(sectionDir, "query.ts"), queryTemplate({ name }));
  writeFile(path.join(sectionDir, "Component.tsx"), componentTemplate({ name, PascalName }));
  writeFile(path.join(sectionDir, "index.ts"), indexTemplate({ name, PascalName, usableIn }));

  registerInRegistry({ name });

  console.log(`\nListo. "${name}" ya aparece en sections/registry.ts y en el tipo Section.`);
  console.log(`\nSiguientes pasos:`);
  console.log(`  1. Agrega los campos reales en sections/${name}/schema.ts`);
  console.log(`  2. Agrega esos campos a la query en sections/${name}/query.ts`);
  console.log(`  3. Agrega esos campos al tipo en sections/${name}/types.ts`);
  console.log(`  4. Construye el JSX en sections/${name}/Component.tsx`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
