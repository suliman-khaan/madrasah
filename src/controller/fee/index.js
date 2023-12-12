const ClassModel = require("../../model/class");
const Student = require("../../model/student");

module.exports = {
    async main(req, res) {
        try {
            // const classes = await ClassModel.find().select('name');
            const classes = await ClassModel.aggregate([
                {
                    $match: {} // Match all classes or add any specific conditions here
                },
                {
                    $lookup: {
                        from: 'users', // Assuming your student model is named 'students'
                        localField: '_id',
                        foreignField: 'admission',
                        as: 'students' // Name for the field to store the matched students
                    }
                },
                {
                    $addFields: {
                        totalStudents: { $size: '$students' } // Count the number of students in each class
                    }
                },
                {
                    $project: {
                        students: 0 // Exclude the 'students' array from the final result if not needed
                    }
                }
            ]);
            return res.render("fee/index", { classes });
        } catch (error) {
            req.flash("error", "صارفین دیکھتے وقت خرابی:۔ " + error.message);
            return res.redirect("/");
        }
    },
    async class(req, res) {
        try {
            console.log(req.params.id);
            const admission = req.params.id;
            const students = await Student.find({ admission }).populate('admission');
            console.log(students);
            return res.render('fee/allStudents', {
                students
            });
        } catch (err) {
            req.flash("error", "صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    }
};
