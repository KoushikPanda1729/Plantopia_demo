import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import dotenv from "dotenv";
dotenv.config("./.env");
import { User } from "./models/user.model.js";
import { generateAccessTokenAndRefreshToken } from "./controllers/user.controller.js";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/v1/users/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      let {
        given_name: userName,
        email,
        sub: password,
        name: fullName,
        role = "user",
        picture: url,
        email_verified: isVerified,
      } = profile?._json;
      if (
        [userName, email, password, fullName, url, role].some(
          (field) => field.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are required");
      }

      try {
        let user = await User.findOne({ email }).select(
          "-password -refreshToken -answer"
        );
        if (user) {
          // Login logic
          const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user?._id);
          return done(null, { user: user, accessToken, refreshToken });
        } else {
          // Sign-up logic
          const address = false;
          const answer = false;
          userName = userName + Math.floor(Math.random() * 100000).toString();
          const user = await User.create({
            userName,
            email,
            password,
            fullName,
            address,
            answer,
            role,
            isVerified,
            profileImage: {
              public_id: "123456",
              url,
            },
          });
          const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user?._id);
          return done(null, { user: user, accessToken, refreshToken });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
