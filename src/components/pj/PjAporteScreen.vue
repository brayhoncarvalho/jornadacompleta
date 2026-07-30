<script setup lang="ts">
import PjPortalLayout from './PjPortalLayout.vue'
import type { PjView } from '../../types'
import { APORTES_EXEMPLO } from '../../config/mockData'
import { PJ_SALDO_POS_APORTE, PJ_SALDO_ATUAL_APORTE, PJ_LIMITE_DISPONIVEL, PJ_LIMITE_UTILIZADO, PJ_LIMITE_TOTAL } from '../../config/constants'
import { formatCurrencyBRL } from '../../utils/formatters'

const emit = defineEmits<{
  (e: 'navigate', view: PjView): void
}>()

const linhas = APORTES_EXEMPLO

const fmtPJ = (v: number) => formatCurrencyBRL(v)
</script>

<template>
  <PjPortalLayout
    active-view="aporte"
    @navigate="(view) => emit('navigate', view)"
  >
    <section
      class="aporte-page"
      aria-label="Tela de realizar aporte"
    >
      <header class="aporte-header">
        <h1>Realizar Aporte</h1>
        <div class="aporte-balances">
          <p>Saldo em conta após o aporte: <strong>{{ fmtPJ(PJ_SALDO_POS_APORTE) }}</strong></p>
          <p>Saldo atual para aporte: <strong>{{ fmtPJ(PJ_SALDO_ATUAL_APORTE) }}</strong></p>
        </div>
      </header>

      <div class="aporte-top-grid">
        <article class="aporte-limit-card">
          <div class="aporte-limit-card__left">
            <p class="aporte-limit-card__label">LIMITE DISPONÍVEL</p>
            <p class="aporte-limit-card__value">{{ fmtPJ(PJ_LIMITE_DISPONIVEL) }}</p>
          </div>
          <div class="aporte-limit-card__right">
            <div class="aporte-limit-card__used-row">
              <span class="aporte-limit-card__used">Utilizado: {{ fmtPJ(PJ_LIMITE_UTILIZADO) }}</span>
              <span class="aporte-limit-card__total">Limite: {{ fmtPJ(PJ_LIMITE_TOTAL) }}</span>
            </div>
            <div class="aporte-limit-card__track">
              <span class="aporte-limit-card__bar"></span>
            </div>
            <p class="aporte-limit-card__hint">80% do seu limite disponível — aproveite agora</p>
          </div>
        </article>

        <article class="aporte-fonte-card">
          <p class="aporte-fonte-card__tag">Selecionado</p>
          <div class="aporte-fonte-card__body">
            <div class="aporte-fonte-card__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#0f7f88"/><path d="M19 7H5C4.45 7 4 7.45 4 8v10c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm0 2v1H5V9h14zM5 18v-6h14v6H5z" fill="white"/><rect x="7" y="14" width="4" height="2" rx="1" fill="white"/></svg>
            </div>
            <div class="aporte-fonte-card__info">
              <h2>Usar saldo da conta</h2>
              <p>Saldo próprio disponível para aporte.</p>
            </div>
            <strong>{{ fmtPJ(PJ_SALDO_ATUAL_APORTE) }}</strong>
          </div>
        </article>
      </div>

      <div class="aporte-table-wrap">
        <table class="aporte-table">
          <thead>
            <tr>
              <th>ID Card</th>
              <th>Conta</th>
              <th>Nome impresso</th>
              <th>Número cartão</th>
              <th>Saldo atual</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tarifa</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="linha in linhas"
              :key="linha.id"
            >
              <td>{{ linha.id }}</td>
              <td>{{ linha.conta }}</td>
              <td>{{ linha.nome }}</td>
              <td>{{ linha.numero }}</td>
              <td>...</td>
              <td>
                <input
                  type="text"
                  value="Digite a descrição"
                  readonly
                />
              </td>
              <td>
                <input
                  type="text"
                  :value="linha.valor"
                  readonly
                />
              </td>
              <td>{{ linha.tarifa }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  </PjPortalLayout>
</template>

<style scoped>
.aporte-page {
  background: #ffffff;
  border: 1px solid #dae4ec;
  border-radius: 12px;
  padding: 16px;
}

.aporte-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.aporte-header h1 {
  margin: 0;
  color: #3f5367;
  font-size: 20px;
  font-weight: 500;
}

.aporte-balances {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.aporte-balances p {
  margin: 0;
  background: #f7fbfd;
  border: 1px solid #dae4ec;
  border-radius: 999px;
  padding: 5px 12px;
  color: #52687b;
  font-size: 13px;
}

.aporte-balances strong {
  color: #3d4f60;
}

.aporte-top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.aporte-limit-card {
  background: linear-gradient(90deg, #0f7f88 0%, #49a8b2 100%);
  border-radius: 12px;
  color: #ffffff;
  padding: 18px;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  min-height: 130px;
}

.aporte-limit-card__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aporte-limit-card__label {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.aporte-limit-card__value {
  margin: 0;
  font-size: 36px;
  line-height: 1;
  font-weight: 700;
}

.aporte-limit-card__right {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.aporte-limit-card__used-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
}

.aporte-limit-card__total {
  font-size: 14px;
  font-weight: 600;
}

.aporte-limit-card__track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  overflow: hidden;
}

.aporte-limit-card__bar {
  display: block;
  width: 80%;
  height: 100%;
  border-radius: 999px;
  background: #ffffff;
}

.aporte-limit-card__hint {
  margin: 0;
  font-size: 12px;
  opacity: 0.85;
}

.aporte-fonte-card {
  position: relative;
  border: 1px solid #d7e3ec;
  border-radius: 12px;
  padding: 18px;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.aporte-fonte-card__tag {
  position: absolute;
  top: -8px;
  left: 14px;
  margin: 0;
  background: #0f7f88;
  color: #ffffff !important;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
}

.aporte-fonte-card__body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aporte-fonte-card__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aporte-fonte-card__info {
  flex: 1;
  min-width: 0;
}

.aporte-fonte-card__info h2 {
  margin: 0 0 2px;
  color: #2a3f53;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.aporte-fonte-card__info p {
  margin: 0;
  color: #597184;
  font-size: 13px;
}

.aporte-fonte-card__body strong {
  flex-shrink: 0;
  color: #0f7f88;
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.aporte-table-wrap {
  overflow-x: auto;
  border: 1px solid #d8e3ea;
  border-radius: 8px;
}

.aporte-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.aporte-table thead {
  background: #0f7f88;
  color: #ffffff;
}

.aporte-table th,
.aporte-table td {
  text-align: left;
  padding: 10px;
  font-size: 13px;
  border-bottom: 1px solid #e4ebf0;
  color: #43596e;
}

.aporte-table th {
  color: #ffffff;
  font-size: 12px;
}

.aporte-table input {
  width: 100%;
  height: 32px;
  border: 1px solid #c9d8e3;
  border-radius: 4px;
  color: #99a8b5;
  background: #ffffff;
  padding: 0 10px;
  font-size: 13px;
}

@media (max-width: 1080px) {
  .aporte-header {
    flex-direction: column;
  }

  .aporte-top-grid {
    grid-template-columns: 1fr;
  }
}
</style>
