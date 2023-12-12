import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useTheme } from "@mui/material/styles";

import {
  Alert,
  Box,
  Button,
  Dialog,
  Avatar,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Snackbar,
  LinearProgress,
  Skeleton,
  OutlinedInput,
  Chip,
  Autocomplete,
} from "@mui/material";
import useClassifications from "../../hooks/useClassifications";
import useGetCareerProfile from "../../hooks/useGetCareerProfile";
import useNationalCertificates from "../../hooks/useNationalCertificates";

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

const AddNationalAchievementModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const { data: classificationsData, isLoading: isLoadingClassification } =
    useClassifications();

  const [nationalAchievement, setNationalAchievement] = useState({
    name: "",
    classification_ids: [],
  });
  const [classificationIds, setClassificationIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setClassificationIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setNationalAchievement((prevProfile) => ({
      ...prevProfile,
      classification_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNationalAchievement((prevProfile) => ({
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
      const response = await axiosPrivate.post(
        `/selections/national-certificates/`,
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("national-certificates");
        queryClient.invalidateQueries("profile-me");

        setMessage("National Certificate Added Successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      nationalAchievement.name == "" ||
      nationalAchievement.issuing_body == "" ||
      !nationalAchievement?.classification_ids ||
      nationalAchievement.classification_ids.length === 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      name: nationalAchievement?.name,
      issuing_body: nationalAchievement?.issuing_body,
      link_reference: nationalAchievement?.link_reference,
      classification_ids: nationalAchievement?.classification_ids,
    };

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error");
      } else if (error.request) {
        setMessage("No response received from the server");
        setSeverity("error");
      } else {
        setMessage("Error: " + error.message);
        setSeverity("error");
      }
    }
    setOpenSnackbar(true);
  };

  const issuingBodies = [
    "Technical Education and Skills Development Authority (TESDA)",
    "Department of Education (DepEd)",
    "Commission on Higher Education (CHED)",
    "Professional Regulation Commission (PRC)",
    "Civil Service Commission (CSC)",
    "Department of Health (DOH)",
    "Philippine National Police (PNP)",
    "Armed Forces of the Philippines (AFP)",
    "Bureau of Philippine Standards (BPS)",
    "National Telecommunications Commission (NTC)",
    "Department of Environment and Natural Resources (DENR)",
    "National Commission for Culture and the Arts (NCCA)",
    "Department of Labor and Employment (DOLE)",
    "Department of Agriculture (DA)",
    "Department of Science and Technology (DOST)",
    "Department of Trade and Industry (DTI)",
    "Securities and Exchange Commission (SEC)",
    "Insurance Commission (IC)",
    "Bangko Sentral ng Pilipinas (BSP)",
    "National Bureau of Investigation (NBI)",
    "Bureau of Internal Revenue (BIR)",
    "Land Transportation Office (LTO)",
    "Maritime Industry Authority (MARINA)",
    "Food and Drug Administration (FDA)",
    "Housing and Land Use Regulatory Board (HLURB)",
    "Energy Regulatory Commission (ERC)",
    "National Privacy Commission (NPC)",
    "National Commission on Indigenous Peoples (NCIP)",
    "Philippine Statistics Authority (PSA)",
    "Philippine Overseas Employment Administration (POEA)",
    "Overseas Workers Welfare Administration (OWWA)",
    "Commission on Audit (COA)",
    "Commission on Elections (COMELEC)",
    "Dangerous Drugs Board (DDB)",
    "Professional Regulation Commission for Accountancy (PRBoA)",
    "Professional Regulation Commission for Architecture (PRBoA)",
    "Professional Regulation Commission for Criminology (PRBoC)",
    "Professional Regulation Commission for Electrical Engineering (PRBoEE)",
    "Professional Regulation Commission for Geology (PRBoG)",
    "Professional Regulation Commission for Mechanical Engineering (PRBoME)",
    "Regulatory Commission for Midwifery (PRCM)",
    "Board of Medicine (BoM)",
    "Board of Nursing (BoN)",
    "Board of Pharmacy (BoP)",
    "Board of Social Work (BoSW)",
    "Board of Real Estate Service (BoRES)",
    "Board of Radiologic Technology (BoRT)",
    "Board of Electronics Engineering (BoEE)",
    "Board of Aeronautical Engineering (BoAE)",
    "Board of Nutrition and Dietetics (BoND)",
    "Board of Fisheries (BoF)",
    "Board of Veterinary Medicine (BoVM)",
    "Board of Accountancy (BoA)",
    "Board of Architecture (BoA)",
    "Board of Chemical Engineering (BoChE)",
    "Board of Chemistry (BoC)",
    "Board of Criminology (BoCrim)",
    "Board of Dentistry (BoD)",
    "Board of Environmental Planning (BoEP)",
    "Board of Interior Design (BoID)",
    "Board of Metallurgical Engineering (BoME)",
    "Board of Mining Engineering (BoMinE)",
    "Board of Sanitary Engineering (BoSE)",
    "Board of Aeronautical Engineering (BoAE)",
    "Board of Agricultural Engineering (BoAgE)",
    "Board of Naval Architecture and Marine Engineering (BoNAME)",
    "Board of Foresters (BoF)",
    "Board of Mechanical Engineering (BoME)",
    "Board of Respiratory Therapy (BoRT)",
    "Board of Guidance and Counseling (BoGC)",
    "Board of Landscape Architecture (BoLA)",
    "Board of Master Plumbers (BoMP)",
    "Board of Medical Technology (BoMT)",
    "Board of Optometry (BoO)",
    "Board of Physical and Occupational Therapy (BoPOT)",
    "Board of Professional Teachers (BoPT)",
    "Board of Psychology (BoP)",
    "Board of Geology (BoG)",
  ];

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  if (isLoadingClassification) {
    return (
      <Dialog open={true}>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent sx={{ width: "40vw" }}>
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
    <Dialog open={open} onClose={onClose}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%", position: "relative", top: 0 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <DialogTitle>Add National Achievement</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name of the National Achievement"
              value={nationalAchievement?.name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="issuing_body"
              options={issuingBodies}
              getOptionLabel={(option) => option}
              getOptionSelected={(option, value) => option === value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Issuing Body"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              onChange={(event, value) =>
                setNationalAchievement((prevProfile) => ({
                  ...prevProfile,
                  issuing_body: value,
                }))
              }
              value={
                issuingBodies?.find(
                  (option) => option === nationalAchievement?.issuing_body
                ) || null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="link_reference"
              label="Link Reference"
              value={nationalAchievement?.link_reference || ""}
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
                {classifications?.map((classification) => (
                  <MenuItem key={classification.id} value={classification.id}>
                    {classification.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNationalAchievementModal;
