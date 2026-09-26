import { useSyncExternalStore, useState, useEffect } from "react"
import storeThreads from "../Stores/threadsStore"
import storeUsers from "../Stores/userStore"
import { useNavigate, useParams, Link } from "react-router"
import { _body, _main, _section, _form_items_grid, _inputField, _textareaField, _hypertext, _button, _button_cont, _card, _selectCard } from "../style-presets"

export default function ThreadCreationPage() {
    //NAVIGATION
    const navigate = useNavigate()
    const {board_mark} = useParams<{board_mark:string}>()
    //STORE
    const loading = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().loading, () => false)
    const createNewThread = storeThreads.getState().createNewThread
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null) 
    //STATES
    const [threadName, setThreadName] = useState('')
    const [threadDesc, setThreadDesc] = useState('')
    const [threadStatus, setThreadStatus] = useState('PUBLIC')
    const [threadPass, setThreadPass] = useState('')
    const [isChecked, setIsChecked] = useState(false)
    //HANDLERS
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()
        if (!threadName || !board_mark) return
        if (!currentUser || !currentUser.username) {
            alert('Вы не можете выполнить это действие, т.к. вы не авторизованы.')
            return
        }

        const data = {
            name: threadName,
            description: threadDesc,
            parent: board_mark,
            status: threadStatus,
            author: currentUser.username,
            password: threadPass
        }
        const log = await createNewThread(data)

        if (log.success) {
            alert('Тред был создан успешно!')
            navigate(`/boards/${board_mark}/threads/${log.id}`)
            return
        } else {
            alert(log.msg || 'Что-то пошло не так при создании треда')
            return
        }
    }
    //RENDER

    return (
        <div className={_body}>
            <form className={_main} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={_section}>
                    <strong>Создай собственный тред</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="name">Название</label>
                    <input type="text" disabled={loading} id="name" className={_inputField} value={threadName} onChange={(e) => setThreadName(e.target.value)} required />

                    <label htmlFor="desc">Описание (необязательно)</label>
                    <textarea id="desc" disabled={loading} className={_textareaField} value={threadDesc} onChange={(e) => setThreadDesc(e.target.value)}  />

                    <label htmlFor="status">Статус треда</label>
                    <select id="status" className={_selectCard} value={threadStatus} disabled={loading} onChange={(e) => setThreadStatus(e.target.value)}>
                        <option value="PUBLIC">Публичный</option>
                        <option value="PRIVATE">Приватный</option>
                    </select>
                    {threadStatus === 'PRIVATE'
                    ?
                    <>
                    <label htmlFor="pass">Пароль</label>
                    <input type="text" minLength={6} disabled={loading} id="pass" className={_inputField} value={threadPass} onChange={(e) => setThreadPass(e.target.value)} required={threadStatus === 'PRIVATE'} />
                    </>
                    : ''
                    }
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