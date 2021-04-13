import { dialogAction } from './chaynsDialog';
import { open } from './open';

export function toast(config = {}) {
    config.callType = dialogAction.TOAST;
    return open(config);
}
