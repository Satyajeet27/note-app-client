import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { CirclePlus, EditIcon, Hash, LoaderCircleIcon, NotebookPenIcon, X } from 'lucide-react'
import { Input } from '../ui/input'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/service/axios'
import { useNavigate } from 'react-router-dom'

interface NotesType {
    _id?: string;
    title: string;
    description: string;
    tags: string[]
}


const UpdateNoteForm = ({ note }: { note: NotesType }) => {

    const { title, description, _id, tags: userTags }: NotesType = note
    const [formData, setFormData] = useState<NotesType>({ title, description, tags: userTags })
    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    const [tag, setTag] = useState<string>("")
    const [tags, setTags] = useState<string[]>(userTags)
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)

    }
    const handleAddTag = () => {
        const newTags = [...tags, tag]
        setTags(newTags)
        setFormData({ ...formData, tags: newTags })
        setTag("")
    }
    const handleUpdateTags = (index: number) => {
        const updatedTags = tags.filter(tag => tag !== tags[index])
        setTags(updatedTags)
        setFormData({ ...formData, tags: updatedTags })

    }
    const updateNote = async () => {
        const { data } = await axiosClient().put(`/notes/${_id}`, formData)
        return data
    }
    const { isPending, mutate } = useMutation({
        mutationFn: updateNote, onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notes"] })
            navigate("/")
        }, onError: (err) => {
            console.log(err.message)
        }
    })


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // console.log(formData)
            mutate()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <EditIcon size={17} className="cursor-pointer text-green-600" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="flex gap-2 items-center text-blue-500"><NotebookPenIcon />Update your Notes here</DialogTitle>
                    <DialogDescription>
                        <form className="space-y-2" onSubmit={handleSubmit}>
                            <div className="">
                                <label htmlFor="title">Title</label>
                                <Input id="title" value={formData.title} onChange={handleChange} />
                            </div>
                            <div className="">
                                <label htmlFor="description">Description</label>
                                <Input id="description" value={formData.description} onChange={handleChange} />
                            </div>
                            <div className="">
                                <label htmlFor="tags">Tags</label>
                                <div className="flex">
                                    <Input value={tag} onChange={handleTagChange} id="tags" type='text' />
                                    <Button type='button' onClick={handleAddTag}><CirclePlus /></Button>

                                </div>
                                <p className='my-1 flex gap-2 items-center'>{tags.map((tag, index) => (<Badge className='flex gap-1 w-fit items-center' variant={"secondary"} key={index}><span className='flex items-center'><Hash size={10} />{tag}</span><X size={10} onClick={() => handleUpdateTags(index)} /></Badge>
                                ))}</p>
                            </div>
                            <Button type='submit'>{isPending ? <LoaderCircleIcon className='animate-spin' /> : "Update"}</Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateNoteForm