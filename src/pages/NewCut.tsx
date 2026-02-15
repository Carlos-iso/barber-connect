import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cutsData } from "@/data/cutsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { ArrowLeft } from "lucide-react";

const NewCut = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [icon, setIcon] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!image) {
			toast({
				title: "Imagem obrigatória",
				description: "Por favor, selecione uma imagem para o corte",
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
			formData.append("defaultImage", image);

			await cutsData.createCut(formData);

			toast({
				title: "Corte criado com sucesso!",
			});

			navigate("/dashboard");
		} catch (error: any) {
			toast({
				title: "Erro ao criar corte",
				description:
					error.response?.data?.message || error.message || "Erro desconhecido",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

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
					Novo Corte
				</h1>
			</header>

			<main className="flex-1 container max-w-sm mx-auto px-6 pb-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Nome do Corte *</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ex: Social, Degradê"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descrição</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Descrição do corte (opcional)"
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
						<Label htmlFor="image">Imagem *</Label>
						<Input
							id="image"
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files?.[0] || null)}
							required
						/>
						{image && (
							<p className="text-sm text-muted-foreground">
								Arquivo selecionado: {image.name}
							</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Salvando..." : "Salvar Corte"}
					</Button>
				</form>
			</main>
		</div>
	);
};

export default NewCut;
