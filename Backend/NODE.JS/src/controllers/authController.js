const handleGoogleCallback = (req, res) => {
    try {
        console.log('Google callback - User:', req.user);
        if (!req.user) {
            console.log('No user found in request');
            return res.redirect('http://localhost:3000/login?error=auth_failed');
        }
        // After successful authentication, redirect to frontend dashboard
        res.redirect('http://localhost:3000');
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect('http://localhost:3000/login?error=server_error');
    }
};

const logout = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ error: 'Logout failed' });
            }
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                }
                res.redirect('http://localhost:3000/login');
            });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

const checkAuthenticated = (req, res, next) => {
    console.log('Checking authentication - isAuthenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
};

const getUserProfile = (req, res) => {
    try {
        console.log('Getting user profile - User:', req.user);
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

export default {
    handleGoogleCallback,
    logout,
    checkAuthenticated,
    getUserProfile
}; 