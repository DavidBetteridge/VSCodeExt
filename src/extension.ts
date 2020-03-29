import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';
import axios from 'axios';
import { loadHook } from './loadHook';
import { loadSettings } from './loadSettings';
import { getToken } from './getToken';
import { saveHook } from './saveHook';
import { MemFS } from './fileSystemProvider';

export function activate(context: vscode.ExtensionContext) {

	const memFs = new MemFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));
    let initialized = false;

	console.log('The Proactis P2P Application Hook extension has been successfully loaded');

	// let loadHookCommand = vscode.commands.registerCommand('extension.loadHook', async () => {
	// 	await loadHook();
	// });

	// let saveHookCommand = vscode.commands.registerCommand('extension.saveHook', async () => {
	// 	await saveHook();
	// });

	// let testHookCommand = vscode.commands.registerCommand('extension.testHook', async () => {
	// 	let documentNumber = await getDocumentNumber();
	// 	vscode.window.showWarningMessage('Test Hook using ' + documentNumber );
	// });

	// context.subscriptions.push(loadHookCommand);
	// context.subscriptions.push(saveHookCommand);
	// context.subscriptions.push(testHookCommand);

	interface applicationHookType {
		type : string,
		shortDescription : string
	}

	context.subscriptions.push(vscode.commands.registerCommand('extension.loadHook', async _ => {

		vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('memfs:/'), name: "P2P - Application Hooks" });

        if (initialized) {
            return;
        }
		initialized = true;
		
		var settings = loadSettings();
		if (settings === undefined) return;
	
		var token = await getToken(settings);
		if (token === undefined) return;
	
		const headers = { Authorization: `Bearer ${token}` };
	
		var applicationHookTypesResponse = await axios({
			url: settings.url + "/api/applicationHookTypes", 
			method: "get",
			headers: headers
		});
		if (applicationHookTypesResponse.status !== 200)
		{
			vscode.window.showErrorMessage('Call to GET /api/applicationHookTypes failed - ' + applicationHookTypesResponse.statusText);
			return;
		}
		var applicationHookTypes = applicationHookTypesResponse.data as applicationHookType[];

		applicationHookTypes.forEach(applicationHookType => {
			memFs.createFile(vscode.Uri.parse(`memfs:/${applicationHookType.type}.cs`), { create: true, overwrite: true });
		});

    }));
}

export function deactivate() {}
