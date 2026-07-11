// hex カラーに任意の alpha を乗せた rgba() 文字列を返す。
// sancho の `color(c).alpha(amount)` と数学的に等価。
export function alphaOf(hex: string, amount: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${amount})`
}
