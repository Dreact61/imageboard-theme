import Header from "../Parts/header"
import Footer from "../Parts/footer"
import { _body, _main, _text_error, _text_info, _text_loading } from "../style-presets"

import storeBoards from "../Stores/boardsStore"
import { useSyncExternalStore, useEffect } from "react"
import { useParams, useNavigate } from "react-router"

export default function BoardPage() {
    const navigate = useNavigate()
    const {board_mark} = useParams<{board_mark:string}>()

    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().loading)
    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().error)
    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    let mainContent:any
    if (loading) {
        mainContent = 
        <div className={_body}>
            <Header />
            <p className={_text_loading}>Загрузка...</p>
            <Footer />
        </div>
    } else if (error) {
        mainContent =
        <div className={_body}>
            <p className={_text_error}>Ошибка</p>
            <small className={_text_info}>Что-то пошло не так. Попробуйте перезагрузить страницу или зайти позже.</small>
        </div>
    } else if (!currentBoard) {
        mainContent = 
        <div className={_body}>
            <p className={_text_error}>Доска с такой меткой не найдена</p>
            <small className={_text_info}>Перепроверьте адрес. Возможно вы написали его с ошибкой.</small>
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