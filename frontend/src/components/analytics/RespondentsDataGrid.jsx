import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import { Button, Grid, Skeleton, Typography } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";
import useRespondents from "../../hooks/analytics/useRespondents";
import { useNavigate } from "react-router-dom";

const RespondentsDataGrid = () => {
  const { cohort } = useAll();
  const navigate = useNavigate();
  const { data: respondents, isLoading: isLoadingRespondents } = useRespondents(
    cohort.batch_year,
    cohort.course_code
  );

  if (isLoadingRespondents) {
    return (
      <Box sx={{ height: 525, width: "100%" }}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Skeleton variant="rectangular" height={20} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton variant="rectangular" height={20} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton variant="rectangular" height={20} />
          </Grid>
          <Grid item xs={3}>
            <Skeleton variant="rectangular" height={20} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={50} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!cohort.batch_year || !cohort.course_code) {
    return (
      <Box>
        <Typography variant="h6" p={2}>
          Please select a Batch Year and Course Code first
        </Typography>
      </Box>
    );
  }

  const visitProfileColumn = {
    field: "visit",
    headerName: "Visit Profile",
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="inherit"
        size="small"
        onClick={() => navigate(`/explore/alumni/${params.row.username}`)}
      >
        Visit
      </Button>
    ),
  };

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  if (respondents?.data.length == 0) {
    return (
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography variant="subttile1">There are no data yet...</Typography>
      </Box>
    );
  }

  const columnVisibilityModel = Object.keys(respondents?.data[0]).reduce(
    (acc, key) => {
      acc[key] = true;
      if (key == "id" || key == "username") acc[key] = false;
      return acc;
    },
    {}
  );

  const columns = Object.keys(columnVisibilityModel).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), // Converts 'field_name' to 'Field name'
    width: 150,
    editable: false,
  }));

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, padding: 1 }}>
        <Typography variant="h6">Batch {cohort.batch_year}</Typography>
        <Typography variant="h6" textTransform={"uppercase"}>
          {cohort.course_code}
        </Typography>
      </Box>
      <DataGrid
        rows={respondents?.data}
        columns={[...columns, visitProfileColumn]}
        loading={isLoadingRespondents}
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          columns: {
            columnVisibilityModel,
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            printOptions: { getRowsToExport: getSelectedRowsToExport },
          },
        }}
      />
    </Box>
  );
};

export default RespondentsDataGrid;
