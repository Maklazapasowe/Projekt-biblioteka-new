import { dialogs, firstMessages } from "./dialogs";
import { executeActions } from "./dialogFunctions";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import ChatBooba from "./ChatBooba";

const reverseArray = (array) => {
    let newArray = [];
    for (let i = array.length - 1; i >= 0; i--) {
        newArray.push(array[i]);
    }
    return newArray;
}
const arrayIncludesAll = (array, values) => values === undefined ? true : values.every((value) => array.includes(value));
const arrayNotIncludesAll = (array, values) => values === undefined ? true : values.every((value) => !array.includes(value));

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const updateChatHistory = (obj) => {
    setCookie("chatHistory", JSON.stringify({ hist: [...JSON.parse(getCookie("chatHistory")).hist, obj] }));
}

export default function Chat() {
    const [dialogPath, setDialogPath] = useState(null);
    const [inventory, setInventory] = useState(null);
    const [chatMessages, setChatMessages] = useState(null);

    const sendMessage = async (actions, message) => {
        updateChatHistory({ message: message, self: true });
        setChatMessages(prev => [...prev, { message: message, self: true }]);
        setDialogPath(null);
        const functionsAfter = executeActions(actions, message);
        for (const func of functionsAfter) await func({ setDialogPath, setChatMessages, setInventory });
    }

    useEffect(() => {
        if (getCookie("location").length == 0 || getCookie("inventory").length == 0 || getCookie("chatHistory").length == 0) {
            setCookie("location", "/startDialog");
            setCookie("inventory", JSON.stringify({ inv: [] }));
            setCookie("chatHistory", JSON.stringify({ hist: firstMessages }));
        }

        setDialogPath(getCookie("location"));
        setInventory(JSON.parse(getCookie("inventory")).inv);
        setChatMessages(JSON.parse(getCookie("chatHistory")).hist);
    }, []);

    return (
        <>
            <div className="w-full h-full felx flex-col-reverse justify-end p-2">
                <div className="w-full h-[83vh] overflow-y-auto flex flex-col-reverse gap-y-1 chatScroll bg-opacity-15 bg-zinc-300 rounded-xl p-px pb-2">
                    {!chatMessages ? null :
                        reverseArray(chatMessages).map((value, index) => (
                            <ChatBooba key={index} {...value} />
                        ))}
                </div>

                <div className="w-full h-auto gap-5 flex items-center overflow-x-auto my-8 pb-2 chatScroll justify-evenly">
                    {!dialogPath ? null :
                        dialogs.filter((value) => value.path == dialogPath)
                            .filter(value => arrayIncludesAll(inventory, value.ifHas))
                            .filter(value => arrayNotIncludesAll(inventory, value.ifNotHas))
                            .sort((a, b) => b.priority - a.priority)
                            .map((value, index) =>
                                <ChatInput key={index} {...value} sendMessage={sendMessage} />
                            )}
                </div>
            </div>
        </>
    );
}
