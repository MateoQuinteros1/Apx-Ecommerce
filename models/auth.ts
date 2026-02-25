import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  IsUUID,
  ForeignKey,
  BelongsTo,
  IsEmail,
  Unique,
} from "sequelize-typescript";
import { User } from "./user";
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({ tableName: "auth", timestamps: true })
export class Auth extends Model<
  InferAttributes<Auth>,
  InferCreationAttributes<Auth>
> {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare verification_code: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare verification_code_expires_at: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_verification_code_used: CreationOptional<boolean>;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, onDelete: "CASCADE", unique: true })
  declare user_id: string;

  @BelongsTo(() => User)
  declare user: CreationOptional<User>;
}
