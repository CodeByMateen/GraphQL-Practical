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
    Mutation: {
        createUser: (_, { user }) => {
            const newUser = {
                id: String(users.length + 1),
                friends: [],
                favoriteMovies: [],
                ...user,
            };
            users.push(newUser);
            return newUser;
        },
        updateUser: (_, { id, user }) => {
            const updatedUser = users.find(user => user.id === id);
            if (!updatedUser) {
                throw new Error('User not found');
            }
            updatedUser.update(user);
            return updatedUser;
        },
        deleteUser: (_, { id }) => {
            return users.find(user => user.id === id).delete();
        },
        createMovie: (_, { movie }) => {
            const newMovie = {
                id: String(movies.length + 1),
                ...movie,
            };
            movies.push(newMovie);
            return newMovie;
        },
        updateMovie: (_, { id, movie }) => {
            const updatedMovie = movies.find(movie => movie.id === id);
            if (!updatedMovie) {
                throw new Error('Movie not found');
            }
            updatedMovie.update(movie);
            return updatedMovie;
        },
        deleteMovie: (_, { id }) => {
            return movies.find(movie => movie.id === id).delete();
        },
    },
};

module.exports = resolvers;