"use client";

import Logo from "@/public/Logo_Trans.svg";
import { formatRole } from "@/src/functions/CustomFunction";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function AdminHeader() {

    const store = useSelector((store) => store.triova);

    return (
        <div className="">
            <div className="grid grid-cols-12 items-center py-2 px-4 md:px-8 bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-md rounded-b-3xl">
                {/* Logo & Title */}
                <div className="col-span-8 flex items-center gap-3">
                    <div className=" overflow-hidden shadow-sm  bg-white">
                        <Image src={Logo} alt="Logo" width={60} height={50} className="mt-1 bg-brand-500 p-1" />
                    </div>
                    <span className="text-xl font-bold text-emerald-800 font-sans">{formatRole(store.decodedToken.role)} Panel</span>
                </div>

                {/* Exit Button */}
                <div className="col-span-4 text-end">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-emerald-700 hover:text-white hover:bg-emerald-500 border border-emerald-500 px-4 py-2 rounded-xl transition font-semibold"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Exit
                    </Link>
                </div>
            </div>
        </div>
    );
}
