import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotes } from "@/context/NotesContextProvider";
import { axiosClient } from "@/service/axios";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Note } from "../Note/Note";
import { useAuth } from "@/context/AuthContextProvider";
import { Button } from "../ui/button";

const Header = () => {
  const [searchNotes, setSearchNotes] = useState<string>("")
  const { setNotesData } = useNotes()
  const { userData, setUserData } = useAuth()
  const navigate = useNavigate()

  const fetchAllNotes = async () => {
    const { data } = await axiosClient().get("/notes")
    return data
  }

  const { data } = useQuery({ queryKey: ["notes"], queryFn: fetchAllNotes })

  useEffect(() => {
    const filterData = () => {

      const updatedData = data && data?.notes?.length > 0 && data?.notes?.filter((note: Note) =>
        note?.title?.toLowerCase().includes(searchNotes.toLowerCase())
      )
      setNotesData(updatedData)
    }
    filterData()
  }, [searchNotes])

  return <div className="flex items-center justify-between py-2 px-6 sm:py-3 sm:px-14 md:py-5 md:px-20 bg-slate-100">
    <Link to={"/"}>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700">Notes</h2>
    </Link>
    <div className="flex items-center sm:border sm:bg-slate-200 w-fit p-1 rounded-lg">
      <Input value={searchNotes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchNotes(e.target.value)} type="search" className="w-44 sm:block sm:w-60 bg-inherit focus-visible:ring-transparent focus:ring-transparent focus:ring-offset-transparent" />
    </div>
    <div className="">
      {
        userData && userData.userId ?
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link to={"/profile"}><DropdownMenuItem>{userData?.username}</DropdownMenuItem></Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { localStorage.clear(); setUserData({ userId: "", username: "", email: "" }); navigate("/auth") }}>logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          :
          <Button className="bg-indigo-500 hover:bg-indigo-700"><Link to={"/auth"}>Login</Link></Button>
      }
    </div>
  </div>;
};

export default Header;
