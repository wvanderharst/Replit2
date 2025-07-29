export interface MathStep {
  stepNumber: number;
  description: string;
  operation: string;
  equation: string;
  explanation: string;
  isCompleted?: boolean;
  isValid?: boolean;
}

export interface MathHint {
  stepNumber: number;
  hintText: string;
  triggerCondition: string;
  shown?: boolean;
}

export interface EquationState {
  original: string;
  current: string;
  preview?: string;
  isValid: boolean;
}

export interface TransformationOperation {
  type: 'multiply' | 'divide' | 'add' | 'subtract' | 'distribute' | 'combine' | 'simplify';
  operand?: string;
  description: string;
  icon: string;
}

export interface ValidationResult {
  isValid: boolean;
  preview: string;
  explanation: string;
}
