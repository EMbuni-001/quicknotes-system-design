const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.querySelector('#load-btn');
const statusEl = document.querySelector('#status');
const notesList = document.querySelector('#notes-list');

let notes = []; 

function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status-${type}`;
}

function toggleLoadButton(isDisabled) {
    loadBtn.disabled = isDisabled;
}

async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        li.textContent = 'No notes to display. Click "Load Notes" to fetch data!';
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
        li.appendChild(contentDiv);
        
        notesList.appendChild(li);
    });
}

async function loadNotes() {
    toggleLoadButton(true);
    setStatus('Loading notes...', 'loading');
    
    try {
        const data = await request(`${API_URL}?_limit=10`);
        notes = data;
        renderNotes();
        setStatus(`Loaded ${notes.length} notes from the server.`, 'success');
    } catch (error) {
        setStatus('Failed to load notes. Please try again.', 'error');
    } finally {
        toggleLoadButton(false);
    }
}

// Remember the Event Listener
loadBtn.addEventListener('click', loadNotes);

renderNotes();