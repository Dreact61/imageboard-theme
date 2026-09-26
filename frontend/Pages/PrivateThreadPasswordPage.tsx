import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate, useParams, Link } from "react-router";
import storeThreads from "../Stores/threadsStore";
import { _main, _profiles_body, _profiles_btn_cont, _section, _body, _text_error, _text_info, _text_loading, _inputField, _form_items_grid, _hypertext, _profiles_btn } from "../style-presets";
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
            <div className={_body}>
                <p className={_text_loading}>Загрузка...</p>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (!currentThread && !isFetching) {
        return (
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (currentThread && currentThread.status === 'PUBLIC') {
        navigate(`boards/${board_mark}/threads/${thread_id}`)
    } else {
        return (
            <div className={_profiles_body}>
                <form className={_main} onSubmit={(e) => handlePrivateThreadLogin(e)}>
                    <section className={_section}>
                        <strong>Этот тред приватный</strong>
                        <small>Тред, на который вы хотите попасть, является приватным. Вам придется ввести оставленный владельцем пароль для входа в тред.</small>
                    </section>

                    <section className={_form_items_grid}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="" id="password" className={_inputField} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </section>

                    <section className={_profiles_btn_cont}>
                        <button type="submit" disabled={loading} className={_profiles_btn}>Подтвердить</button>
                        <button type="button" disabled={loading} onClick={() => navigate(-1)} className={_profiles_btn}>Назад</button>
                    </section>
                </form>
            </div>
        )
    }
}