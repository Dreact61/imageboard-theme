import { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate, useParams } from "react-router"
import storeThreads from "../Stores/threadsStore"

import { _body, _text_loading, _text_error, _text_info, _hypertext, _main, _section, _card, _button, _button_cont, _inputField, _profiles_body } from '../style-presets'
import Header from "../Parts/header"
import Footer from "../Parts/footer"

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
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (!thread_id || !board_mark) return

        const handleAsyncParse = async () => {
            setIsFetching(true)

            const IDAsNum = Number(thread_id)
            const log = await fetchThisThread(IDAsNum)

            if (!log.success) {
                setStatus(log.status)
                setMsg(log?.msg || 'error_unknown')
            }
            setIsFetching(false)
        }
        handleAsyncParse()
    }, [fetchThisThread])
    //HANDLERS
    const handleMessageSending = async (e:any) => {
        // тут пока остановиться, в первую очередь нужно разобраться с изменением и удалением веток. Потом перейти сюда.
    }
    //RENDER
    let mainContent: any
    if (loading || isFetching) {
        mainContent =
            <div className={_body}>
                <p className={_text_loading}>Загрузка...</p>
            </div>
    } else if (!currentThread || error) {
        mainContent =
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
            </div>
    } else {
        mainContent =
            <div className={_profiles_body}>
                <Header />

                <main className={_main}>
                    <section className={_section}>
                        <strong>{currentThread.name}</strong>
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
                </main>

                <section className={_main}>
                    <input type="text" id="message" className={_inputField} />
                </section>

                <Footer />
            </div>
    }
    return mainContent
}