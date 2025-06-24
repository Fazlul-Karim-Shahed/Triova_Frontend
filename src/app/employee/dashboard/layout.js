

"use client"

import { faBookOpenReader, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";


export default function Employeelayout({ children }) {

    const [open, setOpen] = useState(false)

    return (
        <div>
            <div>

                <div className='md:hidden top-1 mx-3'>
                    <br />
                    <div className='md:hidden px-2'>
                        <span onClick={() => setOpen(!open)} className=' text-green-800 border border-green-800 p-2 cursor-pointer rounded'>
                            <FontAwesomeIcon className='fas fa-2xl' icon={open ? faCaretUp : faCaretDown} />

                        </span>
                    </div>

                    {/* Small screen Links */}

                    <div className={`m-2 py-4  bg-green-100 rounded-lg text-green-800 ${open ? 'block' : 'hidden'}`}>
                        <Link onClick={() => setOpen(!open)} href='/employee/dashboard/product' className='block m-4 hover:underline'> <FontAwesomeIcon icon={faBookOpenReader} className='fas fa-lg me-4 text-green-800' />Student</Link>

                    </div>
                </div>




                <div className='grid grid-cols-12 gap-5'>

                    {/* Large screen links */}

                    <div className='col-span-2 px-3 py-4 bg-green-100 rounde-e-md hidden md:block'>
                        <Link href='/employee/dashboard/product' className='block m-4 hover:underline'> <FontAwesomeIcon icon={faBookOpenReader} className='fas fa-lg me-4 text-green-800' />Product</Link>
                    </div>

                    <div className='col-span-12 md:col-span-10 mx-0'> {children} </div>

                </div>

            </div>
        </div>
    )
}
