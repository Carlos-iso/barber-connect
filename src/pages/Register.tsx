import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authData } from "@/data/authData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await authData.register({
				name: fullName,
				email,
				password,
			});

			toast({
				title: "Conta criada com sucesso!",
				description: "Bem-vindo ao Barber Connect.",
			});

			// Redirecionar para o dashboard
			navigate("/dashboard");
		} catch (error: any) {
			toast({
				title: "Erro ao criar conta",
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
			<PageHeader title="Criar Conta" backTo="/login" />

			<main className="flex-1 container max-w-sm mx-auto px-4 py-8">
				<div className="space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-bold tracking-tight">
							Crie sua conta
						</h1>
						<p className="text-muted-foreground">
							Comece a gerenciar seu portfólio
						</p>
					</div>

					<form onSubmit={handleRegister} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="fullName">Nome Completo</Label>
							<Input
								id="fullName"
								placeholder="Seu Nome"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="seu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
							/>
						</div>

						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? "Criando conta..." : "Criar Conta"}
						</Button>
					</form>

					<div className="text-center text-sm">
						Já tem uma conta?{" "}
						<Link
							to="/login"
							className="underline underline-offset-4 hover:text-primary"
						>
							Faça login
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Register;
