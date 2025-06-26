"use client";

import { updateProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import JoditEditor from "jodit-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function UpdateProduct({ product, departments, categories, subCategories, brands, subBrands, batches }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const editor = useRef(null);
    const [content, setContent] = useState(product.description);
    const config = {
        placeholder: "Write product description....",
    };

    const [formData, setFormData] = useState({
        imageList: [],
        addedImage: null,
        name: product.name,
        description: product.description,
        image: product.image,
        featuredImage: product.featuredImage,

        orderPrice: product.orderPrice,
        sellingPrice: product.sellingPrice,
        discount: product.discount,
        stock: product.stock,
        sold: product.sold,
        tags: product.tags.join(","),
        quantity: product.quantity,
        featured: product.featured,
        sizes: product.sizes,
        colors: product.colors,
        sizeName: "",
        referenceColor: "",
        sizeQuantity: "",
        colorName: "",
        colorQuantity: "",
        colorCode: "",
        colorImage: null,
        rating: product.rating,

        departmentId: product.departmentId._id,
        categoryId: product.categoryId._id,
        subCategoryId: product.subCategoryId._id,
        brandId: product.brandId._id,
        subBrandId: product.subBrandId,
        batchId: product.batchId._id,
        verified: true, // Change this
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if ((type === "file") & (name == "addedImage")) {
            setFormData({
                ...formData,
                [name]: files,
                imageList: [...formData.imageList, ...files],
            });
        } else if ((type === "file") & (name == "featuredImage")) {
            setFormData({
                ...formData,
                [name]: { name: files[0].name, contentType: files[0].type },
                imageList: [...formData.imageList, files[0]],
            });
        } else if ((type === "file") & (name == "colorImage")) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (name == "tags") {
            setFormData({
                ...formData,
                tags: value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== "" && tag !== " "),
            });
        } else {
            if (name == "departmentId") {
                setFormData({
                    ...formData,
                    [name]: value,
                    categoryId: "",
                    subCategoryId: "",
                    brandId: "",
                    subBrandId: "",
                });
            } else if (name == "categoryId") {
                setFormData({
                    ...formData,
                    [name]: value,
                    subCategoryId: "",
                    brandId: "",
                    subBrandId: "",
                });
            } else if (name == "brandId") {
                setFormData({
                    ...formData,
                    [name]: value,
                    subBrandId: "",
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }
    };

    const [sizeQuantity, setSizeQuantity] = useState(() => {
        let total = 0;
        formData.sizes.map((item) => {
            total += Number(item.stock);
        });
        return total;
    });
    const [colorQuantity, setColorQuantity] = useState(() => {
        let total = 0;
        formData.colors.map((item) => {
            total += Number(item.stock);
        });
        return total;
    });

    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [
                ...formData.sizes,
                {
                    size: formData.sizeName,
                    stock: formData.sizeQuantity,
                    referenceColor: formData.referenceColor,
                },
            ],
            // sizeName: '',
            // sizeQuantity: '',
            // referenceColor: ''
        });

        setSizeQuantity((prev) => Number(prev) + Number(formData.sizeQuantity));
    };

    const addColor = () => {
        if (formData.colorImage) {
            setFormData({
                ...formData,
                colors: [
                    ...formData.colors,
                    {
                        color: formData.colorName,
                        stock: formData.colorQuantity,
                        colorCode: formData.colorCode,
                        image: formData.colorImage.name,
                    },
                ],
                imageList: [...formData.imageList, formData.colorImage],
            });

            setColorQuantity((prev) => Number(prev) + Number(formData.colorQuantity));
        } else {
            window.alert("Please select an image");
        }
    };

    const deleteSize = (index) => {
        setSizeQuantity((prev) => Number(prev) - Number(formData.sizes[index].stock));
        setFormData({
            ...formData,
            sizes: formData.sizes.toSpliced(index, 1),
        });
    };

    const deleteColor = (index) => {
        setColorQuantity((prev) => Number(prev) - Number(formData.colors[index].stock));

        setFormData({
            ...formData,
            sizes: formData.sizes.filter((item) => item.referenceColor !== formData.colors[index].color),
            imageList: formData.imageList.filter((image) => image.name !== formData.colors[index].image),
            colors: formData.colors.toSpliced(index, 1),
        });

        setSizeQuantity(() => {
            let total = sizeQuantity;
            formData.sizes.map((item) => {
                if (item.referenceColor === formData.colors[index].color) {
                    total -= Number(item.stock);
                }
            });
            return total;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let arr = [...formData.image];

        if (formData.addedImage) {
            for (let i = 0; i < formData.addedImage.length; i++) {
                arr.push({ name: formData.addedImage[i].name, contentType: formData.addedImage[i].type });
            }
        }

        setModalState({ message: "Updating product. Please wait...", open: 1, loading: 1 });

        updateProductApi(product._id, {
            ...formData,
            sizes: formData.sizes.length > 0 ? formData.sizes : [],
            description: content,
            imageList: formData.imageList.filter(
                (image) => image.name == formData.featuredImage.name || arr.map((image) => image.name).includes(image.name) || formData.colors.map((color) => color.image).includes(image.name)
            ),
            image: arr.length === 0 ? "none" : arr,
        }).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true, loading: false });
        });
    };

    return (
        <div>
            <div className=" mx-auto bg-white rounded-lg mb-10">
                <h2 className="text-3xl font-semibold mb-8">Update {product.name}</h2>

                <form className="space-y-10" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-gray-700 mb-1">Batch</label>
                            <select name="batchId" value={formData.batchId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                                <option value="">Select</option>
                                {batches.map((batch) => {
                                    return <option value={batch._id}>{batch.name}</option>;
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Department</label>
                            <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                                <option value="">Select</option>
                                {departments &&
                                    departments.map((department) => {
                                        return <option value={department._id}>{department.name}</option>;
                                    })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Category</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                                <option value="">Select</option>
                                {categories &&
                                    categories
                                        .filter((item) => formData.departmentId === item.departmentId._id)
                                        .map((category) => {
                                            return <option value={category._id}>{category.name}</option>;
                                        })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Sub Category</label>
                            <select required name="subCategoryId" value={formData.subCategoryId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200">
                                <option value="">Select</option>
                                {subCategories &&
                                    subCategories
                                        .filter((item) => formData.categoryId === item.categoryId._id && formData.departmentId === item.departmentId._id)
                                        .map((subCategory) => {
                                            return <option value={subCategory._id}>{subCategory.name}</option>;
                                        })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Brand</label>
                            <select required name="brandId" value={formData.brandId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200">
                                <option value="">Select</option>
                                {brands
                                    .filter((item) => (formData.categoryId === item.categoryId._id) & (formData.departmentId === item.departmentId._id))
                                    .map((brand) => {
                                        return <option value={brand._id}>{brand.name}</option>;
                                    })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Sub Brand</label>
                            <select name="subBrandId" value={formData.subBrandId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200">
                                <option value="">Select</option>
                                {subBrands &&
                                    subBrands
                                        .filter((item) => formData.brandId === item.brandId._id && formData.departmentId === item.departmentId._id && formData.categoryId === item.categoryId._id)
                                        .map((subBrand) => {
                                            return <option value={subBrand._id}>{subBrand.name}</option>;
                                        })}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>

                    <div className="">
                        <label className="block text-gray-700 mb-1">Description</label>

                        <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={(newContent) => setContent(newContent)} onChange={(newContent) => {}} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Feature Image</label>
                        <ClientImageWithLoader className="my-4 rounded" src={imageSrc(product.featuredImage.name)} width={300} height={300} alt={product.name} />
                        <input type="file" name="featuredImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Images</label>
                        <div className="grid grid-cols-6 my-4 gap-4">
                            {formData.image.map((image, index) => (
                                <div className="relative group" key={index}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.image.toSpliced(index, 1);
                                            setFormData({ ...formData, image: newImages });
                                        }}
                                        className="absolute z-10 top-0 right-0 bg-red-500 text-white font-bold px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        X
                                    </button>
                                    <div className="">
                                        <ClientImageWithLoader className="rounded h-full" src={imageSrc(image.name)} width={300} height={300} alt={image.name} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input multiple type="file" name="addedImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-gray-700 mb-1">Order Price in BDT</label>
                            <input type="number" value={formData.orderPrice} name="orderPrice" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Selling Price in BDT</label>
                            <input
                                type="number"
                                value={formData.sellingPrice}
                                name="sellingPrice"
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Discount (%)</label>
                            <input type="number" value={formData.discount} name="discount" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-gray-700 mb-1">Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Rating out of 5 (Optional)</label>
                            <input type="number" value={formData.rating} name="rating" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Tags (For Better SEO)</label>
                        <textarea
                            placeholder="Seperate with comma. Ex: Sneakers,Shoes,Nike,Jordar,Posh Shoes,Mens Shoes,White Shoes"
                            type="text"
                            value={formData.tags}
                            name="tags"
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        />
                    </div>

                    <div className="border-2 border-slate-200 rounded-xl p-6 shadow-md mb-10">
                        <label className="block text-lg font-semibold text-gray-800 mb-5">🎨 Color Adjustments</label>
                        <div className="grid md:grid-cols-6 gap-5 mb-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Product Image</label>
                                <input type="file" name="colorImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Color Name</label>
                                <input
                                    placeholder="Light Blue"
                                    value={formData.colorName}
                                    type="text"
                                    name="colorName"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Color Code</label>
                                <input placeholder="#0000FF" type="text" name="colorCode" onChange={handleChange} className="w-full p-2 border rounded-md focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Color</label>
                                <div className="mt-2">
                                    <svg width="30" height="30">
                                        <circle cx="15" cy="15" r="15" fill={formData.colorCode} />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
                                <input
                                    placeholder="100"
                                    value={formData.colorQuantity}
                                    type="number"
                                    name="colorQuantity"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div className="flex items-end">
                                <button onClick={addColor} className="btn btn-success btn-sm text-white w-full" type="button">
                                    Add Color
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border rounded-md text-sm">
                                <thead className="bg-slate-100 text-gray-700">
                                    <tr>
                                        <th className="border p-2 text-left">Product</th>
                                        <th className="border p-2 text-left">Name</th>
                                        <th className="border p-2 text-left">Color Code</th>
                                        <th className="border p-2 text-center">Color</th>
                                        <th className="border p-2 text-right">Quantity</th>
                                        <th className="border p-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.colors.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                <ClientImageWithLoader src={imageSrc(item.image)} alt={item.name} className="w-8 h-8 object-cover" />
                                            </td>
                                            <td className="border p-2">{item.color}</td>
                                            <td className="border p-2">{item.colorCode}</td>
                                            <td className="border p-2 text-center">
                                                <svg width="20" height="20">
                                                    <circle cx="10" cy="10" r="10" fill={item.colorCode} />
                                                </svg>
                                            </td>
                                            <td className="border p-2 text-right">{item.stock}</td>
                                            <td className="border p-2 text-center">
                                                <button type="button" onClick={() => deleteColor(index)} className="btn btn-warning btn-sm">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="font-semibold">
                                        <td colSpan="2" className="border p-2 text-right">
                                            Total
                                        </td>
                                        <td colSpan="2" className={`border p-2 ${colorQuantity !== formData.quantity ? "text-red-500" : ""}`}>
                                            {colorQuantity} {colorQuantity !== formData.quantity && "(Not same as total quantity)"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-2 border-slate-200 rounded-xl p-6 shadow-md">
                        <label className="block text-lg font-semibold text-gray-800 mb-5">📏 Size Adjustments</label>
                        <div className="grid md:grid-cols-4 gap-5 mb-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Size Name</label>
                                <input
                                    placeholder="XXL or 32"
                                    value={formData.sizeName}
                                    type="text"
                                    name="sizeName"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Reference Color (Optional)</label>
                                <select value={formData.referenceColor} onChange={handleChange} name="referenceColor" className="w-full p-2 border rounded-md focus:ring focus:ring-green-200">
                                    <option value="">Select</option>
                                    {formData.colors.map((color, idx) => (
                                        <option key={idx} value={color.color}>
                                            {color.color}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
                                <input
                                    placeholder="100"
                                    value={formData.sizeQuantity}
                                    type="number"
                                    name="sizeQuantity"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div className="flex items-end">
                                <button onClick={addSize} className="btn btn-success btn-sm text-white w-full" type="button">
                                    Add Size
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border rounded-md text-sm">
                                <thead className="bg-slate-100 text-gray-700">
                                    <tr>
                                        <th className="border p-2 text-left">Size</th>
                                        <th className="border p-2 text-left">Reference Color</th>
                                        <th className="border p-2 text-right">Quantity</th>
                                        <th className="border p-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.sizes.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{item.size}</td>
                                            <td className="border p-2">{item.referenceColor}</td>
                                            <td className="border p-2 text-right">{item.stock}</td>
                                            <td className="border p-2 text-center">
                                                <button onClick={() => deleteSize(index)} className="btn btn-warning btn-sm">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="font-semibold">
                                        <td colSpan="2" className="border p-2 text-right">
                                            Total
                                        </td>
                                        <td className={`border p-2 ${sizeQuantity !== formData.quantity ? "text-red-500" : ""}`}>
                                            {sizeQuantity} {sizeQuantity !== formData.quantity && "(Not same as total quantity)"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Feature Item</label>
                        <select value={formData.featured} className="w-full p-2 border rounded focus:ring focus:ring-green-200" onChange={handleChange} name="featured" id="">
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            Save
                        </button>
                    </div>
                </form>

                <Modal
                    loading={modalState.loading}
                    open={modalState.open}
                    handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                    error={modalState.error}
                    message={modalState.message}
                />
            </div>

            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        </div>
    );
}
