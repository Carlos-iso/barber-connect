import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { resourceData } from "@/data/resourceData";
import { RESOURCES } from "@/data/resourcesConfig";
import { HaircutStyle, BeardStyle } from "@/types/barber";

interface CustomStylesContextType {
	haircutStyles: HaircutStyle[];
	beardStyles: BeardStyle[];
	machineHeights: any[];
	fadeTypes: any[];
	sideStyles: any[];
	finishStyles: any[];
	scissorHeights: any[];
	beardHeights: any[];
	beardContours: any[];
	cuttingMethods: any[];
	loading: boolean;
	updateStyleImage: (
		styleId: string,
		type: any,
		file: File,
	) => Promise<boolean>;
	resetStyleImage: (styleId: string, type: any) => Promise<boolean>;
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
	const [machineHeights, setMachineHeights] = useState<any[]>([]);
	const [fadeTypes, setFadeTypes] = useState<any[]>([]);
	const [sideStyles, setSideStyles] = useState<any[]>([]);
	const [finishStyles, setFinishStyles] = useState<any[]>([]);
	const [scissorHeights, setScissorHeights] = useState<any[]>([]);
	const [beardHeights, setBeardHeights] = useState<any[]>([]);
	const [beardContours, setBeardContours] = useState<any[]>([]);
	const [cuttingMethods, setCuttingMethods] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const loadAllResources = async () => {
		// Não tentar carregar se não houver usuário
		if (!user) {
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
			setLoading(false);
			return;
		}

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
				id: cut._id || cut.id || "",
				name: cut.name,
				icon: cut.icon || "Scissors",
				description: cut.description || "",
				defaultImage: cut.defaultImage?.url || cut.backgroundImage?.url,
			}));

			// Mapear beards para o formato esperado
			const mappedBeards = beards.map((beard) => ({
				id: beard._id || beard.id || "",
				name: beard.name,
				icon: beard.icon || "User",
				description: beard.description || "",
				defaultImage: beard.defaultImage?.url || beard.backgroundImage?.url,
			}));

			setHaircutStyles(mappedHaircuts);
			setBeardStyles(mappedBeards);
			setMachineHeights(machineHeightsData);
			setFadeTypes(fadeTypesData);
			setSideStyles(sideStylesData);
			setFinishStyles(finishStylesData);
			setScissorHeights(scissorHeightsData);
			setBeardHeights(beardHeightsData);
			setBeardContours(beardContoursData);
			setCuttingMethods(cuttingMethodsData);
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
		type: any,
		file: File,
	): Promise<boolean> => {
		console.warn("updateStyleImage não implementado ainda");
		return false;
	};

	const resetStyleImage = async (
		styleId: string,
		type: any,
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
