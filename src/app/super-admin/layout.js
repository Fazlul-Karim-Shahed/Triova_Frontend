
import AdminHeader from "@/src/components/Admin/AdminHeader/AdminHeader";

import SuperAdminContext from "@/src/context/SuperAdminContext";

export default function Adminlayout({ children }) {
    return (
        <div>
            <SuperAdminContext>
                <AdminHeader />
                {children}
                {/* <Footer /> */}
            </SuperAdminContext>
        </div>
    );
}
