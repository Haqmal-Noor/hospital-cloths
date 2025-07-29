const errorController = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong. Please try again later.";
      
  res.status(err.statusCode).json({
    status: err.status,
    message,
  });
};

export default errorController;
