
const db = require('../utils/db');

module.exports = {
  allpaper_btv(btv) //Tất cả
  {
    const sql=`
    select a.TieuDe, a.MaBV, a.TomTat, a.LinkAnhDD, c.TenCM, c.MaCM
    from baiviet a,btv_cm b, chuyenmuc c
    where c.MaCM=b.MaCM and b.MaBTV='${btv}' and b.MaCM=a.MaCM and a.TrangThai='0'
    and c.TrangThai='1'`;
    return db.raw(sql);
  },
  findNewById(id){
    const sql = `
    select a.MaBV, c.TenCM,n.MaNhan, n.TenNhan
    from baiviet a, bv_nhan b, chuyenmuc c, nhan n
    where a.MaBV=b.MaBV and b.MaNhan=n.MaNhan and a.MaCM=c.MaCM and a.MaBV='${id}'
    and c.TrangThai='1'`;
    return db.raw(sql);
  },
  

  insert_paper(chuthich,MaBV)
  {
      
  },

  findall_tag()
  {
      return db('nhan');
  },
  findtagbyMaBTV(mabtv)
  {
        const sql=`
        select b.MaBV, n.MaNhan, n.TenNhan
        from baiviet b, btv_cm bc, nhan n, bv_nhan bn
        where bc.MaBTV='${mabtv}' and bc.MaCM=b.MaCM and b.MaBV=bn.MaBV and bn.MaNhan=n.MaNhan and b.TrangThai='0'and n.TrangThai='1'`
        return db.raw(sql);
  },
  findall_categories()
  {
      const sql=`
      select *
      from chuyenmuc
      where MaCM_cha is not null and TrangThai='1'`
      return db.raw(sql);
  },
  addTag_News(nhanBV) {
    // list.push(category);
    return db('bv_nhan').insert(nhanBV);
  },
  async approve_news(id, post)
  {
    await db('baiviet').where('MaBV',id).update(post);
  },
  async deleteTag_postByID(id){
    console.log(id);
    const sql=`
    DELETE FROM bv_nhan WHERE (MaBV = '${id}')`;
    await db.raw(sql); 
  },
  async selectedTags(id){
    return db('bv_nhan').join('nhan', 'bv_nhan.MaNhan', '=', 'nhan.MaNhan').where('MaBV', id).where('TrangThai', 1);
  },
  async notSelectedTags(id){
    const sql=`
    SELECT * FROM nhan WHERE nhan.TrangThai = 1 AND NOT EXISTS( SELECT * FROM bv_nhan WHERE nhan.MaNhan = bv_nhan.MaNhan AND bv_nhan.MaBV = '${id}')`; 
    rows = await db.raw(sql);
    return rows;
  },
  allpaper_approve_btv(btv) //Tất cả các bài đã duyệt
  {
    const sql=`
    select a.TieuDe, a.MaBV, a.TomTat, a.LinkAnhDD, c.TenCM, c.MaCM
    from baiviet a,btv_cm b, chuyenmuc c
    where c.MaCM=b.MaCM and b.MaBTV='${btv}' and b.MaCM=a.MaCM and a.TrangThai='3'
    and c.TrangThai='1'`; //Trạng thái =0 là chưa duyệt
    return db.raw(sql);
  },
  allpaper_refuse_btv(btv) //Tất cả các bài bị từ chối
  {
    const sql=`
    select a.TieuDe, a.MaBV, a.TomTat, a.LinkAnhDD, c.TenCM, c.MaCM
    from baiviet a,btv_cm b, chuyenmuc c
    where c.MaCM=b.MaCM and b.MaBTV='${btv}' and b.MaCM=a.MaCM and a.TrangThai='1'
    and c.TrangThai='1'`; //Trạng thái =0 là chưa duyệt
    return db.raw(sql);
  },



  
};
