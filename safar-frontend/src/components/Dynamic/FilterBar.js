"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";

const FilterBar = ({ fields = [], onFilter, onReset }) => {
  const [selectedKey, setSelectedKey] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleFilter = () => {
    if (selectedKey && inputValue) {
      onFilter({ [selectedKey]: inputValue });
    }
  };

  const handleReset = () => {
    setSelectedKey("");
    setInputValue("");
    onReset();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
      p={2}
      bgcolor="#f5f5f5"
      borderRadius={2}
      boxShadow={1}
    >
      {/* Field Selector */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Select Field</InputLabel>
        <Select
          value={selectedKey}
          label="Select Field"
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          {fields.map((field, idx) => (
            <MenuItem key={idx} value={field.key}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Value Input */}
      <TextField
        size="small"
        label="Enter Value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {/* Filter Button */}
      <Button
        variant="contained"
        onClick={handleFilter}
        disabled={!selectedKey || !inputValue}
      >
        Filter
      </Button>

      {/* Reset Button */}
      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
    </Box>
  );
};

export default FilterBar;
