import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import provider from "../config/provider.js";
const providerDefault = provider[1001];

class AuthService {

    register = async(address) => {
        const newUser = new User({address})
        await newUser.save();
        return newUser;
    }

    login = async (body) => {
        const {address, signature, message} = body;
        let isCreated = false;

        if(!this.verifyUser(address, message, signature)) {
            throw {
                statusCode: 401,
                error: new Error('Invalid credentials')
            };
        }

        let user = await User.findOne({ address});

        if(!user) {
            user = await this.register(address);
            isCreated = true;
        }

        const {accessToken, refreshToken} = this.genTokens({
            id: user._id,
            address: user.address
        });

        return {
            user,
            accessToken,
            refreshToken,
            isCreated
        }
    }

    verifyUser = (address, message, signature) => {
        return address === providerDefault.WEB3.eth.accounts.recover(message ,signature);
    }

    genTokens = (payload) => {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return {
            accessToken,
            refreshToken
        }
    }

    reGenerateAccessToken = (refreshToken) => {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const tokens = this.genTokens({
            id: decoded.id,
            address: decoded.address
        });

        console.log(tokens)

        return {
            newAccessToken: tokens.accessToken,
            newRefreshToken: tokens.refreshToken
        };
    }
}

export default new AuthService()