const ClassModel = require("../../model/class");
const Student = require("../../model/student");

module.exports = {
  all: async (req, res) => {
    try {
      const classes = await Student.aggregate([
        {
          $group: {
            _id: "$admission",
            studentCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "classes", // The name of the classes collection
            localField: "_id",
            foreignField: "_id",
            as: "class",
          },
        },
        {
          $unwind: "$class",
        },
        {
          $project: {
            name: "$class.name", // Include class name in the result
            studentCount: 1,
          },
        },
      ]);
      res.render("result/all", { classes });
    } catch (error) {
      req.flash("error", "نتائج دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  class: async (req, res) => {
    try {
      let classId = req.query.id;
      if (!classId) {
        req.flash("error", "کلاس کے نتائج دیکھنے کے لئے ID ضروری ہے");
        return res.redirect("/results");
      }
      const studentsPromise = Student.find({ admission: classId }).populate(
        "marks"
      );
      const classPromise = ClassModel.findById(classId).populate("subjects");
      const [students, classDetails] = await Promise.all([
        studentsPromise,
        classPromise,
      ]);
        // console.log(classDetails,students)
      students.map((student) => {
        let classMark = student.marks.map((mark) => {
          mark.subject.toString()
        });
      });
      res.render("result/class", { students, classDetails });
    } catch (error) {
      req.flash("error", "نتائج دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
};
