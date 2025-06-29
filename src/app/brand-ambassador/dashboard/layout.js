"use client";

import {
    faBagShopping,
    faMoneyBillTrendUp,
    faTruck,
    faBuilding,
    faBoxesStacked,
    faStore,
    faCalendarDays,
    faClock,
    faLayerGroup,
    faCaretDown,
    faCaretUp,
    faFilm,
    faArrowRightArrowLeft,
    faTag,
    faTachometerAlt,
    faTasks,
    faBoxesPacking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/super-admin/dashboard", icon: faTachometerAlt },
    { label: "Task", href: "/super-admin/dashboard/task", icon: faTasks },
    { label: "Batch", href: "/super-admin/dashboard/batch", icon: faBoxesPacking },
    { label: "Expense", href: "/super-admin/dashboard/expense", icon: faMoneyBillTrendUp },
    { label: "Courier", href: "/super-admin/dashboard/courier", icon: faTruck },
    { label: "Department", href: "/super-admin/dashboard/department", icon: faBuilding },
    { label: "Category", href: "/super-admin/dashboard/category", icon: faBoxesStacked },
    { label: "Product", href: "/super-admin/dashboard/product", icon: faStore },
    { label: "Events", href: "/super-admin/dashboard/event", icon: faCalendarDays },
    // { label: "Pending", href: "", icon: faClock },
    { label: "Promo", href: "/super-admin/dashboard/promo", icon: faTag },
    { label: "Orders", href: "/super-admin/dashboard/order", icon: faBagShopping },
    { label: "Slider", href: "/super-admin/dashboard/slider", icon: faArrowRightArrowLeft },
    { label: "Media", href: "/super-admin/dashboard/media", icon: faFilm },
];

export default function SuperAdminDashboardlayout({ children }) {
    const [open, setOpen] = useState(false);

    const linkClasses = "flex items-center gap-3 m-2 px-4 py-2 rounded-xl text-[15px] font-medium transition hover:bg-emerald-100 hover:text-emerald-800 text-emerald-900";

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white text-emerald-900">
            {/* Mobile Menu */}
            <div className="md:hidden px-4 pt-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex justify-between items-center bg-white/70 backdrop-blur border border-emerald-300 px-4 py-3 rounded-xl shadow text-emerald-800 font-semibold"
                >
                    <span>Menu</span>
                    <FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} />
                </button>

                {open && (
                    <div className="mt-3 bg-white/80 rounded-2xl shadow-lg backdrop-blur-md border border-emerald-100 p-2">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={linkClasses}>
                                <FontAwesomeIcon icon={item.icon} className="text-emerald-600" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-12">
                {/* Sidebar */}
                <div className="hidden md:block col-span-2 p-5">
                    <div className="sticky top-5 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-emerald-100 p-4">
                        <h2 className="text-xl font-bold text-center text-emerald-700 mb-6">Admin Panel</h2>
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={linkClasses}>
                                <FontAwesomeIcon icon={item.icon} className="text-emerald-600" />
                                {/* Show label only if NOT exactly md */}
                                <span className="hidden lg:inline md:hidden sm:inline">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-10 mt-5 px-2 md:px-0 pb-5">
                    <div className="bg-white/90 rounded-2xl shadow-lg border border-emerald-100 p-3 md:p-6 backdrop-blur min-h-full">{children}</div>
                </div>
            </div>
        </div>
    );
}
