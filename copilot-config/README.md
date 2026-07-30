# @dock-tech/shared-copilot-front-lib

Configuração compartilhada de **Copilot Instructions, Prompts, Agents e validação** do Design System Dock.

Projetado para ser consumido por qualquer projeto Vue 3 da Dock, garantindo consistência visual, acessibilidade e qualidade de código em escala (500+ devs, múltiplos projetos).

---

## Pré-requisitos (Nexus privado)

Antes de instalar, garanta:

1. VPN conectada
2. `.npmrc` na raiz do projeto com:

```ini
registry=https://nexus.tools.dock.tech/repository/npm-all/
//nexus.tools.dock.tech/repository/npm-internal/:_authToken=${NODE_AUTH_TOKEN}
```

---

## Quick Start

```bash
# 1. Instalar o pacote
npm install @dock-tech/shared-copilot-front-lib --save-dev

# 2. Rodar o bootstrap
npx @dock-tech/shared-copilot-front-lib init

# 3. Personalizar tokens
# Edite dock-ds.config.json com as cores/fontes do seu projeto
```

---

## O que é instalado

Após `init`, seu projeto terá:

```
.github/
├── copilot-instructions.md           ← Gate DS + regras universais
├── instructions/
│   ├── accessibility.instructions.md ← WCAG 2.2 AA
│   ├── form-patterns.instructions.md ← Máscaras e validações
│   ├── interactivity.instructions.md ← Componentes devem funcionar
│   └── code-quality.instructions.md  ← Vue 3 + TS + Tailwind patterns
├── prompts/
│   ├── nova-tela.prompt.md           ← /nova-tela
│   ├── novo-componente.prompt.md     ← /novo-componente
│   ├── review-visual.prompt.md       ← /review-visual
│   ├── fix-a11y.prompt.md            ← /fix-a11y
│   ├── add-form-field.prompt.md      ← /add-form-field
│   └── connect-screen.prompt.md      ← /connect-screen
├── agents/
│   ├── design-reviewer.agent.md      ← Revisão visual pixel-perfect
│   ├── a11y-auditor.agent.md         ← Audit WCAG 2.2 AA
│   └── ds-gatekeeper.agent.md        ← Guardião do DS
└── pull_request_template.md          ← Checklist visual para PRs

dock-ds.config.json                   ← Tokens permitidos do projeto
```

---

## Lógica do Gate DS

O Copilot determina **automaticamente** qual Design System seguir:

| Situação | Ação |
|----------|------|
| Usuário mencionou "Figma/print/screenshot" | → Modo Figma (usa DESIGN_SYSTEM.md) |
| Projeto tem `shared-design-system-vue-lib` sem menção a Figma | → Modo Storybook automático |
| Ambíguo | → Pergunta UMA vez |
| Conflito entre Storybook e Figma | → Pergunta qual prevalece |
| DS não instalado | → Alerta e pergunta |

**Storybook é o DEFAULT.** Figma é override quando explicitamente informado.

---

## Prompts Disponíveis

Use via `/` no Copilot Chat:

| Prompt | Uso |
|--------|-----|
| `/nova-tela` | Criar tela do zero com scaffold completo |
| `/novo-componente` | Adicionar componente (verifica DS primeiro) |
| `/review-visual` | Comparar implementação vs referência visual |
| `/fix-a11y` | Auditar e corrigir acessibilidade |
| `/add-form-field` | Campo com máscara + validação + teste |
| `/connect-screen` | Conectar tela ao fluxo de navegação |

---

## Agents Disponíveis

Invocados automaticamente pelos prompts ou manualmente:

| Agent | Especialidade |
|-------|--------------|
| **Design Reviewer** | Revisão pixel-perfect, relatório de deltas |
| **A11y Auditor** | WCAG 2.2 AA, axe-core + verificação manual |
| **DS Gatekeeper** | Conformidade com tokens e componentes do DS |

---

## Validação

```bash
npm run validate:design    # Verifica cores, fontes, tokens
npm run validate           # Pipeline completo (lint + design + tests + a11y + build)
npm run compliance         # Gera relatório de compliance (.dock-compliance.json)
```

---

## ESLint Plugin

Valida tokens em tempo real no editor:

```js
// eslint.config.js
import dockDs from '@dock-tech/shared-copilot-front-lib/eslint-plugin'

export default [
  dockDs.configs.recommended,
  // ... suas outras configs
]
```

Consumo oficial: o plugin é distribuído junto do pacote principal via subpath export. Não há necessidade de instalar um segundo pacote.

Regras incluídas:
| Regra | Severidade | O que faz |
|-------|-----------|-----------|
| `dock-ds/no-unauthorized-colors` | error | Bloqueia hex fora do allowlist |
| `dock-ds/no-banned-fonts` | error | Bloqueia fontes proibidas |
| `dock-ds/prefer-ds-component` | warning | Sugere componente do DS |

---

## Figma Sync

Importante: há duas situações diferentes.

1. **Referência visual externa** — print, screenshot, imagem de internet, frame exportado.
  Nessa situação, você pode trabalhar direto com a referência visual. Não precisa `figma:check` nem `figma:sync`.

2. **Arquivo Figma real do projeto** — tokens via API, file id, node id, frame canônico, sync oficial.
  Nessa situação, o preflight é obrigatório antes do sync.

Antes de qualquer sync real com o arquivo Figma, rode o preflight:

```bash
npm run figma:check
```

Esse comando responde, de uma vez:
- token presente ou não
- file id presente ou não
- acesso ao arquivo ok ou não
- projeto pronto para modo Figma ou não

Se o projeto não tiver `dock-ds.config.json` ou a seção `figma`, o comando falha com instruções de setup.

Sincroniza tokens diretamente da API do Figma:

```bash
FIGMA_TOKEN=figd_xxx FIGMA_FILE_ID=abc123 npm run figma:sync
```

Atualiza automaticamente: `dock-ds.config.json`, `figma-node-data.json`, timestamp do `DESIGN_SYSTEM.md`.

Auditoria adicional de fidelidade:

```bash
npm run validate:figma
```

Essa auditoria verifica artefatos obrigatórios do modo Figma, regras críticas nas instructions e anti-patterns comuns de baixa fidelidade.

---

## Compliance Report

Gera score de conformidade (0-100) com breakdown por categoria:

```bash
npm run compliance
```

Output: `.dock-compliance.json` (integrável com Grafana/Datadog/CI artifacts).

---

## Prompt Evals

O pacote inclui uma suíte de cenários versionados em `evals/scenarios.json` para validar respostas reais do Copilot.

```bash
npm run test:evals
node tests/prompt-evals.mjs --output-dir=./eval-outputs
```

Use `eval-outputs/<scenario-id>.txt` para armazenar saídas reais e validar regressões de comportamento.

---

## Customização por Projeto

Edite `dock-ds.config.json` para configurar:
- Cores permitidas (allowlist)
- Fontes permitidas/proibidas
- Componentes preferenciais do DS
- Configurações de slider, layout mobile, etc.
- Referência Figma (fileId, DESIGN_SYSTEM.md)

---

## Templates

```bash
npx @dock-tech/shared-copilot-front-lib init --template landing-page   # Landing pages
npx @dock-tech/shared-copilot-front-lib init --template console-app    # Admin panels
```

---

## Contribuir

1. Fork + branch a partir de `main`
2. Edite arquivos em `base/`
3. Atualize `CHANGELOG.md`
4. PR com label `instructions-change`
5. Review obrigatório de 2 membros do `@dock/ds-team`
