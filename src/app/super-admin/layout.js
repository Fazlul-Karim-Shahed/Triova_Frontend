import Footer from "@/src/components/Admin/Footer/Footer";
import SuperAdminHeader from "@/src/components/Admin/SuperAdminHeader/SuperAdminHeader";
import SuperAdminContext from "@/src/context/SuperAdminContext";


export default function Adminlayout({ children }) {
    return (
        <div>
            <SuperAdminContext>
                <SuperAdminHeader />
                {children}
                {/* <Footer /> */}
            </SuperAdminContext>
        </div>
    )
}
