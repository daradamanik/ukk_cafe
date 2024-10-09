const user = require("../models/index").user;
const Op = require("sequelize").Op;
const md5 = require("md5");
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "indomie";
const Sequelize = require('sequelize')
const sequelize = new Sequelize("cafe_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.addUser = async (request, response) => {
  let newUser = {
    nama_user: request.body.nama_user,
    username: request.body.username,
    password: md5(request.body.password),
    role: request.body.role,
  };

  let existingUser = await user.findAll({
    where: {
      [Op.or]: [{ nama_user: newUser.nama_user }, { username: newUser.username }],
    },
  });

  if (
    newUser.nama_user === "" ||
    newUser.username === "" ||
    newUser.password === "" ||
    newUser.role === ""
  ) {
    return response.status(400).json({
      success: false,
      message: "Harus diisi semua",
    });
  } else {
    if (existingUser.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Cari nama atau username lain",
      });
    } else {
      console.log(newUser);
      user
        .create(newUser)
        .then((result) => {
          return response.json({
            success: true,
            data: result,
            message: `New User has been added`,
          });
        })
        .catch((error) => {
          return response.status(400).json({
            success: false,
            message: error.message,
          });
        });
    }
  }
};

exports.Login = async (request, response) => {
  try {
    const params = {
      username: request.body.username,
      password: md5(request.body.password),
    };
    console.log(params);
    const findUser = await user.findOne({ where: params });
    if (findUser == null) {
      return response.status(400).json({
        message: "You can't log in", 
      });
    }
    let tokenPayLoad = {
      username: findUser.username,
      role: findUser.role,
      nama_user: findUser.nama_user,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY); 
    return response.status(200).json({
      success: true, 
      message: "logged in",
      logged: true,
      data: {
        token: token,
        id_user: findUser.id_user,
        nama_user: findUser.nama_user,
        username: findUser.username,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      message: error,
    });
  }
};

exports.updateUser = async (request, response) => {
  let id_user = request.params.id; 
  let getId = await user.findAll({
    where: {
      [Op.and]: [{ id_user: id_user }],
    },
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: "User dengan id tersebut tidak ada",
    });
  }

  let dataUser = {
    nama_user: request.body.nama_user,
    username: request.body.username,
    role: request.body.role,
  };

  let existingUser = await user.findAll({
    where: {
      [Op.and]: [
        { id_user: { [Op.ne]: id_user } },
        {
          [Op.or]: [
            { nama_user: dataUser.nama_user }, 
            { username: dataUser.username },
          ],
        },
      ],
    },
  });

  if (existingUser.length > 0) {
    return response.status(400).json({
      success: false,
      message: "Cari nama atau username lain",
    });
  }

  user
    .update(dataUser, { where: { id_user: id_user } })
    .then((result) => {
      return response.json({
        success: true,
        data: dataUser,
        message: `Data user has been updated`,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getAllUser = async (request, response) => {
  let users = await user.findAll();
  if (users.length === 0) {
    return response.status(400).json({
      success: false,
      message: "no user to show",
    });
  }
  return response.json({
    success: true,
    data: users,
    message: `All user have been loaded`,
  });
};

exports.searchUser = async (req, res) => {
  user
    .findAll({
      where: {
        [Op.or]: [
          { nama_user: { [Op.like]: "%" + req.body.nama_user + "%" } },
          { username: { [Op.like]: "%" + req.body.username + "%" } },
        ],
      },
    })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          success: true,
          message: "user berhasil ditemukan",
          data: result,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteUser = async (request, response) => {
  let id_user = request.params.id; 
  user
    .destroy({ where: { id_user: id_user } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data has been delete where id :` + id_user,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.resetpassword = async (req, res) => {
  let id_user = req.params.id;
  const users = await sequelize.query(
    `SELECT * from users where id_user = '${id_user}'`
  );

  let dataUser = {
    passwordlama: req.body.oldPassword,
  };
  if (users.passwordlama == dataUser.password) {
    dataUser.password = md5(req.body.NewPassword);
    user
      .update(dataUser, { where: { id_user: id_user } })
      .then((result) => {
        return res.json({
          success: true,
          data: dataUser,
          message: "Password has been updated",
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  } else {
    return res.json({
      success: false,
      message: "The old password doesn't match, please try again",
    });
  }
};

exports.getById = async (request, response) => {
    user
    .findByPk(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      response.status(404).json({
        success: false,
        message: error.message,
      });
    });
}