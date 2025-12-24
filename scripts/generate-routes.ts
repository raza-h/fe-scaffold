import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "src/app");

function getRoutesFromGroup(groupName: string): string[] {
  const groupPath = path.join(APP_DIR, groupName);

  if (!fs.existsSync(groupPath)) {
    return [];
  }

  const routes: string[] = [];

  function scanDir(dir: string, basePath: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith("(")) {
        const routePath = `${basePath}/${entry.name}`;
        const hasPage = fs.existsSync(path.join(dir, entry.name, "page.tsx"));

        if (hasPage) {
          routes.push(routePath);
        }

        scanDir(path.join(dir, entry.name), routePath);
      }
    }
  }

  scanDir(groupPath, "");
  return routes;
}

const protectedRoutes = getRoutesFromGroup("(app)");
const authRoutes = getRoutesFromGroup("(auth)");

const output = `export const protectedRoutes = ${JSON.stringify(protectedRoutes)};
export const authRoutes = ${JSON.stringify(authRoutes)};
`;

const configDir = path.join(process.cwd(), "src/config");
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(path.join(configDir, "routes.ts"), output);

console.log("Generated routes:");
console.log("Protected:", protectedRoutes);
console.log("Auth:", authRoutes);

