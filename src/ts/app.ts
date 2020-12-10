import $ from 'jquery';
import { onConfigClicked, readStorage } from './global';
import { checkUrl, getIssueCount, hookHistory } from "./utils";

/**
 * Main entry point, run at document-start.
 */
export function onLoaded() {
    const username = checkUrl(document.URL);

    // hook history object first
    hookHistory();

    // do action after read storage
    readStorage(() => {
        // handle the document
        if (username) {
            handleAllRepos();
        }

        // detect url change and handle the document
        window.addEventListener('replacestate', () => {
            if (checkUrl(document.URL)) {
                setTimeout(() => handleAllRepos(), 1000);
            }
        });
    });
}

/**
 * Get list element and iterate this list.
 */
function handleAllRepos() {
    const formTag = $('form.d-block.d-md-flex');
    if (formTag.length > 0) {
        if ($('a#github-issue-counter-config').length === 0) {
            formTag.prepend('<a class="text-center btn mr-2" id="github-issue-counter-config">Config token</a>');
            $('a#github-issue-counter-config').on('click', () => onConfigClicked());
        }
    }
    if ($('a.github-issue-counter').length > 0) {
        return;
    }

    const lines = $('div#user-repositories-list li div.col-10');
    if (lines.length === 0) {
        return;
    }

    for (let i = 0; i < lines.length; i++) {
        let repoElement = lines.get(i);
        handleEachRepo(repoElement);
    }
}

/**
 * For each of the div element in the repo list, extract the information and append new element.
 * @param el list item div
 */
function handleEachRepo(el: HTMLElement) {
    const aTag = $(el).find('a');
    if (aTag.length === 0) {
        return;
    }
    const repoName = aTag.get(0).getAttribute('href');
    if (!repoName) {
        return;
    }

    getIssueCount(repoName, (count) => {
        const newA = `
<a class="muted-link mr-3" href="${repoName}/issues" class="github-issue-counter">
    <svg class="octicon octicon-issue-opened mr-1" viewBox="0 0 16 16" width="16" height="16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg>
    ${count}
</a>
`;
        const linkTag = $(el).find('div.f6.text-gray a.muted-link:last-of-type');
        if (linkTag.length > 0) {
            $(newA).insertAfter(linkTag);
            return;
        }
        const langTag = $(el).find('div.f6.text-gray span.ml-0.mr-3');
        if (langTag.length > 0) {
            $(newA).insertAfter(langTag);
            return;
        }
        const divTag = $(el).find('div.f6.text-gray');
        if (divTag.length > 0) {
            divTag.prepend(newA);
            return;
        }
        // unreachable
    });
}
