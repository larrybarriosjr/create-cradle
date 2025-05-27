import fs from "node:fs/promises";
import path from "node:path";

export const validateProjectName = (val) => {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(val);
};

export const renamePackageJsonName = async (targetDir, projectName) => {
  const packageJsonPath = path.join(targetDir, "package.json");
  try {
    const packageJsonData = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonData);
    packageJson.name = projectName;
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const copyFilesAndDirectories = async (source, destination) => {
  const entries = await fs.readdir(source);

  for (const entry of entries) {
    const sourcePath = path.join(source, entry);
    const destPath = path.join(destination, entry);

    const stat = await fs.lstat(sourcePath);
    const filename = path.basename(destPath);

    if (stat.isDirectory()) {
      await fs.mkdir(destPath);
      await copyFilesAndDirectories(sourcePath, destPath);
    } else {
      await fs.cp(
        sourcePath,
        filename.startsWith("_")
          ? path.resolve(path.dirname(destPath), filename.replace(/^_/, "."))
          : destPath
      );
    }
  }
};

export const getPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent ?? "";
  const packageManager = /pnpm/.test(userAgent)
    ? "pnpm"
    : /yarn/.test(userAgent)
    ? "yarn"
    : /bun/.test(userAgent)
    ? "bun"
    : "npm";

  return packageManager;
};
