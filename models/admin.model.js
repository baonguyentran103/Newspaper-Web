const db = require('../utils/db');
module.exports = {

    //-------------------------------------------- Code ----------------------------------------------------
    async all_code_user()
    {
        const sql=`
        select MaUS
        from nguoidung`;
        await db.raw(sql);
    },
    async all_code_tag(){
        return rows = await db('nhan');
    },
    async all_code_cat(){
        return rows = await db('chuyenmuc');
    },
    //--------------------------------------------Category ----------------------------------------------------
    categories(){
        const sql=`
        select c1.*,c2.TenCM as cha
        from chuyenmuc c1 left join chuyenmuc c2 on c1.MaCM_cha =c2.MaCM `;
        return db.raw(sql);
    },
    category_dad(){
        const sql=`
        select *
        from chuyenmuc
        where MaCM_cha is NULL and TrangThai="1"`;
        return db.raw(sql);
    },
    async delete_category(id)
    {
        const sql=`
        update chuyenmuc set TrangThai = '0' where MaCM  = '${id}'`;
        await db.raw(sql); 
    },
    async delete_categoryDad(id)
    {
        const sql=`
        update chuyenmuc set TrangThai = '0' where MaCM_cha  = '${id}'`;
        await db.raw(sql); 
    },
    async delete_postByCate(id)
    {
        const sql=`
        update baiviet set TrangThai = '5' where MaCM  = '${id}'`;
        await db.raw(sql); 
    },
    async delete_postByCateDad(id)
    {
        const sql=`
        update baiviet bv inner join chuyenmuc cm on bv.MaCM = cm.MaCM set bv.TrangThai = '5' where MaCM_cha  = '${id}'`;
        await db.raw(sql); 
    },
    async activeCate(id)
    {
        const sql=`
        update chuyenmuc set TrangThai = '1' where MaCM  = '${id}'`;
        await db.raw(sql); 
    },
    async edit_category1(id,TenCM,MieuTaCM)
    {
        const sql=`
        update chuyenmuc set TenCM = '${TenCM}', MieuTaCM = '${MieuTaCM}', MaCM_cha=NULL  
        where MaCM  = '${id}'`;
        await db.raw(sql);
    },
    async edit_category2(id,TenCM,MieuTaCM,MaCM_cha)
    {
        const sql=`
        update chuyenmuc set TenCM = '${TenCM}', MieuTaCM = '${MieuTaCM}',MaCM_cha = '${MaCM_cha}' 
        where MaCM  = '${id}'`;
        await db.raw(sql);
    },
    async add_category0(id,TenCM,MieuTaCM,Status)
    {
        const sql=`
        INSERT INTO chuyenmuc (MaCM, TenCM, MieuTaCM,MaCM_cha, TrangThai)
        VALUES ('${id}', '${TenCM}', '${MieuTaCM}',NULL,'${Status}')`;
        await db.raw(sql);
    },
    async add_category(id,TenCM,MieuTaCM,MaCM_cha,Status)
    {
        const sql=`
        INSERT INTO chuyenmuc (MaCM, TenCM, MieuTaCM,MaCM_cha, TrangThai)
        VALUES ('${id}', '${TenCM}', '${MieuTaCM}', '${MaCM_cha}','${Status}')`;
        await db.raw(sql);
    },
    //--------------------------------------------tag ----------------------------------------------------
    tags(){
        const sql=`
        select *
        from nhan`;
        return db.raw(sql);
    },
    async delete_tag(id)
    {
        const sql=`
        update nhan set TrangThai = '0' where MaNhan  = '${id}'`;
        await db.raw(sql); 
    },
    async add_del_tag(id)
    {
        const sql=`
        update nhan set TrangThai = '1' where MaNhan  = '${id}'`;
        await db.raw(sql); 
    },
    async edit_tag(id,name)
    {
        const sql=`
        update nhan set TenNhan = '${name}' 
        where MaNhan  = '${id}'`;
        await db.raw(sql);
    },
    async add_tag(id,name,Status)
    {
        const sql=`
        INSERT INTO nhan (MaNhan, TenNhan, TrangThai)
        VALUES ('${id}', '${name}','${Status}')`;
        
        console.log(sql);
        await db.raw(sql);
    },
    //--------------------------------------------post ----------------------------------------------------
    post_public(){
        const sql=`
        select a.*, c.TenCM, c.MaCM
        from baiviet a, chuyenmuc c
        where c.MaCM=a.MaCM  and a.TrangThai='3' and NgayXuatBan <= CURDATE()`; //Trạng thái =3 là đã xuất bản
        return db.raw(sql);
    },
    post_refuse(){
        const sql=`
        select a.*, c.TenCM, c.MaCM
        from baiviet a, chuyenmuc c
        where c.MaCM=a.MaCM  and a.TrangThai='1'`; //Trạng thái =1 là từ chối
        return db.raw(sql);
    },
    post_approve(){
        const sql=`
        select a.*, c.TenCM, c.MaCM
        from baiviet a, chuyenmuc c
        where c.MaCM=a.MaCM and a.TrangThai='3' and NgayXuatBan > CURDATE()`; //Trạng thái =2 là chờ xuất bản
        return db.raw(sql);
    },
    post_waitting(){
        const sql=`
        select a.*, c.TenCM, c.MaCM
        from baiviet a, chuyenmuc c
        where c.MaCM=a.MaCM  and a.TrangThai='0'`; //Trạng thái =0 là chưa duyệt
        return db.raw(sql);
    },
    post_deleted(){
        const sql=`
        select a.*, c.TenCM, c.MaCM
        from baiviet a, chuyenmuc c
        where c.MaCM=a.MaCM and a.TrangThai='5'`; //Trạng thái =5 là đã xóa
        return db.raw(sql);
    },
    async delete_post(id)
    {
        const sql=`
        update baiviet set TrangThai = '5', NgayXuatBan="NULL" where MaBV  = '${id}'`;
        await db.raw(sql); 
    },
    async add_premium(id)
    {
        const sql=`
        update baiviet set IsPremium = '1' where MaBV  = '${id}'`;
        await db.raw(sql); 
    },
    async exit_premium(id)
    {
        const sql=`
        update baiviet set IsPremium = '0' where MaBV  = '${id}'`;
        await db.raw(sql); 
    },
    async publish_post(id)
    {
        const sql=`
        update baiviet set TrangThai = '3' , NgayXuatBan = CURDATE() where MaBV  = '${id}'`;
        await db.raw(sql); 
    },
    async extend_post(id,trangthai)
    {
        const sql=`
        update baiviet set TrangThai ='${trangthai}'  where MaBV  = '${id}'`;
        await db.raw(sql); 
    },
    //--------------------------------------------writer ----------------------------------------------------
    all_writer()
    {
        const sql=`
        select *
        from nguoidung
        where LoaiUS="Writer" `;
        return db.raw(sql);
    },
    async delete_writer(id)
    {
        const sql=`
        update nguoidung set TrangThai = '0' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
    async add_writer(id)
    {
        const sql=`
        update nguoidung set TrangThai = '1' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
    //--------------------------------------------editor ----------------------------------------------------
    all_editor()
    {
        const sql=`
        select *
        from nguoidung
        where LoaiUS="Editor" `;
        return db.raw(sql);
    },
    async delete_editor(id)
    {
        const sql=`
        update nguoidung set TrangThai = '0' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },

    addBTV_CM(src) {
        // list.push(category);
        return db('btv_cm').insert(src);
    },
    async delBTV_CM(id){
        console.log(id);
        const sql=`
        DELETE FROM btv_cm WHERE (MaBTV = '${id}')`;
        await db.raw(sql); 
      },
    async add_editor(id)
    {
        const sql=`
        update nguoidung set TrangThai = '1' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
    //--------------------------------------------subscriber ----------------------------------------------------
    all_subscriber()
    {
        const sql=`
        select *
        from nguoidung
        where LoaiUS="Subscriber"`;
        return db.raw(sql);
    },
    async delete_subscriber(id)
    {
        const sql=`
        update nguoidung set TrangThai = '0' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
    async delete_sub(id)
    {
        const sql=`
        update nguoidung set TrangThai = '0' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
    async add_sub(id)
    {
        const sql=`
        update nguoidung set TrangThai = '1' where MaUS  = '${id}'`;
        await db.raw(sql); 
    },
//--------------------------------------------Editor-Category ----------------------------------------------------
    all_editor_category()
    {
        const sql=`
        select a.MaUS, a.TenUS, a.TrangThai, GROUP_CONCAT(b.MaCM) as MaCM,GROUP_CONCAT(c.TenCM) as TenCM
        from nguoidung a left join btv_cm b on a.MaUS=b.MaBTV 
				     left join chuyenmuc c on b.MaCM=c.MaCM
        where  a.LoaiUS="Editor"
		group by a.MaUS`;
        return db.raw(sql);
    },
    find_name_by_id(id)
    {
        const sql=`
        select n.MaUS, n.TenUS
        from  nguoidung n
        where n.MaUS= '${id}'`;
        return db.raw(sql); 
    },
    find_category_by_id(id)
    {
        const sql=`
        select b.MaCM,c.TenCM
        from btv_cm b, chuyenmuc c, nguoidung n
        where b.MaBTV=n.MaUS and b.MaCM=c.MaCM and b.MaBTV  = '${id}'`;
        return db.raw(sql); 
    },
    find_not_category_by_id(id)
    {
        const sql=`
        select c.MaCM,c.TenCM
        from chuyenmuc c 
				where c.MaCM_cha != "null" and c.MaCM not in(select b.MaCM
                                    from btv_cm b
                                    where  b.MaBTV  = '${id}')`;
        return db.raw(sql); 
    },
    find_all_category()
    {
        const sql=`
        select MaCM, TenCM
        from chuyenmuc
        where MaCM_cha !="NULL" and TrangThai='1'`;
        return db.raw(sql); 
    },
//-------------------------------------------- Premium ----------------------------------------------------
    all_request()
    {
        const sql=`
        select n.MaUS, n.TenUS
        from prerequest r, nguoidung n
        where n.MaUS=r.MaUS and r.Status="0"`;
        return db.raw(sql); 
    },
    async acceptPremium(id)
    {
        const sql=`
        UPDATE nguoidung 
        set TimePremium = DATE_ADD(CURRENT_TIMESTAMP(),INTERVAL  1 WEEK)
        where MaUS='${id}'`;
        await db.raw(sql); 
    },
    async acceptRequest(id)
    {
        const sql=`
        update prerequest set Status = "1" where MaUS  ='${id}' `;
        await db.raw(sql); 
    },
    //--------------
    
    async findCatname(id)
    {
        let rows = await db('chuyenmuc').where('TenCM', id);
        if (rows.length === 0)
          return null;
        return rows;
    },
    async findTagname(id)
    {
        let rows = await db('nhan').where('TenNhan', id);
        if (rows.length === 0 )
          return null;
        return rows;
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
    addTag_News(nhanBV) {
    // list.push(category);
    return db('bv_nhan').insert(nhanBV);
    },

    // async selectedCats(id){
    //     return db('btv_cm').where('MaBTV', id).where('TrangThai', 1);
    //   },
    async selectedCats(id){
        const sql=`
        select c.MaCM, c.TenCM 
        from btv_cm b, chuyenmuc c
        where b.MaBTV='${id}' and b.MaCM=c.MaCM`
        rows = await db.raw(sql);
        return rows;
      },
    async notSelectedCats(id){
        const sql=`
        select * 
        from chuyenmuc cm
        where cm.MaCM_cha is not NULL and cm.MaCM  not in 
                ( select bcm.MaCM
                    from btv_cm bcm
                    where bcm.MaBTV='${id}' )`
        rows = await db.raw(sql);
        return rows;
      },

};