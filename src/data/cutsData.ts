import { authData } from "./authData";

const { api } = authData;

export interface Cut {
	_id?: string;
	id?: string;
	name: string;
	description?: string;
	icon?: string;
	defaultImage?: {
		url: string;
		type?: string;
		key?: string;
	};
	backgroundImage?: {
		url: string;
		type?: string;
		key?: string;
	};
}

async function getCutsByUser(): Promise<Cut[]> {
	const response = await api.get("/haircuts");
	return response.data;
}

async function getCutById(id: string): Promise<Cut> {
	const response = await api.get(`/haircuts/${id}`);
	return response.data;
}

async function createCut(formData: FormData): Promise<Cut> {
	const response = await api.post("/haircuts", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
}

async function updateCut(id: string, formData: FormData): Promise<Cut> {
	const response = await api.put(`/haircuts/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
}

async function deleteCut(id: string): Promise<void> {
	await api.delete(`/haircuts/${id}`);
}

export const cutsData = {
	getCutsByUser,
	getCutById,
	createCut,
	updateCut,
	deleteCut,
};
