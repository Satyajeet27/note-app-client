import { Note } from "@/components/Note/Note";
import { createContext, useContext, useState } from "react";


interface ReactChildren {
    children: React.ReactNode
}

interface NoteContextType {
    notesData: Note[] | undefined;
    setNotesData: React.Dispatch<React.SetStateAction<undefined>>
}

const NotesContext = createContext<NoteContextType>({
    notesData:
        [{
            _id: "",
            title: "",
            description: "",
            tags: [],
        }], setNotesData: () => { }
})

export const NotesContextProvider = ({ children }: ReactChildren) => {
    const [notesData, setNotesData] = useState()
    return <NotesContext.Provider value={{ notesData, setNotesData }}>
        {children}
    </NotesContext.Provider>
}

export const useNotes = () => useContext(NotesContext)