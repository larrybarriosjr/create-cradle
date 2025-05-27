import { existsSync, mkdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import prompts from "prompts"
import {
	copyFilesAndDirectories,
	copyRootConfigFiles,
	getPackageManager,
	renamePackageJsonName,
	validateProjectName,
} from "./utils.mjs"

const init = async () => {
	try {
		const response = await prompts({
			type: "text",
			name: "projectName",
			message: "Enter your project name",
			initial: "my-cradle-app",
			format: (val) => val.toLowerCase().split(" ").join("-"),
			validate: (val) =>
				val === "." ||
				validateProjectName(val) ||
				"Project name should not contain special characters except hyphen (-)",
		})

		const { projectName } = response
		const targetDir = join(process.cwd(), projectName)
		const sourceDir = resolve(fileURLToPath(import.meta.url), "../cradle")

		if (projectName === "." || !existsSync(targetDir)) {
			console.log("Target directory doesn't exist")
			console.log("Creating directory...")

			mkdirSync(targetDir, { recursive: true })
			console.log("Finished creating directory")

			await copyRootConfigFiles(targetDir)
			await copyFilesAndDirectories(sourceDir, targetDir)
			await renamePackageJsonName(targetDir, projectName)
			console.log(`Finished generating your project ${projectName}`)

			if (projectName !== ".") {
				console.log(`cd ${projectName}`)
			}

			const packageManager = getPackageManager()
			console.log(`${packageManager} install`)
		} else {
			throw new Error("Target directory already exist!")
		}
	} catch (err) {
		console.log(err.message)
	}
}

export default init
