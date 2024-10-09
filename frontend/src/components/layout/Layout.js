import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import Sidebar from "../sidebar";

export default function Layout() {
    return (
        <Box w={"100vw"} maxW="100%" bgColor={"white"}>
          <Grid
            templateColumns={{ md: "15rem auto" }}
            minH={"100vh"}
            bgColor={"white"}
          >
            <GridItem position={"relative"}>
              <Sidebar />
            </GridItem>
            <GridItem>
              <Outlet /> 
            </GridItem>
          </Grid>
        </Box>
    );
}