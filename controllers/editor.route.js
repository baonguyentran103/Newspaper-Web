const express = require('express');
const Auth = require('../middlewares/auth.mdw');
const viewbtvmodel = require('../models/editor.model');
const util = require('util');
const router = express.Router();


router.get('/view/',Auth.authEditor, async function(req, res) {
    //res.render('viewbtv/index');
    //const id="US014";
    const id=req.session.user[0].MaUS;
    const raw_data = await viewbtvmodel.allpaper_btv(id);
    //console.log(id);
    const list_paper = raw_data[0];
    //console.log(list_paper);
    var list_mabv=[];
    if(list_paper.length !==0)
    {
    for(let i=0;i<list_paper.length;i++)
    {
      list_mabv[i]=list_paper[i].MaBV;
    }
  }

    const categories_data=await viewbtvmodel.findall_categories();
    const list_categories=categories_data[0];
    //console.log(list_categories);

    //Test 

 

    //console.log(tag_data);
   // res.render('vwEditor/index', { layout: 'btv.hbs' });

    res.render('vwEditor/index', {
      er0: "1",
      allpaper: list_paper,
      empty: list_paper.length === 0,

      allcategory: list_categories,
      layout: 'editor.hbs'
      //ds_test: test,   

    });
  }),

/*   router.get('/edit', function (req, res) {
    res.render('viewbtv/edit');
  })*/
  router.post('/view/refuse',Auth.authEditor,async function (req, res) {
    const mabtv=req.session.user[0].MaUS;
    //console.log(req.body); 
    const id=req.body.txtCode;
    var newPost={
      TrangThai:  1,
      ChuThich: req.body.txtRefuse,
      BTV_Act: mabtv,
    }
    await  viewbtvmodel.approve_news(id,newPost);
    res.redirect('/editor/view/');
    //res.render('/btv/view/');
  }),

  router.post('/view/approve',Auth.authEditor, async function(req, res) {
    const mabtv=req.session.user[0].MaUS;
    console.log(req.body); 
    const id=req.body.txtCode;
    var newPost={
      MaCM: req.body.txtCategory,
      TrangThai:  3,
      NgayXuatBan: req.body.txtPublicationdate,
      BTV_Act: mabtv,
    }
    console.log(newPost);
    await  viewbtvmodel.approve_news(id,newPost);
    await viewbtvmodel.deleteTag_postByID(id);
    if(typeof req.body.txtTag === "string"){
      var newNhanPost = {
        MaBV: id,
        MaNhan: req.body.txtTag,

      };
      await  viewbtvmodel.addTag_News(newNhanPost);
    }
    else{
      for(let i =0; i<req.body.txtTag.length; ++i){
        var newNhanPost = {
          MaBV: id,
          MaNhan: req.body.txtTag[i],
         };
        await viewbtvmodel.addTag_News(newNhanPost);
      }
    }  
    res.redirect('/editor/view/');
    //res.render('/btv/view/');
  }),
  
  
  router.get('/view',Auth.authEditor, function (req, res, next) {
    res.render('vwEditor/index', {layout: 'editor.hbs'});

  });
  router.get('/view/back',Auth.authEditor,async function (req, res) {
    res.redirect('/editor/view/');
    //res.render('/btv/view/');
  }),
  
  router.post('/get_tag',Auth.authEditor,async function (req, res) {

    const SelectedTags = await viewbtvmodel.selectedTags(req.body.mabv);
    const UnselectedTags = await viewbtvmodel.notSelectedTags(req.body.mabv);
    res.send({
      tag1: SelectedTags,
      tag2: UnselectedTags[0]
    });
  }),
  router.get('/view/1',Auth.authEditor, async function(req, res) {
    //res.render('viewbtv/index');
    //const id="US014";
    const id=req.session.user[0].MaUS;
    const raw_data = await viewbtvmodel.allpaper_approve_btv(id);
    //console.log(id);
    const list_paper = raw_data[0];
    //console.log(list_paper);
    var list_mabv=[];
    if(list_paper.length !==0)
    {
    for(let i=0;i<list_paper.length;i++)
    {
      list_mabv[i]=list_paper[i].MaBV;
    }
  }


    const categories_data=await viewbtvmodel.findall_categories();
    const list_categories=categories_data[0];
    //console.log(list_categories);

    res.render('vwEditor/index1', {
      er1: "1",
      allpaper: list_paper,
      empty: list_paper.length === 0,


      allcategory: list_categories,
      layout: 'editor.hbs'
      //ds_test: test,   

    });
  }),
  router.get('/view/2',Auth.authEditor, async function(req, res) {
    //res.render('viewbtv/index');
    //const id="US014";
    const id=req.session.user[0].MaUS;
    const raw_data = await viewbtvmodel.allpaper_refuse_btv(id);
    //console.log(id);
    const list_paper = raw_data[0];
    //console.log(list_paper);
    var list_mabv=[];
    if(list_paper.length !==0)
    {
    for(let i=0;i<list_paper.length;i++)
    {
      list_mabv[i]=list_paper[i].MaBV;
    }
  }


    const categories_data=await viewbtvmodel.findall_categories();
    const list_categories=categories_data[0];
    //console.log(list_categories);

    res.render('vwEditor/index2', {
      er2: "1",
      allpaper: list_paper,
      empty: list_paper.length === 0,

      allcategory: list_categories,
      layout: 'editor.hbs'
      //ds_test: test,   

    });
  }),

module.exports = router;
