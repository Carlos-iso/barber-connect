import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Storage keys
const TOKEN_KEY = "barber_token";
const USER_ID_KEY = "barber_user_id";
const USER_DATA_KEY = "barber_user_data";

// Create axios instance
const api: AxiosInstance = axios.create({
	baseURL: API_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor to handle 401
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token inválido ou expirado - apenas limpar auth, não redirecionar automaticamente
			clearAuth();
			// Não redirecionar aqui para evitar loops
		}
		return Promise.reject(error);
	},
);

// Storage helpers
function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

function getUserId(): string | null {
	return localStorage.getItem(USER_ID_KEY);
}

function setUserId(userId: string): void {
	localStorage.setItem(USER_ID_KEY, userId);
}

function getUserData(): any | null {
	const data = localStorage.getItem(USER_DATA_KEY);
	return data ? JSON.parse(data) : null;
}

function setUserData(user: any): void {
	localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

function clearAuth(): void {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_ID_KEY);
	localStorage.removeItem(USER_DATA_KEY);
}

// Auth functions
export interface LoginResponse {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		[key: string]: any;
	};
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
}

async function login(email: string, password: string): Promise<LoginResponse> {
	const response = await api.post("/users/login", { email, password });
	const { token, user } = response.data;

	// Salvar no storage
	setToken(token);
	setUserId(user.id || user._id);
	setUserData(user);

	return { token, user };
}

async function register(data: RegisterData): Promise<LoginResponse> {
	const response = await api.post("/users/new", data);
	const { token, user } = response.data;

	// Salvar no storage
	setToken(token);
	setUserId(user.id || user._id);
	setUserData(user);

	return { token, user };
}

async function logout(): Promise<void> {
	clearAuth();
}

async function getCurrentUser(): Promise<any> {
	// Primeiro tenta pegar do storage
	const cachedUser = getUserData();
	if (cachedUser) {
		return cachedUser;
	}

	// Se não tiver, busca da API
	const userId = getUserId();
	if (!userId) {
		throw new Error("Usuário não autenticado");
	}

	const response = await api.get(`/users/${userId}`);
	const user = response.data;
	setUserData(user);

	return user;
}

// Export tudo
export const authData = {
	login,
	register,
	logout,
	getCurrentUser,
	getToken,
	getUserId,
	api, // Exportar instância do axios para outros módulos usarem
};
