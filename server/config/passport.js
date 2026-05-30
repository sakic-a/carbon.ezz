const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let result = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        let user;

        if (result.rows.length === 0) {
          const newUser = await db.query(
            `INSERT INTO users
            (name,email,password,role,google_id)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
              profile.displayName,
              email,
              "",
              "customer",
              profile.id,
            ]
          );

          user = newUser.rows[0];
        } else {
          user = result.rows[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  done(null, result.rows[0]);
});