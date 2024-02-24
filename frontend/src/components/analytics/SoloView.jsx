import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import SelectCohorts from "./SelectCohorts";
import SalaryTrend from "./SalaryTrend";
import WorkAlignmentLine from "./WorkAlignmentLine";
import OverallPie from "./OverallPie";

const SoloView = ({ type }) => {
  const [selected, setSelected] = useState(type);
  const pie = type == "Employer Type" || type == "Employment Contract";
  const Render = {
    "Job Classification": <ClassificationEmploymentRate solo={true} />,
    "Salary Trend": <SalaryTrend solo={true} />,
    "Work Alignment": <WorkAlignmentLine solo={true} />,
    "Monthly Income": <OverallPie type={"monthly income"} solo={true} />,
    "Employer Type": <OverallPie type={"employer type"} solo={true} />,
    "Employment Contract": (
      <OverallPie type={"employment contract"} solo={true} />
    ),
  };

  // Select the component based on the type
  return (
    <Grid
      container
      sx={{ display: "flex", flexDirection: "row", height: "92vh" }}
      px={1}
    >
      <Grid
        item
        xs={3}
        height="100%"
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
        px={3}
      >
        <SelectCohorts type={"EmploymentRate"} />
      </Grid>

      <Grid item container xs={9} height={"100%"} p={1} pb={0}>
        {pie && (
          <Grid item xs={12} height="15%" p={1} pl={0} pt={0} pr={0}>
            <Box
              height={"100%"}
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                display: "flex",
                alignItems: "center",
                px: "4rem",
              }}
            >
              <FormControl sx={{ width: "25ch" }}>
                <InputLabel>Overall Type</InputLabel>
                <Select
                  value={selected}
                  onChange={(event) => {
                    setSelected(event.target.value);
                  }}
                  label="Overall Type"
                >
                  <MenuItem value="Monthly Income">Monthly Income</MenuItem>
                  <MenuItem value="Employer Type">Employer Type</MenuItem>
                  <MenuItem value="Employment Contract">
                    Employment Contract
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sx={{ backgroundColor: (theme) => theme.palette.common.main }}
          height={pie ? "85%" : "100%"}
          pt={3}
        >
          {Render[selected]}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SoloView;
