import { useSyncExternalStore, useState } from "react"
import storeUsers from "../Stores/userStore"
import { _body, _hypertext, _text_error, _text_info, _profiles_body, _section, _main, _bio, _bio_cont, _button, _button_cont, _profiles_btn_cont, _profiles_btn } from "../style-presets"
import { useNavigate, Link } from "react-router"

export default function MyProfilePage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORE
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    const deleteUser = storeUsers.getState().deleteUser
    const logout = storeUsers.getState().logout
    //STATES
    const [hasToBeDeleted, setHasToBeDeleted] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    //HANDLERS
    const handleAccountDeletion = async () => {
        if (hasToBeDeleted === false) {
            alert('В целях безопасности вам необходимо нажать кнопку повторно, чтобы удалить свой профиль.')
            setHasToBeDeleted(true)
        } else {
            const id:number = currentUser?.id || 0
            const isExecuted = await deleteUser(id)

            if (isExecuted.success) {
                alert('Ваш профиль был удален.')
                logout()
                navigate('/')
            } else {
                alert(isExecuted.msg || 'Что-то пошло не так при удалении профиля.')
            }
        }
        return
    }

    const handleAccountLogout = async () => {
        if (isLoggingOut === false) {
            alert('Вы уверены что хотите выйти? Нажмите повторно, чтобы подтвердить')
            setIsLoggingOut(true)
        } else {
            await logout()
            alert('Вы вышли из аккаунта')
            navigate('/')
        }
        return
    }
    //RENDER
    let mainContent:any
    if (!currentUser) {
        mainContent = 
        <div className={_body}>
            <p className={_text_error}>Ошибка 401</p>
            <small className={_text_info}>Вы не авторизованы.</small>
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
                    <strong>Имя: {currentUser.username}</strong>

                    <div className={_bio_cont}>
                        <b>Описание</b>
                        <p className={_bio}>{currentUser.description || 'Нет описания.'}</p>
                    </div>

                </section>
                <small className={currentUser.role === 'user' ? `text-[#a4acff] text-[16px]` : 'text-[#a36aff] text-[16px]'}>Роль: {currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}</small>
            </main>

            <section className={`${_main} w-1/3`}>
                <div className={_profiles_btn_cont}>
                    <button type="button" onClick={() => navigate('/my-profile/edit')} className={_profiles_btn}>Редактировать</button>
                    <button type="button" onClick={handleAccountDeletion} className={_profiles_btn}>Удалить аккаунт</button>
                    <button type="button" onClick={handleAccountLogout } className={_profiles_btn}>Выйти</button>
                    <button type="button" onClick={() => navigate('/')} className={_profiles_btn}>Назад</button>
                </div>
            </section>
        </div>
    }
    return mainContent
}