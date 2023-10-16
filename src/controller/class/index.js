const ClassModel = require("../../model/class");

module.exports = {
  async all(req, res) {
    try {
      const classes = await ClassModel.find({status: "publish" });
      res.render("class/all", { classes });
    } catch (error) {
      req.flash("error", "صارفین دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  add(req, res) {
    res.render("class/add");
  },
  async doAdd(req, res) {
    try {
      const newClass = new ClassModel(req.body);
      await newClass.save();

      // If the Class is successfully added, redirect to the dashboard
      req.flash("success", "کلاس کامیابی سے شامل کیا گیا");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "کلاس شامل کرتے وقت خرابی " + error.message);
      res.redirect("/class/add");
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "کلاس کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/class");
      }
      const classes = await ClassModel.findOne({ _id: id, status: "publish" });
      if (!classes) {
        req.flash("error", "کلاس نہیں مل سکا");
        return res.redirect("/class");
      }
      res.render("class/add", { classes });
    } catch (error) {
      req.flash("error", "کلاس میں تبدیلی کرتے وقت خرابی " + error.message);
      res.redirect("/class");
    }
  },
  async doEdit(req, res) {
    try {
      const id = req.body.id;
      if (!id) {
        req.flash("error", "کلاس کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/class");
      }
      const ClassObject = req.body;
      delete req.body.id;
      await ClassModel.findByIdAndUpdate(id, ClassObject);

      // If the Class is successfully added, redirect to the dashboard
      req.flash("success", "کلاس کامیابی سے ترمیم کیا گیا");
      res.redirect("/class");
    } catch (error) {
      req.flash("error", "کلاس شامل کرتے وقت خرابی " + error.message);
      res.redirect("/class");
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "کلاس کو حذف کرنے کے لئے ID ضروری ہے");
        return res.redirect("/class");
      }
      await ClassModel.findOneAndUpdate(
        { _id: id, status: "publish" },
        { status: "delete" }
      );
      req.flash("success", "کلاس کامیابی سے حذف ہوگیا");
      res.redirect("/class");
    } catch (error) {
      req.flash("error", "کلاس میں حذف کرتے وقت خرابی " + error.message);
      res.redirect("/class");
    }
  },
};
