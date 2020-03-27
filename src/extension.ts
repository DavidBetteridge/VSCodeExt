import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {

	console.log('The Proactis P2P Application Hook extension has been successfully loaded');

	let loadHookCommand = vscode.commands.registerCommand('extension.loadHook', async () => {

		const url = vscode.workspace.getConfiguration('p2p').get("url");
		if (url === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.URL in the settings file');
			return;
		}

		const username = vscode.workspace.getConfiguration('p2p').get("username");
		if (username === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.username in the settings file');
			return;
		}

		const companyCode = vscode.workspace.getConfiguration('p2p').get("company");
		if (companyCode === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.company in the settings file');
			return;
		}

		const database = vscode.workspace.getConfiguration('p2p').get("database");
		if (database === undefined)
		{
			vscode.window.showErrorMessage('Please define p2p.database in the settings file');
			return;
		}

		var tokenResponse = await axios({
			url: url + "/api/token", 
			method: "post",
			data : {
				"username": username,
				"password": "a",
				"databaseTitle": database
			}
		});
		if (tokenResponse.status !== 200)
		{
			vscode.window.showErrorMessage('Invalid login');
			return;
		}

		const headers = { Authorization: `Bearer ${tokenResponse.data.token}` };

		var applicationHookTypesResponse = await axios({
			url: url + "/api/applicationHookTypes", 
			method: "get",
			headers: headers
		});
		if (applicationHookTypesResponse.status !== 200)
		{
			vscode.window.showErrorMessage('Call to GET /api/applicationHookTypes failed - ' + applicationHookTypesResponse.statusText);
			return;
		}
		var applicationHookTypes = applicationHookTypesResponse.data;

		const applicationHookType = await getApplicationHookType(applicationHookTypes);
		if (applicationHookType === undefined) return;

		var applicationHookResponse = await axios({
			url: `${url}/api/${companyCode}/applicationHooks/${applicationHookType}`, 
			method: "get",
			headers: headers
		});
		if (applicationHookResponse.status !== 200)
		{
			vscode.window.showErrorMessage('Call to GET /api/applicationHookType failed - ' + applicationHookResponse.statusText);
			return;
		}
		var applicationHook = applicationHookResponse.data;

		const options = {
			content: applicationHook.script,
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
