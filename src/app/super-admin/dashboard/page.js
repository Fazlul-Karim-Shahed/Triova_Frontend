"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIndividualTasksApi, updateTaskStatusApi } from "@/src/api/SuperAdminApi/TaskApi";

export default function SuperAdminDashboard() {
    const store = useSelector((state) => state.triova);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    const fetchMyTasks = async () => {
        setLoading(true);
        const res = await getIndividualTasksApi(store.decodedToken._id);
        if (res.error) setError(res.message);
        else {
            setTasks(res.data);
            setError("");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const handleStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === "pending" ? "completed" : "pending";
        setUpdatingTaskId(taskId);
        const res = await updateTaskStatusApi(taskId, { status: newStatus });
        if (!res.error) fetchMyTasks();
        else alert("Failed to update task status: " + res.message);
        setUpdatingTaskId(null);
    };

    const filteredTasks = tasks.filter((task) => task.status === (showCompleted ? "completed" : "pending"));

    return (
        <div className="min-h-screen px-4 py-5 sm:px-6">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-transparent bg-clip-text drop-shadow-lg mb-6">
                ✨ My Fancy Dashboard ✨
            </h1>

            <div className="flex justify-center mb-10">
                <button onClick={() => setShowCompleted((prev) => !prev)} className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
                    {showCompleted ? "🔄 Show Pending Tasks" : "✅ See Completed Tasks"}
                </button>
            </div>

            {loading && <p className="text-center text-lg text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && filteredTasks.length === 0 && <p className="text-center text-gray-700 text-lg">No {showCompleted ? "completed" : "pending"} tasks assigned.</p>}

            {/* Pending tasks in card view */}
            {!loading && !error && !showCompleted && filteredTasks.length > 0 && (
                <div className="space-y-10 max-w-6xl mx-auto">
                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className="group relative w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                        >
                            {/* Top Row */}
                            <div className="flex justify-between items-start flex-wrap gap-y-2 mb-4">
                                <h5 className="text-xl sm:text-2xl font-bold text-blue-900 break-words">{task.name}</h5>
                                <span className={`text-xs font-bold px-4 py-1 rounded-full shadow ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {task.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="bg-white/60 backdrop-blur-lg border rounded-xl p-4 text-base text-gray-700 mb-6 shadow-inner break-words">
                                <div dangerouslySetInnerHTML={{ __html: task.description }} />
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-gray-600 text-base mb-6">
                                <p>
                                    <strong className="text-gray-900">📅 Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className="text-gray-900">🔥 Priority:</strong> <span className="capitalize font-bold text-error">{task.priority}</span>
                                </p>
                                <p>
                                    <strong className="text-gray-900">👤 Assigned By:</strong> <span className="capitalize">{task.assignedBy.firstName}</span>
                                </p>
                            </div>

                            {/* Button */}
                            <div className="flex justify-end sm:justify-end">
                                <button
                                    onClick={() => handleStatusChange(task._id, task.status)}
                                    disabled={updatingTaskId === task._id}
                                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
                                >
                                    {updatingTaskId === task._id ? "Updating..." : `Mark as ${task.status === "pending" ? "Completed ✅" : "Pending ⏳"}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed tasks in table view */}
            {!loading && !error && showCompleted && filteredTasks.length > 0 && (
                <div className="overflow-auto max-w-6xl mx-auto rounded-xl shadow-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <tr>
                                <th className="text-left p-3">Task</th>
                                <th className="text-left p-3">Deadline</th>
                                <th className="text-left p-3">Priority</th>
                                <th className="text-left p-3">Assigned By</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredTasks.map((task) => (
                                <tr key={task._id}>
                                    <td className="p-3 font-semibold text-gray-800">{task.name}</td>
                                    <td className="p-3">{new Date(task.deadline).toLocaleDateString()}</td>
                                    <td className="p-3 capitalize">{task.priority}</td>
                                    <td className="p-3 capitalize">{task.assignedBy?.firstName || "Unknown"}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleStatusChange(task._id, task.status)}
                                            disabled={updatingTaskId === task._id}
                                            className="text-sm text-purple-600 hover:text-purple-800 underline"
                                        >
                                            {updatingTaskId === task._id ? "Updating..." : "Mark as Pending"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
