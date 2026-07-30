<script setup lang="ts">
import { computed } from 'vue'
import { formatDatePtBr } from '../../utils/formatters'
import { EMPRESA_PADRAO } from '../../config/mockData'

const props = withDefaults(
  defineProps<{
    razaoSocial?: string
    valorTotal?: string
    prazo?: string
    parcela?: string
  }>(),
  {
    razaoSocial: EMPRESA_PADRAO.razaoSocial,
    valorTotal: 'R$ 100.000,00',
    prazo: '12 meses',
    parcela: 'R$ 9.896,87',
  }
)

const emit = defineEmits<{
  (e: 'acessarDashboard'): void
}>()

const hoje = new Date()
const primeiroAporte = new Date(hoje)
primeiroAporte.setDate(hoje.getDate() + 1)

const steps = computed(() => [
  {
    icon: '✓',
    title: 'Contrato assinado',
    desc: `Hoje, ${formatDatePtBr(hoje)}`,
    done: true,
  },
  {
    icon: '2',
    title: 'Liberação do Crédito',
    desc: 'Até 1 hora',
    done: false,
  },
  {
    icon: '3',
    title: 'Aporte liberado',
    desc: `Previsão: ${formatDatePtBr(primeiroAporte)}`,
    done: false,
  },
  {
    icon: '4',
    title: 'Motoristas recebem',
    desc: 'Via cartão ou PIX FrotaBank',
    done: false,
  },
])
</script>

<template>
  <div class="pjca-screen">
    <header class="pjca-header">
      <img src="/assets/Rede-Frota.svg" alt="Rede Frota" class="pjca-header__logo" />
    </header>

    <main class="pjca-main">
      <div class="pjca-inner">

        <!-- Ícone de sucesso animado -->
        <div class="pjca-icon" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="44" fill="#fde8e8"/>
            <circle cx="44" cy="44" r="34" fill="#fcc5c5"/>
            <circle cx="44" cy="44" r="24" fill="#8f0000"/>
            <path d="M33 44.5L40 51.5L55 37" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="pjca-title">Contrato assinado!</h1>
        <p class="pjca-subtitle">
          O adiantamento de <strong>{{ props.valorTotal }}</strong> para
          <strong>{{ props.razaoSocial }}</strong> foi formalizado com sucesso.
        </p>

        <!-- Resumo financeiro -->
        <div class="pjca-summary">
          <div class="pjca-summary__item">
            <span>Valor do aporte</span>
            <strong>{{ props.valorTotal }}</strong>
          </div>
          <div class="pjca-summary__divider" aria-hidden="true"></div>
          <div class="pjca-summary__item">
            <span>Prazo</span>
            <strong>{{ props.prazo }}</strong>
          </div>
          <div class="pjca-summary__divider" aria-hidden="true"></div>
          <div class="pjca-summary__item">
            <span>Parcela mensal</span>
            <strong>{{ props.parcela }}</strong>
          </div>
        </div>

        <!-- Timeline de próximos passos -->
        <div class="pjca-timeline" role="list" aria-label="Próximos passos">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="pjca-timeline__item"
            :class="{ 'is-done': step.done }"
            role="listitem"
          >
            <div class="pjca-timeline__line" v-if="i < steps.length - 1" aria-hidden="true"></div>
            <div class="pjca-timeline__mark" aria-hidden="true">{{ step.icon }}</div>
            <div class="pjca-timeline__content">
              <p class="pjca-timeline__title">{{ step.title }}</p>
              <p class="pjca-timeline__desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Nota regulatória -->
        <div class="pjca-note" role="note">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="pjca-note__icon">
            <circle cx="10" cy="10" r="9" stroke="#8f0000" stroke-width="1.5"/>
            <path d="M10 9v5M10 6.5h.01" stroke="#8f0000" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>
            A CCB foi emitida, uma cópia do contrato será enviada ao e-mail cadastrado.
          </p>
        </div>

        <button type="button" class="pjca-cta" @click="emit('acessarDashboard')">
          Acessar o FrotaBank →
        </button>

      </div>
    </main>
  </div>
</template>

<style scoped>
.pjca-screen {
  min-height: 100vh;
  background: #fff5f5;
  display: flex;
  flex-direction: column;
}

/* ── Header minimalista ── */
.pjca-header {
  padding: 20px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e3edec;
  background: #fff;
}

.pjca-header__logo {
  height: 44px;
  object-fit: contain;
}

/* ── Main ── */
.pjca-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 64px;
}

.pjca-inner {
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* ── Ícone ── */
.pjca-icon {
  animation: pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Título ── */
.pjca-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #242424;
  text-align: center;
  line-height: 1.2;
}

.pjca-subtitle {
  margin: 0;
  font-size: 15px;
  color: #5c5c5c;
  text-align: center;
  line-height: 1.6;
  max-width: 420px;
}

.pjca-subtitle strong {
  color: #242424;
}

/* ── Resumo financeiro ── */
.pjca-summary {
  width: 100%;
  background: #fff;
  border: 1px solid #fcc5c5;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pjca-summary__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.pjca-summary__item span {
  font-size: 11px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
}

.pjca-summary__item strong {
  font-size: 16px;
  font-weight: 700;
  color: #8f0000;
  text-align: center;
}

.pjca-summary__divider {
  width: 1px;
  height: 36px;
  background: #fcc5c5;
  flex-shrink: 0;
}

/* ── Timeline ── */
.pjca-timeline {
  width: 100%;
  background: #fff;
  border: 1px solid #e3edec;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.pjca-timeline__item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
  padding-bottom: 20px;
}

.pjca-timeline__item:last-child {
  padding-bottom: 0;
}

.pjca-timeline__line {
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: 0;
  width: 2px;
  background: #e3edec;
}

.pjca-timeline__item.is-done .pjca-timeline__line {
  background: #8f0000;
}

.pjca-timeline__mark {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e3edec;
  color: #aaa;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.pjca-timeline__item.is-done .pjca-timeline__mark {
  background: #8f0000;
  color: #fff;
}

.pjca-timeline__content {
  padding-top: 3px;
}

.pjca-timeline__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #242424;
}

.pjca-timeline__item:not(.is-done) .pjca-timeline__title {
  color: #666;
}

.pjca-timeline__desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: #999;
}

.pjca-timeline__item.is-done .pjca-timeline__desc {
  color: #6b0000;
}

/* ── Nota ── */
.pjca-note {
  width: 100%;
  display: flex;
  gap: 10px;
  background: #fff5f5;
  border: 1px solid #fcc5c5;
  border-radius: 8px;
  padding: 12px 16px;
}

.pjca-note__icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 1px;
}

.pjca-note p {
  margin: 0;
  font-size: 14px;
  color: #6b0000;
  line-height: 1.55;
}

/* ── CTA ── */
.pjca-cta {
  width: 100%;
  height: 56px;
  background: #8f0000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-family: 'Red Hat Display', sans-serif;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.02em;
}

.pjca-cta:hover {
  background: #6b0000;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .pjca-title { font-size: 26px; }

  .pjca-summary {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .pjca-summary__divider {
    width: 100%;
    height: 1px;
  }

  .pjca-summary__item {
    align-items: flex-start;
  }
}
</style>
