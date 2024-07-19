import Note from "@/components/Note/Note"
import { axiosClient } from "@/service/axios"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircleIcon, NotebookPenIcon } from "lucide-react"
import NoteForm from "@/components/NoteForm/NoteForm"
import { useNotes } from "@/context/NotesContextProvider"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContextProvider"

export interface NoteType {
    _id: string;
    title: string;
    description: string;
    tags: string[];
}

const Landing = () => {
    const { notesData, setNotesData } = useNotes()
    const { userData } = useAuth()

    const fetchAllNotes = async () => {
        const { data } = await axiosClient().get("/notes")
        return data
    }

    const { data, isLoading, error } = useQuery({ queryKey: ["notes"], queryFn: fetchAllNotes, enabled: () => !!userData })

    useEffect(() => {
        if (data) {
            setNotesData(data?.notes)
        }
    }, [data, userData])

    if (isLoading) {
        return <LoaderCircleIcon className="animate-spin text-slate-700 text-center min-w-full my-10 " size={"3rem"} />
    }
    if (error) {
        console.log(error.message)
    }


    return (
        <div className="container my-10 flex  flex-wrap gap-4 sm:gap-8">
            {
                notesData?.length === 0 ? (<div className="mx-auto text-center my-10">
                    <NotebookPenIcon className="text-slate-700 mx-auto mb-4" size={"4rem"} />
                    <h1 className="text-2xl font-bold text-slate-700 mb-2">
                        Welcome to Your Notes App!
                    </h1>
                    <p className="text-slate-500 mb-4">
                        It looks like you don't have any notes yet. Start by creating a new note to get started!
                    </p>
                    <NoteForm />
                </div>) : <><NoteForm />
                    {
                        notesData?.map((note: NoteType, index: number) => (
                            <div className="" key={index}>
                                <Note note={note} />
                            </div>
                        ))
                    }</>
            }

        </div>
    )
}

export default Landing