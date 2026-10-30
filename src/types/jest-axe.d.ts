// Minimal types for the parts of jest-axe used in tests (no @types package).
declare module "jest-axe" {
  export interface AxeViolation {
    id: string;
    help: string;
    nodes: { html: string }[];
  }

  export interface AxeResults {
    violations: AxeViolation[];
  }

  export function axe(html: Element | string): Promise<AxeResults>;
}
