import Header from "../Parts/header"
import Footer from "../Parts/footer"
import { _body, _button, _button_cont, _card, _main, _section, _text_error, _text_info, _text_loading } from "../style-presets"

import storeBoards from "../Stores/boardsStore"
import { useSyncExternalStore, useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"

export default function BoardPage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const {board_mark} = useParams<{board_mark:string}>()
    //STORE
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().loading)
    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().error)
    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    const currentBoardThreads = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoardThreads, () => null)
    const fetchThisBoard = storeBoards.getState().fetchThisBoard
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')

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
    //RENDER
    let mainContent:any
    if (loading || isFetching) {
        mainContent = 
        <div className={_body}>
            <p className={_text_loading}>Загрузка...</p>
        </div>
    } else if (!currentBoard || error) {
        mainContent = 
        <div className={_body}>
            <p className={_text_error}>Ошибка {status}</p>
            <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
        </div>
    } else {
        mainContent = 
        <div className={_body}>
            <Header />

            <main className={_main}>
                <section className={_section}>
                    <strong>{currentBoard.name} ({currentBoard.mark})</strong>
                    <p className="text-[18px]">{currentBoard.description}</p>
                    <small className={`${_text_info} text-[16px]`}>Автор:{currentBoard.author}</small>
                    <small className={`${_text_info} text-[16px]`}>Время создания: {currentBoard.createdAt}</small>   
                </section>

                <section className={_section}>
                    <strong className="text-center border-2-b w-full">Треды доски</strong>
                    {currentBoardThreads && currentBoardThreads.length !== 0
                    ? currentBoardThreads.map(thread => (
                        <div className={_card} key={thread.id}>
                            <strong><Link to={`boards/${board_mark}/threads/${thread.id}`}>{thread.name}</Link></strong>
                            <i>{thread.description ? thread.description : 'Нет описания.'}</i>
                            <small className={_text_info}>Автор: {thread.author || 'Аноним'}</small>
                            <small className={_text_info}>Создано {thread.createdAt}</small>
                        </div>
                    ))
                    : <p className={_text_info}>У этой доски пока нет тредов.</p>
                    }
                </section>

                <section className={_button_cont}>
                    <button type="button" onClick={() => navigate(`/boards/${board_mark}/threads/create`)} className={_button}>Создать тред</button>
                    <button type="button" onClick={() => navigate('/')} className={_button}>Назад</button>
                </section>
            </main>
            <Footer />
        </div>
    }
    return mainContent
}

// НЕДОПИСАНО