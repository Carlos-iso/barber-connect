export interface ResourceConfig {
	key: string;
	label: string;
	singularLabel: string;
	endpoint: string;
	icon: string;
}

export const RESOURCES: ResourceConfig[] = [
	{
		key: "haircuts",
		label: "Cortes",
		singularLabel: "Corte",
		endpoint: "/haircuts",
		icon: "Scissors",
	},
	{
		key: "beards",
		label: "Barbas",
		singularLabel: "Barba",
		endpoint: "/beards",
		icon: "User",
	},
	{
		key: "cutting-methods",
		label: "Métodos de Corte",
		singularLabel: "Método",
		endpoint: "/cutting-methods",
		icon: "Wrench",
	},
	{
		key: "machine-heights",
		label: "Alturas de Máquina",
		singularLabel: "Altura",
		endpoint: "/machine-heights",
		icon: "Ruler",
	},
	{
		key: "scissor-heights",
		label: "Alturas de Tesoura",
		singularLabel: "Altura",
		endpoint: "/scissor-heights",
		icon: "Scissors",
	},
	{
		key: "side-styles",
		label: "Estilos Laterais",
		singularLabel: "Estilo",
		endpoint: "/side-styles",
		icon: "ArrowLeftRight",
	},
	{
		key: "finish-styles",
		label: "Finalizações",
		singularLabel: "Finalização",
		endpoint: "/finish-styles",
		icon: "Sparkles",
	},
	{
		key: "beard-heights",
		label: "Alturas de Barba",
		singularLabel: "Altura",
		endpoint: "/beard-heights",
		icon: "Ruler",
	},
	{
		key: "beard-contours",
		label: "Contornos de Barba",
		singularLabel: "Contorno",
		endpoint: "/beard-contours",
		icon: "Circle",
	},
	{
		key: "fade-types",
		label: "Tipos de Degradê",
		singularLabel: "Degradê",
		endpoint: "/fade-types",
		icon: "Layers",
	},
];

// Helper para encontrar config por key
export function getResourceConfig(key: string): ResourceConfig | undefined {
	return RESOURCES.find((r) => r.key === key);
}

// Helper para obter endpoint
export function getResourceEndpoint(key: string): string {
	const config = getResourceConfig(key);
	return config?.endpoint || `/${key}`;
}
