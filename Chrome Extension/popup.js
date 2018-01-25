function renderStatus (statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function () {
  console.log(chrome.windows)
});
