import Asset from "../models/Asset.js";


class AssetController {
    grantAsset = async (req, res, next) => {
        try {
            const {
                tokenID,
                uri,
                tokenName,
                user,
                image,
                valuation,
                signature
            } = req.body

            if (!tokenID || !uri || !tokenName || !user || !image || !valuation || !req.user) {
                res.status(400);
                return next(new Error('Invalid request body for create Asset'));
            }



            const newAsset = new Asset({
                tokenID,
                uri,
                tokenName,
                user,
                image,
                valuation,
                status: 'not-activated',
                signature
            })
            await newAsset.save()
            res.status(201).json(newAsset)
        } catch (error) {
            next(error);
        }
    }

    addAsset = async (req, res, next) => {
        try {
            const {
                tokenID,
                uri,
                tokenName,
                user,
                image,
                valuation,
            } = req.body;


            if (valuation <= 0 || !tokenID || !tokenName || !valuation || !req.user.id || !image) {
                res.status(400);
                return next(new Error('Invalid request body for create Asset'));
            }
            const newAsset = new Asset({
                tokenID,
                uri,
                tokenName,
                user: user,
                image,
                valuation,
                status: 'default'
            })
            await newAsset.save()
            res.status(201).json(newAsset)
        } catch {
            next(error)
        }
    }

    mintAsset = async (req, res, next) => {
        try {
            const user = req.user;
            const {
                assetID
            } = req.body;
            
            if (!assetID || !user) {
                res.status(400);
                return next(new Error('Invalid request body for create Asset'));
            }

            const asset = await Asset.findById(assetID)
            if (user.id != asset.user){
                res.status(400);
                return next(new Error('You are not granted mint asset permissions'));
            }
            
            const updatedAsset = await Asset.findOneAndUpdate({_id: assetID}, {status: 'default'})
            res.status(201).json(updatedAsset)
        } catch {
            next(error)
        }
    }

    getAssets = async (req, res, next) => {
        try {
            const nfts = await Asset.find({user: req.user.id}).sort({status: -1, createdAt: -1  })
            res.status(200).json(nfts)
        } catch (error) {
            next(error)
        }
    }
}

export default new AssetController()
