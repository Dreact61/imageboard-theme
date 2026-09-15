import { _footer, _list_grid } from "../style-presets";

export default function Footer() {
    return (
        <footer className={_footer}>
            <section className="flex flex-row justify-center w-full items-between pb-2">
                <p>FOOTER EXAMPLE</p>
            </section>
            <section className="flex flex-col justify-center items-center">
                <ul className={_list_grid}>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                    <li>• list</li>
                </ul>
            </section>
            <section>
                links
            </section>
        </footer>
    )
}