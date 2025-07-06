"use client";

import { getAllEventApi } from "@/src/api/SuperAdminApi/EventApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import { faAngleDown, faCircleQuestion, faPhone, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function BottomHeader({ departments, categories }) {
    const [department, setDepartment] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedDeartment, setSelectedDepartment] = useState(null);
    const [showCategory, setShowCategory] = useState(false);
    const [showDepartment, setShowDepartment] = useState(false);
    const [events, setEvents] = useState([]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        getAllEventApi("today").then((data) => {
            if (!data.error) {
                setEvents(data.data);
            } else {
                setEvents([]);
            }
        });
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDepartment(false);
            setShowCategory(false);
        }
    };

    const toggleDepartment = () => {
        if (!showDepartment) {
            if (department.length === 0) setDepartment(departments);
            if (allCategory.length === 0) setAllCategory(categories);
            if (allSubCategory.length === 0) {
                getAllSubCategoryApi().then((data) => {
                    if (!data.error) setAllSubCategory(data.data);
                });
            }
        }
        setShowDepartment((prev) => !prev);
        setShowCategory(false);
    };

    const getCategory = (department) => {
        setSelectedDepartment(department);
        setSelectedCategory(allCategory.filter((item) => item.departmentId._id === department._id));
        setShowCategory(true);
    };

    return (
        <div className="bg-white/100 border-b border-slate-200 p-2 shadow-sm hidden md:block">
            <div className="w-[97%] mx-auto flex">
                <div className="flex pe-7">
                    <div className="relative" ref={dropdownRef}>
                        {/* Department Toggle Button */}
                        <div onClick={toggleDepartment} className=" text-brand-800 px-6 py-2 text-sm font-semibold hover:scale-105 transition-transform cursor-pointer">
                            Department <FontAwesomeIcon className="ml-1" icon={faAngleDown} />
                        </div>

                        {/* Department Dropdown */}
                        {showDepartment && (
                            <ul tabIndex={0} className="absolute z-20 mt-2 w-64 max-h-[550px] overflow-y-auto bg-white/100 backdrop-blur-lg shadow-xl p-3 rounded-es-xl border border-gray-200">
                                {department.map((item) => (
                                    <li key={item.id} onMouseEnter={() => getCategory(item)} className="py-2 px-3 text-brand-900 rounded hover:bg-brand-200 cursor-pointer transition">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Category & Subcategory Panel */}
                        {showDepartment && showCategory && (
                            <div tabIndex={0} className="fixed ml-64 mt-2 bg-white/100 backdrop-blur-md w-[800px] max-h-[550px] overflow-y-auto px-8 py-5 rounded-b-xl  z-30 border border-gray-200">
                                <ul className="grid grid-cols-3 gap-6">
                                    {selectedCategory.map((category) => (
                                        <li className="mb-4" key={category._id}>
                                            <div className="text-md font-semibold text-brand-900 mb-3">{category.name}</div>
                                            <Link href={{ pathname: "/products", query: { category: category.name } }} className="text-brand-600 text-sm font-medium  hover:font-semibold">
                                                View All
                                            </Link>
                                            <div className="mt-1 space-y-2">
                                                {allSubCategory
                                                    .filter((sub) => sub.categoryId._id === category._id)
                                                    .map((item) => (
                                                        <Link
                                                            key={item._id}
                                                            onClick={() => {
                                                                setShowDepartment(false);
                                                                setShowCategory(false);
                                                            }}
                                                            href={{ pathname: "/products", query: { subcategory: item.name } }}
                                                            className="block text-sm text-brand-900 hover:font-semibold"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Promotional Panel */}
                        {showDepartment && showCategory && selectedDeartment?.promotionalImage && (
                            <div
                                tabIndex={0}
                                className="fixed ml-[1056px] mt-2 bg-white/100 backdrop-blur-md w-[300px] max-h-[550px] overflow-y-auto px-4 py-5 rounded-br-xl z-30 border border-gray-200"
                            >
                                <ClientImageWithLoader className="w-full h-40 object-cover rounded-lg shadow-md" src={imageSrc(selectedDeartment.promotionalImage.name)} alt="Promo" />
                                <div className="text-base font-semibold my-4 text-brand-800">{selectedDeartment.promotionalDescription}</div>
                                <button className="w-full py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition">Shop now</button>
                            </div>
                        )}
                    </div>

                    <div className="border-r-2"></div>

                    <div className="text-brand-800 px-6 py-2 text-sm font-semibold hover:scale-105 transition-transform cursor-pointer">
                        <Link href="/promo" className="">
                            <FontAwesomeIcon icon={faTag} className="text-brand-600 h-4 w-4 mr-1" />
                            Promo
                        </Link>
                    </div>
                    <div className="border-r-2"></div>

                    {events.length > 0 &&
                        events.map((item) => (
                            <>
                                <div className="text-brand-800 px-6 py-2 text-sm font-semibold hover:scale-105 transition-transform cursor-pointer">
                                    <Link href={`/event/${item.name}`} className="">
                                        {/* <FontAwesomeIcon icon={faTag} className="text-brand-500 h-4 w-4 mr-1" /> */}
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="border-r-2"></div>
                            </>
                        ))}
                </div>
                <div className="flex-1 flex justify-end items-center space-x-4">
                    <a href="tel:+8801312379588" className="flex items-center text-sm font-medium text-brand-700 hover:text-brand-700 hover:font-semibold transition">
                        <FontAwesomeIcon icon={faPhone} className="text-brand-500 h-4 w-4 mr-1" />
                        Call to Order
                    </a>

                    <Link href="/contact" className="flex items-center text-sm font-medium text-brand-700 hover:text-brand-700 hover:font-semibold transition">
                        <FontAwesomeIcon icon={faCircleQuestion} className="text-brand-500 h-4 w-4 mr-1" />
                        Helpline
                    </Link>
                </div>
            </div>
        </div>
    );
}
