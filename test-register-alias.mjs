import { existsSync } from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();

function resolveAlias(specifier) {
  const basePath = path.join(projectRoot, "src", specifier.slice(2));
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];

  const match = candidates.find((candidate) => existsSync(candidate));
  if (!match) {
    throw new Error(`Unable to resolve alias specifier: ${specifier}`);
  }

  return pathToFileURL(match).href;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return {
        shortCircuit: true,
        url: resolveAlias(specifier),
      };
    }

    return nextResolve(specifier, context);
  },
});
