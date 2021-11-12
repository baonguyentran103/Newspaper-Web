const express = require('express');
const Auth = require('../middlewares/auth.mdw');
const adminmodel = require('../models/admin.model');
const util = require('util');
const newsModel = require('../models/news.model');
const router = express.Router();

function createUserID(ListID){
  var res ="";
    if(ListID.length === 0){
      res = "US000";
      return res;
    }
    else{
      var tmp = ListID[ListID.length -1]['MaUS'];
      var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
      var res = num.toString();
      console.log(tmp);
      console.log(num);
      console.log(res);
      if(num<10){
        res = "00" + res;
      }
      else if(num<99){
        res = "0" +res;
      }
      res = "US" +res;
      return res;
    }
}
function createTagID(ListID){
  var res ="";
    if(ListID.length === 0){
      res = "MN000";
      return res;
    }
    else{
      console.log(ListID[ListID.length -1]);
      var tmp = ListID[ListID.length -1]['MaNhan'];
      
      var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
      var res = num.toString();
      if(num<10){
        res = "00" + res;
      }
      else if(num<99){
        res = "0" +res;
      }
      res = "MN" +res;
      return res;
    }
}

function createCatID(ListID){
  var res ="";
    if(ListID.length === 0){
      res = "CM000";
      return res;
    }
    else{
      var tmp = ListID[ListID.length -1]['MaCM'];
      var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
      var res = num.toString();
      if(num<10){
        res = "00" + res;
      }
      else if(num<99){
        res = "0" +res;
      }
      res = "CM" +res;
      return res;
    }
}

//------------------------------------category------------------------------------

router.get('/view/category', Auth.authAdmin, async function (req, res) {
    const raw_data = await adminmodel.categories();
    
    const list_category = raw_data[0];
    
    const raw_data1 = await adminmodel.category_dad();
    
    const list_category_dad = raw_data1[0];
    //console.log(list_category_dad);
    res.render('vwAdmin/category', {
        r3: "1",
        list_category: list_category,
        list_category_dad: list_category_dad,
        empty: list_category.length === 0,

        layout: 'admin1.hbs'
        //ds_test: test,   
  
      });
    }),
router.post('/view/category/delete', Auth.authAdmin, async function (req, res) {
  //console.log(req.body); 
  const id=req.body.txtSubCode;
  await  adminmodel.delete_category(id);
  await  adminmodel.delete_categoryDad(id);
  res.redirect('/admin/view/category');
}),
router.post('/check_cateDad', Auth.authAdmin, async function (req, res) {
  //console.log(req.body); 
  //console.log("1");
  cateDad =await newsModel.getCateDad(req.body.cateID);
  //console.log(cateDad[0][0] );
  if(cateDad == null){
    await adminmodel.activeCate(req.body.cateID);
    res.json("../view/category");
  }
  else{
      if(cateDad[0][0].TrangThai == 0) res.json("fail");
      else{
        await adminmodel.activeCate(req.body.cateID);
        res.json("../view/category");
      } 
  }
}),
router.post('/view/category/edit',Auth.authAdmin, async function (req, res) {
 
  const id=req.body.txtSubCode;
  const  TenCM= req.body.txtSubName;
  const  MieuTaCM= req.body.txtSubDepict;
  const  MaCM_cha= req.body.txtMainCode;
  console.log(MaCM_cha);
  
  if (typeof(MaCM_cha) == "undefined" || MaCM_cha=="none")
  {
  await  adminmodel.edit_category1(id,TenCM,MieuTaCM);
  }
  else
  {
  await  adminmodel.edit_category2(id,TenCM,MieuTaCM,MaCM_cha);
  }
  res.redirect('/admin/view/category');
}),
router.post('/view/category/add',Auth.authAdmin, async function (req, res) {

  const src= await adminmodel.all_code_cat()
  //console.log(src);
  const id= createCatID(src);

  const  TenCM= req.body.txtAddSubName;
  const  MieuTaCM= req.body.txtAddSubDepict;
  const  MaCM_cha= req.body.txtAddMainCode;
  const Status=req.body.txtAddStatus;
  if (typeof(MaCM_cha) == "undefined" || MaCM_cha=="none")
  {
    await adminmodel.add_category0(id,TenCM,MieuTaCM,Status);
  }
  else
  {
  await adminmodel.add_category(id,TenCM,MieuTaCM,MaCM_cha,Status);
  }
  
  res.redirect('/admin/view/category');
}),
//------------------------------------tag------------------------------------
router.get('/view/tag',Auth.authAdmin, async function (req, res) {
  const raw_data = await adminmodel.tags();
  
  const tag = raw_data[0];
  //console.log(list_category);
  res.render('vwAdmin/tag', {
    r4: "1",
      list_tag: tag,
      empty: tag.length === 0,
      layout: 'admin1.hbs'
      //ds_test: test,   

    });
}),
router.post('/view/tag/delete',Auth.authAdmin, async function (req, res) {
  //console.log(req.body); 
  const id=req.body.txtCode;
  await  adminmodel.delete_tag(id);
  res.redirect('/admin/view/tag');
}),
router.post('/view/tag/edit',Auth.authAdmin, async function (req, res) {

  const id=req.body.txtCode;
  const  value= req.body.txtValue;
  await  adminmodel.edit_tag(id,value);
  res.redirect('/admin/view/tag');
}),
router.post('/view/tag/add_del',Auth.authAdmin, async function (req, res) {

  const id=req.body.txtCode;
  const  value= req.body.txtValue;
  const  status= req.body.txtStatus;
  await  adminmodel.add_del_tag(id,value,status);
  res.redirect('/admin/view/tag');
}),
router.post('/view/tag/add',Auth.authAdmin, async function (req, res) {
  const src= await adminmodel.all_code_tag()
  const id= createTagID(src);
  const  value= req.body.txtValue;
  const  status= req.body.txtStatus;
  console.log(req.body);
  await adminmodel.add_tag(id,value,status);
  res.redirect('/admin/view/tag');
}),

