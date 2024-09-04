
/*
https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}

*/


const apiKey =s;

async function testApi(query) {
    const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`);

    const data = await response.json();

    const symbols = data.bestMatches || [];

    const result = symbols.map(match => {
        return `${match['1. symbol']} - ${match['2. name']}`
    }).join('')

    console.log(result);
}

testApi('app')
