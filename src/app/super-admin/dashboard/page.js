"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIndividualTasksApi, updateTaskStatusApi } from "@/src/api/SuperAdminApi/TaskApi";

export default function SuperAdminDashboard() {
    const store = useSelector((state) => state.triova);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyTasks = async () => {
        setLoading(true);
        const res = await getIndividualTasksApi(store.decodedToken._id);
        if (res.error) setError(res.message);
        else setTasks(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const handleStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === "pending" ? "completed" : "pending";
        const res = await updateTaskStatusApi(taskId, { status: newStatus });
        if (!res.error) fetchMyTasks();
        else alert("Failed to update task status: " + res.message);
    };

    return (
        <div className="min-h-screen py-5 ">
            <h1 className="text-xl md:text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-transparent bg-clip-text drop-shadow-lg mb-14">
                ✨ My Fancy Tasks Dashboard ✨
            </h1>

            {loading && <p className="text-center text-lg text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && tasks.length === 0 && <p className="text-center text-gray-700 text-lg">No tasks assigned.</p>}

            <div className="space-y-10 max-w-6xl mx-auto">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="group relative w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                    >
                        {/* Top Row */}
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="text-2xl font-bold text-blue-900">{task.name}</h5>
                            <span className={`text-xs font-bold px-4 py-1 rounded-full shadow ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {task.status.toUpperCase()}
                            </span>
                        </div>

                        {/* Glossy Description Area */}
                        <div className="bg-white/60 backdrop-blur-lg border  rounded-xl p-4 text-sm text-gray-700 mb-6 shadow-inner">
                            <div dangerouslySetInnerHTML={{ __html: task.description }} />
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
                            <p>
                                <strong className="text-gray-900">📅 Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                            </p>
                            <p>
                                <strong className="text-gray-900">🔥 Priority:</strong> <span className="capitalize font-bold text-error">{task.priority}</span>
                            </p>

                            <p>
                                <strong className="text-gray-900"> 👤 Assigned By:</strong> <span className="capitalize">{task.assignedBy.firstName}</span>
                            </p>
                        </div>

                        {/* Beautiful Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleStatusChange(task._id, task.status)}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
                            >
                                Mark as {task.status === "pending" ? "Completed ✅" : "Pending ⏳"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
