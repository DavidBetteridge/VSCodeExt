import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';
import { getToken } from './getToken';
import { loadSettings } from './loadSettings';
import axios from 'axios';

export async function loadHook() {

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
    var applicationHookTypes = applicationHookTypesResponse.data;

    const applicationHookType = await getApplicationHookType(applicationHookTypes);
    if (applicationHookType === undefined) return;

    var applicationHookResponse = await axios({
        url: `${settings.url}/api/${settings.companyCode}/applicationHooks/${applicationHookType}`, 
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
        language: "csharp",
        name: applicationHookType + ".cs"
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
    
}

export async function loadHookFromType(applicationHookType : string) : Promise<string | undefined> {

    var settings = loadSettings();
    if (settings === undefined) return;

    var token = await getToken(settings);
    if (token === undefined) return;

    const headers = { Authorization: `Bearer ${token}` };

    var applicationHookResponse = await axios({
        url: `${settings.url}/api/${settings.companyCode}/applicationHooks/${applicationHookType}`, 
        method: "get",
        headers: headers
    });
    if (applicationHookResponse.status !== 200)
    {
        vscode.window.showErrorMessage(`'Call to GET /api/applicationHooks/${applicationHookType} failed - ${applicationHookResponse.statusText}`);
        return;
    }
    var applicationHook = applicationHookResponse.data;

    return applicationHook.script;
}


// vscode.workspace.registerTextDocumentContentProvider("applicationHook", new hookProvider);

// let uri = vscode.Uri.parse('applicationHook:' + applicationHookType);
// let textDocument = await vscode.workspace.openTextDocument(uri); // calls back into the provider
// vscode.languages.setTextDocumentLanguage(textDocument, "csharp");

// export const hookProvider = class implements vscode.TextDocumentContentProvider {
//     async provideTextDocumentContent(uri: vscode.Uri): Promise<string | undefined> {

//         var settings = loadSettings();
//         if (settings === undefined) return undefined; 
    
//         var token = await getToken(settings);
//         if (token === undefined) return undefined; 
    
//         const headers = { Authorization: `Bearer ${token}` };

//         const hookType = uri.fsPath;

//         var applicationHookResponse = await axios({
//             url: `${settings.url}/api/${settings.companyCode}/applicationHooks/${hookType}`, 
//             method: "get",
//             headers: headers
//         });
//         if (applicationHookResponse.status !== 200)
//         {
//             vscode.window.showErrorMessage(`'Call to GET /api/applicationHooks/${uri.path} failed - ${applicationHookResponse.statusText}`);
//             return undefined;
//         }
        
//         var applicationHook = applicationHookResponse.data;
//         return applicationHook.script;
//     }
//   };