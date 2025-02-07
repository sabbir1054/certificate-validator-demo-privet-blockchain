import { AppBar, Button, Container, Toolbar } from "@mui/material";
import { Link } from "react-router";
import React from "react";
export const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/manageCertificate">
            Manage Certificates
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
