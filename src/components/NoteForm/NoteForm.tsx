import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Card } from '../ui/card'
import { CirclePlus, LoaderCircleIcon, NotebookPenIcon, PlusCircle } from 'lucide-react'
import { Input } from '../ui/input'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/service/axios'
import { useNavigate } from 'react-router-dom'

interface CreateNotesType {
    title: string;
    description: string;
    tags: string[]
}
const initialValue: CreateNotesType = {
    title: "",
    description: "",
    tags: []
}

const NoteForm = () => {

    const [formData, setFormData] = useState<CreateNotesType>(initialValue)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    const [tag, setTag] = useState<string>("")
    const [tags, setTags] = useState<string[]>([])
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)

    }
    const handleAddTag = () => {
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
        setFormData({ ...formData, tags: updatedTags })
        setTag("")
    }
    const createNote = async () => {
        const { data } = await axiosClient().post("/notes/", formData)
        return data
    }
    const { isPending, mutate } = useMutation({
        mutationFn: createNote, onSuccess: async () => {
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
        <div className='absolute right-6 bottom-6'>
            <Dialog onOpenChange={() => { setFormData(initialValue); setTags([]) }}>
                <DialogTrigger>
                    <Card className="bg-blue-500 text-white p-2 outline-none border-none hover:scale-105 transition-all duration-150">
                        <PlusCircle size={40} />
                        {/* <NotebookPenIcon className='text-slate-600' size={100} /> */}
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="flex gap-2 items-center text-blue-500"><NotebookPenIcon /> Create Your New Note!</DialogTitle>
                        <DialogDescription>
                            <form className="space-y-2 max-sm:text-left" onSubmit={handleSubmit}>
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
                                    <p className='my-1'>{tags.map((tag, index) => (<Badge className='' variant={"secondary"} key={index}>#{tag}</Badge>
                                    ))}</p>
                                </div>
                                <Button type='submit'>{isPending ? <LoaderCircleIcon className='animate-spin' /> : "Submit"}</Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NoteForm