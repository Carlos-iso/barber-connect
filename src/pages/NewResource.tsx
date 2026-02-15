import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceData } from "@/data/resourceData";
import { getResourceConfig } from "@/data/resourcesConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const NewResource = () => {
	const { resourceKey } = useParams<{ resourceKey: string }>();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [icon, setIcon] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const config = resourceKey ? getResourceConfig(resourceKey) : null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!resourceKey || !config) {
			toast({
				title: "Erro",
				description: "Resource inválido",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("name", name);
			if (description) formData.append("description", description);
			if (icon) formData.append("icon", icon);
			if (image) formData.append("defaultImage", image);

			await resourceData.createResourceItem(resourceKey, formData);

			toast({
				title: `${config.singularLabel} criado com sucesso!`,
			});

			navigate(`/dashboard/${resourceKey}`);
		} catch (error: any) {
			toast({
				title: `Erro ao criar ${config.singularLabel.toLowerCase()}`,
				description:
					error.response?.data?.message || error.message || "Erro desconhecido",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	if (!config) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-muted-foreground">Resource não encontrado</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<header className="relative pt-12 pb-8 px-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(`/dashboard/${resourceKey}`)}
					className="absolute top-4 left-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Voltar
				</Button>
				<h1 className="title-accessible text-foreground mb-2 text-center">
					Novo {config.singularLabel}
				</h1>
			</header>

			<main className="flex-1 container max-w-sm mx-auto px-6 pb-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Nome *</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={`Nome do ${config.singularLabel.toLowerCase()}`}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descrição</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Descrição (opcional)"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="icon">Ícone</Label>
						<Input
							id="icon"
							value={icon}
							onChange={(e) => setIcon(e.target.value)}
							placeholder="Ex: Scissors (opcional)"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image">Imagem</Label>
						<Input
							id="image"
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files?.[0] || null)}
						/>
						{image && (
							<p className="text-sm text-muted-foreground">
								Arquivo selecionado: {image.name}
							</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Salvando..." : `Salvar ${config.singularLabel}`}
					</Button>
				</form>
			</main>
		</div>
	);
};

export default NewResource;
