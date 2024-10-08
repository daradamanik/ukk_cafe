import { useDisclosure, IconButton } from "@chakra-ui/react";
import { Edit as EditIcon } from "react-feather";
import ModalEdit from "../ModalEdit";

export default function Edit({ payload, reload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ModalEdit
        isOpen={isOpen}
        onClose={onClose}
        payload={payload}
        reload={reload}
      />
      <IconButton
        onClick={onOpen}
        aria-label="edit"
        icon={<EditIcon />}
        colorScheme="blue"
      />
    </>
  );
}