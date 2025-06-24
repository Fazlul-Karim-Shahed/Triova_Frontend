
import Link from 'next/link'
import React from 'react'

export default function BatchDetails({data}) {


  

  return (
    <div>

      {!data.error ?
        
        <div className='overflow-x-auto rounded-lg'>
          <table className="table table-bordered border rounded-lg">

            <thead className='bg-gray-100'>
              <tr>
                <th>Batch Name</th>
                <th>Company</th>
                <th>Date</th>
                <th>Expense</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => {
                return <tr key={index} className="hover:bg-green-50">
                  <td>{item.name}</td>
                  <td>{item.companyName}</td>
                  <td>{new Date(item.orderDate).toLocaleDateString()}</td>
                  <td>{item.totalExpenses}</td>
                  <td className="space-y-4">
                    <Link href={`/super-admin/dashboard/batch/${item._id}`} className="bg-primary py-1 px-2 md:m-4 rounded text-sm text-white font-bold">Edit</Link>
                    <button className="bg-error py-1 px-2 md:m-4 rounded text-sm text-white font-bold">Delete</button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div> : <p>{data.message}</p>

      }
    </div>
  )
}
