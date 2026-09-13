import { useEffect, useSyncExternalStore } from "react"
import storeUsers from "../Stores/userStore"

export default function Header() {
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)

    return (
        <header className="flex flex-col m-auto w-1/2 items-center justify-between pb-2 border-b-2">
            <div className="flex-row flex w-full items-center justify-around border-b pb-2">
                <h2 className="text-2xl">D-Chan</h2>
                <p>{currentUser ? currentUser.username : 'Регистрация'}</p>
            </div>
            <img className="h-25 w-25 border mt-2" src="../../public/pictures/ico.png" alt="D-ch logo" />
        </header>
    )
}