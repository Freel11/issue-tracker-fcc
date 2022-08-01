const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let deleteID

suite('Functional Tests', () => {
  suite('POST Requests', () => {

  	test("POST Request with every field filled to /api/issues/{project}", done => {
  		chai.request(server)
  			.post('/api/issues/apitest')
  			.set('content-type', 'application/json')
  			.send({
  				issue_title: 'Chai Test',
  				issue_text: 'This is a chai test',
  				created_by: 'Jade',
  				assigned_to: 'FCC',
  				status_text: 'This test is a go'
  			})
  			.end((err, res) => {
  				assert.equal(res.status, 200)
  				assert.equal(res.body.issue_title, 'Chai Test')
  				assert.equal(res.body.issue_text, 'This is a chai test')
  				assert.equal(res.body.created_by, 'Jade')
  				assert.equal(res.body.assigned_to, 'FCC')
  				assert.equal(res.body.status_text, 'This test is a go')
  				assert.equal(res.body.open, true)
  				deleteID = res.body._id
  				done()
  			})
  	})

  	test("POST Request with only required fields filled to /api/issues/{project}", done => {
  		chai.request(server)
  			.post('/api/issues/apitest')
  			.set('content-type', 'application/json')
  			.send({
  				issue_title: 'Chai Test',
  				issue_text: 'This is a chai test',
  				created_by: 'Jade',
  				assigned_to: '',
  				status_text: ''
  			})
  			.end((err, res) => {
  				assert.equal(res.status, 200)
  				assert.equal(res.body.issue_title, 'Chai Test')
  				assert.equal(res.body.issue_text, 'This is a chai test')
  				assert.equal(res.body.created_by, 'Jade')
  				assert.equal(res.body.assigned_to, '')
  				assert.equal(res.body.status_text, '')
  				assert.equal(res.body.open, true)
  				done()
  			})
  	})

  	test("POST Request with missing required fields to /api/issues/{project}", done => {
  		chai.request(server)
  			.post('/api/issues/apitest')
  			.set('content-type', 'application/json')
  			.send({
  				issue_title: '',
  				issue_text: '',
  				created_by: '',
  				assigned_to: '',
  				status_text: ''
  			})
  			.end((err, res) => {
  				assert.equal(res.status, 200)
  				assert.equal(res.body.error, 'required field(s) missing')
  				done()
  			})
  	})

  })

  suite("GET Requests", () => {

	test("GET request to /api/issues/chai-test-project", done => {
		chai.request(server)
			.get('/api/issues/chai-test-project')
			.end((err, res) => {
				assert.equal(res.status, 200)
				assert.equal(res.body.length, 4)
				done()
			})
	})

	test("GET request with one filter to /api/issues/chai-test-project", done =>{
		chai.request(server)
			.get('/api/issues/chai-test-project')
			.query({
				issue_title: 'First'
			})
			.end((err, res) => {
				assert.equal(res.status, 200)
				assert.equal(res.body[0].issue_title, 'First')
				assert.equal(res.body[0].issue_text, 'This is the first test issue')
				assert.equal(res.body[0].created_by, 'Jade')
				assert.equal(res.body[0].assigned_to, 'FCC')
				assert.equal(res.body[0].open, true)
				assert.equal(res.body[0].created_on, '2022-08-01T15:11:48.751Z')
				assert.equal(res.body[0].updated_on, '2022-08-01T15:11:48.751Z')
				assert.equal(res.body[0]._id, '62e7ed340934499bdcc2afa0')
				assert.equal(res.body[0].status_text, 'good')
				done()
			})
	})

	test("GET request with multiple filters to /api/issues/chai-test-project", done =>{
		chai.request(server)
			.get('/api/issues/chai-test-project')
			.query({
				issue_title: 'First',
				'_id': '62e7ed340934499bdcc2afa0'
			})
			.end((err, res) => {
				assert.equal(res.status, 200)
				assert.equal(res.body[0].issue_title, 'First')
				assert.equal(res.body[0].issue_text, 'This is the first test issue')
				assert.equal(res.body[0].created_by, 'Jade')
				assert.equal(res.body[0].assigned_to, 'FCC')
				assert.equal(res.body[0].open, true)
				assert.equal(res.body[0].created_on, '2022-08-01T15:11:48.751Z')
				assert.equal(res.body[0].updated_on, '2022-08-01T15:11:48.751Z')
				assert.equal(res.body[0]._id, '62e7ed340934499bdcc2afa0')
				assert.equal(res.body[0].status_text, 'good')
				done()
			})
	})

  })

  suite("PUT Requests", () => {

  	test('Update one field with PUT request', done => {
  		chai.request(server)
	  		.put('/api/issues/chai-test-project')
	  		.send({
	  			'_id': '62e7ed510934499bdcc2afa6',
	  			'issue_text': 'This is the updated text'
	  		})
	  		.end((err, res) => {
	  			assert.equal(res.status, 200)
	  			assert.equal(res.body.result, 'successfully updated')
	  			assert.equal(res.body._id, '62e7ed510934499bdcc2afa6')
	  			done()
	  		})
  	})

  	test('Update multiple fields with PUT request', done => {
  		chai.request(server)
	  		.put('/api/issues/chai-test-project')
	  		.send({
	  			'_id': '62e7ed510934499bdcc2afa6',
	  			'issue_text': 'This is the updated text',
	  			'status_text': 'This is the updated status text'
	  		})
	  		.end((err, res) => {
	  			assert.equal(res.status, 200)
	  			assert.equal(res.body.result, 'successfully updated')
	  			assert.equal(res.body._id, '62e7ed510934499bdcc2afa6')
	  			done()
	  		})
  	})

  	test('Update field with missing _id PUT request', done => {
  		chai.request(server)
	  		.put('/api/issues/chai-test-project')
	  		.send({
	  			'issue_text': 'This is the updated text',
	  			'status_text': 'This is the updated status text'
	  		})
	  		.end((err, res) => {
	  			assert.equal(res.status, 200)
	  			assert.equal(res.body.error, 'missing _id')
	  			done()
	  		})
  	})

  	test('PUT request with no fields to update', done => {
  		chai.request(server)
	  		.put('/api/issues/chai-test-project')
	  		.send({
	  			'_id': '62e7ed510934499bdcc2afa6'
	  		})
	  		.end((err, res) => {
	  			assert.equal(res.status, 200)
	  			assert.equal(res.body.error, 'no update field(s) sent')
	  			assert.equal(res.body._id, '62e7ed510934499bdcc2afa6')
	  			done()
	  		})
  	})

  	test('PUT request with invalid _id', done => {
  		chai.request(server)
	  		.put('/api/issues/chai-test-project')
	  		.send({
	  			'_id': '62e7ed510934499bdccLLLLL',
	  			'issue_text': 'This is the updated text',
	  			'status_text': 'This is the updated status text'
	  		})
	  		.end((err, res) => {
	  			assert.equal(res.status, 200)
	  			assert.equal(res.body.error, 'could not update')
	  			assert.equal(res.body._id, '62e7ed510934499bdccLLLLL')
	  			done()
	  		})
  	})

  })

  suite('DELETE Requests', () => {

  	test('Delete an issue', done => {
  		chai.request(server)
  			.delete('/api/issues/apitest')
  			.send({
  				'_id': deleteID
  			})
  			.end((err, res) => {
  				assert.equal(res.status, 200)
  				assert.equal(res.body.result, 'successfully deleted')
  				assert.equal(res.body._id, deleteID)
  				done()
  			})
  	})

	test('Delete an issue with an invalid _id', done => {
		chai.request(server)
			.delete('/api/issues/apitest')
			.send({
				'_id': '123456789'
			})
			.end((err, res) => {
				assert.equal(res.status, 200)
				assert.equal(res.body.error, 'could not delete')
				assert.equal(res.body._id, 	'123456789')
				done()
			})
	})

	test('Delete an issue with a missing _id', done => {
		chai.request(server)
			.delete('/api/issues/apitest')
			.send({})
			.end((err, res) => {
				assert.equal(res.status, 200)
				assert.equal(res.body.error, 'missing _id')
				done()
			})
	})
  })
});
