const express = require('express');
const Auth = require('../middlewares/auth.mdw');
const databaseModel = require('../models/news.model');

const router = express.Router();

async function IsUserPremium(id){
  user = await databaseModel.getUserbyID(id);
  let DEP = user[0].TimePremium;
  console.log(user);
  if(DEP == null) return false;
  let current_datetime = new Date();
  if(current_datetime<DEP)return true;
  else{
    await databaseModel.removePremiumUser(id);
    return false;
  }
}

router.get('/caterogy', async function (req, res) {
 
  const limit=6;
  const id=req.query.id;
  const tag = req.query.tag;
  const search=req.query.search;
  const type=req.query.type;
  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * limit;

  let NameCategory;
  let NewsofCategory;
  let Raw_data;
  let Title;
  let CountNews;
  let Code;
  let State;
  let Description;
  if(typeof(id) !== "undefined")
  {
    Code = id;
    State=1;
    NameCategory= await databaseModel.findById(id);
    console.log(NameCategory)
    if(NameCategory===null) {return res.redirect('/404');}
    Raw_data= await databaseModel.findNewById(id, offset);
    CountNews= await databaseModel.CountNewsByID(id);
    Title=NameCategory[0].TenCM;
    Description=NameCategory[0].MieuTaCM;
    NewsofCategory=Raw_data[0];
  }
  if(typeof(tag) !== "undefined")
  {
    State=2;
    Code=tag;
    NameCategory= await databaseModel.findByTag(tag);
    if(NameCategory===null) {return res.redirect('/404');}
    Raw_data= await databaseModel.findNewByTag(tag, offset);
    CountNews= await databaseModel.CountNewsByTag(tag);
    NewsofCategory=Raw_data[0];
    Title=NameCategory[0].TenNhan;
  }
  
  if(typeof(search) !== "undefined")
  {
    State=3;
    Code=search;
    Title=`@${search}`;
    if(type==='Title')
    {
      Raw_data= await databaseModel.findNewBySearch_Title(search,offset);
      CountNews= await databaseModel.CountNewsBySearch_Title(search);
    }
    if(type==='Summary')
    {
      Raw_data= await databaseModel.findNewBySearch_Summary(search,offset);
      CountNews= await databaseModel.CountNewsBySearch_Summary(search);
    }
    if(type==='Content')
    {
      Raw_data= await databaseModel.findNewBySearch_Content(search,offset);
      CountNews= await databaseModel.CountNewsBySearch_Content(search);
    }
    NewsofCategory=Raw_data[0];
  }
  // let newArr = [NewsofCategory[0]]
  
  // for (let i = 1; i < NewsofCategory.length; i++) {
  //   if (NewsofCategory[i].MaBV === NewsofCategory[i - 1].MaBV) {
  //     newArr[newArr.length-1].TenNhan=newArr[newArr.length-1].TenNhan+' '+NewsofCategory[i].TenNhan;
  //     newArr[newArr.length-1].MaNhan=newArr[newArr.length-1].MaNhan+' '+NewsofCategory[i].MaNhan;
  //   }
  //   else{
      
  //     if(newArr[newArr.length-1].TenNhan.includes(" ")!==true)
  //     {
  //       newArr[newArr.length-1].TenNhan=[newArr[newArr.length-1].TenNhan];
  //       newArr[newArr.length-1].MaNhan=[newArr[newArr.length-1].MaNhan];
  //     }
  //     else
  //     {
  //       newArr[newArr.length-1].TenNhan=newArr[newArr.length-1].TenNhan.split(' ');
  //       newArr[newArr.length-1].MaNhan=newArr[newArr.length-1].MaNhan.split(' ');
  //     }
  //     newArr.push(NewsofCategory[i]);
  //   }}
  //   if(newArr[newArr.length-1].TenNhan.includes(" ")!==true)
  //       {
  //         newArr[newArr.length-1].TenNhan=[newArr[newArr.length-1].TenNhan];
  //         newArr[newArr.length-1].MaNhan=[newArr[newArr.length-1].MaNhan];
  //       }
  //       else
  //       {
  //         newArr[newArr.length-1].TenNhan=newArr[newArr.length-1].TenNhan.split(' ');
  //         newArr[newArr.length-1].MaNhan=newArr[newArr.length-1].MaNhan.split(' ');
  //       }
  //   newArr.forEach(item => {
  //     item.Nhan=[];
  //     for(let i=0; i<item.TenNhan.length; i++) {
  //       item.Nhan.push({TenNhan: item.TenNhan[i],MaNhan: item.MaNhan[i]});
  //     }
  //   });
  //   //console.log(newArr);
  
   NewsofCategory.forEach(item => {
      item.TenNhan=item.TenNhan.split(',');
      item.MaNhan=item.MaNhan.split(',');
    });
  NewsofCategory.forEach(item => {
      item.Nhan=[];
      for(let i=0; i<item.TenNhan.length; i++) {
        item.Nhan.push({TenNhan: item.TenNhan[i],MaNhan: item.MaNhan[i]});
      }
    });
    //console.log(NewsofCategory)
    let nPages = Math.floor(CountNews[0].Count/ limit);
    if (CountNews[0].Count % limit > 0) nPages++;

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page
    });
  }
  let cateDadd =null;
  if(typeof(NameCategory) != "undefined"){
    cateDadd = NameCategory[0].MaCM_cha;
  }
  //console.log(page_numbers);
  res.render('vwNews/listNews.hbs',{
    NewsofCategory, 
    Title, 
    page_numbers,
    Code,
    State, 
    page,
    type,
    Description,
    MaCMDad:cateDadd
  });
});
router.get('/category', async function(req, res){
  id = req.query.id;
  cate = await databaseModel.getCateByID(id);
  if(cate == null){
    res.redirect("../404");
  }
  else{
    catesChild = await databaseModel.getCateChild(id);
    for(let i=0; i< catesChild.length; i=i+1){
      catesChild[i].bv = await databaseModel.getNewsForCateDad(catesChild[i].MaCM);
      for(let j =0; j< catesChild[i].bv.length; j=j+1){
        catesChild[i].bv[j].nhan = await databaseModel.selectedTags(catesChild[i].bv[j].MaBV);
      }
    }
    res.render('vwNews/listNewsDad', {
      Cate: cate[0],
      CateChild: catesChild,
      MaCMDad: id
    });
  }
})
function random(length){
  return Math.floor(Math.random() * length);
}
router.get('/', async function (req, res){
  const id = req.query.id;
  UserPre = false;
  newss = await databaseModel.getNewsbyID(id);
  if(newss==null) res.redirect("../404");
  else{
    if(req.session.auth){
      UserPre = await IsUserPremium(req.session.user[0].MaUS);
    }
    if(newss[0].IsPremium){
      if(req.session.auth == false){
        req.session.needSign =true;
        res.redirect("/home");
      }
      else if(UserPre == false){
        req.session.needPre =true;
        res.redirect("/account/profile");
      }
    }
    databaseModel.increaViews(id);
    cateDate = await databaseModel.getCateDad(newss[0]['MaCM'])
    cate = await databaseModel.getCateByID(newss[0]['MaCM'])
    coments = await databaseModel.getCommentsByID(id);
    posts = await databaseModel.getNewsbyCate(newss[0]['MaCM'], newss[0].MaBV);
    tags = await databaseModel.selectedTags(id);
    let postid = [];
    let Relative = Math.min(5, posts.length);
    let fivePost=[]
    console.log("sss",UserPre);
    for(let i =0; i<Relative; ++i){
      let x = random(posts.length);
      if(i==0)postid.push(x);
      else{
        let check =0;
        while(check ==0){
          for(let j =0; j <postid.length; ++j){
            if(x==postid[j]){
              check =1;
              break;
            }
          }
          if(check ==1)x = random(posts.length);
          check =1-check;
        }
        postid.push(x);
      }
      fivePost.push(posts[x]);
    }
    res.render('vwNews/index2',{
      news: newss,
      CateDad: cateDate[0],
      Cate: cate,
      Comments:coments,
      fivePosts: fivePost,
      auth: req.session.auth === true,
      Tags: tags,
      UsPre: UserPre,
      MaCMDad: cateDate[0][0].MaCM
    })
  }
  
});
function convertDate(){
  let current_datetime = new Date()
  let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate();
  return formatted_date;
}
function createNewCommentID(ListID){
  var res ="";
    if(ListID.length === 0){
      res = "BL000";
      return res;
    }
    else{
      var tmp = ListID[ListID.length -1]['MaBL'];
      var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
      var res = num.toString();
      if(num<10){
        res = "00" + res;
      }
      else if(num<99){
        res = "0" +res;
      }
      res = "BL" +res;
      return res;
    }
}

