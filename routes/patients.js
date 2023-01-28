const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const {isLoggedIn} = require('../middleware')

router.use(isLoggedIn)

router.get('/patients', async (req, res) => {
    const foundPatients = await Patient.find({})
    const patients = foundPatients.sort(cmpRoom);
    function cmpRoom(a, b) {
        return a.room - b.room;
    }
    res.render('index', { patients })
})

router.get('/patients/new', (req, res) => {
    res.render('new')
})

router.get('/patients/:id', async (req, res) => {
    const patient = await Patient.findById(req.params.id)
    res.render('show', { patient })
})

router.get('/patients/:id/edit', async (req, res) => {
    const patient = await Patient.findById(req.params.id)
    res.render('edit', { patient })
})

router.get('/patients/:id/notes', async (req, res) => {
    const patient = await Patient.findById(req.params.id)
    const notes = patient.notes.sort(cmpDate);
    function cmpDate(a, b) {
        return b.date - a.date;
    }
    res.render('notes', { notes, patient })
})

router.post('/patients', async (req, res) => {
    await Patient.create(req.body)
    req.flash('success', 'Patient admitted successfully')
    res.redirect('/patients')
})

router.patch('/patients/:id', async (req, res) => {
    const { id } = req.params
    await Patient.findByIdAndUpdate(id, req.body)
    req.flash('success', 'Patient information updated successfully')
    res.redirect(`/patients/${id}`)
})

router.get('/patients/:id/newNote', async (req, res) => {
    const { id } = req.params
    const patient = await Patient.findById(id)
    res.render('newNote', { id, patient })
})

router.patch('/patients/:id/notes', async (req, res) => {
    const { id } = req.params
    const patient = await Patient.findById(id)
    const {body} = req.body
    const author = `${req.user.firstName} ${req.user.lastName}`
    const newNote = {body,author}
    patient.notes.push(newNote)
    await Patient.findByIdAndUpdate(id, { notes: patient.notes })
    req.flash('success', 'Note added successfully')
    res.redirect(`/patients/${id}/notes`)
})

router.get('/patients/:id/delete', async (req,res) => {
    const {id} = req.params
    const patient = await Patient.findById(id)
    res.render('delete', {patient})
})

router.delete('/patients/:id', async (req,res) => {
    const {id} = req.params
    await Patient.findByIdAndDelete(id)
    req.flash('success', 'Patient discharged successfully')
    res.redirect('/patients')
})

module.exports = router;