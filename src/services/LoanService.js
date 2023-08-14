class LoanService {
    getAllLoanPending = async () => {
        const {
            fromTokenId,
            fromValueUp,
            fromValueDown,

            toTokenId,
            toValueUp,
            toValueDown,

            network,
            page
        } = filter;


        const filterQuery = {
            'fromValue.amount': {
                $gte: fromValueDown,
                $lte: fromValueUp
            },

            'toValue.amount': {
                $gte: toValueDown,
                $lte: toValueUp
            },
            transactionType: 'exchange',
            status: 'pending'
        };

        if(fromTokenId) filterQuery['fromValue.token'] = fromTokenId;
        if(toTokenId) filterQuery['toValue.token'] = toTokenId;

        let allExchangeTx = await getAllBeforePopulate(Transaction, filterQuery, null, {}).populate([
            {path: 'from', select: '_id address'},
            {path: 'to', select: '_id address'},
            {path: 'fromValue.token', select: '-createdAt -updatedAt -__v'},
            {path: 'toValue.token', select: '-createdAt -updatedAt -__v'},
        ])
        .sort('-createdAt');

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;

        allExchangeTx = allExchangeTx.filter(tx => {
            if(network > 0) {
                return tx.fromValue.token.network === network && tx.toValue.token.network === network;
            }
            if(network === 0) {
                return tx.fromValue.token.network !== tx.toValue.token.network;
            }
            return true;
        }).slice(from, to);

        console.log(allExchangeTx.length);

        return allExchangeTx;
    }
}