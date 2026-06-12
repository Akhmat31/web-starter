let { umzug, sequelize } = require("./migration/db");

(async function () {
  try {
    await sequelize.authenticate();
    console.log("koneksi db berhasil.");
    let pending = await umzug.pending();
    if (pending.length === 0) {
      console.log("tidak ada file migrasi barus");
    } else {
      console.log("run" +pending.length+"file migrasi...");
      let migrated = await umzug.up();
      console.log("MIGRASI = ", migrated.map(m => m.name));
    }
  } catch (error) {
    console.error("MIGRASI ERROR= ", error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
})();
