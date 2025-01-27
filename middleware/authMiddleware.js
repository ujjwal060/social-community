import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 401,
            message: ["Unauthorized access."],
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: ["expired token. Please login again."],
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await UserModel.findOne({ _id: decoded.userId, refreshToken });

        if (!user) {
            return res.status(403).json({
                status: 403,
                message: ["Invalid refresh token."],
            });
        }

        const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email, mobile: user.mobile },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            status: 200,
            message: ["New access token generated."],
            accessToken: newAccessToken,
        });
    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: ["Expired refresh token. Please login again."],
        });
    }
}

export {
    authenticateUser,
    refreshToken
};
