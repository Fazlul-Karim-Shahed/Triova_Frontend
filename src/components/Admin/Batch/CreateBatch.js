

"use client"
import { useState } from 'react';
import { Modal } from '../../Common/Modal/Modal';
import numberToText from 'number-to-text/converters/en-us'; 
import { createBatchpi } from '@/src/api/SuperAdminApi/BatchApi';


export default function CreateBatch() {


    const [modalState, setModalState] = useState({ error: false, message: '', open: false });

    const [formData, setFormData] = useState({

        verified: true,

        name: '',
        companyName: '',
        documents: null,
        description: '',

        orderDate: '',
        receiveDate: '',
        totalExpenses: 0,
        expensesList: [],
        expenseName: '',
        expenseAmount: '',
        incomesList: [],
        incomeName: '',
        incomeAmount: '',
        totalIncomes: 0

    });

    const handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createBatchpi(formData).then(data => {
            setModalState({ error: data.error, message: data.message, open: true })
        })
    };



    const addExpense = () => {

        setFormData({
            ...formData,
            expensesList: [...formData.expensesList, {
                name: formData.expenseName,
                amount: formData.expenseAmount
            }],
            expenseName: '',
            expenseAmount: '',
            totalExpenses: Number(formData.totalExpenses) + Number(formData.expenseAmount)
        })

    }


    const deleteExpenses = index => {
        setFormData({
            ...formData,
            expensesList: formData.expensesList.toSpliced(index, 1),
            totalExpenses: Number(formData.totalExpenses) - Number(formData.expensesList[index].amount)
        })
    }


    const addIncome = () => {

        setFormData({
            ...formData,
            incomesList: [...formData.incomesList, {
                name: formData.incomeName,
                amount: formData.incomeAmount
            }],
            incomeName: '',
            incomeAmount: '',
            totalIncomes: Number(formData.totalIncomes) + Number(formData.incomeAmount)
        })

    }


    const deleteIncome = index => {
        setFormData({
            ...formData,
            incomesList: formData.incomesList.toSpliced(index, 1),
            totalIncomes: Number(formData.totalIncomes) - Number(formData.incomesList[index].amount)
        })
    }



    return (
        <div>


            <div className="mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border">

                <h1 className="text-3xl text-center font-bold mb-8">Create Batch </h1>

                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">


                    <div>
                        <label className="block text-gray-700 mb-1">Batch Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Compamny Name/ Dealer </label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Documents</label>
                        <input multiple type="file" name="documents" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>


                    <div>
                        <label className="block text-gray-700 mb-1">Order Date</label>
                        <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>


                    <div>
                        <label className="block text-gray-700 mb-1">Receive Date</label>
                        <input type="date" name="receiveDate" value={formData.receiveDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>


                    <div className=''>
                        <label className="block text-gray-700 my-5 text-2xl font-bold">Add Expenses</label>
                        <div className="grid md:grid-cols-3 gap-5">

                            <div>
                                <label className="block text-gray-700 mb-1">Expense Name</label>
                                <input placeholder='T-shirt 100 piece' type="text" value={formData.expenseName} name="expenseName" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Amount (BDT)</label>
                                <input placeholder='1000' value={formData.expenseAmount} type="number" name="expenseAmount" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <button onClick={() => addExpense()} className='btn btn-neutral btn-sm text-white md:mt-8' type='button'>Add Expense</button>
                            </div>

                        </div>

                        <div>
                            <table className='border-2 rounded mt-7 w-full'>
                                <tr className='border-2'>
                                    <th className='border-2 p-2'>No.</th>
                                    <th className='border-2 p-2'>Expense</th>
                                    <th className='p-2'>Amount</th>
                                    <th className='p-2'></th>
                                </tr>

                                {formData.expensesList.map((item, index) => (
                                    <tr className='border-2'>
                                        <td className='border-2 p-2'>{index + 1}</td>
                                        <td className='border-2 p-2'>{item.name}</td>
                                        <td className='border-2 p-2'>{item.amount}</td>
                                        <td onClick={() => deleteExpenses(index)} className='border p-2 text-xs text-center'> <button type='button' className='btn btn-sm btn-neutral'>Delete</button> </td>
                                    </tr>
                                ))}

                                <tr className=''> 
                                    <td className='p-2'></td>
                                    <td className=' border-e-2 text-center font-bold p-2'>Total</td>
                                    <td className='p-2'>{formData.totalExpenses} ({numberToText.convertToText(formData.totalExpenses)} Taka Only) </td>

                                </tr>

                            </table>
                        </div>

                    </div>


                    <div className=''>
                        <label className="block text-gray-700 my-5 text-2xl font-bold">Add Incomes</label>
                        <div className="grid md:grid-cols-3 gap-5">

                            <div>
                                <label className="block text-gray-700 mb-1">Income Name</label>
                                <input placeholder='T-shirt 100 piece' type="text" name="incomeName" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Amount (BDT)</label>
                                <input placeholder='1000" ' type="number" name="incomeAmount" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <button onClick={() => addIncome()} className='btn btn-neutral btn-sm text-white md:mt-8' type='button'>Add Income</button>
                            </div>

                        </div>

                        <div>
                            <table className='border-2 rounded mt-7 w-full'>
                                <tr className='border-2'>
                                    <th className='border-2 p-2'>No.</th>
                                    <th className='border-2 p-2'>Income</th>
                                    <th className='p-2'>Amount</th>
                                    <th className='p-2'></th>
                                </tr>

                                {formData.incomesList.map((item, index) => (
                                    <tr className='border-2'>
                                        <td className='border-2 p-2'>{index + 1}</td>
                                        <td className='border-2 p-2'>{item.name}</td>
                                        <td className='border-2 p-2'>{item.amount}</td>
                                        <td onClick={() => deleteIncome(index)} className='border p-2 text-xs text-center'> <button type='button' className='btn btn-sm btn-neutral'>Delete</button> </td>
                                    </tr>
                                ))}

                                <tr className=''>
                                    <td className='p-2'></td>
                                    <td className=' border-e-2 text-center font-bold p-2'>Total</td>
                                    <td className='p-2'>{formData.totalIncomes} ({numberToText.convertToText(formData.totalIncomes)} Taka Only) </td>

                                </tr>

                            </table>
                        </div>

                    </div>



                    <div>
                        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
                            Submit
                        </button>
                    </div>
                </form>


                <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
            </div>

        </div>
    )
}
