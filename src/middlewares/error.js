module.exports =  errorHandling = (err, req, res, next) => {
    res.status(err.statusCode).json({
      msg: err.message,
      success: false,
    });
  };
  