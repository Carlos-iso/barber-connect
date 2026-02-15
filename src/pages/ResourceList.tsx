import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceData, ResourceItem } from "@/data/resourceData";
import { getResourceConfig } from "@/data/resourcesConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";

const ResourceList = () => {
	const { resourceKey } = useParams<{ resourceKey: string }>();
	const [items, setItems] = useState<ResourceItem[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const config = resourceKey ? getResourceConfig(resourceKey) : null;

	useEffect(() => {
		if (resourceKey) {
			loadItems();
		}
	}, [resourceKey]);

	const loadItems = async () => {
		if (!resourceKey) return;

		try {
			const data = await resourceData.getResourceItems(resourceKey);
			setItems(data);
		} catch (error) {
			console.error(`Erro ao carregar ${resourceKey}:`, error);
		} finally {
			setLoading(false);
		}
	};

	// Helper para obter ícone dinamicamente
	const getIcon = (iconName: string, className: string = "w-4 h-4") => {
		const IconComponent = (Icons as any)[iconName];
		return IconComponent ? (
			<IconComponent className={className} />
		) : (
			<Icons.Circle className={className} />
		);
	};

	if (!config) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-muted-foreground">Resource não encontrado</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<header className="relative pt-12 pb-8 px-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/dashboard")}
					className="absolute top-4 left-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Voltar
				</Button>
				<h1 className="title-accessible text-foreground mb-2 text-center">
					{config.label}
				</h1>
			</header>

			<main className="flex-1 container max-w-lg mx-auto px-6 pb-8">
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<p className="text-sm text-muted-foreground">
							{items.length}{" "}
							{items.length === 1
								? config.singularLabel.toLowerCase()
								: config.label.toLowerCase()}
						</p>
						<Button
							size="sm"
							onClick={() => navigate(`/dashboard/${resourceKey}/novo`)}
						>
							<Plus className="w-4 h-4 mr-2" />
							Adicionar
						</Button>
					</div>

					{items.length > 0 ? (
						<div className="grid grid-cols-2 gap-4">
							{items.map((item) => (
								<Card key={item._id || item.id} className="overflow-hidden">
									<div className="aspect-square bg-secondary relative flex items-center justify-center">
										{item.defaultImage?.url || item.backgroundImage?.url ? (
											<img
												src={
													item.defaultImage?.url || item.backgroundImage?.url
												}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										) : (
											getIcon(
												item.icon || config.icon,
												"w-12 h-12 text-muted-foreground",
											)
										)}
									</div>
									<CardContent className="p-3">
										<p className="font-medium text-sm truncate">{item.name}</p>
										{item.description && (
											<p className="text-xs text-muted-foreground truncate">
												{item.description}
											</p>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<Card>
							<CardContent className="p-6 text-center text-muted-foreground">
								Nenhum {config.singularLabel.toLowerCase()} cadastrado ainda
							</CardContent>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
};

export default ResourceList;
