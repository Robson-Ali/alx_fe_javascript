// --- Quotes Array and Storage Keys ---
let quotes = [];

// Keys for web storage
const LOCAL_STORAGE_KEY = 'quotesData';
const SESSION_STORAGE_KEY = 'lastViewedQuote';

// Server API simulation endpoints (JSONPlaceholder does not actually store data, but good for demo)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // We'll treat "posts" as quotes

// --- DOM References ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteContainer') || document.createElement('div');
const importExportContainer = document.getElementById('importExportContainer');
const notificationArea = document.createElement('div');
notificationArea.style.margin = '10px 0';
notificationArea.style.fontWeight = 'bold';
notificationArea.style.color = 'green';
document.body.insertBefore(notificationArea, quoteDisplay);

// --- Load Quotes from Local Storage on Init ---
function loadQuotes() {
  const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedQuotes) {
    try {
      quotes = JSON.parse(storedQuotes);
    } catch {
      quotes = [];
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } else {
    // Default quotes if none in storage
    quotes = [
      { id: 1, text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { id: 2, text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { id: 3, text: "Get busy living or get busy dying.", category: "Life" },
      { id: 4, text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" }
    ];
    saveQuotes();
  }
}

// --- Save Quotes to Local Storage ---
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// --- Show a Random Quote ---
function showRandomQuote() {
  quoteDisplay.innerHTML = '';

  if (quotes.length === 0) {
    const p = document.createElement('p');
    p.textContent = "No quotes available. Add some!";
    quoteDisplay.appendChild(p);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const p = document.createElement('p');
  p.style.fontStyle = 'italic';
  p.textContent = `"${quote.text}"`;

  const small = document.createElement('small');
  small.style.display = 'block';
  small.style.marginTop = '5px';
  small.style.color = '#555';
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  // Store the last viewed quote index in session storage (optional)
  sessionStorage.setItem(SESSION_STORAGE_KEY, randomIndex.toString());
}

// --- Reference for category dropdown ---
const categorySelect = document.createElement('select');
categorySelect.id = 'categoryFilter';
categorySelect.style.marginLeft = '10px';

// --- Populate Categories ---
function populateCategories() {
  // Extract unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options but keep the default "All"
  categorySelect.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All Categories';
  categorySelect.appendChild(allOption);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore last selected value from localStorage if present
  const savedCategory = localStorage.getItem('selectedCategory') || '';
  categorySelect.value = savedCategory;
}

// --- Filter Quotes ---
function filterQuotes() {
  const selectedCategory = categorySelect.value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  quoteDisplay.innerHTML = '';

  if (filteredQuotes.length === 0) {
    const p = document.createElement('p');
    p.textContent = "No quotes available for this category.";
    quoteDisplay.appendChild(p);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const p = document.createElement('p');
  p.style.fontStyle = 'italic';
  p.textContent = `"${quote.text}"`;

  const small = document.createElement('small');
  small.style.display = 'block';
  small.style.marginTop = '5px';
  small.style.color = '#555';
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  sessionStorage.setItem(SESSION_STORAGE_KEY, randomIndex.toString());
}

// --- Create Add Quote Form ---
function createAddQuoteForm() {
  addQuoteContainer.innerHTML = '';

  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.placeholder = 'Enter new quote';

  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.placeholder = 'Enter category';

  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.id = 'addQuoteBtn';
  addQuoteBtn.textContent = 'Add Quote';

  addQuoteContainer.appendChild(newQuoteTextInput);
  addQuoteContainer.appendChild(newQuoteCategoryInput);
  addQuoteContainer.appendChild(addQuoteBtn);

  addQuoteBtn.addEventListener('click', addQuote);
}

// --- Add a New Quote ---
function addQuote() {
  const newQuoteTextInput = document.getElementById('newQuoteText');
  const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  if (newQuoteText === '' || newQuoteCategory === '') {
    alert('Please provide both quote text and category!');
    return;
  }

  // Create a new quote with a unique id (max id + 1)
  const maxId = quotes.reduce((max, q) => (q.id > max ? q.id : max), 0);
  const newQuoteObj = { id: maxId + 1, text: newQuoteText, category: newQuoteCategory };

  // Add locally
  quotes.push(newQuoteObj);
  saveQuotes();

  // Also POST it to "server"
  postQuoteToServer(newQuoteObj);

  // Clear inputs
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  populateCategories();
  filterQuotes();

  notifyUser("Quote added locally and sent to server.");
}

// --- Create Import and Export Controls ---
function createImportExportControls() {
  importExportContainer.innerHTML = '';

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Quotes (JSON)';
  exportBtn.addEventListener('click', exportToJsonFile);

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.id = 'importFile';
  importInput.style.marginLeft = '10px';
  importInput.addEventListener('change', importFromJsonFile);

  importExportContainer.appendChild(exportBtn);
  importExportContainer.appendChild(importInput);
}

// --- Export Quotes to JSON File ---
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Import Quotes from JSON File ---
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) throw new Error('Invalid format: JSON must be an array of quotes.');

      importedQuotes.forEach(q => {
        if (typeof q.text !== 'string' || typeof q.category !== 'string') {
          throw new Error('Invalid quote object detected.');
        }
      });

      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  fileReader.readAsText(file);

  event.target.value = '';
}

// --- Notify user about sync or conflicts ---
function notifyUser(message, isError = false) {
  notificationArea.textContent = message;
  notificationArea.style.color = isError ? 'red' : 'green';

  setTimeout(() => {
    notificationArea.textContent = '';
  }, 5000);
}

// --- POST new quote to server simulation ---
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });
    if (!response.ok) throw new Error('Failed to post quote to server');
    // Just simulating; server returns an id which can be ignored here
  } catch (error) {
    notifyUser('Failed to sync new quote to server', true);
  }
}

