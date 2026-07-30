# Changelog

Todas as alterações notáveis deste pacote serão documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.2.0] - 2026-06-30

### Added
- `scripts/generate-ds-knowledge.mjs` — gera o inventário do skill `dock-ds` a partir do `index.ts` do DS (+ `ds-components-manifest.json`). Fecha o gap em que a lista era manual e desatualizada (a IA recriava componentes existentes). Rodado: 56 componentes reais.
- Gate automático: templates `.husky/pre-commit`, `lint-staged.config.mjs` e `.github/workflows/frontend-quality.yml`; `init.mjs` instala e adiciona o script `validate:contrast`.
- Config ESLint `migration` — para projetos legados adotarem incrementalmente (tokens hard-error; prefer-ds/aria/harmonia em warn).
- `scripts/check-component-states.mjs` (npm `validate:states`) — auditoria estática heurística: ação assíncrona sem loading/disabled, campo sem estado de erro. Advisory; `--strict` falha o CI.
- `base/prompts/fidelity-loop.prompt.md` — protocolo imagem→código com loop de medição (implementa, captura, compara em 6 dimensões, itera). Regra de honestidade: sem captura, não afirmar fidelidade.
- 5 cenários de eval (harmonia de cor/anti-arco-íris, feedback só-estado, 8 estados, anti-duplicação, anti-hardcode spacing/radius).

### Changed
- `validate-contrast.mjs` — resolve `var(--token)` a partir de `tokens.cssFiles` (transitivo) e valida contraste **por tema** (`--theme light|dark`). Antes só validava hex literais.
- `skills/dock-ds/SKILL.md` — lista de componentes agora é bloco AUTO-GENERATED (56 componentes reais, era ~15 e com nomes inexistentes).
- `tests/prompt-evals.mjs` — corrigido bug de portabilidade (`import.meta.dirname` só existe em Node ≥20.11) → roda em ambientes anteriores.

## [2.1.0] - 2026-06-30

### Fixed
- **CRÍTICO — regras ESLint inertes no `<template>`.** As regras que varriam o template (`no-unauthorized-colors`, `no-banned-fonts`, `prefer-ds-component`, `require-aria-label-on-interactive`) não disparavam em arquivos `.vue` porque usavam visitors de template sem `parserServices.defineTemplateBodyVisitor`. O enforcement só funcionava em `<script>`. Corrigido e coberto por teste (0 falsos-positivos em código conforme).

### Added
- `color-harmony.instructions.md` — disciplina de paleta: regra 60-30-10, acento único de marca, cores de feedback reservadas a estado (anti-arco-íris), hierarquia por peso/tamanho/espaço.
- Regra ESLint `no-decorative-feedback-colors` — detecta mistura de cores de feedback (rainbow) e uso decorativo de cor de estado. `warn` em recommended, `error` em strict.
- Regra ESLint `no-hardcoded-design-values` — bloqueia spacing/radius/shadow hardcoded (Tailwind arbitrary + inline style), fechando o gap em que só cor/fonte eram enforçadas.

### Changed
- `frontend-master/SKILL.md` Parte 8 — reescrita em tokens semânticos (era hex hardcoded, violando a própria regra de tokens) + regra de harmonia 60-30-10.
- `00-product-design-manual.instructions.md` — nomenclatura de token unificada à arquitetura de 3 camadas; referências a regras ESLint agora apontam para regras existentes.
- Plugin ESLint `dock-ds` → v2.1.0 (10 regras).

## [1.4.0] - 2026-05-19

### Added
- `figma-check.mjs` — preflight único para validar config, env, file id, acesso ao arquivo e prontidão do projeto para modo Figma
- `figma-governance.instructions.md` — governança de acesso Figma: papéis, service account, token rotation, onboarding
- `figma-bidirectional.instructions.md` — estratégia bidirecional Figma ↔ Frontend: screenshots, DTCG export, Storybook links
- `.github/workflows/figma-sync.yml` — pipeline CI para sync automático de tokens com PR
- `.github/workflows/frontend-screenshots.yml` — pipeline CI para gerar screenshots do frontend e publicar artefatos para design review
- `Teste/.env.example` — template de variáveis de ambiente com regras de segurança documentadas
- `Teste/scripts/screenshots.mjs` — geração de screenshots oficiais em 3 viewports (mobile/tablet/desktop)
- `Teste/scripts/export-tokens-for-figma.mjs` — export de tokens em formato W3C DTCG para Tokens Studio

