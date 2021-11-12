const { default: knex } = require('knex');
const db = require('../utils/db');

module.exports = {
    async findById(id) {
        const rows= await db('chuyenmuc').where('MaCM', id).where('TrangThai', 1);
        console.log(rows.length)
        if(rows.length===0) return null;
        else return rows;
      },
    async findByTag(tag) {
        const rows= await db('nhan').where('MaNhan', tag).where('TrangThai', 1);
        if(rows.length===0) return null;
        else return rows;
      },
      findNewById(id, offset){
        const sql = `
        SELECT a.*,c.TenCM ,GROUP_CONCAT(n.TenNhan) as TenNhan,GROUP_CONCAT(n.MaNhan) as MaNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM and a.MaCM='${id}'
        and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3) and c.TrangThai=1
        and n.TrangThai=1
				GROUP BY a.MaBV
        order by a.IsPremium DESC
        limit 6
        offset ${offset}`;
        return db.raw(sql);
      },
      
      findNewByIdforPremium(id, offset){
        const sql = `
        select a.*, c.TenCM, n.TenNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM and a.MaCM='${id}'
        limit 6
        offset ${offset}
        order by a.TrangThai DESC`;
        return db.raw(sql);
      },
      findNewByTag(tag, offset){
        const sql = `
        SELECT a.*,c.TenCM ,GROUP_CONCAT(n.TenNhan) as TenNhan,GROUP_CONCAT(n.MaNhan) as MaNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM
        and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3) and a.MaBV in (select bv.MaBV from bv_nhan bv where bv.MaNhan='${tag}')
        and c.TrangThai=1 and n.TrangThai=1
        group by a.MaBV
        order by a.IsPremium DESC
        limit 6
        offset ${offset}`;
        return db.raw(sql);
      },
      findNewByTagforPremium(tag, offset){
        const sql = `
        select a.*, c.TenCM, n.TenNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM and b.MaNhan='${tag}'
        limit 6
        offset ${offset}
        order by a.TrangThai DESC`;
        return db.raw(sql);
      },
      findNewBySearch_Title(search, offset){
        const sql = `
        SELECT a.*,c.TenCM ,GROUP_CONCAT(n.TenNhan) as TenNhan,GROUP_CONCAT(n.MaNhan) as MaNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where match(a.TieuDe) against ('${search}')
        and a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM
        and (a.NgayXuatBan <= CURRENT_DATE()) and (a.TrangThai = 3)
        and c.TrangThai=1 and n.TrangThai=1
        group by a.MaBV
        order by a.IsPremium DESC
        limit 6
        offset ${offset}`;
        return db.raw(sql);
      },
      findNewBySearch_Summary(search, offset){
        const sql = `
        SELECT a.*,c.TenCM ,GROUP_CONCAT(n.TenNhan) as TenNhan,GROUP_CONCAT(n.MaNhan) as MaNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where match(a.TomTat) against ('${search}')
        and a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM
        and (a.NgayXuatBan <= CURRENT_DATE()) and (a.TrangThai = 3)
        and c.TrangThai=1 and n.TrangThai=1
        group by a.MaBV
        order by a.IsPremium DESC
        limit 6
        offset ${offset}`;
        return db.raw(sql);
      },
      findNewBySearch_Content(search, offset){
        const sql = `
        SELECT a.*,c.TenCM ,GROUP_CONCAT(n.TenNhan) as TenNhan,GROUP_CONCAT(n.MaNhan) as MaNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where match(a.NoiDung) against ('${search}')
        and a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM
        and (a.NgayXuatBan <= CURRENT_DATE()) and (a.TrangThai = 3)
        and c.TrangThai=1 and n.TrangThai=1
        group by a.MaBV
        order by a.IsPremium DESC
        limit 6
        offset ${offset}`;
        return db.raw(sql);
      },
      findNewBySearchforPremium(search, offset){
        const sql = `
        select a.*, c.TenCM, n.TenNhan
        from baiviet a, bv_nhan b, chuyenmuc c, nhan n
        where (a.NoiDung like '%${search}%' or a.TieuDe like '%${search}%' or a.TomTat like '%${search}%')
        and a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM
        limit 6
        offset ${offset}
        order by a.TrangThai DESC`;
        return db.raw(sql);
      },
      async getNewsbyID(newsID){
        sql = `SELECT * FROM baiviet bv, chuyenmuc cm, nguoidung nd WHERE nd.MaUS = bv.MaTG AND bv.MaCM = cm.MaCM AND bv.MaBV = '${newsID}' AND bv.TrangThai = 3 AND cm.TrangThai = 1 AND bv.NgayXuatBan <= CURRENT_DATE()`;
        rows = await db.raw(sql);
        if(rows[0].length===0) return null;
        else return rows[0];
      },
      async increaViews(newsID){
        await db('baiviet').where("MaBV", '=', newsID).increment('LuotView').whereNot('TrangThai',5);
      },
      async getCateDad(id){
        const sql = `SELECT cm1.MaCM, cm1.TenCM, cm1.TrangThai FROM chuyenmuc as cm1, chuyenmuc as cm2 WHERE cm2.MaCM = '${id}' AND cm1.MaCM = cm2.MaCM_cha`;
        rows = await db.raw(sql);
        if(rows[0].length==0) return null;
        else return rows;
      },
      async getCateByID(id){
        rows = await db('chuyenmuc').where('MaCM', id);
        if(rows.length ==0) return null;
        else return rows;
      },
      async getCommentsByID(id){
        rows = await db('binhluan').where('MaBV', id);
        return rows;
      },
      async getCommentsList(){
        rows = await db('binhluan');
        return rows;
      },
      async postComment(cmt){
        await db('binhluan').insert(cmt);
      },
      async getNewsbyCate(id, idBV){
        const sql =`SELECT * FROM baiviet bv, chuyenmuc cm, nguoidung nd WHERE bv.MaTG = nd.MaUS and cm.MaCM = bv.MaCM and bv.MaCM = '${id}' and bv.TrangThai = 3 and bv.NgayXuatBan <= CURRENT_DATE() and NOT bv.MaBV = '${idBV}'`
        rows = await db.raw(sql);
        return rows[0];
      },
      async get4NewsPopular(){
        const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE bv.NgayXuatBan >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK)  AND  bv.NgayXuatBan <= CURRENT_DATE() AND bv.TrangThai=3 and cm.TrangThai = 1 and bv.MaCM=cm.MaCM ORDER BY bv.LuotView DESC LIMIT 4`;
        rows = await db.raw(sql);
        return rows;
      },
      async get10MostView(){
        const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE bv.NgayXuatBan >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK)  AND  bv.NgayXuatBan <= CURRENT_DATE() AND cm.MACM = bv.MACM AND bv.TrangThai= 3 and cm.TrangThai = 1 ORDER BY bv.LuotView DESC LIMIT 10`;
        rows = await db.raw(sql);
        return rows;
      },
      async get10NewestView(){
        const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE cm.MACM = bv.MACM AND bv.TrangThai= 3 and cm.TrangThai = 1 and bv.NgayXuatBan <= CURRENT_DATE() ORDER BY bv.NgayXuatBan DESC LIMIT 10`;
        rows = await db.raw(sql);
        return rows;
      },
      async get1MostViewCate(cate){
        const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE cm.MACM = bv.MACM  AND bv.MaCM = '${cate}' AND bv.TrangThai=3 and cm.TrangThai = 1 and bv.NgayXuatBan <= CURRENT_DATE() ORDER BY bv.NgayXuatBan DESC LIMIT 1`;
        rows = await db.raw(sql);
        return rows;
      },
      async get10CateChild(){
        const sql = `SELECT COUNT('MaBV') cnt, cm.MaCM, cm.TenCM, cm.MaCM_cha FROM chuyenmuc as cm, baiviet as bv WHERE cm.MaCM_cha IS NOT NULL AND cm.MaCM = bv.MaCM AND cm.TrangThai = 1 GROUP BY cm.MaCM ORDER BY cnt DESC LIMIT 10`;
        rows = await db.raw(sql);
        return rows;
    },
    async CountNewsByID(id){
      const sql = `select count(*) as Count
      from baiviet a
      where a.MaCM='${id}'
      and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3)` ;
      rows = await db.raw(sql);
      return rows[0];
    },
    async CountNewsByTag(tag){
      const sql = `select count(*) as Count
      from baiviet a, bv_nhan b
      where a.MaBV=b.MaBV and b.MaNhan='${tag}'
      and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3)`;
      rows = await db.raw(sql);
      return rows[0];
    },
    async CountNewsBySearch_Title(search){
      const sql = `select count(*) as Count
      from baiviet a
      where match(a.TieuDe) against ('${search}')
      and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3)`;
      rows = await db.raw(sql);
      return rows[0];
    },
    async CountNewsBySearch_Summary(search){
      const sql = `select count(*) as Count
      from baiviet a
      where match(a.TomTat) against ('${search}')
      and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3)`;
      rows = await db.raw(sql);
      return rows[0];
    },
    async CountNewsBySearch_Content(search){
      const sql = `select count(*) as Count
      from baiviet a
      where match(a.NoiDung) against ('${search}')
      and (a.NgayXuatBan <= CURRENT_DATE() ) and (a.TrangThai = 3)`;
      rows = await db.raw(sql);
      return rows[0];
    },
    async selectedTags(id){
      row = await db('bv_nhan').join('nhan', 'bv_nhan.MaNhan', '=', 'nhan.MaNhan').where('MaBV', id).where('nhan.TrangThai', 1);
      return row;
    },
    async getUserbyID(id){
      row = await db('nguoidung').where('MaUS', id);
      return row;
    },
    async removePremiumUser(id){
      await db('nguoidung').where('MaUS', id).update('TimePremium', null);
    }
    ,
    //Thắng thêm
    async AEW_getNewsbyID(newsID){
      rows = await db('baiviet').innerJoin('nguoidung', 'baiviet.MaTG', 'nguoidung.MaUS').where('MaBV', newsID);
      return rows;
    },
    async getCateChild(id){
      row = await db.select('MaCM', 'TenCM').from('chuyenmuc').where('MaCM_cha', id).where('TrangThai', 1);
      return row;
    },
    async getNewsForCateDad(id){
        const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE bv.MaCM ='${id}' and  bv.NgayXuatBan <= CURRENT_DATE() AND cm.MACM = bv.MACM AND bv.TrangThai= 3 and cm.TrangThai = 1 order by IsPremium DESC, NgayXuatBan DESC limit 3`;
        row = await db.raw(sql);
        return row[0];
    },
    async getAllNews10(){
      const sql = `SELECT * FROM baiviet as bv, chuyenmuc as cm WHERE bv.NgayXuatBan >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK)  AND  bv.NgayXuatBan <= CURRENT_DATE() AND cm.MACM = bv.MACM AND bv.TrangThai= 3 and cm.TrangThai = 1`;
      rows = await db.raw(sql);
      return rows;
    }

};