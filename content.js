chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "fetchArticle") {
      const article = document.querySelector('article');
      console.log(article ? article.innerText : 'No article content found.');
    }
});
