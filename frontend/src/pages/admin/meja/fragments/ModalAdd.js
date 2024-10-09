import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Grid,
  Container,
  FormControl,
  Input,
  Select,
  Button,
  Heading,
  FormHelperText,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import AlertNotif from "./../../../../components/alert";
import { addMeja } from "./ApiHandler";

export default function ModalAdd({ isOpen, onClose, reload }) {
  const [isloading, setisloading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitHandler = async (values) => {
    setisloading(true);
    const res = await addMeja(values);
    setMessage(res.message);
    setStatus(res.success);
    if (res.success === true) {
      setTimeout(() => {
        onClose(), reset(), setStatus(""), setMessage(""), reload();
        setisloading(false);
      }, 500);
      return;
    } else {
      setTimeout(() => {
        setisloading(false), setMessage(""), setStatus("");
      }, 1000);
    }
  };
  const handleClose = () => {
    reset();
    onClose();
  };

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
          <Heading fontSize={20}>Add Table</Heading>
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
                    placeholder="Table Number"
                    {...register("nomor_meja", {
                      required: true,
                    })}
                  />
                  {errors.nomor_meja?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Please input the table number
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
                await submitHandler(values);
              })}
              isLoading={isloading}
            >
              Add
            </Button>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
