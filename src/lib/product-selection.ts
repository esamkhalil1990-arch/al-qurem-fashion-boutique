export function canSelectProduct(active: boolean, sizes: string[] | null, selected: string, stock: number | null = null) {
  return active && stock !== 0 && (!sizes?.length || sizes.includes(selected));
}