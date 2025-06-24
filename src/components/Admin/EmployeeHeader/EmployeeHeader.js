
"use client"

import Logo from '@/src/app/favicon.ico';
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function EmployeeHeader() {

    let state = useSelector(state => state.triova)

    return (
        <div>
            <div className="flex justify-between py-3 bg-green-100 md:px-6 px-3 font-semibold">

                <div>Hello {state.decodedToken.firstName}</div>
                <div className="flex md:flex-row flex-col">
                    <Image className="md:border-r-4 px-4 border-black" src={Logo} height='100' width='100' alt="Logo" srcset="" />
                    <span className="px-4 font-semibold font-sans">Employee Panel</span>
                </div>
                <div><FontAwesomeIcon className="me-1" icon={faRightFromBracket} /> Exit</div>

            </div>
        </div>
    )
}
