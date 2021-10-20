const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { response } = require('express');
const moment = require('moment');
const uploadFile = require ("../middlewares/imageMiddleware");

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })    
        .then((movies) => {
            
          // let listaMovies = [];
           //for(Movie of Movie) {
            //listaMovies.push(Movie.title)
           // }
            //let objaux = {
             //   nombre: Movie.title
            //}
           // listaMovies.push(objaux)
            res.render("moviesList", {movies})
        })
    },
    'detail': (req, res) => {
        Movies.findByPk(req.params.id, {
            include: ['genre']
        })
            .then(movie => {
                res.render("moviesDetail", {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render("newestMovies", {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render("recommendedMovies", {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))  
    },
    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                imagen: req.file.filename,
                genre_id: req.body.genre_id
            }
        )
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    edit: (req,res) => {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: (req,res) => {
        let movieId = req.params.id; 
        Movies.update({
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                imagen: (req.file? req.file.filename: Movies.imagen),
                genre_id: req.body.genre_id
            },{
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views', 'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
        
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/')})
        .catch(error => res.send(error)) 
    },
    
    search: function (req, res) {
        db.Movie.findAll({
            where: { title: {[Op.like]: '%' + req.query.keyword + '%'}}
        }).then(movies => {
            if (movies.length > 0) {
            return res.render("moviesSearch", {movies});
        }
        return res.status(200).json('No existen peliculas')
        })
    }
}

module.exports = moviesController;