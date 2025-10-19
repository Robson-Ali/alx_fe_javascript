// Array holding quote objects with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" },
  { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" }
];

// Reference to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteContainer'); // Assume a container for the add quote form

// Function to show a random quote from the array using innerHTML
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available. Add some!</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p style="font-style: italic;">"${quote.text}"</p>
    <small style="display: block; margin-top: 5px; color: #555;">Category: ${quote.category}</small>
  `;
}

// Function to create and display the add quote form using innerHTML
function createAddQuoteForm() {
  addQuoteContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  // Attach event listener to the dynamically created add quote button
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Function to add a new quote from form inputs
function addQuote() {
  const newQuoteTextInput = document.getElementById('newQuoteText');
  const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  if (newQuoteText === '' || newQuoteCategory === '') {
    alert('Please provide both quote text and category!');
    return;
  }

  // Add new quote object to array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear inputs after adding
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  // Display the newly added quote immediately
  showRandomQuote();
}

// Event listener for the new quote button to show random quote
newQuoteBtn.addEventListener('click', showRandomQuote);

// Initialize add quote form on page load
createAddQuoteForm();

// Initial quote display on page load
showRandomQuote();
