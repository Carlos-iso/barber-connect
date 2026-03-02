import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { MediaField, resourceData, ResourceItem } from "@/data/resourceData";
import { HaircutStyle, BeardStyle } from "@/types/barber";

interface StyleOption extends ResourceItem {
	defaultImageKey?: string;
	backgroundImageKey?: string;
	imageData?: string;
}

interface CustomStylesContextType {
	haircutStyles: HaircutStyle[];
	beardStyles: BeardStyle[];
	machineHeights: StyleOption[];
	fadeTypes: StyleOption[];
	sideStyles: StyleOption[];
	finishStyles: StyleOption[];
	scissorHeights: StyleOption[];
	beardHeights: StyleOption[];
	beardContours: StyleOption[];
	cuttingMethods: StyleOption[];
	loading: boolean;
	updateStyleImage: (
		styleId: string,
		type: string,
		file: File,
	) => Promise<boolean>;
	resetStyleImage: (styleId: string, type: string) => Promise<boolean>;
	reloadCuts: () => Promise<void>;
}

const CustomStylesContext = createContext<CustomStylesContextType | undefined>(
	undefined,
);

export function CustomStylesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = useAuth();
	const [haircutStyles, setHaircutStyles] = useState<HaircutStyle[]>([]);
	const [beardStyles, setBeardStyles] = useState<BeardStyle[]>([]);
	const [machineHeights, setMachineHeights] = useState<StyleOption[]>([]);
	const [fadeTypes, setFadeTypes] = useState<StyleOption[]>([]);
	const [sideStyles, setSideStyles] = useState<StyleOption[]>([]);
	const [finishStyles, setFinishStyles] = useState<StyleOption[]>([]);
	const [scissorHeights, setScissorHeights] = useState<StyleOption[]>([]);
	const [beardHeights, setBeardHeights] = useState<StyleOption[]>([]);
	const [beardContours, setBeardContours] = useState<StyleOption[]>([]);
	const [cuttingMethods, setCuttingMethods] = useState<StyleOption[]>([]);
	const [loading, setLoading] = useState(true);

	const normalizeImageUrl = (value?: MediaField | string): string | undefined => {
		if (!value) return undefined;
		if (typeof value === "string") return value;
		if (typeof value === "object" && typeof value.url === "string") {
			return value.url;
		}
		return undefined;
	};

	const normalizeImageKey = (value?: MediaField | string): string | undefined => {
		if (!value || typeof value === "string") return undefined;
		return typeof value.key === "string" ? value.key : undefined;
	};

	const normalizeItem = (
		item: ResourceItem,
		labelField: "label" | "name",
		fallbackIcon: string,
	): StyleOption => ({
		...item,
		id: item.id || item._id || "",
		label: item.label || item.name || "",
		name: item.name || item.label || "",
		icon: item.icon || fallbackIcon,
		description: item.description || "",
		defaultImage: normalizeImageUrl(item.defaultImage),
		defaultImageKey: normalizeImageKey(item.defaultImage),
		backgroundImage: normalizeImageUrl(item.backgroundImage),
		backgroundImageKey: normalizeImageKey(item.backgroundImage),
		[labelField]: item[labelField] || item.name || item.label || "",
	});

	const loadAllResources = async () => {
		try {
			// Carregar todos os resources em paralelo
			const [
				haircuts,
				beards,
				cuttingMethodsData,
				machineHeightsData,
				scissorHeightsData,
				sideStylesData,
				finishStylesData,
				beardHeightsData,
				beardContoursData,
				fadeTypesData,
			] = await Promise.all([
				resourceData.getResourceItems("haircuts").catch(() => []),
				resourceData.getResourceItems("beards").catch(() => []),
				resourceData.getResourceItems("cutting-methods").catch(() => []),
				resourceData.getResourceItems("machine-heights").catch(() => []),
				resourceData.getResourceItems("scissor-heights").catch(() => []),
				resourceData.getResourceItems("side-styles").catch(() => []),
				resourceData.getResourceItems("finish-styles").catch(() => []),
				resourceData.getResourceItems("beard-heights").catch(() => []),
				resourceData.getResourceItems("beard-contours").catch(() => []),
				resourceData.getResourceItems("fade-types").catch(() => []),
			]);

			// Mapear haircuts para o formato esperado
			const mappedHaircuts = haircuts.map((cut) => ({
				id: cut.id || cut._id || "",
				name: cut.name,
				icon: cut.icon || "Scissors",
				description: cut.description || "",
				defaultImage:
					normalizeImageUrl(cut.defaultImage) ||
					normalizeImageUrl(cut.backgroundImage),
				defaultImageKey:
					normalizeImageKey(cut.defaultImage) ||
					normalizeImageKey(cut.backgroundImage),
			}));

			// Mapear beards para o formato esperado
			const mappedBeards = beards.map((beard) => ({
				id: beard.id || beard._id || "",
				name: beard.name,
				icon: beard.icon || "User",
				description: beard.description || "",
				defaultImage:
					normalizeImageUrl(beard.defaultImage) ||
					normalizeImageUrl(beard.backgroundImage),
				defaultImageKey:
					normalizeImageKey(beard.defaultImage) ||
					normalizeImageKey(beard.backgroundImage),
			}));

			setHaircutStyles(mappedHaircuts);
			setBeardStyles(mappedBeards);
			setMachineHeights(
				machineHeightsData.map((item) => normalizeItem(item, "label", "Ruler")),
			);
			setFadeTypes(fadeTypesData.map((item) => normalizeItem(item, "label", "Layers")));
			setSideStyles(
				sideStylesData.map((item) => normalizeItem(item, "label", "ArrowLeftRight")),
			);
			setFinishStyles(
				finishStylesData.map((item) => normalizeItem(item, "label", "Sparkles")),
			);
			setScissorHeights(
				scissorHeightsData.map((item) => normalizeItem(item, "label", "Scissors")),
			);
			setBeardHeights(
				beardHeightsData.map((item) => normalizeItem(item, "label", "Ruler")),
			);
			setBeardContours(
				beardContoursData.map((item) => normalizeItem(item, "label", "Circle")),
			);
			setCuttingMethods(
				cuttingMethodsData.map((item) => normalizeItem(item, "label", "Wrench")),
			);
		} catch (error) {
			console.error("Erro ao carregar resources:", error);
			setHaircutStyles([]);
			setBeardStyles([]);
			setMachineHeights([]);
			setFadeTypes([]);
			setSideStyles([]);
			setFinishStyles([]);
			setScissorHeights([]);
			setBeardHeights([]);
			setBeardContours([]);
			setCuttingMethods([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAllResources();
	}, [user]);

	const reloadCuts = async () => {
		setLoading(true);
		await loadAllResources();
	};

	// Placeholder functions - não implementadas ainda
	const updateStyleImage = async (
		styleId: string,
		type: string,
		file: File,
	): Promise<boolean> => {
		console.warn("updateStyleImage não implementado ainda");
		return false;
	};

	const resetStyleImage = async (
		styleId: string,
		type: string,
	): Promise<boolean> => {
		console.warn("resetStyleImage não implementado ainda");
		return false;
	};

	return (
		<CustomStylesContext.Provider
			value={{
				haircutStyles,
				beardStyles,
				machineHeights,
				fadeTypes,
				sideStyles,
				finishStyles,
				scissorHeights,
				beardHeights,
				beardContours,
				cuttingMethods,
				loading,
				updateStyleImage,
				resetStyleImage,
				reloadCuts,
			}}
		>
			{children}
		</CustomStylesContext.Provider>
	);
}

export function useCustomStyles() {
	const context = useContext(CustomStylesContext);
	if (context === undefined) {
		throw new Error(
			"useCustomStyles must be used within a CustomStylesProvider",
		);
	}
	return context;
}
