import { useSyncExternalStore, useState } from "react"
import storeUsers from "../Stores/userStore"
import { ui } from "../style-presets"
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
        <div className={ui.errorPage}>
            <p className={ui.errorTitle}>Ошибка 401</p>
            <small className={ui.errorText}>Вы не авторизованы.</small>
            <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
        </div>
    } else {
        mainContent =
        <div className={`${ui.page} flex items-center justify-center`}>
            <div className="flex w-full max-w-4xl flex-col items-center gap-5">
                <main className={`${ui.card} w-full md:w-2/3`}>
                    <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                        <strong className={ui.threadTitle}>Профиль Пользователя</strong>
                    </section>


                    <section className={ui.threadInfo}>
                        <strong className={ui.author}>Имя: {currentUser.username}</strong>


                        <div className="mt-5 flex w-full flex-col items-start gap-2">
                            <b className={ui.text}>Описание</b>
                            <p className={`${ui.surface} w-full p-3 text-left text-text-main`}>
                                {currentUser.description || 'Нет описания.'}
                            </p>
                        </div>


                    </section>

                    <small className={`${ui.metadata} mt-4 text-[16px] ${currentUser.role === 'user' ? 'text-indigo-300' : 'text-purple-300'}`}>
                        Роль: {currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </small>
                </main>


                <section className={`${ui.card} w-full md:w-2/3`}>
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => navigate('/my-profile/edit')} className={ui.button}>Редактировать</button>
                        <button type="button" onClick={handleAccountDeletion} className={ui.button}>Удалить аккаунт</button>
                        <button type="button" onClick={handleAccountLogout} className={ui.button}>Выйти</button>
                        <button type="button" onClick={() => navigate('/')} className={ui.button}>Назад</button>
                    </div>
                </section>
            </div>
        </div>
    }
    return mainContent
}