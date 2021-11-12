const { default: knex } = require('knex');
const db = require('../utils/db');

module.exports = {
    addUser(user){
        return db('nguoidung').insert(user);
      },
      async findByUsername(username){
        let rows = await db('nguoidung').where('MaUS', username).where('TrangThai', 1);
        if (rows.length === 0)
          return null;
        return rows;
      },
      async findByUsername_1(username){
        let rows = await db('nguoidung').where('TKUS', username).where('TrangThai', 1);
        if (rows.length === 0)
          return null;
        return rows;
      },
      async findByMail(mail){
        let rows = await db('nguoidung').where('Email', mail).where('TrangThai', 1);
        if (rows.length === 0)
          return null;
        return rows;
      },
      allUsers(){
        return db('nguoidung');
      },
      updateValid(username){
        return db('nguoidung').where('MaUS', '=', username ).where('TrangThai', 1)
        .update({
        Valid: 1,
      })
      },
      updatePass(email, password){
        return db('nguoidung').where('Email', '=', email ).where('TrangThai', 1)
        .update({
        MKUS: password,
      })},
      updateOtp(MaUS, otp){
        return db('nguoidung').where('MaUS', '=', MaUS ).where('TrangThai', 1)
        .update({
        OTP: otp,
      })
      },
      updateProfile(email, DOB, name, username){
        return db('nguoidung').where('MaUS', '=', username ).where('TrangThai', 1)
        .update({
        Email: email,
        NgaySinh: DOB,
        TenUS: name
      })},
      updateProfileforWriter(pseudonym,email, DOB, name, username){
        return db('nguoidung').where('MaUS', '=', username ).where('TrangThai', 1)
        .update({
        Email: email,
        NgaySinh: DOB,
        TenUS: name,
        ButDanh:pseudonym
      })},
      async checkPremiumRequest(id){
        rows = await db('prerequest').where('MaUS', id).where('Status', 0);
        if(rows.length !== 0)return false;
        else return true;
      },
      async sentPremiumRequest(request){
        await db('prerequest').insert(request);
      },
      async getUserbyID(id){
        row = await db('nguoidung').where('MaUS', id).where('TrangThai', 1);
        return row;
      },
      async removePremiumUser(id){
        await db('nguoidung').where('MaUS', id).where('TrangThai', 1).update('TimePremium', null);
      },
      async timeEndPremium(userID){
        row = await db.select('TimePremium').from('nguoidung').where('MaUS', userID);
        return row;
      }
    
}