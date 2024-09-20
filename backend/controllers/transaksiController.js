const transaksi = require("../models/index").transaksi;
const Op = require("sequelize").Op;
const model = require("../models/index");
const user = model.user;
const meja = model.meja;
const detail = model.detail_transaksi

exports.getAll = async (request, response) => {
  transaksi
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
  transaksi
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
  transaksi
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
    tgl_transaksi: new Date(),
    status: request.body.status,
  };
  transaksi.create(dataTransaksi)
  .then((result) => {
    let id_transaksi = result.id_transaksi
    let detail_transaksi = request.body.detail_transaksi
    let total = 0

    for (let i = 0; i < detail_transaksi.length; i++) {
        detail_transaksi[i].id_transaksi = id_transaksi
        detail_transaksi[i].harga = detail_transaksi[i].jumlah * detail_transaksi[i].harga;
        total += detail_transaksi[i].harga;
        if(detail_transaksi[i].jumlah<0) {
            return response.json({
                message: 'pelit banget'
            })
        }
    }
    detail.bulkCreate(detail_transaksi)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: 'Order list has created'
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
  })
};

exports.deleteTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  detail
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
              ...dataTransaksi,
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

exports.filtertanggal = async (request, response) => {
  const { startDate, endDate } = request.params;

  try {
    const transactions = await transaksi.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [startDate, endDate], 
        },
      },
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
    });

    if (transactions.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No transactions found in the given date range.",
      });
    }

    return response.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.filterNamaUser = async (request, response) => {
  const param = { nama_user: request.body.nama_user };
  user
    .findAll({
      where: {
        nama_user: param.nama_user,
      },
    })
    .then((result) => {
      if (result === null) {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      } else {
        transaksi
          .findAll({
            where: {
              id_user: result[0].id_user,
            },
          })
          .then((result) => {
            if (result.length === 0) {
              response.status(404).json({
                success: false,
                message: "not found",
              });
            } else {
              response.status(200).json({
                success: true,
                data: result,
              });
            }
          })
          .catch((error) => {
            response.status(400).json({
              success: false,
              message: error.message,
            });
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

exports.filterBulan = async (request, response) => {
  const param = { bulan_transaksi: request.params.bulan_transaksi };
  transaksi
    .findAll({
      where: {
        tgl_transaksi: {
          [Op.like]: param.bulan_transaksi + "%",
        },
      },
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
      if (result.length === 0) {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      } else {
        response.status(200).json({
          success: true,
          data: result,
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

exports.orderHistory = async (request, response) => {
    try {
        let data = await transaksi.findAll({
            include:
                [
                    {
                        model: detail,
                        as: 'detail_transaksi'
                    }
                ]
        })
        return response.status(200).json({
            status: true,
            data: data,
            message: "Order list has been loaded"
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
}