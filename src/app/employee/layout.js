
import AdminHeader from "@/src/components/Admin/AdminHeader/AdminHeader";
import EmployeeContext from "@/src/context/EmployeeContext";


export default function Adminlayout({ children }) {
    return (
        <div>
            <EmployeeContext>
                <AdminHeader />
                {children}
            </EmployeeContext>
        </div>
    )
}
