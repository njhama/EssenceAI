let fetchArticle = document.getElementById('fetch-article');

//EVENT LISTNER FOR BUTTON CLICK
fetchArticle.addEventListener('click', async () => {
    //alert('Fetching article content...');
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
        //document.getElementById("result").innerHTML =  articleContent;
        getSummary(articleContent);
    } else {
        document.getElementById("result").innerHTML = 'No article found on this page.';
    }
});

//INTERACT WITH API
function getSummary(articleContent) {
    document.getElementById("result").innerHTML = "Loading..."
    //alert(articleContent)
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [{
                role: "system",
                content: "Your task is to summarize articles. and put it in 3 bullet points. max 20 words per.r"
            }, {
                role: "user",
                content: articleContent
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const bulletPoints = data.choices[0].message.content.split('\n').map(point => `<li>${point}</li>`).join('');
            document.getElementById("result").innerHTML = `<ul>${bulletPoints}</ul>`;
        } else {
            console.error('No choices available in the response.');
            document.getElementById("result").innerHTML = 'Error in summarizing article.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("result").innerHTML = 'Error in summarizing article.';
    });
}



function fetchArticleContent() {
    const article = document.querySelector('article');
    if (article) {
        chrome.runtime.sendMessage(article.innerText);
    } else {
        chrome.runtime.sendMessage('');
    }
}