// --- Fetch quotes from "server" ---
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL + "?_limit=50"); // Limit results for demo
    if (!response.ok) throw new Error('Failed to fetch quotes from server');

    const serverData = await response.json();

    // Transform server data to our quote format (id, text, category):
    const serverQuotes = serverData.map(item => ({
      id: item.id,
      text: item.title,
      category: item.body
    }));

    return serverQuotes;
  } catch (error) {
    notifyUser('Could not fetch quotes from server', true);
    return null;
  }
}

// --- Sync data periodically ---
async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes) return;

  // Conflict resolution: server data overwrites local on id conflicts, else append new
  let updated = false;

  // Create a map for local quotes by id
  const localMap = new Map(quotes.map(q => [q.id, q]));

  // Process server quotes
  serverQuotes.forEach(sq => {
    if (!localMap.has(sq.id)) {
      // New quote from server, add it
      quotes.push(sq);
      updated = true;
    } else {
      // If different text/category, update local (server precedence)
      const localQuote = localMap.get(sq.id);
      if (localQuote.text !== sq.text || localQuote.category !== sq.category) {
        localQuote.text = sq.text;
        localQuote.category = sq.category;
        updated = true;
      }
    }
  });

  // Optionally, remove local quotes not present on server (if want strict sync)
  // Could be config-controlled, omitted here for simplicity.

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser('Quotes synced with server!');
  }
}

// --- Initialization ---
function init() {
  loadQuotes();
  createAddQuoteForm();
  createImportExportControls();

  newQuoteBtn.parentNode.insertBefore(categorySelect, newQuoteBtn);

  populateCategories();

  // Show quotes filtered by last selected category (or all)
  filterQuotes();

  // Start periodic sync every 30 seconds
  setInterval(syncQuotesWithServer, 30000);

  // Initial sync on startup
  syncQuotesWithServer();
}

// Add event listener to the category filter dropdown:
categorySelect.addEventListener('change', filterQuotes);
// Event listener for showing a random quote
newQuoteBtn.addEventListener('click', showRandomQuote);

// Initialize application on page load
init();
