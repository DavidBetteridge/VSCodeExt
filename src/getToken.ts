import * as vscode from 'vscode';
import { settings, loadSettings } from './loadSettings';
import axios from 'axios';

export async function getToken(settings : settings) : Promise<string | undefined> {

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

    return tokenResponse.data.token;
}