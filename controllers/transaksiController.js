const transaksi = require("../models/index").transaksi;
const Op = require("sequelize").Op;
const model = require("../models/index");
const user = model.user;
const meja = model.meja;

exports.getAll = async (request, response) => {
  await transaksi
    .findAll({
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      response.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getID = async (request, response) => {
  await transaksi
    .findByPk(request.params.id, {
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getIdUser = async (request, response) => {
  await transaksi
    .findAll({
      where: { id_user: request.params.id_user },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.addTransaksi = async (request, response) => {
  const dataTransaksi = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  await transaksi
    .create(dataTransaksi)
    .then((result) => {
      response.status(200).json({
        success: true,
        message: yeay,
      });
      meja.update(
        { status: "terisi" },
        { where: { id_meja: request.body.id_meja } }
      );
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  transaksi
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "deleted",
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.editTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  const dataTransaksi = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };
  transaksi.findOne({ where: param }).then((result) => {
    if (result) {
      transaksi
        .update(dataTransaksi, { where: param })
        .then((result) => {
          response.status(200).json({
            success: true,
            message: "yeay",
            data: {
              id_transaksi: param.id_transaksi,
              ...data,
            },
          });

          if (request.body.status === "lunas") {
            meja.update(
              { status: "kosong" },
              { where: { id_meja: request.body.id_meja } }
            );
          }
        })
        .catch((error) => {
          response.status(400).json({
            success: false,
            message: error.message,
          });
        });
    } else {
      response.status(404).json({
        success: false,
        message: "not found",
      });
    }
  });
};

exports.filtertanggal = async(request, response) => {
    const param = {tgl_transaksi: request.params.tgl_transaksi}
    await transaksi
    .
}