const Subject = require("../../model/subject");

module.exports = {
  async all(req, res) {
    try {
      const subjects = await Subject.find({ status: "publish" });
      res.render("subject/all", { subjects });
    } catch (error) {
      req.flash("error", "مضمون دیکھتے وقت خرابی:۔ " + error.message);
      res.redirect("/");
    }
  },
  async add(req, res) {
    res.render("subject/add");
  },
  async doAdd(req, res) {
    try {
      const { id, ...body } = req.body;
      const subject = new Subject(body);
      await subject.save();

      req.flash("success", "مضمون کامیابی سے شامل کیا گیا");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "مضمون شامل کرتے وقت خرابی " + error.message);
      res.redirect("/subject/add");
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "مضمون کو ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/subject");
      }
      const subject = await Subject.findOne({ _id: id, status: "publish" });
      if (!subject) {
        req.flash("error", "مضمون نہیں مل سکا");
        return res.redirect("/subject");
      }
      res.render("subject/add", { subject });
    } catch (error) {
      req.flash("error", "مضمون میں تبدیلی کرتے وقت خرابی " + error.message);
      res.redirect("/subject");
    }
  },
  async doEdit(req, res) {
    try {
      const { id, ...subjectBody } = req.body;
      if (!id) {
        req.flash("error", "مضمون میں ترمیم کرنے کے لئے ID ضروری ہے");
        return res.redirect("/subject");
      }
      await Subject.findByIdAndUpdate(id, subjectBody);

      req.flash("success", "مضمون کامیابی سے ترمیم کیا گیا");
      res.redirect("/subject");
    } catch (error) {
      req.flash("error", "مضمون میں ترمیم کرتے وقت خرابی " + error.message);
      res.redirect("/subject");
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        req.flash("error", "مضمون کو حذف کرنے کے لئے ID ضروری ہے");
        return res.redirect("/subject");
      }
      await Subject.findOneAndUpdate(
        { _id: id, status: "publish" },
        { status: "delete" }
      );
      req.flash("success", "مضمون کامیابی سے حذف ہوگیا");
      res.redirect("/subject");
    } catch (error) {
      req.flash("error", "مضمون میں حذف کرتے وقت خرابی " + error.message);
      res.redirect("/subject");
    }
  },
};