//------------------------------------post------------------------------------
router.get('/view/post',Auth.authAdmin, async function (req, res) {
  const raw_data_published = await adminmodel.post_public();
  const list_post_public = raw_data_published[0];
  //----
  const raw_data_waitting = await adminmodel.post_waitting();
  const list_post_waitting = raw_data_waitting[0];
  //----
  const raw_data_approve = await adminmodel.post_approve();
  const list_post_approve = raw_data_approve[0];
  //----
  const raw_data_refuse = await adminmodel.post_refuse();
  const list_post_refuse = raw_data_refuse[0];
  //----
  const raw_data_deleted = await adminmodel.post_deleted();
  const list_post_deleted = raw_data_deleted[0];
  //console.log(list_category);
  res.render('vwAdmin/post', {
      list_post_public: list_post_public,
      empty_public: list_post_public.length === 0,
      //----
      list_post_waitting: list_post_waitting,
      empty_waitting: list_post_waitting.length === 0,
      //----
      list_post_approve:list_post_approve,
      empty_approve: list_post_approve.length === 0,
      //----
      list_post_refuse: list_post_refuse,
      empty_refuse: list_post_refuse.length === 0,
      //----
      list_post_deleted:list_post_deleted,
      empty_deleted: list_post_deleted.length ===0,
      //--------------------------------------------
      layout: 'admin1.hbs'
      //ds_test: test,   

    });
}),
router.get('/view/p_published',Auth.authAdmin, async function (req, res) {
  const categories_data=await adminmodel.find_all_category();
  const list_categories=categories_data[0];

  const raw_data_published = await adminmodel.post_public();
  const list_post_public = raw_data_published[0];
  console.log(list_categories);
  res.render('vwAdmin/post_published', {
    p1: "1",
    r1: "1",
    type:"3",
    allcategory: list_categories,
    list_post_public: list_post_public,
    empty_public: list_post_public.length === 0,
    layout: 'admin1.hbs'
  });
}),
router.get('/view/p_draft',Auth.authAdmin, async function (req, res) {
  const categories_data=await adminmodel.find_all_category();
  const list_categories=categories_data[0];

  const raw_data_waitting = await adminmodel.post_waitting();
  const list_post_waitting = raw_data_waitting[0];
  res.render('vwAdmin/post_drw', {
    p3: "1",
    r1: "1",
    title: "Draft",
    type:"0",
    allcategory: list_categories,
    list_post: list_post_waitting,
    empty: list_post_waitting.length === 0,
    layout: 'admin1.hbs'
  });
}),
router.get('/view/p_waiting',Auth.authAdmin, async function (req, res) {
  const categories_data=await adminmodel.find_all_category();
  const list_categories=categories_data[0];

  const raw_data_approve = await adminmodel.post_approve();
  const list_post_approve = raw_data_approve[0];
  res.render('vwAdmin/post_wait', {
    p2: "1",
    r1: "1",
    title: "Waiting For Publication",
    type:"2",
    allcategory: list_categories,
    list_post:list_post_approve,
    empty: list_post_approve.length === 0,
    layout: 'admin1.hbs'
  });
}),
router.get('/view/p_refuse',Auth.authAdmin, async function (req, res) {
  const categories_data=await adminmodel.find_all_category();
  const list_categories=categories_data[0];

  const raw_data_refuse = await adminmodel.post_refuse();
  const list_post_refuse = raw_data_refuse[0];
  res.render('vwAdmin/post_drw', {
    p4: "1",
    r1: "1",
    title: "Refuse",
    type:"1",
    allcategory: list_categories,
    list_post: list_post_refuse,
      empty: list_post_refuse.length === 0,
    layout: 'admin1.hbs'
  });
}),
router.get('/view/p_deleted',Auth.authAdmin, async function (req, res) {
  const categories_data=await adminmodel.find_all_category();
  const list_categories=categories_data[0];

  const raw_data_deleted = await adminmodel.post_deleted();
  const list_post_deleted = raw_data_deleted[0];
  res.render('vwAdmin/post_deleted', {
    p5: "1",
    r1: "1",
    title:"Deleted",
    type:"5",
    allcategory: list_categories,
    list_post_deleted:list_post_deleted,
      empty_deleted: list_post_deleted.length ===0,
    layout: 'admin1.hbs'
  });
}),
router.post('/view/post/delete',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  console.log(type);
  await adminmodel.delete_post(id);
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
}),
router.post('/view/post/add_premium',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  console.log(req.body);
  await adminmodel.add_premium(id);
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
  if(type=="5")
  res.redirect('/admin/view/p_deleted');
}),
router.post('/view/post/exit_premium',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  console.log(req.body);
  await adminmodel.exit_premium(id);
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
  if(type=="5")
  res.redirect('/admin/view/p_deleted');
}),
router.post('/view/post/publish',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  console.log(req.body);
  await adminmodel.publish_post(id);
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
  if(type=="5")
  res.redirect('/admin/view/p_deleted');
}),
router.post('/view/post/extend',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const trangthai=req.body.txtTrangThai;
  const type=req.body.txtType;
  console.log(req.body);
  await adminmodel.extend_post(id,trangthai);
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
  if(type=="5")
  res.redirect('/admin/view/p_deleted');
}),
router.post('/view/post/edit',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  var newPost={
    MaCM: req.body.txtCategory,
  }
  console.log(newPost);
  await  adminmodel.approve_news(id,newPost);
  await adminmodel.deleteTag_postByID(id);
  if(typeof req.body.txtTag === "string"){
    var newNhanPost = {
      MaBV: id,
      MaNhan: req.body.txtTag,

    };
    await  adminmodel.addTag_News(newNhanPost);
  }
  else{
    for(let i =0; i<req.body.txtTag.length; ++i){
      var newNhanPost = {
        MaBV: id,
        MaNhan: req.body.txtTag[i],
       };
      await adminmodel.addTag_News(newNhanPost);
    }
  }  
  const type=req.body.txtType;
  if(type=="0")
  res.redirect('/admin/view/p_draft');
  if(type=="1")
  res.redirect('/admin/view/p_refuse');
  if(type=="2")
  res.redirect('/admin/view/p_waiting');
  if(type=="3")
  res.redirect('/admin/view/p_published');
  if(type=="5")
  res.redirect('/admin/view/p_deleted');
}),
//------------------------------------fix post--------------------------------
router.post('/view/post_w/delete',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  //console.log(type);
  await adminmodel.delete_post(id);
  res.redirect('/admin/view/p_waiting');
}),
router.post('/view/post_w/add_premium',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  await adminmodel.add_premium(id);
  res.redirect('/admin/view/p_waiting');
 
}),
router.post('/view/post_w/exit_premium',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  await adminmodel.exit_premium(id);
  res.redirect('/admin/view/p_waiting');
 
}),
router.post('/view/post_w/publish',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  const type=req.body.txtType;
  console.log(req.body);
  await adminmodel.publish_post(id);
  res.redirect('/admin/view/p_waiting');
}),
router.post('/view/post_w/edit',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  var newPost={
    MaCM: req.body.txtCategory,
  }
  console.log(newPost);
  await  adminmodel.approve_news(id,newPost);
  await adminmodel.deleteTag_postByID(id);
  if(typeof req.body.txtTag === "string"){
    var newNhanPost = {
      MaBV: id,
      MaNhan: req.body.txtTag,

    };
    await  adminmodel.addTag_News(newNhanPost);
  }
  else{
    for(let i =0; i<req.body.txtTag.length; ++i){
      var newNhanPost = {
        MaBV: id,
        MaNhan: req.body.txtTag[i],
       };
      await adminmodel.addTag_News(newNhanPost);
    }
  }  
  const type=req.body.txtType;
  res.redirect('/admin/view/p_waiting');

}),
//------------------------------------test------------------------------------
router.get('/view/test',Auth.authAdmin,  async function (req, res) {
  const raw_data = await adminmodel.all_writer();
  //console.log(raw_data);
  const list_writer = raw_data[0];
  res.render('vwAdmin/test_writer', {
      list_writer: list_writer,
      empty: list_writer.length === 0,
      layout: 'admin1.hbs'
      //ds_test: test,   
    });
}),
//------------------------------------writer------------------------------------
router.get('/view/writer',Auth.authAdmin,  async function (req, res) {
  const raw_data = await adminmodel.all_writer();
  //console.log(raw_data);
  const list_writer = raw_data[0];
  res.render('vwAdmin/writer', {
    u2: "1",
    r2: "1",
      list_writer: list_writer,
      empty: list_writer.length === 0,
      layout: 'admin1.hbs'
      //ds_test: test,   
    });
}),
router.post('/view/writer/delete',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.delete_writer(id);
  res.redirect('/admin/view/writer');
}),
router.post('/view/writer/add',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.add_writer(id);
  res.redirect('/admin/view/writer');
}),
//------------------------------------editor------------------------------------
router.get('/view/editor', Auth.authAdmin, async function (req, res) {
  const raw_data = await adminmodel.all_editor();
  //console.log(raw_data);
  const list_editor = raw_data[0];
  res.render('vwAdmin/editor', {
    u1: "1",
    r2: "1",
    list_editor: list_editor,
      empty: list_editor.length === 0,
      layout: 'admin1.hbs'
      //ds_test: test,   
    });
}),
router.post('/view/editor/delete',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.delete_editor(id);
  res.redirect('/admin/view/editor');
}),
router.post('/view/editor/add',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.add_editor(id);
  res.redirect('/admin/view/editor');
}),
//------------------------------------subscriber------------------------------------
router.get('/view/subscriber',Auth.authAdmin,  async function (req, res) {
  const raw_data = await adminmodel.all_subscriber();
  //console.log(raw_data);
  const list_subscriber = raw_data[0];
  res.render('vwAdmin/subscriber', {
    u3: "1",
    r2: "1",
    list_subscriber: list_subscriber,
      empty: list_subscriber.length === 0,
      layout: 'admin1.hbs'
      //ds_test: test,   
    });
}),
router.post('/view/subscriber/delete',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.delete_sub(id);
  res.redirect('/admin/view/subscriber');
}),
router.post('/view/subscriber/add',Auth.authAdmin, async function (req, res) {
  const id=req.body.txtCode;
  await adminmodel.add_sub(id);
  res.redirect('/admin/view/subscriber');
}),
//------------------------------------manage user------------------------------------
router.get('/view/manageUser',Auth.authAdmin,  async function (req, res) {


    res.redirect("/admin/view/update-editor");
}),
//------------------------------------add user------------------------------------
router.get('/view/add-editor', Auth.authAdmin, async function (req, res) {

  res.render('vwAdmin/add-editor', {
    u4: "1",
    r2: "1",

      layout: 'admin1.hbs'
   
    });
}),
router.get('/view/add-writer', Auth.authAdmin, async function (req, res) {

  res.render('vwAdmin/add-writer', {
    u4: "1",
    r2: "1",

      layout: 'admin1.hbs'
   
    });
}),
router.get('/view/add-subscriber',Auth.authAdmin,  async function (req, res) {

  res.render('vwAdmin/add-subscriber', {
    u4: "1",
    r2: "1",

      layout: 'admin1.hbs'
   
    });
}),
//------------------------------------update user------------------------------------

