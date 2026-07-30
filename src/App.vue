<script setup lang="ts">
import { ref, computed, watchEffect, watch, nextTick } from 'vue'

const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }
const menuTriggerRef = ref<HTMLButtonElement | null>(null)

watch(menuOpen, (isOpen) => {
  nextTick(() => {
    if (isOpen) {
      document.querySelector<HTMLElement>('.landing-nav__drawer-links a')?.focus()
    } else {
      menuTriggerRef.value?.focus()
    }
  })
})

const trapFocus = (e: KeyboardEvent) => {
  if (e.key === 'Escape') { closeMenu(); return }
  if (e.key !== 'Tab') return
  const focusable = Array.from(
    document.querySelectorAll<HTMLElement>('.landing-nav__drawer a, .landing-nav__drawer button')
  )
  if (!focusable.length) return
  if (e.shiftKey && document.activeElement === focusable[0]) {
    e.preventDefault(); focusable[focusable.length - 1].focus()
  } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
    e.preventDefault(); focusable[0].focus()
  }
}
import HeroSection from './components/HeroSection.vue'
import SimuladorSection from './components/SimuladorSection.vue'
import ComoFuncionaSection from './components/ComoFuncionaSection.vue'
import BeneficiosSection from './components/BeneficiosSection.vue'
import FooterSection from './components/FooterSection.vue'
import PropostaScreen from './components/PropostaScreen.vue'
import AccessDataScreen from './components/AccessDataScreen.vue'
import SenhaScreen from './components/SenhaScreen.vue'
import PropostaPersonalizadaScreen from './components/PropostaPersonalizadaScreen.vue'
import CadastroScreen from './components/CadastroScreen.vue'
import DadosPessoaisScreen from './components/DadosPessoaisScreen.vue'
import EnderecoTelefoneScreen from './components/EnderecoTelefoneScreen.vue'
import EnvioDocumentosScreen from './components/EnvioDocumentosScreen.vue'
import DocumentosStatusScreen from './components/DocumentosStatusScreen.vue'
import ConcluirScreen from './components/ConcluirScreen.vue'
import AreaClienteScreen from './components/AreaClienteScreen.vue'
import AreaClienteIIScreen from './components/AreaClienteIIScreen.vue'
import RevisaoScreen from './components/RevisaoScreen.vue'
import AutenticacaoSMSScreen from './components/AutenticacaoSMSScreen.vue'
import CodigoSMSScreen from './components/CodigoSMSScreen.vue'
import ContratoScreen from './components/ContratoScreen.vue'
import ConclusaoScreen from './components/ConclusaoScreen.vue'
import MeusDadosScreen from './components/MeusDadosScreen.vue'
import GmailSimuladorScreen from './components/GmailSimuladorScreen.vue'
import CapturaSelfieScreen from './components/CapturaSelfieScreen.vue'
import PjDashboardScreen from './components/pj/PjDashboardScreen.vue'
import PjCartoesScreen from './components/pj/PjCartoesScreen.vue'
import PjAporteScreen from './components/pj/PjAporteScreen.vue'
import PjMotoristaScreen from './components/pj/PjMotoristaScreen.vue'
import PjPropostaContratacaoScreen from './components/pj/PjPropostaContratacaoScreen.vue'
import PjPropostaOfertaScreen from './components/pj/PjPropostaOfertaScreen.vue'
import PjDadosEmpresaScreen from './components/pj/PjDadosEmpresaScreen.vue'
import PjRepresentanteScreen from './components/pj/PjRepresentanteScreen.vue'
import PjContratoAssinadoScreen from './components/pj/PjContratoAssinadoScreen.vue'
import type { Screen, PjView, AccessChannel, AccessPayload, SimulacaoState, OfertaState, PjPropostaDados, PjOfertaData } from './types'
import { FALLBACK_SCREEN, VALID_SCREENS, TAXA_MENSAL_PADRAO, TAXA_CET_DELTA, PJ_ONBOARDING_SCREENS } from './config/constants'
import { formatCurrencyBRL, formatMonthlyRate, formatAnnualRateFromMonthly } from './utils/formatters'
import { calculatePricePMT, withCetDelta } from './lib/financeCalculations'

