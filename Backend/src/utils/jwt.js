import jwt from "jsonwebtoken";

export function genererToken(payload) {

    return jwt.sign(

        payload,

        process.env.JWT_SECRET,

        {

            expiresIn: process.env.JWT_EXPIRES_IN

        }

    );

}

export function verifierToken(token) {

    return jwt.verify(

        token,

        process.env.JWT_SECRET

    );

}