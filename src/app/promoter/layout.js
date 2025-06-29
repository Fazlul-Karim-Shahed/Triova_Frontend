import SuperAdminHeader from "@/src/components/Admin/AdminHeader/AdminHeader";
import PromoterContext from "@/src/context/PromoterContext";

export default function Adminlayout({ children }) {
    return (
        <div>
            <PromoterContext>
                <SuperAdminHeader />
                {children}
                {/* <Footer /> */}
            </PromoterContext>
        </div>
    );
}
