

export const addCart = (productId, color, size, quantity) => {

    let cart = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) || [];

    const productInCart = cart.find((product) => product.productId === productId && product.color === color && product.size === size);

    if (productInCart) {
        productInCart.quantity = quantity;
    } else {
        cart.push({ productId, color, size, quantity });
    }

    localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME, JSON.stringify(cart));

}

export const removeCart = (productId, color, size) => {
    
        let cart = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) || [];
    
        cart = cart.filter((product) => product.productId !== productId || product.color !== color || product.size !== size);
    
        localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME, JSON.stringify(cart));
    
}
    
export const updateCart = (productId, color, size, quantity) => {
        
            let cart = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) || [];
        
            const productInCart = cart.find((product) => product.productId === productId && product.color === color && product.size === size);
        
            if (productInCart) {
                productInCart.quantity = quantity;
            }
        
    localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME, JSON.stringify(cart));
    
        
}

export const getCartNumber = () => {

    let cart = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) || [];

    return cart.length;
    
}
    