### Changed
- `Teste/dock-ds.config.json` — expandida seção `figma` com owner, canonicalPages, approvedNodes, syncStrategy
- `Teste/package.json` — adicionados scripts `figma:check`, `figma:sync`, `figma:audit`, `figma:export-tokens`, `screenshots`, `screenshots:ci`

## [1.3.0] - 2026-05-19

### Added
- `security.instructions.md` — env vars (VITE_ safety), XSS prevention, CSP, anti-bot progressivo, server-side validation
- `ui-states.instructions.md` — loading (skeleton/spinner), error states, empty states, toasts, offline detection
- `state-api-patterns.instructions.md` — Pinia stores, composables, HTTP services, error mapping, retry with backoff
- `testing.instructions.md` — pirâmide de testes, Vitest, Vue Test Utils, Playwright E2E, coverage thresholds
- `responsiveness.instructions.md` — breakpoints (375→1536), mobile-first, fluid typography, touch targets, image optimization
- `performance.instructions.md` — bundle budgets, lazy loading, tree-shaking, Core Web Vitals targets, font optimization
- `ci-cd.instructions.md` — pipeline parallelizado, PR checks, deploy preview, rollback strategy, compliance gate
- `i18n.instructions.md` — centralização de strings, Intl formatters, preparação progressiva para multi-idioma
- `motion.instructions.md` — tokens de duração/easing, transições Vue aprovadas, prefers-reduced-motion obrigatório
- `governance.instructions.md` — semver para instructions, CODEOWNERS, exceções formais ao DS, métricas, deprecation process

### Changed
- `dock-ds.config.json` — expandido `preferImport` de 6 para 38 componentes, adicionado `componentMap`, `exceptions`, `responsiveness` e `performance` configs
- `.github/copilot-instructions.md` — adicionada tabela de referências cruzadas para todas as instruções complementares

## [1.2.0] - 2026-05-18

### Added
- Entry point oficial do ESLint plugin via `@dock-tech/shared-copilot-front-lib/eslint-plugin`
- Script `figma-fidelity-audit.mjs` para auditoria automática do modo Figma
- Suite `tests/prompt-evals.mjs` com cenários versionados em `evals/scenarios.json`
- Scripts públicos `validate:figma`, `compliance` e `test:evals`

### Changed
- `README.md` — estratégia final de consumo do plugin e uso das evals
- `scripts/init.mjs` — adiciona `validate:figma` e `compliance` no projeto consumidor
- `base/copilot-instructions.md` — checklist explícito de fidelidade visual para modo Figma
- `tests/instruction-tests.mjs` — cobertura para hardening do modo Figma e suite de evals

## [1.1.0] - 2026-05-18

### Added
- ESLint plugin `@dock/eslint-plugin-dock-ds` com 3 regras (no-unauthorized-colors, no-banned-fonts, prefer-ds-component)
- Script `figma-sync.mjs` — sincroniza tokens via Figma API
- Script `compliance-report.mjs` — gera score de conformidade (0-100) e `.dock-compliance.json`
- Template `console-app` — config e instructions para admin panels
- Template `landing-page` — config e instructions para landing pages
- Suite de testes (`tests/instruction-tests.mjs`) — 74 validações de integridade
- `CONTRIBUTING.md` — processo de contribuição e feedback
- Seção Slider com regras universais no `base/copilot-instructions.md`
- Suporte `--template landing-page|console-app` no `init.mjs`

### Changed
- `package.json` — adicionado scripts `test:instructions` e `figma:sync`, incluído `eslint-plugin-dock-ds/` e `tests/` nos files
- `base/instructions/accessibility.instructions.md` — adicionada regra de navegação por teclado
- `base/instructions/form-patterns.instructions.md` — adicionada regra de reatividade (v-model)
- `README.md` — seções ESLint plugin, Figma Sync e Compliance Report

## [1.0.0] - 2026-05-18

### Added
- Gate DS com detecção inteligente (Storybook default, Figma override)
- Instructions base: accessibility, form-patterns, interactivity, code-quality
- Prompts: nova-tela, novo-componente, review-visual, fix-a11y, add-form-field, connect-screen
- Agents: design-reviewer, a11y-auditor, ds-gatekeeper
- Skill: dock-ds-knowledge
- Script validate-design.mjs (genérico, lê dock-ds.config.json)
- Script validate-pipeline.mjs (orquestração)
- Script init.mjs (bootstrap para novos projetos)
- Template project-init
