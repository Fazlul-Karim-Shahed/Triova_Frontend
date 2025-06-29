import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import ShowDepartments from "@/src/components/Admin/Department/ShowDepartments";
import Link from "next/link";

export default async function Department() {

    let departments = await getAllDepartmentApi()

    return (
        <div>
            {departments.error ? <div className="text-2xl text-center p-20 font-bold">
                {departments.message} <br />
                <Link className="btn btn-sm mt-3 btn-success text-white" href='/super-admin/dashboard/department/create'>Create New</Link>
            </div> : <ShowDepartments departments={departments.data} />}
        </div>
    )
}