const fallbackScreen: Screen = FALLBACK_SCREEN
const validScreens = new Set<Screen>(VALID_SCREENS as Screen[])
const accessPayload = ref<AccessPayload | null>(null)

// ── Estado do fluxo de onboarding PJ ────────────────────────────────────────

const pjProposta = ref<PjPropostaDados | null>(null)
const pjOfertaData = ref<PjOfertaData | null>(null)

const pjValorTotal = computed(() => pjOfertaData.value?.valorTotal ?? 100000)
const pjTaxaMes = computed(() => pjOfertaData.value?.taxaMes ?? TAXA_MENSAL_PADRAO)
const pjPrazoMeses = computed(() => pjOfertaData.value?.prazo ?? 12)

const fmtBRL = (v: number) => formatCurrencyBRL(v)

const pjValorStr = computed(() => fmtBRL(pjValorTotal.value))
const pjPrazoStr = computed(() => `${pjPrazoMeses.value} meses`)
const pjParcelaVal = computed(() => calculatePricePMT(pjValorTotal.value, pjTaxaMes.value, pjPrazoMeses.value))
const pjParcelaStr = computed(() => fmtBRL(pjParcelaVal.value))
const pjTaxaNomStr = computed(() => `${formatMonthlyRate(pjTaxaMes.value)}/ ${formatAnnualRateFromMonthly(pjTaxaMes.value)}`)
const pjTaxaEfStr = computed(() => {
  const rCet = withCetDelta(pjTaxaMes.value, TAXA_CET_DELTA)
  return `${formatMonthlyRate(rCet)}/ ${formatAnnualRateFromMonthly(rCet)}`
})
const pjTaxaMensalStr = computed(() => formatMonthlyRate(pjTaxaMes.value))
const pjTaxaAnualStr = computed(() => formatAnnualRateFromMonthly(pjTaxaMes.value))

// Estado da simulação — alimentado pelo SimuladorSection e propagado para as próximas telas
const simulacao = ref<SimulacaoState>({ valor: 100000, parcelas: 18 })
const oferta = ref<OfertaState>({ installments: 18, amount: 209, rate: TAXA_MENSAL_PADRAO })

const propostaValor    = computed(() => fmtBRL(simulacao.value.valor))
const propostaParcela  = computed(() => fmtBRL(oferta.value.amount))
const propostaPrazo    = computed(() => `${oferta.value.installments} meses`)
const propostaCondicoes = computed(() => `${oferta.value.installments}x de ${fmtBRL(oferta.value.amount)}`)
const propostaTaxaNominal = computed(() => `${formatMonthlyRate(oferta.value.rate)}/ ${formatAnnualRateFromMonthly(oferta.value.rate)}`)
const propostaTaxaEfetiva = computed(() => {
  const rCet = withCetDelta(oferta.value.rate, TAXA_CET_DELTA)
  return `${formatMonthlyRate(rCet)}/ ${formatAnnualRateFromMonthly(rCet)}`
})

const getScreenFromQuery = (): Screen => {
  const screen = new URLSearchParams(window.location.search).get('screen')

  if (screen && validScreens.has(screen as Screen)) {
    return screen as Screen
  }

  return fallbackScreen
}

const updateScreenQuery = (screen: Screen) => {
  const url = new URL(window.location.href)
  url.searchParams.set('screen', screen)
  url.hash = ''
  window.history.replaceState({}, '', url)
}

const currentScreen = ref<Screen>(getScreenFromQuery())

const PJ_ONBOARDING_SCREENS: Screen[] = [
  'pj-proposta-contratacao', 'pj-proposta-oferta', 'pj-dados-empresa', 'pj-representante',
  'pj-contrato-assinado', 'dados-acesso', 'senha', 'endereco-telefone',
  'envio-documentos', 'revisao', 'contrato',
]

