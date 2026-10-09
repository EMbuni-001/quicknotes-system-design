
# QuickNotes API Design

## 1. REST Endpoints
| Method | Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | List all notes for the authenticated user | 200 OK |
| `GET` | `/api/notes/:id` | Get a specific note by ID | 200 OK |
| `POST` | `/api/notes` | Create a new note | 201 Created |
| `PATCH`| `/api/notes/:id` | Update an existing note's text or category | 200 OK |
| `DELETE`| `/api/notes/:id` | Delete a specific note | 204 No Content |
| `GET` | `/api/tags` | List all available tags | 200 OK |

## 2. Request & Response Examples

### Create a Note (`POST /api/notes`)
**Request Body:**
```json
{ 
  "id": 42,
    "title": "Study System Design",
    "body": "Review scaling concepts...",
    "category": "study",
    "created_at": "2024-05-15T10:00:00Z"
} // ---Returns 200 response---

## Error Status Codes 
All errors return a standard JSON body: {"error": "Message describing the error"}
400 Bad Request: Validation failed (e.g., title is missing or > 100 chars).
401 Unauthorized: Missing or invalid authentication token.
403 Forbidden: User is authenticated but trying to access another user's note.
404 Not Found: The requested note ID does not exist.
500 Internal Server Error: The database or server crashed.