#!/usr/bin/env node
/**
 * prompt-evals.mjs
 *
 * Harness de evals para cenários reais de prompt/output do Copilot.
 *
 * Modos:
 * 1. Sem outputs: valida a integridade da suíte de cenários.
 * 2. Com --output-dir=./eval-outputs: valida outputs reais gravados em .txt.
 *
 * Convenção de output:
 * - Um arquivo por cenário: <scenario-id>.txt
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const scenariosPath = join(ROOT, 'evals', 'scenarios.json');
const outputArg = process.argv.find((arg) => arg.startsWith('--output-dir='));
const outputDir = outputArg ? outputArg.split('=')[1] : null;

const scenarios = JSON.parse(readFileSync(scenariosPath, 'utf-8'));
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, name, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
    return;
  }

  failed++;
  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`  ✗ ${name}${detail ? ` (${detail})` : ''}`);
}

function includesAll(text, fragments = []) {
  const lower = text.toLowerCase();
  return fragments.every((fragment) => lower.includes(fragment.toLowerCase()));
}

function includesNone(text, fragments = []) {
  const lower = text.toLowerCase();
  return fragments.every((fragment) => !lower.includes(fragment.toLowerCase()));
}

console.log('═'.repeat(60));
console.log('  @dock-tech/shared-copilot-front-lib — Prompt Evals');
console.log('═'.repeat(60));

console.log('\n🧪 Integridade da suíte');
assert(Array.isArray(scenarios) && scenarios.length >= 5, 'Suíte tem pelo menos 5 cenários');

for (const scenario of scenarios) {
  assert(Boolean(scenario.id), `${scenario.id || 'scenario'} tem id`);
  assert(Boolean(scenario.mode), `${scenario.id} tem mode`);
  assert(Boolean(scenario.prompt), `${scenario.id} tem prompt`);
  assert(
    (scenario.mustInclude?.length || 0) + (scenario.mustAsk?.length || 0) + (scenario.mustNotInclude?.length || 0) > 0,
    `${scenario.id} tem critérios de avaliação`
  );
}

if (!outputDir) {
  console.log('\nℹ️  Nenhum diretório de outputs informado.');
  console.log('   Para validar respostas reais do Copilot, rode:');
  console.log('   node tests/prompt-evals.mjs --output-dir=./eval-outputs\n');
} else {
  console.log('\n🤖 Validando outputs reais');

  for (const scenario of scenarios) {
    const outputPath = join(outputDir, `${scenario.id}.txt`);
    assert(existsSync(outputPath), `${scenario.id} tem output gravado`, outputPath);

    if (!existsSync(outputPath)) {
      continue;
    }

    const output = readFileSync(outputPath, 'utf-8');

    if (scenario.mustInclude?.length) {
      assert(
        includesAll(output, scenario.mustInclude),
        `${scenario.id} inclui itens obrigatórios`,
        scenario.mustInclude.join(', ')
      );
    }

    if (scenario.mustAsk?.length) {
      assert(
        includesAll(output, scenario.mustAsk),
        `${scenario.id} faz as perguntas necessárias`,
        scenario.mustAsk.join(', ')
      );
    }

    if (scenario.mustNotInclude?.length) {
      assert(
        includesNone(output, scenario.mustNotInclude),
        `${scenario.id} não contém anti-patterns`,
        scenario.mustNotInclude.join(', ')
      );
    }
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`  Resultado: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log('═'.repeat(60));

if (failures.length > 0) {
  console.log('\n❌ Falhas:');
  failures.forEach((failure, index) => console.log(`   ${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('\n✅ Evals prontas para uso.');
process.exit(0);
