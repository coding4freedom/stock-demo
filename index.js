
/*
https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}

*/

const url = 'https://www.alphavantage.co/query';
const apiKey = '77UTA9UMYE8RGAZ0';
const stockList = [];

// set up suggestStocks() for input field 
// set up fetchStockData() on button to get stock information 

// fetch stock suggestion
async function suggestStocks() {
    const query = document.getElementById('symbol').value;

    if (query.length < 2) {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').style.display = 'none';
        return;
    }

    const response = await fetch(`${url}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`);
    const data = await response.json();
    //console.log(data['bestMatches']);
    console.log(data);

    if (data['bestMatches']) {
        const suggestions = data['bestMatches'].slice(0, 6);
        stockList.length = 0;
        stockList.push(...suggestions);

        const suggestionsHTML = suggestions.map(stock => 
            `<div class="suggestion-item" onclick="selectStock('${stock['1. symbol']}')">${stock['2. name']} (${stock['1. symbol']})</div>`
        ).join('');

        const suggestionsContainer = document.getElementById('suggestions');
        document.getElementById('suggestions').innerHTML = suggestionsHTML;
        suggestionsContainer.style.display = 'block';
    } else {
        document.getElementById('suggestions').innerHTML = 'No suggestions found';
        document.getElementById('suggestions').style.display = 'block';
    }    
}

// Function to handle stock selection
function selectStock(symbol) {
    document.getElementById('symbol').value = symbol;
    document.getElementById('suggestions').innerHTML = '';
    document.getElementById('suggestions').style.display = 'none';
}

// Function to take in the date selected by user
function getDateNDaysAgo(n) {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
}

// Function to fetch and display stock data
async function fetchStockData() {
    const loadingEl = document.getElementById('is__loading');
    loadingEl.classList.add('loading__spinner')

    const symbols = stockList.map( stock => stock['1. symbol']);
    if ( symbols.length === 0) {
        alert('Please enter a stock symbol or select from suggestions.');
        return;
    }

    // Get user selected date
    const daysAgo = parseInt(document.getElementById('date-selector').value, 10);
    const date = getDateNDaysAgo(daysAgo);
    
    // Clear previous stock cards
    document.getElementById('stock__cards').innerHTML = '';

    // Fetch data for stock cards
    const promises = symbols.map(symbol => 
        fetch(`${url}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                return { symbol, data}
            })
    );

    try {
        // wait until all promises have been returned and store them in results
        const results = await Promise.all(promises);

        // create and display stock cards for each symbol
        const cardsHTML = results.map(result => {
            const { symbol, data} = result;
            const timeSeries = data['Time Series (Daily)'] || {};
            const latestInfo = timeSeries[date] || {};

            if (!latestInfo) return '';

            return `
            <div class="card">
                <div class="card__header" onclick="searchGoogle(${symbol})">
                    <h2>${symbol}</h2>
                <div class="card__overlay">More Info</div>
                </div>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Current Price:</strong> $${latestInfo['4. close']}</p>
                <p><strong>Open Price:</strong> $${latestInfo['1. open']}</p>
                <p><strong>High Price:</strong> $${latestInfo['2. high']}</p>
                <p><strong>Low Price:</strong> $${latestInfo['3. low']}</p>
                <p><strong>Volume:</strong> ${new Intl.NumberFormat().format(latestInfo['5. volume'])}</p>
            </div>
            `;
        }).join('');
        
        loadingEl.classList.remove('loading__spinner');
        document.getElementById('stock__cards').innerHTML = cardsHTML;

    } catch (error) {
        console.log('Error fetching stock data: ', error);
        alert('Error fetching stock data.');
    }
}

// function google search stock name with forbes
function searchGoogle(stockName) {
    const query = `forbes ${stockName}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
}

document.addEventListener('click', function(event) {
    const suggestionsContainer = document.getElementById('suggestions');
    const input = document.getElementById('symbol');
    
    if (!suggestionsContainer.contains(event.target) && !input.contains(event.target)) {
        suggestionsContainer.style.display = 'none'; // Hide suggestions if clicked outside
    }
});

function updatePlaceholder() {
    const input = document.getElementById('symbol');

    if (window.matchMedia("(max-width: 606px)").matches) {
        input.placeholder = 'Search by Ticker';
    } else {
        input.placeholder = 'Search by Ticker, Name or Keyword';
    }
}

updatePlaceholder();

window.addEventListener('resize', updatePlaceholder);