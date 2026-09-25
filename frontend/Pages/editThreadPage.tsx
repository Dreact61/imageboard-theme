import { useNavigate, useParams, Link } from "react-router"
import { _body, _main, _profiles_body, _text_info, _text_error, _text_loading, _hypertext, _section, _button_cont, _form_items_grid, _inputField, _button, _textareaField, _selectCard } from "../style-presets"
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

    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)

    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    const fetchThisBoard = storeBoards.getState().fetchThisBoard
    //STATES
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')
    const [isFetching, setIsFetching] = useState(true)

    const [threadName, setThreadName] = useState('')
    const [threadDesc, setThreadDesc] = useState('')
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
        if (currentThread) {
            setThreadName(currentThread.name || '')
            setThreadDesc(currentThread.description || '')
            setThreadPass(currentThread.password || '')
        }
    }, [currentThread])
    //HANDLERS
    const handleFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        const data = {
            name: threadName,
            description: threadDesc,
            password: threadPass
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
        <div className={_body}>
            <p className={_text_loading}>Загрузка...</p>
            <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
        </div>
    } else if (error || !currentThread || !thread_id) {
        return (
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    } else if (currentUser?.username === currentThread.author || currentUser?.username === currentBoard?.author || currentUser?.role === 'admin') {
        return (
            <div className={_profiles_body}>
                <form onSubmit={(e) => handleFormSubmit(e)} className={_main}>
                    <section className={_section}>
                        <strong>Редактирование треда</strong>
                    </section>

                    <section className={_form_items_grid}>
                        <label htmlFor="name">Название треда</label>
                        <input type="text" id="name" value={threadName} onChange={(e) => setThreadName(e.target.value)} className={_inputField} disabled={loading} />
                        <label htmlFor="desc">Описание треда</label>
                        <textarea id="desc" value={threadDesc} onChange={(e) => setThreadDesc(e.target.value)} className={_textareaField} disabled={loading} />
                        {currentThread.status === 'PRIVATE'
                        ?
                        <>
                        <label htmlFor="pass">Пароль приватного треда</label>
                        <input minLength={6} id="pass" className={_selectCard} value={threadPass} onChange={(e) => setThreadPass(e.target.value)} disabled={loading} />
                        </>
                        : ''
                        }

                    </section>

                    <section className={_button_cont}>
                        <button disabled={loading} type="submit" className={_button}>Подтвердить</button>
                        <button disabled={loading} onClick={() => navigate(-1)} type="button" className={_button}>Назад</button>
                    </section>
                </form>
            </div>
        )
    } else {
        return (
            <div className={_body}>
                <p className={_text_error}>Отказано в доступе.</p>
                <small className={_text_info}>{error || msg || 'У вас недостаточно прав на выполнение этой операции.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    }
}