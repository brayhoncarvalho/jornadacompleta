<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { maskCNPJ, maskCurrencyBRL, onlyDigits } from '../../utils/masks'
import { validateCNPJ } from '../../utils/validators'
import type { PjPropostaDados } from '../../types'
import { EMPRESA_PADRAO } from '../../config/mockData'
import { formatCurrencyBRL } from '../../utils/formatters'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar', dados: PjPropostaDados): void
}>()

const props = withDefaults(
  defineProps<{ valorInicial?: number; prazoInicial?: number }>(),
  { valorInicial: 100000, prazoInicial: 12 }
)

// Deriva valor por motorista a partir do valor simulado (BRL)
function initValorPorMotorista() {
  const centavos = Math.round((props.valorInicial / 10) * 100)
  return maskCurrencyBRL(String(centavos))
}

const cnpj = ref(EMPRESA_PADRAO.cnpj)
const razaoSocial = ref(EMPRESA_PADRAO.razaoSocial)
const dataAbertura = ref('1999-03-23')
const faturamentoMensal = ref('R$ 217.622.008,00')
const numMotoristas = ref(10)
const valorPorMotorista = ref(initValorPorMotorista())
const finalidade = ref('antecipacao-recebiveis')
const aceitouTermos = ref(true)
const submitted = ref(false)

const finalidadeOptions = [
  { label: 'Antecipação de recebíveis', value: 'antecipacao-recebiveis' },
  { label: 'Capital de giro', value: 'capital-giro' },
  { label: 'Gestão de frota', value: 'gestao-frota' },
  { label: 'Outros', value: 'outros' },
]

const errors = reactive({
  cnpj: '',
  razaoSocial: '',
  dataAbertura: '',
  faturamentoMensal: '',
  numMotoristas: '',
  valorPorMotorista: '',
  finalidade: '',
  termos: '',
})

const touched = reactive({
  cnpj: false, razaoSocial: false, dataAbertura: false,
  faturamentoMensal: false, numMotoristas: false,
  valorPorMotorista: false, finalidade: false, termos: false,
})

function onCnpjInput(e: Event) {
  const input = e.target as HTMLInputElement
  cnpj.value = maskCNPJ(input.value)
  nextTick(() => { input.value = cnpj.value })
}

function onFaturamentoInput(e: Event) {
  const input = e.target as HTMLInputElement
  faturamentoMensal.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = faturamentoMensal.value })
}

function onValorMotoristaInput(e: Event) {
  const input = e.target as HTMLInputElement
  valorPorMotorista.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = valorPorMotorista.value })
}

function parseCurrency(v: string): number {
  return parseInt(onlyDigits(v), 10) || 0
}

const valorTotalCentavos = computed(() =>
  parseCurrency(valorPorMotorista.value) * numMotoristas.value
)
const valorTotalFormatado = computed(() =>
  formatCurrencyBRL(valorTotalCentavos.value / 100)
)

function validateField(field: keyof typeof errors) {
  touched[field as keyof typeof touched] = true
  const validators: Record<string, () => string> = {
    cnpj: () => validateCNPJ(cnpj.value),
    razaoSocial: () => razaoSocial.value.trim().length < 3 ? 'Razão Social é obrigatória.' : '',
    dataAbertura: () => !dataAbertura.value ? 'Data de Abertura é obrigatória.' : '',
    faturamentoMensal: () => parseCurrency(faturamentoMensal.value) <= 0 ? 'Faturamento Mensal é obrigatório.' : '',
    numMotoristas: () => numMotoristas.value <= 0 ? 'Informe o número de motoristas.' : '',
    valorPorMotorista: () => parseCurrency(valorPorMotorista.value) <= 0 ? 'Valor por Motorista é obrigatório.' : '',
    finalidade: () => !finalidade.value ? 'Finalidade é obrigatória.' : '',
    termos: () => !aceitouTermos.value ? 'Você precisa aceitar a autorização.' : '',
  }
  if (validators[field]) errors[field] = validators[field]()
}

function validateAll() {
  Object.keys(errors).forEach(f => validateField(f as keyof typeof errors))
  return !Object.values(errors).some(e => e !== '')
}

