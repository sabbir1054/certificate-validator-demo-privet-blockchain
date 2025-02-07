import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LINK; // Get API link from env

// Sample Certificate Data
// const certificates = [
//   {
//     certificateID: "2023-CERT-0085",
//     studentName: "SHAKIL DOE",
//     university: "Stanford University",
//     department: "Computer Science",
//     course: "Computer Science Engineering",
//     cgpa: 3.9,
//     issueDate: "15-02-2024",
//   },
//   {
//     certificateID: "2023-CERT-0090",
//     studentName: "JANE SMITH",
//     university: "Harvard University",
//     department: "Data Science",
//     course: "AI & Machine Learning",
//     cgpa: 4.0,
//     issueDate: "20-03-2024",
//   },
//   {
//     certificateID: "2023-CERT-0102",
//     studentName: "JOHN DOE",
//     university: "MIT",
//     department: "Software Engineering",
//     course: "Full Stack Development",
//     cgpa: 3.8,
//     issueDate: "10-01-2024",
//   },
// ];

const CertificateTable = () => {
  const [certificates, setCertificates] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/certificate`)
      .then((res) => res.json())
      .then((data) => setCertificates(data?.data));
  }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Container>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Student Certificates
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default CertificateTable;
