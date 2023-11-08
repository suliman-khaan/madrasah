const ClassModel = require("../../model/class");
const Student = require("../../model/student");

module.exports = {
  async all(req, res) {
    try {
      const students = await Student.find({ status: "publish" }).populate(
        "admission"
      );
      res.render("students/all", { students });
    } catch (error) {
      req.flash("error", "طالب علم دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async add(req, res) {
    try {
      const classes = await ClassModel.find({ status: "publish" });
      res.render("students/add", { classes });
    } catch (error) {
      req.flash("error", "طالب علم شامل کرتے وقت خرابی " + error.message);
      res.redirect("/");
    }
  },
  async doAdd(req, res) {
    try {
      const newStudent = new Student({ ...req.body });
      await newStudent.save();

      // If the student is successfully added, redirect to the dashboard
      req.flash("success", "طالب علم کامیابی سے شامل کیا گیا");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "طالب علم شامل کرتے وقت خرابی " + error.message);
      res.redirect("/students/add");
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "طالب علم کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/students");
      }
      const classes = await ClassModel.find({ status: "publish" });
      const student = await Student.findOne({ _id: id, status: "publish" });
      if (!student) {
        req.flash("error", "طالب علم نہیں مل سکا");
        return res.redirect("/students");
      }
      res.render("students/add", { student, classes });
    } catch (error) {
      req.flash("error", "طالب علم میں تبدیلی کرتے وقت خرابی " + error.message);
      res.redirect("/students");
    }
  },
  async doEdit(req, res) {
    try {
      const id = req.body.id;
      if (!id) {
        req.flash("error", "طالب علم کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/students");
      }
      const studentObject = req.body;
      delete req.body.id;
      await Student.findByIdAndUpdate(id, studentObject);

      // If the student is successfully added, redirect to the dashboard
      req.flash("success", "طالب علم کامیابی سے ترمیم کیا گیا");
      res.redirect("/students");
    } catch (error) {
      req.flash("error", "طالب علم شامل کرتے وقت خرابی " + error.message);
      res.redirect("/students");
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "طالب علم کو حذف کرنے کے لئے ID ضروری ہے");
        return res.redirect("/students");
      }
      await Student.findOneAndUpdate(
        { _id: id, status: "publish" },
        { status: "delete" }
      );
      req.flash("success", "طالب علم کامیابی سے حذف ہوگیا");
      res.redirect("/students");
    } catch (error) {
      req.flash("error", "طالب علم میں حذف کرتے وقت خرابی " + error.message);
      res.redirect("/students");
    }
  },
};
