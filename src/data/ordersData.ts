import { authData } from "./authData";

const { api } = authData;

export interface ServiceItem {
	name: string;
	price: number;
}

export interface Order {
	_id?: string;
	id?: string;
	customerName: string;
	date: string;
	status: "pending" | "completed" | "canceled";
	totalPrice: number;
	services: ServiceItem[];
	barberId?: string;
}

export interface CreateOrderData {
	customerName: string;
	services: ServiceItem[];
	totalPrice: number;
	date?: string;
}

async function createOrder(data: CreateOrderData): Promise<Order> {
	const response = await api.post("/service-orders", {
		...data,
		date: data.date || new Date().toISOString(),
		status: "pending",
	});
	return response.data;
}

async function getOrdersByUser(): Promise<Order[]> {
	const response = await api.get("/service-orders");
	return response.data;
}

async function getOrderById(id: string): Promise<Order> {
	const response = await api.get(`/service-orders/${id}`);
	return response.data;
}

async function updateOrderStatus(
	id: string,
	status: "pending" | "completed" | "canceled",
): Promise<Order> {
	const response = await api.put(`/service-orders/${id}`, { status });
	return response.data;
}

async function deleteOrder(id: string): Promise<void> {
	await api.delete(`/service-orders/${id}`);
}

export const ordersData = {
	createOrder,
	getOrdersByUser,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
};
