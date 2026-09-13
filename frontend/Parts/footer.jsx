export default function Footer() {
    return (
        <footer className="flex flex-col border-2 w-full m-auto mt-4 p-2">
            <section className="flex flex-row justify-center w-full items-between pb-2">
                <p>FOOTER EXAMPLE</p>
            </section>
            <section className="flex flex-col justify-center items-center">
                <ul className="grid grid-cols-2 gap-10 border-t pt-2 border-b pb-2 w-full text-center">
                    <li>list</li>
                    <li>list</li>
                </ul>
            </section>
            <section>
                links
            </section>
        </footer>
    )
}