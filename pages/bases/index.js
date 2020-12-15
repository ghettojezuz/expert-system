import Link from 'next/link';
import BasesList from "../../components/BasesList";

export default function BasesPage() {
    return (
        <div className="container">
            <div className="btn__wrapper">
                <Link href='/bases/new'>
                    <a className="btn btn__new-event">Новая база знаний</a>
                </Link>
            </div>

            <BasesList/>
        </div>
    )
}