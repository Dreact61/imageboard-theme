import { Link, useNavigate } from "react-router";
import { ui } from "../style-presets";


import { useState, useEffect, useSyncExternalStore } from "react";
import storeBoards from "../Stores/boardsStore";
import storeUsers from "../Stores/userStore";


export default function BoardCreateionPage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORES
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getInitialState().loading)
    const createNewBoard = storeBoards.getState().createNewBoard
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    //STATES
    const [boardName, setBoardName] = useState('')
    const [boardDesc, setBoardDesc] = useState('')
    const [boardMark, setBoardMark] = useState(boardName.slice(0,1) || '')
    const [isChecked, setIsChecked] = useState(false)
    //HANDLERS
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()


        if (!currentUser) {
            alert('Вы не можете выполнить данное действие т.к. вы не авторизованы.')
            return
        }


        if (!currentUser || !currentUser.username) return
        const data = {
            name: boardName,
            description: boardDesc || undefined,
            mark: boardMark,
            author: currentUser.username
        }


        const isExecuted = await createNewBoard(data)
        
        if (isExecuted.success) {
            alert('Доска была успешно создана!')
            navigate(`/boards/${boardMark}`)
            return
        } else {
            alert(isExecuted.msg || 'Что-то пошло не так при создании доски')
            return
        }
    }
    //RENDER
    return (
        <div className={ui.page}>
            <form className={`${ui.card} mx-auto max-w-2xl`} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                    <strong className={ui.threadTitle}>Создай собственную доску</strong>
                </section>


                <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <label htmlFor="name" className={ui.text}>Название</label>
                    <input type="text" disabled={loading} id="name" className={ui.input} value={boardName} onChange={(e) => setBoardName(e.target.value)} required />


                    <label htmlFor="desc" className={ui.text}>Описание (необязательно)</label>
                    <textarea id="desc" disabled={loading} className={`${ui.input} h-32 resize-none`} value={boardDesc} onChange={(e) => setBoardDesc(e.target.value)}  />


                    <label htmlFor="mark" className={ui.text}>Метка доски</label>
                    <input type="text" disabled={loading} id="mark" className={ui.input} value={boardMark} onChange={(e) => setBoardMark(e.target.value)} required />
                </section>  


                <section className="mb-5 flex mt-4 flex-row items-start gap-2 text-[16px]">
                    <label htmlFor="check" className={ui.text}>
                        Я ознакомлен с <Link to="/rules" className={ui.link}>Правилами пользования сайта</Link> и желаю продолжить
                    </label>
                    <input type="checkbox" disabled={loading} id="check" className="mt-1 h-5 w-5 accent-violet-500" checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} required />  
                </section>


                <section className="flex w-full items-center justify-evenly gap-4">
                    <button type="submit" disabled={loading} className={ui.button}>Создать</button>
                    <Link to='/'>
                        <button type="button" disabled={loading} className={ui.button}>Назад</button>
                    </Link>
                </section>
            </form>
        </div>
    )
}