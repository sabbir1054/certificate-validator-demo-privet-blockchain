import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LINK; // Get API link from env

const AddCertificateForm = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDataDialog, setOpenDataDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Open & close the form dialog
  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    reset();
  };

  // Open & close the submitted data dialog
  const handleCloseDataDialog = () => {
    setOpenDataDialog(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/certificate/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      setSubmittedData(data); // Save the response data
      setOpenForm(false); // Close the form dialog
      //   setOpenDataDialog(true); // Show success dialog
      Swal.fire({
        title: "Certificate Added",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Something went Wrong",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      {/* Button to open form dialog */}
      <Button variant="contained" color="primary" onClick={handleOpenForm}>
        Add Certificate
      </Button>

      {/* Dialog containing the form */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Add Certificate</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <Controller
              name="certificateID"
              control={control}
              rules={{ required: "Certificate ID is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Certificate ID"
                  error={!!errors.certificateID}
                  helperText={errors.certificateID?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="studentName"
              control={control}
              rules={{ required: "Student Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Student Name"
                  error={!!errors.studentName}
                  helperText={errors.studentName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="university"
              control={control}
              rules={{ required: "University Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="University"
                  error={!!errors.university}
                  helperText={errors.university?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Department" fullWidth />
              )}
            />

            <Controller
              name="course"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Course" fullWidth />
              )}
            />

            <Controller
              name="cgpa"
              control={control}
              rules={{
                required: "CGPA is required",
                pattern: {
                  value: /^[0-4]\.\d{1,2}$/,
                  message: "Enter a valid CGPA (e.g., 3.75)",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CGPA"
                  error={!!errors.cgpa}
                  helperText={errors.cgpa?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="issueDate"
              control={control}
              rules={{ required: "Issue Date is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Issue Date"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.issueDate}
                  helperText={errors.issueDate?.message}
                  fullWidth
                />
              )}
            />

            {/* Buttons inside form */}
            <Box display="flex" justifyContent="space-between">
              <Button onClick={handleCloseForm} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog to show submitted data */}
      <Dialog open={openDataDialog} onClose={handleCloseDataDialog}>
        <DialogTitle>Submitted Certificate Data</DialogTitle>
        <DialogContent>
          {submittedData && (
            <Box sx={{ p: 2 }}>
              <Typography>
                <strong>Certificate ID:</strong> {submittedData.certificateID}
              </Typography>
              <Typography>
                <strong>Student Name:</strong> {submittedData.studentName}
              </Typography>
              <Typography>
                <strong>University:</strong> {submittedData.university}
              </Typography>
              <Typography>
                <strong>Department:</strong> {submittedData.department}
              </Typography>
              <Typography>
                <strong>Course:</strong> {submittedData.course}
              </Typography>
              <Typography>
                <strong>CGPA:</strong> {submittedData.cgpa}
              </Typography>
              <Typography>
                <strong>Issue Date:</strong> {submittedData.issueDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDataDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddCertificateForm;
