<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { maskCurrencyBRL, onlyDigits } from '../../utils/masks'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const naturezaJuridica = ref('sa')
const cnae = ref('4930-2/02')
const porte = ref('grande')
const nomeFantasia = ref('KOTHE')
const capitalSocial = ref('R$ 217.622.008,00')
const banco = ref('341')
const tipoConta = ref('corrente')
const agencia = ref('0001')
const conta = ref('12345-6')

const errors = reactive({
  naturezaJuridica: '',
  cnae: '',
  porte: '',
  capitalSocial: '',
  banco: '',
  tipoConta: '',
  agencia: '',
  conta: '',
})

const touched = reactive({
  naturezaJuridica: false,
  cnae: false,
  porte: false,
  capitalSocial: false,
  banco: false,
  tipoConta: false,
  agencia: false,
  conta: false,
})

const naturezaOptions = [
  { value: 'mei', label: 'MEI — Microempreendedor Individual' },
  { value: 'eireli', label: 'EIRELI — Empresa Individual de Resp. Limitada' },
  { value: 'ltda', label: 'LTDA — Sociedade Limitada' },
  { value: 'slu', label: 'SLU — Sociedade Limitada Unipessoal' },
  { value: 'sa', label: 'S/A — Sociedade Anônima' },
]

const porteOptions = [
  { value: 'mei', label: 'MEI' },
  { value: 'me', label: 'ME — Microempresa' },
  { value: 'epp', label: 'EPP — Empresa de Pequeno Porte' },
  { value: 'medio', label: 'Médio Porte' },
  { value: 'grande', label: 'Grande Porte' },
]

const bancoOptions = [
  { value: '001', label: '001 — Banco do Brasil' },
  { value: '033', label: '033 — Santander' },
  { value: '104', label: '104 — Caixa Econômica Federal' },
  { value: '237', label: '237 — Bradesco' },
  { value: '341', label: '341 — Itaú Unibanco' },
  { value: '756', label: '756 — Sicoob' },
  { value: '077', label: '077 — Banco Inter' },
  { value: '260', label: '260 — Nu Pagamentos (Nubank)' },
]

function onCapitalInput(e: Event) {
  const input = e.target as HTMLInputElement
  capitalSocial.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = capitalSocial.value })
}

function onAgenciaInput(e: Event) {
  const input = e.target as HTMLInputElement
  agencia.value = input.value.replace(/\D/g, '').slice(0, 4)
  nextTick(() => { input.value = agencia.value })
}

function onContaInput(e: Event) {
  const input = e.target as HTMLInputElement
  const d = input.value.replace(/\D/g, '').slice(0, 10)
  conta.value = d.length > 1 ? `${d.slice(0, -1)}-${d.slice(-1)}` : d
  nextTick(() => { input.value = conta.value })
}

function validateField(field: keyof typeof errors) {
  touched[field] = true
  const validators: Record<string, () => string> = {
    naturezaJuridica: () => !naturezaJuridica.value ? 'Natureza Jurídica é obrigatória.' : '',
    cnae: () => !cnae.value.trim() ? 'CNAE é obrigatório.' : '',
    porte: () => !porte.value ? 'Porte da empresa é obrigatório.' : '',
    capitalSocial: () => parseInt(onlyDigits(capitalSocial.value), 10) <= 0 ? 'Capital Social é obrigatório.' : '',
    banco: () => !banco.value ? 'Banco é obrigatório.' : '',
    tipoConta: () => !tipoConta.value ? 'Tipo de Conta é obrigatório.' : '',
    agencia: () => agencia.value.replace(/\D/g, '').length < 4 ? 'Informe a agência com 4 dígitos.' : '',
    conta: () => conta.value.replace(/\D/g, '').length < 4 ? 'Informe o número da conta.' : '',
  }
  if (validators[field]) errors[field] = validators[field]()
}

function validateAll() {
  Object.keys(errors).forEach(f => validateField(f as keyof typeof errors))
  return !Object.values(errors).some(e => e !== '')
}

