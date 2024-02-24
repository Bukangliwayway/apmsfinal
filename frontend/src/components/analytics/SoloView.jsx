import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import SelectCohorts from "./SelectCohorts";
import SalaryTrend from "./SalaryTrend";
import WorkAlignmentLine from "./WorkAlignmentLine";
import OverallPie from "./OverallPie";
import ReactToPrint from "react-to-print";
import { Print, Send } from "@mui/icons-material";
import useAll from "../../hooks/utilities/useAll";

const SoloView = ({ type, dashboard = "Employment" }) => {
  const [selected, setSelected] = useState(type);
  const componentRef = useRef(null);
  const { cohort } = useAll();

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
  const documentTitle =
    dashboard == "Employment"
      ? `${selected} Chart ${cohort[dashboard]?.batch_year} - ${
          cohort[dashboard]?.course_code
        } From ${dayjs(cohort[dashboard]?.start_date).format(
          "MM-DD-YYYY"
        )} to ${dayjs(cohort[dashboard]?.end_date).format("MM-DD-YYYY")}`
      : `${selected} Chart ${cohort[dashboard]?.batch_year} - ${cohort[dashboard]?.course_code} `;

  console.log(documentTitle);
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

      <Grid
        item
        container
        xs={9}
        height={"100%"}
        p={1}
        pl={0.5}
        sx={{ position: "relative" }}
      >
        <Box sx={{ position: "absolute", top: 20, right: 40 }}>
          <ReactToPrint
            trigger={() => {
              return (
                <Button
                  variant="contained"
                  endIcon={<Print />}
                  sx={{ textTransform: "capitalize" }}
                >
                  Generate Report
                </Button>
              );
            }}
            content={() => {
              return componentRef.current;
            }}
            documentTitle={`${type}Report`}
            pageStyle={`
            @page {
              size: A4 landscape; // Set the page size to A4 in landscape orientation
              margin:  0mm; // Remove the default header and footer
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact; // Ensure colors are printed accurately
                }
              }
              `}
          />
        </Box>
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
          ref={componentRef}
          height={pie ? "85%" : "100%"}
        >
          {Render[selected]}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SoloView;
