import { useNavigate, useParams, Link } from "react-router"
import { _body, _main, _profiles_body, _text_info, _text_error, _text_loading, _hypertext } from "../style-presets"
import { useEffect, useState, useSyncExternalStore } from "react"
import storeThreads from "../Stores/threadsStore"

export default function EditThreadPage() {
    //NAVIGATION & PARAMS
    const navigate = useNavigate()
    const {board_mark, thread_id} = useParams<{board_mark:string, thread_id:string}>()
    //STORE
    const loading = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().loading, () => false)
    const error = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().error, () => null)
    const currentThread = useSyncExternalStore(storeThreads.subscribe, () => storeThreads.getState().currentThread, () => null)
    const fetchThisThread = storeThreads.getState().fetchThisThread
    const editThread = storeThreads.getState().editThread
    //STATES
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')
    const [isFetching, setIsFetching] = useState(true)
    
    const [threadName, setThreadName] = useState('')
    const [threadDesc, setThreadDesc] = useState('')
    const [threadStatus, setThreadStatus] = useState('')
    
    useEffect(() => {
        if (!board_mark || !thread_id) return
        
        const handleAsyncParse = async () => {
            setIsFetching(true)
            const IDAsNum = Number(thread_id)
            if (!currentThread || currentThread.id !== IDAsNum) {
                const log = await fetchThisThread(IDAsNum)
                
                if (!log.success || !log.data) {
                    setStatus(log.status)
                    setMsg(log.msg || error || 'error_unknown')
                }
            }
            setIsFetching(false)
        }
        handleAsyncParse()
    }, [thread_id, fetchThisThread])
    
    useEffect(() => {
        if (currentThread) {
            setThreadName(currentThread.name || '')
            setThreadDesc(currentThread.description || '')
            setThreadStatus(currentThread.status || 'PUBLIC')
        }
    }, [currentThread])
    //HANDLERS
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()

        const data = {
            name: threadName,
            description: threadDesc,
            status: threadStatus
        }
        const log = await editThread(Number(thread_id), data)
        
        if (log.success) {
            alert('Тред был успешно отредактирован!')
            navigate(-1)
        } else {
            alert(log.msg || 'Что-то пошло не так при редактировании треда.')
        }
        return
    }
    //RENDER
    if (isFetching) {
        <div className={_body}>
            <p className={_text_loading}>Загрузка...</p>
            <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
        </div>
    }

    if (error || !currentThread || !thread_id) {
       return (
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    }
    return (
        <div className={_profiles_body}>
            <form onSubmit={(e) => handleFormSubmit(e)} className={_main}>
                // -- позже надо будет проверить, может ли сюда попасть кто-то помимо админов, владельца борды и самого треда. -- //
                // -- таким же способом надо будет проверить а сами доски, а также не забыть ввести проверки на статус тредов перед входом на них. -- //
            </form>
        </div>
    )
}