import React, { createContext, useContext, useEffect, useState } from "react";
import { authData, LoginResponse } from "@/data/authData";

interface User {
	id: string;
	name: string;
	email: string;
	[key: string]: any;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Verificar se já está autenticado
		const checkAuth = async () => {
			try {
				const token = authData.getToken();
				if (token) {
					const currentUser = await authData.getCurrentUser();
					setUser(currentUser);
				}
			} catch (error) {
				console.error("Erro ao verificar autenticação:", error);
				authData.logout();
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const signIn = async (email: string, password: string) => {
		const { user } = await authData.login(email, password);
		setUser(user);
	};

	const signOut = async () => {
		await authData.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, signIn, signOut }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
