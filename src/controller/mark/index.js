const { default: mongoose } = require("mongoose");
const { startYear } = require("../../config/system");
const Mark = require("../../model/mark");
const Student = require("../../model/student");
const Subject = require("../../model/subject");

module.exports = {
  async all(req, res) {
    try {
    } catch (error) { }
  },
  async add(req, res) {
    try {
      const students = await Student.find({ status: "publish" }).populate(
        "admission"
      );
      res.render("marks/studentsList", { students });
    } catch (error) {
      req.flash("error", "طالب علم دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async addMarkStudent(req, res) {
    try {
      let { id } = req.params;
      const student = await Student.findById(id).populate("admission");
      if (!student) {
        req.flash("error", "طالب علم اندراج نمبرات کے لئے ID ضروری ہے");
        return res.redirect("/marks/add");
      }
      await student.admission.populate("subjects");
      let session = new Array();
      let currentYear = new Date().getFullYear();
      for (let i = 0; i < 5; i++) {
        session.push(currentYear - i);
      }
      res.render("marks/add", { student, session });
    } catch (error) {
      req.flash("error", "مارکس شامل کرتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async doAddMarkStudent(req, res) {
    try {
      const studentId = req.params.id;
      const { term, session, marksObtained } = req.body;
      if (!studentId) {
        req.flash("error", "طالب علم اندراج نمبرات کے لئے ID ضروری ہے");
        return res.redirect("/marks/add");
      }
      const student = await Student.findById(studentId).populate("marks");
      const subjects = await Subject.find({ status: "publish" });

      let message = "طالب علم کے لئے نمبر کامیابی سے شامل کیے گئے ہیں";
      // create a separate document for each subject
      for (const subject of subjects) {
        const marksForSubject = marksObtained[subject._id];

        if (marksForSubject !== undefined) {
          // if marks are provided for this subject
          const existingMark = student.marks?.find(
            (mark) =>
              mark.subject?.toString() === subject._id?.toString() &&
              mark.term === term &&
              mark.session === session
          );

          if (existingMark) {
            // update the existing marks
            existingMark.marksObtained = marksForSubject;
            existingMark.term = term;

            await existingMark.save();
            message = "طالب علم کے لئے نمبر کامیابی سے ترمیم کیے گئے";
          } else {
            const mark = new Mark({
              student: studentId,
              subject: subject._id,
              term,
              session,
              marksObtained: marksForSubject,
            });

            await mark.save();
            student.marks.push(mark._id);
          }
        }
      }
      await student.save();
      req.flash("success", message);
      res.redirect("/marks/add");
    } catch (error) {
      req.flash("error", "مارکس میں شامل کرتے وقت خرابی:۔ " + error.message);
      return res.redirect("/marks/add");
    }
  },
  async edit(req, res) {
    try {
      let { id } = req.params;
      const student = await Student.findById(id)
        .populate("admission")
        .populate({ path: "marks", populate: "subject" });
      if (!student) {
        req.flash("error", "طالب علم اندراج نمبرات کے لئے ID ضروری ہے");
        return res.redirect("/marks/add");
      }

      if (!student.marks.length) {
        req.flash(
          "error",
          "معاف کریں، اس طالب علم کے لئے اب تک کوئی نمبر دستیاب نہیں ہیں۔ آپ کو طالب علم کے نمبر درج کرنے کے فارم پر ریڈائریکٹ کیا گیا۔"
        );
        return res.redirect("/marks/add/" + id);
      }

      let test = await Student.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "marks", // The name of the marks collection
            localField: "_id",
            foreignField: "student",
            as: "marks",
          },
        },
        {
          $unwind: "$marks",
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            marks: { $push: "$marks" },
            session: { $addToSet: "$marks.session" }, // Get unique sessions
          },
        },
      ]);
      let session = Array.from(new Set(test[0].session.flat()));
      res.render("marks/edit", { student, session });
    } catch (error) {
      req.flash("error", "مارکس میں ترمیم کرتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async getStudentMarks(req, res) {
    try {
      console.log(req.body);
      res.status(200).json({ message: req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
