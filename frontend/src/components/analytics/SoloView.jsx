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

const SoloView = ({ type, dashboard = "Employment" }) => {
  const [selected, setSelected] = useState(type);

  const pieTypes = [
    "Employer Type",
    "Employment Contract",
    "Civil Status",
    "Gender",
    "Response Rate",
    "Employment Status",
  ];

  const pie = pieTypes.includes(type);

  const Render = {
    "Job Classification": <ClassificationEmploymentRate solo={true} />,
    "Salary Trend": <SalaryTrend solo={true} />,
    "Work Alignment": <WorkAlignmentLine solo={true} />,
    "Monthly Income": <OverallPie type={"monthly income"} solo={true} />,
    "Employer Type": <OverallPie type={"employer type"} solo={true} />,
    "Employment Contract": (
      <OverallPie type={"employment contract"} solo={true} />
    ),
    "Employment Status": (
      <OverallPie basis="Profile" type={"employment status"} solo={true} />
    ),
    Gender: <OverallPie basis="Profile" type={"gender"} solo={true} />,
    "Civil Status": (
      <OverallPie basis="Profile" type={"civil status"} solo={true} />
    ),
    "Response Rate": (
      <OverallPie basis="Profile" type={"response rate"} solo={true} />
    ),
  };

  const menuItems =
    dashboard === "Employment"
      ? [
          <MenuItem value="Monthly Income">Monthly Income</MenuItem>,
          <MenuItem value="Employer Type">Employer Type</MenuItem>,
          <MenuItem value="Employment Contract">Employment Contract</MenuItem>,
        ]
      : [
          <MenuItem value="Employment Status">Employment Status</MenuItem>,
          <MenuItem value="Civil Status">Civil Status</MenuItem>,
          <MenuItem value="Gender">Gender</MenuItem>,
          <MenuItem value="Response Rate">Response Rate</MenuItem>,
        ];

  // Select the component based on the type
  return (
    <Grid
      container
      sx={{ display: "flex", flexDirection: "row", height: "93vh" }}
    >
      <Grid item xs={3} p={1} pr={0.5}>
        <Box
          sx={{
            height: "100%",
            backgroundColor: (theme) => theme.palette.common.main,
          }}
        >
          <SelectCohorts type={dashboard} />
        </Box>
      </Grid>

      <Grid item container xs={9} height={"100%"} p={1} pl={0.5}>
        {pie && (
          <Grid item xs={12} height="15%" pb={1}>
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
                  {menuItems}
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
        >
          {Render[selected]}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SoloView;
