import type { User } from "../../types"


import { useSyncExternalStore, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"


import storeUsers from "../Stores/userStore"
import { ui } from "../style-presets"


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
        <div className={ui.loadingPage}>
            <p className={ui.loadingText}>Загрузка...</p>
            <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
        </div>
    } else if (error || !user) {
        mainContent =
        <div className={ui.errorPage}>
            <p className={ui.errorTitle}>Ошибка {status}</p>
            <small className={ui.errorText}>{error ? error : 'Что-то пошло не так. Попробуйте перезагрузить страницу или зайти позже.'}</small>
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
                        <strong className={ui.author}>Имя: {user.username}</strong>


                        <div className="mt-5 flex w-full flex-col items-start gap-2">
                            <b className={ui.text}>Описание</b>
                            <p className={`${ui.surface} w-full p-3 text-left text-text-main`}>
                                {user.description || 'Нет описания.'}
                            </p>
                        </div>


                    </section>

                    <small className={`${ui.metadata} mt-4 text-[16px] ${user.role === 'user' ? 'text-indigo-300' : 'text-purple-300'}`}>
                        Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </small>
                </main>


                <section className={`${ui.card} w-full md:w-2/3`}>
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => navigate('/reports')} className={ui.button}>Пожаловаться</button>
                        <button type="button" onClick={() => navigate('/')} className={ui.button}>Назад</button>
                    </div>
                </section>
            </div>
        </div>
    }


    return mainContent
}