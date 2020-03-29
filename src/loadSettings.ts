import * as vscode from 'vscode';

export interface settings {
    url : string,
    username : string,
    companyCode : string,
    database : string
}

export function loadSettings() : settings | undefined {
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

    return {
        url : <string>url,
        username : <string>username,
        companyCode : <string>companyCode,
        database : <string>database,
    }
}