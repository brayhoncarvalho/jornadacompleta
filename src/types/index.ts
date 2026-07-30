export type Screen =
  | 'landing'
  | 'proposta'
  | 'dados-acesso'
  | 'senha'
  | 'proposta-personalizada'
  | 'dados-pessoais'
  | 'endereco-telefone'
  | 'captura-selfie'
  | 'envio-documentos'
  | 'documentos-status'
  | 'concluir'
  | 'area-cliente'
  | 'area-cliente-2'
  | 'email-simulacao'
  | 'revisao'
  | 'autenticacao-sms'
  | 'codigo-sms'
  | 'contrato'
  | 'conclusao'
  | 'cadastro'
  | 'meus-dados'
  | 'pj-dashboard'
  | 'pj-cartoes'
  | 'pj-aporte'
  | 'pj-motorista'
  | 'pj-proposta-contratacao'
  | 'pj-proposta-oferta'
  | 'pj-dados-empresa'
  | 'pj-representante'
  | 'pj-contrato-assinado';

export type PjView = 'dashboard' | 'cartoes' | 'aporte' | 'motorista' | 'landing';

export type AccessChannel = 'email' | 'celular';
export type OptionalAccessChannel = '' | AccessChannel;

export interface AccessPayload {
  email: string;
  celular: string;
  canal: AccessChannel;
}

export interface SimulacaoState {
  valor: number;
  parcelas: number;
}

export interface OfertaState {
  installments: number;
  amount: number;
  rate: number;
}

export interface PjPropostaDados {
  cnpj: string;
  razaoSocial: string;
  dataAbertura: string;
  faturamentoMensal: number;
  numMotoristas: number;
  valorPorMotorista: number;
  finalidade: string;
}

export interface PjOfertaData {
  valorTotal: number;
  taxaMes: number;
  prazo: number;
}

export interface PjRepresentanteDados {
  nomeCompleto: string;
  cpf: string;
  email: string;
  celular: string;
  dataNascimento?: string;
  cargo?: string;
}

export interface CartaoResumo {
  id: string;
  nome: string;
  numero: string;
  validade?: string;
  grupo?: string;
  status?: string;
  saldo?: string;
}

export interface LancamentoMotorista {
  descricao: string;
  data: string;
  valor: string;
  tipo: 'in' | 'out';
}
