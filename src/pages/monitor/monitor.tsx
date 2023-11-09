import { Search } from "@mui/icons-material";
import { Input } from "@mui/joy";
import { useEffect, useState } from "react";
import PositionCard, {
  PositionCardProps,
} from "../../ui/position-card/position-card";
import { getPositions, getPositionsUi } from "../../utils/position";

export function Monitor() {
  const [positionsCard, setPositionsCard] = useState<Array<PositionCardProps>>(
    []
  );
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    setPositionsCard([]);
    setAddress(address);
    if (address && address.length > 0) {
      fetch();
    }
  }, [address]);

  async function fetch() {
    const positions = await getPositions(address);
    const positionsUi = await getPositionsUi(positions);
    setPositionsCard(
      positionsUi.map((positionUi) => {
        return {
          id: positionUi.id,
          token0Symbol: positionUi.token0Symbol,
          token1Symbol: positionUi.token1Symbol,
          token0Price: positionUi.token0Price,
          token1Price: positionUi.token1Price,
          fee: positionUi.fee,
          tickSpacing: positionUi.tickSpacing,
          minPrice: positionUi.minPrice,
          maxPrice: positionUi.maxPrice,
          currentPrice: positionUi.currentPrice,
          fees0: positionUi.fees0,
          fees1: positionUi.fees1,
          amount0: positionUi.amount0,
          amount1: positionUi.amount1,
          initialAmount0: positionUi.initialAmount0,
          initialAmount1: positionUi.initialAmount1,
          mintTimestamp: positionUi.mintTimestamp,
          inRange: positionUi.inRange,
          amount: positionUi.totalCurrentAmount,
          totalPnl: positionUi.totalPnl,
          totalApr: positionUi.totalApr,
          feeApr: positionUi.feeApr,
          durationPositionInDays: positionUi.durationPositionInDays,
        };
      })
    );
  }

  return (
    <>
      <div className="search-address">
        <Input
          placeholder="Search address…"
          variant="soft"
          sx={{ "--Input-focusedThickness": 0 }}
          startDecorator={<Search />}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <div className="positions">
        {(() => {
          const arr = [];
          for (let i = 0; i < positionsCard.length; i++) {
            const positionCard = positionsCard[i];
            arr.push(
              <div className="position-card" key={positionCard.id}>
                <PositionCard
                  id={positionCard.id}
                  currentPrice={positionCard.currentPrice}
                  token0Symbol={positionCard.token0Symbol}
                  token1Symbol={positionCard.token1Symbol}
                  token0Price={positionCard.token0Price}
                  token1Price={positionCard.token1Price}
                  minPrice={positionCard.minPrice}
                  maxPrice={positionCard.maxPrice}
                  fee={positionCard.fee}
                  tickSpacing={positionCard.tickSpacing}
                  fees0={positionCard.fees0}
                  fees1={positionCard.fees1}
                  amount0={positionCard.amount0}
                  amount1={positionCard.amount1}
                  initialAmount0={positionCard.initialAmount0}
                  initialAmount1={positionCard.initialAmount1}
                  mintTimestamp={positionCard.mintTimestamp}
                  amount={positionCard.amount}
                  durationPositionInDays={positionCard.durationPositionInDays}
                  feeApr={positionCard.feeApr}
                  inRange={positionCard.inRange}
                  totalApr={positionCard.totalApr}
                  totalPnl={positionCard.totalPnl}
                />
              </div>
            );
          }
          return arr;
        })()}
      </div>
    </>
  );
}

export default Monitor;
