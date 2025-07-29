import { Card, CardContent } from "@/components/ui/card";
import { MathEngine } from "@/lib/math-engine";

interface VisualBalanceProps {
  equation: string;
  preview?: string;
  isValid: boolean;
}

export default function VisualBalance({ equation, preview, isValid }: VisualBalanceProps) {
  const currentEquation = preview || equation;
  const { left, right } = MathEngine.parseEquation(currentEquation);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equation Balance Visualizer</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Balance Scale Visualization */}
            <div className="flex items-end justify-center space-x-8">
              {/* Left Side */}
              <div className="text-center">
                <div className="w-32 h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-2 border-gray-400 flex items-center justify-center mb-2">
                  <span className="text-sm math-equation text-gray-700 px-2 text-center break-words">
                    {left}
                  </span>
                </div>
                <div className="w-2 h-12 bg-gray-400 mx-auto"></div>
              </div>
              
              {/* Balance Point */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full mb-2 ${
                  isValid ? 'bg-success' : 'bg-error'
                }`}></div>
                <div className={`text-xs font-medium ${
                  isValid ? 'text-success' : 'text-error'
                }`}>
                  {isValid ? 'Balanced' : 'Unbalanced'}
                </div>
              </div>
              
              {/* Right Side */}
              <div className="text-center">
                <div className="w-32 h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-2 border-gray-400 flex items-center justify-center mb-2">
                  <span className="text-sm math-equation text-gray-700 px-2 text-center break-words">
                    {right}
                  </span>
                </div>
                <div className="w-2 h-12 bg-gray-400 mx-auto"></div>
              </div>
            </div>
            
            {/* Base */}
            <div className="w-40 h-4 bg-gray-600 rounded mx-auto mt-4"></div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          {preview ? 
            "Preview: The equation will remain balanced after this operation." :
            "The equation remains balanced when the same operation is applied to both sides."
          }
        </p>
      </CardContent>
    </Card>
  );
}
