

import Link from 'next/link'

export default function Admin() {
    return (
        <div style={{ top: "45%", }} className='absolute text-center w-screen text-2xl font-semibold'>
            Welcome to Admin Panel

            <div className='text-center mt-5'>
                <Link className='btn btn-success' href='/admin/dashboard'>Visit Dashboard</Link>
            </div>
        </div>
    )
}
