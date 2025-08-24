import apiClient from "./client";

import type { CreateOrderResponse, OrderPayload } from "../../types/order";

const ORDER_BASE_URL = "/api/v1/orders";

export const createOrder = async (orderData: OrderPayload): Promise<CreateOrderResponse> => {
    try {
        const response = await apiClient.post(`${ORDER_BASE_URL}`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};
