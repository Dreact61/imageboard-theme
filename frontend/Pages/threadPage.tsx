import React, { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate, useParams, Link } from "react-router"
import storeThreads from "../Stores/threadsStore"

import { _body, _text_loading, _text_error, _text_info, _hypertext, _main, _section, _card, _button, _button_cont, _inputField, _profiles_body, _messaging_cont, _profiles_btn, _profiles_btn_cont, _container, _borders, _form_items_grid, _selectCard } from '../style-presets'
import Header from "../Parts/header"
import Footer from "../Parts/footer"
import storeUsers from "../Stores/userStore"
import storePosts from "../Stores/postsStore"

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
    
    const createPost = storePosts.getState().createPost
    const deletePost = storePosts.getState().deletePost
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')

    const [postContent, setPostContent] = useState('')
    const [postContentErr, setPostContentErr] = useState('')
    
    const [toDelete, setToDelete] = useState(false)
    const [postToDelete, setPostToDelete] = useState(false)

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
    const handleMessageSending = async (e:React.SubmitEvent) => {
        e.preventDefault()
        if (!currentThread || !currentThread.id) return
        
        const data = {
            content: postContent,
            author: currentUser?.username || 'Аноним',
            parent: currentThread.id
        }

        const log = await createPost(data)
        
        if (!log.success) {
            setPostContentErr(log.msg || 'Непредвиденная ошибка.')
        } else {
            setPostContent('')
        }

        return
    }

    const handleThreadDeletion = async () => {
        if (toDelete) {
            if (!currentThread || !currentThread.id) return
            const threadId = currentThread.id

            const log = await deleteThread(threadId)

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

    const handlePostDeletion = async (id:any) => {
        if (postToDelete) {
            if (!id) return

            const log = await deletePost(id)

            if (log.success) {
                alert('Пост удален.')
            } else {
                alert(log.msg || 'Что-то пошло не так при удалении поста.')
            }
        } else {
            alert('Вы уверены в том, что хотите удалить пост? (Нажмите повторно для подтверждения).')
            setPostToDelete(true)
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
                
                <p className="bg-[#30284b71] "></p>
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

                    <section className={`${_section} gap-4 px-2`}>
                        {currentThreadPosts && currentThreadPosts.length !== 0
                            ? currentThreadPosts.map(post => (
                                <div className={`${_card} text-[16px]`} key={post.id}>
                                    <b className="text-left">{post.content}</b>
                                    <small className={_text_info}>Автор: {post.author || 'Аноним'}</small>
                                    <small className={_text_info}>Время написания: {post.createdAt}</small>
                                    {post.author === currentUser?.username || currentThread.author === currentUser?.username
                                        ? <button className={`${_profiles_btn} mt-2 text-center`} onClick={() => handlePostDeletion(post.id)} type="button">Удалить</button>
                                        :  ''
                                    }
                                </div>
                            ))
                            : <p className={_text_info}>У этого треда пока нет постов.</p>
                        }
                    </section>

                    <section className={_button_cont}>
                        <button type="button" onClick={() => navigate(-1)} className={_button}>Назад</button>
                    </section>
                </main>

                <form onSubmit={(e) => handleMessageSending(e)} className={_messaging_cont}>
                    <input type="text" id="message" className={_inputField} value={postContent} onChange={(e) => setPostContent(e.target.value)} required />
                    <button type="submit" className={_button}>Отправить</button>
                    {postContentErr && <p className={_text_error}>{postContentErr}</p>}
                </form>

                <Footer />
            </div>
    }
    return mainContent
}