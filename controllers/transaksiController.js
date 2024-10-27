const Op = require("sequelize").Op;
const { sequelize } = require("../models"); 
const model = require("../models/index");
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const transaksi = model.transaksi
const user = model.user;
const meja = model.meja;
const detail = model.detail_transaksi;
const menu = model.menu;

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
  const userId = request.userData.id_user
  const idMeja = request.body.id_meja
  try {
    const mejaRecord = await meja.findOne({
      where: { id_meja: idMeja }
    });

    if (!mejaRecord) {
      return response.status(404).json({
        success: false,
        message: "Meja tidak ditemukan."
      });
    }

    if (mejaRecord.status === 'terisi') {
      return response.status(400).json({
        success: false,
        message: "Meja sudah terisi. Silakan pilih meja lain."
      });
    }

    const dataTransaksi = {
      id_user: userId,
      nama_pelanggan: request.body.nama_pelanggan,
      tgl_transaksi: new Date(),
      status: request.body.status,
    };

    const result = await transaksi.create(dataTransaksi);
    const id_transaksi = result.id_transaksi;
    const detail_transaksi = request.body.detail_transaksi;
    
    const menuIds = detail_transaksi.map(item => item.id_menu);
    const menuItems = await menu.findAll({
      where: {
        id_menu: menuIds
      }
    });
    
    const menuPriceMap = {};
    menuItems.forEach(menu => {
      menuPriceMap[menu.id_menu] = menu.harga; 
    });
    
    let grandTotal = 0;

    for (let i = 0; i < detail_transaksi.length; i++) {
      const { id_menu, jumlah, pricePerMenu } = detail_transaksi[i];
      const originalPrice = menuPriceMap[id_menu];
      if (parseFloat(detail_transaksi[i].pricePerMenu) !== parseFloat(originalPrice)) {
        return response.status(400).json({
          success: false,
          message: `Harga menu untuk ${id_menu} tidak sesuai. Harga yang dimasukkan: ${detail_transaksi[i].pricePerMenu}, Harga asli: ${originalPrice}`
        });
      }

      const totalPerMenu = originalPrice * jumlah;

      detail_transaksi[i].id_transaksi = id_transaksi;
      detail_transaksi[i].pricePerMenu = pricePerMenu; 
      detail_transaksi[i].totalPerMenu = totalPerMenu; 
      grandTotal += totalPerMenu;

      console.log(grandTotal)

      if (jumlah < 1) {
        return response.status(400).json({
          success: false,
          message: "Pembelian minimal 1",
        });
      }
    }
    const detailResult = await detail.bulkCreate(detail_transaksi);
    await meja.update(
      { status: 'terisi' }, 
      { where: { id_meja: request.body.id_meja } } 
    );

    return response.json({
      success: true,
      data: detailResult,
      grandTotal: grandTotal,
      message: "Order list has created",
    });
  } catch (error) {
    console.error("Error while adding transaction:", error); 
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }

};

exports.deleteTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  detail
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "transaction has been deleted",
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
          message: "transaction has been deleted",
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
  const { nama_user } = request.body;

  try {
    const result = await transaksi.findAll({
      include: [
        {
          model: user,
          as: "user",
          where: { nama_user: nama_user }, 
        },
      ],
    });

    if (result.length === 0) {
      return response.status(404).json({
        success: false,
        message: "not found",
      });
    }

    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.filterBulan = async (request, response) => {
  const { bulan_transaksi } = request.params;
  try {
    const result = await sequelize.query(
      `SELECT * FROM transaksis
       WHERE MONTH(tgl_transaksi) = :bulan`, 
      {
        replacements: { bulan: parseInt(bulan_transaksi, 10) },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return response.status(404).json({
        success: false,
        message: "not found",
      });
    }

    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.orderHistory = async (request, response) => {
  try {
    let data = await transaksi.findAll({
      include: [
        {
          model: detail,
          as: "detail_transaksi",
        },
      ],
    });
    return response.status(200).json({
      success: true,
      data: data,
      message: "Order list has been loaded",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.receipt = async (request, response) => {
  let param = request.params.id_transaksi;
  try {
    const dataTransaksi = await transaksi.findOne({
      where: { id_transaksi: param },
      include: [
        {
          model: user,
          attributes: ["nama_user"],
          as: "user",
        },
        {
          model: detail,
          as: "detail",
          include: {
            model: menu,
            attributes: ["nama_menu", "harga"],
            as: "menu",
          },
        },
      ],
    });
    if (!dataTransaksi) {
      return response.status(404).json({
        success: false,
        message: "not found",
      });
    }
    const transactionDetails = dataTransaksi.detail || [];
    const receiptItems = transactionDetails.map((detail) => {
      return {
        menuName: detail.menu ? detail.menu.nama_menu : "Unknown",
        quantity: detail.jumlah,
        pricePerMenu: detail.menu ? detail.menu.harga : 0, 
        totalPerMenu: detail.jumlah * (detail.menu ? detail.menu.harga : 0),
      };
    });
    const total = receiptItems.reduce(
      (sum, item) => sum + item.totalPerMenu,
      0
    );
    const struk = {
      kasir: dataTransaksi.user.nama_user,
      pelanggan: dataTransaksi.nama_pelanggan,
      tanggal: dataTransaksi.tgl_transaksi,
      pembelian: receiptItems,
      total,
    };

  const printstruk = (struk) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { width: 100%; border-collapse: collapse; text-align: left}
      th, td { padding: 8px 12px; border-bottom: 1px solid #ddd; }
      th { background-color: #f4f4f4; texy-align: center; }
      h2 { text-align: center; }
      .store-info { text-align: center; margin-bottom: 20px; }
      .store-info p { margin: 4px 0; }
    </style>
  </head>
  <body>
    <div class="store-info">
      <h2>APALA</h2>
      <p>Malang, Indonesia</p>
      <p><strong>Date:</strong> ${struk.tanggal}</p>
    </div>

    <p><strong>Cashier:</strong> ${struk.kasir}</p>
    <p><strong>Customer:</strong> ${struk.pelanggan}</p>
    
    <table>
      <thead>
        <tr>
          <th>Menu</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      ${
        struk.pembelian && struk.pembelian.length > 0 
        ? struk.pembelian.map(item => `
          <tr>
            <td>${item.menuName || 'Unknown'}</td>
            <td>${item.quantity}</td>
            <td>${item.pricePerMenu}</td>
            <td>${item.totalPerMenu}</td>
          </tr>
        `).join('') 
        : `<tr><td colspan="4">No items found</td></tr>`
      }
      </tbody>
    </table>
    <h3>Grand Total: ${struk.total}</h3>
  </body>
  </html>
`;

const strukHTML = printstruk(struk)
const directory = path.join(__dirname, '../receipt')
if(!fs.existsSync(directory)) {
  fs.mkdirSync(directory)
}
const file = path.join(directory, `receipt_${param}.pdf`)
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setContent(strukHTML)

await page.pdf({
  path: file,
  format: 'A4',
  printBackground: true
})
await browser.close()

response.json({
  success: true,
  message: 'receipt generated successfully', file
})

  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};
