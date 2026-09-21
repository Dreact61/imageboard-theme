import Header from "../Parts/header"
import Footer from "../Parts/footer"
import { _body, _main, _text_error, _text_info, _text_loading } from "../style-presets"

import storeBoards from "../Stores/boardsStore"
import { useSyncExternalStore, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"

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

            <section className={_main}>
                <strong>{currentBoard.name} ({currentBoard.mark})</strong>
                <p>{currentBoard.description}</p>
                <small>Создано {currentBoard.author} в {currentBoard.createdAt}</small>   
            </section>
            <Footer />
        </div>
    }
    return mainContent
}

// НЕДОПИСАНО