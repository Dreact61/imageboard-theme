import { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate, useParams, Link } from "react-router"
import storeThreads from "../Stores/threadsStore"

import { _body, _text_loading, _text_error, _text_info, _hypertext, _main, _section, _card, _button, _button_cont, _inputField, _profiles_body, _messaging_cont, _profiles_btn, _profiles_btn_cont, _container, _borders, _form_items_grid } from '../style-presets'
import Header from "../Parts/header"
import Footer from "../Parts/footer"
import storeUsers from "../Stores/userStore"

export default function ThreadPage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const { board_mark, thread_id } = useParams<{ board_mark: string, thread_id: string }>()
    //STORE
    const error = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().error, () => null)
    const loading = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().loading, () => false)
    const currentThread = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().currentThread, () => null)
    const currentThreadPosts = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().currentThreadPosts, () => [])
    const fetchThisThread = storeThreads.getState().fetchThisThread
    const deleteThread = storeThreads.getState().deleteThread

    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')

    const [postContent, setPostContent] = useState('')
    const [toDelete, setToDelete] = useState(false)

    useEffect(() => {
        if (!thread_id || !board_mark) return

        const handleAsyncParse = async () => {
            setIsFetching(true)

            const IDAsNum = Number(thread_id)
            if (!currentThread) {
                const log = await fetchThisThread(IDAsNum)

                if (!log.success) {
                    setStatus(log.status)
                    setMsg(log?.msg || 'error_unknown')
                }
            }

            setIsFetching(false)
        }
        handleAsyncParse()
    }, [fetchThisThread, currentThreadPosts])
    //HANDLERS
    const handleMessageSending = async (e: any) => {
        // тут пока остановиться, в первую очередь нужно разобраться с изменением и удалением веток. Потом перейти сюда.
    }

    const handleThreadDeletion = async () => {
        if (toDelete) {
            if (!currentThread || !currentThread.id) return
            const boardId = currentThread.id

            const log = await deleteThread(boardId)

            if (log.success) {
                alert('Тред был успешно удален.')
                navigate('/')
            } else {
                alert(log.msg || 'Что-то пошло не так при удалении треда.')
            }
        } else {
            alert('Вы уверены в том, что хотите удалить тред? (Нажмите повторно для подтверждения).')
            setToDelete(true)
        }
        return
    }
    //RENDER
    let mainContent: any
    if (isFetching) {
        mainContent =
            <div className={_body}>
                <p className={_text_loading}>Загрузка...</p>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
    } else if (!currentThread || error && !isFetching) {
        mainContent =
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
    } else {
        mainContent =
            <div className={_profiles_body}>
                <Header />

                {currentUser && (currentThread.author === currentUser?.username || currentUser.role === 'admin')
                    ?
                    <section className={`${_borders} flex flex-row w-1/2 items-center justify-around p-4 gap-8 `}>
                        <button type="button" className={_profiles_btn} onClick={() => navigate(`/boards/${board_mark}/threads/${thread_id}/edit`)} disabled={loading}>Редактировать тред</button>
                        <button type="button" className={_profiles_btn} onClick={handleThreadDeletion} disabled={loading}>Удалить тред</button>
                    </section>
                    : ''
                }

                <main className={_main}>
                    <section className={_section}>
                        <strong>{currentThread.name} ({currentThread.status === 'PUBLIC' ? 'Публичный' : 'Приватный'})</strong>
                        <p className="text-[18px]">{currentThread.description}</p>
                        <small className={`${_text_info} text-[16px]`}>Автор:{currentThread.author}</small>
                        <small className={`${_text_info} text-[16px]`}>Время создания: {currentThread.createdAt}</small>
                    </section>

                    <section className={_section}>
                        {currentThreadPosts && currentThreadPosts.length !== 0
                            ? currentThreadPosts.map(post => (
                                <div className={_card} key={post.id}>
                                    <b>{post.content}</b>
                                    <small className={_text_info}>Автор: {post.author || 'Аноним'}</small>
                                    <small className={_text_info}>Время написания: {post.createdAt}</small>
                                </div>
                            ))
                            : <p className={_text_info}>У этого треда пока нет постов.</p>
                        }
                    </section>

                    <section className={_button_cont}>
                        <button type="button" onClick={() => navigate(-1)} className={_button}>Назад</button>
                    </section>
                </main>

                <section className={_messaging_cont}>
                    <input type="text" id="message" className={_inputField} value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                    <button type="button" className={_button}>Отправить</button>
                </section>

                <Footer />
            </div>
    }
    return mainContent
}