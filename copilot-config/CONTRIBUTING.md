# Contribuindo com @dock-tech/shared-copilot-front-lib

## Como funciona

Este pacote contém as **Copilot Instructions, Prompts, Agents e validação** padronizadas da Dock.
Toda alteração impacta 500+ desenvolvedores — siga o processo abaixo.

---

## Tipos de Contribuição

| Tipo | Exemplo | Impacto |
|------|---------|---------|
| **Patch** | Corrigir typo, ajustar wording de instrução | Baixo |
| **Minor** | Adicionar novo prompt, nova regra de validação | Médio |
| **Major** | Mudar lógica do Gate DS, remover token, nova regra obrigatória | Alto |

---

## Processo

### 1. Crie branch

```bash
git checkout -b feature/instructions-<nome-curto>
```

### 2. Faça a alteração

- Instructions base: `base/copilot-instructions.md`, `base/instructions/`
- Prompts: `base/prompts/`
- Agents: `base/agents/`
- ESLint rules: `eslint-plugin-dock-ds/rules/`
- Templates: `templates/`
- Scripts: `scripts/`

### 3. Rode os testes

```bash
node tests/instruction-tests.mjs
```

Todos os 74+ testes devem passar antes de abrir PR.

### 4. Atualize o CHANGELOG

Adicione uma entrada no topo de `CHANGELOG.md`:

```markdown
## [X.Y.Z] — YYYY-MM-DD
### Added / Changed / Removed
- Descrição da mudança
```

### 5. Abra PR

- **Label obrigatória:** `instructions-change`
- **Reviewers obrigatórios:** 2 membros de `@dock-tech/ds-team` (via CODEOWNERS)
- **Descrição:** explique O QUE mudou, POR QUÊ e IMPACTO esperado

### 6. Após merge

- CI (Jenkins/Everlast) publica automaticamente no Nexus
- Projetos consumidores recebem atualização via `npm update`
- Para **major**: comunicar no canal `#dock-copilot-instructions`

---

## Regras de Qualidade

- [ ] Todos os testes passam (`node tests/instruction-tests.mjs`)
- [ ] CHANGELOG atualizado
- [ ] Sem regras duplicadas (buscar no base/ antes de adicionar)
- [ ] Regras claras e objetivas (sem ambiguidade)
- [ ] Exemplos ❌/✅ para regras críticas (few-shot)
- [ ] Compatível com ESLint plugin (se for regra visual)
- [ ] Não quebra projetos existentes (sem breaking change silencioso)

---

## Como reportar problemas

Se o Copilot ignorou uma regra ou produziu output incorreto:

1. Canal: `#dock-copilot-instructions`
2. Formato do report:
   ```
   **O que pedi:** "Crie um botão de submit"
   **O que o Copilot fez:** Criou <button> nativo sem usar DsButton
   **O que deveria ter feito:** Importar DsButton do DS
   **Arquivo/regra relevante:** base/copilot-instructions.md → Gate DS
   ```
3. Se possível, sugira a correção

---

## Arquitetura de Decisão

Quando uma nova regra é proposta, avalie:

1. **É universal?** → vai em `base/` (afeta todos os projetos)
2. **É tipo-específica?** → vai em `templates/<tipo>/instructions/`
3. **É projeto-específica?** → fica no repo do projeto, NÃO no pacote

Se tiver dúvida, abra uma issue para discussão antes de implementar.
