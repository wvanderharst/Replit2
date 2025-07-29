import { EquationState } from "@/types/math";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OperationButtons from "./operation-buttons";

interface EquationWorkspaceProps {
  equationState: EquationState;
  previewMode: boolean;
  onOperationSelect: (operation: string, operand?: string) => void;
  onApplyTransformation: () => void;
  onUndoStep: () => void;
  currentStep: number;
}

export default function EquationWorkspace({
  equationState,
  previewMode,
  onOperationSelect,
  onApplyTransformation,
  onUndoStep,
  currentStep
}: EquationWorkspaceProps) {
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Equation Workspace</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              className={previewMode ? "bg-warning hover:bg-warning/90 text-white" : ""}
            >
              <i className="fas fa-eye text-sm mr-2"></i>
              Preview Mode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onUndoStep}
            >
              <i className="fas fa-history text-sm mr-2"></i>
              Undo
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Original Equation */}
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
            <p className="text-sm text-gray-600 mb-2">Original Equation:</p>
            <div className="text-2xl math-equation text-gray-900 text-center">
              <span className="inline-block bg-white px-3 py-2 rounded border">
                {equationState.original}
              </span>
            </div>
          </div>
          
          {/* Current Step */}
          <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-primary font-medium">
                Step {currentStep}: Working with current equation
              </p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  equationState.isValid ? 'bg-success' : 'bg-error'
                }`}></div>
                <span className={`text-xs font-medium ${
                  equationState.isValid ? 'text-success' : 'text-error'
                }`}>
                  {equationState.isValid ? 'Valid equation' : 'Invalid equation'}
                </span>
              </div>
            </div>
            <div className="text-2xl math-equation text-gray-900 text-center">
              <div className="space-y-2">
                <div className="inline-block bg-white px-3 py-2 rounded border">
                  {equationState.current}
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Area */}
          {previewMode && equationState.preview && (
            <div className="bg-warning/5 rounded-lg p-4 border-l-4 border-warning border-dashed">
              <p className="text-sm text-warning font-medium mb-2">Preview: After transformation</p>
              <div className="text-2xl math-equation text-gray-700 text-center opacity-75">
                <span className="inline-block bg-white px-3 py-2 rounded border border-dashed">
                  {equationState.preview}
                </span>
              </div>
              <div className="flex items-center justify-center mt-3">
                <Button
                  onClick={onApplyTransformation}
                  className="bg-warning hover:bg-warning/90 text-white"
                  disabled={!equationState.isValid}
                >
                  Apply This Step
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <OperationButtons onOperationSelect={onOperationSelect} />
        </div>
      </CardContent>
    </Card>
  );
}
