import { useState } from "react";
import { MathHint } from "@/types/math";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathEngine } from "@/lib/math-engine";

interface HintPanelProps {
  hints: MathHint[];
  currentStep: number;
  equation: string;
}

export default function HintPanel({ hints, currentStep, equation }: HintPanelProps) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());

  const currentHints = hints.filter(hint => hint.stepNumber === currentStep);
  const primaryHint = currentHints.find(hint => hint.triggerCondition === 'step_start');
  const additionalHints = currentHints.filter(hint => hint.triggerCondition === 'hint_request');

  const toggleHint = (hintIndex: number) => {
    const newExpanded = new Set(expandedHints);
    if (newExpanded.has(hintIndex)) {
      newExpanded.delete(hintIndex);
    } else {
      newExpanded.add(hintIndex);
    }
    setExpandedHints(newExpanded);
  };

  const suggestedOperation = MathEngine.suggestNextOperation(equation, currentStep);
  const denominators = MathEngine.extractDenominators(equation);
  const lcd = denominators.length > 0 ? MathEngine.findLCD(denominators) : null;

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guided Hints</h3>
        
        {/* Current Hint */}
        {primaryHint && (
          <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-lightbulb text-white text-xs"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Think about this:</p>
                <p className="text-sm text-gray-700">
                  {primaryHint.hintText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Hints */}
        {lcd && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-calculator text-white text-xs"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Quick tip:</p>
                <p className="text-sm text-gray-700">
                  The LCD of the denominators in this equation is {lcd}. 
                  Multiplying both sides by {lcd} will clear all fractions.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Additional Hints */}
        <div className="space-y-3">
          {additionalHints.map((hint, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between text-left h-auto p-3"
              onClick={() => toggleHint(index)}
            >
              <span className="text-sm font-medium text-gray-700">
                {hint.stepNumber === 2 ? "What's the LCD calculation?" :
                 hint.stepNumber === 3 ? "Why clear fractions first?" :
                 "How to verify each step?"}
              </span>
              <i className={`fas ${expandedHints.has(index) ? 'fa-chevron-down' : 'fa-chevron-right'} text-gray-400 text-xs`}></i>
            </Button>
          ))}
          
          {expandedHints.size > 0 && (
            <div className="mt-4 space-y-3">
              {Array.from(expandedHints).map(hintIndex => {
                const hint = additionalHints[hintIndex];
                return hint ? (
                  <div key={hintIndex} className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-sm text-gray-700">{hint.hintText}</p>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        {/* Progress Encouragement */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <i className="fas fa-trophy text-success text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Great progress!</p>
              <p className="text-xs text-gray-600">You're thinking step-by-step like a mathematician.</p>
            </div>
          </div>
        </div>
        
        {/* Practice More */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Practice Similar Problems:</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full text-left h-auto p-3 bg-primary/10 hover:bg-primary/20 border-primary/20"
            >
              <span className="text-sm font-medium text-primary math-equation">⅗x - ¼ = ½x + ⅙</span>
            </Button>
            <Button
              variant="outline"
              className="w-full text-left h-auto p-3"
            >
              <span className="text-sm font-medium text-gray-700 math-equation">⅔y + ⅕ = ¼y - ⅛</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
