/** Canonicalize fully factored products for the five introductory practice items.
 * No eval, CAS execution, or numerical sampling. Expanded polynomials are rejected.
 */
export function canonicalFactors(answer: string): string | null {
  const input = answer.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/[×*·]/g, '').toLowerCase()
  const token = /(?:(\d+)|\((x[+-]\d+)\)(?:\^([1-4]))?)/y
  const factors: string[] = []
  let coefficient = 1
  let position = 0
  while (position < input.length) {
    token.lastIndex = position
    const match = token.exec(input)
    if (!match) return null
    position = token.lastIndex
    if (match[1]) coefficient *= Number(match[1])
    else for (let i = 0; i < Number(match[3] || 1); i++) factors.push(match[2])
    if (!Number.isSafeInteger(coefficient) || factors.length > 8) return null
  }
  return factors.length ? `${coefficient}:${factors.sort().join('|')}` : null
}
