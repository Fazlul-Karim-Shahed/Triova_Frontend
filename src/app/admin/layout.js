import AdminHeader from "@/src/components/Admin/AdminHeader/AdminHeader";
import AdminContext from "@/src/context/AdminContext";


export default function Adminlayout({ children }) {
    return (
        <div>
            <AdminContext>
                <AdminHeader />
                {children}
            </AdminContext>
        </div>
    )
}
