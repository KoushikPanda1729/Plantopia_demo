const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((error) => {
    next(error);
  });
};

export default asyncHandler;

// =======================================

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     console.log("Error occured in asyncHandler : ", error);
//     next(error);
//   }
// };

// export default asyncHandler;
