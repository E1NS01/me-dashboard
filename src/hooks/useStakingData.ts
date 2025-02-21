import { Staker, StakingData } from "@/types/staking";
import { useEffect, useState } from "react";

const URL =
  "api/api/trpc/staking.getStakerSnapshot?input=%7B%22json%22%3A%7B%20%22token%22%3A%20%22MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u%22,%20%22ns%22%3A%20%22acAvyneD7adS3yrXUp41c1AuoYoYRhnjeAWH9stbdTf%22%7D%7D";

export const useStakingData = () => {
  const [stakers, setStakers] = useState<Staker[] | null>(null);
  const [data, setData] = useState<StakingData[] | null>(null);
  const [date, setDate] = useState<string>(Date.now().toString());
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStakerRange, setActiveStakerRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [stakedMERange, setStakedMERange] = useState<[number, number]>([0, 0]);
  const [stakingPowerRange, setStakingPowerRange] = useState<[number, number]>([
    0, 0,
  ]);

  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        const [stakingRes, dataRes] = await Promise.all([
          fetch(URL),
          fetch(
            "https://existing-linn-me-dashboard-94f01c3a.koyeb.app/staking"
          ),
        ]);
        const stakingData = await stakingRes.json();
        const apiData = await dataRes.json();

        setStakers(
          stakingData.result.data.json.stakers.filter(
            (staker: { uiStakingPower: number }) => staker.uiStakingPower !== 0
          )
        );
        setData(apiData);
        setDate(apiData[apiData.length - 1].timestamp);
        setLoading(false);
        if (apiData.length > 0) {
          calculateRanges(apiData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchStakingData();

    const intervalId = setInterval(fetchStakingData, 30 * 60000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateRanges = (
    apiData: { staker: number; stakedME: number; stakingPower: number }[]
  ) => {
    const minMaxValues = {
      staker: {
        min: Math.floor(Math.min(...apiData.map((d) => d.staker)) * 0.9),
        max: Math.floor(Math.max(...apiData.map((d) => d.staker)) * 1.1),
      },
      stakedME: {
        min: Math.floor(Math.min(...apiData.map((d) => d.stakedME)) * 0.9),
        max: Math.floor(Math.max(...apiData.map((d) => d.stakedME)) * 1.1),
      },
      stakingPower: {
        min: Math.floor(Math.min(...apiData.map((d) => d.stakingPower)) * 0.9),
        max: Math.floor(Math.max(...apiData.map((d) => d.stakingPower)) * 1.1),
      },
    };

    setActiveStakerRange([minMaxValues.staker.min, minMaxValues.staker.max]);
    setStakingPowerRange([
      minMaxValues.stakingPower.min,
      minMaxValues.stakingPower.max,
    ]);
    setStakedMERange([minMaxValues.stakedME.min, minMaxValues.stakedME.max]);
  };

  return {
    stakers,
    data,
    date,
    loading,
    activeStakerRange,
    stakedMERange,
    stakingPowerRange,
  };
};
