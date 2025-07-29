import { TransformationOperation, ValidationResult } from "@/types/math";

export class MathEngine {
  static readonly OPERATIONS: TransformationOperation[] = [
    {
      type: 'multiply',
      description: 'Multiply both sides',
      icon: 'fas fa-times'
    },
    {
      type: 'divide',
      description: 'Divide both sides',
      icon: 'fas fa-divide'
    },
    {
      type: 'add',
      description: 'Add to both sides',
      icon: 'fas fa-plus'
    },
    {
      type: 'subtract',
      description: 'Subtract from both sides',
      icon: 'fas fa-minus'
    },
    {
      type: 'distribute',
      description: 'Distribute',
      icon: 'fas fa-expand-arrows-alt'
    },
    {
      type: 'combine',
      description: 'Combine like terms',
      icon: 'fas fa-compress-arrows-alt'
    }
  ];

  static parseEquation(equation: string): { left: string; right: string } {
    const sides = equation.split('=');
    return {
      left: sides[0]?.trim() || '',
      right: sides[1]?.trim() || ''
    };
  }

  static formatFraction(numerator: number, denominator: number): string {
    if (denominator === 1) return numerator.toString();
    
    const fractionMap: { [key: string]: string } = {
      '1/2': '½',
      '1/3': '⅓',
      '2/3': '⅔',
      '1/4': '¼',
      '3/4': '¾',
      '1/5': '⅕',
      '2/5': '⅖',
      '3/5': '⅗',
      '4/5': '⅘',
      '1/6': '⅙',
      '5/6': '⅚',
      '1/8': '⅛',
      '3/8': '⅜',
      '5/8': '⅝',
      '7/8': '⅞'
    };

    const key = `${numerator}/${denominator}`;
    return fractionMap[key] || `${numerator}/${denominator}`;
  }

  static generatePreview(equation: string, operation: TransformationOperation, operand?: string): string {
    const { left, right } = this.parseEquation(equation);
    
    switch (operation.type) {
      case 'multiply':
        if (operand) {
          return `${operand} × (${left}) = ${operand} × (${right})`;
        }
        break;
      case 'divide':
        if (operand) {
          return `(${left}) ÷ ${operand} = (${right}) ÷ ${operand}`;
        }
        break;
      case 'add':
        if (operand) {
          return `(${left}) + ${operand} = (${right}) + ${operand}`;
        }
        break;
      case 'subtract':
        if (operand) {
          return `(${left}) - ${operand} = (${right}) - ${operand}`;
        }
        break;
      case 'distribute':
        return `${left} = ${right}`;
      case 'combine':
        return `${left} = ${right}`;
      default:
        return equation;
    }
    return equation;
  }

  static validateOperation(equation: string, operation: TransformationOperation, operand?: string): boolean {
    // Basic validation - ensures operation is applicable
    switch (operation.type) {
      case 'multiply':
      case 'divide':
        return operand !== undefined && operand !== '0' && operand !== '';
      case 'add':
      case 'subtract':
        return operand !== undefined && operand !== '';
      case 'distribute':
      case 'combine':
        return true;
      default:
        return false;
    }
  }

  static findLCD(denominators: number[]): number {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    const lcm = (a: number, b: number): number => {
      return (a * b) / gcd(a, b);
    };

    return denominators.reduce((acc, curr) => lcm(acc, curr), 1);
  }

  static extractDenominators(equation: string): number[] {
    // Simple regex to find fraction patterns like 1/2, 3/4, etc.
    const fractionMatches = equation.match(/(\d+)\/(\d+)/g);
    if (!fractionMatches) return [];

    return fractionMatches.map(match => {
      const [, , denominator] = match.match(/(\d+)\/(\d+)/) || [];
      return parseInt(denominator, 10);
    }).filter(d => !isNaN(d));
  }

  static suggestNextOperation(equation: string, currentStep: number): TransformationOperation | null {
    const denominators = this.extractDenominators(equation);
    
    if (denominators.length > 0 && currentStep <= 2) {
      return this.OPERATIONS.find(op => op.type === 'multiply') || null;
    }
    
    if (equation.includes('(') && equation.includes(')')) {
      return this.OPERATIONS.find(op => op.type === 'distribute') || null;
    }
    
    const { left, right } = this.parseEquation(equation);
    if (left.includes('x') && right.includes('x')) {
      return this.OPERATIONS.find(op => op.type === 'subtract') || null;
    }
    
    return null;
  }
}
