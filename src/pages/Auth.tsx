import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"



const Auth = () => {

    // const { userData } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

    return (
        <div className=' flex flex-col justify-center  items-center pt-10 bg-slate-300'>
            <h2 className='text-3xl text-slate-800 font-bold'>Welcome to Note App</h2>
            <p className='text-slate-600 text-sm'>Your personal space to jot down thoughts and ideas.</p>

            <Tabs defaultValue="login" className="w-[540px] mt-6">
                <TabsList className='grid grid-cols-2'>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login"><Login /></TabsContent>
                <TabsContent value="register"><Register /></TabsContent>
            </Tabs>
        </div>
    )

}

export default Auth