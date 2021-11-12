const { default: knex } = require('knex');
const db = require('../utils/db');
module.exports = {
    allCate() {
        return db('chuyenmuc').where('TrangThai', 1);
    },
      async cateDad(){
        const row = await db('chuyenmuc').where('MaCM_cha', null).where('TrangThai', 1);
        if(row.length !== 0) return row;
    },
      async cateChild(){
        const row = await db('chuyenmuc').whereNot('MaCM_cha', null).where('TrangThai', 1);
        if(row.length !== 0) return row;
    }
};