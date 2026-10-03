import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate, useParams, Link } from "react-router";
import storeThreads from "../Stores/threadsStore";
import { ui } from "../style-presets";
import storeUsers from "../Stores/userStore";


export default function PrivateThreadPasswordPage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const { board_mark, thread_id } = useParams<{ board_mark: string, thread_id: string }>()
    //STORE
    const loading = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().loading, () => false)
    const error = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().error, () => null)
    const currentThread = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().currentThread, () => null)
    const fetchThisThread = storeThreads.getState().fetchThisThread
    const handlePrivateThreadLogIn = storeThreads.getState().handlePrivateThreadLogin


    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')


    const [password, setPassword] = useState('')


    useEffect(() => {
        if (!board_mark || !thread_id) return


        const handleAsyncParse = async () => {
            setIsFetching(true)


            const IDAsNum = Number(thread_id)
            if (!currentThread) {
                const log = await fetchThisThread(IDAsNum)


                if (!log.success) {
                    setMsg(log.msg || 'error_unknown')
                    setStatus(log.status)
                }
            }


            setIsFetching(false)
        }
        handleAsyncParse()
    }, [])
    //HANDLERS
    let attempts = 0
    const handlePrivateThreadLogin = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!currentThread || currentThread.password) return


        const log = await handlePrivateThreadLogIn(Number(thread_id), String(password))


        if (log.success) {
            navigate(`/boards/${board_mark}/threads/${thread_id}`, { preventScrollReset: true })
        } else {
            alert(log.msg || 'error_unknown')
            if (attempts === 3) navigate('/')
            attempts++
        }
        return
    }
    if (currentThread?.author === currentUser) navigate(`/boards/${board_mark}/threads/${thread_id}`)
    //RENDER
    if (isFetching) {
        return (
            <div className={ui.loadingPage}>
                <p className={ui.loadingText}>Загрузка...</p>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (!currentThread && !isFetching) {
        return (
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка {status}</p>
                <small className={ui.errorText}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (currentThread && currentThread.status === 'PUBLIC') {
        navigate(`boards/${board_mark}/threads/${thread_id}`)
    } else {
        return (
            <div className={`${ui.page} flex items-center justify-center`}>
                <form className={`${ui.card} w-full max-w-2xl`} onSubmit={(e) => handlePrivateThreadLogin(e)}>
                    <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                        <strong className={ui.threadTitle}>Этот тред приватный</strong>
                        <small className={`${ui.description} mt-3`}>
                            Тред, на который вы хотите попасть, является приватным. Вам придется ввести оставленный владельцем пароль для входа в тред.
                        </small>
                    </section>


                    <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                        <label htmlFor="password" className={ui.text}>Пароль</label>
                        <input type="password" name="" id="password" className={ui.input} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </section>


                    <section className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                        <button type="submit" disabled={loading} className={ui.button}>Подтвердить</button>
                        <button type="button" disabled={loading} onClick={() => navigate(-1)} className={ui.button}>Назад</button>
                    </section>
                </form>
            </div>
        )
    }
}