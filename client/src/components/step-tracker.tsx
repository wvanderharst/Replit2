import { MathStep } from "@/types/math";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StepTrackerProps {
  steps: MathStep[];
  currentStep: number;
  totalSteps: number;
}

export default function StepTracker({ steps, currentStep, totalSteps }: StepTrackerProps) {
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution Steps</h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;
            
            return (
              <div 
                key={step.stepNumber} 
                className={`flex items-center space-x-3 ${isUpcoming ? 'opacity-50' : ''}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-success text-white' : ''}
                  ${isCurrent ? 'bg-primary text-white animate-pulse' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {isCompleted ? (
                    <i className="fas fa-check text-sm"></i>
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-primary' : 
                    isCompleted ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                  <p className="text-xs text-gray-500">{step.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {currentStep - 1}/{totalSteps} steps
            </span>
          </div>
          <div className="mt-2">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
