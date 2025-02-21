import { Card } from "@/components/ui/card";
import { StakingData } from "@/types/staking";

interface StatsCardProps {
  data: StakingData[] | null;
}

export const StatsCard = ({ data }: StatsCardProps) => {
  const latestData = data?.[data.length - 1];

  return (
    <Card className="p-5">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Amount Staked:</h2>
          <p className="text-xl font-bold">
            {latestData ? `${latestData.stakedME} $ME` : "Loading..."}
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Total Staking Power:</h2>
          <p className="text-xl font-bold">
            {latestData ? latestData.stakingPower : "Loading..."}
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Total Stakers:</h2>
          <p className="text-xl font-bold">
            {latestData ? latestData.staker : "Loading..."}
          </p>
        </div>
      </div>
    </Card>
  );
};
