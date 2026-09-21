import { Link, useNavigate } from "react-router";
import { _body, _main, _button, _button_cont, _section, _form_items_grid, _inputField, _textareaField, _hypertext } from "../style-presets";

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
        <div className={_body}>
            <form className={_main} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={_section}>
                    <strong>Создай собственную доску</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="name">Название</label>
                    <input type="text" disabled={loading} id="name" className={_inputField} value={boardName} onChange={(e) => setBoardName(e.target.value)} required />

                    <label htmlFor="desc">Описание (необязательно)</label>
                    <textarea id="desc" disabled={loading} className={_textareaField} value={boardDesc} onChange={(e) => setBoardDesc(e.target.value)}  />

                    <label htmlFor="mark">Метка доски</label>
                    <input type="text" disabled={loading} id="mark" className={_inputField} value={boardMark} onChange={(e) => setBoardMark(e.target.value)} required />
                </section>  

                <section className={`text-[16px] flex flex-row text-nowrap mb-5 gap-2`}>
                    <label htmlFor="check">
                        Я ознакомлен с <Link to="/rules" className={_hypertext}>Правилами пользования сайта</Link> и желаю продолжить
                    </label>
                    <input type="checkbox" disabled={loading} id="check" className={_inputField} checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} required />  
                </section>

                <section className={_button_cont}>
                    <button type="submit" disabled={loading} className={_button}>Создать</button>
                    <Link to='/'>
                    <button type="button" disabled={loading} className={_button}>Назад</button>
                    </Link>
                </section>
            </form>
        </div>
    )
}