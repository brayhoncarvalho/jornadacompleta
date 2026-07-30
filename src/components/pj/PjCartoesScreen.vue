<script setup lang="ts">
import PjPortalLayout from './PjPortalLayout.vue'
import type { PjView } from '../../types'
import { CARTOES_PJ } from '../../config/mockData'

const emit = defineEmits<{
  (e: 'navigate', view: PjView): void
}>()

const linhas = CARTOES_PJ
</script>

<template>
  <PjPortalLayout
    active-view="cartoes"
    @navigate="(view) => emit('navigate', view)"
  >
    <section
      class="cards-page"
      aria-label="Cartões de Despesas"
    >
      <h1>Cartões de Despesas</h1>

      <div class="cards-filters">
        <label>
          Buscar cartão
          <input
            type="text"
            value="ID/Número do cartão, conta ou nome impresso"
            readonly
          />
        </label>
        <label>
          Status
          <input
            type="text"
            value=""
            readonly
          />
        </label>
        <label>
          Grupos
          <input
            type="text"
            value="Transportador Roda"
            readonly
          />
        </label>
        <div class="cards-filters__actions">
          <button type="button">
            Buscar
          </button>
          <button
            type="button"
            @click="emit('navigate', 'aporte')"
          >
            Aporte múltiplo
          </button>
          <button type="button">
            Novo Cartão
          </button>
        </div>
      </div>

      <div class="cards-table-wrap">
        <table class="cards-table">
          <thead>
            <tr>
              <th>Cartão (ID)</th>
              <th>Nome impresso</th>
              <th>Número cartão</th>
              <th>Data validade</th>
              <th>Grupo</th>
              <th>Status do cartão</th>
              <th>Funções ativas</th>
              <th>Saldo atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="linha in linhas"
              :key="linha.id"
            >
              <td>{{ linha.id }}</td>
              <td>{{ linha.nome }}</td>
              <td>{{ linha.numero }}</td>
              <td>{{ linha.validade }}</td>
              <td>{{ linha.grupo }}</td>
              <td>
                <span
                  class="status-chip"
                  :class="{ 'is-blocked': linha.status === 'Bloqueado' }"
                >{{ linha.status }}</span>
              </td>
              <td>PIX • Compras</td>
              <td>{{ linha.saldo }}</td>
              <td>
                <button
                  type="button"
                  class="cards-action"
                >
                  Ações
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  </PjPortalLayout>
</template>

<style scoped>
.cards-page {
  background: #ffffff;
  border: 1px solid #dae4ec;
  border-radius: 12px;
  padding: 16px;
}

.cards-page h1 {
  margin: 0 0 12px;
  font-size: 20px;
  line-height: 1.2;
  color: #3f5367;
  font-weight: 500;
}

.cards-filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 10px;
  margin-bottom: 14px;
}

.cards-filters label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #4f677d;
  font-size: 13px;
}

.cards-filters input {
  height: 34px;
  border: 1px solid #c5d4df;
  border-radius: 4px;
  padding: 0 10px;
  color: #6b7f92;
  background: #ffffff;
  font-size: 13px;
}

.cards-filters__actions {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.cards-filters__actions button {
  height: 34px;
  border: none;
  border-radius: 4px;
  background: #0f7f88;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 0 12px;
  cursor: pointer;
}

.cards-table-wrap {
  overflow-x: auto;
  border: 1px solid #d8e3ea;
  border-radius: 8px;
}

.cards-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

.cards-table thead {
  background: #0f7f88;
  color: #ffffff;
}

.cards-table th,
.cards-table td {
  text-align: left;
  padding: 10px;
  font-size: 13px;
  border-bottom: 1px solid #e4ebf0;
  color: #43596e;
}

.cards-table th {
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ecf9f2;
  color: #147845;
  font-size: 12px;
  font-weight: 700;
}

.status-chip.is-blocked {
  background: #fff0f3;
  color: #af2847;
}

.cards-action {
  width: 70px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: #0f7f88;
  color: #ffffff;
  font-size: 12px;
}

@media (max-width: 1080px) {
  .cards-filters {
    grid-template-columns: 1fr;
  }

  .cards-filters__actions {
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
