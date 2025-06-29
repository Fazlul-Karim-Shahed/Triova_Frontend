"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {

        const ref = searchParams.get("ref");
       
        if (ref) {

            Cookies.set("triova_ref", ref, { expires: 2 });

        }
    }, [searchParams]);

    return null;
}
