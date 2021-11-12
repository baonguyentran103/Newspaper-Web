module.exports = {
  authWriter(req, res, next) {
    if (req.session.auth === false || req.session.user[0].LoaiUS !=="Writer") {
      req.session.retUrl = req.originalUrl;
      req.session.needSign = true;
      return res.redirect('/home');
    }
  
    next();
  },
  authAdmin(req, res, next) {
    if (req.session.auth === false || req.session.user[0].LoaiUS !=="Admin") {
      req.session.retUrl = req.originalUrl;
      req.session.needSign = true;
      return res.redirect('/home');
    }
  
    next();
  },
  authEditor(req, res, next) {
    if (req.session.auth === false || req.session.user[0].LoaiUS !=="Editor") {
      req.session.retUrl = req.originalUrl;
      req.session.needSign = true;
      return res.redirect('/home');
    }
  
    next();
  },
  auth(req, res, next) {
    if (req.session.auth === false) {
      req.session.retUrl = req.originalUrl;
      req.session.needSign = true;
      return res.redirect('/home');
    }
  
    next();
  }
  
}