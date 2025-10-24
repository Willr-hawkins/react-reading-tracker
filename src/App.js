import { useState } from "react";

export default function App() {
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("allGenres");
  const [sortBy, setSortBy] = useState("None");

  const booksRead = books.filter((book) => book.status === "finished").length;
  const finishedBooks = books.filter(
    (book) => book.status === "finished" && book.rating > 0
  );
  const averageRating =
    finishedBooks.length > 0
      ? (
          finishedBooks.reduce((sum, book) => sum + book.rating, 0) /
          finishedBooks.length
        ).toFixed(1)
      : "N/A";

  function handleSetBooks(newBook) {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  }

  function handleUpdateBookStatus(bookId, newStatus) {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      )
    );
  }

  function handleDeleteBook(bookId) {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  }

  function handleUpdateCurrentPage(bookId, newPage) {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, currentPage: newPage } : book
      )
    );
  }

  function handleUpdateRating(bookId, newRating) {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, rating: newRating } : book
      )
    );
  }

  let displayedBooks = [...books];

  // Filter by status
  if (statusFilter !== "all") {
    displayedBooks = displayedBooks.filter(
      (book) => book.status === statusFilter
    );
  }

  // Filter by genre
  if (genreFilter !== "allGenres") {
    displayedBooks = displayedBooks.filter(
      (book) => book.genre === genreFilter
    );
  }

  // Sort logic
  if (sortBy === "A-Z") {
    displayedBooks.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  } else if (sortBy === "High-Low") {
    displayedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="app">
      <Header
        totalBooks={books.length}
        booksRead={booksRead}
        averageRating={averageRating}
      />
      <AddBook onSetBooks={handleSetBooks} />
      <LibrarySortBy
        totalBooks={books.length}
        statusFilter={statusFilter}
        genreFilter={genreFilter}
        sortBy={sortBy}
        onStatusChange={setStatusFilter}
        onGenreChange={setGenreFilter}
        onSortChange={setSortBy}
      />
      <Library
        books={displayedBooks}
        onUpdateStatus={handleUpdateBookStatus}
        onDeleteBook={handleDeleteBook}
        onUpdateCurrentPage={handleUpdateCurrentPage}
        onUpdateRating={handleUpdateRating}
      />
    </div>
  );
}

function Header({ totalBooks, booksRead, averageRating }) {
  return (
    <div>
      <h1 className="title">📚 Book Reading Tracker</h1>
      {totalBooks > 0 ? (
        <div className="header">
          <div className="header-group">
            <h3 style={{ color: "#28a745" }}>{totalBooks}</h3>
            <p>Total Books</p>
          </div>
          <div className="header-group">
            <h3 style={{ color: "#17a2b8" }}>{booksRead}</h3>
            <p>Books Read</p>
          </div>
          <div className="header-group">
            <h3 style={{ color: "#ffc107" }}>{averageRating}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AddBook({ onSetBooks }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [pages, setPages] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author || !genre || !pages) return;

    const id = crypto.randomUUID();
    const newBook = {
      id,
      title,
      author,
      genre,
      pages,
      currentPage: 0,
      status: "wantToRead",
      rating: 0,
    };

    onSetBooks(newBook);
    setTitle("");
    setAuthor("");
    setGenre("");
    setPages("");
  }

  return (
    <div className="book-form">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            placeholder="Book Title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            value={author}
            placeholder="Author Name"
            required
            onChange={(e) => setAuthor(e.currentTarget.value)}
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <select
            value={genre}
            required
            placeholder="Genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="" disabled>
              -- Select a genre --
            </option>
            <option value="Fiction" name="option">
              Fiction
            </option>
            <option value="Non-Fiction" name="option">
              Non-Fiction
            </option>
            <option value="Mystery" name="option">
              Mystery
            </option>
            <option value="Sci-Fi" name="option">
              Sci-Fi
            </option>
            <option value="Romance" name="option">
              Romance
            </option>
            <option value="Biography" name="option">
              Biography
            </option>
          </select>
        </div>
        <div className="form-group">
          <label>Total pages:</label>
          <input
            type="number"
            value={pages}
            placeholder="300"
            required
            onChange={(e) => setPages(Number(e.target.value))}
          />
        </div>
        <button
          className="form-button"
          style={{
            backgroundColor:
              title && author && genre && pages ? "#009900" : "#ccc",
          }}
        >
          Add Book
        </button>
      </form>
    </div>
  );
}

function LibrarySortBy({
  totalBooks,
  statusFilter,
  genreFilter,
  sortBy,
  onStatusChange,
  onGenreChange,
  onSortChange,
}) {
  if (totalBooks === 0) {
    return (
      <div className="sort-by">
        <p className="empty-library-msg">
          No books in your library yet. Add your first book above! 📖
        </p>
      </div>
    );
  }

  return (
    <div className="sort-by sort-by-flex">
      <div className="sort-item">
        <label>Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="wantToRead">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div className="sort-item">
        <label>Genre:</label>
        <select
          value={genreFilter}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="allGenres">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Biography">Biography</option>
        </select>
      </div>

      <div className="sort-item">
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="None">None</option>
          <option value="A-Z">Title (A-Z)</option>
          <option value="High-Low">Rating (High - Low)</option>
        </select>
      </div>
    </div>
  );
}

function Library({
  books,
  onUpdateStatus,
  onDeleteBook,
  onUpdateCurrentPage,
  onUpdateRating,
}) {
  return (
    <ul style={{ padding: 0 }}>
      {books.map((book) => (
        <Book
          book={book}
          key={book.id}
          onUpdateStatus={onUpdateStatus}
          onDeleteBook={onDeleteBook}
          onUpdateCurrentPage={onUpdateCurrentPage}
          onUpdateRating={onUpdateRating}
        />
      ))}
    </ul>
  );
}

function Book({
  book,
  onUpdateStatus,
  onDeleteBook,
  onUpdateCurrentPage,
  onUpdateRating,
}) {
  const progress =
    book.pages > 0 ? Math.min((book.currentPage / book.pages) * 100, 100) : 0;

  return (
    <div className="book">
      <div className="book-header">
        <h3>{book.title}</h3>
        <button className="delete-btn" onClick={() => onDeleteBook(book.id)}>
          Delete
        </button>
      </div>

      <div className="book-content">
        <p style={{ marginTop: "0" }}>by {book.author}</p>
        <span className="genre-tag" style={{ marginBottom: "10px" }}>
          {book.genre}
        </span>
        <label>Reading Status:</label>
        <select
          className="status-select"
          value={book.status}
          onChange={(e) => onUpdateStatus(book.id, e.target.value)}
        >
          <option value="wantToRead">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>

        {book.status === "reading" && (
          <div className="reading-progress">
            <div className="form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: "600" }}>Current Page:</label>
                <span style={{ fontSize: "0.9rem", color: "#555" }}>
                  {book.currentPage} / {book.pages} ({progress.toFixed(1)}%)
                </span>
              </div>
              <input
                type="number"
                min="0"
                max={book.pages}
                value={book.currentPage === 0 ? "" : book.currentPage}
                placeholder="0"
                onChange={(e) =>
                  onUpdateCurrentPage(book.id, Number(e.target.value))
                }
              />
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {book.status === "finished" && (
          <div className="rating-section">
            <label>Your Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => onUpdateRating(book.id, star)}
                  style={{ color: star <= book.rating ? "#FFD700" : "#cc" }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
