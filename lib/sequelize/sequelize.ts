import { Sequelize } from "sequelize-typescript";
import { User } from "../../models/user";
import { Auth } from "../../models/auth";
import { Order } from "../../models/order";
import pg from "pg";

let sequelize: Sequelize;

export function getSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectModule: pg,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        models: [User, Auth, Order],
      },
    );
  }

  return sequelize;
}

/*
export const sequelizedb: Sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    models: [User, Auth],
  },
);
*/
