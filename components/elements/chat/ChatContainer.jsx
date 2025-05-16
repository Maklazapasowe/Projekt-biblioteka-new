'use client'

import { useState } from "react";
import Image from "next/image";
import chatIcon from "@/public/chat.svg"
import Chat from "./Chat";

export default function ChatContainer(){
    const [isShown, setIsShown] = useState(false);

    return(
    <>
        <div 
            className="
                w-12 aspect-square fixed right-0 translate-x-[-10%] top-1/4 
                bg-blue-500 rounded-full 4 cursor-pointer flex justify-center items-center
            "
            onClick={()=>setIsShown(true)}
        >
            <div className="w-3/4 h-3/4 bg-blue-500 rounded-full animate-ping absolute" />
            <Image src={chatIcon} alt="" className="w-1/2 h-1/2 invert" />
            <div className="w-[30%] h-[30%] bg-red-500 rounded-full absolute right-0 top-0"></div>
        </div>

        <div onClick={()=>setIsShown(false)} className={`w-full h-[100vh] backdrop-blur-sm fixed right-0 top-0 ${!isShown ? "translate-x-full" : "translate-x-0"}`}></div>
        
        <div id="chat" className={`
            w-full h-full sm:w-[30rem] fixed right-0 top-0 flex flex-col items-end p-1
            sm:rounded-s-lg bg-blue-500 dark:bg-blue-700 transition-transform duration-500 overflow-y-auto ${!isShown ? "translate-x-full" : "translate-x-0"}`}
        >
            <div className="w-10 aspect-square bg-red-700 rounded-lg right-1 top-1 cursor-pointer flex justify-center items-center font-bold text-xl text-white" onClick={()=>setIsShown(false)}>X</div>
            <Chat />
        </div>
    </>
    );
}
