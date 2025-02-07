import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LINK; // Get API link from env

const CertificateTable = () => {
  const [certificates, setCertificates] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/certificate`)
      .then((res) => res.json())
      .then((data) => setCertificates(data?.data));
  }, []);

  const handleEdit = (id) => {
    console.log("Edit certificate:", id);
    alert(`Editing certificate: ${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete certificate:", id);
    alert(`Deleting certificate: ${id}`);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Container>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Student Certificates
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, minWidth: 1200 }}
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
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates?.map((cert, index) => (
                  <TableRow key={index}>
                    <TableCell>{cert.certificateID}</TableCell>
                    <TableCell>{cert.studentName}</TableCell>
                    <TableCell>{cert.university}</TableCell>
                    <TableCell>{cert.department}</TableCell>
                    <TableCell>{cert.course}</TableCell>
                    <TableCell>{cert.cgpa.toFixed(2)}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
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
                          onClick={() => handleEdit(cert.certificateID)}
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
    </Box>
  );
};

export default CertificateTable;
