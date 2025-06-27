"use client";

import { getAllTasksApi, updateTaskStatusApi, deleteTaskApi } from "@/src/api/SuperAdminApi/TaskApi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AllTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        const data = await getAllTasksApi();
        if (data.error) setError(data.message);
        else {
            setTasks(data.data);
            setError("");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        if (window.confirm("Are you sure you want to update the status of this task?")) {
            setUpdatingTaskId(taskId);
            const res = await updateTaskStatusApi(taskId, { status: newStatus });
            if (!res.error) fetchTasks();
            else alert("Failed to update status: " + res.message);
            setUpdatingTaskId(null);
        }
    };

    const handleDelete = async (taskId) => {
        const confirm = window.confirm("Are you sure you want to delete this task?");
        if (!confirm) return;

        setDeletingTaskId(taskId);
        const res = await deleteTaskApi(taskId);
        if (!res.error) fetchTasks();
        else alert("Failed to delete task: " + res.message);
        setDeletingTaskId(null);
    };

    return (
        <div className="min-h-screen py-5">
            <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-brand-600 to-pink-500 mb-10 drop-shadow-md">📋 Manage All Tasks</h2>

            <div className="text-end">
                <Link href={'/super-admin/dashboard/task/create'} className="btn btn-neutral btn-sm mb-10">create new task</Link>
            </div>

            {loading && <p className="text-center text-lg text-gray-500">Loading tasks...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && tasks.length === 0 && <p className="text-center text-gray-600 text-lg">No tasks found.</p>}

            {!loading && !error && tasks.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="col-span-1 lg:col-span-1 bg-white rounded-3xl shadow-xl overflow-hidden border-l-[6px] border-brand-500 transition-transform duration-300 hover:scale-[1.01]"
                        >
                            {/* Gradient Header */}
                            <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white font-semibold text-lg flex justify-between items-center">
                                <span>{task.name}</span>
                                <span className={`text-xs px-3 py-1 rounded-full ${task.status === "completed" ? "bg-green-200 text-green-900" : "bg-yellow-200 text-yellow-900"}`}>
                                    {task.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl shadow-inner">
                                    <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <p>
                                        <strong>📅 Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>🔥 Priority:</strong> <span className="capitalize">{task.priority}</span>
                                    </p>
                                    <p>
                                        <strong>👤 Assigned To:</strong> {task?.assignedTo?.firstName || "Unknown"}
                                    </p>
                                    <p>
                                        <strong>🧑 Assigned By:</strong> {task?.assignedBy?.firstName || "Unknown"}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                                    {/* Status Selector */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium text-gray-800">Status:</span>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            disabled={updatingTaskId === task._id}
                                            className="border border-gray-300 px-3 py-1 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        disabled={deletingTaskId === task._id}
                                        className="text-red-600 hover:text-red-800 hover:underline transition text-sm"
                                    >
                                        {deletingTaskId === task._id ? "Deleting..." : "🗑 Delete Task"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
