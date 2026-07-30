<script setup lang="ts">
import type { PjView } from '../../types'
import { LANCAMENTOS_MOTORISTA } from '../../config/mockData'

const emit = defineEmits<{
  (e: 'navigate', view: PjView): void
}>()

const lancamentos = LANCAMENTOS_MOTORISTA
</script>

<template>
  <section
    class="motorista-screen"
    aria-label="Mock de app do motorista"
  >
    <header class="motorista-top-actions">
      <button
        type="button"
        @click="emit('navigate', 'dashboard')"
      >
        Voltar ao dashboard
      </button>
    </header>

    <article class="phone-frame">
      <div class="phone-header">
        <p class="phone-header__time">
          17:18
        </p>
        <p class="phone-header__battery">
          65%
        </p>
      </div>

      <div class="phone-body">
      <div class="phone-card">
        <p class="phone-card__brand">
          frotabank
        </p>
        <div class="phone-card__middle">
          <!-- Chip -->
          <svg class="phone-card__chip" width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0.5" y="0.5" width="35" height="27" rx="3.5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)"/>
            <rect x="12" y="0" width="12" height="28" fill="rgba(255,255,255,0.12)"/>
            <rect x="0" y="9" width="36" height="10" fill="rgba(255,255,255,0.12)"/>
            <rect x="12" y="9" width="12" height="10" fill="rgba(255,255,255,0.18)"/>
            <line x1="12" y1="0.5" x2="12" y2="27.5" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <line x1="24" y1="0.5" x2="24" y2="27.5" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <line x1="0.5" y1="9" x2="35.5" y2="9" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <line x1="0.5" y1="19" x2="35.5" y2="19" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
          </svg>
          <!-- NFC / Aproximação -->
          <svg class="phone-card__nfc" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.5 6.5C4.3 8.7 4.3 12.3 6.5 14.5" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M9.5 9.5C8.4 10.6 8.4 12.4 9.5 13.5" stroke="rgba(255,255,255,0.7)" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M12.5 12C12.5 11.17 12 10.5 12 10.5V13.5C12 13.5 12.5 12.83 12.5 12Z" fill="rgba(255,255,255,0.85)"/>
            <path d="M12.5 6C15.8 7.7 18 11.1 18 15" stroke="rgba(255,255,255,0.4)" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M12.5 9C14.4 10.2 15.5 12.5 15.5 15" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="phone-card__name">
          LULA MOLUSCO
        </p>
        <div class="phone-card__bottom">
          <p class="phone-card__number">
            4102********1881
          </p>
          <svg class="phone-card__visa" width="46" height="15" viewBox="0 0 1336 430" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
            <path d="M507.369 7.60031L332.588 423.495H218.557L132.547 91.592C127.325 71.1489 122.785 63.6595 106.904 55.0468C80.9894 41.0181 38.172 27.8632 0.5 19.6942L3.05875 7.60031H186.614C210.012 7.60031 231.045 23.1338 236.357 50.0053L281.782 290.663L394.047 7.60031H507.369ZM954.17 287.709C954.629 177.942 801.98 171.895 803.03 122.86C803.356 107.937 817.603 92.0705 848.788 88.0207C864.245 86.0028 906.833 84.4633 955.136 106.633L974.083 18.4391C948.127 9.0427 914.732 0 873.18 0C766.554 0 691.515 56.5308 690.883 137.478C690.194 197.351 744.443 230.762 785.313 250.658C827.359 271.031 841.466 284.124 841.307 302.348C841.008 330.246 807.772 342.562 776.712 343.047C722.492 343.879 691.029 328.415 665.949 316.786L646.397 407.899C671.602 419.432 718.125 429.494 766.359 430C879.688 430 953.822 374.17 954.17 287.709ZM1235.73 423.502H1335.5L1248.41 7.60031H1156.32C1135.62 7.60031 1118.15 19.6249 1110.42 38.1125L948.545 423.495H1061.82L1084.31 361.368H1222.71L1235.74 423.495L1235.73 423.502ZM1115.36 276.135L1172.14 119.982L1204.82 276.135H1115.37H1115.36ZM661.506 7.60031L572.304 423.495H464.433L553.67 7.60031H661.506Z" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>
      </div>

      <section
        class="phone-balance"
        aria-label="Saldo do cartao"
      >
        <p class="phone-balance__label">
          Saldo do cartao
        </p>
        <p class="phone-balance__value">
          R$ 5,00
        </p>
      </section>

      <div class="phone-actions">
        <button type="button">
          Pix
        </button>
        <button type="button">
          Extrato
        </button>
        <button type="button">
          Recarga
        </button>
      </div>

      <section
        class="phone-list"
        aria-label="Últimos lançamentos"
      >
        <header>
          <h2>Últimos lançamentos (3)</h2>
          <span>Ver mais</span>
        </header>
        <article
          v-for="item in lancamentos"
          :key="item.descricao + item.data"
          class="phone-list__item"
        >
          <div>
            <p class="phone-list__desc">
              {{ item.descricao }}
            </p>
            <p class="phone-list__date">
              {{ item.data }}
            </p>
          </div>
          <strong :class="{ 'is-out': item.tipo === 'out' }">{{ item.valor }}</strong>
        </article>
      </section>
      </div><!-- /.phone-body -->

    </article>
  </section>
