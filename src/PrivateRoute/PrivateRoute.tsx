import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "@/service/axios"
import { LoaderCircleIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContextProvider"
import { useNavigate } from "react-router-dom"
import Auth from "@/pages/Auth"

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {

    const { userData, setUserData } = useAuth()
    const navigate = useNavigate()
    const fetchUser = async () => {
        const { data } = await axiosClient().get("/user")
        return data
    }
    const { isLoading, data, error } = useQuery({ queryKey: ["fetchUser"], queryFn: fetchUser, retry: 0 })
    // console.log(data, isLoading, error)


    useEffect(() => {
        if (data) {
            setUserData(data?.user)
        }

    }, [data, userData, setUserData])
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/auth")
        }
    }, [])
    if (isLoading) {
        return <LoaderCircleIcon className="animate-spin text-slate-700 text-center min-w-full my-10 " size={"3rem"} />
    }

    if (error) {
        // console.log(error)
        return < Auth />
    }
    return (
        <>
            {children}
        </>
    )


}

export default PrivateRoute