const jwt = require('jsonwebtoken');

// Authentication middleware
exports.authentication = function (req, res, next) {
    console.log('Authorization Header:', req.headers.authorization); // Debug log for authorization header

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1]; // Extract token

        if (token == null) {
            return res.sendStatus(401); // Unauthorized if no token provided
        } else {
            jwt.verify(token, "GHDFISUGHIUDFHSO", (error, user) => {
                if (error) {
                    console.log('JWT Error:', error);  // Log the error for debugging
                    return res.sendStatus(403); // Forbidden if token verification fails
                } else {
                    req.user = user;  // Attach user info to the request
                    next();  // Proceed to the next middleware or route handler
                }
            });
        }
    } else {
        console.log('Invalid Authorization header');  // Log invalid authorization attempts
        return res.sendStatus(401);  // Unauthorized if header doesn't contain 'Bearer <token>'
    }
}

// Admin authorization middleware
exports.AdminAuthorization = function (req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ Message: "You are not authorized for this" });
    }
}
