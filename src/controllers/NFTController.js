import NFT from "../models/NFT";

class NFTController {
    addNFT = async (req, res, next) => {
        try {
            console.log('vcl')
            const user = req.user;
            const {
                tokenID,
                tokenName,
                image,
                valuation,
            } = req.body;

            console.log(tokenID, tokenName, valuation, image)

            if (valuation <= 0 || !tokenID || !tokenName || !valuation || !user || !image) {
                res.status(400);
                return next(new Error('Invalid request body for create NFT'));
            }
            const newNFT = new NFT({
                tokenID,
                tokenName,
                image,
                user: user.id,
                valuation,
                status: 'default'
            })

            await newNFT.save()
            res.status(201).json(newNFT)
        } catch {
            next(error)
        }
    }

    getNFTs = async (req, res, next) => {
        try {
            const nfts = await NFT.find({user: req.user.id})
            res.status(200).json(nfts)
        } catch (error) {
            next(error)
        }
    }
}

export default new NFTController()
