import { authData } from "./authData";
import { getResourceEndpoint } from "./resourcesConfig";

const { api } = authData;

export interface ResourceItem {
	_id?: string;
	id?: string;
	name: string;
	description?: string;
	icon?: string;
	defaultImage?: {
		url: string;
		key: string;
		type?: string;
	};
	backgroundImage?: {
		url: string;
		key: string;
		type?: string;
	};
	imageUrl?: string;
}

// Cache de imagens públicas
const imageCache: Record<string, string> = {};

// Função para obter URL pública de imagem (placeholder - será implementado depois)
async function getPublicImageUrl(key: string): Promise<string | undefined> {
	if (!key) return undefined;

	// Verificar cache
	if (imageCache[key]) {
		return imageCache[key];
	}

	try {
		// TODO: Implementar chamada para /media/public-url/:key
		// Por enquanto, retornar undefined para usar fallback
		return undefined;
	} catch (error) {
		console.error("Erro ao buscar URL pública:", error);
		return undefined;
	}
}

// GET - Listar todos os itens de um resource
async function getResourceItems(resourceKey: string): Promise<ResourceItem[]> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.get(endpoint);
	return response.data;
}

// GET - Buscar item por ID
async function getResourceById(
	resourceKey: string,
	id: string,
): Promise<ResourceItem> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.get(`${endpoint}/${id}`);
	return response.data;
}

// POST - Criar novo item
async function createResourceItem(
	resourceKey: string,
	formData: FormData,
): Promise<ResourceItem> {
	const endpoint = getResourceEndpoint(resourceKey);
	const response = await api.post(endpoint, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
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
	return response.data;
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
	return response.data;
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