// Modo PJ: ativado via ?isPJ=true na URL, por qualquer tela pj-*, ou pelo fluxo de onboarding PJ
const isPjMode = ref(
  new URLSearchParams(window.location.search).get('isPJ') === 'true' ||
  (getScreenFromQuery() as string).startsWith('pj-')
)
watch(currentScreen, (screen) => {
  if ((screen as string).startsWith('pj-') || PJ_ONBOARDING_SCREENS.includes(screen)) {
    isPjMode.value = true
  }
})
const isPjOnboarding = computed(() => isPjMode.value || PJ_ONBOARDING_SCREENS.includes(currentScreen.value))

const baseUrl = import.meta.env.BASE_URL

const screenTitles: Record<Screen, string> = {
  'landing': 'Dock — Empréstimo Online',
  'proposta': 'Solicitar Proposta — Dock',
  'dados-acesso': 'Dados de Acesso — Dock',
  'senha': 'Confirmação de Cadastro — Dock',
  'proposta-personalizada': 'Proposta Personalizada — Dock',
  'dados-pessoais': 'Dados Pessoais — Dock',
  'endereco-telefone': 'Endereço e Telefone — Dock',
  'captura-selfie': 'Captura de Selfie — Dock',
  'envio-documentos': 'Envio de Documentos — Dock',
  'documentos-status': 'Documentos Enviados — Dock',
  'concluir': 'Em Análise — Dock',
  'area-cliente': 'Meus Empréstimos — Dock',
  'area-cliente-2': 'Meus Empréstimos — Dock',
  'email-simulacao': 'E-mail de Simulação — Dock',
  'revisao': 'Revisão de Contrato — Dock',
  'autenticacao-sms': 'Autenticação por SMS — Dock',
  'codigo-sms': 'Código SMS — Dock',
  'contrato': 'Contrato de Crédito — Dock',
  'conclusao': 'Parabéns! — Dock',
  'meus-dados': 'Meus Dados — Dock',
  'cadastro': 'Solicitar Proposta — Dock',
  'pj-dashboard': 'Dashboard de Adiantamento — RedeFrota',
  'pj-cartoes': 'Cartões de Despesas — RedeFrota',
  'pj-aporte': 'Realizar Aporte — RedeFrota',
  'pj-motorista': 'App Motorista — RedeFrota',
  'pj-proposta-contratacao': 'Solicitar Adiantamento — FrotaBank',
  'pj-proposta-oferta': 'Simule seu Adiantamento — FrotaBank',
  'pj-dados-empresa': 'Dados da Empresa — FrotaBank',
  'pj-representante': 'Representante Legal — FrotaBank',
  'pj-contrato-assinado': 'Contrato Assinado! — FrotaBank',
}

watchEffect(() => {
  document.title = screenTitles[currentScreen.value]
})

const setScreen = (screen: Screen) => {
  currentScreen.value = screen
  updateScreenQuery(screen)
  document.title = screenTitles[screen]
  window.scrollTo({ top: 0, behavior: 'smooth' })
  nextTick(() => {
    const h1 = document.querySelector<HTMLElement>('h1')
    if (h1) {
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
      h1.focus({ preventScroll: true })
    }
  })
}

const goToProposta = (data?: { valor: number; parcelas: number }) => {
  if (data) simulacao.value = data
  setScreen('pj-proposta-contratacao')
}

const goToLanding = () => {
  setScreen('landing')
}

const goToDadosAcesso = () => {
  setScreen('dados-acesso')
}

const goToSenha = (payload: AccessPayload) => {
  accessPayload.value = payload
  setScreen('senha')
}

const goToPropostaPersonalizada = () => {
  setScreen('pj-dados-empresa')
}

const goToDadosPessoais = (offer?: OfertaState & { valor?: number }) => {
  if (offer) {
    const { valor, ...ofertaData } = offer
    oferta.value = ofertaData
    if (valor !== undefined) simulacao.value.valor = valor
  }
  setScreen('dados-pessoais')
}

const goToEnderecoTelefone = () => {
  setScreen('endereco-telefone')
}

const goToCapturaSelfie = () => {
  setScreen('captura-selfie')
}

