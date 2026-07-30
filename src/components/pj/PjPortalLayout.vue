<script setup lang="ts">
import type { PjView } from '../../types'
import { REPRESENTANTE_PADRAO } from '../../config/mockData'

const props = defineProps<{
  activeView: PjView
}>()

const emit = defineEmits<{
  (e: 'navigate', view: PjView): void
}>()

const navItems: Array<{ id: PjView; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'cartoes', label: 'Cartões de Despesas' },
  { id: 'aporte', label: 'Realizar Aporte' },
  { id: 'motorista', label: 'App do motorista' },
  { id: 'landing', label: 'Onboarding PF' },
]
</script>

<template>
  <div class="pj-layout">
    <aside
      class="pj-sidebar"
      aria-label="Menu principal"
    >
      <div class="pj-brand">
        <img src="/assets/logo-frotabank-br.png" alt="FrotaBank" class="pj-brand__logo-img" />
      </div>

      <nav class="pj-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="pj-nav__item"
          :class="{ 'is-active': props.activeView === item.id }"
          @click="emit('navigate', item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <div class="pj-main-shell">
      <header class="pj-topbar">
        <p class="pj-topbar__account">
          {{ REPRESENTANTE_PADRAO.nomeCompleto }} - {{ REPRESENTANTE_PADRAO.cpf }} - 144
        </p>
        <div class="pj-topbar__actions">
          <button
            type="button"
            class="pj-topbar__flow-switch"
            @click="emit('navigate', 'landing')"
          >
            Ir para onboarding
          </button>
          <p class="pj-topbar__user">
            nadia.penha
          </p>
        </div>
      </header>
      <main class="pj-main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.pj-layout {
  font-family: 'Instrument Sans', sans-serif;
  min-height: 100vh;
  background: #f3f6f9;
  display: grid;
  grid-template-columns: 232px 1fr;
}

.pj-sidebar {
  background: #0f7f88;
  color: #ffffff;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.pj-brand {
  padding: 16px 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.pj-brand__logo-img {
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
}

.pj-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
}

.pj-nav__item {
  height: 44px;
  border: none;
  background: transparent;
  color: #efffff;
  text-align: left;
  padding: 0 16px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.pj-nav__item:hover {
  background: rgba(255, 255, 255, 0.14);
}

.pj-nav__item.is-active {
  background: rgba(255, 255, 255, 0.24);
}

.pj-main-shell {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pj-topbar {
  height: 48px;
  background: #ffffff;
  border-bottom: 1px solid #c9d7df;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pj-topbar__account {
  margin: 0;
  color: #405568;
  font-size: 12px;
}

.pj-topbar__user {
  margin: 0;
  color: #7b8b98;
  font-size: 13px;
  font-weight: 700;
}

.pj-topbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pj-topbar__flow-switch {
  height: 30px;
  border: 1px solid #b6ccd8;
  border-radius: 999px;
  background: #ffffff;
  color: #35566f;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 0 12px;
  cursor: pointer;
}

.pj-topbar__flow-switch:hover {
  background: #f5f9fc;
}

.pj-main-content {
  padding: 12px;
}

@media (max-width: 1100px) {
  .pj-layout {
    grid-template-columns: 190px 1fr;
  }

  .pj-nav__item {
    font-size: 14px;
  }
}

@media (max-width: 900px) {
  .pj-layout {
    grid-template-columns: 1fr;
  }

  .pj-sidebar {
    padding: 10px 12px;
    border-right: none;
  }

  .pj-brand {
    border-bottom: none;
    padding: 0 0 8px;
  }

  .pj-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pj-nav__item {
    width: auto;
    padding: 0 12px;
    border-radius: 999px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.35);
  }

  .pj-topbar {
    height: auto;
    gap: 8px;
    align-items: flex-start;
    flex-direction: column;
    padding: 10px 12px;
  }

  .pj-topbar__actions {
    width: 100%;
    justify-content: space-between;
  }

  .pj-main-content {
    padding: 12px;
  }
}
</style>
