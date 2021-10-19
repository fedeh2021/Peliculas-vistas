const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const uploadFile = require ("../middlewares/imageMiddleware");

router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);
router.get('/movies/search', moviesController.search)
//Rutas exigidas para la creación del CRUD
router.get('/movies/add', moviesController.add);
router.post('/movies/create', uploadFile.single('image'), moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.post('/movies/edit/:id', moviesController.update);
router.delete('/movies/:id', moviesController.delete);
router.post('/movies/delete/:id', moviesController.destroy);

module.exports = router;