router.post('/', async function (req, res){
  const id = req.query.id;
  coments = await databaseModel.getCommentsByID(id);
  comentsList = await await databaseModel.getCommentsList();
  const newCMT = {
    MaBL: createNewCommentID(comentsList),
    MaBV: id,
    TenUS: req.session.user[0].TenUS,
    NoiDung: req.body.message,
    ThoiGian: convertDate()
  }
  await databaseModel.postComment(newCMT);
  res.redirect(`/news/?id=${id}`)
});
router.get('/print',  async function (req, res){
  const id = req.query.id;
  UserPre = false;
  newss = await databaseModel.getNewsbyID(id);
  if(newss==null) res.redirect("../404");
  else{
    if(req.session.auth){
      UserPre = await IsUserPremium(req.session.user[0].MaUS);
      if(UserPre == true){
        res.render('vwNews/indexPrint',{
          news: newss,
          layout:'print.hbs'
        });
      }
      else{
        req.session.needPre =true;
        res.redirect("/account/profile");
      }
    }
    else{
      req.session.needSign =true;
      res.redirect("/home");
    }
  }
});
router.get('/forAEW', Auth.authWriter,  async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexPrint',{
    news: newss,
    layout:'writer.hbs'
  })
});

router.get('/forAEW_0w', Auth.authWriter,  async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    r2: "1",
    news: newss,
    layout:'writer.hbs'
  })
});
router.get('/forAEW_0p', Auth.authWriter,  async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    r3: "1",
    news: newss,
    layout:'writer.hbs'
  })
});

