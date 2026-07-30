import type { CartaoResumo, LancamentoMotorista, PjPropostaDados, PjRepresentanteDados } from '../types';

export const EMPRESA_PADRAO: PjPropostaDados = {
  cnpj: '03.052.564/0001-66',
  razaoSocial: 'TRANS KOTHE TRANSPORTES RODOVIARIOS S/A',
  dataAbertura: '1999-03-23',
  faturamentoMensal: 217622008,
  numMotoristas: 10,
  valorPorMotorista: 1000000,
  finalidade: 'antecipacao-recebiveis',
};

export const REPRESENTANTE_PADRAO: PjRepresentanteDados = {
  nomeCompleto: 'Nadia Tatiele',
  cpf: '051.125.651-52',
  email: 'brayhon.carvalho@kothe.com.br',
  celular: '(63) 99999-9999',
  dataNascimento: '1990-03-12',
  cargo: 'Diretor Financeiro',
};

export const CARTOES_PJ: CartaoResumo[] = [
  {
    id: '237346',
    nome: 'FERNANDO MELLO',
    numero: '4102********8085',
    validade: '30/09/2029',
    grupo: 'Transportador Roda',
    status: 'Normal',
    saldo: 'R$ 0,01',
  },
  {
    id: '203871',
    nome: 'HENRIQUE CASTRO',
    numero: '4102********0060',
    validade: '31/10/2028',
    grupo: 'Transportador Roda',
    status: 'Normal',
    saldo: 'R$ 0,01',
  },
  {
    id: '251770',
    nome: 'JOSEREI',
    numero: '4102********6002',
    validade: '30/09/2030',
    grupo: 'Transportador Roda',
    status: 'Bloqueado',
    saldo: 'R$ 0,00',
  },
  {
    id: '251925',
    nome: 'JULIAN TESTES',
    numero: '4102********7219',
    validade: '30/09/2030',
    grupo: 'Transportador Roda',
    status: 'Normal',
    saldo: 'R$ 13,90',
  },
  {
    id: '219401',
    nome: 'RENATO CASTRO',
    numero: '4102********7867',
    validade: '28/02/2029',
    grupo: 'Transportador Roda',
    status: 'Normal',
    saldo: 'R$ 0,01',
  },
];

export const LANCAMENTOS_MOTORISTA: LancamentoMotorista[] = [
  {
    descricao: 'APORTE - CARTAO FROTA',
    data: '02/07/2026 - 00:00',
    valor: '+ R$ 3,60',
    tipo: 'in',
  },
  {
    descricao: 'PIX REC',
    data: '06/05/2026 - 16:43',
    valor: '+ R$ 1,01',
    tipo: 'in',
  },
  {
    descricao: 'PIX DESPESAS - NADIA',
    data: '06/05/2026 - 16:41',
    valor: '- R$ 1,01',
    tipo: 'out',
  },
];

export const APORTES_EXEMPLO = [
  { id: '251772', conta: '253934', nome: 'LULA MOLUSCO', numero: '4102********1881', valor: 'R$ 100,00', tarifa: 'R$ 0,01' },
  { id: '236271', conta: '206003', nome: 'NADIA PENHA', numero: '4102********6718', valor: 'R$ 152,00', tarifa: 'R$ 0,01' },
  { id: '251773', conta: '253951', nome: 'OLIVIA PALITO', numero: '4102********8475', valor: 'R$ 156,60', tarifa: 'R$ 0,01' },
] as const;
