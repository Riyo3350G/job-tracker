const Joi = require("joi");

const jobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  company: Joi.string().min(2).required(),
  status: Joi.string().valid("Applied", "Interview", "Rejected"),
  notes: Joi.string().allow(""),
});

module.exports = jobSchema;
