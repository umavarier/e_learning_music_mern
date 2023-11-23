const Teacher =  require("../model/teacherModel");
const { modelName } = require("../model/userModel");

const checkBlockedStatus = async (req, res, next) => {
    const teacherId = req.params.teacherId;
    console.log("axios-t"+teacherId)
    const teacher = await Teacher.findById(teacherId);

  
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
  
    if (teacher.isBlock) {
      return res.status(403).json({ error: "You have been blocked by the admin." });
    }
  
    next();
  };
  
  module.exports = {
    checkBlockedStatus,
  }