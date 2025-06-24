"use client";

import { getAllFilesApi, deleteFileApi } from "@/src/api/SuperAdminApi/FilesApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import React, { useEffect, useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";

export default function MediaPage() {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [uploadingZip, setUploadingZip] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);

    const zipInputRef = useRef();
    const mediaInputRef = useRef();
    const zipCacheRef = useRef(null);

    const fetchFiles = async () => {
        try {
            const response = await getAllFilesApi();
            if (!response.error) {
                setFiles(response.data);
                setFilteredFiles(response.data);
            } else {
                //console.error("Error fetching files:", response.message);
            }
        } catch (error) {
            //console.error("Error in API call:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredFiles(files);
        } else {
            const filtered = files.filter((file) => {
                const name = typeof file === "string" ? file : file.name;
                return name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setFilteredFiles(filtered);
        }
    }, [searchTerm, files]);

    const toggleSelect = (fileName) => {
        setSelectedFiles((prev) => (prev.includes(fileName) ? prev.filter((f) => f !== fileName) : [...prev, fileName]));
    };

    const handleDelete = async (fileName) => {
        if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
        try {
            const res = await deleteFileApi(fileName);
            if (!res.error) {
                setFiles((prev) => prev.filter((f) => (typeof f === "string" ? f !== fileName : f.name !== fileName)));
                setSelectedFiles((prev) => prev.filter((f) => f !== fileName));
                alert(res.message);
            } else {
                alert("Failed to delete file");
            }
        } catch (err) {
            //console.error("Error deleting file:", err);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedFiles.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedFiles.length} selected file(s)?`)) return;

        for (const fileName of selectedFiles) {
            try {
                const res = await deleteFileApi(fileName);
                if (!res.error) {
                    setFiles((prev) => prev.filter((f) => (typeof f === "string" ? f !== fileName : f.name !== fileName)));
                } else {
                    //console.error(`Failed to delete ${fileName}:`, res.message);
                }
            } catch (err) {
                //console.error(`Error deleting ${fileName}:`, err);
            }
        }

        setSelectedFiles([]);
    };

    const fetchWithConcurrencyLimit = async (files, limit = 5, onProgress) => {
        const results = new Array(files.length);
        let inProgressCount = 0;
        let currentIndex = 0;
        let completed = 0;

        return new Promise((resolve) => {
            const next = async () => {
                if (currentIndex >= files.length) {
                    if (inProgressCount === 0) resolve(results);
                    return;
                }

                const i = currentIndex++;
                const file = files[i];
                inProgressCount++;

                const url = file.secure_url || imageSrc(file.public_id || file.name || file);
                try {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    results[i] = { file, blob };
                } catch (err) {
                    //console.error(`Failed to fetch`, err);
                    results[i] = null;
                } finally {
                    inProgressCount--;
                    completed++;
                    onProgress && onProgress(Math.round((completed / files.length) * 100));
                    next();
                }
            };

            for (let i = 0; i < limit && i < files.length; i++) {
                next();
            }
        });
    };

    const handleDownloadZip = async () => {
        setDownloading(true);
        setProgress(0);

        let filesToZip = selectedFiles.length > 0 ? files.filter((f) => selectedFiles.includes(typeof f === "string" ? f : f.name)) : filteredFiles.length > 0 ? filteredFiles : files;

        try {
            const zipKey = JSON.stringify(filesToZip.map((f) => (typeof f === "string" ? f : f.public_id || f.name)));
            if (zipCacheRef.current && zipCacheRef.current.key === zipKey) {
                saveAs(zipCacheRef.current.blob, "triova_media.zip");
                setDownloading(false);
                return;
            }

            const zip = new JSZip();
            const folder = zip.folder("triova_media");

            const blobs = await fetchWithConcurrencyLimit(filesToZip, 8, setProgress);
            blobs.filter(Boolean).forEach(({ file, blob }) => {
                const filename = file.name || file.public_id?.split("/").pop() || file;
                folder.file(filename, blob);
            });

            const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
                if (metadata.percent) setProgress(Math.round(metadata.percent));
            });

            zipCacheRef.current = { key: zipKey, blob: content };
            saveAs(content, "triova_media.zip");
        } catch (error) {
            //console.error("Error creating zip file:", error);
            alert("Failed to prepare ZIP file.");
        } finally {
            setDownloading(false);
            setProgress(0);
        }
    };

    const onZipUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.name.endsWith(".zip")) {
            alert("Please upload a valid .zip file.");
            return;
        }

        const zip = new JSZip();
        setUploadingZip(true);
        setUploadProgress(0);

        try {
            const content = await zip.loadAsync(file);
            const filesArray = Object.keys(content.files).filter((name) => !content.files[name].dir);
            const totalFiles = filesArray.length;

            let uploadedCount = 0;

            const uploadPromises = filesArray.map(async (filename) => {
                const zipEntry = content.files[filename];
                const fileData = await zipEntry.async("blob");

                const fileToUpload = new File([fileData], filename, {
                    type: fileData.type || "application/octet-stream",
                });

                const formData = new FormData();
                formData.append("file", fileToUpload);

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error(`Failed to upload ${filename}`);

                uploadedCount += 1;
                setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
            });

            await Promise.all(uploadPromises);
            alert("ZIP files uploaded successfully!");
            fetchFiles();
        } catch (err) {
            //console.error("ZIP Upload Error:", err);
            alert("Error uploading ZIP.");
        } finally {
            setUploadingZip(false);
            setUploadProgress(0);
            e.target.value = "";
        }
    };

    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingMedia(true);
        setUploadProgress(0);

        try {
            let uploadedCount = 0;

            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error(`Failed to upload ${file.name}`);

                uploadedCount += 1;
                setUploadProgress(Math.round((uploadedCount / files.length) * 100));
            });

            await Promise.all(uploadPromises);
            alert("Media files uploaded successfully!");
            fetchFiles();
        } catch (err) {
            //console.error("Media Upload Error:", err);
            alert("Error uploading media.");
        } finally {
            setUploadingMedia(false);
            setUploadProgress(0);
            e.target.value = "";
        }
    };

    const handleSelectAll = () => {
        const allSelected = filteredFiles.every((file) => {
            const name = typeof file === "string" ? file : file?.name;
            return selectedFiles.includes(name);
        });

        if (allSelected) {
            setSelectedFiles([]);
        } else {
            const names = filteredFiles.map((file) => (typeof file === "string" ? file : file?.name));
            setSelectedFiles(names);
        }
    };

    return (
        <div className="py-6">
            <input type="file" accept=".zip" ref={zipInputRef} onChange={onZipUpload} hidden />
            <input type="file" accept="image/*,video/*" multiple ref={mediaInputRef} onChange={handleMediaUpload} hidden />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Media Files <span className="text-sm font-medium text-gray-500">({files.length})</span>
                </h1>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by filename..."
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => zipInputRef.current?.click()}
                        disabled={uploadingZip}
                        className={`bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 ${uploadingZip ? "opacity-50" : ""}`}
                    >
                        {uploadingZip ? `Uploading ZIP... ${uploadProgress}%` : "Upload ZIP"}
                    </button>

                    <button
                        onClick={() => mediaInputRef.current?.click()}
                        disabled={uploadingMedia}
                        className={`bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 ${uploadingMedia ? "opacity-50" : ""}`}
                    >
                        {uploadingMedia ? `Uploading Media... ${uploadProgress}%` : "Upload Media"}
                    </button>

                    {filteredFiles.length > 0 && (
                        <button onClick={handleSelectAll} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                            {filteredFiles.every((file) => selectedFiles.includes(typeof file === "string" ? file : file?.name)) ? "Deselect All" : "Select All"}
                        </button>
                    )}

                    {selectedFiles.length > 0 && (
                        <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            Delete Selected ({selectedFiles.length})
                        </button>
                    )}

                    <button onClick={handleDownloadZip} disabled={downloading} className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${downloading ? "opacity-50" : ""}`}>
                        {downloading ? `Preparing ZIP... ${progress}%` : "Download All as ZIP"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-20 space-x-4">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading media...</p>
                </div>
            ) : filteredFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredFiles.map((file) => {
                        const fileName = typeof file === "string" ? file : file?.name || "unknown";
                        if (fileName === ".gitkeep") return null;

                        return (
                            <div key={fileName} className="relative flex flex-col bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                                <div className="absolute top-2 left-2 z-10">
                                    <input type="checkbox" checked={selectedFiles.includes(fileName)} onChange={() => toggleSelect(fileName)} className="w-4 h-4" />
                                </div>
                                <div className="absolute top-2 right-2 z-10">
                                    <button onClick={() => handleDelete(fileName)} className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                                <ClientImageWithLoader src={imageSrc(fileName)} alt={fileName} width={300} height={300} className="object-cover w-full h-40 bg-gray-100" />
                                <div className="p-3 bg-gray-50 border-t border-gray-200">
                                    <p className="text-gray-800 text-xs md:text-sm font-medium truncate" title={fileName}>
                                        {fileName}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500">No media files found for “{searchTerm}”.</p>
            )}
        </div>
    );
}
