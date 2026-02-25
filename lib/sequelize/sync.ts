import { getSequelize } from "./sequelize";

async function initDB() {
  try {
    await getSequelize().authenticate();
    console.log("DB conectada");

    await getSequelize().sync({ force: true });
    console.log("Modelos sincronizados");
  } catch (error) {
    console.error("Error DB:", error);
  }
}

initDB();
