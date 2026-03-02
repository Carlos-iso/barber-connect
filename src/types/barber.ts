// Tipos para o app de barbearia

export type ServiceType = 'hair' | 'beard' | 'both';

export interface HaircutStyle {
  id: string; // ID do estilo de corte
  name: string; // Nome do estilo de corte
  icon: string; // Nome do ícone Lucide
  description?: string; // Descrição do estilo de corte
  defaultImage?: string; // URL/path da imagem padrão (será carregada via API no futuro)
  defaultImageKey?: string; // Chave da imagem padrão (será usada para resetar a imagem customizada)
  imageData?: string; // Base64 da imagem customizada pelo usuário
}

export interface BeardStyle {
  id: string;
  name: string;
  icon: string;
  description?: string;
  defaultImage?: string; // URL/path da imagem padrão (será carregada via API no futuro)
  defaultImageKey?: string;
  imageData?: string; // Base64 da imagem customizada pelo usuário
}

export interface CustomStyle {
  id: string;
  name: string;
  imageData?: string;
  originalId: string;
  type: 'haircut' | 'beard' | 'fadeType';
}

export type CuttingMethod = 'scissors' | 'machine';
export type MachineHeight = '0.5' | '1.0' | '1.5' | '2' | '3' | '4';
export type FadeType = 'high' | 'mid' | 'low';
export type SideStyle = 'fade' | 'straight' | 'razor' | 'zero' | 'zero_half';
export type FinishStyle = 'natural' | 'defined';
export type ScissorHeight = 'high' | 'medium' | 'low';
export type BeardHeight = 'short' | 'medium' | 'long';
export type BeardContour = 'natural' | 'defined';

export interface HaircutDetails {
  method: CuttingMethod | null;
  machineHeight: MachineHeight | null;
  fadeType: FadeType | null;
  sideStyle: SideStyle | null;
  finish: FinishStyle | null;
  scissorHeight: ScissorHeight | null;
}

export interface BeardDetails {
  height: BeardHeight | null;
  contour: BeardContour | null;
}

export interface Selection {
  serviceType: ServiceType | null;
  haircutStyle: HaircutStyle | null;
  haircutDetails: HaircutDetails;
  beardStyle: BeardStyle | null;
  beardDetails: BeardDetails;
}

export const initialSelection: Selection = {
  serviceType: null,
  haircutStyle: null,
  haircutDetails: {
    method: null,
    machineHeight: null,
    fadeType: null,
    sideStyle: null,
    finish: null,
    scissorHeight: null,
  },
  beardStyle: null,
  beardDetails: {
    height: null,
    contour: null,
  },
};

// Configuração de opções por tipo de estilo de corte
export interface StyleConfig {
  methods: CuttingMethod[];
  sideStyles: SideStyle[];
  finishStyles: FinishStyle[];
}

export const styleConfigs: Record<string, StyleConfig> = {
  fade: {
    methods: ['machine'],
    sideStyles: ['zero', 'zero_half', 'razor'],
    finishStyles: ['defined'],
  },
  social: {
    methods: ['scissors', 'machine'],
    sideStyles: [], // Empty to remove the option
    finishStyles: ['natural', 'defined'],
  },
  default: {
    methods: ['scissors', 'machine'],
    sideStyles: ['fade', 'straight', 'razor'],
    finishStyles: ['natural', 'defined'],
  },
};
