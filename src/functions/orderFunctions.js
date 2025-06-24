

export const saveOrder = orderId => {

    let orders = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_ORDER_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_ORDER_NAME)) : [];

    orders.push(orderId);

    localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_ORDER_NAME, JSON.stringify(orders));

}