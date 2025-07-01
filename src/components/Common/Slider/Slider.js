"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { imageSrc } from "@/src/functions/CustomFunction";
import styles from "./Slider.module.css";
import ClientImageWithLoader from "../ImageLoader/ClientImageWithLoader";
import { getSettingsApi } from "@/src/api/SuperAdminApi/SettingsApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";

const Slider = () => {
    const wrapperRef = useRef(null);
    const carouselRef = useRef(null);
    const [extendedProducts, setExtendedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const cardWidthRef = useRef(300);

    useEffect(() => {
        getSettingsApi().then((data) => {
            if (!data.error) {
                // console.log(data.data.bestSelling);
                setProducts(data.data.bestSelling);
            } else {
                setProducts([]);
            }
        });
    }, []);

    useEffect(() => {
        if (!products?.length) return;
        const card = carouselRef.current?.querySelector(`.${styles.card}`);
        const width = card?.offsetWidth || 300;
        cardWidthRef.current = width;

        const cardsPerView = Math.round((carouselRef.current?.offsetWidth || 1000) / width) || 1;
        const extended = [...products.slice(-cardsPerView), ...products, ...products.slice(0, cardsPerView)];
        setExtendedProducts(extended);

        setTimeout(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft = carouselRef.current.offsetWidth;
            }
        }, 100);
    }, [products]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const carousel = carouselRef.current;
        if (!carousel || !wrapper) return;

        let isDragging = false;
        let startX, scrollStart, autoScrollTimer;

        const startDrag = (e) => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = carousel.scrollLeft;
            carousel.classList.add(styles.dragging);
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            carousel.scrollLeft = scrollStart - (e.pageX - startX);
        };

        const stopDrag = () => {
            isDragging = false;
            carousel.classList.remove(styles.dragging);
        };

        const handleInfiniteScroll = () => {
            const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
            if (carousel.scrollLeft <= 0) {
                carousel.classList.add(styles.noTransition);
                carousel.scrollLeft = maxScroll - carousel.offsetWidth;
                carousel.classList.remove(styles.noTransition);
            } else if (Math.ceil(carousel.scrollLeft) >= maxScroll) {
                carousel.classList.add(styles.noTransition);
                carousel.scrollLeft = carousel.offsetWidth;
                carousel.classList.remove(styles.noTransition);
            }
        };

        const autoScroll = () => {
            if (window.innerWidth < 800) return;
            autoScrollTimer = setInterval(() => {
                carousel.scrollLeft += cardWidthRef.current;
            }, 2500);
        };

        autoScroll();
        carousel.addEventListener("mousedown", startDrag);
        carousel.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
        carousel.addEventListener("scroll", handleInfiniteScroll);
        wrapper.addEventListener("mouseenter", () => clearInterval(autoScrollTimer));
        wrapper.addEventListener("mouseleave", autoScroll);

        return () => {
            clearInterval(autoScrollTimer);
            carousel.removeEventListener("mousedown", startDrag);
            carousel.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
            carousel.removeEventListener("scroll", handleInfiniteScroll);
            wrapper.removeEventListener("mouseenter", () => clearInterval(autoScrollTimer));
            wrapper.removeEventListener("mouseleave", autoScroll);
        };
    }, [extendedProducts]);

    const scrollLeft = () => {
        if (carouselRef.current) carouselRef.current.scrollLeft -= cardWidthRef.current;
    };

    const scrollRight = () => {
        if (carouselRef.current) carouselRef.current.scrollLeft += cardWidthRef.current;
    };

    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    return (
        <div className={styles.wrapper} ref={wrapperRef} style={{ position: "relative" }}>
            <i
                className={`z-50 cursor-pointer select-none ${styles.arrow} ${styles.leftArrow}`}
                onClick={scrollLeft}
                role="button"
                tabIndex={0}
                aria-label="Scroll left"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && scrollLeft()}
            >
                &#171;
            </i>

            <ul className={styles.carousel} ref={carouselRef}>
                {extendedProducts.map((item, index) => {
                    const imgKey = `${item.featuredImage.name}-${index}`;
                    return (
                        <li key={imgKey} className={`${styles.card} inline-block mx-1`}>
                            <Link
                                className="h-full mx-5 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border-2 border-gray-100 bg-white hover:shadow-lg"
                                href={`/products/${encodeURIComponent(item.name)}`}
                            >
                                <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl text-center">
                                    <ClientImageWithLoader
                                        width={300}
                                        height={300}
                                        src={imageSrc(item.featuredImage.name)}
                                        alt={item.name || "Product image"}
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = "/fallback-product.png";
                                        }}
                                    />
                                    {item.discount > 0 && (
                                        <span style={{ color: "white" }} className="absolute top-0 left-0 m-2 rounded-full bg-pink-600 px-2 text-center text-sm font-medium">
                                            {item.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 px-4">
                                    <h5 className="tracking-tight text-slate-900 truncate" title={item.name}>
                                        {item.name}
                                    </h5>
                                    <div className="mt-2 mb-5 flex items-center justify-between">
                                        <p>
                                            <span className="text-xl font-semibold mr-2">BDT {(item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2)}</span>
                                            {item.discount > 0 && <span className="text-xs line-through">BDT {item.sellingPrice}</span>}
                                        </p>
                                    </div>
                                    <div className="my-2 flex gap-1 flex-wrap mb-7">
                                        {item.colors?.map((c, idx) => (
                                            <div key={idx} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c.colorCode || "#eee" }} title={c.color}></div>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <i
                className={`z-50 cursor-pointer select-none ${styles.arrow} ${styles.rightArrow}`}
                onClick={scrollRight}
                role="button"
                tabIndex={0}
                aria-label="Scroll right"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && scrollRight()}
            >
                &raquo;
            </i>
        </div>
    );
};

export default Slider;
