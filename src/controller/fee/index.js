module.exports = {
    async main(req, res) {
        try {
            // const students = await User.find({ role: "student", status: "publish" });
            res.render("fee/index");
        } catch (error) {
            // req.flash("error", "صارفین دیکھتے وقت خرابی:۔ " + error.message);
            res.redirect("/");
        }
    },
};
