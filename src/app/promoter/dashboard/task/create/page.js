"use client";

import { getAllAdminApi } from "@/src/api/AuthApi";
import { createTaskApi } from "@/src/api/SuperAdminApi/TaskApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
});

export default function CreateTaskPage() {
    const store = useSelector((state) => state.triova);
    const [admins, setAdmins] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const config = {
        placeholder: "Write task....",
    };

    console.log(store.decodedToken)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        deadline: "",
        priority: "high",
        status: "pending",
        assignedTo: "",
        assignedBy: store.decodedToken._id,
    });

    useEffect(() => {
        setModalState({ message: "Fetching admins. Please wait...", open: 1, loading: 1 });
        getAllAdminApi().then((res) => {
            if (res.error) {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            } else {
                console.log(res.data);
                setAdmins(res.data);
                setModalState({ error: res.error, message: res.message, open: 0, loading: 0 });
            }
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalState({ error: false, message: "Creating task. Please wait...", open: 1, loading: 1 });
        createTaskApi({ ...formData, description: content, email: store.decodedToken.email }).then((res) => {
            if (res.error) {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            } else {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
                e.target.reset();
            }
        });
    };

    return (
        <div className="mx-auto p-6 bg-white rounded">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">
                        Task Name
                    </label>
                    <input id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium mb-1">
                        Description
                    </label>
                    <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={(newContent) => setContent(newContent)} onChange={(newContent) => {}} />
                </div>

                <div>
                    <label htmlFor="deadline" className="block font-medium mb-1">
                        Deadline
                    </label>
                    <input id="deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="priority" className="block font-medium mb-1">
                        Priority
                    </label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="status" className="block font-medium mb-1">
                        Status
                    </label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="assignedTo" className="block font-medium mb-1">
                        Assigned To (SuperAdmin ID)
                    </label>
                    <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Admin</option>
                        {admins.map((admin) => (
                            <option key={admin._id} value={admin._id}>
                                {admin.firstName + " " + admin.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="assignedBy" className="block font-medium mb-1">
                        Assigned By (SuperAdmin ID)
                    </label>
                    <input id="assignedBy" name="assignedBy" value={formData.assignedBy} onChange={handleChange} disabled className="w-full border p-2 rounded bg-gray-100" />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Task
                </button>
            </form>

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />
        </div>
    );
}
