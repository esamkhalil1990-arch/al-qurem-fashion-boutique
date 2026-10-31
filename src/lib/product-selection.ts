export function canSelectProduct(active: boolean, sizes: string[] | null, selected: string) {
  return active && (!sizes?.length || sizes.includes(selected));
}