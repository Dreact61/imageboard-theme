import React, { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate, useParams, Link } from "react-router"
import storeThreads from "../Stores/threadsStore"

import { ui } from "../style-presets"
import Header from "../Parts/header"
import Footer from "../Parts/footer"
import storeUsers from "../Stores/userStore"
import storePosts from "../Stores/postsStore"
import { Post } from "../../types"

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

    const dynamicPostAddition = storeThreads.getState().dynamicPostAddition
    const dynamicPostDeletion = storeThreads.getState().dynamicPostDeletion

    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)

    const createPost = storePosts.getState().createPost
    const deletePost = storePosts.getState().deletePost
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')
    const [postContentErr, setPostContentErr] = useState('')

    const [postContent, setPostContent] = useState('')
    const [file, setFile] = useState(null)

    const [toDelete, setToDelete] = useState(false)
    const [postToDelete, setPostToDelete] = useState(false)

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
    }, [thread_id, board_mark])
    //HANDLERS
    const handleMessageSending = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!currentThread || !currentThread.id) return

        const data = {
            content: postContent,
            author: currentUser?.username || 'Аноним',
            parent: currentThread.id,
            image: file
        }

        const log = await createPost(data)

        if (!log.success) {
            setPostContentErr(log.msg || 'Непредвиденная ошибка.')
        } else {
            setPostContent('')
            dynamicPostAddition(log.data as Post)
        }

        return
    }
    useEffect(() => {
        fetchThisThread
    }, [currentThreadPosts])

    const handleThreadDeletion = async () => {
        if (toDelete) {
            if (!currentThread || !currentThread.id) return
            const threadId = currentThread.id


            const log = await deleteThread(threadId)


            if (log.success) {
                alert('Тред был успешно удален.')
                navigate(`/boards/${board_mark}`)
            } else {
                alert(log.msg || 'Что-то пошло не так при удалении треда.')
            }
        } else {
            alert('Вы уверены в том, что хотите удалить тред? (Нажмите повторно для подтверждения).')
            setToDelete(true)
        }
        return
    }

    const handlePostDeletion = async (id: any) => {
        if (postToDelete) {
            if (!id) return


            const log = await deletePost(id)


            if (log.success) {
                alert('Пост удален.')
                dynamicPostDeletion(id)
            } else {
                alert(log.msg || 'Что-то пошло не так при удалении поста.')
            }
        } else {
            alert('Вы уверены в том, что хотите удалить пост? (Нажмите повторно для подтверждения).')
            setPostToDelete(true)
        }
        return
    }

    const handleFileChange = (e:any) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        setFile(selected)
    }
    //RENDER
    let mainContent: any
    if (isFetching) {
        mainContent =
            <div className={ui.loadingPage}>
                <p className={ui.loadingText}>Загрузка...</p>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
    } else if (!currentThread || error && !isFetching) {
        mainContent =
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка {status}</p>
                <small className={ui.errorText}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>


                <p className="bg-[#30284b71] "></p>
            </div>
    } else {
        mainContent =
            <div className={ui.page}>
                <div className={ui.content}>
                    <Header />

                    {currentUser && (currentThread.author === currentUser?.username || currentUser.role === 'admin')
                        ?
                        <section className={ui.headerActions}>
                            <button type="button" className={ui.button} onClick={() => navigate(`/boards/${board_mark}/threads/${thread_id}/edit`)} disabled={loading}>Редактировать тред</button>
                            <button type="button" className={ui.deleteButton} onClick={handleThreadDeletion} disabled={loading}>Удалить тред</button>
                        </section>
                        : ''
                    }

                    <main className={ui.main}>
                        <section className={ui.threadInfo}>
                            <strong className={ui.threadTitle}>{currentThread.name} ({currentThread.status === 'PUBLIC' ? 'Публичный' : 'Приватный'})</strong>
                            <p className={ui.description}>{currentThread.description}</p>
                            <small className={ui.metadata}>Автор:{currentThread.author}</small>
                            <small className={ui.metadata}>Время создания: {currentThread.createdAt}</small>
                        </section>

                        <section className={ui.posts}>
                            {currentThreadPosts && currentThreadPosts.length !== 0
                                ? currentThreadPosts.map(post => (
                                    <div className={ui.post} key={post.id}>
                                        <h2 className={ui.author}>{post.author || 'Аноним'} - ({post.createdAt})</h2>

                                        <div className={ui.postBody}>
                                            <img className={ui.avatar} src={(post.image as string)} alt="Image" />
                                            <b className={ui.postText}>{post.content}</b>
                                        </div>
                                        {post.author === currentUser?.username || currentThread.author === currentUser?.username
                                            ? <button className={ui.deleteButton} onClick={() => handlePostDeletion(post.id)} type="button">Удалить</button>
                                            : ''
                                        }
                                    </div>
                                ))
                                : <p className={ui.empty}>У этого треда пока нет постов.</p>
                            }
                        </section>

                        <section className={ui.bottomActions}>
                            <button type="button" onClick={() => navigate(`/boards/${board_mark}`)} className={ui.button}>Назад</button>
                        </section>
                    </main>

                    <form onSubmit={(e) => handleMessageSending(e)} className={ui.composer}>
                        <div className="flex flex-col gap-2">
                            <input type="text" placeholder="Написать..." id="message" className={ui.input} value={postContent} onChange={(e) => setPostContent(e.target.value)} required />
                            <input type="file" accept="image/*" onChange={handleFileChange} className={ui.img} />
                        </div>
                        <button type="submit" className={ui.button}>Отправить</button>
                        {postContentErr && <p className={ui.error}>{postContentErr}</p>}
                    </form>

                    <Footer />
                </div>
            </div>
    }
    return mainContent
}