import { authData } from "./authData";
import { getResourceEndpoint } from "./resourcesConfig";

const { api } = authData;

export interface MediaField {
	url: string;
	key?: string;
	type?: string;
}

export interface ApiResourceItem {
	_id?: string;
	id?: string;
	user?: string;
	name?: string;
	label?: string;
	description?: string;
	icon?: string;
	defaultImage?: MediaField | string;
	backgroundImage?: MediaField | string;
}

export interface ResourceItem {
	_id?: string;
	id: string;
	name: string;
	label: string;
	description?: string;
	icon: string;
	defaultImage?: MediaField;
	backgroundImage?: MediaField;
	imageUrl?: string;
}

function inferMediaKeyFromUrl(url?: string): string | undefined {
	if (!url) return undefined;

	try {
		// URL absoluta
		const parsed = new URL(url);
		const segments = parsed.pathname.split("/").filter(Boolean);
		return segments.length > 0 ? decodeURIComponent(segments[segments.length - 1]) : undefined;
	} catch {
		// URL relativa/caminho simples
		const sanitized = url.split("?")[0].split("#")[0];
		const segments = sanitized.split("/").filter(Boolean);
		return segments.length > 0 ? decodeURIComponent(segments[segments.length - 1]) : undefined;
	}
}

function normalizeMedia(value?: MediaField | string): MediaField | undefined {
	if (!value) return undefined;
	if (typeof value === "string") {
		return { url: value, key: inferMediaKeyFromUrl(value) };
	}
	if (typeof value.url === "string") {
		return { ...value, key: value.key || inferMediaKeyFromUrl(value.url) };
	}
	return undefined;
}

function normalizeResourceItem(item: ApiResourceItem): ResourceItem {
	const id = item.id || item._id || "";
	const label = item.label || item.name || "";
	const name = item.name || item.label || "";
	return {
		_id: item._id,
		id,
		name,
		label,
		description: item.description,
		icon: item.icon || "Circle",
		defaultImage: normalizeMedia(item.defaultImage),
		backgroundImage: normalizeMedia(item.backgroundImage),
	};
}

// Cache de imagens públicas
const imageCache: Record<string, string> = {};

// Função para obter URL pública de imagem (placeholder - será implementado depois)
async function getPublicImageUrl(key: string): Promise<string | undefined> {
	if (!key) return undefined;
	const resolvedKey = key.startsWith("http") ? inferMediaKeyFromUrl(key) : key;
	if (!resolvedKey) return undefined;

	// Verificar cache
	if (imageCache[resolvedKey]) {
		return imageCache[resolvedKey];
	}

	try {
		const response = await api.get(`/media/public-url/${encodeURIComponent(resolvedKey)}`);
		const signedUrl = response.data?.url;
		if (signedUrl) {
			imageCache[resolvedKey] = signedUrl;
		}
		return signedUrl;
	} catch (error) {
		console.error("Erro ao buscar URL pública:", error);
		return undefined;
	}
}

// GET - Listar todos os itens de um resource
async function getResourceItems(resourceKey: string): Promise<ResourceItem[]> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.get<ApiResourceItem[]>(endpoint);
	return (response.data || []).map(normalizeResourceItem);
}

// GET - Buscar item por ID
async function getResourceById(
	resourceKey: string,
	id: string,
): Promise<ResourceItem> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.get<ApiResourceItem>(`${endpoint}/${id}`);
	return normalizeResourceItem(response.data);
}

// POST - Criar novo item
async function createResourceItem(
	resourceKey: string,
	formData: FormData,
): Promise<ResourceItem> {
	const endpoint = getResourceEndpoint(resourceKey);
	const userId = authData.getUserId();
	const headers = {
		"Content-Type": "multipart/form-data",
	};

	try {
		if (!userId) {
			throw new Error("Usuário não autenticado para criar resource");
		}

		const response = await api.post(`${endpoint}/${userId}/new`, formData, {
			headers,
		});
		const payload = response.data?.upload || response.data?.data || response.data;
		return normalizeResourceItem(payload);
	} catch (error) {
		// fallback para backends que já aceitam POST direto no endpoint
		const response = await api.post(endpoint, formData, { headers });
		const payload = response.data?.upload || response.data?.data || response.data;
		return normalizeResourceItem(payload);
	}
}

// PUT - Atualizar item existente
async function updateResourceItem(
	resourceKey: string,
	id: string,
	formData: FormData,
): Promise<ResourceItem> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.put(`${endpoint}/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	const payload = response.data?.upload || response.data?.data || response.data;
	return normalizeResourceItem(payload);
}

// DELETE - Remover item
async function deleteResourceItem(
	resourceKey: string,
	id: string,
): Promise<void> {
	const endpoint = getResourceEndpoint(resourceKey);
	await api.delete(`${endpoint}/${id}`);
}

// GET - Contar itens de um resource
async function getResourceCount(resourceKey: string): Promise<number> {
	try {
		const items = await getResourceItems(resourceKey);
		return items.length;
	} catch (error) {
		console.error(`Erro ao contar ${resourceKey}:`, error);
		return 0;
	}
}

// GET - Buscar por nome
async function searchResourceByName(
	resourceKey: string,
	name: string,
): Promise<ResourceItem[]> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.post(`${endpoint}/search`, { name });
	const payload = response.data?.idUpload || response.data;
	if (Array.isArray(payload)) {
		return payload.map(normalizeResourceItem);
	}
	if (payload && typeof payload === "object") {
		return [normalizeResourceItem(payload)];
	}
	return [];
}

export const resourceData = {
	getResourceItems,
	getResourceById,
	createResourceItem,
	updateResourceItem,
	deleteResourceItem,
	getResourceCount,
	searchResourceByName,
	getPublicImageUrl,
};
