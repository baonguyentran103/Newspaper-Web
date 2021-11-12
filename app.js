const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
var session = require('express-session')
const hbs_sections = require('express-handlebars-sections')
const app = express();

app.use(morgan('dev'));
app.use(express.static('public'))
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{}
}))


const databaseModel = require('./models/general.model');
const newsModel = require('./models/news.model');


app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: {
        sections: hbs_sections(),
        format_date(val) {
          val2 =val.getFullYear().toString() + '-';
          day = val.getDate();
          month = val.getMonth()+1;
          if(month<10)val2 =val2+'0';
          val2 = val2 + month.toString() +'-'
          if(day<10)val2 = val2 +'0';
          val2 = val2 + day.toString();
          return val2;
        },
        TypeofRequest(val){
          if(val===1)
          {
            return 'id';
          }
          if(val===2)
          {
            return 'tag';
          }
          if(val===3)
          {
            return 'search';
          }
        },
        Previous(val){
          return parseInt(val)-1;
        },
        Next(val){
          return parseInt(val)+1;
        },
        TypeOfUserChangePass(val){
          if(val===0) return '/account/changepass';
          if(val===1) return '/account/changepass_w';
          if(val===2) return '/account/changepass_e';
          if(val===3) return '/account/changepass_a';
        },
        isActive(MaCM, MaCM_dad){
          if(MaCM == MaCM_dad)return "active";
          else return "";
        }
      }
}));
app.set('view engine', 'hbs');
app.use(express.urlencoded({
    extended: true
  }));
app.use(function (req, res, next) {
  if (typeof (req.session.auth) === 'undefined') {
    req.session.auth = false;
  }
  res.locals.auth = req.session.auth;
  if(req.session.auth == true)
  {res.locals.user = req.session.user[0];}
  next();
})
app.use(async function (req, res, next) {
  res.locals.Lcategory = await databaseModel.cateDad();
  res.locals.Lcategory2 = await databaseModel.cateChild();
  if (typeof (req.session.needPre) === 'undefined') {
    //console.log("!@#$%^&*")
    req.session.needPre = false;
  }
  if (typeof (req.session.needSign) === 'undefined') {
    req.session.needSign = false;
  }
  res.locals.needSign= req.session.needSign;
  next();}
);
app.use(function (req, res, next) {
  if(!req.originalUrl.includes('assets')){
  const url='/account/login';
  if(req.originalUrl!== url) {
    req.session.retUrl = req.originalUrl;
  }
}
  next();
})
function random(length){
  return Math.floor(Math.random() * length);
}
app.get('/home', async function (req, res) {
  FourNewsPopular = await newsModel.get4NewsPopular();
  TenNewsViews = await newsModel.get10MostView();
  TenNewsNewest = await newsModel.get10NewestView();
  TenCateChild = await newsModel.get10CateChild();
  TenNewsCate =[];
  Two1NewsNewest =[];
  Two2NewsNewest =[];
  Two3NewsNewest =[];
  Two4NewsNewest =[];
  postsTen = await newsModel.getAllNews10();
  let FourPost=[];
  let Four2Post=[];
  let SixPost=[];
  let postid = [];
  let Relative = 10;
  for(let i =0; i<Relative; ++i){
    let x = random(postsTen[0].length);
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
        if(check ==1)x = random(postsTen[0].length);
        check =1-check;
      }
      postid.push(x);
    }
    if(i<4) FourPost.push(postsTen[0][x]);
    else SixPost.push(postsTen[0][x]);
  }
  
  for(let i = 0; i< TenCateChild[0].length; i+=1){
    var val = await newsModel.get1MostViewCate(TenCateChild[0][i]['MaCM']);
    TenNewsCate.push(val[0][0]);
  }
  for(let i=1; i<3; ++i){
    Two1NewsNewest.push(TenNewsNewest[0][i]);
    Two3NewsNewest.push(TenNewsNewest[0][i+5]);
  }
  for(let i=3; i<5; ++i){
    Two2NewsNewest.push(TenNewsNewest[0][i]);
    Two4NewsNewest.push(TenNewsNewest[0][i+5]);
  }
  res.render('home', {
    fourNewsPopular: FourNewsPopular[0],
    tenNewsViews: TenNewsViews[0],
    firstNewsNewest: TenNewsNewest[0][0],
    fithNewsNewest: TenNewsNewest[0][5],
    two1NewsNewest: Two1NewsNewest,
    two2NewsNewest: Two2NewsNewest,
    two3NewsNewest: Two3NewsNewest,
    two4NewsNewest: Two4NewsNewest,
    tenNewsCate: TenNewsCate,
    FourPost,
    Four2Post,
    SixPost
  });
  req.session.needSign=false;
});
app.get('/404', function(req, res){
  res.render('er404', {layout: 'er404lay.hbs'})
})
app.get('/', async function (req, res) {
  FourNewsPopular = await newsModel.get4NewsPopular();
  TenNewsViews = await newsModel.get10MostView();
  TenNewsNewest = await newsModel.get10NewestView();
  TenCateChild = await newsModel.get10CateChild();
  TenNewsCate =[];
  Two1NewsNewest =[];
  Two2NewsNewest =[];
  Two3NewsNewest =[];
  Two4NewsNewest =[];
  postsTen = await newsModel.getAllNews10();
  let FourPost=[];
  let Four2Post=[];
  let SixPost=[];
  let postid = [];
  let Relative = 10;
  for(let i =0; i<Relative; ++i){
    let x = random(postsTen[0].length);
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
        if(check ==1)x = random(postsTen[0].length);
        check =1-check;
      }
      postid.push(x);
    }
    if(i<4) FourPost.push(postsTen[0][x]);
    else SixPost.push(postsTen[0][x]);
  }
  
  for(let i = 0; i< TenCateChild[0].length; i+=1){
    var val = await newsModel.get1MostViewCate(TenCateChild[0][i]['MaCM']);
    TenNewsCate.push(val[0][0]);
  }
  for(let i=1; i<3; ++i){
    Two1NewsNewest.push(TenNewsNewest[0][i]);
    Two3NewsNewest.push(TenNewsNewest[0][i+5]);
  }
  for(let i=3; i<5; ++i){
    Two2NewsNewest.push(TenNewsNewest[0][i]);
    Two4NewsNewest.push(TenNewsNewest[0][i+5]);
  }
  res.render('home', {
    fourNewsPopular: FourNewsPopular[0],
    tenNewsViews: TenNewsViews[0],
    firstNewsNewest: TenNewsNewest[0][0],
    fithNewsNewest: TenNewsNewest[0][5],
    two1NewsNewest: Two1NewsNewest,
    two2NewsNewest: Two2NewsNewest,
    two3NewsNewest: Two3NewsNewest,
    two4NewsNewest: Two4NewsNewest,
    tenNewsCate: TenNewsCate,
    FourPost,
    Four2Post,
    SixPost
  });
  req.session.needSign=false;
});


app.use('/account/', require('./controllers/account.route'));
app.use('/news/', require('./controllers/news.route'));
app.use('/writer/', require('./controllers/writer.route'));
app.use('/editor/', require('./controllers/editor.route'));
app.use('/admin/', require('./controllers/admin.route'));

const PORT = 3000;
app.listen(PORT, function () {
console.log(`EC Web App listening at http://localhost:${PORT}`);
});