router.get('/view/update-editor', Auth.authAdmin, async function (req, res) {

  var src=await adminmodel.all_editor_category();
    //console.log(src);
    var NewsofCategory = src[0];
    //console.log(NewsofCategory);
//    let newArr = [NewsofCategory[0]]
//
//    if(NewsofCategory.length !==0)
//{
//  for (let i = 1; i < NewsofCategory.length; i++) {
//    if (NewsofCategory[i].MaUS === NewsofCategory[i - 1].MaUS) {
//      newArr[newArr.length-1].MaCM=newArr[newArr.length-1].MaCM+'/'+NewsofCategory[i].MaCM;
//      //
//      newArr[newArr.length-1].TenCM=newArr[newArr.length-1].TenCM+'/'+NewsofCategory[i].TenCM;
//    //
//    }
//    else{
//      
//      if(newArr[newArr.length-1].TenCM.includes(" ")!==true)
//      {
//        newArr[newArr.length-1].TenCM=[newArr[newArr.length-1].TenCM];
//      }
//      else
//      {newArr[newArr.length-1].TenCM=newArr[newArr.length-1].TenCM.split(' ');}
//
//      //
//      if(newArr[newArr.length-1].MaCM.includes(" ")!==true)
//      {
//        newArr[newArr.length-1].MaCM=[newArr[newArr.length-1].MaCM];
//      }
//      else
//      {newArr[newArr.length-1].MaCM=newArr[newArr.length-1].MaCM.split(' ');}
//      //
//
//      newArr.push(NewsofCategory[i]);
//    }
//  }
//  }
//  if(newArr[newArr.length-1].TenCM.includes(" ")!==true)
//      {
//        newArr[newArr.length-1].TenCM=[newArr[newArr.length-1].TenCM];
//      }
//      else
//      {newArr[newArr.length-1].TenCM=newArr[newArr.length-1].TenCM.split(' ');}
  //
//  if(newArr[newArr.length-1].MaCM.includes(" ")!==true)
//  {
//    newArr[newArr.length-1].MaCM=[newArr[newArr.length-1].MaCM];
//  }
//  else
//  {newArr[newArr.length-1].MaCM=newArr[newArr.length-1].MaCM.split(' ');}
  //
  NewsofCategory.forEach(item => {
    if(item.MaCM!==null) {
    item.MaCM=item.MaCM.split(',');
    item.TenCM=item.TenCM.split(',');}
  });
NewsofCategory.forEach(item => {
    item.Cat=[];
    if(item.MaCM!==null) 
    {
      for(let i=0; i<item.TenCM.length; i++) {
        item.Cat.push({MaCM: item.MaCM[i],TenCM: item.TenCM[i]});
      }
    }
    else
    {
      item.Cat.push({MaCM: "",TenCM: ""});
    }
  });
  console.log(NewsofCategory)

  res.render('vwAdmin/update-editor', {
    u4: "1",
    r2: "1",
    list_ed_ca: NewsofCategory,
    empty: NewsofCategory.length === 0,
    layout: 'admin1.hbs'
   
    });
}),

