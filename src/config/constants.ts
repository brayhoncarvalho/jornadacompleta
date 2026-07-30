import type { Screen } from '../types';

export const APP_LOCALE = 'pt-BR';
export const APP_CURRENCY = 'BRL';

export const TAXA_MENSAL_PADRAO = 0.0275;
export const TAXA_CET_DELTA = 0.001;

export const PRAZOS_DISPONIVEIS = [6, 12, 16, 18, 24, 36] as const;
export const PRAZO_PJ_DISPONIVEL = [6, 12, 18, 24, 36] as const;
export const PRAZO_PADRAO = 18;

export const VALOR_MIN_SIMULADOR = 250;
export const VALOR_MAX_SIMULADOR = 100000;
export const VALOR_PADRAO_SIMULADOR = 3500;

export const VALORES_DISPONIVEIS_SIMULADOR = [
  250, 500, 750,
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
  6000, 7000, 8000, 9000, 10000,
  12000, 14000, 16000, 18000, 20000,
  25000, 30000, 35000, 40000, 45000, 50000,
  55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000,
] as const;

export const PJ_LIMITE_DISPONIVEL = 10.4;
export const PJ_LIMITE_UTILIZADO = 2.6;
export const PJ_LIMITE_TOTAL = 13;

export const PJ_SALDO_CONTA = 1691.42;
export const PJ_SALDO_CARTOES = 53.99;
export const PJ_GASTO_MEDIO_CARTOES = 0;

export const PJ_SALDO_POS_APORTE = 1282.79;
export const PJ_SALDO_ATUAL_APORTE = 1691.42;

export const FALLBACK_SCREEN: Screen = 'landing';

export const VALID_SCREENS: readonly Screen[] = [
  'landing',
  'proposta',
  'dados-acesso',
  'senha',
  'proposta-personalizada',
  'dados-pessoais',
  'endereco-telefone',
  'captura-selfie',
  'envio-documentos',
  'documentos-status',
  'concluir',
  'area-cliente',
  'area-cliente-2',
  'email-simulacao',
  'revisao',
  'autenticacao-sms',
  'codigo-sms',
  'contrato',
  'conclusao',
  'cadastro',
  'meus-dados',
  'pj-dashboard',
  'pj-cartoes',
  'pj-aporte',
  'pj-motorista',
  'pj-proposta-contratacao',
  'pj-proposta-oferta',
  'pj-dados-empresa',
  'pj-representante',
  'pj-contrato-assinado',
] as const;

export const PJ_ONBOARDING_SCREENS: readonly Screen[] = [
  'pj-proposta-contratacao',
  'pj-proposta-oferta',
  'pj-dados-empresa',
  'pj-representante',
  'pj-contrato-assinado',
] as const;

export const BREAKPOINTS = {
  sm: 480,
  md: 640,
  lg: 900,
  xl: 1024,
  xxl: 1080,
} as const;
