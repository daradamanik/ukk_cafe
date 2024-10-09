import {
  Box,
  Flex,
  Heading,
  IconButton,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { FaUserAlt, FaNewspaper } from "react-icons/fa";
import { MdDining, MdDinnerDining } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { X, AlignCenter } from "react-feather";
import Item from "./fragments/Item";
import Logout from "./fragments/Logout";
import { getLocalStorage } from "../../utils/helper/localStorage";
import { LOCAL_STORAGE_USER } from "../../utils/helper/helper";

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const datauser = getLocalStorage(LOCAL_STORAGE_USER);

  return (
    <Box
      w={{ base: "full", md: "15rem" }}
      h={{ base: "auto", md: "full" }}
      bgColor={"white"}
      px={{ base: 4, md: 0 }}
      py={2}
      zIndex={10}
      boxShadow={"2px 0px 20px 2px rgba(0, 0, 0, 0.1)"}
      position={"fixed"}
    >
      <Flex h={16} alignItems={"center"} flexDir={"column"}>
        <Flex
          justifyContent={{
            base: "flex-end",
            md: "space-between",
          }}
          w={"full"}
          my="auto"
          justifyItems={"center"}
          alignItems={"center"}
          mt={{ base: 4, md: 4 }}
          position={"relative"}
        >
          <Box display={{ base: "none", md: "block" }}></Box>
          <Heading
            mx={"auto"}
            color={"green.600"}
            fontSize={"xl"}
            display={"block"}
            fontFamily={"Poppins"}
          >
            APALA COFFEE
          </Heading>
          <IconButton
            size={"md"}
            p={2}
            my="auto"
            icon={isOpen ? <X /> : <AlignCenter />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            right={{ base: 6, md: 10 }}
            position={"absolute"}
          />
        </Flex>
        <VStack
          mt={{ base: 4, md: 4 }}
          alignItems={"center"}
          display={{ base: "none", md: "flex" }}
        >
          <Stack w={"full"}>
            <Box w={"full"}>
              {datauser.role === "admin" && (
                <>
                  <NavItem
                    link={"/dashboard/admin/"}
                    label={"Dashboard"}
                    icon={BsFillGrid1X2Fill}
                  />
                  <NavItem
                    link={"/dashboard/admin/menu"}
                    label={"Menu"}
                    icon={MdDinnerDining}
                  />
                  <NavItem
                    link={"/dashboard/admin/meja"}
                    label={"Table"}
                    icon={MdDining}
                  />
                  <NavItem
                    link={"/dashboard/admin/user"}
                    label={"User"}
                    icon={FaUserAlt}
                  />
                </>
              )}
              {datauser.role === "manajer" && (
                <>
                  <NavItem
                    link={"/dashboard/manajer/"}
                    label={"Dashboard"}
                    icon={BsFillGrid1X2Fill}
                  />
                  <NavItem
                    link={"/dashboard/manajer/transaksi"}
                    label={"Transaction"}
                    icon={FaNewspaper}
                  />
                  <NavItem
                    link={"/dashboard/manajer/menu"}
                    label={"Menu"}
                    icon={MdDinnerDining}
                  />
                  <NavItem
                    link={"/dashboard/manajer/laporan"}
                    label={"Report"}
                    icon={HiOutlineDocumentReport}
                  />
                </>
              )}
              {datauser.role === "kasir" && (
                <>
                  <NavItem
                    link={"/dashboard/kasir/"}
                    label={"Dashboard"}
                    icon={BsFillGrid1X2Fill}
                  />
                  <NavItem
                    link={"/dashboard/kasir/transaksi"}
                    label={"Transaction"}
                    icon={FaNewspaper}
                  />
                </>
              )}
              <Logout />
            </Box>
          </Stack>
        </VStack>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={[4]}>
            {datauser.role === "admin" && (
              <>
                <NavItem
                  link={"/dashboard/admin/"}
                  label={"Dashboard"}
                  icon={BsFillGrid1X2Fill}
                />
                <NavItem
                  link={"/dashboard/admin/menu"}
                  label={"Menu"}
                  icon={MdDinnerDining}
                />
                <NavItem
                  link={"/dashboard/admin/meja"}
                  label={"Table"}
                  icon={MdDining}
                />
                <NavItem
                  link={"/dashboard/admin/user"}
                  label={"User"}
                  icon={FaUserAlt}
                />
              </>
            )}
            {datauser.role === "manajer" && (
              <>
                <NavItem
                  link={"/dashboard/manajer/"}
                  label={"Dashboard"}
                  icon={BsFillGrid1X2Fill}
                />
                <NavItem
                  link={"/dashboard/manajer/transaksi"}
                  label={"Transaction"}
                  icon={FaNewspaper}
                />
                <NavItem
                  link={"/dashboard/manajer/menu"}
                  label={"Menu"}
                  icon={MdDinnerDining}
                />
                <NavItem
                  link={"/dashboard/manajer/laporan"}
                  label={"Report"}
                  icon={HiOutlineDocumentReport}
                />
              </>
            )}
            {datauser.role === "kasir" && (
              <>
                <NavItem
                  link={"/dashboard/kasir/"}
                  label={"Dashboard"}
                  icon={BsFillGrid1X2Fill}
                />
                <NavItem
                  link={"/dashboard/kasir/transaksi"}
                  label={"Transaction"}
                  icon={FaNewspaper}
                />
              </>
            )}
            <Logout />
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
