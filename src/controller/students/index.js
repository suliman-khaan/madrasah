const User = require("../../model/user");

module.exports = {
  async all(req, res) {
    try {
      const students = await User.find({ role: "student", status: "publish" });
      res.render("students/all", { students });
    } catch (error) {
      req.flash("error", "صارفین دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  add(req, res) {
    res.render("students/add");
  },
  async doAdd(req, res) {
    try {
      const newUser = new User({ ...req.body, role: "student" });
      await newUser.save();

      // If the user is successfully added, redirect to the dashboard
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
      const user = await User.findOne({ _id: id, status: "publish" });
      if (!user) {
        req.flash("error", "طالب علم نہیں مل سکا");
        return res.redirect("/students");
      }
      res.render("students/add", { user });
    } catch (error) {
      req.flash("error", "طالب علم میں تبدیلی کرتے وقت خرابی " + error.message);
      res.redirect("/students");
    }
  },
  async doEdit(req, res) {
    const id = req.body.id;
    try {
      const userObject = req.body;
      delete req.body.id;
      await User.findByIdAndUpdate(id, userObject);

      // If the user is successfully added, redirect to the dashboard
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
      console.log(id);
      await User.findOneAndUpdate(
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
