import { useSyncExternalStore, useState, useEffect } from "react"
import storeThreads from "../Stores/threadsStore"
import storeUsers from "../Stores/userStore"
import { useNavigate, useParams, Link } from "react-router"
import { ui } from "../style-presets"


export default function ThreadCreationPage() {
    //NAVIGATION
    const navigate = useNavigate()
    const { board_mark } = useParams<{ board_mark: string }>()
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
    const handleFormSubmit = async (e: React.SubmitEvent) => {
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
        <div className={ui.page}>
            <form className={`${ui.card} mx-auto max-w-2xl`} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                    <strong className={ui.threadTitle}>Создай собственный тред</strong>
                </section>


                <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <label htmlFor="name" className={ui.text}>Название</label>
                    <input type="text" disabled={loading} id="name" className={ui.input} value={threadName} onChange={(e) => setThreadName(e.target.value)} required />


                    <label htmlFor="desc" className={ui.text}>Описание (необязательно)</label>
                    <textarea id="desc" disabled={loading} className={`${ui.input} h-32 resize-none`} value={threadDesc} onChange={(e) => setThreadDesc(e.target.value)} />


                    <label htmlFor="status" className={ui.text}>Статус треда</label>
                    <select id="status" className={`${ui.card} w-full cursor-pointer bg-surface text-text-main`} value={threadStatus} disabled={loading} onChange={(e) => setThreadStatus(e.target.value)}>
                        <option value="PUBLIC">Публичный</option>
                        <option value="PRIVATE">Приватный</option>
                    </select>
                    {threadStatus === 'PRIVATE'
                        ?
                        <>
                            <label htmlFor="pass" className={ui.text}>Пароль</label>
                            <input type="text" minLength={6} disabled={loading} id="pass" className={ui.input} value={threadPass} onChange={(e) => setThreadPass(e.target.value)} required={threadStatus === 'PRIVATE'} />
                        </>
                        : ''
                    }
                </section>


                <section className="mb-5 flex flex-row items-start gap-2 text-[16px]">
                    <label htmlFor="check" className={ui.text}>
                        Я ознакомлен с <Link to="/rules" className={ui.link}>Правилами пользования сайта</Link> и желаю продолжить
                    </label>
                    <input type="checkbox" disabled={loading} id="check" className="mt-1 h-5 w-5 accent-violet-500" checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} required />
                </section>


                <section className="flex w-full items-center justify-evenly gap-4">
                    <button type="submit" disabled={loading} className={ui.button}>Создать</button>
                    <Link to={`/boards/${board_mark}`}>
                        <button type="button" disabled={loading} className={ui.button}>Назад</button>
                    </Link>
                </section>
            </form>
        </div>
    )
}