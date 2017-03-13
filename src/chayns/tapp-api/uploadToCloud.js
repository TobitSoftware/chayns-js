/**
 * Created by SHoltkamp on 08.03.2017.
 */

import { environment } from '../environment';

//const ROOT_URL = 'https://tsimg.space';

export function uploadToCloud(serverUrl, file) {
    const form = new FormData();
    form.append('files', file);
    let response = {
        'data': '',
        'statusCode': 500,
        'statusMessage': 'ERROR'
    };
    let object = {response};


    return fetch(serverUrl, {
        'method': 'POST',
        'headers': {
            'Authorization': environment.user.isAuthenticated ? `Bearer ${environment.user.tobitAccessToken}` : ''
        },
        'body': form
    }).then((res) => {
        if (res.status !== 200) {
            return Promise.reject(()=>{
                object.response.statusCode = res.statusCode;
                object.response.statusMessage = res.statusText;
                object.response.data = res;
                return object;
            });
        }
        return res.json();

    }).then((data) => {
        object.response.data = JSON.stringify(data);
        object.response.statusCode = 200;
        object.response.statusMessage = 'OK';
        return object;
    });
}
