import $ from 'jquery';
import { onLoaded } from "./ts/app";

// python -m http.server 5000
// http://localhost:5000/dist/github-issue-counter.user.js

$(() => {
    onLoaded();
});
