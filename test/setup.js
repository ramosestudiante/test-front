import { expect } from 'vitest'
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
// Añade los matchers de @testing-library/jest-dom a Vitest
expect.extend({ toBeInTheDocument });