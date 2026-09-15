import Header from '../Parts/header'
import Footer from '../Parts/footer'
import { _body, _borders, _button, _button_cont, _card, _container, _text_error, _text_info, _text_loading } from '../style-presets'

import storeBoards from '../Stores/boardsStore'

import { useSyncExternalStore, useEffect } from 'react'

export default function MainPage() {
    const allBoards = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().allBoards, () => [])
    const fetchAllBoards = storeBoards.getState().fetchAllBoards

    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().error, () => null)
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().loading, () => false)

    useEffect(() => {
        if (allBoards.length === 0) fetchAllBoards()
    }, [allBoards.length, fetchAllBoards])

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
    } else {
        mainContent = 
        <div className={_body}>
            <Header />

            <main className={`flex flex-col justify-center items-center m-auto p-2 border w-1/2 mt-5 ${_borders}`}>
                <h2>Доступные доски</h2>
                
                <div className={_container}>
                    {allBoards && allBoards.length > 0
                    ? allBoards.map(board => (
                        <div className={_card}>
                            <strong>{board.name} - ({board.mark})</strong>
                            <p>{board.description}</p>
                            <small>Автор: {board.author}</small>
                            <small>Создано {board.createdAt?.toLocaleString()}</small>
                        </div>
                    ))
                    : <p className={_text_info}>Досок пока нет.</p>
                    }
                </div>

                <div className={_button_cont}>
                    <button type="button" className={_button}>Создать Доску</button>
                </div>
            </main>

            <Footer />
        </div>
    }

    return mainContent
}