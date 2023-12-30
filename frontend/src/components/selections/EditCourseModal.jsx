import { useMutation, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAll from "../../hooks/utilities/useAll";
import useGetCourseSpecific from "../../hooks/selections/useGetCourseSpecific";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Skeleton,
  OutlinedInput,
  Chip,
  DialogContentText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import useClassifications from "../../hooks/useClassifications";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditCourseModal = ({ open, onClose, courseID }) => {
  const queryClient = useQueryClient();
  const { data: classificationsData, isLoading: isLoadingClassification } =
    useClassifications();

  const [courseProfile, setCourseProfile] = useState({
    name: "",
    classification_ids: [],
  });
  const [classificationIds, setClassificationIds] = useState([]);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const {
    auth,
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();

  const axiosPrivate = useAxiosPrivate();

  const { data: cachedData, isLoading: isLoadingCourse } =
    useGetCourseSpecific(courseID);

  useEffect(() => {
    const classifications =
      cachedData?.data?.classifications?.map(
        (item) => item.classification_id
      ) || [];
    if (cachedData) {
      setClassificationIds(
        // On autofill we get a stringified classifications.
        typeof classifications === "string"
          ? classifications.split(",")
          : classifications
      );
      setCourseProfile({
        name: cachedData?.data?.course?.name || "",
        code: cachedData?.data?.course?.code || "",
        in_pupqc: cachedData?.data?.course?.in_pupqc || false,
        classification_ids:
          cachedData?.data?.classifications?.map(
            (item) => item.classification_id
          ) || [],
      });
    }
  }, [cachedData]);

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setClassificationIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setCourseProfile((prevProfile) => ({
      ...prevProfile,
      classification_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.put(
        `/selections/courses/${courseID}`,
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("courses-all");
        queryClient.invalidateQueries(["course-specific", courseID]);
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("course updated successfully");
        setSeverity("success");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const mutationDelete = useMutation(
    async () => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.delete(`/selections/courses/${courseID}`, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("courses-all");
        queryClient.invalidateQueries(["course-specific", courseID]);
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("Course Deleted Successfully");
        setSeverity("success");
        onClose();
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const { isLoading } = mutation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      courseProfile.name == "" ||
      courseProfile.code == "" ||
      courseProfile.classification_ids.length === 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      name: courseProfile?.name,
      in_pupqc: courseProfile?.in_pupqc,
      code: courseProfile?.code,
      classification_ids: courseProfile?.classification_ids,
    };

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };

  const handleDelete = async () => {
    setLinearLoading(true);
    await mutationDelete.mutateAsync();
  };

  if (isLoadingCourse || isLoadingClassification) {
    return (
      <Dialog open={true} fullWidth>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const classifications = classificationsData?.data;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      {!deletePrompt ? (
        <Box>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} p={2}>
              {auth?.role == "admin" && (
                <Grid item xs={12}>
                  <FormControlLabel
                    required
                    control={
                      <Switch
                        name="in_pupc"
                        value={courseProfile?.in_pupqc}
                        checked={courseProfile?.in_pupqc}
                        onChange={(event) => {
                          const { checked } = event.target;
                          setCourseProfile((prevProfile) => ({
                            ...prevProfile,
                            in_pupqc: checked,
                          }));
                        }}
                      />
                    }
                    label="Course for PUPQC"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Course Name"
                  value={courseProfile?.name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="code"
                  label="Course Code"
                  value={courseProfile?.code}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Related Classifications</InputLabel>
                  <Select
                    multiple
                    value={classificationIds}
                    onChange={handleChangeSelect}
                    input={<OutlinedInput label="Related Classifications" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              classifications.find(
                                (classification) => classification.id === value
                              ).name
                            }
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {classifications.map((classification) => (
                      <MenuItem
                        key={classification.id}
                        value={classification.id}
                      >
                        {classification.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: 3 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Box sx={{ display: "flex", ml: "auto" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                onClick={() => setDeletePrompt(true)}
                variant="contained"
                color="error"
                disabled={isLoading}
              >
                Delete
              </Button>
            </Box>
          </DialogActions>
        </Box>
      ) : (
        <Box>
          <DialogTitle>Delete Achievement</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this achievement?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletePrompt(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={linearLoading}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default EditCourseModal;
