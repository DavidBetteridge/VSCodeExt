import * as vscode from 'vscode';
import { getToken } from './getToken';
import { loadSettings } from './loadSettings';
import axios from 'axios';

export async function saveHook(applicationHookType : string,  script : string) : Promise<void> {

    const settings = loadSettings();
    if (settings === undefined) return;

    const token = await getToken(settings);
    if (token === undefined) return;

    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios({
        url: `${settings.url}/api/${settings.companyCode}/applicationHooks/${applicationHookType}`, 
        method: "put",
        data : {
            "script": script
        },
        headers: headers
    });

    if (response.status !== 204)
    {
        vscode.window.showErrorMessage(`Failed to store application hook :: ${response.status}:${response.statusText}`);
        return;
    }

}