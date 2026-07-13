/** "김철수" -> "김*수", "이가" -> "이*", "남궁도영수" -> "남***수" */
export function maskName(name) {
  if (!name || name.length <= 1) return name
  if (name.length === 2) return `${name[0]}*`
  const masked = '*'.repeat(name.length - 2)
  return `${name[0]}${masked}${name[name.length - 1]}`
}