const goToEnvioDocumentos = () => {
  setScreen('envio-documentos')
}

const envioDocStep = ref<'tipo' | 'upload'>('tipo')

watchEffect(() => {
  if (currentScreen.value !== 'envio-documentos') envioDocStep.value = 'tipo'
})

const goToDocumentosStatus = () => {
  setScreen('documentos-status')
}

const goToConcluir = () => {
  setScreen('concluir')
}

const goToAreaCliente = () => {
  setScreen('area-cliente')
}

const goToAreaClienteII = () => {
  setScreen('area-cliente-2')
}

const goToEmailSimulacao = () => {
  setScreen('email-simulacao')
}

const goToRevisao = () => {
  setScreen('revisao')
}

const goToAutenticacaoSMS = () => {
  setScreen('autenticacao-sms')
}

const goToCodigoSMS = () => {
  setScreen('codigo-sms')
}

const goToContrato = () => {
  setScreen('contrato')
}

const goToConclusao = () => {
  setScreen('conclusao')
}

const goToPjScreen = (view: PjView) => {
  if (view === 'dashboard') setScreen('pj-dashboard')
  else if (view === 'cartoes') setScreen('pj-cartoes')
  else if (view === 'aporte') setScreen('pj-aporte')
  else if (view === 'motorista') setScreen('pj-motorista')
  else setScreen('landing')
}

// ── Handlers do fluxo de onboarding PJ ───────────────────────────────
const goToPjPropostaContratacao = () => setScreen('pj-proposta-contratacao')

const handleSolicitar = (data: { valor: number; parcelas: number }) => {
  simulacao.value = { valor: data.valor, parcelas: data.parcelas }
  goToProposta()
}
const goToPjPropostaOferta = () => setScreen('pj-proposta-oferta')
const goToPjDadosEmpresa = () => setScreen('pj-dados-empresa')
const goToPjRepresentante = () => setScreen('pj-representante')

const handlePjPropostaContinuar = (dados: PjPropostaDados) => {
  pjProposta.value = dados
  setScreen('pj-proposta-oferta')
}

const handlePjOfertaContinuar = (ofertaIn: PjOfertaData) => {
  pjOfertaData.value = ofertaIn
  setScreen('dados-acesso')
}

const handleAuthNav = (action: 'sair' | 'emprestimos' | 'meus-dados') => {
  if (action === 'sair') goToLanding()
  else if (action === 'emprestimos') setScreen('pj-dashboard')
  else if (action === 'meus-dados') setScreen('meus-dados')
}
</script>

