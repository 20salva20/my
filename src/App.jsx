import React, { useState, useReducer} from "react";
import {v4 as uuid} from 'uuid';


const initialNotesState = {
    lastNoteCreated: null,
    totalNotes: 0,
    notes: [],
}
const noteReducer = (prevState, action) => {
    switch(action.type) {
        case 'ADD_NOTE': {
            const newState = {
                lastNoteCreated: new Date().toTimeString().slice(0, 8),
                totalNotes: prevState.notes.length + 1,
                notes: [...prevState.notes, action.payload]
            };

            console.log('After ADD_NOTE: ', newState);
            return newState;
        }

        

        case 'DELETE_NOTE':{
            const newState = {
                ...prevState,
                notes: prevState.notes.filter(note => note.id !== action.payload.id),
                totalNotes : prevState.notes.length - 1,
            };

            console.log('After DELETE_NOTE: ', newState);
            return newState;
        }
    }
    
};

export function App() {
    const [noteInput, setNoteInput] = useState('');
    const [notesState, dispatch] = useReducer(noteReducer, initialNotesState)
    
    const addNote = event => {
        event.preventDefault();

        if (!noteInput) {
            return;
        }

        const newNote = {
            id: uuid(),
            text: noteInput,
            rotate: Math.floor(Math.random() * 20)
        };

        dispatch({ type:'ADD_NOTE', payload: newNote});
        setNoteInput('');
    };
    
    const dropNote = event =>{
        event.target.style.left = `${event.pageX - 50}px`;
        event.target.style.top = `${event.pageY - 50}px`;
    }

    const dragOver = event =>{
        event.stopPopagation();
        event.preventDefault();
    };

    return(
        <div className="App" onDragOver={dragOver}>
            <h1>
                Post it Simulator! ({ notesState.totalNotes })
                <span>{notesState.totalNotes > 0 ? `Last note created: ${notesState.lastNoteCreated}` : ''}</span>
            </h1>
        <form onSubmit ={addNote} className="note-form">
            <textarea value={noteInput}
               onChange={event => setNoteInput(event.target.value)}
               placeholder="Create a new note..."></textarea>
            <button>Add</button>
        </form>    

        {notesState
            .notes
            .map(note => (
                <div className="note">
                    style={{transform: `rotate(${note.rotate}deg)` }}
                    draggable="true"
                    onDragEnd={dropNote}
                    key={note.id}
                    
                    <div onClick={() => dispatch({ type:'DELETE_NOTE', payload: note})} 
                         className="close">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                         </svg>

                    </div>



                    <pre className="text">{note.text}</pre>
                </div>
            ))
        }
        </div>
    )
    
}