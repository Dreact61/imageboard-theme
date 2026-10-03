import { ui } from "../style-presets";
import { Link, useNavigate } from "react-router";
import storeUsers from "../Stores/userStore";
import { useState, useSyncExternalStore } from "react";


export default function RegisterPage() {
    //NAVIAGTION
    const navigate = useNavigate()
    //STORE
    const loading = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getInitialState().loading)
    const register = storeUsers.getState().register
    //STATES
    const [userName, setUserName] = useState('')
    const [userDesc, setUserDesc] = useState('')
    const [userPass, setUserPass] = useState('')
    const [isChecked, setIsChecked] = useState(false)
    //HANDLERS
    const handleFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()


        const data = {
            username: userName,
            description: userDesc,
            password: userPass
        }


        const isExecuted = await register(data)


        if (isExecuted.success) {
            alert('Ваш профиль успешно зарегистрирован!')
            navigate('/login')
            return
        } else {
            alert(isExecuted.msg || 'Что-то пошло не так при создании аккаунта')
            return
        }
    }
    //RENDER
    return (
        <div className={ui.page}>
            <form className={`${ui.card} mx-auto max-w-2xl`} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                    <strong className={ui.threadTitle}>Регистрация</strong>
                </section>


                <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <label htmlFor="username" className={ui.text}>Имя Пользователя</label>
                    <input type="text" disabled={loading} id="username" className={ui.input} required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="desc" className={ui.text}>Описание (необязательно)</label>
                    <input type="text" disabled={loading} id="desc" className={`${ui.input} h-32 resize-none`} value={userDesc} onChange={(e) => setUserDesc(e.target.value)} />
                    <label htmlFor="password" className={ui.text}>Пароль</label>
                    <input type="password" minLength={6} disabled={loading} id="password" className={ui.input} required value={userPass} onChange={(e) => setUserPass(e.target.value)} />
                </section>


                <section className="mb-5 flex flex-row items-start gap-2 text-[16px]">
                    <label htmlFor="check" className={ui.text}>
                        Я ознакомлен с <Link to="/rules" className={ui.link}>Правилами пользования сайта</Link> и желаю продолжить
                    </label>
                    <input type="checkbox" disabled={loading} id="check" className="mt-1 h-5 w-5 accent-violet-500" checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} required />
                </section>


                <section className="flex w-full items-center justify-evenly gap-4">
                    <button type="submit" disabled={loading} className={ui.button}>Продолжить</button>
                    <Link to='/'>
                        <button type="button" disabled={loading} className={ui.button}>Назад</button>
                    </Link>
                </section>


                <p className={`${ui.metadata} mt-5 text-center`}>
                    Уже зарегистрированы? <Link to="/login" className={ui.link}>Войти</Link>
                </p>
            </form>
        </div>
    )
}