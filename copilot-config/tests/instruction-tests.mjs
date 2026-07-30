/**
 * instruction-tests.mjs
 *
 * Suite de testes automatizados para validar que as Copilot Instructions
 * produzem outputs corretos. Simula cenários comuns e verifica se as regras
 * são respeitadas no output.
 *
 * Não depende da API do Copilot — valida os ARQUIVOS de instruction por:
 * 1. Presença de regras obrigatórias (keywords/patterns)
 * 2. Estrutura YAML frontmatter válida
 * 3. Coerência entre config (dock-ds.config.json) e instructions
 * 4. Checklist de completude
 *
 * Uso:
 *   node copilot-config/tests/instruction-tests.mjs
 *   npm run test:instructions (se adicionado no package.json)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'base');

let passed = 0;
let failed = 0;
const failures = [];

// === Test Helpers ===

function assert(condition, testName, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    const msg = detail ? `${testName} — ${detail}` : testName;
    failures.push(msg);
    console.log(`  ✗ ${testName}${detail ? ` (${detail})` : ''}`);
  }
}

function fileExists(path) {
  return existsSync(path);
}

function readFile(path) {
  return readFileSync(path, 'utf-8');
}

function hasContent(content, keyword) {
  return content.toLowerCase().includes(keyword.toLowerCase());
}

// === Test Suites ===

function testBaseInstructionsExist() {
  console.log('\n📂 Base Instructions — Estrutura');

  assert(fileExists(join(BASE, 'copilot-instructions.md')), 'copilot-instructions.md existe');
  assert(fileExists(join(BASE, 'instructions')), 'instructions/ folder existe');
  assert(fileExists(join(BASE, 'prompts')), 'prompts/ folder existe');
  assert(fileExists(join(BASE, 'agents')), 'agents/ folder existe');
  assert(fileExists(join(BASE, 'skills', 'dock-ds', 'SKILL.md')), 'skills/dock-ds/SKILL.md existe');
}

function testGateDSLogic() {
  console.log('\n🚦 Gate DS — Lógica de Detecção');

  const content = readFile(join(BASE, 'copilot-instructions.md'));

  assert(hasContent(content, 'figma'), 'Menciona modo Figma');
  assert(hasContent(content, 'storybook'), 'Menciona modo Storybook');
  assert(
    hasContent(content, 'shared-design-system-vue-lib') || hasContent(content, 'shared-design-system-vue-lib'),
    'Referencia pacote DS'
  );
  assert(hasContent(content, 'perguntar'), 'Tem lógica de perguntar quando ambíguo');
  assert(
    hasContent(content, 'screenshot') || hasContent(content, 'print'),
    'Detecta referência visual (screenshot/print)'
  );
  assert(hasContent(content, 'default') || hasContent(content, 'padrão'), 'Define default claro');
}

function testAccessibilityInstructions() {
  console.log('\n♿ Acessibilidade — WCAG 2.2 AA (critérios individuais)');

  const path = join(BASE, 'instructions', 'accessibility.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'accessibility.instructions.md existe');
    return;
  }

  const content = readFile(path);

  // --- WCAG 2.2 AA — referência geral ---
  assert(hasContent(content, 'WCAG'), 'WCAG mencionado');
  assert(hasContent(content, '2.2'), 'Versão WCAG 2.2 especificada');
  assert(hasContent(content, 'AA'), 'Nível AA especificado');

  // --- Percepção (Princípio 1) ---
  assert(hasContent(content, '4.5:1') || hasContent(content, '4.5'), 'Contraste texto normal ≥ 4.5:1 (1.4.3)');
  assert(hasContent(content, '3:1'), 'Contraste texto grande / UI ≥ 3:1 (1.4.11)');
  assert(
    hasContent(content, 'cor') || hasContent(content, 'color'),
    'Não depender apenas de cor para indicar estado (1.4.1)'
  );
  assert(
    hasContent(content, 'alt') || hasContent(content, 'non-text') || hasContent(content, 'imagem'),
    'Conteúdo não-textual com alternativa (1.1.1)'
  );
  assert(
    hasContent(content, 'redimension') || hasContent(content, 'resize') || hasContent(content, '200%'),
    'Texto redimensionável até 200% (1.4.4)'
  );

  // --- Operabilidade (Princípio 2) ---
  assert(hasContent(content, 'teclado') || hasContent(content, 'keyboard'), 'Navegação por teclado (2.1.1)');
  assert(
    hasContent(content, 'tab') || hasContent(content, 'Tab'),
    'Ordem de Tab lógica (2.4.3)'
  );
  assert(
    hasContent(content, 'foco visível') || hasContent(content, 'focus') || hasContent(content, 'outline'),
    'Foco visível (2.4.7 / 2.4.11)'
  );
  assert(
    hasContent(content, 'skip') || hasContent(content, 'skip link') || hasContent(content, 'Skip'),
    'Skip links para navegação complexa (2.4.1)'
  );
  assert(
    hasContent(content, '44') || hasContent(content, '24x24') || hasContent(content, 'alvo') || hasContent(content, 'touch'),
    'Tamanho mínimo de alvo interativo 44×44px ou 24×24px (2.5.8)'
  );
  assert(
    hasContent(content, 'escape') || hasContent(content, 'Escape') || hasContent(content, 'fechar'),
    'Escape fecha modais/dropdowns (2.1.1 keyboard)'
  );

  // --- Compreensão (Princípio 3) ---
  assert(
    hasContent(content, 'label') || hasContent(content, 'rótulo'),
    'Labels associados a inputs (3.3.2 / 4.1.2)'
  );
  assert(
    hasContent(content, 'erro') || hasContent(content, 'error'),
    'Mensagens de erro identificadas (3.3.1)'
  );
  assert(
    hasContent(content, 'aria-describedby') || hasContent(content, 'aria-live'),
    'Erros e status dinâmicos anunciados (3.3.1 / 4.1.3)'
  );
  assert(
    hasContent(content, 'heading') || hasContent(content, 'h1') || hasContent(content, 'hierarquia'),
    'Hierarquia de headings lógica (1.3.1)'
  );

  // --- Robusto (Princípio 4) ---
  assert(
    hasContent(content, 'aria-label') || hasContent(content, 'aria-labelledby'),
    'Nome acessível em elementos (4.1.2)'
  );
  assert(
    hasContent(content, 'semântic') || hasContent(content, 'semantic') || hasContent(content, '<nav>') || hasContent(content, 'landmark'),
    'Elementos semânticos e landmarks (4.1.1 / 1.3.6)'
  );
  assert(
    hasContent(content, 'aria-live') || hasContent(content, 'status message'),
    'Status messages via aria-live (4.1.3)'
  );
}

function testNielsenHeuristics() {
  console.log('\n🧠 Heurísticas de Nielsen — Todas as 10');

  const paths = [
    join(BASE, 'instructions', 'accessibility.instructions.md'),
    join(BASE, 'instructions', 'accessibility-ux-baseline.instructions.md'),
  ];

  // Concatena ambos os arquivos para validar cobertura total entre eles
  const combined = paths
    .filter((p) => fileExists(p))
    .map((p) => readFile(p))
    .join('\n');

  assert(combined.length > 0, 'Pelo menos um arquivo de a11y/UX existe');

  // H1 — Visibilidade do estado do sistema
  assert(
    hasContent(combined, 'visibilidade') || hasContent(combined, 'loading') || hasContent(combined, 'estado'),
    'H1 — Visibilidade do estado do sistema (loading, selected, error)'
  );

  // H2 — Correspondência com o mundo real
  assert(
    hasContent(combined, 'linguagem') || hasContent(combined, 'linguagem do usuário') || hasContent(combined, 'natural'),
    'H2 — Linguagem do usuário (rótulos naturais)'
  );

  // H3 — Controle e liberdade
  assert(
    hasContent(combined, 'voltar') || hasContent(combined, 'cancelar') || hasContent(combined, 'desfazer'),
    'H3 — Controle e liberdade (voltar, cancelar, desfazer)'
  );

  // H4 — Consistência
  assert(
    hasContent(combined, 'consistência') || hasContent(combined, 'consistente') || hasContent(combined, 'Consistência'),
    'H4 — Consistência (mesmo componente = mesmo comportamento)'
  );

  // H5 — Prevenção de erros
  assert(
    hasContent(combined, 'prevenção') || hasContent(combined, 'prevenir') || hasContent(combined, 'prevenção de erro'),
    'H5 — Prevenção de erros (validação antecipada)'
  );

  // H6 — Reconhecimento em vez de memorização
  assert(
    hasContent(combined, 'reconhecimento') || hasContent(combined, 'visíveis') || hasContent(combined, 'visível'),
    'H6 — Reconhecimento (ações visíveis, não ocultas)'
  );

  // H7 — Flexibilidade e eficiência
  assert(
    hasContent(combined, 'flexibilidade') || hasContent(combined, 'atalho') || hasContent(combined, 'experiente'),
    'H7 — Flexibilidade (atalhos para usuários experientes)'
  );

  // H8 — Estética e design minimalista
  assert(
    hasContent(combined, 'minimalista') || hasContent(combined, 'ruído') || hasContent(combined, 'estética'),
    'H8 — Estética minimalista (sem ruído visual)'
  );

  // H9 — Recuperação de erros
  assert(
    hasContent(combined, 'recuperação') || hasContent(combined, 'como corrigir') || hasContent(combined, 'mensagem clara'),
    'H9 — Recuperação de erros (mensagem + solução)'
  );

  // H10 — Ajuda e documentação
  assert(
    hasContent(combined, 'ajuda') || hasContent(combined, 'instruções') || hasContent(combined, 'inline'),
    'H10 — Ajuda contextual inline'
  );
}

function testUiStatesA11y() {
  console.log('\n🔄 Estados de UI — Cobertura de Acessibilidade');

  const path = join(BASE, 'instructions', 'ui-states.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'ui-states.instructions.md existe');
    return;
  }

  const content = readFile(path);

  assert(hasContent(content, 'aria-live'), 'Loading/status anunciado via aria-live');
  assert(hasContent(content, 'aria-busy'), 'Estado de carregamento com aria-busy');
  assert(hasContent(content, 'role="status"') || hasContent(content, "role='status'"), 'Skeleton/spinner com role="status"');
  assert(hasContent(content, 'aria-label'), 'Elementos de estado com aria-label');
  assert(
    hasContent(content, 'cor') || hasContent(content, 'ícone') || hasContent(content, 'texto'),
    'Erro não depende somente de cor'
  );
}

function testA11yBaselineFile() {
  console.log('\n🛡️  Baseline A11y/UX — Arquivo Dedicado');

  const path = join(BASE, 'instructions', 'accessibility-ux-baseline.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'accessibility-ux-baseline.instructions.md existe');
    return;
  }

  const content = readFile(path);

  assert(hasContent(content, 'WCAG'), 'Referencia WCAG');
  assert(hasContent(content, 'AA'), 'Especifica nível AA');
  assert(hasContent(content, 'Nielsen'), 'Referencia Nielsen');
  assert(hasContent(content, 'applyTo'), 'Tem frontmatter com applyTo');
  assert(
    hasContent(content, 'src/components') || hasContent(content, 'src/**'),
    'Aplica a componentes Vue (.vue)'
  );
  assert(
    hasContent(content, 'checklist') || hasContent(content, 'Checklist'),
    'Contém checklist de acessibilidade'
  );
  assert(
    hasContent(content, 'teclado') || hasContent(content, 'keyboard'),
    'Cobre navegação por teclado'
  );
  assert(
    hasContent(content, 'foco') || hasContent(content, 'focus'),
    'Cobre visibilidade de foco'
  );
  assert(
    hasContent(content, 'aria') || hasContent(content, 'semântic'),
    'Cobre HTML semântico e ARIA'
  );
  assert(
    hasContent(content, 'contraste') || hasContent(content, 'contrast'),
    'Cobre contraste visual'
  );
}

function testFormPatternsInstructions() {
  console.log('\n📝 Formulários — Regras');

  const path = join(BASE, 'instructions', 'form-patterns.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'form-patterns.instructions.md existe');
    return;
  }

  const content = readFile(path);

  assert(hasContent(content, 'máscara') || hasContent(content, 'mask'), 'Menciona máscaras');
  assert(hasContent(content, 'CPF'), 'Menciona CPF');
  assert(hasContent(content, 'validaç') || hasContent(content, 'validat'), 'Menciona validação');
  assert(hasContent(content, '#dc3545') || hasContent(content, 'vermelho') || hasContent(content, 'red'), 'Define cor de erro');
  assert(hasContent(content, 'blur') || hasContent(content, 'submit'), 'Define quando mostrar erro');
  assert(hasContent(content, 'v-model') || hasContent(content, 'reativ'), 'Menciona reatividade');
}

function testInteractivityInstructions() {
  console.log('\n⚡ Interatividade — Regras');

  const path = join(BASE, 'instructions', 'interactivity.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'interactivity.instructions.md existe');
    return;
  }

  const content = readFile(path);

  assert(hasContent(content, 'funcionar') || hasContent(content, 'functional'), 'Exige funcionalidade real');
  assert(hasContent(content, 'slider') || hasContent(content, 'range'), 'Menciona slider/range');
  assert(hasContent(content, 'estado') || hasContent(content, 'state'), 'Menciona estado reativo');
}

function testPromptsStructure() {
  console.log('\n💬 Prompts — Estrutura e Frontmatter');

  const promptsDir = join(BASE, 'prompts');
  if (!fileExists(promptsDir)) {
    assert(false, 'prompts/ folder existe');
    return;
  }

  const expectedPrompts = [
    'nova-tela.prompt.md',
    'novo-componente.prompt.md',
    'review-visual.prompt.md',
    'fix-a11y.prompt.md',
    'add-form-field.prompt.md',
    'connect-screen.prompt.md',
  ];

  for (const name of expectedPrompts) {
    const path = join(promptsDir, name);
    const exists = fileExists(path);
    assert(exists, `${name} existe`);

    if (exists) {
      const content = readFile(path);
      assert(content.startsWith('---'), `${name} tem frontmatter YAML`);
      assert(hasContent(content, 'description'), `${name} tem description`);
    }
  }
}

function testAgentsStructure() {
  console.log('\n🤖 Agents — Estrutura e Frontmatter');

  const agentsDir = join(BASE, 'agents');
  if (!fileExists(agentsDir)) {
    assert(false, 'agents/ folder existe');
    return;
  }

  const expectedAgents = [
    'design-reviewer.agent.md',
    'a11y-auditor.agent.md',
    'ds-gatekeeper.agent.md',
  ];

  for (const name of expectedAgents) {
    const path = join(agentsDir, name);
    const exists = fileExists(path);
    assert(exists, `${name} existe`);

    if (exists) {
      const content = readFile(path);
      assert(content.startsWith('---'), `${name} tem frontmatter YAML`);
      assert(hasContent(content, 'description'), `${name} tem description`);
    }
  }
}

function testCodeQualityInstructions() {
  console.log('\n🔧 Code Quality — Regras');

  const path = join(BASE, 'instructions', 'code-quality.instructions.md');
  if (!fileExists(path)) {
    assert(false, 'code-quality.instructions.md existe');
    return;
  }

  const content = readFile(path);

  assert(hasContent(content, 'Composition API') || hasContent(content, 'script setup'), 'Exige Composition API');
  assert(hasContent(content, 'TypeScript') || hasContent(content, 'lang="ts"'), 'Exige TypeScript');
  assert(hasContent(content, 'Tailwind') || hasContent(content, 'tailwind'), 'Menciona Tailwind');
}

function testSliderRules() {
  console.log('\n🎚️  Slider — Regras Críticas');

  const content = readFile(join(BASE, 'copilot-instructions.md'));

  // These rules have historically been violated — critical to validate
  assert(hasContent(content, 'ESQUERDA') || hasContent(content, 'left'), 'Botão - à esquerda');
  assert(hasContent(content, 'DIREITA') || hasContent(content, 'right'), 'Botão + à direita');
  assert(hasContent(content, '#ffffff') || hasContent(content, 'branco'), 'Thumb branco');
  assert(hasContent(content, '24') || hasContent(content, '24x24'), 'Thumb 24px');
  assert(hasContent(content, 'quadrado') || hasContent(content, 'border-radius: 0'), 'Thumb quadrado');
  assert(hasContent(content, 'appearance: none'), 'Remove appearance padrão');
}

function testConfigCoherence() {
  console.log('\n🔗 Coerência — Config ↔ Instructions');

  const templateConfig = join(ROOT, 'templates', 'project-init', 'dock-ds.config.json');
  if (!fileExists(templateConfig)) {
    assert(false, 'templates/project-init/dock-ds.config.json existe');
    return;
  }

  const config = JSON.parse(readFile(templateConfig));
  const mainInstructions = readFile(join(BASE, 'copilot-instructions.md'));

  // Colors in config should be mentioned or used somewhere
  assert(config.tokens?.colors?.length > 0, 'Config tem cores definidas');
  assert(config.tokens?.fonts?.allowed?.length > 0, 'Config tem fontes permitidas');
  assert(config.tokens?.fonts?.banned?.length > 0, 'Config tem fontes proibidas');

  // DS package reference matches
  if (config.components?.package) {
    assert(
      hasContent(mainInstructions, config.components.package),
      `Instructions referencia o pacote DS (${config.components.package})`
    );
  }
}

function testEslintPlugin() {
  console.log('\n🔌 ESLint Plugin — Estrutura');

  const pluginDir = join(ROOT, 'eslint-plugin-dock-ds');
  assert(fileExists(join(pluginDir, 'index.js')), 'index.js existe');
  assert(fileExists(join(pluginDir, 'package.json')), 'package.json existe');
  assert(fileExists(join(pluginDir, 'rules', 'no-unauthorized-colors.js')), 'no-unauthorized-colors.js existe');
  assert(fileExists(join(pluginDir, 'rules', 'no-banned-fonts.js')), 'no-banned-fonts.js existe');
  assert(fileExists(join(pluginDir, 'rules', 'prefer-ds-component.js')), 'prefer-ds-component.js existe');

  // Verify index exports configs.recommended
  const indexContent = readFile(join(pluginDir, 'index.js'));
  assert(hasContent(indexContent, 'configs'), 'index.js exporta configs');
  assert(hasContent(indexContent, 'recommended'), 'index.js tem config recommended');
}

function testFigmaHardening() {
  console.log('\n🖼️  Figma Mode — Hardening');

  const content = readFile(join(BASE, 'copilot-instructions.md'));

  assert(hasContent(content, 'checklist de fidelidade'), 'Tem checklist de fidelidade visual');
  assert(hasContent(content, 'pixel'), 'Exige comparação pixel a pixel');
  assert(hasContent(content, 'public/'), 'Define fluxo de assets em public/');
  assert(hasContent(content, 'não entendeu'), 'Bloqueia implementação de elemento ambíguo');
  assert(hasContent(content, 'validate:figma'), 'Referencia auditoria automática de Figma');
}

function testPromptEvalSuite() {
  console.log('\n🧠 Prompt Evals — Estrutura');

  const scenariosPath = join(ROOT, 'evals', 'scenarios.json');
  const runnerPath = join(ROOT, 'tests', 'prompt-evals.mjs');

  assert(fileExists(scenariosPath), 'evals/scenarios.json existe');
  assert(fileExists(runnerPath), 'tests/prompt-evals.mjs existe');

  if (fileExists(scenariosPath)) {
    const scenarios = JSON.parse(readFile(scenariosPath));
    assert(Array.isArray(scenarios) && scenarios.length >= 5, 'Suíte de evals tem pelo menos 5 cenários');

    // Valida que há pelo menos 1 cenário de acessibilidade
    const hasA11yScenario = scenarios.some(
      (s) =>
        (s.id || '').includes('a11y') ||
        (s.id || '').includes('accessibility') ||
        (s.mustInclude || []).some((kw) => ['aria', 'wcag', 'role=', 'aria-live'].includes(kw.toLowerCase()))
    );
    assert(hasA11yScenario, 'Suíte tem cenário de acessibilidade (a11y)');

    // Valida que há pelo menos 1 cenário de loading/estado de UI
    const hasUiStateScenario = scenarios.some(
      (s) =>
        (s.id || '').includes('loading') ||
        (s.id || '').includes('ui-state') ||
        (s.mustInclude || []).some((kw) => ['aria-live', 'aria-busy', 'role="status"'].includes(kw))
    );
    assert(hasUiStateScenario, 'Suíte tem cenário de estado de UI (loading/error)');
  }
}

// === Run All ===

console.log('═'.repeat(60));
console.log('  @dock-tech/shared-copilot-front-lib — Instruction Tests');
console.log('═'.repeat(60));

testBaseInstructionsExist();
testGateDSLogic();
testAccessibilityInstructions();
testNielsenHeuristics();
testUiStatesA11y();
testA11yBaselineFile();
testFormPatternsInstructions();
testInteractivityInstructions();
testCodeQualityInstructions();
testSliderRules();
testPromptsStructure();
testAgentsStructure();
testConfigCoherence();
testEslintPlugin();
testFigmaHardening();
testPromptEvalSuite();

console.log('\n' + '═'.repeat(60));
console.log(`  Resultado: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log('═'.repeat(60));

if (failures.length > 0) {
  console.log('\n❌ Falhas:');
  failures.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n✅ Todas as instructions estão completas e coerentes!');
  process.exit(0);
}
