
/*
https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}

*/

const url = 'https://www.alphavantage.co/query';
const apiKey = '77UTA9UMYE8RGAZ0fake';
const stockList = [];

// set up suggestStocks() for input field 
// set up fetchStockData() on button to get stock information 

async function suggestStocks() {
    const query = document.getElementById('symbol').value;

    if (query.length < 2) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    const response = await fetch(`${url}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`);
    const data = await response.json();

    if (data['bestMatches']) {
        const suggestions = data['bestMatches'].slice(0, 5);
        stockList.length = 0;
        stockList.push(...suggestions);

        const suggestionsHTML = suggestions.map(stock => 
            `<div class="suggestion-item" onclick="selectStock('${stock['1. symbol']}')">${stock['2. name']} (${stock['1. symbol']})</div>`
        ).join('');

        document.getElementById('suggestions').innerHTML = suggestionsHTML;
    } else {
        document.getElementById('suggestions').innerHTML = 'No suggestions found';
    }    
}

function searchGoogle(stockName) {
    const query = `forbes ${stockName}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
}