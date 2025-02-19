import { ChangeEvent, useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const URL =
  "api/api/trpc/staking.getStakerSnapshot?input=%7B%22json%22%3A%7B%20%22token%22%3A%20%22MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u%22,%20%22ns%22%3A%20%22acAvyneD7adS3yrXUp41c1AuoYoYRhnjeAWH9stbdTf%22%7D%7D";

function App() {
  const [data, setData] = useState<{
    ts: string;
    totalUIStaked: number;
    totalUIStakingPower: number;
  } | null>(null);
  const [stakers, setStakers] = useState<
    | {
        wallet: string;
        uiStakingPower: number;
        uiAmount: number;
        startTs: number;
        endTs: number;
        durateion: number;
      }[]
    | null
  >(null);
  /* const [loading, setLoading] = useState(true); */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15);
  const [paginatedData, setPaginatedData] = useState<
    | {
        wallet: string;
        uiStakingPower: number;
        uiAmount: number;
        startTs: number;
        endTs: number;
        durateion: number;
      }[]
    | null
  >(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activeStakers, setActiveStakers] = useState<
    { stakers: number; date: string }[]
  >([
    {
      stakers: 0,
      date: "19.Feb",
    },
  ]);

  const [goToSite, setGoToSite] = useState<number>(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  useEffect(() => {
    if (!stakers) return;
    setTotalPages(Math.ceil(stakers.length / itemsPerPage));
    setPaginatedData(stakers.slice(startIndex, startIndex + itemsPerPage));
  }, [stakers, itemsPerPage, startIndex]);

  useEffect(() => {
    const fetchData = async () => {
      /* try { */
      /* setLoading(true); */
      const res = await fetch(URL);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const stakingData = await res.json();
      setData(stakingData.result.data.json);
      setStakers(
        stakingData.result.data.json.stakers.filter(
          (staker: { uiStakingPower: number }) => staker.uiStakingPower !== 0
        )
      );
      /*} catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      } */
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (stakers) {
      setActiveStakers([
        { stakers: 50112, date: "17. Feb" },
        { stakers: 51063, date: "18. Feb" },
        { stakers: stakers.length, date: "19. Feb" },
      ]);
    }
  }, [stakers]);

  const createUtcDate = (unixDate: number): string => {
    const date = new Date(unixDate * 1000).toUTCString().replace("GMT", "UTC");
    return date;
  };

  const handlePageNavigationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const site = parseInt(e.target.value, 10);
    if (!isNaN(site)) {
      setGoToSite(Math.min(Math.max(site, 1), totalPages)); // Ensures value is between 1 and totalPages
    }
  };

  const handlePageNavigationSubmit = () => {
    if (goToSite && goToSite >= 1 && goToSite <= totalPages) {
      setCurrentPage(goToSite);
    }
  };

  const formatTimeDifference = (
    startTimestamp: number,
    endTimestamp: number
  ): number => {
    const msInDay = 1000 * 60 * 60 * 24;
    return Math.floor((endTimestamp * 1000 - startTimestamp * 1000) / msInDay);
  };

  const chartConfig = {
    stakers: {
      label: "Active Staker",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div className="justify-center pt-8">
      <div className="w-[90%] mx-auto flex flex-row items-start justify-between gap-4">
        {/* Chart Card (Fixed Height) */}
        <Card className="flex flex-col items-center w-[35%] p-4">
          <h1 className="text-lg font-semibold mb-2">Staking History</h1>
          <ChartContainer
            config={chartConfig}
            className="w-full h-[250px] overflow-hidden"
          >
            <LineChart accessibilityLayer data={activeStakers}>
              <XAxis dataKey="date" />
              <YAxis dataKey="stakers" />
              <CartesianGrid vertical={false} />
              <Line dataKey="stakers" fill="var(--color-stakers)" radius={4} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </Card>

        {/* Stats Card */}
        <Card className="w-[30%] flex flex-col items-center p-5">
          <h1 className="text-lg font-semibold">Amount Staked:</h1>
          <p className="text-xl font-bold">
            {parseInt(data?.totalUIStaked as unknown as string) + " $ME"}
          </p>
          <h1 className="text-lg font-semibold mt-2">Total Staking Power:</h1>
          <p className="text-xl font-bold">
            {parseInt(data?.totalUIStakingPower as unknown as string)}
          </p>
          <h1 className="text-lg font-semibold mt-2">Total Stakers:</h1>
          <p className="text-xl font-bold">{stakers?.length}</p>
        </Card>

        {/* Staking Thresholds Card */}
        <Card className="w-[30%] flex flex-col items-center p-5">
          <h1 className="text-xl font-semibold mb-2">
            Staking Power Thresholds
          </h1>
          <div className="space-y-2 text-center">
            <div>
              <h2 className="text-md font-medium">Top 1%:</h2>
              <p className="text-lg font-bold">
                {stakers &&
                  Math.ceil(
                    stakers[Math.ceil(stakers.length * 0.01)].uiStakingPower
                  ) + " Staking Power"}
              </p>
            </div>
            <div>
              <h2 className="text-md font-medium"> Top 5%</h2>
              <p className="text-lg font-bold">
                {stakers &&
                  Math.ceil(
                    stakers[Math.ceil(stakers.length * 0.05)].uiStakingPower
                  ) + " Staking Power"}
              </p>
            </div>
            <div>
              <h2 className="text-md font-medium">Top 10% ($ME MAFIA)</h2>
              <p className="text-lg font-bold">
                {stakers &&
                  Math.ceil(
                    stakers[Math.ceil(stakers.length * 0.1)].uiStakingPower
                  ) + " Staking Power"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[80%] mx-auto flex flex-col items-center">
        <Table>
          <TableCaption>{`Data updated at: ${new Date(data?.ts as string)
            .toUTCString()
            .replace("GMT", "UTC")}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead className="">Wallet</TableHead>
              <TableHead>Staking Power</TableHead>
              <TableHead>Amount Staked</TableHead>
              <TableHead>Staked At</TableHead>
              <TableHead>Unlocks At</TableHead>
              <TableHead className="">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData &&
              paginatedData.map(
                (
                  staker: {
                    wallet: string;
                    uiStakingPower: number;
                    uiAmount: number;
                    startTs: number;
                    endTs: number;
                  },
                  index: number
                ) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {index + 1 + (currentPage - 1) * itemsPerPage === 1
                          ? "👑"
                          : index + 1 + (currentPage - 1) * itemsPerPage}
                      </TableCell>
                      <TableCell className="">{staker.wallet}</TableCell>
                      <TableCell>{staker.uiStakingPower}</TableCell>
                      <TableCell>{staker.uiAmount}</TableCell>
                      <TableCell className="">
                        {createUtcDate(staker.startTs)}
                      </TableCell>
                      <TableCell className="">
                        {createUtcDate(staker.endTs)}
                      </TableCell>
                      <TableCell className="">
                        {formatTimeDifference(staker.startTs, staker.endTs)}{" "}
                        days
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
          </TableBody>
        </Table>
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isActive={currentPage !== 1}
                size={"default"}
              />
            </PaginationItem>

            {/* Always show first page */}
            <PaginationItem>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(1)}
              >
                1
              </Button>
            </PaginationItem>

            {/* Show Ellipsis if currentPage > 4 (indicating skipped pages) */}
            {currentPage > 4 && <PaginationEllipsis />}

            {/* Generate range of 5 pages centered on currentPage */}
            {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
              .filter((page) => page > 1 && page < totalPages) // Ensure valid range
              .map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}

            {/* Show Ellipsis if there are hidden pages before the last page */}
            {currentPage < totalPages - 3 && <PaginationEllipsis />}

            {/* Always show last page */}
            {totalPages > 1 && (
              <PaginationItem>
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                isActive={currentPage !== totalPages}
                size={"default"}
              />
            </PaginationItem>
          </PaginationContent>
          <Input
            className="ml-4 w-16"
            onChange={handlePageNavigationChange}
            value={goToSite || ""}
            type="number"
          />
          <Button className="ml-4" onClick={handlePageNavigationSubmit}>
            Go to page
          </Button>
        </Pagination>
      </div>
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;
