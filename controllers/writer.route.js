const express = require('express');
const Auth = require('../middlewares/auth.mdw');
const writerModel = require('../models/writer.model');
const router = express.Router();

function createNewPostID(ListID){
    var res ="";
      if(ListID.length === 0){
        res = "BV000";
        return res;
      }
      else{
        var tmp = ListID[ListID.length -1]['MaBV'];
        var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
        var res = num.toString();
        //console.log(tmp);
        //console.log(num);
       // console.log(res);
        if(num<10){
          res = "00" + res;
        }
        else if(num<99){
          res = "0" +res;
        }
        res = "BV" +res;
        return res;
      }
  }
  function convertDate(){
    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate();
    return formatted_date;
  }
  router.get('/writeNews', Auth.authWriter, async function(req, res){
    if(req.session.auth && req.session.user[0].LoaiUS == "Writer"){
      res.locals.Tags = await writerModel.allTags();
      res.render('vwWriter/writeNews', {
        r1: "1",
        category: res.locals.Lcategory,
        category2: res.locals.Lcategory2,
        nhan: res.locals.Tags,
        layout:  'writer.hbs'
      })
    }
    else res.redirect("/home");
  })
  router.post('/writeNews', Auth.authWriter,async function (req, res) {
    res.locals.allPostID  = await writerModel.allNews();
    res.locals.now = convertDate();
    res.locals.newPostID = createNewPostID(res.locals.allPostID);
    
    var newPost ={
      MaBV: res.locals.newPostID,
      TieuDe: req.body.title,
      NgayDang: res.locals.now,
      MaCM: req.body.CateName,
      MaTG: req.session.user[0].MaUS,
      LinkAnhDD: req.body.Avatar,
      TomTat: req.body.abstract,
      NoiDung: req.body.content,
      TrangThai:0,
      LuotView:0,
      NgayXuatBan:"0000-00-00"
    }
    await writerModel.addNews(newPost);
    if(typeof req.body.nhan === "string"){
      var newNhanPost = {
        MaBV: res.locals.newPostID,
        MaNhan: req.body.nhan
      };
      await writerModel.addTag_News(newNhanPost);
    }
    else{
      for(let i =0; i<req.body.nhan.length; ++i){
        var newNhanPost = {
          MaBV: res.locals.newPostID,
          MaNhan: req.body.nhan[i]
        };
        await writerModel.addTag_News(newNhanPost);
      }
    }
    res.redirect("/Writer/writeNews");
  });
  router.get('/editContent', Auth.authWriter ,async function(req, res){
    const id = req.query.id;
    const post = await writerModel.getNewsbyID(id);
    if(req.session.user[0].MaUS !== post[0]["MaTG"]) res.redirect("/home");
    const SelectedTags = await writerModel.selectedTags(id);
    const UnselectedTags = await writerModel.notSelectedTags(id);
    const SelectedCate = await writerModel.selectedCategory(id);
    const UnselectedCate = await writerModel.notSelectedCategory(SelectedCate[0]['MaCM']);
    res.render('vwWriter/editContent', {
      news: post,
      tag1: SelectedTags,
      tag2: UnselectedTags[0],
      cate1: SelectedCate,
      cate2: UnselectedCate,
      layout: "writer.hbs"
    })
  })
  router.post('/editContent', Auth.authWriter, async function(req, res){
    const id = req.query.id;
    const nows = convertDate();
    var newPost ={
      TieuDe: req.body.title,
      NgayDang: nows,
      MaCM: req.body.CateName,
      LinkAnhDD: req.body.Avatar,
      TomTat: req.body.abstract,
      NoiDung: req.body.content,
      ChuThich: "",
      TrangThai:0,
    }
    await writerModel.deleteTag_postByID(id);
    await writerModel.updatePostByID(id, newPost);
    if(typeof req.body.nhan === "string"){
      var newNhanPost = {
        MaBV: id,
        MaNhan: req.body.nhan
      };
      await writerModel.addTag_News(newNhanPost);
    }
    else{
      for(let i =0; i<req.body.nhan.length; ++i){
        var newNhanPost = {
          MaBV: id,
          MaNhan: req.body.nhan[i]
        };
        await writerModel.addTag_News(newNhanPost);
      }
    }
    res.redirect("/writer/view/edit/2");
  });

//Thắng --------------


  router.get('/', Auth.authWriter, async function (req, res) {
    const id=req.session.user[0].MaUS;
    const list = await writerModel.allpaperof_reporter(id);
    //console.log(list);
    res.render('vwWriter/index', {
      allpaper: list,
      empty: list.length === 0,
      layout: 'writer.hbs'
    });
  })
  router.get('/view/1', Auth.authWriter, async function (req, res) {
    const id=req.session.user[0].MaUS;
    const list = await writerModel.paper_waiting(id);
    //console.log(list[0]);
    res.render('vwWriter/index', {
      r2: "1",
      allpaper: list[0],
      empty: list.length === 0,
      layout: 'writer.hbs'
    });
  })
  router.get('/view/2', Auth.authWriter, async function (req, res) {
    const id=req.session.user[0].MaUS;
    const list = await writerModel.paper_pass(id);
    //console.log(list);
    res.render('vwWriter/index2', {
      r3: "1",
      allpaper: list[0],
      empty: list.length === 0,
      layout: 'writer.hbs'
    });
  })

  router.get('/view/edit/1', Auth.authWriter, async function (req, res) {
    const id=req.session.user[0].MaUS;
    const list = await writerModel.paper_refuse(id);
    //console.log(list);
    res.render('vwWriter/edit', {
      r4: "1",
      allpaper: list,
      empty: list.length === 0,
      layout: 'writer.hbs'
    });
  })

  router.get('/view/edit/2', Auth.authWriter, async function (req, res) {
    const id=req.session.user[0].MaUS;
    const list = await writerModel.paper_check_yet(id);
    //console.log(list);
    res.render('vwWriter/not_approved_yet', {
      r5: "1",
      allpaper: list,
      empty: list.length === 0,
      layout: 'writer.hbs'
    });
  })

  router.get('/view', Auth.authWriter, function (req, res) {
    //res.render('vwWriter/index', {layout: 'writer.hbs'});
    res.redirect('/writer/writeNews')
 
  });
  router.get('/edit', Auth.authWriter, function (req, res) {
    res.render('vwWriter/edit', {layout: 'writer.hbs'});
 
  });
  module.exports = router;
  