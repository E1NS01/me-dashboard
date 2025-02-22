import { Card } from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartRanges, StakingData } from "@/types/staking";

interface StakingChartsProps extends ChartRanges {
  data: StakingData[] | null;
}

export const StakingCharts = ({
  data,
  activeStakerRange,
  stakedMERange,
  stakingPowerRange,
}: StakingChartsProps) => {
  const stakerConfig = {
    stakers: { label: "Active Staker", color: "#2563eb" },
  };

  const stakingConfig = {
    stakedME: { label: "Staked $ME", color: "#2563eb" },
    stakingPower: { label: "Staking Power", color: "#2563eb" },
  };

  return (
    <>
      <Card className="p-4">
        <h1 className="text-lg font-semibold mb-2">Active Staker History</h1>
        <ChartContainer config={stakerConfig} className="w-full h-[200px]">
          <LineChart accessibilityLayer data={data ? data : undefined}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) =>
                (value = new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }))
              }
            />
            <YAxis dataKey="staker" domain={activeStakerRange} />
            <CartesianGrid vertical={false} />
            <Line
              dataKey="staker"
              fill="var(--color-staker)"
              radius={4}
              dot={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </Card>

      <Card className="p-4">
        <h1 className="text-lg font-semibold mb-2">$ME Staked</h1>
        <ChartContainer config={stakingConfig} className="w-full h-[200px]">
          <LineChart accessibilityLayer data={data ? data : undefined}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) =>
                (value = new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }))
              }
            />
            <YAxis
              domain={stakedMERange}
              tickFormatter={(value) => `${Math.floor(value / 1e6)}M`}
            />
            <CartesianGrid vertical={false} />
            <Line
              dataKey="stakedME"
              fill="var(--color-stakedMe)"
              radius={4}
              dot={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </Card>

      <Card className="p-4">
        <h1 className="text-lg font-semibold mb-2">Staking Power</h1>
        <ChartContainer config={stakingConfig} className="w-full h-[200px]">
          <LineChart accessibilityLayer data={data ? data : undefined}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) =>
                (value = new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }))
              }
            />
            <YAxis
              domain={stakingPowerRange}
              tickFormatter={(value) => `${Math.floor(value / 1e6)}M`}
            />
            <CartesianGrid vertical={false} />
            <Line
              dataKey="stakingPower"
              fill="var(--color-stakingPower)"
              radius={4}
              dot={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </Card>
    </>
  );
};
