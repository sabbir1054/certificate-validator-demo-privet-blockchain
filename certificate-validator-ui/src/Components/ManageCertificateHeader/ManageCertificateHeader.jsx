import { Container, Paper, Typography } from "@mui/material";
import React from "react";

export const ManageCertificateHeader = () => {
  return (
    <div>
      <Container>
        <Paper sx={{ backgroundColor: "white", p: 5, m: 2 }}>
          <Typography variant="h4" textAlign={"center"}>
            Manage Certificates
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};
