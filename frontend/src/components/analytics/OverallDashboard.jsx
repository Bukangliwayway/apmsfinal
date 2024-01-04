import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import OverallPie from "./OverallPie";

const OverallDashboard = () => {
  const [selected, setSelected] = useState("response rate");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  return (
    <Box p={4}>
      <FormControl sx={{ width: "25ch" }}>
        <InputLabel>Overall Type</InputLabel>
        <Select value={selected} onChange={handleChange} label="Overall Type">
          <MenuItem value="response rate">Response Rate</MenuItem>
          <MenuItem value="employment status">Employment Status</MenuItem>
          <MenuItem value="gender">Gender</MenuItem>
          <MenuItem value="civil status">Civil Status</MenuItem>
          <MenuItem value="monthly income">Monthly Income</MenuItem>
          <MenuItem value="employer type">Employer Type</MenuItem>
          <MenuItem value="employment contract">Employment Contract</MenuItem>
        </Select>
      </FormControl>
      <Box height={"30rem"} p={5}>
        <OverallPie solo={true} type={selected} />
      </Box>
    </Box>
  );
};

export default OverallDashboard;
