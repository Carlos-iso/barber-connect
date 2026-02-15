import { cutsData, Cut } from "./cutsData";
import { ordersData } from "./ordersData";

export interface DashboardData {
	totalCuts: number;
	totalOrders: number;
	cuts: Cut[];
}

async function getDashboardData(): Promise<DashboardData> {
	// Buscar dados em paralelo
	const [cuts, orders] = await Promise.all([
		cutsData.getCutsByUser(),
		ordersData.getOrdersByUser(),
	]);

	return {
		totalCuts: cuts.length,
		totalOrders: orders.length,
		cuts,
	};
}

export const dashboardData = {
	getDashboardData,
};
