const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const { isAdmin } = require('../middleware')

router.use(isLoggedIn, isAdmin)


router.get('/userIndex', async (req, res) => {
    const foundUsers = await User.find({});

    const users = foundUsers.sort(cmpName);
    function cmpName(a, b) {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    }

    res.render('userIndex', { users })
})

router.get('/:id/editUser', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('editUser', { user })
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const update = req.body
    if (!update.isAdmin) {
        update.isAdmin = false
    }
    if (!update.isNurse) {
        update.isNurse = false
    }
    await User.findByIdAndUpdate(id, update)
    req.flash('success', 'User information updated successfully')
    res.redirect(`/users/userIndex`)
})

router.get('/:id/deleteUser', async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    res.render('deleteUser', { user })
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    req.flash('success', 'User deleted successfully')
    res.redirect('/users/userIndex')
})

router.get('/newUser', (req, res) => {
    res.render('newUser')
})

router.post('/newUser', async (req, res) => {
    try {
        const { firstName, lastName, username, password, isNurse, isAdmin } = req.body;
        const user = new User({ firstName, lastName, username, isNurse, isAdmin });
        const newUser = await User.register(user, password);
        req.flash('success', 'New user created successfully');
        res.redirect('/users/userIndex');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/userIndex');
    }
})

module.exports = router;