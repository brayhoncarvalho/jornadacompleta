# Checklist de Entrega - Projeto Completo

## Escopo Fechado
- [x] Coexistencia dos fluxos: Onboarding PF + Portal PJ
- [x] Jornada de credito da Dock mantida nas 4 telas PJ
- [x] Navegacao entre fluxos sem depender de URL manual
- [x] Limpeza de trecho nao usado no app principal

## Rotas Principais
- Landing (onboarding): `?screen=landing`
- Proposta onboarding: `?screen=proposta`
- Portal PJ dashboard: `?screen=pj-dashboard`
- Portal PJ cartoes: `?screen=pj-cartoes`
- Portal PJ aporte: `?screen=pj-aporte`
- Portal PJ motorista: `?screen=pj-motorista`

## Validacoes Tecnicas
- [x] Lint global zerado
- [x] Build de producao concluido sem erros

### Comandos executados
- `npx eslint src --ext .ts,.vue --fix`
- `npx eslint src --ext .ts,.vue`
- `npm run build`

## Ajustes de Navegacao Entregues
- [x] Landing abre por padrao
- [x] Botao "Portal PJ" no cabecalho da landing (desktop)
- [x] Botao "Portal PJ" no drawer mobile da landing
- [x] Item "Onboarding PF" no menu lateral PJ
- [x] Botao "Ir para onboarding" na topbar PJ

## Arquivos Alterados na Entrega Final
- `eslint.config.js`
- `src/App.vue`
- `src/components/pj/PjPortalLayout.vue`
- `src/components/pj/PjDashboardScreen.vue`
- `src/components/pj/PjCartoesScreen.vue`
- `src/components/pj/PjAporteScreen.vue`
- `src/components/pj/PjMotoristaScreen.vue`
