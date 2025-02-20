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

  const [date, setDate] = useState<string>(Date.now().toString());
  const [data, setData] = useState<
    | {
        id: number;
        timestamp: string;
        staker: number;
        stakingPower: number;
        stakedME: number;
      }[]
    | null
  >(null);

  const [goToSite, setGoToSite] = useState<number>(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  useEffect(() => {
    if (!stakers) return;
    setTotalPages(Math.ceil(stakers.length / itemsPerPage));
    setPaginatedData(stakers.slice(startIndex, startIndex + itemsPerPage));
  }, [stakers, itemsPerPage, startIndex]);

  useEffect(() => {
    const fetchStakingData = async () => {
      const res = await fetch("https://me-stake-backend.onrender.com/staking");
      const apiData = await res.json();

      setDate(apiData[0].timestamp);
      setData(apiData);
    };
    fetchStakingData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(URL);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const stakingData = await res.json();
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

    const intervalId = setInterval(fetchData, 30 * 60000); // Run every 30 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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

  const stakerConfig = {
    stakers: {
      label: "Active Staker",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const stakingConfig = {
    stakedME: {
      label: "Staked $ME",
      color: "#2563eb",
    },
    stakingPower: {
      label: "Staking Power",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div className="justify-center pt-8">
      <div className="w-[90%] mx-auto flex flex-row items-start justify-between gap-4 mb-8">
        {/* Chart Card (Fixed Height) */}
        <Card className="flex flex-col items-center w-[40%] p-4">
          <h1 className="text-lg font-semibold mb-2">Active Staker History</h1>
          <ChartContainer
            config={stakerConfig}
            className="w-full h-[200px] overflow-hidden"
          >
            <LineChart accessibilityLayer data={data ? data : undefined}>
              <XAxis dataKey="timestamp" />
              <YAxis dataKey="staker" />
              <CartesianGrid vertical={false} />
              <Line dataKey="staker" fill="var(--color-staker)" radius={4} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </Card>
        <Card className="flex flex-col items-center w-[40%] p-4">
          <h1 className="text-lg font-semibold mb-2">$ME Staked</h1>
          <ChartContainer
            config={stakingConfig}
            className="w-full h-[200px] overflow-hidden"
          >
            <LineChart accessibilityLayer data={data ? data : undefined}>
              <XAxis dataKey="timestamp" />
              <YAxis
                domain={[10000000, 30000000]}
                tickFormatter={(value) => `${value / 1e6}M`}
              />

              {/* //<YAxis yAxisId="right" orientation="right" /> */}
              <CartesianGrid vertical={false} />
              <Line
                dataKey="stakedME"
                fill="var(--color-stakedMe)"
                radius={4}
                /* yAxisId={"left"} */
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </Card>
        <Card className="flex flex-col items-center w-[40%] p-4">
          <h1 className="text-lg font-semibold mb-2">Staking Power</h1>
          <ChartContainer
            config={stakingConfig}
            className="w-full h-[200px] overflow-hidden"
          >
            <LineChart accessibilityLayer data={data ? data : undefined}>
              <XAxis dataKey="timestamp" />
              <YAxis
                scale={"log"}
                domain={[100000000, 300000000]}
                tickFormatter={(value) => `${value / 1e6}M`}
              />

              {/* //<YAxis yAxisId="right" orientation="right" /> */}
              <CartesianGrid vertical={false} />

              <Line
                dataKey="stakingPower"
                fill="var(--color-stakingPower)"
                radius={4}
                /* yAxisId={"right"} */
              />

              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>
      <div className="w-[70%] mx-auto flex flex-row items-start justify-between gap-4 mb-8">
        {/* Stats Card */}
        <Card className="w-[45%] flex flex-col items-center p-5">
          <h1 className="text-lg font-semibold">Amount Staked:</h1>
          <p className="text-xl font-bold">
            {data ? data[0].stakedME + " $ME" : "loading..."}
          </p>
          <h1 className="text-lg font-semibold mt-2">Total Staking Power:</h1>
          <p className="text-xl font-bold">
            {data ? data[0].stakingPower : "loading..."}
          </p>
          <h1 className="text-lg font-semibold mt-2">Total Stakers:</h1>
          <p className="text-xl font-bold">
            {data ? data[0].staker : "loading..."}
          </p>
        </Card>

        {/* Staking Thresholds Card */}
        <Card className="w-[45%] flex flex-col items-center p-5">
          <h1 className="text-xl font-semibold mb-2">
            Staking Power Thresholds
          </h1>
          <div className="space-y-2 text-center">
            <div>
              <h2 className="text-md font-medium">Top 1%:</h2>
              <p className="text-lg font-bold">
                {stakers
                  ? Math.ceil(
                      stakers[Math.ceil(stakers.length * 0.01)].uiStakingPower
                    ) + " Staking Power"
                  : "loading..."}
              </p>
            </div>
            <div>
              <h2 className="text-md font-medium"> Top 5%</h2>
              <p className="text-lg font-bold">
                {stakers
                  ? Math.ceil(
                      stakers[Math.ceil(stakers.length * 0.05)].uiStakingPower
                    ) + " Staking Power"
                  : "loading..."}
              </p>
            </div>
            <div>
              <h2 className="text-md font-medium">Top 10% ($ME MAFIA)</h2>
              <p className="text-lg font-bold">
                {stakers
                  ? Math.ceil(
                      stakers[Math.ceil(stakers.length * 0.1)].uiStakingPower
                    ) + " Staking Power"
                  : "loading..."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[80%] mx-auto flex flex-col items-center mb-8">
        <Table>
          <TableCaption>{`Data updated at: ${new Date(date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "UTC",
              timeZoneName: "short",
            }
          )}`}</TableCaption>
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
      <div className="flex justify-center">Made by E1NS</div>
    </div>
  );
}

export default App;
