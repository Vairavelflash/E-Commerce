import api from "@/lib/api"


export const checkoutCart = async() =>{
    const res = await api.post("orders/checkout")

    return res?.data
}

export const getOrders = async() =>{
    const res = await api.get("/orders");

    return res.data;
}