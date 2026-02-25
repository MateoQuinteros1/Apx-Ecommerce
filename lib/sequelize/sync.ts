import { sequelizedb } from "./sequelize";

async function initDB() {
  try {
    await sequelizedb.authenticate();
    console.log("DB conectada");

    await sequelizedb.sync({ force: true });
    console.log("Modelos sincronizados");
  } catch (error) {
    console.error("Error DB:", error);
  }
}

initDB();
