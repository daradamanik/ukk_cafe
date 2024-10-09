import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Grid,
  GridItem,
  Container,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Select,
  Button,
  Heading,
  FormHelperText,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { addMenu } from "../../../../../../backend/controllers/menuController";
import AlertNotif from "../../../../components/alert";

export default function ModalAdd({ isOpen, onClose, reload }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const submitHandler = async (values) => {
    setIsLoading(true);
    let form = new FormData();
    form.append("nama_menu", values.nama_menu);
    form.append("jenis", values.jenis);
    form.append("harga", values.harga.replace(/\./g, ""));
    form.append("deskripsi", values.deskripsi);
    form.append("gambar", values.gambar[0]);

    if (
      values.foto[0].type !== "image/jpeg" &&
      values.foto[0].type !== "image/png" &&
      values.foto[0].type !== "image/jpg" &&
      values.foto[0].type !== "image/webp"
    ) {
      setMessage("File harus berupa gambar");
      setStatus("error");
      setTimeout(() => {
        setIsLoading(false), setMessage(""), setStatus("");
      }, 1000);
      return;
    }
    const res = await addMenu(form);
    setMessage(res.message);
    setStatus(res.status);

    if (res.success === true) {
      setTimeout(() => {
        onClose(), reset(), setStatus(""), setMessage(""), reload();
        setIsLoading(false);
      }, 500);
      return;
    } else {
      setTimeout(() => {
        setIsLoading(false), setMessage(""), setStatus("");
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
          <Heading fontSize={20}>Add Menu</Heading>
          <Box mt={4}>
            <AlertNotification status={status} message={message} />
          </Box>
          <FormControl method="POST">
            <Container gridTemplateRows="repeat(2,1fr)" p={0} my={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={5} my={3}>
                <Flex direction="column">
                  <Input
                    name="nama_menu"
                    id="nama_menu"
                    borderRadius="lg"
                    focusBorderColor="green.600"
                    placeholder="Menu Name"
                    {...register("nama_menu", {
                      required: true,
                    })}
                  />
                  {errors.nama_menu?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Input Menu Name
                    </FormHelperText>
                  )}
                </Flex>
                <Flex direction="column">
                  <Select
                    name="jenis"
                    id="jenis"
                    borderRadius="lg"
                    focusBorderColor="green.600"
                    placeholder="Type"
                    {...register("jenis", {
                      required: true,
                    })}
                  >
                    <option value="makanan">Foods</option>
                    <option value="minuman">Beverages</option>
                  </Select>
                  {errors.jenis?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Input Type
                    </FormHelperText>
                  )}
                </Flex>
                <Flex direction="column">
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children="Rp" />
                    <Input
                      name="harga"
                      id="harga"
                      borderRadius="lg"
                      focusBorderColor="green.600"
                      placeholder="{Price}"
                      {...register("harga", { required: true })}
                      onChange={(event) => {
                        const { value } = event.target;
                        let nilaiBaru = value.replace(/\D/g, "");
                        nilaiBaru = nilaiBaru.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          "."
                        );
                        setValue("harga", nilaiBaru);
                      }}
                    />
                  </InputGroup>
                  {errors.harga?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Input Price
                    </FormHelperText>
                  )}
                </Flex>
                <Flex direction="column">
                  <Input
                    type={"file"}
                    name="gambar"
                    id="gambar"
                    borderRadius="lg"
                    focusBorderColor="green.500"
                    placeholder="Picture"
                    {...register("foto", {
                      required: true,
                    })}
                  />
                  {errors.gambar?.type === "required" && (
                    <FormHelperText textColor="red" mb={4}>
                      Attach Picture
                    </FormHelperText>
                  )}
                </Flex>
                <GridItem colSpan={2}>
                  <Flex direction="column">
                    <Textarea
                      name="deskripsi"
                      id="deskripsi"
                      borderRadius="lg"
                      focusBorderColor="green.600"
                      placeholder="Description"
                      {...register("deskripsi", {
                        required: true,
                      })}
                    />
                    {errors.deskripsi?.type === "required" && (
                      <FormHelperText textColor="red" mb={4}>
                        Input Description
                      </FormHelperText>
                    )}
                  </Flex>
                </GridItem>
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
              isLoading={isLoading}
            >
              Add
            </Button>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
