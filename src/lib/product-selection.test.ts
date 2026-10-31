import { describe, expect, it } from 'vitest';
import { canSelectProduct } from './product-selection';

describe('Customer product selection', () => {
  it('does not allow hidden products to be purchased', () => {
    expect(canSelectProduct(false, [], '')).toBe(false);
  });
  it('requires an available size for sized products', () => {
    expect(canSelectProduct(true, ['S', 'M'], '')).toBe(false);
    expect(canSelectProduct(true, ['S', 'M'], 'L')).toBe(false);
    expect(canSelectProduct(true, ['S', 'M'], 'M')).toBe(true);
  });
  it('allows products that do not have sizes', () => {
    expect(canSelectProduct(true, [], '')).toBe(true);
  });
});