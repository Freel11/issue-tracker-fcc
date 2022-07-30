'use strict';
const mongoose = require('mongoose')
const IssueModel = require('../models.js').Issue
const ProjectModel = require('../models').Project

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      ProjectModel.findOne({name: project}, (err, projectdata) => {
        if (!projectdata) {
          res.send("could not find that project")
        } else {
          res.json(projectdata.issues)
        }
      })

    })
    
    .post(function (req, res){
      const project = req.params.project;
      const { 
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text 
      } = req.body,
        created_on = new Date(),
        updated_on = new Date(),
        open = true


        if (!issue_title || !issue_text || !created_by) {
          const error = {error: 'required field(s) missing'}
          res.json(error)
          return
        }

        const newIssue = new IssueModel({
          issue_title,
          issue_text,
          created_on,
          updated_on,
          created_by,
          assigned_to,
          open,
          status_text
        })

        ProjectModel.findOne({ name: project }, (err, projectdata) => {
          if (!projectdata) {
            const newProject = new ProjectModel({ name: project })
            newProject.issues.push(newIssue)
            newProject.save((err, data) => {
              if (err || !data) {
                res.send('There was an issue saving this issue')
              } else {
                res.json(newIssue)
              }
            })
          } else {
            projectdata.issues.push(newIssue)
            projectdata.save((err, data) => {
              if (err || !data) {
                res.send('There was an issue saving this issue')
              } else {
                res.json(newIssue)
              }
            })
          }
        })

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
