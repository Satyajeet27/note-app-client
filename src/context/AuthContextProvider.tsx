import React, { createContext, useContext, useState } from "react";

interface ReactChildren {
    children: React.ReactNode
}
interface User {
    username: string; userId: string; email: string;
}
interface UserContext {
    userData: User;
    setUserData: React.Dispatch<React.SetStateAction<User>>;
}

export const authContext = createContext<UserContext>({
    userData: { username: "", userId: "", email: "" }, setUserData: () => { }
})


export const AuthContextProvider = ({ children }: ReactChildren) => {
    const [userData, setUserData] = useState<User>({ username: "", userId: "", email: "" })

    // console.log(isPending)
    return (
        <authContext.Provider value={{ userData, setUserData }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext<UserContext>(authContext)
