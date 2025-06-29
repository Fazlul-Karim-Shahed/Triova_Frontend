"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import numberToText from 'number-to-text/converters/en-us'
import { getBatchByIdApi, updateBatchApi } from '@/src/api/SuperAdminApi/BatchApi'
import { Modal } from '@/src/components/Common/Modal/Modal'

export default function BatchDetailsPage() {
  const router = useRouter()
  const { batchId } = useParams()

  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({ error: false, message: '', open: false })

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
  })

  // Fetch batch data on mount
  useEffect(() => {
    async function fetchBatch() {
      setLoading(true)
      const data = await getBatchByIdApi(batchId)
      if (!data.error) {
        // Populate form with data
        setFormData({
          verified: data.data.verified ?? true,
          name: data.data.name || '',
          companyName: data.data.companyName || '',
          documents: null, // Documents not pre-filled; user must re-upload if needed
          description: data.data.description || '',
          orderDate: data.data.orderDate ? new Date(data.data.orderDate).toISOString().split('T')[0] : '',
          receiveDate: data.data.receiveDate ? new Date(data.data.receiveDate).toISOString().split('T')[0] : '',
          totalExpenses: data.data.totalExpenses || 0,
          expensesList: data.data.expensesList || [],
          expenseName: '',
          expenseAmount: '',
          incomesList: data.data.incomesList || [],
          incomeName: '',
          incomeAmount: '',
          totalIncomes: data.data.totalIncomes || 0
        })
      } else {
        setModalState({ error: true, message: data.message || 'Failed to fetch batch data', open: true })
      }
      setLoading(false)
    }
    fetchBatch()
  }, [batchId])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const addExpense = () => {
    if (!formData.expenseName || !formData.expenseAmount) return
    const newTotal = Number(formData.totalExpenses) + Number(formData.expenseAmount)
    setFormData({
      ...formData,
      expensesList: [...formData.expensesList, { name: formData.expenseName, amount: formData.expenseAmount }],
      expenseName: '',
      expenseAmount: '',
      totalExpenses: newTotal
    })
  }

  const deleteExpense = (index) => {
    const expenseAmount = Number(formData.expensesList[index].amount)
    const updatedList = formData.expensesList.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      expensesList: updatedList,
      totalExpenses: Number(formData.totalExpenses) - expenseAmount
    })
  }

  const addIncome = () => {
    if (!formData.incomeName || !formData.incomeAmount) return
    const newTotal = Number(formData.totalIncomes) + Number(formData.incomeAmount)
    setFormData({
      ...formData,
      incomesList: [...formData.incomesList, { name: formData.incomeName, amount: formData.incomeAmount }],
      incomeName: '',
      incomeAmount: '',
      totalIncomes: newTotal
    })
  }

  const deleteIncome = (index) => {
    const incomeAmount = Number(formData.incomesList[index].amount)
    const updatedList = formData.incomesList.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      incomesList: updatedList,
      totalIncomes: Number(formData.totalIncomes) - incomeAmount
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare data for update (handle files if needed)
    // If documents are required for update, handle separately

    const updateData = {
      ...formData,
      // documents: formData.documents (handle multipart/form-data on API side if needed)
    }

    const response = await updateBatchApi(batchId, updateData)

    setModalState({ error: response.error, message: response.message, open: true })

    if (!response.error) {
      // Redirect or refresh after success
      setTimeout(() => {
        router.push('/super-admin/dashboard/batch')
      }, 1500)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-xl font-semibold animate-pulse">
        Loading batch details...
      </div>
    )
  }

  return (
    <div className="mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border max-w-4xl">
      <h1 className="text-3xl text-center font-bold mb-8">Update Batch</h1>

      <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">

        <div>
          <label className="block text-gray-700 mb-1">Batch Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Company Name / Dealer</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Documents (Upload to replace)</label>
          <input multiple type="file" name="documents" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Order Date</label>
          <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Receive Date</label>
          <input type="date" name="receiveDate" value={formData.receiveDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
        </div>

        {/* Expenses Section */}
        <div>
          <label className="block text-gray-700 my-5 text-2xl font-bold">Edit Expenses</label>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-gray-700 mb-1">Expense Name</label>
              <input
                placeholder="T-shirt 100 piece"
                type="text"
                name="expenseName"
                value={formData.expenseName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Amount (BDT)</label>
              <input
                placeholder="1000"
                type="number"
                name="expenseAmount"
                value={formData.expenseAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <button onClick={addExpense} className="btn btn-neutral btn-sm text-white md:mt-8" type="button">
                Add Expense
              </button>
            </div>
          </div>

          <table className="border-2 rounded mt-7 w-full">
            <thead>
              <tr className="border-2">
                <th className="border-2 p-2">No.</th>
                <th className="border-2 p-2">Expense</th>
                <th className="p-2">Amount</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {formData.expensesList.map((item, index) => (
                <tr className="border-2" key={index}>
                  <td className="border-2 p-2">{index + 1}</td>
                  <td className="border-2 p-2">{item.name}</td>
                  <td className="border-2 p-2">{item.amount}</td>
                  <td className="border-2 p-2">
                    <button onClick={() => deleteExpense(index)} type="button" className="btn btn-error btn-xs text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-5 text-xl font-semibold">Total Expenses: {formData.totalExpenses} BDT</h2>
          <h3>{formData.totalExpenses} taka</h3>
        </div>

        {/* Incomes Section */}
        <div>
          <label className="block text-gray-700 my-5 text-2xl font-bold">Edit Incomes</label>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-gray-700 mb-1">Income Name</label>
              <input
                placeholder="Payment from client"
                type="text"
                name="incomeName"
                value={formData.incomeName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Amount (BDT)</label>
              <input
                placeholder="1000"
                type="number"
                name="incomeAmount"
                value={formData.incomeAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <button onClick={addIncome} className="btn btn-neutral btn-sm text-white md:mt-8" type="button">
                Add Income
              </button>
            </div>
          </div>

          <table className="border-2 rounded mt-7 w-full">
            <thead>
              <tr className="border-2">
                <th className="border-2 p-2">No.</th>
                <th className="border-2 p-2">Income</th>
                <th className="p-2">Amount</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {formData.incomesList.map((item, index) => (
                <tr className="border-2" key={index}>
                  <td className="border-2 p-2">{index + 1}</td>
                  <td className="border-2 p-2">{item.name}</td>
                  <td className="border-2 p-2">{item.amount}</td>
                  <td className="border-2 p-2">
                    <button onClick={() => deleteIncome(index)} type="button" className="btn btn-error btn-xs text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-5 text-xl font-semibold">Total Incomes: {formData.totalIncomes} BDT</h2>
          {/* <h3>{numberToText(formData.totalIncomes)} taka</h3> */}
          <h3>{formData.totalIncomes} taka</h3>
        </div>

        {/* Verified Checkbox */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Verified</span>
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary mt-6 text-white font-bold text-xl"
          >
            Update Batch
          </button>
        </div>
      </form>

      {modalState.open && (
        <Modal
          open={modalState.open}
          setOpen={(open) => setModalState((s) => ({ ...s, open }))}
          error={modalState.error}
          message={modalState.message}
        />
      )}
    </div>
  )
}
