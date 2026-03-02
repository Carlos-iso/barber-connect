import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceData, ResourceItem } from "@/data/resourceData";
import { getResourceConfig } from "@/data/resourcesConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Loader2, Pencil } from "lucide-react";
import * as Icons from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const ResourceList = () => {
	const { resourceKey } = useParams<{ resourceKey: string }>();
	const [items, setItems] = useState<ResourceItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
	const [editImage, setEditImage] = useState<File | null>(null);
	const [imageFit, setImageFit] = useState<"cover" | "contain">("cover");
	const [imageFitByItem, setImageFitByItem] = useState<Record<string, "cover" | "contain">>(
		() => {
			try {
				const raw = localStorage.getItem("resource-image-fit");
				return raw ? JSON.parse(raw) : {};
			} catch {
				return {};
			}
		},
	);
	const [savingImage, setSavingImage] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

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

	const handleOpenEditImage = (item: ResourceItem) => {
		const itemId = item._id || item.id || "";
		const mapKey = `${resourceKey}:${itemId}`;
		setImageFit(imageFitByItem[mapKey] || "cover");
		setEditingItem(item);
		setEditImage(null);
	};

	const handleSaveImage = async () => {
		if (!resourceKey || !editingItem || !(editingItem._id || editingItem.id)) return;
		const itemId = editingItem._id || editingItem.id || "";
		const mapKey = `${resourceKey}:${itemId}`;

		setSavingImage(true);
		try {
			if (editImage) {
				const formData = new FormData();
				formData.append("defaultImage", editImage);

				await resourceData.updateResourceItem(
					resourceKey,
					itemId,
					formData,
				);
			}

			setImageFitByItem((prev) => {
				const next = { ...prev, [mapKey]: imageFit };
				localStorage.setItem("resource-image-fit", JSON.stringify(next));
				return next;
			});

			toast({ title: "Configuração de imagem salva!" });
			setEditingItem(null);
			if (editImage) {
				await loadItems();
			}
		} catch (error: any) {
			toast({
				title: "Erro ao atualizar imagem",
				description:
					error.response?.data?.message || error.message || "Erro desconhecido",
				variant: "destructive",
			});
		} finally {
			setSavingImage(false);
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

	const getItemImageFit = (item: ResourceItem): "cover" | "contain" => {
		const itemId = item._id || item.id || "";
		const mapKey = `${resourceKey}:${itemId}`;
		return imageFitByItem[mapKey] || "cover";
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
								{items.map((item) => {
									const displayName = item.name || item.label || "Sem nome";
									return (
									<Card key={item._id || item.id} className="overflow-hidden">
										<div className="aspect-square bg-secondary relative flex items-center justify-center">
											{item.defaultImage?.url || item.backgroundImage?.url ? (
												<ImageWithFallback
												imageUrl={
													item.defaultImage?.url || item.backgroundImage?.url
												}
													imageKey={
														item.defaultImage?.key || item.backgroundImage?.key
													}
													iconName={item.icon || config.icon}
													alt={displayName}
												imageClassName={
													getItemImageFit(item) === "contain"
														? "w-full h-full object-contain"
														: "w-full h-full object-cover"
												}
											/>
										) : (
											getIcon(
												item.icon || config.icon,
												"w-12 h-12 text-muted-foreground",
											)
										)}
										<Button
											size="icon"
											variant="secondary"
											className="absolute top-2 right-2 h-8 w-8"
											onClick={() => handleOpenEditImage(item)}
										>
											<Pencil className="w-4 h-4" />
										</Button>
										</div>
										<CardContent className="p-3">
											<p className="font-medium text-sm truncate">{displayName}</p>
											{item.description && (
												<p className="text-xs text-muted-foreground truncate">
													{item.description}
												</p>
											)}
										</CardContent>
									</Card>
								)})}
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

			<Dialog
				open={!!editingItem}
				onOpenChange={(open) => {
					if (!open) setEditingItem(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Imagem</DialogTitle>
					</DialogHeader>
					<div className="space-y-2">
						<Label htmlFor="resource-image">Nova imagem</Label>
						<Input
							id="resource-image"
							type="file"
							accept="image/*"
							onChange={(e) => setEditImage(e.target.files?.[0] || null)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="resource-fit">Estilo de corte</Label>
						<select
							id="resource-fit"
							value={imageFit}
							onChange={(e) => setImageFit(e.target.value as "cover" | "contain")}
							className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
						>
							<option value="cover">Preencher (cover)</option>
							<option value="contain">Completo (contain)</option>
						</select>
					</div>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setEditingItem(null)}
							disabled={savingImage}
						>
							Cancelar
						</Button>
						<Button onClick={handleSaveImage} disabled={savingImage}>
							{savingImage ? "Salvando..." : "Salvar imagem"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ResourceList;
