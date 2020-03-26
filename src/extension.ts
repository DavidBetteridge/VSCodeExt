import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';

export function activate(context: vscode.ExtensionContext) {

	console.log('The PROACTIS P2P Application Hook extension has been successfully loaded');

	let loadHookCommand = vscode.commands.registerCommand('extension.loadHook', async () => {

		const p2purl = vscode.workspace.getConfiguration('p2p').get("url");
		if (p2purl === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.URL in the settings file');
			return;
		}

		const p2pusername = vscode.workspace.getConfiguration('p2p').get("username");
		if (p2pusername === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.username in the settings file');
			return;
		}

		const applicationHookType = await getApplicationHookType();
		if (applicationHookType === undefined) return;

		// Call web api here

		const options = {
			content: "Some code",
			language: "csharp"
		}
		const textDocument = await vscode.workspace.openTextDocument(options);

		if (!textDocument) {
		  throw new Error('Could not open file!');
		}
  
		const editor = vscode.window.showTextDocument(textDocument);
		if (!editor) {
		  throw new Error('Could not show document!');
		}

		vscode.window.showInformationMessage('The ' + applicationHookType + ' application hook was successfully loaded');

	});

	let saveHookCommand = vscode.commands.registerCommand('extension.saveHook', () => {
		vscode.window.showWarningMessage('Save Hook!');
	});

	let testHookCommand = vscode.commands.registerCommand('extension.testHook', async () => {
		let documentNumber = await getDocumentNumber();
		vscode.window.showWarningMessage('Test Hook using ' + documentNumber );
	});

	context.subscriptions.push(loadHookCommand);
	context.subscriptions.push(saveHookCommand);
	context.subscriptions.push(testHookCommand);
}

export function deactivate() {}
