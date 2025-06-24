"use client";

import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { createProductpi } from "@/src/api/SuperAdminApi/ProductApi";

export default function CreateProduct({ departments, categories, subCategories, brands, subBrands, batches }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [sizeQuantity, setSizeQuantity] = useState(0);
    const [colorQuantity, setColorQuantity] = useState(0);

    const editor = useRef(null);
    const [content, setContent] = useState("");
    const config = {
        placeholder: "Write product description....",
    };

    const [formData, setFormData] = useState({
        imageList: [],
        name: "",
        description: "",
        image: null,
        featuredImage: null,

        orderPrice: "",
        sellingPrice: "",
        discount: 0,
        stock: 0,
        sold: 0,
        tags: [],
        quantity: 0,
        featured: false,
        sizes: [],
        colors: [],
        sizeName: "",
        referenceColor: "",
        sizeQuantity: "",
        colorName: "",
        colorQuantity: "",
        colorImage: null,
        rating: 0,
        colorCode: "",

        departmentId: "",
        categoryId: "",
        subCategoryId: "",
        brandId: "",
        subBrandId: "",
        batchId: "",
        verified: true, // Change this
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if ((type === "file") & (name == "image")) {
            setFormData({
                ...formData,
                [name]: files,
            });
        } else if ((type === "file") & (name == "featuredImage")) {
            setFormData({
                ...formData,
                [name]: files[0],
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
        } else if (name == "quantity") {
            setFormData({
                ...formData,
                quantity: value,
                stock: value,
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
        setFormData({
            ...formData,
            colors: [
                ...formData.colors,
                {
                    color: formData.colorName,
                    stock: formData.colorQuantity,
                    image: formData.colorImage,
                    colorCode: formData.colorCode,
                },
            ],
            // colorName: '',
            // colorQuantity: '',
            // colorImage: ''
        });

        setColorQuantity((prev) => Number(prev) + Number(formData.colorQuantity));
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

        let images = [];
        for (let i = 0; i < formData.image.length; i++) {
            images.push({ name: formData.image[i].name, contentType: formData.image[i].type });
        }

        setModalState({ message: "Creating new product. Please wait...", open: true, loading: true });

        createProductpi({
            ...formData,
            subBrands: formData.subBrandId,
            description: content,
            imageList: [formData.featuredImage, ...formData.image, ...formData.colors.map((item) => item.image)],
            featuredImage: { name: formData.featuredImage.name, contentType: formData.featuredImage.type },
            image: images,
            colors: formData.colors.map((item) => ({ color: item.color, stock: item.stock, colorCode: item.colorCode })),
        }).then((data) => {
            //console.log(data)
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        });
    };

    return (
        <div>
            <div className=" mx-auto bg-white rounded-lg mb-10">
                <h2 className="text-3xl font-semibold mb-8">Create Product Form</h2>

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
                                {departments.map((department) => {
                                    return <option value={department._id}>{department.name}</option>;
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Category</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                                <option value="">Select</option>
                                {categories
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
                                {subCategories
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
                        {/* <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" /> */}

                        <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={(newContent) => setContent(newContent)} onChange={(newContent) => {}} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Feature Image</label>
                        <input type="file" name="featuredImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Images</label>
                        <input multiple type="file" name="image" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
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
                            <input
                                disabled
                                type="number"
                                name="stock"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                required
                            />
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
                            name="tags"
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        />
                    </div>

                    <div className="border-2 border-slate-200 rounded py-7 px-5 shadow ">
                        <label className="block text-gray-700 mb-1 font-bold">Color Adjustments</label>
                        <div className="grid md:grid-cols-5 mb-7 gap-5">
                            <div>
                                <label className="block text-gray-700 mb-1">Color Name</label>
                                <input
                                    placeholder="Light Blue"
                                    value={formData.colorName}
                                    type="text"
                                    name="colorName"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Color Code</label>
                                <input placeholder="#0000FF" type="text" name="colorCode" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Color</label>
                                <div className="flex items-center mt-2">
                                    <svg width="30" height="30">
                                        <circle cx="15" cy="15" r="15" fill={formData.colorCode} />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Quantity</label>
                                <input
                                    placeholder='100"'
                                    value={formData.colorQuantity}
                                    type="number"
                                    name="colorQuantity"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <button onClick={() => addColor()} className="btn btn-success btn-sm text-white md:mt-8" type="button">
                                    Add Color & Quantity
                                </button>
                            </div>
                        </div>

                        <div>
                            <table className="border rounded mt-2 w-full">
                                <tr className="border">
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Color Code</th>
                                    <th className="border p-2">Color</th>
                                    <th className="border p-2">Quantity</th>
                                    <th className="border p-2"></th>
                                </tr>

                                {formData.colors.map((item, index) => (
                                    <tr className="border">
                                        <td className="border p-2">{item.color}</td>
                                        <td className="border p-2">{item.colorCode}</td>
                                        <td className="border p-2">
                                            <svg width="20" height="20">
                                                <circle cx="10" cy="10" r="10" fill={item.colorCode} />
                                            </svg>
                                        </td>
                                        <td className="border p-2">{item.stock}</td>
                                        <td onClick={() => deleteColor(index)} className="border p-2 text-xs text-center">
                                            {" "}
                                            <button type="button" className="btn btn-sm btn-warning">
                                                Delete
                                            </button>{" "}
                                        </td>
                                    </tr>
                                ))}

                                <tr className="border">
                                    <th className=""></th>
                                    <th className="border-e-2 p-2">Total</th>
                                    <th className={`p-2 ${colorQuantity < formData.quantity || colorQuantity > formData.quantity ? "text-error" : ""} `}>
                                        {colorQuantity} {(colorQuantity < formData.quantity || colorQuantity > formData.quantity) && "(Not same as total quantity)"}
                                    </th>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div className="border-2 border-slate-200 rounded py-7 px-5 shadow">
                        <label className="block text-gray-700 mb-1 font-bold">Size Adjustments</label>
                        <div className="grid md:grid-cols-4 gap-5 mb-7">
                            <div>
                                <label className="block text-gray-700 mb-1">Size Name</label>
                                <input
                                    placeholder="XXL or 32"
                                    value={formData.sizeName}
                                    type="text"
                                    name="sizeName"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Reference Color (Optional)</label>
                                <select value={formData.referenceColor} className="w-full p-2 border rounded focus:ring focus:ring-green-200" onChange={handleChange} name="referenceColor" id="">
                                    <option value="">Select</option>
                                    {formData.colors.map((color) => {
                                        return <option value={color.color}>{color.color}</option>;
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Quantity</label>
                                <input
                                    placeholder="100"
                                    value={formData.sizeQuantity}
                                    type="number"
                                    name="sizeQuantity"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <button onClick={() => addSize()} className="btn btn-success btn-sm text-white md:mt-8" type="button">
                                    Add Size & Quantity
                                </button>
                            </div>
                        </div>

                        <div>
                            <table className="border rounded mt-2 w-full">
                                <tr className="border">
                                    <th className="border p-2">Size</th>
                                    <th className="border p-2">Reference Color</th>
                                    <th className="border p-2">Quantity</th>
                                    <th className="border p-2"></th>
                                </tr>

                                {formData.sizes.map((item, index) => (
                                    <tr className="border">
                                        <td className="border p-2">{item.size}</td>
                                        <td className="border p-2">{item.referenceColor}</td>
                                        <td className="border p-2">{item.stock}</td>
                                        <td onClick={() => deleteSize(index)} className="border p-2 text-xs text-center">
                                            {" "}
                                            <button type="button" className="btn btn-sm btn-warning">
                                                Delete
                                            </button>{" "}
                                        </td>
                                    </tr>
                                ))}

                                <tr className="border">
                                    <th className=""></th>
                                    <th className="border-e-2 p-2">Total</th>
                                    <th className={`p-2 ${sizeQuantity < formData.quantity || sizeQuantity > formData.quantity ? "text-error" : ""} `}>
                                        {sizeQuantity} {(sizeQuantity < formData.quantity || sizeQuantity > formData.quantity) && "(Not same as total quantity)"}
                                    </th>
                                </tr>
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
                        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
                            Submit
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
