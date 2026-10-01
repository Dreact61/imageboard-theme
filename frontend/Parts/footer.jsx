import { ui } from "../style-presets";


export default function Footer() {
    return (
        <footer className={`${ui.card} mt-4 w-full max-w-5xl`}>
            <section className="flex w-full items-center justify-center pb-2">
                <p className={ui.accent}>FOOTER EXAMPLE</p>
            </section>

            <section className="flex flex-col items-center justify-center">
                <ul className="grid w-full grid-cols-2 gap-2 text-center text-sm text-text-muted sm:grid-cols-4">
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

            <section className="mt-4 text-center text-text-muted">
                links
            </section>
        </footer>
    )
}