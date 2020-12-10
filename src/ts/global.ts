import { GMApi } from 'greasemonkey';

/**
 * The global data which are stored in the browser.
 */
export class Global {
    /**
     * Github access token.
     */
    public static token: string = '';
}

/**
 * Storage flag.
 */
export enum StorageFlag {
    Token = 'github-token',
}

/**
 * Store a Global field.
 * @param flag storage flag
 * @param value data
 * @param callback set value callback
 */
export function setStorage(flag: StorageFlag, value: any, callback?: () => void) {
    GMApi.GM_setValue(flag.toString(), value);
    if (callback) {
        callback();
    }
}

/**
 * Read all fields into Global object.
 * @param callback get value callback
 */
export function readStorage(callback: () => void) {
    Global.token = GMApi.GM_getValue(StorageFlag.Token.toString());
    callback();
}

/**
 * Get a global field from storage.
 * @param flag storage flag
 * @param callback get value callback
 */
export function getStorage(flag: StorageFlag, callback: (item: any) => void) {
    callback(GMApi.GM_getValue(flag.toString()));
}

/**
 * Remove a field from storage.
 * @param flag storage flag
 * @param callback delete value callback
 */
export function removeStorage(flag: StorageFlag, callback?: () => void) {
    GMApi.GM_deleteValue(flag.toString());
    if (callback) {
        callback();
    }
}

/**
 * Callback invoked when config clicked.
 */
export function onConfigClicked() {
    getStorage(StorageFlag.Token, data => {
        const token: string = data;
        if (!token) {
            if (confirm('Do you want to add a token to access the private repos?')) {
                addToken();
            } else {
                alert('You can click the extension icon to reopen this dialog.');
            }
        } else {
            removeToken(token);
        }
    });
}

/**
 * Add token...
 */
function addToken() {
    const token = prompt('Please enter your Github token: \n(to get token, please visit https://github.com/settings/tokens)');
    if (token === null) return;
    if (token.trim().length === 0) {
        alert('You have entered an empty token.');
    } else {
        setStorage(StorageFlag.Token, token, () => {
            alert('Your Github token has been set successfully, reload this page to see changes.');
        });
    }
}

/**
 * Remove token...
 */
function removeToken(token: string) {
    const ok = confirm(`You have already set your Github token (${token}), want to remove it?`);
    if (ok) {
        removeStorage(StorageFlag.Token, () => {
            alert('You have successfully removed Github token.');
        });
    }
}