import Error from "@/components/Error/Error"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContextProvider"
import { axiosClient } from "@/service/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { LoaderCircleIcon, UserRoundPenIcon } from "lucide-react"
import React, { useEffect, useState } from "react"

interface UpdateUserType {
    username: string;
    readonly email: string;
    oldPassword: string;
    newPassword: string
}



const Profile = () => {
    const { userData } = useAuth()
    console.log(userData)
    const queryClient = useQueryClient()
    const [updatepage, setUpdatepage] = useState(false)
    const initialValue: UpdateUserType = {
        username: userData.username,
        email: userData.email,
        oldPassword: "",
        newPassword: ""
    }
    const [formData, setFormData] = useState<UpdateUserType>(initialValue)

    console.log(initialValue)
    console.log(formData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.id !== "email") {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }

    const updateUserProfile = async () => {
        const { data } = await axiosClient().put("/user/update-user", formData)
        return data
    }

    const { isPending, mutate, error } = useMutation({
        mutationFn: updateUserProfile, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchUser"] })
            setUpdatepage(true)
        }
    })
    useEffect(() => {

    }, [updatepage, formData, userData])
    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate()
    }

    return (
        <Card className="max-w-[740px] w-4/5 mx-auto my-6">
            {error && <div className="m-2"><Error message={error instanceof AxiosError && error.response ? error.response.data.message : "Something went wrong"} /></div>}
            <CardHeader>
                <CardTitle className="flex gap-2 items-center text-slate-700"><UserRoundPenIcon /> Update Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input value={formData.username} onChange={handleChange} id="username" type="text" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input disabled value={formData.email} onChange={handleChange} id="email" type="email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="oldPassword">Old Password</Label>
                            <Input value={formData.oldPassword} onChange={handleChange} id="oldPassword" type="password" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input value={formData.newPassword} onChange={handleChange} id="newPassword" type="password" />
                            <p className="text-xs text-slate-500">Password should be of atleast 6 character</p>
                        </div>
                        <div className="text-end">
                            <Button type="submit" className="w-fit" variant={"destructive"}>{isPending ? <LoaderCircleIcon className="animate-spin" /> : "Update"}</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>

    )
}

export default Profile