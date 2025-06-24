

import Link from 'next/link'

export default function Employee() {
    return (
        <div style={{ top: "45%", }} className='absolute text-center w-screen text-2xl font-semibold'>
            Welcome to Employee Panel

            <div className='text-center mt-5'>
                <Link className='btn btn-success' href='/employee/dashboard'>Visit Dashboard</Link>
            </div>
        </div>
    )
}