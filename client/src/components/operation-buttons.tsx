import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOperation === 'multiply' && 'Multiply both sides by:'}
              {selectedOperation === 'divide' && 'Divide both sides by:'}
              {selectedOperation === 'add' && 'Add to both sides:'}
              {selectedOperation === 'subtract' && 'Subtract from both sides:'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={operand}
              onChange={(e) => setOperand(e.target.value)}
              placeholder="Enter value (e.g., 2, 1/2, x, etc.)"
              className="math-equation"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleOperandSubmit}
                disabled={!operand}
              >
                Apply Operation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
