import EmployeeHeader from "@/src/components/Admin/EmployeeHeader/EmployeeHeader";
import EmployeeContext from "@/src/context/EmployeeContext";


export default function Adminlayout({ children }) {
    return (
        <div>
            <EmployeeContext>
                <EmployeeHeader />
                {children}
            </EmployeeContext>
        </div>
    )
}
