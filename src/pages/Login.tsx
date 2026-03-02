import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { toast } = useToast();
	const { signIn } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await signIn(email, password);
			const redirectPath = (location.state as { from?: string } | null)?.from;
			navigate(redirectPath || "/", { replace: true });
		} catch (error: any) {
			toast({
				title: "Erro ao fazer login",
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
			<main className="flex-1 container max-w-sm mx-auto px-4 py-8">
				<div className="space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-bold tracking-tight">
							Bem-vindo de volta
						</h1>
						<p className="text-muted-foreground">
							Entre para gerenciar suas fotos e cortes
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
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
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? "Entrando..." : "Entrar"}
						</Button>
					</form>

					<div className="text-center text-sm">
						Não tem uma conta?{" "}
						<Link
							to="/register"
							className="underline underline-offset-4 hover:text-primary"
						>
							Cadastre-se
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Login;
