import {environment} from '../chayns/environment';

export function getScaledImageUrl(url, height, width, preventWebp) {
    height = height ? Math.floor(height * window.devicePixelRatio) : null;
    width = width ? Math.floor(width * window.devicePixelRatio) : null;
    const shortEdgeSize = height > width ? height : width;

    const lastDot = url.lastIndexOf('.');
    const extension = url.substr(lastDot + 1, url.length - lastDot).toLowerCase();
    const baseName = url.substr(0, lastDot).toLowerCase();

    if (height && width && url && url.indexOf('tsimg.space') >= 0 && lastDot) {
        return `${baseName}_s${shortEdgeSize}-mshortedgescale.${extension}`;
    }
    if (url && url.indexOf('tsimg.cloud') >= 0 && lastDot) {
        const queue = [];
        if (!preventWebp && environment.browser.supportsWebP) {
            queue.push('fwebp');
        }
        if (height) {
            queue.push('h' + height);
        }
        if (width) {
            queue.push('w' + width);
        }
        return `${baseName}_${queue.join('-')}.${extension}`;
    }
    return url;
}
