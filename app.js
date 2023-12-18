const path = require('path')
const express = require("express")
const request = require('request')

const app = express()

const search = process.argv[2] //pass  title as arg in terminal

//Search Movie to get movie to pass into similar movie 
const movieSearch = (title, callback) => {
    const url = 'https://api.themoviedb.org/3/search/movie?query=' + title.replace(" ", "+") + '&api_key=b90cd4a98fc411d1865ad0e425b144f6'
    request({ url, json: true }, (error, response, body) => {
        if (error) {
            callback("There is not a movie with this title", undefined);
        } else if (body.results.length === 0) {
            callback("There is not a movie with this title. Try again", undefined);
        } else {
            const results = body.results[0];
            const data = {
                id: +results.id,
                title: results.title,
                poster_path: results.poster_path,
                overview: results.overview,
                release_date: results.release_date,
            };
            callback(undefined, data);
        }
    })
}

//Returns similar movies based off movie id
const similarMovies = (id, callback) => {
    const url = 'https://api.themoviedb.org/3/movie/' + id.toString() + '/similar?language=en-US&page=1&api_key=b90cd4a98fc411d1865ad0e425b144f6'
    request({ url, json: true }, (err, body) => {
        if (err) {
            callback("This title does not exist. Try another title!", undefined)
        } else if (body.success === "false") {
            callback("This title does not exist. Try another title!", undefined)
        } else {
            const results = body.body.results
            const simMov = results.forEach(simMovie => {
                const data =
                {
                    id: simMovie.id,
                    title: simMovie.title,
                    poster_path: simMovie.poster_path,
                    overview: simMovie.overview,
                    release_date: simMovie.release_date
                }
                callback(data)
            });
        }
    })
    
}

// similarMovies(862, (res, err) => {
    //     console.log("Res", res);
    // });

//calling both functions
 movieSearch(search, (err, data) => {
        if (!search) {
            console.log("You must input a movie");
        } else {
            console.log("Movie Searched:", data);
            similarMovies(data.id, (res, err) => {
                console.log('Similar Movies:', res);
            })
        }
    })
    
