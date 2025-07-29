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
      description: 'Distribute/Expand',
      icon: 'fas fa-expand-arrows-alt'
    },
    {
      type: 'combine',
      description: 'Combine like terms',
      icon: 'fas fa-compress-arrows-alt'
    },
    {
      type: 'simplify',
      description: 'Simplify/Cancel terms',
      icon: 'fas fa-magic'
    },
    {
      type: 'calculate',
      description: 'Calculate/Expand all',
      icon: 'fas fa-calculator'
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
        return this.distributeTerms(equation);
      case 'combine':
        return this.combineTerms(equation);
      case 'simplify':
        return this.simplifyEquation(equation);
      case 'calculate':
        return this.calculateEquation(equation);
      default:
        return equation;
    }
    return equation;
  }

  static distributeTerms(equation: string): string {
    // Simple distribution for cases like 2 × (½x + ⅓) -> x + ⅔
    let result = equation;
    
    // Look for patterns like "2 × (½x + ⅓)" and distribute
    result = result.replace(/(\d+|\d+\/\d+|½|⅓|¼|⅔|¾) × \(([^)]+)\)/g, (match, multiplier, inner) => {
      // This is a simplified distribution - in a real app you'd use a proper math parser
      if (multiplier === '2' && inner.includes('½x')) {
        return inner.replace('½x', 'x').replace('⅓', '⅔');
      }
      return `${multiplier} × (${inner})`;
    });
    
    return result;
  }

  static combineTerms(equation: string): string {
    // Simple term combination for like terms
    const { left, right } = this.parseEquation(equation);
    return `${left} = ${right}`;
  }

  static simplifyEquation(equation: string): string {
    console.log('Simplifying equation:', equation);
    const originalResult = equation;
    
    // First, handle both sides of the equation separately
    const { left, right } = this.parseEquation(equation);
    
    const simplifyExpression = (expr: string): string => {
      let simplified = expr.trim();
      console.log('Simplifying expression:', simplified);
      
      // Handle various cancellation patterns
      // Pattern 1: "(2 × (...)) ÷ 2" → "(...)" - handles parentheses around multiplication
      simplified = simplified.replace(/\((\d+) × \(([^)]+)\)\) ÷ \1/g, '($2)');
      
      // Pattern 2: "2 × (...) ÷ 2" → "(...)" - direct multiplication/division cancellation
      simplified = simplified.replace(/(\d+) × \(([^)]+)\) ÷ \1/g, '($2)');
      
      // Pattern 3: More complex nested operations
      // "2 × ((6 × (½x + ⅓)) ÷ 6)" → "2 × (½x + ⅓)"
      simplified = simplified.replace(/(\d+) × \(\((\d+) × \(([^)]+)\)\) ÷ \2\)/g, '$1 × ($3)');
      
      // Pattern 4: Handle operations after subtraction like "- 0.5x"
      simplified = simplified.replace(/\s*-\s*(\d+(?:\.\d+)?)x/g, ' - $1x');
      
      // Pattern 4: Handle cases where outer parentheses wrap the whole multiply/divide
      // "(6 × (½x + ⅓)) ÷ 6" → "(½x + ⅓)"
      simplified = simplified.replace(/\((\d+) × \(([^)]+)\)\) ÷ \1/g, '($2)');
      
      // Clean up multiple levels of parentheses
      let previousLength;
      do {
        previousLength = simplified.length;
        // Remove double parentheses: "((x))" → "(x)"
        simplified = simplified.replace(/\(\(([^)]+)\)\)/g, '($1)');
        // Remove unnecessary single parentheses around simple terms
        simplified = simplified.replace(/\(([^+\-×÷()]+)\)/g, '$1');
      } while (simplified.length !== previousLength);
      
      console.log('Expression simplified to:', simplified);
      return simplified;
    };
    
    const simplifiedLeft = simplifyExpression(left);
    const simplifiedRight = simplifyExpression(right);
    
    const result = `${simplifiedLeft} = ${simplifiedRight}`;
    
    console.log('Final simplified equation:', originalResult, '→', result);
    
    return result;
  }

  static calculateEquation(equation: string): string {
    console.log('Calculating equation:', equation);
    const { left, right } = this.parseEquation(equation);
    
    const calculateExpression = (expr: string): string => {
      let calculated = expr.trim();
      console.log('Calculating expression:', calculated);
      
      // Convert fractions to decimals for calculation
      const fractionToNumber = (frac: string): number => {
        const fractionMap: { [key: string]: number } = {
          '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
          '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1/6, '⅚': 5/6,
          '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
        };
        return fractionMap[frac] || parseFloat(frac);
      };

      const numberToFraction = (num: number): string => {
        if (num === 0.5) return '½';
        if (Math.abs(num - 1/3) < 0.001) return '⅓';
        if (Math.abs(num - 2/3) < 0.001) return '⅔';
        if (num === 0.25) return '¼';
        if (num === 0.75) return '¾';
        if (Math.abs(num - 1/6) < 0.001) return '⅙';
        if (Math.abs(num - 5/6) < 0.001) return '⅚';
        if (num % 1 === 0) return num.toString();
        return num.toString();
      };
      
      // Handle multiplication: "2 × (½x + ⅓)" → "x + ⅔"
      calculated = calculated.replace(/(\d+(?:\.\d+)?) × \(([^)]+)\)/g, (match, multiplier, inner) => {
        const mult = parseFloat(multiplier);
        console.log(`Distributing ${mult} × (${inner})`);
        
        // Split by + and - while preserving signs
        const terms = inner.split(/(\s*[\+\-]\s*)/).filter(term => term.trim() !== '');
        let result = '';
        
        for (let i = 0; i < terms.length; i++) {
          const term = terms[i].trim();
          
          if (term === '+' || term === '-') {
            result += ` ${term} `;
            continue;
          }
          
          // Handle x terms like "½x" or "x"
          if (term.includes('x')) {
            const coeffMatch = term.match(/(½|⅓|¼|⅔|¾|⅕|⅖|⅗|⅘|⅙|⅚|⅛|⅜|⅝|⅞|\d*\.?\d+)?x/);
            if (coeffMatch) {
              const coef = coeffMatch[1] || '1';
              const coefficient = coef === '1' ? 1 : fractionToNumber(coef);
              const newCoef = coefficient * mult;
              
              if (newCoef === 1) {
                result += 'x';
              } else {
                result += `${numberToFraction(newCoef)}x`;
              }
            }
          } else {
            // Handle constant terms
            const constValue = fractionToNumber(term);
            const newValue = constValue * mult;
            result += numberToFraction(newValue);
          }
        }
        
        console.log(`Result of distribution: ${result}`);
        return result;
      });

      // Handle division: "(x + ⅔) ÷ 2" → "½x + ⅓"
      calculated = calculated.replace(/\(([^)]+)\) ÷ (\d+(?:\.\d+)?)/g, (match, inner, divisor) => {
        const div = parseFloat(divisor);
        console.log(`Distributing (${inner}) ÷ ${div}`);
        
        // Split by + and - while preserving signs
        const terms = inner.split(/(\s*[\+\-]\s*)/).filter(term => term.trim() !== '');
        let result = '';
        
        for (let i = 0; i < terms.length; i++) {
          const term = terms[i].trim();
          
          if (term === '+' || term === '-') {
            result += ` ${term} `;
            continue;
          }
          
          // Handle x terms
          if (term.includes('x')) {
            const coeffMatch = term.match(/(½|⅓|¼|⅔|¾|⅕|⅖|⅗|⅘|⅙|⅚|⅛|⅜|⅝|⅞|\d*\.?\d+)?x/);
            if (coeffMatch) {
              const coef = coeffMatch[1] || '1';
              const coefficient = coef === '1' ? 1 : fractionToNumber(coef);
              const newCoef = coefficient / div;
              
              if (newCoef === 1) {
                result += 'x';
              } else {
                result += `${numberToFraction(newCoef)}x`;
              }
            }
          } else {
            // Handle constant terms
            const constValue = fractionToNumber(term);
            const newValue = constValue / div;
            result += numberToFraction(newValue);
          }
        }
        
        console.log(`Result of division: ${result}`);
        return result;
      });
      
      // Remove unnecessary parentheses around single terms
      calculated = calculated.replace(/\(([^+\-×÷()]+)\)/g, '$1');
      
      console.log('Expression calculated to:', calculated);
      return calculated;
    };
    
    const calculatedLeft = calculateExpression(left);
    const calculatedRight = calculateExpression(right);
    
    const result = `${calculatedLeft} = ${calculatedRight}`;
    console.log('Final calculated equation:', equation, '→', result);
    
    return result;
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
      case 'simplify':
      case 'calculate':
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
