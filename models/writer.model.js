const db = require('../utils/db');

module.exports = {
    addNews(news) {  // Thêm bài báo
        return db('baiviet').insert(news);
    },
    addTag_News(nhanBV) {
        // list.push(category);
        return db('bv_nhan').insert(nhanBV);
    },
    async allTags(){
    return rows = await db('nhan').where('TrangThai', 1);
    },
    async allNews(){
        return rows = await db('baiviet');
    },
    selectedTags(id){
        return db('bv_nhan').join('nhan', 'bv_nhan.MaNhan', '=', 'nhan.MaNhan').where('MaBV', id).where('TrangThai', 1);
    },
    async notSelectedTags(id){
        const sql=`
        SELECT * FROM nhan WHERE nhan.TrangThai = 1 AND NOT EXISTS( SELECT * FROM bv_nhan WHERE nhan.MaNhan = bv_nhan.MaNhan AND bv_nhan.MaBV = '${id}')`; 
        rows = await db.raw(sql);
        return rows;
    },
    selectedCategory(id){
        return db('chuyenmuc').join('baiviet', 'chuyenmuc.MaCM', '=', 'baiviet.MaCM').where('baiviet.MaBV', id).where('chuyenmuc.TrangThai',1);
    },
    notSelectedCategory(id){
        return db('chuyenmuc').whereNot('MaCM', id).whereNotNull('MaCM_cha').where('TrangThai', 1);
    },
    async deleteTag_postByID(id){
        console.log(id);
        const sql=`
        DELETE FROM bv_nhan WHERE (MaBV = '${id}')`;
        await db.raw(sql); 
    },
    async updatePostByID(id, post){
        await db('baiviet').where('MaBV', id).update(post);
    },
    async getNewsbyID(newsID){
        return db('baiviet').join('nguoidung', 'baiviet.MaTG', '=', 'nguoidung.MaUS').where('MaBV', newsID);
    },

    // Thắng ....
    
    async allpaperof_reporter(matg) //Tất cả
  {
  /* const papers = await db('baiviet').where({
      MaTG: 'US005'}).select('TieuDe','TomTat','LinkAnhDD','TrangThai') */
      const papers = await db.select('TieuDe','TomTat','LinkAnhDD','TenCM', 'MaBV').from('baiviet').join('chuyenmuc',
      function() {
        this.on('baiviet.MaCM', '=', 'chuyenmuc.MaCM')
      }).where('baiviet.MaTG', '=', `${matg}`)
    return papers;
  },

    async paper_waiting(matg) // Đợi xuất bản
    {
        const sql=`
        SELECT *
        FROM baiviet b, chuyenmuc c
        WHERE b.MaCM=c.MaCM and b.MaTG='${matg}' and b.TrangThai=3 and b.NgayXuatBan > CURDATE()`; 
        rows = await db.raw(sql);
        return rows;

    },
    async paper_pass(matg) //Đã xuất bản
    {
    /* const papers = await db('baiviet').where({
        MaTG: 'US005'}).select('TieuDe','TomTat','LinkAnhDD','TrangThai') */
        const sql=`
        SELECT *
        FROM baiviet b, chuyenmuc c
        WHERE b.MaCM=c.MaCM and b.MaTG='${matg}' and b.TrangThai=3 and b.NgayXuatBan <= CURDATE()`; 
        rows = await db.raw(sql);
        return rows;
    },
    async paper_refuse(matg) //Từ chối
    {
    /* const papers = await db('baiviet').where({
        MaTG: 'US005'}).select('TieuDe','TomTat','LinkAnhDD','TrangThai') */
        const papers = await db.select('TieuDe','TomTat','LinkAnhDD','TenCM', 'MaBV', 'ChuThich').from('baiviet').join('chuyenmuc',
        function() {
            this.on('baiviet.MaCM', '=', 'chuyenmuc.MaCM')
        }).where({
            'baiviet.MaTG':`${matg}`,
            'baiviet.TrangThai':'1'
        } )
        return papers;
    },

    async paper_check_yet(matg) //Chưa duyệt
    {
    /* const papers = await db('baiviet').where({
        MaTG: 'US005'}).select('TieuDe','TomTat','LinkAnhDD','TrangThai') */
        const papers = await db.select('TieuDe','TomTat','LinkAnhDD','TenCM', 'MaBV').from('baiviet').join('chuyenmuc',
        function() {
            this.on('baiviet.MaCM', '=', 'chuyenmuc.MaCM')
        }).where({
            'baiviet.MaTG':`${matg}`,
            'baiviet.TrangThai':'0'
        } )
        return papers;
    }

};
