"use client";

import Logo from "@/public/Logo.svg";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function SuperAdminHeader() {
    return (
        <div className="">
            <div className="grid grid-cols-2 items-center py-2 px-4 md:px-8 bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-md rounded-b-3xl">
                {/* Logo & Title */}
                <div className="flex items-center gap-4">
                    <div className="rounded-xl overflow-hidden shadow-sm border border-emerald-200 bg-white p-1">
                        <Image src={Logo} alt="Logo" width={90} height={50} className="rounded" />
                    </div>
                    <span className="text-xl font-bold text-emerald-800 font-sans">Super Admin Panel</span>
                </div>

                {/* Exit Button */}
                <div className="text-end">
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
