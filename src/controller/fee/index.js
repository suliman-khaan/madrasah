const ClassModel = require("../../model/class");
const Fee = require("../../model/fee");
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
            const admission = req.params.id;
            const students = await Student.find({ admission }).populate('admission');
            return res.render('fee/allStudents', {
                students
            });
        } catch (err) {
            req.flash("error", "صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    },
    // fee portal
    async portal(req, res) {
        try {
            const classes = await ClassModel.find().select('name');
            return res.render('fee/feePortal', { classes });
        } catch (err) {
            req.flash("error", " : fee/portal صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    },
    // edit class portal single fee portal class
    async portalClass(req, res) {
        try {
            const admission = req.params.id;
            const { fee } = await ClassModel.findById(admission).select('fee').populate('fee');
            return res.render('fee/feePortalSingleClass', { id: admission, fees: fee });
        } catch (err) {
            req.flash("error", " : fee/portal/class/ صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    },
    // additon of fee
    async addfee(req, res) {
        try {
            const fee = req.body;
            const feeModal = await Fee({ ...fee }).save().then(async (savedDoc) => {
                // fee.class is an ID of the class obtained from req.body...
                const classmodal = await ClassModel.findById(fee.class);
                const isIdPresent = classmodal.fee.some(feeId => feeId.equals(savedDoc._id));
                if (classmodal) {
                    if (!isIdPresent) {
                        classmodal.fee.push(savedDoc._id); // Pushing the savedDoc._id into the fee array
                        await classmodal.save();
                    } else {
                        throw new Error('Id Already Present there');
                    }
                } else {
                    throw new Error('Class not found')
                    // Handle the scenario where the class is not found
                }
                return savedDoc;
            });

            return res.redirect(`/fee/portal/class/${fee.class}`);

            // if want to use an ajax...
        } catch (err) {
            req.flash("error", " : addFee/ صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    },
    // update form fee
    async updatefee(req, res) {
        try {
            const { id, name, amount } = req.body;

            const updateFee = await Fee.findByIdAndUpdate(id, { name, amount }, { new: true });
            if (!updateFee) {
                return res.status(404).send({ error: 'Fee not found' });
            }

            console.log('updated', updateFee);
            return res.send({ updateFee });

            // if want to use an ajax...
        } catch (error) {
            return res.send({ error });
        }
    },
    // find fee
    async findFee(req, res) {
        try {
            const feeId = req.params.id;
            let fee = await Fee.findById(feeId);
            console.log(fee);
            return res.send({ fee });
        } catch (err) {
            req.flash("error", " : findFee/ صارفین دیکھتے وقت خرابی:۔" + err.message);
            return res.redirect("/");
        }
    }
};
