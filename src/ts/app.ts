import $ from 'jquery';
import { checkUrl } from "./utils";

/**
 * Main entry point, run at document-start.
 */
export function onLoaded() {
    const url = checkUrl(document.URL);
    if (!url) {
        return;
    }

    console.log(url);
    handleAllRepos();
}

function handleAllRepos() {
    const lines = $('div#user-repositories-list li div.col-10');
    if (lines.length === 0) {
        return;
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines.get(i);
        handleEachRepo(line);
    }
}

function handleEachRepo(el: HTMLElement) {
    const aTag = $(el).find('a');
    if (aTag.length === 0) {
        return;
    }
    const repoName = aTag.get(0).getAttribute('href');
    if (!repoName) {
        return;
    }
    console.log(repoName);

    const newA = `
    <a class="muted-link mr-3" href="${repoName}/issues">
        <svg class="octicon octicon-issue-opened mr-1" viewBox="0 0 16 16" width="16" height="16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg>
        999+
    </a>
    `;

    const iconTag = $(el).find('div.f6.text-gray a.muted-link:last-of-type');
    if (iconTag.length > 0) {
        $(newA).insertAfter(iconTag);
        return;
    }
    const langTag = $(el).find('div.f6.text-gray span.ml-0.mr-3');
    if (langTag.length > 0) {
        $(newA).insertAfter(langTag);
        return;
    }
    const divTag = $(el).find('div.f6.text-gray');
    divTag.prepend(newA);
}
