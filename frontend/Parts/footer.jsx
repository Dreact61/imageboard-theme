import { ui } from "../style-presets";
import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className={`${ui.card} mt-4 w-full max-w-5xl`}>
            <section className="flex w-full items-center justify-center pb-2">
                <p className={ui.accent}>D-CHAN PROJECT</p>
            </section>

            <section className="flex flex-col items-center justify-center">
                <ul className={ui.footerLinks}>
                    <li>• <Link to="/" className={ui.link}>Главная страница</Link></li>
                    <li>• <Link to="/register" className={ui.link}>Регистрация аккаунта</Link></li>
                    <li>• <Link to="/my-profile" className={ui.link}>Мой профиль</Link></li>
                    <li>• <Link to="/boards/create" className={ui.link}>Создайте собственную доску</Link></li>

                    <li>• <Link to="/rules" className={ui.link}>Правила пользования сайта</Link></li>
                    <li>• <Link to="/login" className={ui.link}>Вход в аккаунт</Link></li>
                    <li>• <Link to="/my-profile/edit" className={ui.link}>Редактировать профиль</Link></li>
                </ul>
            </section>

            <section className={`${ui.muted} mt-4 text-center text-text-muted`}>
                (Здесь ссылки на соцсети проекта и пр.)
            </section>
        </footer>
    )
}