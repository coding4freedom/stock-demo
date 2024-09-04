
/*
https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}

*/

// Loading .env file 
require('dotenv').config();
const apiKey = process.env.ALPHA_API_KEY;