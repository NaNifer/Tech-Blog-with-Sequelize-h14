const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

//Get All existing Posts associated to a specific User

router.get("/", withAuth, async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}


module.exports = router;