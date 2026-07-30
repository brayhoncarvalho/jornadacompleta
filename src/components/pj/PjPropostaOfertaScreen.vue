<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PjPropostaDados } from '../../types'
import { TAXA_MENSAL_PADRAO, PRAZO_PJ_DISPONIVEL } from '../../config/constants'
import { EMPRESA_PADRAO } from '../../config/mockData'
import { formatCurrencyBRL, formatMonthlyRate, formatAnnualRateFromMonthly } from '../../utils/formatters'
import { calculatePricePMT } from '../../lib/financeCalculations'

const props = withDefaults(
  defineProps<{ dados?: Partial<PjPropostaDados>; prazoInicial?: number }>(),
  { dados: () => ({}), prazoInicial: 12 }
)

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar', oferta: { valorTotal: number; taxaMes: number; prazo: number }): void
}>()

const prazoOptions = [...PRAZO_PJ_DISPONIVEL]
const numMotoristas = computed(() => props.dados?.numMotoristas ?? 10)
const valorPorMotorista = computed(() => (props.dados?.valorPorMotorista ?? 1000000) / 100)
const valorTotal = computed(() => numMotoristas.value * valorPorMotorista.value)
const razaoSocial = computed(() => props.dados?.razaoSocial ?? EMPRESA_PADRAO.razaoSocial)

const closestPrazo = prazoOptions.reduce((prev, cur) =>
  Math.abs(cur - props.prazoInicial) < Math.abs(prev - props.prazoInicial) ? cur : prev
)
const selectedPrazo = ref(closestPrazo)

const parcela = computed(() => calculatePricePMT(valorTotal.value, TAXA_MENSAL_PADRAO, selectedPrazo.value))

const fmt = (v: number) => formatCurrencyBRL(v)
const fmtPctMes = (v: number) => formatMonthlyRate(v)
const fmtPctAno = (v: number) => formatAnnualRateFromMonthly(v)

function handleContinuar() {
  emit('continuar', {
    valorTotal: valorTotal.value,
    taxaMes: TAXA_MENSAL_PADRAO,
    prazo: selectedPrazo.value,
  })
}
</script>

<template>
  <div class="pjpo-screen">
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/Rede-Frota.svg" alt="Rede Frota" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <ol class="proposal-steps" aria-label="Progresso da contratação">
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">EMPRESA</span>
          </li>
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">2</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">3</span>
            <span class="proposal-steps__label">CADASTRO</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">4</span>
            <span class="proposal-steps__label">DOCUMENTOS</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">5</span>
            <span class="proposal-steps__label">REVISÃO</span>
          </li>
        </ol>

        <div class="pjpo-header">
          <p class="pjpo-empresa">{{ razaoSocial }}</p>
          <h1 class="pjpo-title">Crédito <span>pré-aprovado!</span></h1>
          <p class="pjpo-subtitle">Confira as condições e selecione o prazo desejado. A análise final ocorre após o envio dos documentos.</p>
        </div>

        <div class="pjpo-card">

          <div class="pjpo-highlight-row">
            <div class="pjpo-kv pjpo-kv--big">
              <span>Valor total do aporte</span>
              <strong>{{ fmt(valorTotal) }}</strong>
            </div>
            <div class="pjpo-kv">
              <span>Motoristas vinculados</span>
              <strong>{{ numMotoristas }} motoristas</strong>
            </div>
            <div class="pjpo-kv">
              <span>Valor por motorista</span>
              <strong>{{ fmt(valorPorMotorista) }}</strong>
            </div>
          </div>

          <hr class="pjpo-divider" />

          <div class="pjpo-prazo-section">
            <p class="pjpo-prazo-label">Selecione o prazo de pagamento:</p>
            <div class="pjpo-prazos" role="radiogroup" aria-label="Prazo em meses">
              <button
                v-for="p in prazoOptions"
                :key="p"
                type="button"
                class="pjpo-prazo-btn"
                :class="{ 'is-selected': selectedPrazo === p }"
                :aria-pressed="selectedPrazo === p"
                @click="selectedPrazo = p"
              >
                {{ p }}x
              </button>
            </div>
          </div>

          <div class="pjpo-conditions">
            <div class="pjpo-kv">
              <span>Taxa mensal (CCB)</span>
              <strong>{{ fmtPctMes(TAX_MES) }}</strong>
            </div>
            <div class="pjpo-kv">
              <span>Taxa anual</span>
              <strong>{{ fmtPctAno(TAX_MES) }}</strong>
            </div>
            <div class="pjpo-kv">
              <span>Prazo selecionado</span>
              <strong>{{ selectedPrazo }} meses</strong>
            </div>
            <div class="pjpo-kv">
              <span>Parcela estimada</span>
              <strong>{{ fmt(parcela) }}/mês</strong>
            </div>
          </div>
        <!--
          <div class="pjpo-regulatory" role="note" aria-label="Informação regulatória Dock">
            <svg class="pjpo-regulatory__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#f59e0b" stroke-width="1.5"/>
              <path d="M10 6v4M10 14h.01" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>
              <strong>Papel da Dock:</strong> A Cédula de Crédito Bancário (CCB) é emitida e formalizada pela
              <strong>Rede Frota</strong> na qualidade de Sociedade de Crédito Direto (SCD).
              O crédito é originado, estruturado e distribuído pela <strong>Rede Frota</strong>.
            </p>
          </div>-->
        </div>

        <button type="button" class="pjpo-submit" @click="handleContinuar">
          Aceitar proposta e continuar →
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.pjpo-screen {
  min-height: 100vh;
  background: var(--color-gray-50);
}

