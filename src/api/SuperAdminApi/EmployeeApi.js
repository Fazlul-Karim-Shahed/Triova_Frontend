import axios from "axios";

export const makePaymentApi = async (employeeId, body) => {
    try {
        const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/employee/${employeeId}/make-payment`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        });
        return res.data;
    } catch (err) {
        return {
            error: true,
            message: err?.response?.data?.message || "Failed",
        };
    }
};

export const updateEmployeeApi = async (employeeId, formData) => {
    try {
        const response = await axios.put(
            process.env.NEXT_PUBLIC_BACKEND_URL + `/api/employee/${employeeId}`, // Adjust endpoint as per your backend route
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
                },
            }
        );
        return { data: response.data, error: false };
    } catch (error) {
        console.error("Update employee error:", error.response || error.message);
        return { error: true, message: error.response?.data?.message || error.message };
    }
};
