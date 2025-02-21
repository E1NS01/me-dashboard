import { Card } from "@/components/ui/card";
import { Staker } from "@/types/staking";

interface ThresholdsCardProps {
  stakers: Staker[] | null;
}

export const ThresholdsCard = ({ stakers }: ThresholdsCardProps) => {
  const getThresholdValue = (percentage: number) => {
    if (!stakers) return "Loading...";
    const index = Math.ceil(stakers.length * percentage);
    return `${Math.ceil(stakers[index]?.uiStakingPower)} Staking Power`;
  };

  return (
    <Card className="p-5">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Staking Power Thresholds
      </h1>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-md font-medium">Top 1%:</h2>
          <p className="text-lg font-bold">{getThresholdValue(0.01)}</p>
        </div>
        <div className="text-center">
          <h2 className="text-md font-medium">Top 5%:</h2>
          <p className="text-lg font-bold">{getThresholdValue(0.05)}</p>
        </div>
        <div className="text-center">
          <h2 className="text-md font-medium">Top 10% ($ME MAFIA):</h2>
          <p className="text-lg font-bold">{getThresholdValue(0.1)}</p>
        </div>
      </div>
    </Card>
  );
};
