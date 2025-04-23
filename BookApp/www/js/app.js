const bookList = document.getElementById('book-list');

// Add a new book to Firestore
function addBook() {
  const title = document.getElementById('title').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  if (!title || isNaN(price) || isNaN(quantity) || quantity < 1) {
    alert('Please fill all fields correctly!');
    return;
  }

  db.collection('books').add({
    title,
    price,
    quantity,
    sold: 0
  }).then(() => {
    clearForm();
  }).catch(error => {
    console.error("Error adding book: ", error);
    alert("Something went wrong while adding the book.");
  });
}

// Clear input fields after adding
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('price').value = '';
  document.getElementById('quantity').value = '';
}

// Display books and update live from Firestore
function renderBooks() {
    db.collection('books').onSnapshot(snapshot => {
      bookList.innerHTML = '';
      snapshot.forEach(doc => {
        const book = doc.data();
        const remaining = book.quantity - book.sold;
  
        const div = document.createElement('div');
        div.className = 'book';
  
        div.innerHTML = `
          <div class="details ${remaining <= 0 ? 'sold-out' : ''}">
            <h3>${book.title}</h3>
            <p>Price: $${book.price.toFixed(2)}</p>
            <p>Quantity: ${remaining}/${book.quantity} remaining</p>
          </div>
          <div class="actions">
            ${remaining > 0 ? `<button onclick="sellOne('${doc.id}')">Sell 1</button>` : ''}
            <button onclick="removeBook('${doc.id}')" class="remove-btn">Remove</button>
          </div>
        `;
  
        bookList.appendChild(div);
      });
    });
  }
  

// Sell one copy of the book
function sellOne(id) {
  const docRef = db.collection('books').doc(id);
  docRef.get().then(doc => {
    if (doc.exists) {
      const book = doc.data();
      if (book.sold < book.quantity) {
        docRef.update({ sold: book.sold + 1 });
      }
    }
  }).catch(error => {
    console.error("Error updating sold count: ", error);
  });
}

// Remove a book from Firestore
function removeBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    db.collection('books').doc(id).delete().catch(error => {
      console.error("Error deleting book: ", error);
    });
  }
}

// Start rendering books on page load
renderBooks();
