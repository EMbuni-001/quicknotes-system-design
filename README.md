

---

### 📂 README 

# QuickNotes System Design

Welcome to the QuickNotes System Design repository. This project demonstrates the transition of a simple browser-based note-taking app into a scalable, production-ready online service designed to handle 1 million users.

## 🚀 How to Run the API Client
This project includes a functional frontend API client that communicates with the JSONPlaceholder practice API.
1. Clone this repository.
2. Open the `index.html` file in any modern web browser (or use the Live Server extension in VS Code).
3. Click "Load Notes" to fetch data, use the form to create notes, and click "Delete" to remove them.

## 📚 System Design Documentation
The backend architecture and database design for the real QuickNotes service are documented in the `docs/` folder:
- [API Design](docs/api-design.md) - RESTful endpoints, JSON payloads, and error handling.
- [Data Model](docs/data-model.md) - Relational database schema, SQL queries and indexing strategy.
- [Architecture](docs/architecture.md) - Scalability estimates, system diagram and component trade-offs.

## 💡 What I Learned
1. **Back-of-the-envelope estimation is a superpower:** Rounding numbers (like using 100,000 seconds in a day) helps you quickly figure out if you need 1 server or 100, preventing you from over-engineering a simple app.
2. **Separation of concerns keeps things fast:** I learned that different parts of a system should do different jobs. Databases handle structured text, object storage handles large files, and message queues handle slow background tasks so the user doesn't have to wait.
3. **Trade-offs are everywhere:** There is no "perfect" design. For example, using a cache makes an app lightning-fast, but it means the data might be a few seconds old. Good engineers choose the right trade-off for the specific product.
4. **Keeping user input safe is simple but critical:** I learned to always use `textContent` instead of `innerHTML` when displaying user data. This simple habit prevents malicious code (XSS attacks) from running on the webpage.
5. **Databases are like organized filing cabinets:** Using "foreign keys" and `JOIN` statements allows different tables (like users and notes) to connect cleanly without repeating the same information over and over, keeping the data accurate and easy to search.
6. **Apps should fail gracefully:** Networks drop and servers get busy. By using `try/catch` blocks and showing clear "Loading..." or "Error" messages, the app stays professional and keeps the user informed instead of just freezing or crashing.
