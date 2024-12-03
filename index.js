#!/usr/bin/env node

import fs from "fs";
import { cp, lstat, mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "node:path";
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

    const targetDir = path.join(process.cwd(), projectName);
    const sourceDir = path.resolve(fileURLToPath(import.meta.url), "../cradle");

    const copyFilesAndDirectories = async (source, destination) => {
      const entries = await readdir(source);

      for (const entry of entries) {
        const sourcePath = path.join(source, entry);
        const destPath = path.join(destination, entry);

        const stat = await lstat(sourcePath);

        if (stat.isDirectory()) {
          await mkdir(destPath);
          await copyFilesAndDirectories(sourcePath, destPath);
        } else {
          await cp(sourcePath, destPath);
        }
      }
    };

    const renamePackageJsonName = async (targetDir, projectName) => {
      const packageJsonPath = path.join(targetDir, "package.json");
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

    if (projectName === "." || !fs.existsSync(targetDir)) {
      console.log("Target directory doesn't exist");
      console.log("Creating directory...");
      fs.mkdirSync(targetDir, { recursive: true });
      console.log("Finished creating directory");
      await copyFilesAndDirectories(sourceDir, targetDir);
      await renamePackageJsonName(targetDir, projectName);
      console.log(`Finished generating your project ${projectName}`);
      if (projectName !== ".") console.log(`cd ${projectName}`);
      console.log(`npm install`);
    } else {
      throw new Error("Target directory already exist!");
    }
  } catch (err) {
    console.log(err.message);
  }
})();
