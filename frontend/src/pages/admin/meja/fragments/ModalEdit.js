import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Grid,
  Container,
  FormControl,
  Input,
  Button,
  Heading,
  FormHelperText,
  Box,
  Flex,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { getMejaByID, updateMeja } from "./ApiHandler";
import AlertNotif from "../../../../components/alert";

export default function ModalEdit({ isOpen, onClose, payload, reload }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [meja, setMeja] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const SubmitHandler = async(values) => {
    setIsLoading(true);
    let value = {};
    if (meja.nomor_meja !== values?.nomor_meja) {
      value.nomor_meja = values?.nomor_meja;
    }
    if (meja.status !== values?.status) {
      value.status = values?.status;
    }
    const res = await updateMeja({ values: value, id: payload });
    setMessage(res.message);
    setStatus(res.status);
    if (res.status === "success") {
      setTimeout(() => {
        onClose(), reset(), setStatus(""), setMessage(""), reload();
        setIsLoading(false);
      }, 500);
      return;
    }
    else {
      setTimeout(() => {
        setIsLoading(false), setMessage(""), setStatus("");
      }, 1000);
    }
  }
  const handleClose = () => {
    reset();
    onClose();
  };
  useEffect(() => {
    if (meja) {
      reset({
        nomor_meja: meja.nomor_meja,
        status: meja.status,
      });
    }
  }, [meja]);
  useEffect(() => {
    const getMeja = async () => {
      const res = await getMejaById(payload);
      setMeja(res.data);
    };
    getMeja();
  }, [payload]);

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      blockScrollOnMount={false}
      motionPreset="scale"
      size={{ base: "sm", md: "xl" }}
    >
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalBody p={8}>
          <Heading fontSize={20}>Edit Table</Heading>
          <Box mt={4}>
            <AlertNotification status={status} message={message} />
          </Box>
          <FormControl method="POST">
            <Container gridTemplateRows="repeat(2,1fr)" p={0} my={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={5} my={3}>
                <Flex direction="column">
                  <Input
                    name="nomor_meja"
                    id="nomor_meja"
                    borderRadius="lg"
                    focusBorderColor="green.600"
                    placeholder="Name"
                    {...register("nomor_meja", {
                      required: true,
                    })}
                  />
                  {errors.nomor_meja?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Input table number
                    </FormHelperText>
                  )}
                </Flex>
                <Flex direction="column">
                  <Select
                    name="status"
                    id="status"
                    borderRadius="lg"
                    focusBorderColor="green.600"
                    placeholder="Status"
                    {...register("status", {
                      required: true,
                    })}
                  >
                    <option value="kosong">Empty</option>
                    <option value="terisi">In use</option>
                  </Select>
                  {errors.status?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Input status
                    </FormHelperText>
                  )}
                </Flex>
              </Grid>
            </Container>
            <Button
              variant="outline"
              colorScheme={"green"}
              fontWeight={500}
              px={6}
              borderRadius="lg"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              ml={4}
              px={6}
              colorScheme={"green"}
              borderRadius="lg"
              fontWeight={500}
              onClick={handleSubmit(async (values) => {
                await SubmitHandler(values);
              })}
              isLoading={isLoading}
            >
              Edit
            </Button>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
