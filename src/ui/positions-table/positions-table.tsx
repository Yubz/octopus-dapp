import { Table, Box, Typography } from "@mui/joy";
import { useState } from "react";
import Pagination from "../pagination/pagination";

export interface PositionsTableProps {
  positions: Array<PositionRowProps>;
  positionsPerPage: number;
  positionsTotalSize: number;
  onPageChange?: (page: number) => void;
}

export interface PositionRowProps {
  id: number;
  owner: string;
  inRange: boolean;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  tickSpacing: number;
  amount: number;
  pnl: number;
  feeApr: number;
  totalApr: number;
  durationInDays: number;
}

export function PositionsTable(positionsTableProps: PositionsTableProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const minimizeAddress = (address: string): string => {
    return address.substring(0, 5) + "..." + address.slice(-4);
  };

  const handlePageChange = (page: number) => {
    positionsTableProps.onPageChange && positionsTableProps.onPageChange(page);
  };

  return (
    <Table
      hoverRow
      variant="soft"
      sx={{
        borderRadius: "8px",
        "& tr > *:not(:first-of-type)": { textAlign: "right" },
      }}
    >
      <thead>
        <tr>
          <th style={{ verticalAlign: "middle" }}>Pool</th>
          <th style={{ verticalAlign: "middle" }}>NFT_ID / Owner</th>
          <th style={{ verticalAlign: "middle" }}>PNL</th>
          <th style={{ verticalAlign: "middle" }}>APR</th>
          <th style={{ verticalAlign: "middle" }}>Fee APR</th>
          <th style={{ verticalAlign: "middle" }}>Value</th>
          <th style={{ verticalAlign: "middle" }}>Age</th>
        </tr>
      </thead>
      <tbody>
        {positionsTableProps.positions.map((position) => (
          <tr>
            <td>
              <Typography fontWeight="lg">
                {position.token0Symbol}/{position.token1Symbol}
              </Typography>
              <Typography level="body-xs" fontWeight="lg">
                {position.fee * 100}% - {position.tickSpacing * 100}%
              </Typography>
            </td>
            <td>
              <Typography fontWeight="lg">{position.id}</Typography>
              <Typography level="body-xs" fontWeight="lg">
                {minimizeAddress(position.owner)}
              </Typography>
            </td>
            <td>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(position.pnl)}
            </td>
            <td>{(position.totalApr * 100).toFixed(2)}%</td>
            <td>{(position.feeApr * 100).toFixed(2)}%</td>
            <td>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(position.amount)}
            </td>
            <td>
              <Typography level="body-xs" fontWeight="lg">
                {position.durationInDays.toFixed(2)} days
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td
            colSpan={7}
            style={{
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Pagination
                  currentPage={currentPage}
                  totalItems={positionsTableProps.positionsTotalSize}
                  itemsPerPage={positionsTableProps.positionsPerPage}
                  onPageChange={handlePageChange}
                />
              </Box>
            </Box>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default PositionsTable;
