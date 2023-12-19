let fetchArticle = document.getElementById('fetch-article');

//EVENT LISTNER FOR BUTTON CLICK
fetchArticle.addEventListener('click', async () => {
    alert('Fetching article content...');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let tab = tabs[0];
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: fetchArticleContent
        });
    });
});

//HANDLE RUNTIME
chrome.runtime.onMessage.addListener((articleContent, sender, sendResponse) => {
    if (articleContent) {
        document.getElementById("result").innerHTML =  articleContent;
        //getSummary(articleContent);
    } else {
        document.getElementById("result").innerHTML = 'No article found on this page.';
    }
});

//INTERACT WITH API
function getSummary(articleContent) {
    fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
            prompt: "Summarize this article: " + articleContent,
            max_tokens: 200
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("OK OK")
        alert(articleContent)
        
        if (data.choices && data.choices.length > 0) {
            document.getElementById("result").innerHTML = data.choices[0].text;
        } else {
            console.error('No choices available in the response.');
            alert(JSON.stringify(data, null, 2))
            console.log(data)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("result").innerHTML = 'Error in summarizing article.';
    });
}


function fetchArticleContent() {
    //alert("CLICKED")
    const article = document.querySelector('article');
    if (article) {
        // If there is an article, send its HTML content
        chrome.runtime.sendMessage(article.innerHTML);
    } else {
        // If there is no article, send a message indicating that
        chrome.runtime.sendMessage('');
    }
}

