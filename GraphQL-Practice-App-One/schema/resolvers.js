const users = require('../db/user');
const movies = require('../db/movie');

const resolvers = {
    Query: {
        users: () => {
            return users;
        },
        user: (_, { id }) => {
            return users.find(user => user.id === id);
        },
        movies: () => {
            return movies;
        },
        movie: (_, { title }) => {
            return movies.find(movie => movie.title === title);
        },
    },
    User: {
        friends: (parent) => {
            return parent.friends.map(friendId => users.find(user => user.id === friendId));
        },
        favoriteMovies: (parent) => {
            return parent.favoriteMovies.map(movieId => movies.find(movie => movie.id === movieId));
        },
    },
};

module.exports = resolvers;