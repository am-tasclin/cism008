'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
const sqlMakerComponent = {}
// console.log(sqlMakerContainer)

/**
 * Block of functions to generate the SQL select with it init data collection
 * Блок функцій для генерації SQL select з його ініціальним набором даних
 * @param {*} smContainer 
 * @param {*} sqlTableName 
 * @returns 
 */
const SqlSelectMaker = (smContainer, sqlTableName) => {
    return {
        getColumns: () => smContainer.columns &&
            (smContainer.order && !smContainer.columns.includes(' ' + smContainer.order)
                && smContainer.columns + ', ' + smContainer.order || smContainer.columns)
            || ' * ',
        getFrom: () => smContainer.from || sqlTableName,
        sqlTableName: sqlTableName,
        initFrom(from) {
            smContainer.from = from
            return this
        }, initColumns(columns) {
            smContainer.columns = columns
            return this
        }, initLeftJoin(fromTable, on) {
            smContainer.leftJoin = { fromTable: fromTable, on: on }
            return this
        }, addLeftJoin(fromTable, on) {
            smContainer.addLeftJoin || (smContainer.addLeftJoin = [])
            smContainer.addLeftJoin.push({ fromTable: fromTable, on: on })
            return this
        }, initOrder(order) {
            smContainer.order = order.trim()
            return this
        }, initWhere(where) {
            smContainer.where = where
            return this
        }, get() {
            // console.log(smContainer)
            let sql = 'SELECT '.concat(this.getColumns())
                .concat(' FROM ').concat(this.getFrom())
            const concatLeftJoin = lj => '\n LEFT JOIN ' + lj.fromTable
                + ' ON ' + lj.on
            smContainer.leftJoin && (sql +=
                concatLeftJoin(smContainer.leftJoin))
            smContainer.addLeftJoin && (sql += smContainer.addLeftJoin.reduce((s, lj) =>
                s += concatLeftJoin(lj), ''))
            smContainer.where && (sql += '\n WHERE ' + smContainer.where)
            smContainer.order && (sql += '\n ORDER BY ' + smContainer.order)
            // console.log(sql)
            return sql
        },
    }
}

/**
 * Initialize and return SQL Select Maker
 * Ініціалізація та повернення SQL Select виробника
 * 
 * @param {*} smContainer 
 * @param {*} sqlTableName 
 * @returns 
 */
export const initSelectMaker = (key, sqlTableName) =>
    SqlSelectMaker(sqlMakerComponent[key] || (sqlMakerComponent[key] = {}), sqlTableName)
