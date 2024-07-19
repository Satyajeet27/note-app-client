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
import React, { useState } from "react"
import Error from "../Error/Error"
import { Loader } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosClient } from "@/service/axios"
import { AxiosError } from "axios"

interface Login {
    email: string;
    password: string;
}

const Login = () => {
    const initialState: Login = {
        email: "",
        password: ""
    }
    const [formData, setFormData] = useState<Login>(initialState)
    const queryClient = useQueryClient()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })

    }
    const handleLoginUser = async (userData: Login) => {
        const { data: result } = await axiosClient().post("/user/login", userData)
        // console.log(result)
        return result
    }

    const { mutate: loginUser, isPending: isLoading, error } = useMutation({
        mutationFn: handleLoginUser, onSuccess: (data) => {
            // console.log(data?.token)

            localStorage.setItem("token", data?.token)
            queryClient.invalidateQueries({ queryKey: ["notes"], exact: true })
            queryClient.invalidateQueries({ queryKey: ["fetchUser"], exact: true })
            window.location.replace("/")

        }, onError: (err) => {
            console.log(err)
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginUser(formData)
    }

    return (
        <Card className="w-full text-slate-700">
            <CardHeader>
                {error && <Error message={error instanceof AxiosError && error.response
                    ? error.response.data.message
                    : "An unexpected error occurred"} />}
                <CardTitle>Login</CardTitle>
                <CardDescription>Lets get yourself started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>

                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input value={formData.email} onChange={handleInputChange} id="email" type="email" required />

                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input value={formData.password} onChange={handleInputChange} id="password" type="password" required />

                        </div>
                        <div className="text-end">
                            <Button className="w-fit bg-indigo-500 hover:bg-indigo-800" >{isLoading ? <Loader className="animate-spin" /> : "Login"}</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default Login