import { useEffect, useSyncExternalStore } from "react"
import storeUsers from "../Stores/userStore"
import {_header, _hypertext, _img} from '../style-presets'
import { Link } from "react-router"

export default function Header() {
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)

    return (
        <header className={_header}>
            <div className="flex-row flex w-full items-center justify-around border-b-2 border-[#3f2b8a] pb-2">
                <h2 className="text-2xl">D-Chan</h2>
                <p>{currentUser ? <Link  className={_hypertext} to={`/my-profile`}>{currentUser.username}</Link> : <Link to="/register" className={_hypertext}>Регистрация</Link>}</p>
            </div>
            <img className={_img} src="../../public/pictures/ico.png" alt="D-ch logo" />
        </header>
    )
}