<template>
  <div class="min-h-screen w-full bg-white" :class="{ 'theme-pj': isPjOnboarding }">
    <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
    <template v-if="currentScreen === 'pj-dashboard'">
      <PjDashboardScreen @navigate="goToPjScreen" />
    </template>
    <template v-else-if="currentScreen === 'pj-cartoes'">
      <PjCartoesScreen @navigate="goToPjScreen" />
    </template>
    <template v-else-if="currentScreen === 'pj-aporte'">
      <PjAporteScreen @navigate="goToPjScreen" />
    </template>
    <template v-else-if="currentScreen === 'pj-motorista'">
      <PjMotoristaScreen @navigate="goToPjScreen" />
    </template>
    <template v-else-if="currentScreen === 'landing'">
      <header class="landing-nav">
        <div class="landing-nav__inner">
          <img :src="isPjMode ? `${baseUrl}assets/Rede-Frota.svg` : `${baseUrl}assets/dock-logo-color.png`" :alt="isPjMode ? 'Rede Frota' : 'Dock'" class="landing-nav__logo" />
          <nav class="landing-nav__links" aria-label="Navegação principal">
            <a href="#simulador">Empréstimo</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Segurança</a>
            <a href="#footer">Ajuda</a>
          </nav>
          <button class="landing-nav__pj" type="button" @click="setScreen('pj-dashboard')">Portal PJ</button>
          <button class="landing-nav__cta" type="button" @click="goToProposta">Simular grátis</button>
          <button ref="menuTriggerRef" class="landing-nav__btn" :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'" :aria-expanded="menuOpen" :aria-controls="menuOpen ? 'mobile-menu' : undefined" @click="menuOpen = !menuOpen">
            <span :class="{ 'is-open-top': menuOpen }"></span>
            <span :class="{ 'is-open-mid': menuOpen }"></span>
          </button>
        </div>

        <!-- Menu mobile drawer -->
        <div v-if="menuOpen" id="mobile-menu" class="landing-nav__drawer" role="dialog" aria-modal="true" aria-label="Menu de navegação" @keydown="trapFocus">
          <nav class="landing-nav__drawer-links" aria-label="Navegação mobile">
            <a href="#simulador" @click="closeMenu">Empréstimo</a>
            <a href="#como-funciona" @click="closeMenu">Como funciona</a>
            <a href="#beneficios" @click="closeMenu">Segurança</a>
            <a href="#footer" @click="closeMenu">Ajuda</a>
          </nav>
          <button class="landing-nav__drawer-pj" type="button" @click="closeMenu(); setScreen('pj-dashboard')">Portal PJ</button>
          <button class="landing-nav__drawer-cta" type="button" @click="closeMenu(); goToProposta()">Simular grátis</button>
        </div>
      </header>

      <div class="landing-above-fold-wrap">
        <video
          class="landing-above-fold__video-bg"
          autoplay
          muted
          loop
          playsinline
          aria-hidden="true"
        >
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
        <div id="main-content" class="landing-above-fold">
          <HeroSection @simular="goToProposta" />
          <SimuladorSection @solicitar="handleSolicitar" />
        </div>
      </div>

      <section class="landing-trust" aria-label="Diferenciais de confiança">
        <div class="landing-trust__inner">
          <p><span aria-hidden="true">✓</span>Sem compromisso</p>
          <p><span aria-hidden="true">✓</span>Resposta rápida</p>
          <p><span aria-hidden="true">✓</span>Instituição regulada</p>
          <p><span aria-hidden="true">✓</span>Dados protegidos</p>
        </div>
      </section>

      <ComoFuncionaSection @contrate="goToProposta" />
      <BeneficiosSection />
      <FooterSection :is-p-j="isPjMode" />
    </template>
    <template v-else-if="currentScreen === 'proposta'">
      <PropostaScreen :valorInicial="simulacao.valor" @voltar="goToLanding" @continuar="goToDadosAcesso" />
    </template>
    <template v-else-if="currentScreen === 'pj-proposta-contratacao'">
      <PjPropostaContratacaoScreen
        :valor-inicial="simulacao.valor"
        :prazo-inicial="simulacao.parcelas"
        @voltar="goToLanding"
        @continuar="handlePjPropostaContinuar"
      />
    </template>
    <template v-else-if="currentScreen === 'pj-proposta-oferta'">
      <PjPropostaOfertaScreen
        :dados="pjProposta ?? undefined"
        :prazo-inicial="simulacao.parcelas"
        @voltar="goToPjPropostaContratacao"
        @continuar="handlePjOfertaContinuar"
      />
    </template>
    <template v-else-if="currentScreen === 'pj-dados-empresa'">
      <PjDadosEmpresaScreen
        @voltar="goToDadosAcesso"
        @continuar="goToPjRepresentante"
      />
    </template>
    <template v-else-if="currentScreen === 'pj-representante'">
      <PjRepresentanteScreen
        @voltar="goToPjDadosEmpresa"
        @continuar="goToEnderecoTelefone"
      />
    </template>
    <template v-else-if="currentScreen === 'dados-acesso'">
      <AccessDataScreen :is-p-j="true" @voltar="goToPjPropostaOferta" @enviar="goToSenha" />
    </template>
    <template v-else-if="currentScreen === 'senha'">
      <SenhaScreen
        :is-p-j="true"
        :email="accessPayload?.email ?? ''"
        :celular="accessPayload?.celular ?? ''"
        :canal="accessPayload?.canal ?? 'celular'"
        @voltar="goToDadosAcesso"
        @continuar="goToPropostaPersonalizada"
      />
    </template>
    <template v-else-if="currentScreen === 'proposta-personalizada'">
      <PropostaPersonalizadaScreen
        :valorSolicitado="simulacao.valor"
        @voltar="goToSenha(accessPayload ?? { email: '', celular: '', canal: 'celular' })"
        @continuar="goToDadosPessoais"
      />
    </template>
    <template v-else-if="currentScreen === 'dados-pessoais'">
      <DadosPessoaisScreen @voltar="goToPropostaPersonalizada" @continuar="goToEnderecoTelefone" />
    </template>
    <template v-else-if="currentScreen === 'endereco-telefone'">
      <EnderecoTelefoneScreen :is-p-j="true" @voltar="goToPjRepresentante" @continuar="goToEnvioDocumentos" />
    </template>
    <template v-else-if="currentScreen === 'envio-documentos'">
      <EnvioDocumentosScreen :initialStep="envioDocStep" :is-p-j="true" @voltar="goToEnderecoTelefone" @continuar="goToRevisao" />
    </template>
    <template v-else-if="currentScreen === 'documentos-status'">
      <DocumentosStatusScreen @voltar="goToCapturaSelfie" @continuar="goToConcluir" />
    </template>
    <template v-else-if="currentScreen === 'concluir'">
      <ConcluirScreen @irParaArea="goToAreaCliente" @voltar="goToDocumentosStatus" />
    </template>
    <template v-else-if="currentScreen === 'area-cliente'">
      <AreaClienteScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        @irParaEmail="goToEmailSimulacao"
        @cancelar="goToLanding"
        @voltar="goToConcluir"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'email-simulacao'">
      <GmailSimuladorScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        nome="Brayhon Carvalho"
        @gerarContrato="goToAreaClienteII"
        @voltar="goToAreaCliente"
      />
    </template>
    <template v-else-if="currentScreen === 'area-cliente-2'">
      <AreaClienteIIScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        @gerarContrato="goToRevisao"
        @cancelar="goToLanding"
        @voltar="goToEmailSimulacao"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'revisao'">
      <RevisaoScreen
        :is-p-j="true"
        :valor="pjValorStr"
        :prazo="pjPrazoStr"
        :parcela="pjParcelaStr"
        :taxaNominal="pjTaxaNomStr"
        :taxaEfetiva="pjTaxaEfStr"
        @gerarContrato="goToContrato"
        @voltar="goToEnvioDocumentos"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'autenticacao-sms'">
      <AutenticacaoSMSScreen @enviarSms="goToCodigoSMS" @voltar="goToRevisao" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'codigo-sms'">
      <CodigoSMSScreen @confirmar="goToContrato" @cancelar="goToAutenticacaoSMS" @voltar="goToAutenticacaoSMS" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'contrato'">
      <ContratoScreen
        :is-p-j="true"
        :razao-social="pjProposta?.razaoSocial ?? 'TRANS KOTHE TRANSPORTES RODOVIARIOS S/A'"
        :cnpj="pjProposta?.cnpj ?? '03.052.564/0001-66'"
        :valor="pjValorStr"
        :prazo="pjPrazoMeses"
        :parcela="pjParcelaStr"
        :taxaNominalMensal="pjTaxaMensalStr"
        :taxaNominalAnual="pjTaxaAnualStr"
        @continuar="() => setScreen('pj-contrato-assinado')"
        @voltar="goToRevisao"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'conclusao'">
      <ConclusaoScreen :valor="propostaValor" @voltar="goToLanding" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'pj-contrato-assinado'">
      <PjContratoAssinadoScreen
        :razao-social="pjProposta?.razaoSocial"
        :valor-total="pjValorStr"
        :prazo="pjPrazoStr"
        :parcela="pjParcelaStr"
        @acessar-dashboard="setScreen('pj-dashboard')"
      />
    </template>
    <template v-else-if="currentScreen === 'meus-dados'">
      <MeusDadosScreen @voltar="goToAreaCliente" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'cadastro'">
      <CadastroScreen @voltar="goToLanding" @continuar="goToDadosAcesso" />
    </template>
  </div>
