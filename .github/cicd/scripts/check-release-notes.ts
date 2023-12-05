import { existsSync } from "../../../deps.ts";
import { Utils } from "../../../src/core/Utils.ts";

if (Deno.args.length != 2) {
	let errorMsg = `The required number of arguments is 2 but received ${Deno.args.length}.`;
	errorMsg += `\nPlease provide the following arguments: version type, version.`;
	Utils.printError(errorMsg);
	Deno.exit(100);
}

const versionType = Deno.args[0].trim().toLowerCase();
let version = Deno.args[1].trim().toLowerCase();

if (versionType != "production" && versionType != "preview") {
	Utils.printError(`The version type must be either 'preview' or 'release' but received '${versionType}'.`);
	Deno.exit(200);
}

version = version.startsWith("v") ? version : `v${version}`;

let releaseNotesDirName = "";

if (versionType === "preview") {
	if (Utils.isNotValidPreviewVersion(version)) {
		Utils.printError(`The preview version '${version}' is not valid.`);
		Deno.exit(300);
	}

	releaseNotesDirName = "PreviewReleases";
} else if (versionType === "production") {
	if (Utils.isNotValidProdVersion(version)) {
		Utils.printError(`The production version '${version}' is not valid.`);
		Deno.exit(400);
	}

	releaseNotesDirName = "ProductionReleases";
}

const releaseNotesDirPath = `./ReleaseNotes/${releaseNotesDirName}/Release-Notes-${version}.md`;

if (!existsSync(releaseNotesDirPath, { isDirectory: true })) {
	Utils.printError(`The release notes '${releaseNotesDirPath}' does not exist.`);
	Deno.exit(500);
}
