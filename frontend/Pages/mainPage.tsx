import Header from '../Parts/header'
import Footer from '../Parts/footer'

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

    return (
        <div>
            <Header />

            <main className='flex flex-col justify-center items-center m-auto p-2 border w-1/2 mt-5'>
                <h2>Доступные доски</h2>
                
                <div className='flex flex-col border p-2 px-2 m-2 w-full'>
                    {allBoards && allBoards.length > 0
                    ? allBoards.map(board => (
                        <div>
                            <strong>{board.name} - ({board.mark})</strong>
                            <p>{board.description}</p>
                            <small>Автор: {board.author}</small>
                            <small>Создано {board.createdAt?.toLocaleString()}</small>
                        </div>
                    ))
                    : <p className='text-center text-[#3e3e3e]'>Досок пока нет.</p>
                    }
                </div>
            </main>

            <Footer />
        </div>
    )
}