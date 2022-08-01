const mongoose = require('mongoose')
const { Schema } = mongoose
const ObjectId = Schema.ObjectId

const IssueSchema = new Schema({
	issue_title: { type: String, required: true },
	issue_text: { type: String, required: true },
	created_on: { type: Date, required: false },
	updated_on: { type: Date, required: false },
	created_by: { type: String, required: true },
	assigned_to: { type: String, required: false },
	open: { type: Boolean, default: true },
	status_text: { type: String, required: false },
})

const ProjectSchema = new Schema({
	name: { type: String, required: true },
	issues: [IssueSchema]
})

const Issue = mongoose.model("Issue", IssueSchema)
const Project = mongoose.model("Project", ProjectSchema)

exports.Issue = Issue
exports.Project = Project