function handleContinuar() {
  if (!validateAll()) {
    nextTick(() => {
      document.querySelector('.pjde-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar')
}
</script>

<template>
  <div class="pjde-screen">
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
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item is-active">
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

        <h1 class="pjde-title">Dados da Empresa</h1>
        <p class="pjde-subtitle">Complete os dados cadastrais e bancários da transportadora.</p>

        <form class="pjde-form" @submit.prevent="handleContinuar" novalidate>

          <!-- Dados cadastrais -->
          <fieldset class="pjde-fieldset">
            <legend>Dados cadastrais</legend>

            <div class="pjde-row">
              <div class="pjde-field" :class="{ 'is-error': errors.naturezaJuridica }">
                <label for="pjde-natureza">Natureza Jurídica</label>
                <select
                  id="pjde-natureza"
                  v-model="naturezaJuridica"
                  @blur="validateField('naturezaJuridica')"
                >
                  <option value="">Selecione</option>
                  <option v-for="opt in naturezaOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <span v-if="errors.naturezaJuridica" class="pjde-error" role="alert">{{ errors.naturezaJuridica }}</span>
              </div>

              <div class="pjde-field" :class="{ 'is-error': errors.porte }">
                <label for="pjde-porte">Porte da Empresa</label>
                <select
                  id="pjde-porte"
                  v-model="porte"
                  @blur="validateField('porte')"
                >
                  <option value="">Selecione</option>
                  <option v-for="opt in porteOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <span v-if="errors.porte" class="pjde-error" role="alert">{{ errors.porte }}</span>
              </div>
            </div>

            <div class="pjde-row">
              <div class="pjde-field" :class="{ 'is-error': errors.cnae }">
                <label for="pjde-cnae">CNAE Principal</label>
                <input
                  id="pjde-cnae"
                  type="text"
                  placeholder="Ex: 4930-2/02"
                  v-model="cnae"
                  @blur="validateField('cnae')"
                />
                <span v-if="errors.cnae" class="pjde-error" role="alert">{{ errors.cnae }}</span>
              </div>

              <div class="pjde-field">
                <label for="pjde-fantasia">
                  Nome Fantasia
                  <span class="pjde-opt">(opcional)</span>
                </label>
                <input
                  id="pjde-fantasia"
                  type="text"
                  placeholder="Nome fantasia da empresa"
                  v-model="nomeFantasia"
                />
              </div>
            </div>

            <div class="pjde-field" :class="{ 'is-error': errors.capitalSocial }">
              <label for="pjde-capital">Capital Social</label>
              <input
                id="pjde-capital"
                type="text"
                inputmode="numeric"
                placeholder="R$ 0,00"
                :value="capitalSocial"
                @input="onCapitalInput"
                @blur="validateField('capitalSocial')"
              />
              <span v-if="errors.capitalSocial" class="pjde-error" role="alert">{{ errors.capitalSocial }}</span>
            </div>
          </fieldset>

          <!-- Dados bancários -->
          <fieldset class="pjde-fieldset">
            <legend>Dados bancários</legend>

            <div class="pjde-row">
              <div class="pjde-field" :class="{ 'is-error': errors.banco }">
                <label for="pjde-banco">Banco</label>
                <select
                  id="pjde-banco"
                  v-model="banco"
                  @blur="validateField('banco')"
                >
                  <option value="">Selecione o banco</option>
                  <option v-for="b in bancoOptions" :key="b.value" :value="b.value">
                    {{ b.label }}
                  </option>
                </select>
                <span v-if="errors.banco" class="pjde-error" role="alert">{{ errors.banco }}</span>
              </div>

              <div class="pjde-field" :class="{ 'is-error': errors.tipoConta }">
                <label for="pjde-tipo-conta">Tipo de Conta</label>
                <select
                  id="pjde-tipo-conta"
                  v-model="tipoConta"
                  @blur="validateField('tipoConta')"
                >
                  <option value="">Selecione</option>
                  <option value="corrente">Corrente</option>
                  <option value="poupanca">Poupança</option>
                </select>
                <span v-if="errors.tipoConta" class="pjde-error" role="alert">{{ errors.tipoConta }}</span>
              </div>
            </div>

            <div class="pjde-row">
              <div class="pjde-field" :class="{ 'is-error': errors.agencia }">
                <label for="pjde-agencia">Agência</label>
                <input
                  id="pjde-agencia"
                  type="text"
                  inputmode="numeric"
                  placeholder="0000"
                  :value="agencia"
                  @input="onAgenciaInput"
                  @blur="validateField('agencia')"
                  maxlength="4"
                />
                <span v-if="errors.agencia" class="pjde-error" role="alert">{{ errors.agencia }}</span>
              </div>

              <div class="pjde-field" :class="{ 'is-error': errors.conta }">
                <label for="pjde-conta">Número da Conta</label>
                <input
                  id="pjde-conta"
                  type="text"
                  inputmode="numeric"
                  placeholder="00000-0"
                  :value="conta"
                  @input="onContaInput"
                  @blur="validateField('conta')"
                />
                <span v-if="errors.conta" class="pjde-error" role="alert">{{ errors.conta }}</span>
              </div>
            </div>
          </fieldset>

          <button type="submit" class="pjde-submit">
            Continuar →
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.pjde-screen {
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

.proposal-header__logo { height: 44px; object-fit: contain; }

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

.proposal-header__back:hover { background: #fff5f5; }

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

/* ── Content ── */
.pjde-title {
  margin: 0 0 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-navy-800);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.pjde-subtitle {
  margin: 0 0 28px;
  font-size: 16px;
  color: var(--color-navy-500);
  line-height: 1.55;
}

.pjde-form {
  background: #ffffff;
  border: 1px solid #fde8e8;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 12px 40px rgba(10, 22, 40, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  min-width: 0;
}

.pjde-fieldset {
  border: none;
  margin: 0 0 24px;
  padding: 0;
}

.pjde-fieldset legend {
  font-size: 13px;
  font-weight: 700;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
  padding: 0;
  border-bottom: 1px solid #e3edec;
  width: 100%;
  padding-bottom: 8px;
}

.pjde-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.pjde-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.pjde-field label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
}

.pjde-field input,
.pjde-field select {
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

.pjde-field input:focus,
.pjde-field select:focus {
  outline: none;
  border-color: #8f0000;
  box-shadow: 0 0 0 3px rgba(143, 0, 0, 0.12);
}

.pjde-field.is-error input,
.pjde-field.is-error select {
  border-color: #e53e3e;
}

.pjde-error {
  font-size: 12px;
  color: #e53e3e;
  font-weight: 500;
}

.pjde-opt {
  color: #aaa;
  font-size: 11px;
  font-weight: 400;
}

.pjde-submit {
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

.pjde-submit:hover { background: #6b0000; color: #ffffff; }

@media (max-width: 600px) {
  .pjde-row { grid-template-columns: 1fr; }
}
</style>
