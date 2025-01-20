import express from 'express';
import path from 'path';

// Dynamically import node-fetch
const fetch = (await import('node-fetch')).default;

const app = express();
const port = 3000;

const TOKEN_LIST_URL = 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json';

// Use import.meta.url to get the directory name
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

let tokenList = [];

// Function to fetch the latest token list
async function fetchTokenList() {
  try {
    const response = await fetch(TOKEN_LIST_URL);
    const data = await response.json();
    tokenList = data.tokens; // Store the token list in memory
    console.log('Fetched latest token list');
  } catch (error) {
    console.error('Error fetching token list:', error);
  }
}

// Fetch the latest token list immediately when the server starts
fetchTokenList();

// Set up an interval to fetch the token list every 15 minutes (900,000 ms)
setInterval(fetchTokenList, 15 * 60 * 1000); // 15 minutes in milliseconds

// Serve the latest token list at /tokens endpoint
app.get('/tokens', (req, res) => {
  res.json(tokenList);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
