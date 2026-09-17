import { _body, _main, _section, _inputField, _textareaField, _hypertext, _button, _button_cont, _form_items_grid, _text_info } from "../style-presets";
import storeUsers from "../Stores/userStore";

import { Link, useNavigate } from "react-router";
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
    const handleFormSubmit = async (e:React.SubmitEvent) => {
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
        <div className={_body}>
            <form className={_main} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={_section}>
                    <strong>Регистрация</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="username">Имя Пользователя</label>
                    <input type="text" disabled={loading} id="username" className={_inputField} required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="desc">Описание (необязательно)</label>
                    <input type="text" disabled={loading} id="desc" className={_textareaField} value={userDesc} onChange={(e) => setUserDesc(e.target.value)} />
                    <label htmlFor="password">Пароль</label>
                    <input type="password" minLength={6} disabled={loading} id="password" className={_inputField} required value={userPass} onChange={(e) => setUserPass(e.target.value)} />
                </section>

                <section className={`text-[16px] flex flex-row text-nowrap mb-5 gap-2`}>
                    <label htmlFor="check">
                        Я ознакомлен с <Link to="/rules" className={_hypertext}>Правилами пользования сайта</Link> и желаю продолжить
                    </label>
                    <input type="checkbox" disabled={loading} id="check" className={_inputField} checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} required />  
                </section>

                <section className={_button_cont}>
                    <button type="submit" disabled={loading} className={_button}>Продолжить</button>
                    <Link to='/'>
                    <button type="button" disabled={loading} className={_button}>Назад</button>
                    </Link>
                </section>

                <p className={`${_text_info} mt-5`}>Уже зарегистрированы? <Link to="/login" className={_hypertext}>Войти</Link></p>
            </form>
        </div>
    )
}