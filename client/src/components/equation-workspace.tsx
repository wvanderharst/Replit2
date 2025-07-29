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
  canUndo?: boolean;
}

export default function EquationWorkspace({
  equationState,
  previewMode,
  onOperationSelect,
  onApplyTransformation,
  onUndoStep,
  currentStep,
  canUndo = false
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
              disabled={!canUndo && !previewMode}
            >
              <i className="fas fa-history text-sm mr-2"></i>
              {previewMode ? 'Cancel' : 'Undo'}
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
                Step {currentStep}: Current equation
              </p>
              <div className="flex items-center space-x-2">
                {!previewMode && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-xs font-medium text-success">Ready for transformation</span>
                  </>
                )}
                {previewMode && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-warning animate-pulse"></div>
                    <span className="text-xs font-medium text-warning">Preview mode</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-2xl math-equation text-gray-900 text-center">
              <div className="space-y-2">
                <div className={`inline-block px-3 py-2 rounded border ${
                  previewMode ? 'bg-gray-50 opacity-60' : 'bg-white'
                }`}>
                  {equationState.current}
                </div>
              </div>
            </div>
            {!previewMode && (
              <p className="text-center text-sm text-gray-600 mt-3">
                Choose an operation below to transform this equation
              </p>
            )}
          </div>
          
          {/* Preview Area - This shows when student selects an operation */}
          {previewMode && equationState.preview && (
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 shadow-lg">
              <h3 className="text-base font-bold text-orange-800 mb-3 text-center">
                🔍 PREVIEW: What will happen after this transformation
              </h3>
              
              <div className="bg-white rounded-lg p-3 border border-orange-300 mb-3">
                <div className="text-lg math-equation text-gray-900 text-center font-bold">
                  {equationState.preview}
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    equationState.isValid ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    equationState.isValid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {equationState.isValid ? '✓ This transformation is valid' : '✗ This would unbalance the equation'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onUndoStep}
                  className="border-gray-400 hover:bg-gray-100 px-4 py-2"
                >
                  <i className="fas fa-times text-sm mr-2"></i>
                  Cancel
                </Button>
                <Button
                  onClick={onApplyTransformation}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-bold"
                  disabled={!equationState.isValid}
                >
                  <i className="fas fa-check text-sm mr-2"></i>
                  COMMIT THIS STEP
                </Button>
              </div>
              
              {!equationState.isValid && (
                <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-red-700 text-center">
                    <i className="fas fa-exclamation-triangle text-sm mr-2"></i>
                    This transformation would break the equation balance. Try a different operation or value.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`mt-8 mb-6 ${previewMode ? 'opacity-50 pointer-events-none' : ''}`}>
          <OperationButtons onOperationSelect={onOperationSelect} />
          {previewMode && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                <i className="fas fa-lock text-gray-400 mr-2"></i>
                Operation buttons are disabled while in preview mode. Commit or cancel your preview above.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
