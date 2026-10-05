import Header from "../Parts/header"
import Footer from "../Parts/footer"
import { ui } from "../style-presets"


import storeBoards from "../Stores/boardsStore"
import { useSyncExternalStore, useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import storeUsers from "../Stores/userStore"


export default function BoardPage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const { board_mark } = useParams<{ board_mark: string }>()
    //STORE
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().loading)
    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().error)
    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    const currentBoardThreads = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoardThreads, () => null)
    const fetchThisBoard = storeBoards.getState().fetchThisBoard
    const deleteBoard = storeBoards.getState().deleteBoard


    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')


    const [toDelete, setToDelete] = useState(false)


    useEffect(() => {
        if (!board_mark) return


        const handleAsyncParse = async () => {
            setIsFetching(true)


            const log = await fetchThisBoard(board_mark)


            if (!log.success) {
                setStatus(log.status)
                setMsg(log?.msg || 'error_unknown')
            }
            setIsFetching(false)
        }
        handleAsyncParse()
    }, [fetchThisBoard])
    //HANDLERS
    const handleBoardDeletion = async () => {
        if (toDelete) {
            if (!currentBoard || !currentBoard.id) return
            const boardId = currentBoard.id


            const log = await deleteBoard(boardId)


            if (log.success) {
                alert('Доска была успешно удалена.')
                navigate('/')
            } else {
                alert(log.msg || 'Что-то пошло не так при удалении доски.')
            }
        } else {
            alert('Вы уверены в том, что хотите удалить доску? (Нажмите повторно для подтверждения).')
            setToDelete(true)
        }
        return
    }
    //RENDER
    let mainContent: any
    if (loading || isFetching) {
        mainContent =
            <div className={ui.loadingPage}>
                <p className={ui.loadingText}>Загрузка...</p>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
    } else if (!currentBoard || error) {
        mainContent =
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка {status}</p>
                <small className={ui.errorText}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
    } else {
        mainContent =
            <div className={ui.page}>
                <div className={ui.content}>
                    <Header />


                    <main className={ui.main}>
                        <section className={ui.threadInfo}>
                            <strong className={ui.threadTitle}>{currentBoard.name} ({currentBoard.mark})</strong>
                            <p className={ui.description}>{currentBoard.description}</p>
                            <small className={ui.metadata}>Автор: {currentBoard.author}</small>
                            <small className={ui.metadata}>Время создания: {currentBoard.createdAt}</small>
                        </section>


                        <section className={`${ui.posts} border-t-2 border-border/50`}>
                            <strong className={`${ui.text} w-full border-b-2 border-border/50 pb-3 text-center`}>Треды доски</strong>
                            {currentBoardThreads && currentBoardThreads.length !== 0
                                ? currentBoardThreads.map(thread => (
                                    <div className={ui.card} key={thread.id}>
                                        <strong className={ui.author}>
                                            <Link className={ui.link} to={
                                                thread.status === 'PUBLIC' 
                                                ? `/boards/${board_mark}/threads/${thread.id}`
                                                : (currentUser?.username === thread.author 
                                                    ? `/boards/${board_mark}/threads/${thread.id}`
                                                    : `/boards/${board_mark}/threads/${thread.id}/password`)}>{thread.name} ({thread.status === 'PUBLIC' ? 'Публичный' : 'Приватный'})</Link>
                                        </strong>
                                        <i className={ui.description}>{thread.description ? thread.description : 'Нет описания.'}</i>
                                        <small className={ui.metadata}>Автор: {thread.author || 'Аноним'}</small>
                                        <small className={ui.metadata}>Создано {thread.createdAt}</small>
                                    </div>
                                ))
                                : <p className={ui.empty}>У этой доски пока нет тредов.</p>
                            }
                        </section>


                        <section className={`${ui.bottomActions} gap-4`}>
                            <button type="button" onClick={() => navigate(`/boards/${board_mark}/threads/create`)} className={ui.button}>Создать тред</button>
                            <button type="button" onClick={() => navigate('/')} className={ui.button}>Назад</button>
                        </section>


                    </main>


                    {currentUser && (currentUser.username === currentBoard.author || currentUser.role === 'admin')
                        ?
                        <section className={ui.headerActions}>
                            <button type="button" onClick={() => navigate(`/boards/${board_mark}/edit`)} className={ui.button}>Редактировать Доску</button>
                            <button type="button" onClick={handleBoardDeletion} className={ui.deleteButton}>Удалить Доску</button>
                        </section>
                        : ''
                    }



                    <Footer />
                </div>
            </div>
    }
    return mainContent
}
