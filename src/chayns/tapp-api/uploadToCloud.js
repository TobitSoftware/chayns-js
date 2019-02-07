/**
 * Created by SHoltkamp on 08.03.2017.
 */

import {environment} from '../environment';

// const ROOT_URL = 'https://tsimg.space';
export function uploadToCloud(serverUrl, file, statusCodes = [200]) {
    const form = new FormData();
    form.append('files', file);
    let response = {
        'data': '',
        'statusCode': 500,
        'statusMessage': 'ERROR'
    };
    let object = {response};
    let fetchResult;

    return fetch(serverUrl, {
        'method': 'POST',
        'headers': {
            'Authorization': environment.user.isAuthenticated ? `Bearer ${environment.user.tobitAccessToken}` : ''
        },
        'body': form
    }).then((res) => {
        if (statusCodes.indexOf(res.status) === -1) {
            object.response.statusCode = res.statusCode || res.status;
            object.response.statusMessage = res.statusText;
            object.response.data = res;
            return Promise.reject(object);
        }
        fetchResult = res;
        return res.json();
    }).then((data) => {
        object.response.data = JSON.stringify(data);
        object.response.statusCode = fetchResult.statusCode || fetchResult.status;
        object.response.statusMessage = fetchResult.statusText;
        return object;
    });
}
