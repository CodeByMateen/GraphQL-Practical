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
            const updatedUser = users.find(u => u.id === id);
            if (!updatedUser) {
                throw new Error('User not found');
            }
            Object.assign(updatedUser, user);
            return updatedUser;
        },
        deleteUser: (_, { id }) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            return users.splice(userIndex, 1)[0];
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
            const updatedMovie = movies.find(m => m.id === id);
            if (!updatedMovie) {
                throw new Error('Movie not found');
            }
            Object.assign(updatedMovie, movie);
            return updatedMovie;
        },
        deleteMovie: (_, { id }) => {
            const movieIndex = movies.findIndex(movie => movie.id === id);
            if (movieIndex === -1) {
                throw new Error('Movie not found');
            }
            return movies.splice(movieIndex, 1)[0];
        },
    },
};

module.exports = resolvers;