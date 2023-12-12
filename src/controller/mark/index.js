const { default: mongoose } = require("mongoose");
const { startYear } = require("../../config/system");
const Mark = require("../../model/mark");
const Student = require("../../model/student");
const Subject = require("../../model/subject");
const ClassModel = require("../../model/class");

module.exports = {
  async all(req, res) {
    try {
      const students = await Student.find({ status: "publish" }).populate(
        "admission"
      );
      res.render("marks/studentsList", { students });
    } catch (error) {
      req.flash("error", "مارکس دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async byClasses(req, res) {
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
      res.render("marks/classList", { classes });
    } catch (error) {
      req.flash("error", "طالب علم دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async classById(req, res) {
    try {
      const classId = req.params.id;
      let { session: currentSession } = req.query;
      const currentYear = new Date().getFullYear();

      // Find all marks with the specified session
      let marksBySession = await Mark.find({
        session: currentSession ?? currentYear,
      });

      // Extract student IDs from the marks
      const studentIds = marksBySession.map((mark) => mark.student);

      // Promise to retrieve all students based on provided studentIds and classId
      const studentsPromise = Student.find({
        _id: { $in: studentIds },
        admission: classId,
        status: "publish",
      }).populate("admission marks");

      const classPromise = ClassModel.findById(classId).populate("subjects");
      const sessionPromise = Mark.distinct("session", { class: classId });
      const [students, classData, uniqueSession] = await Promise.all([
        studentsPromise,
        classPromise,
        sessionPromise,
      ]);

      // Sort uniqueSession array in descending order based on the session values
      // and create HTML option elements for a select field used on the frontend
      let sessionOption = uniqueSession
        .sort((a, b) => b - a)
        .map((el) => `<option value="${el}">${el}</option>`);

      res.render("marks/studentsList", {
        students,
        class: classData,
        session: sessionOption,
      });
    } catch (error) {
      req.flash("error", "کلاس طالب علم دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
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
  // Student mark result card
  async viewMarks(req, res) {
    try {
      let { studentId, session, classId } = req.query;
      let backUrl = req.headers.referer || "/marks";

      if (!studentId) {
        req.flash(
          "error",
          "طالب علم نمبرات دیکھنے کے لئے طالب علم کے ID ضروری ہے"
        );
        return res.redirect("/marks");
      }

      const studentPromise = Student.findById(studentId)
        .populate("admission")
        .populate({ path: "marks", populate: "subject" });
      const classPromise = ClassModel.findById(classId).populate("subjects");

      const [classData, student] = await Promise.all([
        classPromise,
        studentPromise,
      ]);

      if (!classData) {
        req.flash("error", "معاف کریں،اس ID پر کوئی کلاس دستیاب نہیں ہیں۔");
        return res.redirect(backUrl);
      }

      // extract the current class(classId) marks only
      student.marks = student.marks.filter(
        (mark) => mark?.class?.toString() == classId
      );

      // Student total obtained marks
      let totalObtMarks = student.marks.reduce(
        (total, subject) => total + subject.marksObtained,
        0
      );
      student["obtMarks"] = totalObtMarks;

      // current class total subject marks
      let totalMarks = classData.subjects.reduce(
        (total, subject) => total + subject.totalMarks,
        0
      );
      student["totalMarks"] = totalMarks;

      // student percentage
      let percentage = ((totalObtMarks / totalMarks) * 100).toFixed(2);
      student["percentage"] = isNaN(percentage) ? 0 : percentage;

      res.render("marks/view", { student, classData });
    } catch (error) {
      console.log(error);
      req.flash("error", "مارکس میں ترمیم کرتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async addMarkStudent(req, res) {
    try {
      let { id } = req.params;
      const student = await Student.findById(id).populate("admission");
      if (!student) {
        req.flash("error", "طالب علم اندراج نمبرات کے لئے ID ضروری ہے");
        return res.redirect("/marks");
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
      const { term, session, currentClass, marksObtained } = req.body;
      if (!studentId) {
        req.flash("error", "طالب علم اندراج نمبرات کے لئے ID ضروری ہے");
        return res.redirect("/marks");
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
              mark.session === session &&
              mark.class === currentClass
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
              class: currentClass,
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
      res.redirect("/marks");
    } catch (error) {
      req.flash("error", "مارکس میں شامل کرتے وقت خرابی:۔ " + error.message);
      return res.redirect("/marks");
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

      let currentStudent = await Student.aggregate([
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
          $lookup: {
            from: "classes", // Assuming there's a 'classes' collection
            localField: "marks.class",
            foreignField: "_id",
            as: "classInfo",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            marks: { $push: "$marks" },
            session: { $addToSet: "$marks.session" },
            classes: { $addToSet: { $first: "$classInfo" } }, // Get unique classes
          },
        },
      ]);
      let session = Array.from(new Set(currentStudent[0].session.flat()));
      let classes = Array.from(new Set(currentStudent[0].classes.flat()));

      res.render("marks/edit", { student, session, classes });
    } catch (error) {
      req.flash("error", "مارکس میں ترمیم کرتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async getStudentMarks(req, res) {
    try {
      const { studentId, term, session, classId } = req.body;
      const marks = await Mark.find({
        student: studentId,
        term,
        class: classId,
        session,
      }).populate("subject");
      res.status(200).json({ body: marks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
