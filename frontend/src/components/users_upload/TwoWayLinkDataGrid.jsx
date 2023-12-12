import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAllUnclaimed from "../../hooks/all_profiles/useGetAllUnclaimedProfiles";
import { Grid, Skeleton, Typography } from "@mui/material";

const TwoWayLinkDataGrid = () => {
  const { data: unclaimed, isLoading: isLoadingUnclaimed } =
    useGetAllUnclaimed();

  if (isLoadingUnclaimed) {
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

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  if (unclaimed?.data.length == 0) {
    return (
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography variant="subttile1">There are no data yet...</Typography>
      </Box>
    );
  }

  const columnVisibilityModel = Object.keys(unclaimed?.data[0]).reduce(
    (acc, key) => {
      acc[key] = true;
      if (key == "id") acc[key] = false;
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
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={unclaimed?.data}
        columns={columns}
        loading={isLoadingUnclaimed}
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
          columns: {
            columnVisibilityModel,
          },
        }}
        pageSizeOptions={[25]}
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

export default TwoWayLinkDataGrid;
