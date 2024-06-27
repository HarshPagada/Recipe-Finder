
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
      res.status(401).json({ message: 'You have to log in to add/view recipes to favourites' });
    }
  }
  
  module.exports = isAuthenticated;
  