function handleContinuar() {
  submitted.value = true
  if (!validateAll()) {
    nextTick(() => {
      document.querySelector('.pjpc-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar', {
    cnpj: cnpj.value,
    razaoSocial: razaoSocial.value.trim(),
    dataAbertura: dataAbertura.value,
    faturamentoMensal: parseCurrency(faturamentoMensal.value),
    numMotoristas: numMotoristas.value,
    valorPorMotorista: parseCurrency(valorPorMotorista.value),
    finalidade: finalidade.value,
  })
}
</script>

<template>
  <div class="pjpc-screen">
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
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">1</span>
            <span class="proposal-steps__label">EMPRESA</span>
          </li>
          <li class="proposal-steps__item">
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

        <div class="pjpc-hero">
          <h1 class="pjpc-title">Solicite o adiantamento para seus motoristas</h1>
          <p class="pjpc-subtitle">Preencha os dados da transportadora para análise de crédito.</p>
        </div>

        <form class="pjpc-form" @submit.prevent="handleContinuar" novalidate>

          <div class="pjpc-row">
            <div class="pjpc-field" :class="{ 'is-error': errors.cnpj }">
              <label for="pjpc-cnpj">CNPJ da Empresa</label>
              <input
                id="pjpc-cnpj"
                type="text"
                inputmode="numeric"
                placeholder="00.000.000/0000-00"
                :value="cnpj"
                @input="onCnpjInput"
                @blur="validateField('cnpj')"
                aria-describedby="pjpc-cnpj-err"
                autocomplete="off"
              />
              <span v-if="errors.cnpj" id="pjpc-cnpj-err" class="pjpc-error" role="alert">{{ errors.cnpj }}</span>
            </div>

            <div class="pjpc-field" :class="{ 'is-error': errors.razaoSocial }">
              <label for="pjpc-razao">Razão Social</label>
              <input
                id="pjpc-razao"
                type="text"
                placeholder="Razão Social da empresa"
                v-model="razaoSocial"
                @blur="validateField('razaoSocial')"
                aria-describedby="pjpc-razao-err"
              />
              <span v-if="errors.razaoSocial" id="pjpc-razao-err" class="pjpc-error" role="alert">{{ errors.razaoSocial }}</span>
            </div>
          </div>

          <div class="pjpc-row">
            <div class="pjpc-field" :class="{ 'is-error': errors.dataAbertura }">
              <label for="pjpc-abertura">Data de Abertura</label>
              <input
                id="pjpc-abertura"
                type="date"
                v-model="dataAbertura"
                @blur="validateField('dataAbertura')"
                aria-describedby="pjpc-abertura-err"
              />
              <span v-if="errors.dataAbertura" id="pjpc-abertura-err" class="pjpc-error" role="alert">{{ errors.dataAbertura }}</span>
            </div>

            <div class="pjpc-field" :class="{ 'is-error': errors.faturamentoMensal }">
              <label for="pjpc-faturamento">Faturamento Mensal</label>
              <input
                id="pjpc-faturamento"
                type="text"
                inputmode="numeric"
                placeholder="R$ 0,00"
                :value="faturamentoMensal"
                @input="onFaturamentoInput"
                @blur="validateField('faturamentoMensal')"
                aria-describedby="pjpc-faturamento-err"
              />
              <span v-if="errors.faturamentoMensal" id="pjpc-faturamento-err" class="pjpc-error" role="alert">{{ errors.faturamentoMensal }}</span>
            </div>
          </div>

          <div class="pjpc-row">
            <div class="pjpc-field" :class="{ 'is-error': errors.numMotoristas }">
              <label for="pjpc-motoristas">Nº de Motoristas</label>
              <input
                id="pjpc-motoristas"
                type="number"
                min="1"
                placeholder="Ex: 10"
                v-model.number="numMotoristas"
                @blur="validateField('numMotoristas')"
                aria-describedby="pjpc-motoristas-err"
              />
              <span v-if="errors.numMotoristas" id="pjpc-motoristas-err" class="pjpc-error" role="alert">{{ errors.numMotoristas }}</span>
            </div>

            <div class="pjpc-field" :class="{ 'is-error': errors.valorPorMotorista }">
              <label for="pjpc-valor-mot">Valor por Motorista</label>
              <input
                id="pjpc-valor-mot"
                type="text"
                inputmode="numeric"
                placeholder="R$ 0,00"
                :value="valorPorMotorista"
                @input="onValorMotoristaInput"
                @blur="validateField('valorPorMotorista')"
                aria-describedby="pjpc-valor-mot-err"
              />
              <span v-if="errors.valorPorMotorista" id="pjpc-valor-mot-err" class="pjpc-error" role="alert">{{ errors.valorPorMotorista }}</span>
            </div>
          </div>

          <div class="pjpc-field" :class="{ 'is-error': errors.finalidade }">
            <label for="pjpc-finalidade">Finalidade do Adiantamento</label>
            <select
              id="pjpc-finalidade"
              v-model="finalidade"
              @blur="validateField('finalidade')"
              aria-describedby="pjpc-finalidade-err"
            >
              <option value="">Selecione a finalidade</option>
              <option v-for="opt in finalidadeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <span v-if="errors.finalidade" id="pjpc-finalidade-err" class="pjpc-error" role="alert">{{ errors.finalidade }}</span>
          </div>

          <div class="pjpc-total" aria-live="polite">
            <div class="pjpc-total__label">Valor total do aporte estimado</div>
            <div class="pjpc-total__value">{{ valorTotalFormatado }}</div>
            <div class="pjpc-total__detail">{{ numMotoristas }} motoristas × {{ valorPorMotorista }} / motorista</div>
          </div>

          <div class="pjpc-field pjpc-checkbox-field" :class="{ 'is-error': errors.termos }">
            <label class="pjpc-checkbox-label">
              <input
                type="checkbox"
                v-model="aceitouTermos"
                @change="validateField('termos')"
              />
              <span>
                Autorizo a Rede Frota a consultar meus dados na Serasa/SPC
                e compartilhar informações com parceiros regulados para fins de análise de crédito.
              </span>
            </label>
            <span v-if="errors.termos" class="pjpc-error" role="alert">{{ errors.termos }}</span>
          </div>

          <button type="submit" class="pjpc-submit">
            Solicitar análise de crédito →
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout base ── */
.pjpc-screen {
  min-height: 100vh;
  background: var(--color-gray-50);
}

/* ── Header (reutiliza classes globais proposal-header) ── */
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

/* ── Main ── */
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
.pjpc-hero {
  margin-bottom: 28px;
}

.pjpc-badge {
  display: inline-block;
  background: #fde8e8;
  color: #6b0000;
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-bottom: 12px;
}

.pjpc-title {
  margin: 0 0 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-navy-800);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.pjpc-subtitle {
  margin: 0 0 24px;
  font-size: 16px;
  color: var(--color-navy-500);
  line-height: 1.55;
}

/* ── Form ── */
.pjpc-form {
  background: #ffffff;
  border: 1px solid #fde8e8;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 12px 40px rgba(10, 22, 40, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
}

.pjpc-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pjpc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.pjpc-field label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
}

.pjpc-field input,
.pjpc-field select {
  width: 100%;
  height: 50px;
  padding: 0 14px;
  border: 1.5px solid #fcc5c5;
  border-radius: 12px;
  font-size: 16px;
  color: var(--color-navy-800);
  background: #ffffff;
  transition: border-color 0.15s;
  font-family: inherit;
}

.pjpc-field input:focus,
.pjpc-field select:focus {
  outline: none;
  border-color: #8f0000;
  box-shadow: 0 0 0 3px rgba(143, 0, 0, 0.12);
}

.pjpc-field.is-error input,
.pjpc-field.is-error select {
  border-color: #e53e3e;
}

.pjpc-error {
  font-size: 12px;
  color: #e53e3e;
  font-weight: 500;
}

/* ── Total ── */
.pjpc-total {
  background: #fff5f5;
  border: 1px solid #fcc5c5;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pjpc-total__label {
  font-size: 12px;
  font-weight: 600;
  color: #6b0000;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pjpc-total__value {
  font-size: 28px;
  font-weight: 700;
  color: #8f0000;
  line-height: 1.1;
}

.pjpc-total__detail {
  font-size: 13px;
  color: #6b4444;
}

/* ── Checkbox ── */
.pjpc-checkbox-field {
  gap: 8px;
}

.pjpc-checkbox-label {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  cursor: pointer;
  font-size: 13px;
  color: #5c5c5c;
  line-height: 1.5;
}

.pjpc-checkbox-label input[type='checkbox'] {
  margin-top: 2px;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  accent-color: #8f0000;
  cursor: pointer;
}

/* ── CTA ── */
.pjpc-submit {
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

.pjpc-submit:hover {
  background: #6b0000;
  color: #ffffff;
}

/* ── Disclaimer ── */
.pjpc-disclaimer {
  font-size: 13px;
  color: #999;
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .pjpc-row {
    grid-template-columns: 1fr;
  }

  .pjpc-title {
    font-size: 22px;
  }
}
</style>
