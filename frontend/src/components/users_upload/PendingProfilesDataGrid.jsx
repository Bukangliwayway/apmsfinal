import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { useMutation, useQueryClient } from "react-query";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAll from "../../hooks/all_profiles/useGetAll";
import {
  Button,
  Grid,
  Skeleton,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAll from "../../hooks/utilities/useAll";

const PendingProfilesDataGrid = () => {
  const queryClient = useQueryClient();
  const { data: all, isLoading: isLoadingAll } = useGetAll();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

  const mutation = useMutation(
    async (username) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axiosPrivate.put(`/profiles/approve/${username}`, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("all");
        queryClient.invalidateQueries("profile-me");

        setMessage("User Approved Successfully");
        setSeverity("success");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
        onClose();
      },
    }
  );

  const { isLoading } = mutation;

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
    setLinearLoading(true);
    await mutation.mutateAsync(username);
  };

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  const columnVisibilityModel = Object.keys(all?.data[0]).reduce((acc, key) => {
    if (key == "first_name" || key == "last_name" || key == "student_number") {
      acc[key] = true;
    } else {
      acc[key] = false;
    }
    return acc;
  }, {});

  const columns = Object.keys(columnVisibilityModel).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), // Converts 'field_name' to 'Field name'
    width: 150,
    editable: false,
  }));

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

  const approveProfileColumn = {
    field: "approve",
    headerName: "Approve Profile",
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => handleSubmit(params.row.username)}
      >
        Approve
      </Button>
    ),
  };

  const uniquePublicUsers = Array.from(
    new Set(
      all?.data
        .filter((user) => user.role == "public")
        .map((user) => user.student_number)
    )
  ).map((studentNumber) =>
    all?.data
      .filter((user) => user.role == "public")
      .find((user) => user.student_number === studentNumber)
  );

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={uniquePublicUsers}
        columns={[...columns, approveProfileColumn, visitProfileColumn]}
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

export default PendingProfilesDataGrid;
