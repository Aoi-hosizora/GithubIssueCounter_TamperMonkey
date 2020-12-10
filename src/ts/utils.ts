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
