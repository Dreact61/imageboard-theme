import type { User } from "../../types"

import { useSyncExternalStore, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

import storeUsers from "../Stores/userStore"
import { _body, _hypertext, _text_loading, _text_error, _text_info, _main, _section, _borders, _bio, _bio_cont, _button_cont, _button, _profiles_body, _profiles_btn_cont, _profiles_btn } from "../style-presets"

export default function ProfilePage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const {user_id} = useParams<{user_id:string}>()
    //STORE
    const loading = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().loading, () => false)
    const error = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().error, () => null)
    const fetchThisUser = storeUsers.getState().fetchThisUser
    //STATE
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [user, setUser] = useState({} as User)

    useEffect(() => {
        if (!user_id) return

        const handleAsyncParse = async () => {
            setIsFetching(true)
            const idToNumber = Number(user_id)
            const log = await fetchThisUser(idToNumber)
            
            const user = log.data
            setUser(user as User || null)

            setIsFetching(false)
            setStatus(log.status)
        }

        handleAsyncParse()
    }, [user_id, fetchThisUser])
    console.log(user)
    //RENDER
    let mainContent:any
    if (loading || isFetching) {
        mainContent = 
        <div className={_body}>
            <p className={_text_loading}>Загрузка...</p>
            <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
        </div>
    } else if (error || !user) {
        mainContent =
        <div className={_body}>
            <p className={_text_error}>Ошибка {status}</p>
            <small className={_text_info}>{error ? error : 'Что-то пошло не так. Попробуйте перезагрузить страницу или зайти позже.'}</small>
            <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
        </div>
    } else {
        mainContent = 
        <div className={_profiles_body}>
            <main className={`${_main} w-1/3`}>
                <section className={_section}>
                    <strong>Профиль Пользователя</strong>
                </section>

                <section className={_section}>
                    <strong>Имя: {user.username}</strong>

                    <div className={_bio_cont}>
                        <b>Описание</b>
                        <p className={_bio}>{user.description || 'Нет описания.'}</p>
                    </div>

                </section>
                <small className={user.role === 'user' ? `text-[#a4acff] text-[16px]` : 'text-[#a36aff] text-[16px]'}>Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</small>
            </main>

            <section className={`${_main} w-1/3`}>
                <div className={_profiles_btn_cont}>
                    <button type="button" onClick={() => navigate('/reports')} className={_profiles_btn}>Пожаловаться</button>
                    <button type="button" onClick={() => navigate('/')} className={_profiles_btn}>Назад</button>
                </div>
            </section>
        </div>
    }

    return mainContent
}