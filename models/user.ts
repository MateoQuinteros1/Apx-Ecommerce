import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  IsUUID,
  Length,
  Unique,
} from "sequelize-typescript";
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({ timestamps: true, tableName: "users" })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Unique
  @Length({ min: 3, max: 30 })
  @Column(DataType.STRING(30))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare phone: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare street_name: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare street_number: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  declare apartment: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare city: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare state: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare postal_code: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare country: CreationOptional<string>;
}
