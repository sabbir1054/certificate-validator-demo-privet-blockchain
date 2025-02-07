import { Container, Paper, Typography } from "@mui/material";
import React from "react";

export const Header = () => {
  return (
    <div>
      <Container>
        <Paper sx={{ backgroundColor: "white", p: 5, m: 2 }}>
          <Typography variant="h3" textAlign={"center"}>
            Certificate Validator
          </Typography>
          <Typography variant="subtitle2" textAlign={"center"}>
            Using Enterprise BlockChain (Hyperledger Fabric)
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};
