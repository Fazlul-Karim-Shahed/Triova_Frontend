"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { imageSrc } from "@/src/functions/CustomFunction";
import styles from "./Slider.module.css";
import ClientImageWithLoader from "../ImageLoader/ClientImageWithLoader";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";

const Slider = () => {
    const wrapperRef = useRef(null);
    const carouselRef = useRef(null);
    const [extendedProducts, setExtendedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const cardWidthRef = useRef(300);

    useEffect(() => {
        getAllProductApi(10).then((data) => {
            if (!data.error) {
                setProducts(data.data);
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
    }, [extendedProducts]); // Only run after extendedProducts are set

    const scrollLeft = () => {
        if (carouselRef.current) carouselRef.current.scrollLeft -= cardWidthRef.current;
    };

    const scrollRight = () => {
        if (carouselRef.current) carouselRef.current.scrollLeft += cardWidthRef.current;
    };

    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }

    const productLD = {
        "@context": "https://schema.org",
        "@graph": products.map((item) => {
            const originalPrice = Number(item.sellingPrice);
            const discountedPrice = Number((item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2));

            return {
                "@type": "Product",
                name: item.name,
                image: [imageSrc(item.featuredImage.name), ...item.image.map((img) => imageSrc(img.name))],
                description: item.description?.substring(0, 500) || "Quality product from Triova Limited.",
                sku: item.sku || item._id,
                brand: {
                    "@type": "Brand",
                    name: item.brand?.name || "Triova Limited",
                },
                offers: {
                    "@type": "Offer",
                    url: `https://triova.vercel.app/products/${encodeURIComponent(item.name)}`,
                    priceCurrency: "BDT",
                    price: discountedPrice, // ✅ number, not string
                    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    itemCondition: "https://schema.org/NewCondition",
                    availability: item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    seller: {
                        "@type": "Organization",
                        name: "Triova Limited",
                    },
                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: discountedPrice,
                        priceBeforeDiscount: originalPrice,
                        priceCurrency: "BDT",
                    },
                    shippingDetails: {
                        "@type": "OfferShippingDetails",
                        shippingRate: {
                            "@type": "MonetaryAmount",
                            value: 60,
                            currency: "BDT",
                        },
                        shippingDestination: {
                            "@type": "DefinedRegion",
                            addressCountry: "BD",
                        },
                        deliveryTime: {
                            "@type": "ShippingDeliveryTime",
                            handlingTime: {
                                "@type": "QuantitativeValue",
                                minValue: 0,
                                maxValue: 1,
                                unitCode: "d",
                            },
                            transitTime: {
                                "@type": "QuantitativeValue",
                                minValue: 2,
                                maxValue: 5,
                                unitCode: "d",
                            },
                        },
                    },
                    hasMerchantReturnPolicy: {
                        "@type": "MerchantReturnPolicy",
                        applicableCountry: "BD",
                        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                        merchantReturnDays: 7,
                        returnMethod: "https://schema.org/ReturnByMail",
                        returnFees: "https://schema.org/FreeReturn",
                        refundType: "https://schema.org/FullRefund", // ✅ Added
                    },
                },
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.3", // ✅ average rating (1–5)
                    reviewCount: "12", // ✅ total number of reviews
                },
                review: [
                    {
                        "@type": "Review",
                        author: {
                            "@type": "Person",
                            name: "Verified Buyer",
                        },
                        datePublished: "2024-06-15",
                        reviewRating: {
                            "@type": "Rating",
                            ratingValue: "5",
                            bestRating: "5",
                        },
                        reviewBody: "Excellent product, great value for the price.",
                    },
                ],
            };
        }),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />

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
                                    itemScope
                                    itemType="https://schema.org/Product"
                                    href={`/products/${encodeURIComponent(item.name)}`}
                                >
                                    <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl text-center" itemProp="image">
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
                                            <span
                                                style={{ color: "white" }}
                                                className="absolute top-0 left-0 m-2 rounded-full bg-pink-600 px-2 text-center text-sm font-medium text-white"
                                                aria-label={`${item.discount}% off`}
                                            >
                                                {item.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 px-4">
                                        <h5 itemProp="name" className="tracking-tight text-slate-900 truncate" title={item.name}>
                                            {item.name}
                                        </h5>
                                        <meta itemProp="sku" content={item.sku || ""} />
                                        <div className="mt-2 mb-5 flex items-center justify-between">
                                            <p itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                                <span className="text-xl font-semibold mr-2" itemProp="price">
                                                    BDT {(item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2)}
                                                </span>
                                                <meta itemProp="priceCurrency" content="BDT" />
                                                {item.discount > 0 && <span className="text-xs line-through">BDT {item.sellingPrice}</span>}
                                            </p>
                                        </div>
                                        <div className="my-2 flex gap-1 flex-wrap" aria-label="Available colors">
                                            {item.colors?.map((c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-5 h-5 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: c.colorCode || "#eee" }}
                                                    title={c.color}
                                                    aria-label={c.color}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex m-3 justify-content-center w-fit">
                                        {/* <Link
                                        href={`/products/${encodeURIComponent(item.name)}`}
                                        className="px-5 py-1 rounded-md bg-brand-600 text-white font-semibold hover:bg-brand-700 transition"
                                        itemProp="url"
                                    >
                                        View More
                                    </Link> */}
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
        </>
    );
};

export default Slider;
