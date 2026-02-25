import { getSequelize } from "./sequelize";

/* Inicializa la conexión a la base de datos y registra todos los modelos.
  Debe llamarse al inicio de cada controller o route handler que use modelos de Sequelize. */
export async function initDb(): Promise<void> {
  await getSequelize().authenticate();
}
