import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resourceData } from "@/data/resourceData";
import { RESOURCES } from "@/data/resourcesConfig";
import { ordersData } from "@/data/ordersData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Plus, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ResourceCounts {
	[key: string]: number;
}

const Dashboard = () => {
	const [resourceCounts, setResourceCounts] = useState<ResourceCounts>({});
	const [totalOrders, setTotalOrders] = useState(0);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { user, signOut } = useAuth();

	useEffect(() => {
		loadDashboard();
	}, []);

	const loadDashboard = async () => {
		try {
			// Carregar contagens de todos os resources em paralelo
			const countsPromises = RESOURCES.map(async (resource) => {
				const count = await resourceData.getResourceCount(resource.key);
				return { key: resource.key, count };
			});

			const counts = await Promise.all(countsPromises);

			// Converter array para objeto
			const countsObj: ResourceCounts = {};
			counts.forEach(({ key, count }) => {
				countsObj[key] = count;
			});

			setResourceCounts(countsObj);

			// Carregar total de atendimentos
			try {
				const orders = await ordersData.getOrdersByUser();
				setTotalOrders(orders.length);
			} catch (error) {
				console.error("Erro ao carregar ordens:", error);
				setTotalOrders(0);
			}
		} catch (error) {
			console.error("Erro ao carregar dashboard:", error);
		} finally {
			setLoading(false);
		}
	};

	// Helper para obter ícone dinamicamente
	const getIcon = (iconName: string) => {
		const IconComponent = (Icons as any)[iconName];
		return IconComponent ? (
			<IconComponent className="w-4 h-4" />
		) : (
			<Icons.Circle className="w-4 h-4" />
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex flex-col safe-top safe-bottom">
			{/* Header */}
			<header className="relative pt-12 pb-8 px-6">
				<div className="absolute top-4 right-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={signOut}
						className="text-muted-foreground hover:text-destructive"
					>
						Sair
					</Button>
				</div>
				<h1 className="title-accessible text-foreground mb-2">Dashboard</h1>
				<p className="text-accessible text-muted-foreground">
					Olá, {user?.name || "Barbeiro"}!
				</p>
			</header>

			{/* Métricas */}
			<main className="flex-1 container max-w-2xl mx-auto px-6 pb-8">
				<div className="space-y-6">
					{/* Card de Atendimentos */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<ClipboardList className="w-4 h-4" />
								Atendimentos
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">{totalOrders}</p>
						</CardContent>
					</Card>

					{/* Grid de Resources */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Meus Resources</h2>
						<div className="grid grid-cols-2 gap-4">
							{RESOURCES.map((resource) => (
								<Card
									key={resource.key}
									className="cursor-pointer hover:bg-accent transition-colors"
									onClick={() => navigate(`/dashboard/${resource.key}`)}
								>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
											{getIcon(resource.icon)}
											{resource.label}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-2xl font-bold">
											{resourceCounts[resource.key] || 0}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Botões de Ação */}
					<div className="space-y-3">
						<Button className="w-full" size="lg" onClick={() => navigate("/")}>
							Novo Atendimento
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
