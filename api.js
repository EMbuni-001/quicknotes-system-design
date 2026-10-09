const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM Elements
const loadBtn = document.querySelector('#load-btn');
const statusEl = document.querySelector('#status');
const noteForm = document.querySelector('#note-form');
const titleInput = document.querySelector('#title-input');
const bodyInput = document.querySelector('#body-input');
const submitBtn = document.querySelector('#submit-btn');
const notesList = document.querySelector('#notes-list');

let notes = []; 

function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status-${type}`;
}

function toggleButtons(isDisabled) {
    loadBtn.disabled = isDisabled;
    submitBtn.disabled = isDisabled;
}

// Reusable async request function
async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // JSONPlaceholder DELETE returns 200 with an empty body
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {}; 
        }
        return await response.json();
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

function renderNotes() {
    notesList.innerHTML = '';
    if (notes.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No notes to display. Load notes or create a new one!';
        notesList.appendChild(li);
        return;
    }

    notes.forEach(note => {
        const li = document.createElement('li');
        li.classList.add('note-item');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('note-content');
        
        const titleP = document.createElement('p');
        titleP.classList.add('note-title');
        titleP.textContent = note.title;    
        
        const bodyP = document.createElement('p');
        bodyP.classList.add('note-body');
        bodyP.textContent = note.body;  
        
        contentDiv.appendChild(titleP);
        contentDiv.appendChild(bodyP);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteNote(note.id, li));
        
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

// --- Task 1: GET ---
async function loadNotes() {
    toggleButtons(true);
    setStatus('Loading notes...', 'loading');
    try {
        const data = await request(`${API_URL}?_limit=10`);
        notes = data;
        renderNotes();
        setStatus(`Loaded ${notes.length} notes from the server.`, 'success');
    } catch (error) {
        setStatus('Failed to load notes. Please try again.', 'error');
    } finally {
        toggleButtons(false);
    }
}

// --- Task 2: POST ---
async function createNote(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        setStatus('Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        setStatus('Title must be 100 characters or fewer.', 'error');
        return;
    }

    toggleButtons(true);
    setStatus('Creating note...', 'loading');
    
    try {
        const payload = { title, body, userId: 1 };
        const newNote = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        notes.unshift(newNote);
        renderNotes();
        setStatus(`Note created (status 201, id ${newNote.id}).`, 'success');
        
        titleInput.value = '';
        bodyInput.value = '';
    } catch (error) {
        setStatus('Failed to create note. Please try again.', 'error');
    } finally {
        toggleButtons(false);
    }
}

// --- Task 3: DELETE ---
async function deleteNote(id, liElement) {
    toggleButtons(true);
    setStatus('Deleting note...', 'loading');
    
    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        notes = notes.filter(note => note.id !== id);
        liElement.remove();
        
        if (notes.length === 0) renderNotes(); 
        setStatus(`Note ${id} deleted successfully.`, 'success');
    } catch (error) {
        setStatus('Failed to delete note. Please try again.', 'error');
    } finally {
        toggleButtons(false);
    }
}

// --- Event Listeners ---
loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);

renderNotes();