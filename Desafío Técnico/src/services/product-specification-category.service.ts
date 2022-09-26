import sql, { Table } from 'mssql';
import { IProductSpecificationCategory } from '../interfaces/tbl_product.interface';
import { MssqlConnection } from '../utils/database/connection';

export class ProductSpecificationCategoryService {
  private pool: MssqlConnection;
  private tableName: string;

  constructor() {
    this.pool = new MssqlConnection();
    this.tableName = 'tbl_product_specification_category';
  }

  public create(data: Partial<IProductSpecificationCategory>) {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.pool.getConnection();
        await connection
          .request()
          .input('name', data.prspca_name)
          .input('prodId', data.prod_id)
          .query(
            `INSERT INTO ${this.tableName}(prspca_name, prod_id)
              VALUES (@name, @prodId);
              SELECT SCOPE_IDENTITY() as id`
          )
          .then((response) => {
            resolve({ inserted: response.recordset });
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  public bulkCreate(data: Partial<IProductSpecificationCategory>[]) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
          SELECT
            cols.*,
            (CASE WHEN col.[name] = cols.COLUMN_NAME THEN 'TRUE' ELSE 'FALSE' END ) AS p_key,
            (CASE WHEN col.[name] = cols.COLUMN_NAME THEN 'TRUE' ELSE 'FALSE' END ) AS is_identity
          FROM information_schema.columns cols
            LEFT JOIN sys.tables tab on tab.[name] = cols.table_name
            LEFT JOIN sys.indexes pk
              on tab.object_id = pk.object_id and pk.is_primary_key = 1
            LEFT JOIN sys.index_columns ic
              on ic.object_id = pk.object_id and ic.index_id = pk.index_id
            LEFT JOIN sys.columns col
              on pk.object_id = col.object_id and col.column_id = ic.column_id
          WHERE tab.name = '${this.tableName}'
          ORDER BY ordinal_position
        `;
        const connection = await this.pool.getConnection();
        await connection
          .query(query)
          .then(async (response) => {
            const fields = response.recordset;
            const keys = Object.keys(data[0]);
            const columns = keys.map((e) =>
              fields.find((value: any) => value.COLUMN_NAME === e)
            );
            const tb = new Table(`${this.tableName}`);
            columns.forEach((column) => {
              tb.columns.add(
                column.COLUMN_NAME,
                this.setSqlType(column.DATA_TYPE, {
                  maxLength: column.CHARACTER_MAXIMUM_LENGTH,
                  decPrecision: column.NUMERIC_PRECISION,
                  decScale: column.NUMERIC_SCALE,
                  timeScale: column.DATETIME_PRECISION,
                }),
                {
                  nullable: column.IS_NULLABLE === 'YES',
                }
              );
            });
            data.map((value: any) =>
              tb.rows.add(...keys.map((key) => value[key]))
            );
            const bulk = await connection.request().bulk(tb);
            resolve(bulk);
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  public getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.pool.getConnection();
        await connection
          .request()
          .query(`SELECT * FROM ${this.tableName}`)
          .then((response) => {
            resolve({ data: response.recordset });
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  public getById(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.pool.getConnection();
        await connection
          .request()
          .input('id', id)
          .query(`SELECT * FROM ${this.tableName} WHERE prspca_id = @id`)
          .then((response) => {
            resolve({ data: response.recordset });
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  public update(id: number, data: Partial<IProductSpecificationCategory>) {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.pool.getConnection();
        await connection
          .request()
          .input('id', id)
          .input('name', data.prspca_name)
          .input('prodId', data.prod_id)
          .input('date', new Date())
          .query(
            `UPDATE ${this.tableName}
              SET prspca_name = @name, prod_id = @prodId, prod_updated_at = @date
              WHERE prspca_id = @id`
          )
          .then(() => {
            resolve({ result: 'Done' });
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  public delete(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.pool.getConnection();
        await connection
          .request()
          .input('id', id)
          .input('isValid', 0)
          .input('date', new Date())
          .query(
            `UPDATE ${this.tableName}
              SET prspca_is_valid = @isValid, prspca_updated_at = @date, prspca_deleted_at = @date
              WHERE prspca_id = @id`
          )
          .then(() => {
            resolve({ result: 'Done' });
            connection.close();
          })
          .catch((err) => {
            reject(err);
            connection.close();
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  private setSqlType(type: string, aditionalParameters?: any) {
    switch (type) {
      case 'tinyint':
        return sql.TinyInt;
      case 'bit':
        return sql.Bit;
      case 'varchar':
        return sql.VarChar(aditionalParameters.maxLength);
      case 'image':
        return sql.Image;
      case 'text':
        return sql.Text;
      case 'nvarchar':
        return sql.NVarChar(aditionalParameters.maxLength);
      case 'int':
        return sql.Int;
      case 'float':
        return sql.Float;
      case 'decimal':
        return sql.Decimal(
          aditionalParameters.decPrecision,
          aditionalParameters.decScale
        );
      case 'datetime2':
        return sql.DateTime2(aditionalParameters.timeScale);
      case 'datetime':
        return sql.DateTime;
      case 'date':
        return sql.Date;

      default:
        break;
    }
  }
}
