"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { TableVirtuoso } from "react-virtuoso";

// MUI + Virtuoso Components
const getVirtuosoComponents = () => ({
  Scroller: React.forwardRef(function ScrollerComponent(props, ref) {
    return <TableContainer component={Paper} {...props} ref={ref} />;
  }),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef(function HeadComponent(props, ref) {
    return <TableHead {...props} ref={ref} />;
  }),
  TableRow: TableRow,
  TableBody: React.forwardRef(function BodyComponent(props, ref) {
    return <TableBody {...props} ref={ref} />;
  }),
});

// Main Component
export default function DynamicVirtualizedTable({
  headers,
  data,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  onView,
}) {
  const [sortConfig, setSortConfig] = React.useState({
    field: null,
    direction: "asc",
  });

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.field) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.field];
      const valB = b[sortConfig.field];

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const fixedHeaderContent = () => (
    <TableRow>
      {headers.map((column) => {
        const isActive = sortConfig.field === column.field;
        const direction = sortConfig.direction;

        return (
          <TableCell
            key={column.field}
            variant="head"
            align={column.numeric ? "right" : "left"}
            style={{ width: column.width || "auto", cursor: "pointer" }}
            sx={{ backgroundColor: "#e5e7eb", fontWeight: "600" }}
            onClick={() => handleSortChange(column.field)}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              {column.label}
              {isActive &&
                (direction === "asc" ? (
                  <ArrowDropUp fontSize="small" />
                ) : (
                  <ArrowDropDown fontSize="small" />
                ))}
            </Box>
          </TableCell>
        );
      })}
    </TableRow>
  );

const rowContent = (_index, row) => (
  <>
    {headers.map((column, colIndex) => {
      const isFirstColumn = colIndex === 0;
      return (
        <TableCell
          key={column.field}
          align={column.numeric ? "right" : "left"}
          sx={{
            position: "relative",
            transition: "height 0.3s",
            height: "auto", // allow height to grow with buttons
            py: 1.5,
          }}
        >
          {isFirstColumn ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Typography>{row[column.field]}</Typography>
              <Box display="flex" gap={1}>
                <Button size="small" variant="outlined" onClick={() => onEdit(row)}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" onClick={() => onView(row)}>
                  View
                </Button>
                <Button size="small" color="error" variant="outlined" onClick={() => console.log("Delete", row)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>{row[column.field]}</Typography>
          )}
        </TableCell>
      );
    })}
  </>
);


  return (
    <Box>
      <Paper sx={{ height: 400, width: "100%" }}>
        <TableVirtuoso
          data={sortedData}
          components={getVirtuosoComponents()}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography variant="body2">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
