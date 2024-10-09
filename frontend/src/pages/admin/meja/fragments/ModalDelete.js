import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Center,
  Image,
} from "@chakra-ui/react";
import { deleteMeja } from "./ApiHandler";
import ImageDelete from "./../../../../assets/image-delete.svg";

export default function ModalDelete({ isOpen, onClose, payload, reload }) {
  return (
    <Modal
      size={{ base: "xs", md: "sm" }}
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="3xl" py={8}>
        <ModalBody alignItems="center" textAlign="center">
          <Center>
            <Image
              src={ImageDelete}
              alt={"image delete"}
              w={["80%", "70%", "60%"]}
            />
          </Center>
          <Text fontFamily={"Poppins"} as="h3" fontSize={"lg"} fontWeight={600}>
            Delete this table?
          </Text>
          <Text fontFamily={"Poppins"} as="h6" fontSize={"xs"} fontWeight={400}>
            Are you sure?
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            variant={"outline"}
            colorScheme={"red"}
            size={"md"}
            mr={3}
            onClick={onClose}
            borderRadius="lg"
            fontWeight={500}
          >
            Cancel
          </Button>
          <Button
            size={"md"}
            borderRadius="lg"
            colorScheme={"red"}
            fontWeight={500}
            onClick={async () => {
              await deleteMeja(payload);
              await reload();
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
