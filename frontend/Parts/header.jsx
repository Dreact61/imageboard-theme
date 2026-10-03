import { useEffect, useSyncExternalStore } from "react"
import storeUsers from "../Stores/userStore"
import { ui } from '../style-presets'
import { Link } from "react-router"

export default function Header() {
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)

    const themeURL = '/wp-content/themes/imageboard-theme'
    const logoURL = `${themeURL}/public/pictures/ico.png`

    return (
        <header className={`${ui.card} flex-col w-full max-w-5xl`}>
            <div className="flex-row flex w-full items-center justify-around border-b-2 border-[#3f2b8a] pb-2">
                <h2 className="text-2xl"><Link to="/">D-Chan</Link></h2>
                <p>{currentUser ? <Link className={ui.link} to={`/my-profile`}>{currentUser.username}</Link> : <Link to="/register" className={ui.link}>Регистрация</Link>}</p>
            </div>
            <img className={`${ui.img} self-center w-25 h-25 mt-4`} src={logoURL} />
        </header>
    )
}