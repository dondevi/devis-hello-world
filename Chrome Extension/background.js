document.addEventListener('DOMContentLoaded', function () {
  console.log("background.js")
});

chrome.pageAction.onClicked(function () {
  console.log("page click");
});
