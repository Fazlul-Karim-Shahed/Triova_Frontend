"use client";

import { getAllCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import Logo from "@/public/Logo.svg";
import {
    faAddressBook,
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
    faAward,
    faCalendarCheck,
    faCartPlus,
    faCartShopping,
    faClockRotateLeft,
    faComment,
    faDoorOpen,
    faLock,
    faRightFromBracket,
    faScrewdriverWrench,
    faTableList,
    faTag,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import BottomHeader from "../BottomHeader/BottomHeader";
import { getAllEventApi } from "@/src/api/SuperAdminApi/EventApi";

export default function MainHeader({ searchParams }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [departmentState, setDepartmentState] = useState(false);
    const [eventState, setEventState] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const pathname = usePathname();
    const store = useSelector((state) => state.triova);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const myParam = urlParams.get("search");
            setSearch(myParam ? myParam : "");
        }

        getAllDepartmentApi({}).then((data) => {
            if (!data.error) {
                setDepartments(data.data);
            }
        });

        getAllEventApi("today").then((data) => {
            if (!data.error) {
                setEvents(data.data);
            }
        });

        getAllCategoryApi({}).then((data) => {
            if (!data.error) {
                setCategories(data.data);
            }
        });

        if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/employee")) {
            return;
        } else {
            if (isMenuOpen) {
                menuRef.current.style.maxHeight = `${menuRef.current.scrollHeight}px`;
            } else {
                if (window.innerWidth > 768) {
                    menuRef.current.style.maxHeight = `${menuRef.current.scrollHeight}px`;
                } else {
                    menuRef.current.style.maxHeight = "0px";
                }
            }
        }
    }, [isMenuOpen, pathname]);

    const handleToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/employee")) {
        return null;
    }

    const handleChange = (e) => setSearch(e.target.value);
    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.href = "/products?search=" + search;
    };

    return (
        <div style={{ backgroundColor: "white" }} className="sticky top-0 z-50 bg-slate-50">
            <nav className="dark:bg-gray-900 bg-slate-50">
                <div style={{ maxWidth: "97%" }} className="flex flex-wrap items-center justify-between mx-auto p-4 bg-slate-50">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image width="130" src={Logo} className="object-cover" alt="Triova Logo" />
                    </Link>
                    <div className="flex md:order-2">
                        <div className="relative hidden md:block md:flex items-center">
                            <div className="me-3 relative">
                                <form onSubmit={handleSubmit} className="relative">
                                    <input
                                        onChange={handleChange}
                                        value={search}
                                        type="text"
                                        id="search-navbar"
                                        className="w-[350px] px-5 py-3 pr-14 text-sm text-gray-800 rounded-full 
                       bg-white/30 backdrop-blur-md border border-black/30  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 hover:shadow-md"
                                        placeholder="Search at Triova's largest store"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-0 end-0 flex items-center justify-center px-4 
                       text-pink-600 hover:text-white hover:bg-pink-500 rounded-full 
                       transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </form>
                            </div>

                            <div>
                                {store.authenticated ? (
                                    <div>
                                        <div className="relative inline-flex group mt-1">
                                            <button
                                                type="button"
                                                className="flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                                aria-haspopup="menu"
                                                aria-expanded="false"
                                                aria-label="Dropdown"
                                            >
                                                <img className="w-11 h-11 p-1" src={"/boy.png"} alt="boy" />
                                                <span className="text-gray-600 font-medium truncate max-w-[7.5rem] dark:text-neutral-400">{store.decodedToken.firstName}</span>
                                                <svg
                                                    className="w-4 h-4 me-2 transition-transform duration-200 transform group-hover:rotate-180 group-focus:rotate-180"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m6 9 6 6 6-6" />
                                                </svg>
                                            </button>

                                            <div
                                                className="absolute border top-10 hidden group-hover:block group-focus:block bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 min-w-52 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="dropdown-trigger"
                                            >
                                                <Link
                                                    onClick={handleToggle}
                                                    href="/mytriova"
                                                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                                >
                                                    <FontAwesomeIcon className="" icon={faUser} />
                                                    <span>My Triova</span>
                                                </Link>

                                                <Link
                                                    onClick={handleToggle}
                                                    href="/cart"
                                                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                                >
                                                    <FontAwesomeIcon className="" icon={faCartShopping} />
                                                    Cart
                                                    <span className="transform -translate-x-1/2 -translate-y-1/3 bg-blue-500 rounded-full px-2 py-1 text-xs text-white">{store.cart}</span>
                                                </Link>

                                                <Link
                                                    onClick={handleToggle}
                                                    href="/mytriova/history"
                                                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                                >
                                                    <FontAwesomeIcon className="" icon={faClockRotateLeft} />
                                                    Puschase History
                                                </Link>

                                                {/* <Link onClick={handleToggle} href="#" className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                                                <FontAwesomeIcon className='' icon={faAward} />
                                                Claim Warrenty
                                            </Link> */}

                                                <hr />

                                                {store.authenticated && (store.decodedToken.role === "superAdmin" || store.decodedToken.role === "admin" || store.decodedToken.role === "employee") && (
                                                    <div className="flex bg-red-100 font-bold items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                                                        <Link href={store.decodedToken.role === "superAdmin" ? "/super-admin" : store.decodedToken.role === "admin" ? "/admin" : "employee"}>
                                                            {" "}
                                                            <FontAwesomeIcon className="me-2" icon={faLock} />
                                                            {store.decodedToken.role === "superAdmin" ? "Super Admin" : store.decodedToken.role === "admin" ? "Admin" : "Employee"} panel
                                                        </Link>
                                                    </div>
                                                )}

                                                {store.authenticated && (
                                                    <Link
                                                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                                        href="/logout"
                                                    >
                                                        <FontAwesomeIcon className="" icon={faRightFromBracket} />
                                                        Logout
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={"/signin"}
                                        className="bg-gradient-to-r from-[#FD9248] to-[#FA1768] hover:from-[#FA1768] hover:to-[#FD9248] transition-colors font-medium rounded-lg text-white px-4 py-2"
                                    >
                                        Register
                                    </Link>
                                )}
                            </div>

                            <div className="relative inline-block">
                                <Link href={"/cart"} className="px-4 py-2 relative">
                                    <FontAwesomeIcon className="text-2xl mt-1" icon={faCartPlus} />
                                    <div className="absolute top-0 right-3 transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full px-2 py-1 text-xs text-white">{store.cart}</div>
                                </Link>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggle}
                            aria-controls="navbar-search"
                            aria-expanded={isMenuOpen}
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>

                    <div
                        ref={menuRef}
                        className={`overflow-hidden transition-max-height duration-500 ease-in-out items-center justify-between w-full md:flex md:w-auto md:order-1`}
                        id="navbar-search"
                        style={{ maxHeight: "0px" }}
                    >
                        <div className="relative mt-6 md:hidden">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={search}
                                    id="search-navbar-small"
                                    className="block w-full p-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search at Triova's largest store"
                                />
                                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </form>
                        </div>

                        {departmentState ? (
                            <ul className="flex flex-col md:hidden p-4 md:p-0 mt-4 md:text-base text-sm border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-inherit dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li className="mb-4">
                                    <div
                                        onClick={() => setDepartmentState(false)}
                                        className="cursor-pointer md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faAnglesLeft} />
                                        Go back
                                    </div>

                                    <hr />
                                </li>

                                {departments.map((item) => (
                                    <li>
                                        <div className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                            <Link onClick={handleToggle} href={{ pathname: "/products", query: { department: item.name } }}>
                                                {item.name}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : eventState ? (
                            <ul className="flex flex-col md:hidden p-4 md:p-0 mt-4 md:text-base text-sm border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-inherit dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li className="mb-4">
                                    <div
                                        onClick={() => setEventState(false)}
                                        className="cursor-pointer md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faAnglesLeft} />
                                        Go back
                                    </div>

                                    <hr />
                                </li>

                                {events.map((item) => (
                                    <li>
                                        <div className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                            <Link onClick={handleToggle} href={`/event/${item.name}`}>
                                                {item.name}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="flex flex-col md:hidden p-4 md:p-0 mt-4 md:text-base text-xs border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-inherit dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li
                                    onClick={() => setDepartmentState(true)}
                                    className="md:hidden block py-2 px-3 text-gray-900 rounded cursor-pointer flex items-center justify-between hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    <div className="">
                                        <FontAwesomeIcon className="me-2" icon={faTableList} />
                                        Departments
                                    </div>

                                    <div className="">
                                        <FontAwesomeIcon className="me-2" icon={faAngleRight} />
                                    </div>
                                </li>

                                <li
                                    onClick={() => setEventState(true)}
                                    className="md:hidden block py-2 px-3 text-gray-900 rounded cursor-pointer flex items-center justify-between hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    <div className="">
                                        <FontAwesomeIcon className="me-2" icon={faCalendarCheck} />
                                        Events
                                    </div>

                                    <div className="">
                                        <FontAwesomeIcon className="me-2" icon={faAngleRight} />
                                    </div>
                                </li>

                                <li>
                                    <Link
                                        onClick={handleToggle}
                                        href="/promo"
                                        className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faTag} />
                                        Promo Code
                                    </Link>
                                </li>

                                <hr className="my-2" />

                                <li>
                                    {store.authenticated && (store.decodedToken.role === "superAdmin" || store.decodedToken.role === "admin" || store.decodedToken.role === "employee") && (
                                        <Link
                                            className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                            onClick={handleToggle}
                                            href={store.decodedToken.role === "superAdmin" ? "/super-admin" : store.decodedToken.role === "admin" ? "/admin" : "employee"}
                                        >
                                            <FontAwesomeIcon className="me-2" icon={faLock} />
                                            {store.decodedToken.role === "superAdmin" ? "Super Admin" : store.decodedToken.role === "admin" ? "Admin" : "Employee"} panel
                                        </Link>
                                    )}
                                </li>

                                <li>
                                    <Link
                                        onClick={handleToggle}
                                        href="/cart"
                                        className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faCartShopping} />
                                        Cart
                                        <span className="transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full px-2 py-1 text-xs text-white ms-2">{store.cart}</span>
                                    </Link>
                                </li>

                                <li>
                                    {!store.authenticated && (
                                        <Link
                                            onClick={handleToggle}
                                            href="/signin"
                                            className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                        >
                                            <FontAwesomeIcon className="me-2" icon={faRightFromBracket} />
                                            <span>Register</span>
                                        </Link>
                                    )}
                                </li>

                                <li>
                                    {store.authenticated && (
                                        <Link
                                            onClick={handleToggle}
                                            href="/mytriova"
                                            className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                        >
                                            <FontAwesomeIcon className="me-2" icon={faUser} />
                                            <span>My Triova</span>
                                        </Link>
                                    )}
                                </li>

                                <li>
                                    {store.authenticated && (
                                        <Link
                                            onClick={handleToggle}
                                            href="/mytriova/history"
                                            className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                        >
                                            <FontAwesomeIcon className="me-2" icon={faClockRotateLeft} />
                                            Puschase History
                                        </Link>
                                    )}
                                </li>
                                <li>
                                    {/* {store.authenticated && <Link onClick={handleToggle} href="#" className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                    <FontAwesomeIcon className='me-2' icon={faAward} />
                                    Claim Warrenty
                                </Link>} */}
                                </li>

                                <hr className="my-2" />

                                <li>
                                    <Link
                                        onClick={handleToggle}
                                        href="/contact"
                                        className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faAddressBook} />
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        onClick={handleToggle}
                                        href="/about"
                                        className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faScrewdriverWrench} />
                                        About
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        onClick={handleToggle}
                                        href="#"
                                        className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        <FontAwesomeIcon className="me-2" icon={faComment} />
                                        Give Feedback
                                    </Link>
                                </li>

                                {store.authenticated && (
                                    <li>
                                        <hr className="my-2" />
                                        <Link
                                            onClick={handleToggle}
                                            href="/logout"
                                            className="md:hidden block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                        >
                                            <FontAwesomeIcon className="me-2" icon={faRightFromBracket} />
                                            Logout
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </nav>

            <BottomHeader departments={departments} categories={categories} />
        </div>
    );
}
