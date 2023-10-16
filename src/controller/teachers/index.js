const User = require("../../model/user");

module.exports = {
  async all(req, res) {
    try {
      const teachers = await User.find({ role: "teacher", status: "publish" });
      res.render("teachers/all", { teachers });
    } catch (error) {
      req.flash("error", "صارفین دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  add(req, res) {
    res.render("teachers/add");
  },
  async doAdd(req, res) {
    try {
      const newTeacher = new User({ ...req.body, role: "teacher" });
      await newTeacher.save();

      // If the user is successfully added, redirect to the dashboard
      req.flash("success", "استاد کامیابی سے شامل کیا گیا");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "استاد شامل کرتے وقت خرابی: " + error.message);
      res.redirect("/teachers/add");
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "استاد کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/stteachersudents");
      }
      const teacher = await User.findOne({ _id: id, status: "publish" });
      if (!teacher) {
        req.flash("error", "استاد نہیں مل سکا");
        return res.redirect("/teachers");
      }
      res.render("teachers/add", { teacher });
    } catch (error) {
      req.flash("error", "استاد میں تبدیلی کرتے وقت خرابی " + error.message);
      res.redirect("/teachers");
    }
  },
  async doEdit(req, res) {
    try {
      const id = req.body.id;
      if (!id) {
        req.flash("error", "استاد کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/students");
      }
      const userObject = req.body;
      delete req.body.id;
      await User.findByIdAndUpdate(id, userObject);

      // If the user is successfully added, redirect to the dashboard
      req.flash("success", "استاد کامیابی سے ترمیم کیا گیا");
      res.redirect("/teachers");
    } catch (error) {
      req.flash("error", "استاد شامل کرتے وقت خرابی " + error.message);
      res.redirect("/teachers");
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "استاد کو حذف کرنے کے لئے ID ضروری ہے");
        return res.redirect("/teachers");
      }
      await User.findOneAndUpdate(
        { _id: id, status: "publish" },
        { status: "delete" }
      );
      req.flash("success", "استاد کامیابی سے حذف ہوگیا");
      res.redirect("/teachers");
    } catch (error) {
      req.flash("error", "استاد میں حذف کرتے وقت خرابی " + error.message);
      res.redirect("/teachers");
    }
  },
};