</template>

<style>
.landing-nav {
  width: 100%;
  background: #fafcfc;
  border-bottom: 1px solid #e3edec;
}

.landing-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 12px;
}

.landing-nav__logo {
  height: 24px;
  width: auto;
  display: block;
}

.theme-pj .landing-nav__logo {
  height: 44px;
}

.landing-nav__links {
  display: none;
  align-items: center;
  gap: 32px;
}

.landing-nav__links a {
  color: #3c4c4d;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.landing-nav__links a:hover {
  color: var(--color-primary-500);
}

.landing-nav__cta {
  display: none;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.landing-nav__pj {
  display: none;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  border: 1px solid var(--color-primary-500);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-primary-500);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
}

.landing-nav__pj:hover {
  background: var(--color-primary-50);
}

.landing-nav__cta:hover {
  background: var(--btn-primary-bg-hover);
}

.landing-nav__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6f5;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.landing-nav__btn span {
  display: block;
  height: 2px;
  width: 18px;
  border-radius: 2px;
  background: var(--btn-primary-bg);
  transition: transform 0.2s, opacity 0.2s;
}

.landing-nav__btn span.is-open-top  { transform: translateY(3px) rotate(45deg); }
.landing-nav__btn span.is-open-mid  { transform: translateY(-3px) rotate(-45deg); }

