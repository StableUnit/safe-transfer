import jwt from "jsonwebtoken";

const SECRET_KEY = "someSecretKey";

export const generateUrl = (address: string, to: string, value: string) => {
    const { origin } = window.location;
    const token = jwt.sign({ address, to, value }, SECRET_KEY);

    return `${origin}?token=${token}`;
};

export const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};
