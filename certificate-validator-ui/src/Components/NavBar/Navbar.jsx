import { AppBar, Button, Container, Link, Toolbar } from "@mui/material";
import React from "react";
export const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/all">
            Manage Certificates
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
