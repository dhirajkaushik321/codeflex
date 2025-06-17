export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface TestResult {
  testCase: TestCase;
  result: any;
  passed: boolean;
  error?: string;
  executionTime?: number;
}

export interface ExercisePlaygroundProps {
  mode: 'creator' | 'learner';
  initialCode: string;
  testCases?: TestCase[];
  description: string;
  title: string;
  language?: 'javascript' | 'html' | 'css' | 'python';
  readOnly?: boolean;
  onSave?: (exercise: {
    title: string;
    description: string;
    initialCode: string;
    testCases: TestCase[];
  }) => void;
}

export interface SandpackEditorProps {
  initialCode: string;
  language?: 'javascript' | 'html' | 'css' | 'python';
  readOnly?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  onCodeChange?: (code: string) => void;
  height?: number;
}

export interface TestCaseFormProps {
  onAdd: (testCase: TestCase) => void;
  onRemove: (id: string) => void;
  testCases: TestCase[];
}

export interface TestCaseOutputProps {
  results: TestResult[];
  isLoading?: boolean;
} 