/* ── Mobile drawer ── */
.landing-nav__drawer {
  background: #fafcfc;
  border-top: 1px solid #e3edec;
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.landing-nav__drawer-links {
  display: flex;
  flex-direction: column;
}

.landing-nav__drawer-links a {
  padding: 14px 4px;
  border-bottom: 1px solid #f0f7f7;
  color: #0b2528;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}

.landing-nav__drawer-links a:last-child { border-bottom: none; }
.landing-nav__drawer-links a:active { color: #00d8d8; }

.landing-nav__drawer-cta {
  margin-top: 16px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.landing-nav__drawer-cta:hover { background: var(--btn-primary-bg-hover); }

.landing-nav__drawer-pj {
  margin-top: 12px;
  width: 100%;
  height: 48px;
  border: 1px solid var(--color-primary-500);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-primary-500);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.landing-nav__drawer-pj:hover { background: var(--color-primary-50); }

@media (min-width: 1024px) {
  .landing-nav__drawer { display: none; }
}

.landing-above-fold-wrap {
  position: relative;
  overflow: hidden;
}

.landing-above-fold__video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.10;
  pointer-events: none;
  z-index: 0;
}

.landing-above-fold {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 36px;
  display: grid;
  gap: 28px;
}

.landing-trust {
  border-top: 1px solid #e3edec;
  border-bottom: 1px solid #e3edec;
  background: #ffffff;
}

.landing-trust__inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.landing-trust__inner p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  color: #3c4c4d;
}

.landing-trust__inner p span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8f0000;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 480px) {
  .landing-nav__inner { padding: 0 24px; }
  .landing-above-fold { padding: 36px 24px 44px; }
  .landing-trust__inner {
    padding: 20px 24px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (min-width: 1024px) {
  .landing-nav__inner {
    padding: 0 40px;
    height: 80px;
  }

  .landing-nav__links,
  .landing-nav__pj,
  .landing-nav__cta {
    display: inline-flex;
  }

  .landing-nav__btn {
    display: none;
  }

  .landing-above-fold {
    --landing-column-height: 620px;
    display: grid;
    grid-template-columns: 1fr 460px;
    align-items: stretch;
    max-width: 1240px;
    margin: 0 auto;
    padding: 56px 40px 56px;
    gap: 80px;
  }

  .landing-trust__inner {
    max-width: 1240px;
    padding: 24px 40px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }
}

/* Skip link — visualmente oculto até receber foco (WCAG 2.4.1) */
.skip-link {
  position: absolute;
  top: -100%;
  left: 8px;
  z-index: 9999;
  padding: 10px 16px;
  background: #052c2f;
  color: #ffffff;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  transition: top 0.1s;
}
.skip-link:focus { top: 0; }
</style>
