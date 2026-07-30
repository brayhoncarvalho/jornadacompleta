<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { maskCPF } from '../../utils/masks'
import { validateCPF, validateEmail } from '../../utils/validators'
import { REPRESENTANTE_PADRAO } from '../../config/mockData'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const nome = ref(REPRESENTANTE_PADRAO.nomeCompleto)
const cpf = ref(REPRESENTANTE_PADRAO.cpf)
const cargo = ref(REPRESENTANTE_PADRAO.cargo)
const dataNascimento = ref(REPRESENTANTE_PADRAO.dataNascimento)
const email = ref(REPRESENTANTE_PADRAO.email)

const errors = reactive({
  nome: '',
  cpf: '',
  cargo: '',
  dataNascimento: '',
  email: '',
})

const touched = reactive({
  nome: false,
  cpf: false,
  cargo: false,
  dataNascimento: false,
  email: false,
})

function onCpfInput(e: Event) {
  const input = e.target as HTMLInputElement
  cpf.value = maskCPF(input.value)
  nextTick(() => { input.value = cpf.value })
}

function validateField(field: keyof typeof errors) {
  touched[field] = true
  const validators: Record<string, () => string> = {
    nome: () => nome.value.trim().length < 3 ? 'Nome completo é obrigatório (mín. 3 caracteres).' : '',
    cpf: () => validateCPF(cpf.value),
    cargo: () => !cargo.value.trim() ? 'Cargo ou função é obrigatório.' : '',
    dataNascimento: () => !dataNascimento.value ? 'Data de Nascimento é obrigatória.' : '',
    email: () => validateEmail(email.value),
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
      document.querySelector('.pjrp-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar')
}
</script>

<template>
  <div class="pjrp-screen">
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

        <h1 class="pjrp-title">Representante Legal</h1>
        <p class="pjrp-subtitle">Dados da pessoa com poderes de assinatura para formalizar a operação de crédito.</p>

        <form class="pjrp-form" @submit.prevent="handleContinuar" novalidate>

          <div class="pjrp-row">
            <div class="pjrp-field" :class="{ 'is-error': errors.nome }">
              <label for="pjrp-nome">Nome Completo</label>
              <input
                id="pjrp-nome"
                type="text"
                placeholder="Nome do representante legal"
                v-model="nome"
                @blur="validateField('nome')"
                autocomplete="name"
              />
              <span v-if="errors.nome" class="pjrp-error" role="alert">{{ errors.nome }}</span>
            </div>

            <div class="pjrp-field" :class="{ 'is-error': errors.cpf }">
              <label for="pjrp-cpf">CPF</label>
              <input
                id="pjrp-cpf"
                type="text"
                inputmode="numeric"
                placeholder="000.000.000-00"
                :value="cpf"
                @input="onCpfInput"
                @blur="validateField('cpf')"
                autocomplete="off"
              />
              <span v-if="errors.cpf" class="pjrp-error" role="alert">{{ errors.cpf }}</span>
            </div>
          </div>

          <div class="pjrp-row">
            <div class="pjrp-field" :class="{ 'is-error': errors.cargo }">
              <label for="pjrp-cargo">Cargo / Função</label>
              <input
                id="pjrp-cargo"
                type="text"
                placeholder="Ex: Diretor Financeiro, Sócio-administrador"
                v-model="cargo"
                @blur="validateField('cargo')"
              />
              <span v-if="errors.cargo" class="pjrp-error" role="alert">{{ errors.cargo }}</span>
            </div>

            <div class="pjrp-field" :class="{ 'is-error': errors.dataNascimento }">
              <label for="pjrp-nasc">Data de Nascimento</label>
              <input
                id="pjrp-nasc"
                type="date"
                v-model="dataNascimento"
                @blur="validateField('dataNascimento')"
              />
              <span v-if="errors.dataNascimento" class="pjrp-error" role="alert">{{ errors.dataNascimento }}</span>
            </div>
          </div>

          <div class="pjrp-field" :class="{ 'is-error': errors.email }">
            <label for="pjrp-email">E-mail corporativo</label>
            <input
              id="pjrp-email"
              type="email"
              placeholder="representante@empresa.com.br"
              v-model="email"
              @blur="validateField('email')"
              autocomplete="email"
            />
            <span v-if="errors.email" class="pjrp-error" role="alert">{{ errors.email }}</span>
          </div>
        <!--
          <div class="pjrp-info" role="note">
            <svg class="pjrp-info__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#8f0000" stroke-width="1.5"/>
              <path d="M10 9v5M10 6.5h.01" stroke="#8f0000" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>
              O representante legal deverá assinar digitalmente a <strong>CCB (Cédula de Crédito Bancário)</strong>
              e os demais documentos de formalização emitidos pela Dock.
            </p>
          </div>-->

          <button type="submit" class="pjrp-submit">
            Continuar →
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.pjrp-screen {
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
.pjrp-title {
  margin: 0 0 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-navy-800);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.pjrp-subtitle {
  margin: 0 0 24px;
  font-size: 16px;
  color: var(--color-navy-500);
  line-height: 1.55;
}

.pjrp-form {
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

.pjrp-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pjrp-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.pjrp-field label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
}

.pjrp-field input {
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

.pjrp-field input:focus {
  outline: none;
  border-color: #8f0000;
  box-shadow: 0 0 0 3px rgba(143, 0, 0, 0.12);
}

.pjrp-field.is-error input {
  border-color: #e53e3e;
}

.pjrp-error {
  font-size: 12px;
  color: #e53e3e;
  font-weight: 500;
}

/* ── Info box ── */
.pjrp-info {
  display: flex;
  gap: 10px;
  background: #fff5f5;
  border: 1px solid #fcc5c5;
  border-radius: 8px;
  padding: 14px 16px;
}

.pjrp-info__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
}

.pjrp-info p {
  margin: 0;
  font-size: 13px;
  color: #6b0000;
  line-height: 1.55;
}

/* ── CTA ── */
.pjrp-submit {
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

.pjrp-submit:hover { background: #6b0000; color: #ffffff; }

@media (max-width: 600px) {
  .pjrp-row { grid-template-columns: 1fr; }
}
</style>
