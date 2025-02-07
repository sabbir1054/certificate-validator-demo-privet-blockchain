import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LINK;

const CertificateTable = () => {
  const [loading, setIsloading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [editedData, setEditedData] = useState({
    studentName: "",
    cgpa: "",
  });

  const handleEdit = (cert) => {
    setSelectedCert(cert);
    setEditedData({
      id: cert.certificateID,
      studentName: cert.studentName,
      cgpa: cert.cgpa,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCert(null);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // const updatedCertificates = certificates.map((cert) =>
    //   cert.certificateID === selectedCert.certificateID
    //     ? {
    //         ...cert,
    //         studentName: editedData.studentName,
    //         cgpa: editedData.cgpa,
    //       }
    //     : cert
    // );
    // setCertificates(updatedCertificates);
    setOpen(false);

    // You can send an API request here to update the data in the backend
    fetch(`${API_BASE_URL}/certificate/update/${selectedCert.certificateID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.statusCode === 200) {
          Swal.fire({
            title: "Certificate updated",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/certificate/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data?.statusCode === 200) {
          Swal.fire({
            title: "Certificate delete",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setIsloading(true);
        } else {
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };
  useEffect(() => {
    fetch(`${API_BASE_URL}/certificate`)
      .then((res) => res.json())
      .then((data) => {
        setCertificates(data?.data);
        setIsloading(false);
      });
  }, [handleSave, handleDelete]);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ p: 3 }}>
      <Container>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Student Certificates
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, minWidth: 1300 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    <b>Certificate ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Student Name</b>
                  </TableCell>
                  <TableCell>
                    <b>University</b>
                  </TableCell>
                  <TableCell>
                    <b>Department</b>
                  </TableCell>
                  <TableCell>
                    <b>Course</b>
                  </TableCell>
                  <TableCell>
                    <b>CGPA</b>
                  </TableCell>
                  <TableCell>
                    <b>Issue Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates?.map((cert) => (
                  <TableRow key={cert.certificateID}>
                    <TableCell>{cert.certificateID}</TableCell>
                    <TableCell>{cert.studentName}</TableCell>
                    <TableCell>{cert.university}</TableCell>
                    <TableCell>{cert.department}</TableCell>
                    <TableCell>{cert.course}</TableCell>
                    <TableCell>{cert.cgpa.toFixed(2)}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
                    <TableCell>{cert.status}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <Link to={`/certificate/${cert.certificateID}`}>
                          <IconButton color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(cert)}
                          color="warning"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(cert.certificateID)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Certificate</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Student Name"
            name="studentName"
            fullWidth
            variant="outlined"
            value={editedData.studentName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="CGPA"
            name="cgpa"
            fullWidth
            variant="outlined"
            type="number"
            inputProps={{ step: "0.01", min: "0", max: "4" }}
            value={editedData.cgpa}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateTable;
