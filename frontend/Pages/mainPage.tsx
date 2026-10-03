import Header from '../Parts/header'
import Footer from '../Parts/footer'
import { ui } from '../style-presets'


import storeBoards from '../Stores/boardsStore'


import { useSyncExternalStore, useEffect } from 'react'
import { Link } from 'react-router'


export default function MainPage() {
    const allBoards = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().allBoards, () => [])
    const fetchAllBoards = storeBoards.getState().fetchAllBoards


    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().error, () => null)
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().loading, () => false)


    useEffect(() => {
        const handleAsyncParse = async () => {
            if (allBoards.length === 0) await fetchAllBoards()
        }
        handleAsyncParse()
    }, [])


    let mainContent: any
    if (loading) {
        mainContent =
            <div className={ui.page}>
                <div className={ui.content}>
                    <Header />
                    <p className={ui.loadingText}>Загрузка...</p>
                    <Footer />
                </div>
            </div>
    } else if (error) {
        mainContent =
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка</p>
                <small className={ui.errorText}>Что-то пошло не так. Попробуйте перезагрузить страницу или зайти позже.</small>
            </div>
    } else {
        mainContent =
            <div className={ui.page}>
                <div className={ui.content}>
                    <Header />


                    <main className={`${ui.main} mt-5`}>
                        <section className={ui.threadInfo}>
                            <h2 className={ui.threadTitle}>Доступные доски</h2>
                        </section>

                        <div className={ui.posts}>
                            {allBoards && allBoards.length > 0
                                ? allBoards.map(board => (
                                    <div key={board.id} className={ui.card}>
                                        <strong className={ui.author}>
                                            <Link className={ui.link} to={`boards/${board.mark}`}>{board.name}</Link> - (/{board.mark}/)
                                        </strong>
                                        <i className={ui.description}>{board.description ? board.description : 'Нет описания.'}</i>
                                        <small className={ui.metadata}>Автор: {board.author}</small>
                                        <small className={ui.metadata}>Создано {board.createdAt?.toLocaleString()}</small>
                                    </div>
                                ))
                                : <p className={ui.empty}>Досок пока нет.</p>
                            }
                        </div>


                        <div className={ui.bottomActions}>
                            <Link to="/boards/create">
                                <button type="button" className={ui.button}>Создать Доску</button>
                            </Link>
                        </div>
                    </main>


                    <Footer />
                </div>
            </div>
    }

    return mainContent
}