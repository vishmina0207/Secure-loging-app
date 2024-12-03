const UserService = require('../services/user_service');
const passwordUtil = require('../util/password_util');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { userName, password, role } = req.body;
        const user = await UserService.checkUserEmail(userName);

        if (!user) {
            await UserService.userRegistration(userName, password, role);
            res.status(200).json({ Message: "User Registered Successfully" });
        } else {
            res.status(409).json({ Message: "Username is already taken" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ Message: "The request is not completed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await UserService.checkUserEmail(userName);

        if (user) {
            const isMatch = await passwordUtil.checkPassword(user, password);
            if (isMatch === true) {
                const accessToken = jwt.sign({ userID: user._id, role: user.role }, "GHDFISUGHIUDFHSO", { expiresIn: "5m" });
                const refreshToken = jwt.sign({ userID: user._id, role: user.role }, "FHKDSFHDJKSHFKDESFHJKG", { expiresIn: "30d" });
                res.status(200).json({ Message: "Logged in successfully", accessToken, refreshToken });
            } else {
                res.status(409).json({ Message: "Invalid Password" });
            }
        } else {
            res.status(409).json({ Message: "Invalid Username" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ Message: "The request is not completed" });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { userID } = req.user; // Access the user data from the JWT token
        const user = await UserService.getUserDetails(userID);
        res.json(user);
    } catch (e) {
        console.log(e);
        res.status(401).json({ Message: "Something Went Wrong!" });
    }
};

exports.changeUserPassword = async (req, res) => {
    try {
        const { userID } = req.user; // Access the user data from the JWT token
        const { currentPassword, newPassword } = req.body;
        const user = await UserService.getUserByID(userID);

        // Check if the current password is correct
        const isMatch = await passwordUtil.checkPassword(user, currentPassword);
        if (isMatch) {
            await UserService.changeUserPassword(user, newPassword);
            res.status(200).json({ Message: "Password changed successfully" });
        } else {
            res.status(409).json({ Message: "Your current password is invalid" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ Message: "Something Went Wrong!" });
    }
};

exports.newToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (refreshToken == null) {
            return res.sendStatus(401); // Unauthorized if no refresh token provided
        }

        jwt.verify(refreshToken, "FHKDSFHDJKSHFKDESFHJKG", (error, user) => {
            if (error) {
                return res.sendStatus(401); // Unauthorized if the refresh token verification fails
            }

            const accessToken = jwt.sign({ userID: user.userID, role: user.role }, "GHDFISUGHIUDFHSO", { expiresIn: "5m" });
            res.status(200).send({ accessToken });
        });
    } catch (error) {
        res.status(400).json({ Message: "The request is not completed" });
    }
};