router.get('/forAEW_2',  async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    
    news: newss,
    layout:'Editor_viewpaper.hbs'
  })
});
router.get('/forAEW_3',  Auth.authAdmin, async function (req, res){
  const src = req.query.id;
  const id=src.substring(0, 5);
  const type=src.substring(11, 12)
  console.log(src);
  console.log(id);
  console.log(type);
  newss = await databaseModel.AEW_getNewsbyID(id);
  if(type==="0")
  {
  res.render('vwNews/indexNotPrint',{
    type_a: "1",
    news: newss,
    p3: "1",
    r1: "1",
    
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  })
  }
  if(type==="1")
  {
  res.render('vwNews/indexNotPrint',{
    type_b: "1",
    news: newss,
    p4: "1",
    r1: "1",
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  })
  }
  if(type==="2")
  {
  res.render('vwNews/indexNotPrint',{
    type_c: "1",
    news: newss,
    p2: "1",
    r1: "1",
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  })
  }
  if(type==="3")
  {
  res.render('vwNews/indexNotPrint',{
    type_d: "1",
    news: newss,
    p1: "1",
    r1: "1",
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  })
  }
  if(type==="5")
  {
  res.render('vwNews/indexNotPrint',{
    type_e: "1",
    news: newss,
    p5: "1",
    r1: "1",
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  })
  }
});


router.get('/forAEW_5',  Auth.authAdmin, async function (req, res){
  // Dành cho bài waiting for publish
  const src = req.query.id;
  const id=src.substring(0, 5);
  const type=src.substring(11, 12)
  console.log(src);
  console.log(id);
  console.log(type);
  newss = await databaseModel.AEW_getNewsbyID(id); 
  res.render('vwNews/indexNotPrint',{
    type_c: "1",
    news: newss,
    p2: "1",
    r1: "1",
    //layout:'Admin_viewpaper.hbs'
    layout:'admin1.hbs'
  });

});
router.get('/forAEW_4a', Auth.authEditor, async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    er0: "1",
    news: newss,
    //layout:'Editor_viewpaper.hbs'
    layout: 'editor.hbs'
  })
});
router.get('/forAEW_4b', Auth.authEditor, async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    er1: "1",
    news: newss,
    //layout:'Editor_viewpaper.hbs'
    layout: 'editor.hbs'
  })
});
router.get('/forAEW_4c', Auth.authEditor, async function (req, res){
  const id = req.query.id;
  newss = await databaseModel.AEW_getNewsbyID(id);
  
  res.render('vwNews/indexNotPrint',{
    er2: "1",
    news: newss,
    //layout:'Editor_viewpaper.hbs'
    layout: 'editor.hbs'
  })
});
module.exports = router;