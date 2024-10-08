import React from "react";
import Button from "./Button";

const columns = [
  {
    title: "Table Number",
    dataIndex: "nomor_meja",
    key: "nomor_meja",
    width: "30%",
    sorter: (a, b) => a.nomor_meja - b.nomor_meja,
    defaultSortOrder: "ascend",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "30%",
  },
  {
    title: "Action",
    key: "aksi",
    width: "15%",
    render: (data) => (
      <ActionButton payload={data.id_meja} reload={data.reload} />
    ),
  },
];

export { columns };