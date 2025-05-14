import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';

// Serialize the user for the session
passport.serializeUser((user, done) => {
    try {
        done(null, user.id);
    } catch (error) {
        console.error('Serialize user error:', error);
        done(error, null);
    }
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/auth/google/callback',
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log('Google profile:', profile);

                // Find or create user
                const [user] = await db.User.findOrCreate({
                    where: { googleId: profile.id },
                    defaults: {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile.photos?.[0]?.value,
                        accessToken: accessToken
                    }
                });

                // Update user info if it exists
                if (user) {
                    await user.update({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile.photos?.[0]?.value,
                        accessToken: accessToken
                    });
                }

                return done(null, user);
            } catch (error) {
                console.error('Google strategy error:', error);
                return done(error, null);
            }
        }
    )
);

export default passport; 