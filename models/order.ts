import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
  ForeignKey,
  Max,
  Min,
  BelongsTo,
} from "sequelize-typescript";
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./user";

@Table({ tableName: "orders", timestamps: true })
export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare user_id: string;

  @Column(DataType.STRING)
  declare product_id: string;

  @Min(1)
  @Max(10)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @Column(DataType.INTEGER)
  declare total_price: number;

  //status posibles: pending, completed, cancelled
  @Column(DataType.ENUM("pending", "completed", "cancelled"))
  declare status: string;

  @BelongsTo(() => User)
  declare user: CreationOptional<User>;
}
