import express from 'express';
import cors from 'cors';
import homeController from '../controllers/homeControllers';
import authController from '../controllers/authController';
import passport from '../config/passport.js';

let router = express.Router();

let initWebRoutes = (app) => {
    // Enable CORS with credentials
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    router.get('/', homeController.getHomePage);

    // Debug route to check if Google OAuth is configured
    router.get('/auth/check-config', (req, res) => {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        res.json({
            isConfigured: !!(clientId && clientSecret),
            missingKeys: {
                clientId: !clientId,
                clientSecret: !clientSecret
            }
        });
    });

    // Google OAuth routes
    router.get('/auth/google',
        (req, res, next) => {
            console.log('Starting Google authentication');
            passport.authenticate('google', {
                scope: ['profile', 'email'],
                prompt: 'select_account'
            })(req, res, next);
        }
    );

    router.get('/auth/google/callback',
        (req, res, next) => {
            console.log('Google callback received');
            passport.authenticate('google', {
                failureRedirect: 'http://localhost:3000/login?error=auth_failed'
            })(req, res, next);
        },
        authController.handleGoogleCallback
    );

    // User profile route
    router.get('/api/user/profile',
        authController.checkAuthenticated,
        authController.getUserProfile
    );

    // Logout route
    router.get('/auth/logout', authController.logout);

    return app.use('/', router);
}

export default initWebRoutes;
// module.exports = router;