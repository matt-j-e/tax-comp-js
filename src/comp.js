class Comp {
    constructor(employment, pensionState, pensionPrivate, selfEmployment, partnership, rental, interest, dividend, pensionContrib, c4=true) {
        this.fullPA = 12500; // the standard Personal Allowance before income-related taper
        this.paTaperThreshold = 100000 + pensionContrib;
        this.brbTop = 37500 + pensionContrib; // adding gross pension contribs to BRB
        this.hrbTop = 150000; // the top of the HR tax band - the point above which AR kicks in
        this.hrBand = this.hrbTop - (this.brbTop - pensionContrib); // the actual HR band, adjusted for pension contributions
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
        this.earnedIncome = employment + pensionState + pensionPrivate + selfEmployment + partnership + rental
        this.savingsIncome = interest;
        this.dividendIncome = dividend;
        this.totalIncome = this.earnedIncome + this.savingsIncome + this.dividendIncome
        this.c4Income = selfEmployment + partnership;
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
        } else if (this.totalIncome > (this.availablePA() + this.brbTop)) {
          return this.hrSavingsAllowance;
        } else {
          return this.brSavingsAllowance;
        }
    }
}

module.exports = Comp;