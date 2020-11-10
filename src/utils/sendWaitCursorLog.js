const LIVE_URL = 'https://sub49.tobit.com/v2.1/wait';
const DEV_URL = 'https://sub49.tobit.com/dev/v2.1/wait';

function sendWaitCursorLog (isDEV, body) {
    if (typeof fetch !== 'undefined') {
        const url = isDEV ? DEV_URL : LIVE_URL;
        fetch(url, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json; charset=utf-8'
            },
            'body': JSON.stringify(body)
        });
    }
}

export default sendWaitCursorLog;
