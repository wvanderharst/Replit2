import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import StepTracker from "@/components/step-tracker";
import EquationWorkspace from "@/components/equation-workspace";
import VisualBalance from "@/components/visual-balance";
import HintPanel from "@/components/hint-panel";
import MobileBottomBar from "@/components/mobile-bottom-bar";
import { MathStep, MathHint, EquationState } from "@/types/math";
import { MathEngine } from "@/lib/math-engine";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MathWorkspace() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [equationState, setEquationState] = useState<EquationState>({
    original: "½x + ⅓ = ¼x - ⅙",
    current: "½x + ⅓ = ¼x - ⅙",
    isValid: true
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileView, setMobileView] = useState('workspace');
  const [equationHistory, setEquationHistory] = useState<string[]>(["½x + ⅓ = ¼x - ⅙"]);
  const isMobile = useIsMobile();

  // Fetch initial problem
  const { data: problems } = useQuery({
    queryKey: ['/api/problems/linear_equations'],
  });

  const currentProblem = problems?.[0];

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (problemId: string) => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equationType: 'linear_equations',
          originalEquation: equationState.original,
          currentStep: 1,
          totalSteps: currentProblem?.steps.length || 5,
          stepsCompleted: [],
          hints: currentProblem?.hints || [],
          isCompleted: false
        })
      });
      return response.json();
    },
    onSuccess: (session) => {
      setCurrentSessionId(session.id);
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    }
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: any }) => {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    }
  });

  const steps: MathStep[] = currentProblem?.steps.map((step: any, index: number) => ({
    ...step,
    isCompleted: index < currentStep - 1,
    isValid: true
  })) || [];

  const hints: MathHint[] = currentProblem?.hints || [];

  const handleOperationSelect = (operation: string, operand?: string) => {
    const mathOperation = MathEngine.OPERATIONS.find(op => op.type === operation);
    if (!mathOperation) return;

    const preview = MathEngine.generatePreview(equationState.current, mathOperation, operand);
    const isValid = MathEngine.validateOperation(equationState.current, mathOperation, operand);

    setEquationState(prev => ({
      ...prev,
      preview,
      isValid
    }));
    setPreviewMode(true);
  };

  const handleApplyTransformation = () => {
    if (equationState.preview && equationState.isValid) {
      const newEquation = equationState.preview;
      
      // Add current equation to history before changing it
      setEquationHistory(prev => [...prev, newEquation]);
      
      setEquationState(prev => ({
        ...prev,
        current: newEquation,
        preview: undefined
      }));
      setCurrentStep(prev => prev + 1);
      setPreviewMode(false);

      // Update session if exists
      if (currentSessionId) {
        updateSessionMutation.mutate({
          sessionId: currentSessionId,
          updates: {
            currentStep: currentStep + 1,
            stepsCompleted: [
              ...[], // would include previous steps
              {
                stepNumber: currentStep,
                operation: 'transformation',
                equation: newEquation,
                isValid: true,
                timestamp: new Date().toISOString()
              }
            ]
          }
        });
      }
    }
  };

  const handleUndoStep = () => {
    if (previewMode) {
      // Cancel preview mode
      setEquationState(prev => ({
        ...prev,
        preview: undefined,
        isValid: true
      }));
      setPreviewMode(false);
    } else if (equationHistory.length > 1) {
      // Undo last committed step
      const newHistory = equationHistory.slice(0, -1);
      const previousEquation = newHistory[newHistory.length - 1];
      
      setEquationHistory(newHistory);
      setEquationState(prev => ({
        ...prev,
        current: previousEquation,
        preview: undefined
      }));
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  useEffect(() => {
    if (currentProblem && !currentSessionId) {
      createSessionMutation.mutate(currentProblem.id);
    }
  }, [currentProblem]);

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading math problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-square-root-alt text-white text-sm"></i>
                </div>
                <h1 className="text-xl font-bold text-gray-900">MathFlow</h1>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <nav className="flex space-x-6">
                  <a href="#" className="text-primary font-medium">Equations</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Functions</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Inequalities</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Practice</a>
                </nav>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                <i className="fas fa-chart-line text-gray-600"></i>
                <span className="text-sm font-medium text-gray-700">Progress</span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Tracker */}
          <div className={`lg:col-span-1 ${isMobile && mobileView !== 'steps' ? 'hidden' : ''}`}>
            <StepTracker 
              steps={steps}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
          
          {/* Main Workspace */}
          <div className={`lg:col-span-2 ${isMobile && mobileView !== 'workspace' ? 'hidden' : ''}`}>
            <EquationWorkspace
              equationState={equationState}
              previewMode={previewMode}
              onOperationSelect={handleOperationSelect}
              onApplyTransformation={handleApplyTransformation}
              onUndoStep={handleUndoStep}
              currentStep={currentStep}
              canUndo={equationHistory.length > 1}
            />
            
            <div className={`mt-6 ${isMobile && mobileView !== 'balance' ? 'hidden lg:block' : ''}`}>
              <VisualBalance 
                equation={equationState.current}
                preview={equationState.preview}
                isValid={equationState.isValid}
              />
            </div>
          </div>
          
          {/* Hint Panel */}
          <div className={`lg:col-span-1 ${isMobile && mobileView !== 'hints' ? 'hidden' : ''}`}>
            <HintPanel 
              hints={hints}
              currentStep={currentStep}
              equation={equationState.current}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <MobileBottomBar 
          currentView={mobileView}
          onViewChange={setMobileView}
        />
      )}
    </div>
  );
}
