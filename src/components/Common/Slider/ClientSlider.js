"use client";

import { imageSrc } from "@/src/functions/CustomFunction";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ClientSlider.module.css";
import { getAllBrandApi } from "@/src/api/SuperAdminApi/BrandApi";
import ClientImageWithLoader from "../ImageLoader/ClientImageWithLoader";

const ClientSlider = () => {
    const [subBrands, setSubBrands] = useState([]);

    useEffect(() => {
        getAllBrandApi().then((data) => {
            //console.log();
            if (!data.error) {
                setSubBrands(data.data);
            }
        });
    }, []);

    const duplicatedIcons = [...subBrands, ...subBrands]; // only 2 copies to match scroll - 50% loop
    // Duplicate icons to make it scrollable

    return (
        <div className={styles.slider}>
            <div className={styles.slideTrack}>
                {[...duplicatedIcons, ...duplicatedIcons].map((item, index) => (
                    <div className={`${styles.slide} self-center`} key={index}>
                        {/* {//console.log("Brand image: ", imageSrc(item.logo.name))} */}
                        <ClientImageWithLoader className="" src={imageSrc(item.logo.name)} height="100" width="100" alt={item.alt || `Icon ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientSlider;
