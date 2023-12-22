import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { useMutation, useQueryClient, useQuery } from "react-query";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import {
  Alert,
  Button,
  Grid,
  LinearProgress,
  Skeleton,
  Snackbar,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetHistoryAll from "../../hooks/all_profiles/useGetHistory";

const UploadHistoryDataGrid = () => {
  const queryClient = useQueryClient();
  const { data: all, isLoading: isLoadingAll } = useGetHistoryAll();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  if (isLoadingAll) {
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

  const handleSubmit = async (username) => {
    await mutation.mutateAsync(username);
  };

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  const flattenedData = all?.data.map((item) => {
    // Assuming each item is an object, flatten it
    return {
      ...item,
    };
  });

  const columnVisibilityModel = Object.keys(all?.data[0]).reduce((acc, key) => {
    if (key == "type" || key == "updated_at") {
      acc[key] = true;
    } else {
      acc[key] = false;
    }
    return acc;
  }, {});

  const columns = Object.keys(columnVisibilityModel).map((key) => {
    return {
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      width: 170,
      editable: false,
      renderCell: (params) => {
        if (key === "updated_at") {
          // Apply custom formatting for the 'updated_at' field
          return (
            <span>
              {`${new Date(params.value).toLocaleDateString()} ${new Date(
                params.value
              ).toLocaleTimeString()}`}
            </span>
          );
        } else {
          return <span>{params.value}</span>; // Render other fields as-is
        }
      },
    };
  });

  const viewUploadHistory = {
    field: "approve",
    headerName: "Approve Profile",
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          window.open(params.row.link, "_blank");
        }}
      >
        View
      </Button>
    ),
  };

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={flattenedData}
        columns={[...columns, viewUploadHistory]}
        loading={isLoadingAll}
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

export default UploadHistoryDataGrid;
