import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';
import axios from 'axios';
import { loadHook } from './loadHook';

export function activate(context: vscode.ExtensionContext) {

	console.log('The Proactis P2P Application Hook extension has been successfully loaded');

	let loadHookCommand = vscode.commands.registerCommand('extension.loadHook', async () => {
		await loadHook();
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
