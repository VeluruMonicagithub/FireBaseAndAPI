// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3dOTXV48PzwWDBim8-1sPh5ylsapfPRE",
    authDomain: "storage-997ff.firebaseapp.com",
    projectId: "storage-997ff",
    storageBucket: "storage-997ff.firebasestorage.app",
    messagingSenderId: "1097595618582",
    appId: "1:1097595618582:web:1eb83d69daad95c3e13c37"
};

// 2. Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Reference to "books" collection
const booksCol = collection(db, "books");

const booksContainer = document.getElementById("booksContainer");

function renderBooks(snapshot) {
  booksContainer.innerHTML = ""; // clear

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${data.coverImageURL}" alt="${data.title}">
      <h3>${data.title}</h3>
      <p><strong>Author:</strong> ${data.author}</p>
      <p><strong>Price:</strong> ₹${data.price}</p>
      <div class="card-buttons">
        <button data-id="${id}" class="update-author">Update Author</button>
        <button data-id="${id}" class="delete-book">Delete</button>
        <button data-id="${id}" class="view-details">View Details</button>
      </div>
    `;

    booksContainer.appendChild(card);
  });
}

// Real-time listener
onSnapshot(booksCol, (snapshot) => {
  renderBooks(snapshot);
});


const bookForm = document.getElementById("bookForm");

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const price = Number(document.getElementById("price").value);
  const imageUrl = document.getElementById("imageUrl").value.trim();

  if (!title || !author || !price || !imageUrl) return;

  await addDoc(booksCol, {
    title,
    author,
    price,
    coverImageURL: imageUrl
  });

  bookForm.reset(); // clear the form
});


booksContainer.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  const bookRef = doc(db, "books", id);

  // Update Author
  if (e.target.classList.contains("update-author")) {
    const newAuthor = prompt("Enter new author name:");
    if (newAuthor && newAuthor.trim()) {
      await updateDoc(bookRef, { author: newAuthor.trim() });
    }
  }

  // Delete Book
  if (e.target.classList.contains("delete-book")) {
    const confirmDelete = confirm("Delete this book?");
    if (confirmDelete) {
      await deleteDoc(bookRef);
    }
  }

  // View Details
  if (e.target.classList.contains("view-details")) {
    alert("View details is not fully implemented here, but you can show a modal with book info.");
  }
});