import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import logo from "../assets/logo.png";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
  border: "1px solid #d5dae2",
  color: "#6d6d6d",
  marginLeft: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "42ch",
      },
    },
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const handlePress = (e) => {
    if (e.key === "Enter") {
      navigate("/account/" + e.target.value);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Link to="/">
              <img
                src={logo}
                style={{ height: "3rem", padding: "1rem 0rem 1rem 0rem" }}
              ></img>
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search address…"
                inputProps={{ "aria-label": "search" }}
                onKeyUp={handlePress}
              />
            </Search>
            <a href="http://127.0.0.1:5501" target="_blank">
              <Button
                variant="outlined"
                sx={{ height: "41px", marginLeft: "5px" }}
              >
                Use the App
              </Button>
            </a>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
