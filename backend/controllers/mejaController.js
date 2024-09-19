const meja = require("../models/index").meja;

exports.getAllMeja = async (request, response) => {
  meja
    .findAll()
    .then((result) => {
      response.status(200).json({
        success: true,
        data: result,
        message: "yeay",
      });
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getByID = async (request, response) => {
  meja
    .findByPk(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
          message: "yeay",
        });
      } else {
        response.status(400).json({
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

exports.getByStatus = async (request, response) => {
  const param = { status: request.params.status };
  meja
    .findAll({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
          message: "yeay",
        });
      } else {
        response.status(400).json({
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

exports.addMeja = async (request, response) => {
  const dataMeja = {
    nomor_meja: request.body.nomor_meja,
    status: "kosong",
  };
  meja
    .findOne({ where: { nomor_meja: dataMeja.nomor_meja } })
    .then((result) => {
      if (result) {
        response.status(400).json({
          success: false,
          message: "nomor meja sudah ada",
        });
      } else {
        meja
          .create(dataMeja)
          .then((result) => {
            response.status(200).json({
              success: true,
              data: result,
              message: "yeay",
            });
          })
          .catch((error) => {
            response.status(400).json({
              success: false,
              message: error.message,
            });
          });
      }
    });
};

exports.deleteMeja = async (request, response) => {
  const param = { id_meja: request.params.id };
  meja
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "table has been deleted",
        });
      } else {
        response.status(400).json({
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

exports.updateMeja = async (request, response) => {
  const param = { id_meja: request.params.id };
  const dataMeja = {
    nomor_meja: request.body.nomor_meja,
    status: request.body.status,
  };
  meja.findOne({ where: param }).then((result) => {
    if (result) {
      if (dataMeja.nomor_meja != null) {
        meja
          .findOne({ where: { nomor_meja: dataMeja.nomor_meja } })
          .then((result) => {
            if (result) {
              response.status(400).json({
                success: true,
                message: "nomor meja sudah ada",
              });
            } else {
              meja
                .update(dataMeja, { where: param })
                .then((result) => {
                  response.status(200).json({
                    success: true,
                    data: {
                      id_meja: param.id_meja,
                      nomor_meja: dataMeja.nomor_meja,
                      status: dataMeja.status,
                    },
                  });
                })
                .catch((error) => {
                  response.status(400).json({
                    success: false,
                    message: error.message,
                  });
                });
            }
          });
      } else {
        meja
        .update(dataMeja, { where: param })
        .then((result) => {
          response.status(200).json({
            success: true,
            data: {
              nomor_meja: dataMeja.nomor_meja,
            },
          });
        });
      }
    } else {
        response.status(404).json({
            success: false,
            message: "not found"
        })
    }
  });
};

exports.searchMeja = async(request, response) => {
    meja
    .findOne({ where : {nomor_meja: request.params.nomor_meja}})
    .then((result) => {
        if(result === null) {
            response.staus(404).json({
                success: false,
                message: "not found"
            })
        } else {
            response.status(200).json({
                success: true,
                data: result
            })
        }
    })
    .catch((error) => {
        response.status(400).json({
          success: false,
          message: error.message,
        });
      });
}