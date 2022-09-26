
        module.exports = (sequelize, DataTypes, schema) => {
            return sequelize.define('tbl_product', {
    prod_id: {allowNull: false, type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, }, prod_name: {allowNull: false, type: DataTypes.STRING, }, prod_current_price: {allowNull: false, type: DataTypes.STRING, }, prod_current_discount: {allowNull: true, type: DataTypes.STRING, }, prod_is_valid: {defaultValue: 1, allowNull: false, type: DataTypes.BOOLEAN, }, prod_created_at: {defaultValue: "(getdate())", allowNull: false, type: DataTypes.DATE, }, prod_updated_at: {defaultValue: "(getdate())", allowNull: false, type: DataTypes.DATE, }, prod_deleted_at: {allowNull: true, type: DataTypes.DATE, }, }, {
        tableName: 'tbl_product',
        schema
    });};