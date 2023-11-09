import { useEffect, useState } from "react";
import {
  PositionsTable,
  PositionRowProps,
} from "../../ui/positions-table/positions-table";
import { getPositions, getPositionsUi } from "../../utils/position";

export function Explore() {
  const POSITIONS_PER_PAGE = 20;
  const [page, setPage] = useState<number>(0);
  const [positions, setPositions] = useState<Array<PositionRowProps>>([]);
  const [positionsTotalSize, setPositionsTotalSize] = useState<number>(0);

  const handlePageChange = (page: number): void => {
    setPositions([]);
    setPage(page);
  };

  useEffect(() => {
    try {
      init();
    } catch (error) {}
  }, [page]);

  async function init() {
    const positions = await getPositions("0");
    //const positions: Array<Position> = await fetch('/assets/json/positions.json').then(response => response.json());
    const positionsOpen = [];
    // for (let index = 0; index < positions.length - 1; index++) {
    //   const position = positions[index];
    //   const positionNext = positions[index+1];
    //   for (let indexIds = position.id; index > positionNext.id - 1; indexIds--) {
    //     console.log(indexIds);
    //   }
    // }
    const positionsUi = await getPositionsUi(
      positions.slice(
        page * POSITIONS_PER_PAGE,
        page * POSITIONS_PER_PAGE + POSITIONS_PER_PAGE
      )
    );
    const positionsTable: Array<PositionRowProps> = positionsUi.map(
      (positionUi) => {
        return {
          id: positionUi.id,
          owner: positionUi.owner,
          inRange: positionUi.inRange,
          token0Symbol: positionUi.token0Symbol,
          token1Symbol: positionUi.token1Symbol,
          fee: positionUi.fee,
          tickSpacing: positionUi.tickSpacing,
          amount: positionUi.totalCurrentAmount,
          pnl: positionUi.totalPnl,
          feeApr: positionUi.feeApr,
          totalApr: positionUi.totalApr,
          durationInDays: positionUi.durationPositionInDays,
        };
      }
    );
    setPositionsTotalSize(positions.length);
    setPositions(positionsTable);
  }

  return (
    <>
      <PositionsTable
        positions={positions}
        positionsPerPage={POSITIONS_PER_PAGE}
        positionsTotalSize={positionsTotalSize}
        onPageChange={handlePageChange}
      ></PositionsTable>
    </>
  );
}

export default Explore;
