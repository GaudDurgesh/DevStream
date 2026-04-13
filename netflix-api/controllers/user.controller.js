import User from "../models/user.model.js";

export const addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },

          {
            new: true,
          },
        );
      } else return res.json({ msg: "Movie already added in Liked list" });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ msg: "Movie Added sucessfully" });
  } catch (error) {
    return res.json({ msg: "Error...." });
  }
};

export const getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      res.json({ msg: "Sucess", movies: user.likedMovies });
    } else return res.json({ msg: "User with given email is not found" });
  } catch (error) {
    return res.json({ msg: "Error fetching movie" });
  }
};

export const removeFromlikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
  return res.status(400).send({ msg: "Movie not found." });
}
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true },
      );
      return res.json({ msg: "Movie successfully removed.", movies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.json({ msg: "Error removing movie to the liked list" });
  }
};
