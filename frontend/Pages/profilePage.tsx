import Header from "../Parts/header"
import Footer from "../Parts/footer"

import { useSyncExternalStore } from "react"
import { Link, useNavigate, useParams } from "react-router"

import storeUsers from "../Stores/userStore"
import { _body, _text_loading, _text_error, _text_info } from "../style-presets"

export default async function ProfilePage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const {user_id} = useParams<{user_id:string}>()
    //STORE
    const loading = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getInitialState().loading, () => false)
    const error = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().error, () => null)
    const fetchThisUser = storeUsers.getState().fetchThisUser
    //STATE
    const log = await fetchThisUser(Number(user_id))
    //RENDER
    let mainContent:any
    if (loading) {
        mainContent = 
        <div className={_body}>
            <Header />
            <p className={_text_loading}>Загрузка...</p>
            <Footer />
        </div>
    } else if (error) {
        mainContent =
        <div className={_body}>
            <p className={_text_error}>Ошибка</p>
            <small className={_text_info}>Что-то пошло не так. Попробуйте перезагрузить страницу или зайти позже.</small>
        </div>
    } else if (!log || !log.success) {
        mainContent = 
        <div className={_body}>
            <p className={_text_error}>Пользователь не найден</p>
            <small className={_text_info}>Перепроверьте адрес. Возможно вы написали его с ошибкой.</small>
        </div>
    } else {
        mainContent = 
        <div className={_body}>
            ---ПРОДОЛЖИТЬ ОТСЮДА---
        </div>
    }

    return mainContent
}