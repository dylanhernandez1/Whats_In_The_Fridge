class StockPortfolio{
    //Constructor consists of collection of symbols and the corresponding number of shares, represented by dictionary
    //And a count of unique shares the user holds
    constructor() {
        this.portfolio = {};
        this.unique_shares = 0;
    }

    is_empty() {
        //Returns true if portfolio is empty, otherwise false
        return (this.unique_shares === 0);
    }

    make_purchase(symbol, shares) {
        //Make purchase for symbol with given number of shares
        //If purchase is 0 or less shares, just return
        if (shares <= 0){
            return;
        }

        //Check if it exists in the dictionary already
        if (!this.portfolio[symbol]) {
            this.portfolio[symbol] = 0;
            this.unique_shares += 1; //New share
        }

        //Add shares
        this.portfolio[symbol] += shares;
    }

    make_sale(symbol, shares) {
        //Make sale for symbol with given number of shares
        //Check to make sure it exists in the dictionary
        let current_shares = this.portfolio[symbol];
        if (current_shares){
            //If trying to sell more than user has, just remove from dictionary
            if (current_shares <= shares){
                delete this.portfolio[symbol];
                this.unique_shares -= 1; //Now this share does not exist in portfolio
            }else{
                //Otherwise, subtract shares from symbol's amount
                this.portfolio[symbol] -= shares;
            }
        }
    }

}



exports.StockPortfolio = StockPortfolio;