router.get('/view/edit_editor',Auth.authAdmin,  async function (req, res) {

  //console.log("12345678");
  var id = req.query.id || 0;
  
  const raw_data = await adminmodel.find_name_by_id(id);
  const list_editor_cat = raw_data[0];
  console.log(list_editor_cat);
  
  const raw_data1 = await adminmodel.find_not_category_by_id(id);
  const list_not_cate = raw_data1[0];

  
  const raw_data2 = await adminmodel.find_category_by_id(id);
  const list_codeCat = raw_data2[0];
  console.log(id);
  res.render('vwAdmin/edit_editor', {
    u4: "1",
    r2: "1",
    //code:list_editor_cat[0].MaUS,
    code: id,
    name:list_editor_cat[0].TenUS,
    //list_editor_cat: list_editor_cat.TenCM,
    list_cat: list_codeCat,
    list_not_cat: list_not_cate,
    //list_editor_cat: list_editor_cat,
    layout: 'admin_update_ed_layout.hbs'
    });
}),

router.get('/view/update-writer', Auth.authAdmin, async function (req, res) {

  res.render('vwAdmin/update-writer', {
    u4: "1",
    r2: "1",

      layout: 'admin1.hbs'
   
    });
}),
router.get('/view/update-subscriber',Auth.authAdmin,  async function (req, res) {

  res.render('vwAdmin/update-subscriber', {
    u4: "1",
    r2: "1",

      layout: 'admin1.hbs'
   
    });
}),
router.post('/view/mana_editor', Auth.authAdmin, async function (req, res) {
  console.log(req.body); 
  const id=req.body.txtCode;
  console.log(req.body.txtCat); 
  await  adminmodel.delBTV_CM(id);undefined
  if(req.body.txtCat == undefined)
  {
     await adminmodel.delBTV_CM(id);
    res.redirect('/admin/view/update-editor');
  }
  if(typeof req.body.txtCat === "string"){
    var src = {
      MaBTV: id,
      MaCM: req.body.txtCat,
      TrangThai: 1,
      };
    await adminmodel.addBTV_CM(src);
  }
  else{
    for(let i =0; i<req.body.txtCat.length; ++i){
      var src = {
        MaBTV: id,
        MaCM: req.body.txtCat[i],
        TrangThai: 1,
        };
      await adminmodel.addBTV_CM(src);
    } 
  }  


 
  res.redirect('/admin/view/update-editor');
}),
//------------------------------------extension------------------------------------
router.get('/view/extension', Auth.authAdmin, async function (req, res) {
  const raw_data = await adminmodel.all_request();
  const list_requesst = raw_data[0];
  res.render('vwAdmin/extension', {
    u5: "1",
    r2: "1",
    list_requesst:list_requesst,
    layout: 'admin1.hbs'
 
  });
}),
router.post('/view/req_premium',Auth.authAdmin,  async function (req, res) {
  //console.log(req.body); 
  // var src=req.body.txtDateTime;
  // var x1=src.substring(0,10);
  // var x2=src.substring(11,16);
  // var x3=x1+' '+x2+":00";
  // //console.log(x3);
  // await adminmodel.acceptPremium(x3,req.body.txtCode);
  // await adminmodel.acceptRequest(req.body.txtCode);
  await adminmodel.acceptPremium(req.body.txtCode);
  await adminmodel.acceptRequest(req.body.txtCode);
  res.redirect('/admin/view/extension');
}),
router.post('/check_cat', Auth.authAdmin, async function (req, res) {
  const name = await adminmodel.findCatname(req.body.name_cat);
    if (name === null) {
      return res.json("success");
      }
    return res.json("fail");
  }),
  router.post('/check_tag', Auth.authAdmin, async function (req, res) {
    const name = await adminmodel.findTagname(req.body.name_tag);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      if (name === null) {
        return res.json("success");
        }
      return res.json("fail");
    }),

    router.post('/get_tag',Auth.authAdmin,async function (req, res) {

      const SelectedTags = await adminmodel.selectedTags(req.body.MaBV);
      const UnselectedTags = await adminmodel.notSelectedTags(req.body.MaBV);
      res.send({
        tag1: SelectedTags,
        tag2: UnselectedTags[0]
      });
    }),

    router.post('/get_cat',Auth.authAdmin,async function (req, res) {

      const SelectedCats = await adminmodel.selectedCats(req.body.MaUS);
      const UnselectedCats = await adminmodel.notSelectedCats(req.body.MaUS);
      console.log(SelectedCats[0]);
      res.send({
        cat1: SelectedCats[0],
        cat2: UnselectedCats[0]
      });
    }),


module.exports = router;

