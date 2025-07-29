import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MathEngine } from "@/lib/math-engine";

interface OperationButtonsProps {
  onOperationSelect: (operation: string, operand?: string) => void;
}

export default function OperationButtons({ onOperationSelect }: OperationButtonsProps) {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [operand, setOperand] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOperationClick = (operation: string) => {
    const needsOperand = ['multiply', 'divide', 'add', 'subtract'].includes(operation);
    
    if (needsOperand) {
      setSelectedOperation(operation);
      setOperand("");
      setDialogOpen(true);
    } else {
      onOperationSelect(operation);
    }
  };

  const handleOperandSubmit = () => {
    if (selectedOperation && operand) {
      onOperationSelect(selectedOperation, operand);
      setDialogOpen(false);
      setOperand("");
      setSelectedOperation(null);
    }
  };

  const handleKeypadInput = (value: string) => {
    if (value === 'clear') {
      setOperand("");
    } else if (value === 'backspace') {
      setOperand(prev => prev.slice(0, -1));
    } else if (value === '×') {
      setOperand(prev => prev + '*');
    } else if (value === '1/2') {
      setOperand(prev => prev + '½');
    } else if (value === '1/3') {
      setOperand(prev => prev + '⅓');
    } else if (value === '1/4') {
      setOperand(prev => prev + '¼');
    } else {
      setOperand(prev => prev + value);
    }
  };

  const keypadButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '(', ')'],
    ['x', 'y', '+', '='],
    ['1/2', '1/3', '1/4', 'clear']
  ];

  return (
    <>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Available Operations:</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MathEngine.OPERATIONS.map((operation) => (
          <Button
            key={operation.type}
            variant="outline"
            className="flex items-center justify-center space-x-2 h-auto py-3 hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
            onClick={() => handleOperationClick(operation.type)}
          >
            <i className={`${operation.icon} text-sm`}></i>
            <span className="text-sm font-medium">{operation.description}</span>
          </Button>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedOperation === 'multiply' && 'Multiply both sides by:'}
              {selectedOperation === 'divide' && 'Divide both sides by:'}
              {selectedOperation === 'add' && 'Add to both sides:'}
              {selectedOperation === 'subtract' && 'Subtract from both sides:'}
            </DialogTitle>
            <DialogDescription>
              Use the calculator below or type the value you want to apply to both sides of the equation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Display */}
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-right text-2xl math-equation font-mono min-h-[2rem] flex items-center justify-end">
                {operand || "0"}
              </div>
            </div>
            
            {/* Math Keypad */}
            <div className="grid grid-cols-4 gap-2">
              {keypadButtons.flat().map((key, index) => (
                <Button
                  key={index}
                  variant={key === 'clear' ? "destructive" : key === '=' ? "default" : "outline"}
                  className={`h-12 ${key === 'clear' ? 'col-span-2' : ''} ${
                    ['1/2', '1/3', '1/4'].includes(key) ? 'text-xs' : ''
                  }`}
                  onClick={() => handleKeypadInput(key)}
                >
                  {key === '×' ? '×' : key === 'clear' ? 'Clear' : key}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleKeypadInput('backspace')}
              >
                ⌫
              </Button>
            </div>
            
            {/* Manual Input */}
            <div className="pt-2 border-t">
              <Input
                value={operand}
                onChange={(e) => setOperand(e.target.value)}
                placeholder="Or type manually (e.g., 2, 1/2, x, etc.)"
                className="math-equation text-center"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleOperandSubmit}
                disabled={!operand || operand === "0"}
                className="bg-primary hover:bg-primary/90"
              >
                Preview This Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
