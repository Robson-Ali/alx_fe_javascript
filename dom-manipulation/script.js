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
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

// Function to show a random quote from the array
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add some!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  // Clear previous content and create structured quote display
  quoteDisplay.textContent = ''; 
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontStyle = 'italic';

  const quoteCategory = document.createElement('small');
  quoteCategory.textContent = `Category: ${quote.category}`;
  quoteCategory.style.display = 'block';
  quoteCategory.style.marginTop = '5px';
  quoteCategory.style.color = '#555';

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote from form inputs
function addQuote() {
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

// Event listeners for buttons
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Initial quote display on page load
showRandomQuote();
