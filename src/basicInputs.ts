import { window } from 'vscode';


export async function getApplicationHookType() {

	const result = await window.showQuickPick(['Purchase Invoice Export', 'Expense Claim Export', 'Purchase order Validation'], {
		placeHolder: 'Select the application hook type',
	});

	return result;
}

export async function getURL() {
	const result = await window.showInputBox({
		value: 'Enter the URL of your P2P server',
		valueSelection: [2, 4],
		placeHolder: 'For example: https://customer.proactisp2p.com',
		validateInput: text => {
			window.showInformationMessage(`Validating: ${text}`);
			return text === '123' ? 'Not 123!' : null;
		}
	});
	window.showInformationMessage(`Got: ${result}`);
}

export async function getDocumentNumber() {
	const result = await window.showInputBox({
		value: 'Enter the document number for testing',
		placeHolder: 'For example: PINV1234',
		validateInput: text => {
			return text === '' ? 'No number' : null;
		}
	});
    window.showInformationMessage(`Got: ${result}`);
    return result;
}