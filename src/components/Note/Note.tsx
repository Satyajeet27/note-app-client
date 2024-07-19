import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrashIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/service/axios";
import UpdateNoteForm from "../NoteForm/UpdateNote";

export interface Note {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt?: Date | string | undefined;
}

const Note = ({ note }: { note: Note }) => {
    const { title, description, tags, _id, createdAt } = note
    const userDate = new Date(createdAt as string).toDateString();

    const queryClient = useQueryClient()

    const deleteNote = async (noteId: string) => {
        const { data } = await axiosClient().delete(`/notes/${noteId}`)
        return data
    }
    const { mutate: deleteNoteFn } = useMutation({
        mutationFn: (noteId: string) => deleteNote(noteId), onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] })
        }, onError: (err) => {
            console.error(err)
        }
    })


    return (
        <Card className="max-w-[450px] w-[350px]">
            <CardHeader>
                <div className=" flex justify-between items-center">
                    <CardTitle className="text-slate-600">{title}</CardTitle>
                    <p className="text-[10px] text-slate-500">~{userDate}</p>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between">
                <div className="flex text-sm text-slate-500 gap-2 items-center">
                    {tags.map((tag, index: number) => (<p key={index}>#{tag}</p>))}
                </div>
                <div className="flex gap-2 text-slate-600">
                    <UpdateNoteForm note={note} />
                    <TrashIcon className="cursor-pointer text-red-500" size={17} onClick={() => deleteNoteFn(_id)} />
                </div>
            </CardFooter>
        </Card>

    )
}

export default Note