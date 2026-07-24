import TopCommandBar from '@/components/government/layout/TopCommandBar';
import LeftIntelligencePanel from '@/components/government/iccc/LeftIntelligencePanel';
import CenterOperationsMap from '@/components/government/iccc/CenterOperationsMap';
import RightDecisionSupportPanel from '@/components/government/iccc/RightDecisionSupportPanel';
import BottomOperationalTimeline from '@/components/government/iccc/BottomOperationalTimeline';
import { OperationalEventSubscriber } from '@/components/government/iccc/OperationalEventSubscriber';

export default function ICCCPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden font-sans selection:bg-blue-900 selection:text-blue-100">
      <OperationalEventSubscriber />
      <TopCommandBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftIntelligencePanel />
        <CenterOperationsMap />
        <RightDecisionSupportPanel />
      </div>
      
      <BottomOperationalTimeline />
    </div>
  );
}
