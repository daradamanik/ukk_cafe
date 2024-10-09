import React from "react";
import { Flex } from "@chakra-ui/react";
import Delete from "./action/Delete";
import Edit from "./action/Edit";

export default function Button({ payload, reload }) {
  return (
    <Flex dir="row" gap={3}>
      <Delete payload={payload} reload={reload} />
      <Edit payload={payload} reload={reload} />
    </Flex>
  );
}