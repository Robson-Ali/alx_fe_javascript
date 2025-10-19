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
const addQuoteContainer = document.getElementById('addQuoteContainer'); // Container for add quote form

// Function to show a random quote from the array by constructing elements
function showRandomQuote() {
  // Clear previous content
  quoteDisplay.innerHTML = '';

  if (quotes.length === 0) {
    const p = document.createElement('p');
    p.textContent = "No quotes available. Add some!";
    quoteDisplay.appendChild(p);
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
}

// Function to create and display the add quote form using createElement and appendChild
function createAddQuoteForm() {
  // Clear previous form content
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

  // Append inputs and button to container
  addQuoteContainer.appendChild(newQuoteTextInput);
  addQuoteContainer.appendChild(newQuoteCategoryInput);
  addQuoteContainer.appendChild(addQuoteBtn);

  // Attach event listener to the dynamically created add quote button
  addQuoteBtn.addEventListener('click', addQuote);
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
