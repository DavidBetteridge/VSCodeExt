import * as vscode from 'vscode';
import { getURL, getDocumentNumber, getApplicationHookType } from './basicInputs';
import { loadSettings } from './loadSettings';
import axios from 'axios';

export async function loadHook() {

    var settings = loadSettings();
    if (settings === undefined) return;

    var tokenResponse = await axios({
        url: settings.url + "/api/token", 
        method: "post",
        data : {
            "username": settings.username,
            "password": "a",
            "databaseTitle": settings.database
        }
    });
    if (tokenResponse.status !== 200)
    {
        vscode.window.showErrorMessage('Invalid login');
        return;
    }

    const headers = { Authorization: `Bearer ${tokenResponse.data.token}` };

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
    
}