.proposal-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-gray-50);
  border-bottom: 1px solid #fde8e8;
}

.proposal-header__inner {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.proposal-header__logo {
  height: 44px;
  object-fit: contain;
}

.proposal-header__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1.5px solid #fde8e8;
  border-radius: 999px;
  background: transparent;
  color: var(--color-navy-800);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.proposal-header__back:hover {
  background: #fff5f5;
}

.proposal-main {
  padding: 32px 20px 64px;
}

.proposal-main__inner {
  max-width: 640px;
  margin: 0 auto;
}

/* ── Stepper ── */
.proposal-steps {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.proposal-steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  position: relative;
}

.proposal-steps__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(50% + 18px);
  right: calc(-50% + 18px);
  height: 1.5px;
  background: #fde8e8;
}

.proposal-steps__item.is-done:not(:last-child)::after,
.proposal-steps__item.is-active:not(:last-child)::after {
  background: #8f0000;
}

.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #fcc5c5;
  background: #ffffff;
  color: var(--color-navy-400);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.proposal-steps__item.is-active .proposal-steps__mark {
  background: #8f0000;
  border-color: #8f0000;
  color: #ffffff;
}

.proposal-steps__item.is-done .proposal-steps__mark {
  background: #8f0000;
  border-color: #8f0000;
  color: #ffffff;
}

.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-gray-400);
  line-height: 1.2;
}

.proposal-steps__item.is-active .proposal-steps__label,
.proposal-steps__item.is-done .proposal-steps__label {
  color: #8f0000;
}

/* ── Hero ── */
.pjpo-header {
  margin-bottom: 24px;
}

.pjpo-empresa {
  margin: 0 0 4px;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.pjpo-title {
  margin: 0 0 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-navy-800);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.pjpo-title span {
  color: #8f0000;
}

.pjpo-subtitle {
  margin: 0;
  font-size: 15px;
  color: #5c5c5c;
}

/* ── Card ── */
.pjpo-card {
  background: #fff5f5;
  border: 1px solid #fcc5c5;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.pjpo-highlight-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.pjpo-kv {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pjpo-kv span {
  font-size: 12px;
  color: #777;
  font-weight: 500;
}

.pjpo-kv strong {
  font-size: 16px;
  color: #242424;
  font-weight: 700;
}

.pjpo-kv--big strong {
  font-size: 22px;
  color: #8f0000;
}

.pjpo-divider {
  border: none;
  border-top: 1px solid #fcc5c5;
  margin: 16px 0;
}

/* ── Prazo ── */
.pjpo-prazo-section {
  margin-bottom: 20px;
}

.pjpo-prazo-label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: #3b3b3b;
}

.pjpo-prazos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pjpo-prazo-btn {
  min-width: 64px;
  height: 44px;
  border: 1.5px solid #fcc5c5;
  border-radius: 6px;
  background: #fff;
  color: #5c5c5c;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.pjpo-prazo-btn.is-selected {
  background: #8f0000;
  border-color: #8f0000;
  color: #fff;
}

.pjpo-prazo-btn:hover:not(.is-selected) {
  border-color: #8f0000;
  color: #8f0000;
}

/* ── Conditions ── */
.pjpo-conditions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  margin-bottom: 20px;
}

/* ── Regulatory ── */
.pjpo-regulatory {
  display: flex;
  gap: 10px;
  background: #fffbf0;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 14px;
}

.pjpo-regulatory__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
}

.pjpo-regulatory p {
  margin: 0;
  font-size: 12px;
  color: #78350f;
  line-height: 1.5;
}

/* ── CTA ── */
.pjpo-submit {
  width: 100%;
  height: 54px;
  background: #8f0000;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.pjpo-submit:hover {
  background: #6b0000;
  color: #ffffff;
}

@media (max-width: 600px) {
  .pjpo-highlight-row {
    grid-template-columns: 1fr 1fr;
  }

  .pjpo-conditions {
    grid-template-columns: 1fr;
  }
}
</style>
