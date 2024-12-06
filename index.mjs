#!/usr/bin/env node

import { existsSync, mkdirSync } from "fs";
import { cp, lstat, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";

(async () => {
  try {
    const response = await prompts([
      {
        type: "text",
        name: "projectName",
        message: "Enter your project name",
        initial: "my-project",
        format: (val) => val.toLowerCase().split(" ").join("-"),
        validate: (val) =>
          val === "." ||
          /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(val)
            ? true
            : "Project name should not contain special characters except hyphen (-)",
      },
    ]);
    const { projectName } = response;

    const targetDir = join(process.cwd(), projectName);
    const sourceDir = resolve(fileURLToPath(import.meta.url), "../cradle");

    const copyFilesAndDirectories = async (source, destination) => {
      const entries = await readdir(source);

      for (const entry of entries) {
        const sourcePath = join(source, entry);
        const destPath = join(destination, entry);

        const stat = await lstat(sourcePath);
        const filename = basename(destPath);

        if (stat.isDirectory()) {
          await mkdir(destPath);
          await copyFilesAndDirectories(sourcePath, destPath);
        } else {
          await cp(
            sourcePath,
            filename.startsWith("_")
              ? resolve(dirname(destPath), filename.replace(/^_/, "."))
              : destPath
          );
        }
      }
    };

    const renamePackageJsonName = async (targetDir, projectName) => {
      const packageJsonPath = join(targetDir, "package.json");
      try {
        const packageJsonData = await readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonData);
        packageJson.name = projectName;
        await writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
          "utf8"
        );
      } catch (err) {
        console.log(err.message);
      }
    };

    if (projectName === "." || !existsSync(targetDir)) {
      console.log("Target directory doesn't exist");
      console.log("Creating directory...");

      mkdirSync(targetDir, { recursive: true });
      console.log("Finished creating directory");

      await copyFilesAndDirectories(sourceDir, targetDir);
      await renamePackageJsonName(targetDir, projectName);
      console.log(`Finished generating your project ${projectName}`);

      if (projectName !== ".") {
        console.log(`cd ${projectName}`);
      }

      const userAgent = process.env.npm_config_user_agent ?? "";
      const packageManager = /pnpm/.test(userAgent)
        ? "pnpm"
        : /yarn/.test(userAgent)
        ? "yarn"
        : /bun/.test(userAgent)
        ? "bun"
        : "npm";
      console.log(`${packageManager} install`);
    } else {
      throw new Error("Target directory already exist!");
    }
  } catch (err) {
    console.log(err.message);
  }
})();
