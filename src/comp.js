class Comp {
    constructor(employment=0, pensionState=0, pensionPrivate=0, selfEmployment=0, partnership=0, rental=0, interest=0, dividend=0, pensionContrib=0, c4=true) {
        this.employment = employment;
        this.pensionState = pensionState;
        this.pensionPrivate = pensionPrivate;
        this.selfEmployment = selfEmployment;
        this.partnership = partnership;
        this.rental = rental;
        this.interest = interest;
        this.dividend = dividend;
        this.pensionContrib = pensionContrib;
        this.c4 = c4;
        this.fullPA = 12500; // the standard Personal Allowance before income-related taper
        this.paTaperStartPoint = 100000; // the standard PA taper point before allowing for pension contributions
        this.brbTopStartPoint = 37500; // the top of the BRB before allowing for pension contributions
        this.hrbTop = 150000; // the top of the HR tax band - the point above which AR kicks in
        this.dividendAllowance = 2000; // dividend nil rate band
        this.brSavingsAllowance = 1000; // savings nil rate band for BR taxpayers
        this.hrSavingsAllowance = 500; // savings nil rate band for HR taxpayers
        this.br = 0.2; // basic rate of tax
        this.hr = 0.4; // higher rate of tax
        this.ar = 0.45; // additional rate of tax
        this.brdiv = 0.075; // basic rate of tax on dividends
        this.hrdiv = 0.325; // higher rate of tax on dividends
        this.ardiv = 0.381; // additional rate of tax on dividends
        this.c4lpl = 8632; // Class 4 NICs Lower Profit Limit
        this.c4upl = 50000; // Class 4 NICs Upper Profit Limit
        this.c4sr = 0.09; // Class 4 NIC standard rate on profit between lower and upper limits
        this.c4ur = 0.02; // Class 4 NIC rate on profit above upper limit
    }

    get paTaperThreshold() {
        // adding gross pension contribs to PA taper trigger
        return this.paTaperStartPoint + this.pensionContrib;
    }

    get brbTop() {
        // adding gross pension contribs to BRB
        return this.brbTopStartPoint + this.pensionContrib;
    }

    get hrBand() {
        // the actual HR band, adjusted for pension contributions
        return this.hrbTop - (this.brbTop - this.pensionContrib);
    }

    get earnedIncome() {
        return this.employment + this.pensionState + this.pensionPrivate + this.selfEmployment + this.partnership + this.rental;
    }

    get savingsIncome() {
        return this.interest;
    }

    get dividendIncome() {
        return this.dividend;
    }

    get totalIncome() {
        return this.earnedIncome + this.savingsIncome + this.dividendIncome;
    }

    get c4Income() {
        return this.selfEmployment + this.partnership;
    }

    get availablePA() {
        if (this.totalIncome < this.paTaperThreshold) {
          return this.fullPA;
        } else if (this.totalIncome > (this.paTaperThreshold + (2 * this.fullPA))) {
          return 0;
        } else {
          const restriction = (this.totalIncome - this.paTaperThreshold) / 2;
          return this.fullPA - restriction;
        }
    }

    get availableSavingsAllowance() {
        if (this.totalIncome > this.hrbTop) {
          return 0;
        } else if (this.totalIncome > (this.availablePA + this.brbTop)) {
          return this.hrSavingsAllowance;
        } else {
          return this.brSavingsAllowance;
        }
    }

    get earnedIncomePA() {
        return Math.min(this.availablePA, this.earnedIncome);
    }

    get savingsIncomePA() {
        return Math.min(this.availablePA - this.earnedIncomePA, this.savingsIncome);
    }

    get dividendIncomePA() {
        return Math.min(this.availablePA - this.earnedIncomePA - this.savingsIncomePA, this.dividendIncome);
    }

    get taxableEarnedIncome() {
        return this.earnedIncome - this.earnedIncomePA;
    }

    get taxableSavingsIncome() {
        return this.savingsIncome - this.savingsIncomePA;
    }

    get taxableDividendIncome() {
        return this.dividendIncome - this.dividendIncomePA;
    }

    get earnedIncomeBRB() {
        return Math.min(this.brbTop, this.taxableEarnedIncome);
    }

    get savingsIncomeBRB() {
        return Math.min(this.brbTop - this.earnedIncomeBRB, this.taxableSavingsIncome);
    }
}

module.exports = Comp;