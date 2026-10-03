import { ui } from "../style-presets"
import { Link, useNavigate } from "react-router"


import storeUsers from "../Stores/userStore"
import { useSyncExternalStore, useState } from "react"


export default function LoginPage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORE
    const loading = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getInitialState().loading)
    const login = storeUsers.getState().login
    //STATES
    const [userName, setUserName] = useState('')
    const [userPass, setUserPass] = useState('')
    //HANDLER
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()


        const isExecuted = await login(userName, userPass)


        if (isExecuted.success) {
            alert(`Вы успешно вошли под именем ${userName}!`)
            navigate("/")
        } else {
            alert(isExecuted.msg || 'Что-то пошло не так при попытке входа в аккаунт')
        }
        return
    }
    //RENDER
    return (
        <div className={ui.page}>
            <form className={`${ui.card} mx-auto max-w-2xl`} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                    <strong className={ui.threadTitle}>Вход</strong>
                </section>


                <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <label htmlFor="name" className={ui.text}>Имя Пользователя</label>
                    <input type="text" id="name" className={ui.input} required disabled={loading} value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="password" className={ui.text}>Пароль</label>
                    <input type="password" id="password" className={ui.input} required disabled={loading} value={userPass} onChange={(e) => setUserPass(e.target.value)} />
                </section>


                <section className="mt-5 flex w-full items-center justify-evenly gap-4">
                    <button type="submit" className={ui.button}>Войти</button>
                    <Link to="/">
                        <button type="button" className={ui.button}>Назад</button>
                    </Link>
                </section>
            </form>
        </div>
    )
}