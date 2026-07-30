<script setup lang="ts">
import PjPortalLayout from './PjPortalLayout.vue'
import type { PjView } from '../../types'
import { PJ_SALDO_CONTA, PJ_SALDO_CARTOES, PJ_GASTO_MEDIO_CARTOES, PJ_LIMITE_DISPONIVEL, PJ_LIMITE_UTILIZADO } from '../../config/constants'
import { formatCurrencyBRL } from '../../utils/formatters'

const emit = defineEmits<{
  (e: 'navigate', view: PjView): void
}>()

const fmtPJ = (v: number) => formatCurrencyBRL(v)

const indicadores = [
  { titulo: 'Saldo em conta', valor: fmtPJ(PJ_SALDO_CONTA), acao: 'Ver extrato' },
  { titulo: 'Saldo nos Cartões', valor: fmtPJ(PJ_SALDO_CARTOES), acao: 'Ver cartões' },
  { titulo: 'Gasto Médio nos Cartões', valor: fmtPJ(PJ_GASTO_MEDIO_CARTOES), acao: 'Ver cartões' },
]

const movimentacoes = [
  { nome: 'Compras', valor: fmtPJ(0) },
  { nome: 'Pix', valor: fmtPJ(0) },
  { nome: 'Saque', valor: fmtPJ(0) },
  { nome: 'Recarga', valor: fmtPJ(0) },
]


</script>

<template>
  <PjPortalLayout
    active-view="dashboard"
    @navigate="(view) => emit('navigate', view)"
  >
    <div class="db-grid">
      <section
        class="db-limit-card"
        aria-label="Resumo de limite disponível"
      >
        <div class="db-limit-card__left">
          <p class="db-limit-card__label">
            LIMITE DISPONÍVEL
          </p>
          <p class="db-limit-card__value">
            {{ fmtPJ(PJ_LIMITE_DISPONIVEL) }}
          </p>
        </div>
        <div class="db-limit-card__right">
          <p class="db-limit-card__used">
            Utilizado: {{ fmtPJ(PJ_LIMITE_UTILIZADO) }}
          </p>
          <div class="db-limit-card__track">
            <span class="db-limit-card__bar"></span>
          </div>
          <p class="db-limit-card__hint">
            80% do seu limite disponível — aproveite agora
          </p>
        </div>
      </section>

      <aside
        class="db-banner"
        aria-label="Banner de adiantamento"
      >
        <img src="/assets/publicidade-redebank.png" alt="Antecipação de Recebíveis — Mais fluxo de caixa para sua operação" class="db-banner__img" />
      </aside>

      <section
        class="db-cards"
        aria-label="Indicadores da conta"
      >
        <article
          v-for="item in indicadores"
          :key="item.titulo"
          class="db-card"
        >
          <h3>{{ item.titulo }}</h3>
          <p class="db-card__value">
            {{ item.valor }}
          </p>
          <button
            type="button"
            @click="emit('navigate', item.titulo.includes('Cartões') ? 'cartoes' : 'aporte')"
          >
            {{ item.acao }} ->
          </button>
        </article>
      </section>

      <section
        class="db-movs"
        aria-label="Movimentações recentes"
      >
        <header class="db-block-header">
          <h3>Movimentações recentes</h3>
          <p>R$ 0,00</p>
        </header>
        <div class="db-mov-grid">
          <article
            v-for="mov in movimentacoes"
            :key="mov.nome"
            class="db-mov-item"
          >
            <p>{{ mov.nome }}</p>
            <strong>{{ mov.valor }}</strong>
          </article>
        </div>
      </section>

      <section
        class="db-chart"
        aria-label="Resumo de faturas"
      >
        <header class="db-block-header db-block-header--chart">
          <h3>Faturas</h3>
          <p>Últimos 30 dias</p>
        </header>
        <svg
          viewBox="0 0 480 220"
          role="img"
          aria-label="Gráfico de faturas com curva crescente"
          class="db-chart__svg"
        >
          <path
            d="M0 218 L120 218 L180 218 L240 36 L300 120 L360 154 L430 130 L480 96 L480 220 L0 220 Z"
            fill="rgba(30, 158, 171, 0.18)"
          />
          <path
            d="M0 218 L120 218 L180 218 L240 36 L300 120 L360 154 L430 130 L480 96"
            fill="none"
            stroke="#1495a7"
            stroke-width="3"
          />
        </svg>
      </section>


    </div>
  </PjPortalLayout>
</template>

<style scoped>
.db-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 300px;
  gap: 10px;
}

.db-limit-card {
  grid-column: 1 / span 2;
  align-self: start;
  min-height: 146px;
  background: linear-gradient(90deg, #0f7f88 0%, #49a8b2 100%);
  color: #ffffff;
  border-radius: 12px;
  padding: 18px;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.db-limit-card__label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.db-limit-card__value {
  margin: 2px 0 0;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
}

.db-limit-card__used {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
}

.db-limit-card__track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  overflow: hidden;
}

.db-limit-card__bar {
  display: block;
  width: 80%;
  height: 100%;
  border-radius: 999px;
  background: #ffffff;
}

.db-limit-card__hint {
  margin: 8px 0 0;
  font-size: 14px;
}

.db-banner {
  grid-column: 3;
  grid-row: 1 / span 3;
  border-radius: 12px;
  overflow: hidden;
  line-height: 0;
}

.db-banner__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

.db-cards {
  grid-column: 1 / span 2;
  align-self: start;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.db-card {
  background: #ffffff;
  border: 1px solid #dce4eb;
  border-radius: 12px;
  padding: 16px;
}

.db-card h3 {
  margin: 0;
  font-size: 13px;
  color: #6e7f8f;
  font-weight: 500;
}

.db-card__value {
  margin: 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1f3648;
}

.db-card button {
  border: none;
  background: none;
  color: #0f7f88;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.db-movs,
.db-chart {
  background: #ffffff;
  border: 1px solid #dce4eb;
  border-radius: 12px;
  padding: 14px;
}

.db-movs {
  grid-column: 1;
}

.db-chart {
  grid-column: 2;
}

.db-block-header--chart {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.db-block-header--chart h3,
.db-block-header--chart p {
  line-height: 1.08;
}

.db-block-header--chart p {
  font-size: 13px;
}

.db-block-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.db-block-header h3 {
  margin: 0;
  font-size: 14px;
  color: #29455e;
}

.db-block-header p {
  margin: 0;
  font-size: 14px;
  color: #587187;
}

.db-mov-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.db-mov-item {
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  min-height: 56px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.db-mov-item p {
  margin: 0;
  color: #4e6171;
  font-size: 14px;
}

.db-mov-item strong {
  color: #22384e;
  font-size: 14px;
}

.db-chart__svg {
  width: 100%;
  height: 200px;
  border: 1px solid #e5edf4;
  border-radius: 8px;
}

@media (max-width: 1080px) {
  .db-grid {
    grid-template-columns: 1fr;
  }

  .db-limit-card,
  .db-cards,
  .db-movs,
  .db-chart,
  .db-banner {
    grid-column: auto;
    grid-row: auto;
  }

  .db-cards {
    grid-template-columns: 1fr;
  }

  .db-limit-card {
    grid-template-columns: 1fr;
  }

  .db-banner h2 {
    font-size: 34px;
  }

  .db-banner p {
    font-size: 24px;
  }
}
</style>
