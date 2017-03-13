/**
 * Created by SHoltkamp on 09.03.2017.
 */
import { imageUploadToCloud } from '../tapp-api';
import {uploadFile} from './uploadFile';

export function uploadCloudImage() {
    const path = '/v1/images';
    const ROOT_URL = 'https://tsimg.space';

    return uploadFile(ROOT_URL + path, chayns.mimeType.IMAGE).then((retval) => {
        if (retval.response.statusCode === 200) {
            try {
                let data = JSON.parse(retval.response.data);
                retval.url = `${ROOT_URL}${data.imageLocations[0]}`;
                return retval;
            }
            catch (err) {
                return err;
            }
        }
        return retval;
    });
}
