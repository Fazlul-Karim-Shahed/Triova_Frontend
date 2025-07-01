import React from "react";
import Logo from "@/public/Logo.svg";
import Image from "next/image";

const InvoiceTemplate = ({ order }) => {
    return (
        order && (
            <div>
                <style>{`
          .container { padding-top: 1rem; font-size: 13px; max-width: 900px; margin: auto; }
          .section { padding: 1.25rem 2rem; }
          .table { width: 100%; border-collapse: collapse; }
          .align-top { vertical-align: top; }
          .text-sm { font-size: 0.8125rem; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .text-main { color: #1e293b; }
          .text-primary-700 { color: #1d4ed8; }
          .text-neutral-600 { color: #52525b; }
          .text-neutral-700 { color: #3f3f46; }
          .text-slate-400 { color: #94a3b8; }
          .text-slate-300 { color: #cbd5e1; }
          .text-blue-700 { color: #1d4ed8; }
          .bg-slate-100 { background-color: #f1f5f8; }
          .bg-primary-600 { background-color: #2563eb; }
          .text-white { color: white; }
          .font-bold { font-weight: bold; }
          .italic { font-style: italic; }
          .whitespace-nowrap { white-space: nowrap; }

          .border-b { border-bottom: 1px solid #e5e7eb; }
          .border-b-2 { border-bottom: 2px solid #1d4ed8; }
          .border-r { border-right: 1px solid #e5e7eb; }

          .pl-2 { padding-left: 0.5rem; }
          .pl-3 { padding-left: 0.75rem; }
          .pr-3 { padding-right: 0.75rem; }
          .pr-4 { padding-right: 1rem; }
          .pl-4 { padding-left: 1rem; }
          .p-3 { padding: 0.75rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
          .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }

          .w-full { width: 100%; }
          .w-half { width: 50%; }

          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #f1f5f9;
            width: 100%;
            color: #52525b;
            text-align: center;
            font-size: 0.75rem;
            padding: 0.75rem 0;
          }

          .product-col {
            max-width: 200px;
            overflow: hidden;
          }

          .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }

          @media print {
            body, .container {
              font-size: 10px !important;
              margin: 0 auto;
            }

            .section {
              padding: 0.75rem 1rem !important;
            }

            .table td, .table th {
              padding: 0.3rem !important;
            }

            .text-sm {
              font-size: 0.75rem !important;
            }

            footer {
              font-size: 0.65rem !important;
              padding: 0.5rem 0 !important;
            }

            .bg-primary-600 {
              background-color: #2563eb !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .text-primary-700 {
              color: #1d4ed8 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>

                <div className="container">
                    <div className="section">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="w-full align-top">
                                        <Image width={130} height={35} src={Logo} alt="Triova Logo" />
                                    </td>
                                    <td className="align-top">
                                        <div className="text-sm">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td className="border-r pr-4">
                                                            <p className="whitespace-nowrap text-slate-400 text-right">Date</p>
                                                            <p className="whitespace-nowrap font-bold text-main text-right">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                        </td>
                                                        <td className="pl-4">
                                                            <p className="whitespace-nowrap text-slate-400 text-right">Invoice #</p>
                                                            <p className="whitespace-nowrap font-bold text-main text-right">{order.orderNo}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ backgroundColor: "#f1f5f9" }} className="section bg-slate-100 text-sm">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="w-half align-top text-neutral-600">
                                        <p className="font-bold">Triova BD</p>
                                        +88 01312379588 <br />
                                        24/3A Khilkhet, Dhaka, 1229 <br />
                                        Bangladesh <br />
                                    </td>
                                    <td className="w-half align-top text-right text-neutral-600">
                                        <p className="font-bold">Mr. {order.name}</p>
                                        {order.mobile} <br />
                                        {order.shippingAddress} <br />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="section text-sm text-neutral-700">
                        <table className="table">
                            <thead>
                                <tr className="text-primary-700">
                                    <td className="border-b-2 pb-3 pl-3 font-bold">#</td>
                                    <td className="border-b-2 pb-3 pl-2 font-bold">Product details</td>
                                    <td className="border-b-2 pb-3 pl-2 text-right font-bold">Price</td>
                                    <td className="border-b-2 pb-3 pl-2 text-center font-bold">Qty.</td>
                                    <td className="border-b-2 pb-3 pl-2 text-center font-bold">VAT</td>
                                    <td className="border-b-2 pb-3 pl-2 text-right font-bold">Subtotal</td>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderList &&
                                    order.orderList.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border-b py-3 pl-3">{index + 1}</td>
                                            <td className="border-b py-3 pl-2 product-col">{item.productId.name}</td>
                                            <td className="border-b py-3 pl-2 text-right">BDT {item.productId.sellingPrice}</td>
                                            <td className="border-b py-3 pl-2 text-center">{item.quantity}</td>
                                            <td className="border-b py-3 pl-2 text-center">0%</td>
                                            <td className="border-b py-3 pl-2 text-right">{item.quantity * item.productId.sellingPrice}</td>
                                        </tr>
                                    ))}
                                <tr>
                                    <td colSpan="6">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td className="w-full"></td>
                                                    <td>
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="border-b p-3">
                                                                        <div className="whitespace-nowrap text-slate-700 ">Net total:</div>
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }} className="border-b text-blue-700 w-full p-3">
                                                                        <div className="whitespace-nowrap font-bold text-main">BDT {order.mainPrice}</div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border-b p-3">
                                                                        <div className="whitespace-nowrap text-slate-700 ">Discount:</div>
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }} className="border-b text-blue-700 w-full p-3">
                                                                        <div className="whitespace-nowrap font-bold text-main">BDT {order.discountedAmount}</div>
                                                                    </td>
                                                                </tr>
                                                                {/* <tr>
                                                                  <td className="p-3 border-b">
                                                                      <div className="whitespace-nowrap text-slate-700">VAT total:</div>
                                                                  </td>
                                                                  <td style={{ textAlign: "right" }} className="text-primary-700 border-b p-3">
                                                                      <div className="whitespace-nowrap font-bold text-main">BDT 0.00</div>
                                                                  </td>
                                                              </tr> */}
                                                                <tr>
                                                                    <td className="p-3 ">
                                                                        <div className="whitespace-nowrap text-slate-700">Delivery Charge:</div>
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }} className="text-primary-700 p-3">
                                                                        <div className="whitespace-nowrap font-bold text-main">BDT {order.deliveryCharge}</div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="bg-primary-600 p-3">
                                                                        <div className="whitespace-nowrap font-bold text-white">Total:</div>
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }} className="bg-primary-600 p-3 text-right">
                                                                        <div className="whitespace-nowrap font-bold text-white">BDT {order.totalPrice + order.deliveryCharge}</div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="section text-sm text-neutral-700">
                        <p className="text-main font-bold">PAYMENT DETAILS</p>
                        <p>Method: {order.paymentMethod}</p>
                        <p className="text-primary-700">Status: {order.paymentStatus}</p>
                    </div>

                    <div className="section text-sm text-neutral-700">
                        <p className="text-main font-bold">DELIVERY DETAILS</p>
                        <p>Method: {order.deliveryMethod ? order.deliveryMethod.name : "N/A"}</p>
                        <p className="text-primary-700">Charge: BDT {order.deliveryCharge}</p>
                    </div>

                    <div className="section text-sm text-neutral-700">
                        <p className="text-main font-bold">NOTES</p>
                        <p className="italic">{order.orderNotes}</p>
                    </div>

                    <footer>
                        Triova BD © {new Date().getFullYear()} | All rights reserved
                        <span className="text-slate-300 px-2">|</span>
                        triovabd@gmail.com
                        <span className="text-slate-300 px-2">|</span>
                        +880 1312379588
                    </footer>
                </div>
            </div>
        )
    );
};

export default InvoiceTemplate;
