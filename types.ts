
export interface Requirement {
  id: string;
  name: string;
  description: string;
  type: 'functional' | 'non-functional' | 'external-connection' | 'data' | 'other';
  priority: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
  acceptance_criteria: string[];
  related_stories?: string[];
  source?: string;
}

export interface GeminiOutput {
  markdown: string;
  requirements: Requirement[];
}