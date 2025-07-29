import { Button } from "@/components/ui/button";

interface MobileBottomBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function MobileBottomBar({ currentView, onViewChange }: MobileBottomBarProps) {
  const views = [
    { id: 'steps', label: 'Steps', icon: 'fas fa-list-ol' },
    { id: 'workspace', label: 'Workspace', icon: 'fas fa-calculator' },
    { id: 'balance', label: 'Balance', icon: 'fas fa-balance-scale' },
    { id: 'hints', label: 'Hints', icon: 'fas fa-lightbulb' }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
      <div className="flex items-center justify-between">
        {views.map((view) => (
          <Button
            key={view.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
              currentView === view.id ? 'text-primary' : 'text-gray-600'
            }`}
            onClick={() => onViewChange(view.id)}
          >
            <i className={`${view.icon} text-sm`}></i>
            <span className="text-xs font-medium">{view.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