</template>

<style scoped>
.motorista-screen {
  min-height: 100vh;
  background: #f3f6f9;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.motorista-top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.motorista-top-actions button {
  height: 38px;
  border: none;
  border-radius: 999px;
  padding: 0 14px;
  background: #0f7f88;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.phone-frame {
  width: 100%;
  max-width: 392px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #e2eaf0;
  box-shadow: 0 12px 30px rgba(21, 45, 59, 0.1);
  padding-bottom: 12px;
}

.phone-header {
  height: 80px;
  background: #15969c;
  color: #ffffff;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.phone-body {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  margin-top: -16px;
  padding: 16px 0 0;
  flex: 1;
}

.phone-header__time,
.phone-header__battery {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.phone-card {
  margin: 0 16px 12px;
  border-radius: 12px;
  padding: 16px;
  min-height: 176px;
  background: linear-gradient(145deg, #1f8e92 0%, #2c9fa4 100%);
  color: #ffffff;
}

.phone-card__brand {
  margin: 0;
  text-align: right;
  opacity: 0.6;
}

.phone-card__middle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 8px;
}

.phone-card__chip {
  flex-shrink: 0;
}

.phone-card__nfc {
  flex-shrink: 0;
}

.phone-card__name {
  margin: 8px 0 6px;
  font-size: 16px;
  font-weight: 700;
}

.phone-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.phone-card__number {
  margin: 0;
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
}

.phone-card__visa {
  flex-shrink: 0;
  opacity: 0.85;
}

.phone-balance {
  padding: 14px 16px 4px;
}

.phone-balance__label {
  margin: 0;
  color: #617b8f;
  font-size: 13px;
}

.phone-balance__value {
  margin: 0;
  color: #1f3347;
  font-size: 32px;
  line-height: 1.05;
  font-weight: 700;
}

.phone-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 16px;
}

.phone-actions button {
  min-height: 48px;
  border: 1px solid #d8e2ea;
  border-radius: 12px;
  background: #ffffff;
  color: #1f3347;
  font-size: 14px;
  font-weight: 700;
}

.phone-list {
  padding: 10px 16px;
}

.phone-list header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.phone-list h2 {
  margin: 0;
  color: #1f3347;
  font-size: 14px;
}

.phone-list span {
  color: #129a9c;
  font-size: 13px;
  font-weight: 700;
}

.phone-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #e6edf3;
}

.phone-list__desc {
  margin: 0;
  color: #20384d;
  font-size: 13px;
  font-weight: 700;
}

.phone-list__date {
  margin: 2px 0 0;
  color: #6f8799;
  font-size: 12px;
}

.phone-list strong {
  color: #1e9e5e;
  font-size: 13px;
}

.phone-list strong.is-out {
  color: #cf3f59;
}

.phone-end {
  margin: 12px 0 0;
  text-align: center;
  color: #798d9c;
  font-size: 18px;
}

@media (max-width: 560px) {
  .phone-card__number {
    font-size: 30px;
  }

  .phone-balance__value {
    font-size: 46px;
  }

  .phone-list__desc {
    font-size: 18px;
  }
}
</style>
