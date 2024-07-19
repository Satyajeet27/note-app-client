import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { axiosClient } from "@/service/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../Error/Error";

interface CreateUserType {
    username: string;
    email: string;
    password: string;
}

const Register = () => {
    const initialValue: CreateUserType = {
        username: "",
        email: "",
        password: ""
    }
    const [formData, setFormData] = useState<CreateUserType>(initialValue)
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const createUser = async () => {
        const { data } = await axiosClient().post("/user/signup", formData)
        return data
    }

    const { mutate, isPending, error } = useMutation({
        mutationFn: createUser, onSuccess: () => {
            setFormData(initialValue)
            navigate("/auth")
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(formData)
        mutate()
    }

    return (
        <Card className="w-full text-slate-700">
            <div className="mt-2 ml-2">
                {error && <Error message={error instanceof AxiosError && error.response ? error?.response?.data?.message : "An unexpected error occurred"} />}
            </div>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Lets create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input value={formData.username} onChange={handleChange} id="username" type="text" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input value={formData.email} onChange={handleChange} id="email" type="email" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input value={formData.password} onChange={handleChange} id="password" type="password" required />
                        </div>
                        <div className="text-end">
                            <Button type="submit" className="w-fit bg-emerald-500 hover:bg-emerald-700">{isPending ? <LoaderCircleIcon className="animate-spin" /> : "Create"}</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default Register