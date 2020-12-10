import Axios from "axios";
import { Global } from "./global";

/**
 * Check the url and return the username or null if this is not a repository list page.
 * @param url document url
 * @returns username or null
 */
export function checkUrl(url: string): string | null {
    const preserveKeywords = [
        '', 'pulls', 'issues', 'marketplace', 'explore', 'notifications',
        'new', 'login', 'organizations', 'settings', 'dashboard',
        'search', 'orgs', 'apps', 'users', 'repos', 'stars', 'account', 'assets'
    ];

    // http://github.com/xxx?xxx#xxx
    const result = /https?:\/\/github\.com\/(.*)\?(:?.*)tab=repositories/.exec(url);
    if (!result) {
        return null;
    }

    const urlContent = result[1];
    if (urlContent.indexOf('/') != -1 || urlContent.indexOf('#') != -1 || preserveKeywords.indexOf(urlContent) != -1) {
        return null;
    }

    return urlContent; // author
}

/**
 * Modify the  history object to dispatch pushstate, locationchange, replacestate events.
 * See https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript/52809105#52809105.
 */
export function hookHistory() {
    history.pushState = (f => function pushState(data: any, title: string, url?: string | null | undefined) {
        var ret = f.call(history, data, title, url);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState(data: any, title: string, url?: string | null | undefined) {
        var ret = f.call(history, data, title, url);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });
}

interface RepoInfo {
    open_issues_count: number,
}

/**
 * Use github api and get the repository's issue count.
 * @param repoName format like `/xxx/yyy`
 */
export function getIssueCount(repoName: string, callback: (count: number) => void) {
    const url = `https://api.github.com/repos${repoName}`;
    const headers: any = Global.token ? { 'Authorization': `Token ${Global.token}` } : {};

    const promise = Axios.request<RepoInfo>({
        method: 'get',
        url,
        headers,
    });
    promise.then((response) => {
        const count = response.data.open_issues_count;
        if (count) {
            callback(count);
        }
    }).catch((_) => { });
}
