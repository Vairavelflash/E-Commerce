import api from "@/lib/api"



export const getCart = async () =>{
    const res = await api.get("/cart");

    return res.data.data;
}

export const addToCart = async(productId) =>{
    const res = await api.post("/cart/items",{
        productId,
        quantity:1
    })

    return res.data;
}

export const updateCartQuantity = async({cartItemId,quantity}) =>{
  
    const res = await api.patch(`/cart/items/${cartItemId}`,{quantity:quantity});
    return res.data
}

export const removeCartItem = async(cartItemId) =>{

    const res = await api.delete(`/cart/items/${cartItemId}`)

    return res.data;
}