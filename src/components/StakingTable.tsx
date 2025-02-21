import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Staker } from "@/types/staking";

interface StakingTableProps {
  data: Staker[] | null;
  currentPage: number;
  itemsPerPage: number;
  date: string;
}

export const StakingTable = ({
  data,
  currentPage,
  itemsPerPage,
  date,
}: StakingTableProps) => {
  const formatTimeDifference = (
    startTimestamp: number,
    endTimestamp: number
  ): number => {
    const msInDay = 1000 * 60 * 60 * 24;
    return Math.floor((endTimestamp * 1000 - startTimestamp * 1000) / msInDay);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Table>
      <TableCaption>
        {`Data updated at: ${new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
          timeZoneName: "short",
        })}`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead className="text-right">Staking Power</TableHead>
          <TableHead className="text-right">Amount Staked</TableHead>
          <TableHead className="hidden md:table-cell text-right">
            Staked At
          </TableHead>
          <TableHead className="hidden md:table-cell text-right">
            Unlocks At
          </TableHead>
          <TableHead className="hidden sm:table-cell text-right">
            Duration
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((staker, index) => {
          const rank = index + 1 + (currentPage - 1) * itemsPerPage;
          return (
            <TableRow key={staker.wallet}>
              <TableCell className="font-medium">
                {rank === 1 ? "👑" : rank}
              </TableCell>
              <TableCell>
                <span className="md:hidden">
                  {`${staker.wallet.slice(0, 4)}...${staker.wallet.slice(-4)}`}
                </span>
                <span className="hidden md:inline">{staker.wallet}</span>
              </TableCell>
              <TableCell className="text-right">
                {staker.uiStakingPower.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {staker.uiAmount.toLocaleString()}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right">
                {formatDate(staker.startTs)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right">
                {formatDate(staker.endTs)}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {formatTimeDifference(staker.startTs, staker.endTs)} days
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
