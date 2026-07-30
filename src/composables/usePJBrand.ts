import { computed } from 'vue'

const BASE = import.meta.env.BASE_URL

/**
 * Retorna a URL do logo correto com base em isPJ.
 * Centraliza a lógica de marca PJ × PF em um único lugar.
 */
export function usePJBrand(isPJ: boolean | (() => boolean)) {
  const flag = typeof isPJ === 'function' ? isPJ : () => isPJ

  const logoSrc = computed(() =>
    flag()
      ? `${BASE}assets/Rede-Frota.svg`
      : `${BASE}assets/dock-logo-color.png`,
  )

  const logoAlt = computed(() => (flag() ? 'Rede Frota' : 'Dock'))

  return { logoSrc, logoAlt }
}
