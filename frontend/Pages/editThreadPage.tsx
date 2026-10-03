import { useNavigate, useParams, Link } from "react-router"
import { ui } from "../style-presets"
import { useEffect, useState, useSyncExternalStore } from "react"
import storeThreads from "../Stores/threadsStore"
import storeUsers from "../Stores/userStore"
import storeBoards from "../Stores/boardsStore"


export default function EditThreadPage() {
    //NAVIGATION & PARAMS
    const navigate = useNavigate()
    const { board_mark, thread_id } = useParams<{ board_mark: string, thread_id: string }>()
    //STORE
    const loading = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().loading, () => false)
    const error = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().error, () => null)
    const currentThread = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().currentThread, () => null)
    const fetchThisThread = storeThreads.getState().fetchThisThread
    const editThread = storeThreads.getState().editThread
    const handleThreadPasswordOutput = storeThreads.getState().handleThreadPasswordOutput


    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)


    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    const fetchThisBoard = storeBoards.getState().fetchThisBoard
    //STATES
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')
    const [isFetching, setIsFetching] = useState(true)


    const [threadName, setThreadName] = useState('')
    const [threadDesc, setThreadDesc] = useState('')
    const [threadStatus, setThreadStatus] = useState('PUBLIC')
    const [threadPass, setThreadPass] = useState('')


    useEffect(() => {
        if (!board_mark || !thread_id) return



        const handleAsyncParse = async () => {
            setIsFetching(true)


            if (!currentBoard) {
                await fetchThisBoard(board_mark)
            }


            const IDAsNum = Number(thread_id)
            if (!currentThread || currentThread.id !== IDAsNum) {
                const log = await fetchThisThread(IDAsNum)


                if (!log.success || !log.data) {
                    setStatus(log.status)
                    setMsg(log.msg || error || 'error_unknown')
                }
            }
            setIsFetching(false)
        }
        handleAsyncParse()


    }, [thread_id, fetchThisThread, fetchThisBoard])


    useEffect(() => {
        const handleAsyncParse = async () => {
            if (currentThread && currentThread.status === 'PRIVATE') {
                const log: any = await handleThreadPasswordOutput(Number(thread_id))


                if (!log.status || !log.data) {
                    setStatus(log.status)
                    setMsg(log.msg || error || 'error_unknown')
                }
                setThreadPass(log.data || '')
            }
        }
        handleAsyncParse()
    }, [currentThread])


    useEffect(() => {
        if (currentThread) {
            setThreadName(currentThread.name || '')
            setThreadDesc(currentThread.description || '')
            setThreadStatus(currentThread.status || 'PUBLIC')
        }
    }, [currentThread])
    //HANDLERS
    const handleFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()


        const data = {
            name: threadName,
            description: threadDesc,
            password: threadPass,
            status: threadStatus
        }
        const log = await editThread(Number(thread_id), data)


        if (log.success) {
            alert('Тред был успешно отредактирован!')
            navigate(-1)
        } else {
            alert(log.msg || 'Что-то пошло не так при редактировании треда.')
        }
        return
    }


    //RENDER
    if (isFetching) {
        return (
            <div className={ui.loadingPage}>
                <p className={ui.loadingText}>Загрузка...</p>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (!currentThread || !thread_id) {
        return (
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка {status}</p>
                <small className={ui.errorText}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (currentUser?.username === currentThread.author || currentUser?.username === currentBoard?.author || currentUser?.role === 'admin') {
        return (
            <div className={ui.page}>
                <form onSubmit={(e) => handleFormSubmit(e)} className={`${ui.card} mx-auto max-w-2xl`}>
                    <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                        <strong className={ui.threadTitle}>Редактирование треда</strong>
                    </section>


                    <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                        <label htmlFor="name" className={ui.text}>Название треда</label>
                        <input type="text" id="name" value={threadName} onChange={(e) => setThreadName(e.target.value)} className={ui.input} disabled={loading} />
                        <label htmlFor="desc" className={ui.text}>Описание треда</label>
                        <textarea id="desc" value={threadDesc} onChange={(e) => setThreadDesc(e.target.value)} className={`${ui.input} h-32 resize-none`} disabled={loading} />
                        <label htmlFor="status" className={ui.text}>Статус треда</label>
                        <select id="status" className={`${ui.card} w-full cursor-pointer bg-surface text-text-main`} disabled={loading} value={threadStatus} onChange={(e) => setThreadStatus(e.target.value)}>
                            <option value="PUBLIC">Публичный</option>
                            <option value="PRIVATE">Приватный</option>
                        </select>
                        {threadStatus === 'PRIVATE'
                            ?
                            <>
                                <label htmlFor="pass" className={ui.text}>Пароль приватного треда</label>
                                <input required={threadStatus === 'PRIVATE'} minLength={6} id="pass" className={ui.input} value={threadPass} onChange={(e) => setThreadPass(e.target.value)} disabled={loading} />
                            </>
                            : ''
                        }


                    </section>


                    <section className="mt-5 flex w-full items-center justify-evenly gap-4">
                        <button disabled={loading} type="submit" className={ui.button}>Подтвердить</button>
                        <button disabled={loading} onClick={() => navigate(-1)} type="button" className={ui.button}>Назад</button>
                    </section>
                </form>
            </div>
        )
    } else {
        return (
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Отказано в доступе.</p>
                <small className={ui.errorText}>{error || msg || 'У вас недостаточно прав на выполнение этой операции.'}</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
        )
    }
}