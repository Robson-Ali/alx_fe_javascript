// --- Quotes Array and Storage Keys ---
let quotes = [];

// Keys for web storage
const LOCAL_STORAGE_KEY = 'quotesData';
const SESSION_STORAGE_KEY = 'lastViewedQuote';

// --- DOM References ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteContainer');
const importExportContainer = document.getElementById('importExportContainer'); // Container for import/export buttons

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
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "Get busy living or get busy dying.", category: "Life" },
      { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" }
    ];
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

// Reference for category dropdown (create this dropdown in HTML, see below)
const categorySelect = document.createElement('select');
categorySelect.id = 'categoryFilter';
categorySelect.style.marginLeft = '10px';

// Populate category dropdown dynamically from quotes array
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

// Filter quotes based on selected category and display one random quote from filtered list
function filterQuotes() {
  const selectedCategory = categorySelect.value;
  localStorage.setItem('selectedCategory', selectedCategory);

  // Filter quotes array or use full list if no category selected
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

  // Pick a random quote from filtered
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

  // Optionally store last viewed filtered quote index (can be improved if you want)
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

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotes();

  // Clear inputs
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  populateCategories(); // Refresh categories dropdown to include new category
  filterQuotes();       // Show filtered quotes according to current filter
}


// --- Create Import and Export Controls ---
function createImportExportControls() {
  importExportContainer.innerHTML = '';

  // Export Button
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Quotes (JSON)';
  exportBtn.addEventListener('click', exportToJsonFile);

  // Import Input
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

      // Validate each imported quote object
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

  // Clear the input value to allow re-importing the same file if needed
  event.target.value = '';
}

// --- Initialization ---
function init() {
  loadQuotes();
  createAddQuoteForm();
  createImportExportControls();

  // Insert category filter dropdown before the "Show New Quote" button
  newQuoteBtn.parentNode.insertBefore(categorySelect, newQuoteBtn);

  populateCategories();

  // Show quotes filtered by last selected category (or all)
  filterQuotes();
}

//Add event listener to the category filter dropdown:
categorySelect.addEventListener('change', filterQuotes);
// Event listener for showing a random quote
newQuoteBtn.addEventListener('click', showRandomQuote);

// Initialize application on page load
init();

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example mock API endpoint
const SYNC_INTERVAL = 30000; // 30 seconds sync interval
const notificationArea = document.createElement('div');
notificationArea.id = 'syncNotification';
notificationArea.style.position = 'fixed';
notificationArea.style.top = '10px';
notificationArea.style.right = '10px';
notificationArea.style.backgroundColor = '#4caf50';
notificationArea.style.color = 'white';
notificationArea.style.padding = '10px';
notificationArea.style.display = 'none';
document.body.appendChild(notificationArea);

async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    // Assuming serverData is an array of quotes {text, category}
    return serverData.map(item => ({
      text: item.body || item.text,
      category: item.title || 'Uncategorized'
    }));
  } catch (error) {
    console.error('Error fetching server quotes:', error);
    return [];
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchServerQuotes();
  if (serverQuotes.length === 0) return;

  // Simple conflict resolution: overwrite local quotes with server quotes
  quotes = serverQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Show notification to user
  notificationArea.textContent = 'Quotes updated from server.';
  notificationArea.style.display = 'block';
  setTimeout(() => {
    notificationArea.style.display = 'none';
  }, 4000);
}

// Periodic sync setup
setInterval(syncQuotes, SYNC_INTERVAL);

// Optional manual sync button
const manualSyncBtn = document.createElement('button');
manualSyncBtn.textContent = 'Sync Quotes Now';
manualSyncBtn.style.margin = '10px';
manualSyncBtn.addEventListener('click', syncQuotes);
document.body.insertBefore(manualSyncBtn, quoteDisplay);

