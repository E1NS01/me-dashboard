import { ChangeEvent, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { StatsCard } from "./components/StatsCard";
import { ThresholdsCard } from "./components/ThresholdsCard";
import { StakingCharts } from "./components/StakingCharts";
import { useStakingData } from "./hooks/useStakingData";
import { StakingTable } from "./components/StakingTable";
import { TablePagination } from "./components/TablePagination";

const StakingDashboard = () => {
  const {
    stakers,
    data,
    date,
    loading,
    activeStakerRange,
    stakedMERange,
    stakingPowerRange,
  } = useStakingData();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [goToSite, setGoToSite] = useState(1);

  const totalPages = stakers ? Math.ceil(stakers.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = stakers?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageNavigationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const site = parseInt(e.target.value, 10);
    if (!isNaN(site)) {
      setGoToSite(Math.min(Math.max(site, 1), totalPages));
    }
  };

  const handlePageNavigationSubmit = () => {
    if (goToSite && goToSite >= 1 && goToSite <= totalPages) {
      setCurrentPage(goToSite);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StakingCharts
          data={data}
          activeStakerRange={activeStakerRange}
          stakedMERange={stakedMERange}
          stakingPowerRange={stakingPowerRange}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatsCard data={data} />
        <ThresholdsCard stakers={stakers} />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow">
        <StakingTable
          data={paginatedData ? paginatedData : null}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          date={date}
        />
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        goToSite={goToSite}
        onPageNavigationChange={handlePageNavigationChange}
        onPageNavigationSubmit={handlePageNavigationSubmit}
      />

      <SpeedInsights />
      <Analytics />
    </div>
  );
};

export default StakingDashboard;
