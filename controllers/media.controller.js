const postMedia = async (request, response) => {
  try {
    console.log("hiii");
    console.log("req.files:::", request.file);
    response
      .status(200)
      .send({ success: true, message: "Image Uploaded successfully!" });
  } catch (error) {
    console.log(error);
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  postMedia,
};
