class Comp {
    constructor(profile, rates) {
        this.employment = profile.employment;
        this.pensionState = profile.pensionState;
        this.pensionPrivate = profile.pensionPrivate;
        this.selfEmployment = profile.selfEmployment;
        this.partnership = profile.partnership;
        this.rental = profile.rental;
        this.interest = profile.interest;
        this.dividend = profile.dividend;
        this.pensionContrib = profile.pensionContrib;
        this.c4 = profile.c4;

        this.fullPA = rates.fullPA; // the standard Personal Allowance before income-related taper
        this.paTaperStartPoint = rates.paTaperStartPoint; // the standard PA taper point before allowing for pension contributions
        this.brbTopStartPoint = rates.brbTopStartPoint; // the top of the BRB before allowing for pension contributions
        this.hrbTop = rates.hrbTop; // the top of the HR tax band - the point above which AR kicks in
        this.dividendAllowance = rates.dividendAllowance; // dividend nil rate band
        this.brSavingsAllowance = rates.brSavingsAllowance; // savings nil rate band for BR taxpayers
        this.hrSavingsAllowance = rates.hrSavingsAllowance; // savings nil rate band for HR taxpayers
        this.br = rates.br; // basic rate of tax
        this.hr = rates.hr; // higher rate of tax
        this.ar = rates.ar; // additional rate of tax
        this.brdiv = rates.brdiv; // basic rate of tax on dividends
        this.hrdiv = rates.hrdiv; // higher rate of tax on dividends
        this.ardiv = rates.ardiv; // additional rate of tax on dividends
        this.c4lpl = rates.c4lpl; // Class 4 NICs Lower Profit Limit
        this.c4upl = rates.c4upl; // Class 4 NICs Upper Profit Limit
        this.c4sr = rates.c4sr; // Class 4 NIC standard rate on profit between lower and upper limits
        this.c4ur = rates.c4ur; // Class 4 NIC rate on profit above upper limit
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

    get savingsIncomeBRZero() {
        return Math.min(this.savingsIncomeBRB, this.availableSavingsAllowance);
    }

    get dividendIncomeBRB() {
        return Math.min(this.brbTop - this.earnedIncomeBRB - this.savingsIncomeBRB, this.taxableDividendIncome);
    }

    get dividendIncomeBRZero() {
        return Math.min(this.dividendIncomeBRB, this.dividendAllowance);
    }

    get earnedIncomeBRTax() {
        return this.earnedIncomeBRB * this.br;
    }

    get savingsIncomeBRTax() {
        return (this.savingsIncomeBRB - this.savingsIncomeBRZero) * this.br;
    }
      
    get dividendIncomeBRTax() {
        return (this.dividendIncomeBRB - this.dividendIncomeBRZero) * this.brdiv;
    }

    get earnedIncomeHRB() {
        return Math.min(this.hrBand, this.taxableEarnedIncome - this.earnedIncomeBRB);
    }
      
    get savingsIncomeHRB() {
        return Math.min(this.hrBand - this.earnedIncomeHRB, this.taxableSavingsIncome - this.savingsIncomeBRB);
    }
      
    get savingsIncomeHRZero() {
        return Math.min(this.savingsIncomeHRB, this.availableSavingsAllowance - this.savingsIncomeBRZero);
    }
      
    get dividendIncomeHRB() {
        return Math.min(this.hrBand - this.earnedIncomeHRB - this.savingsIncomeHRB, this.taxableDividendIncome - this.dividendIncomeBRB);
    }
      
    get dividendIncomeHRZero() {
        return Math.min(this.dividendIncomeHRB, this.dividendAllowance - this.dividendIncomeBRZero);
    }

    get earnedIncomeHRTax() {
        return this.earnedIncomeHRB * this.hr;
    }
      
    get savingsIncomeHRTax() {
        return (this.savingsIncomeHRB - this.savingsIncomeHRZero) * this.hr;
    }
      
    get dividendIncomeHRTax() {
        return (this.dividendIncomeHRB - this.dividendIncomeHRZero) * this.hrdiv;
    }

    get earnedIncomeARB() {
        return this.taxableEarnedIncome - this.earnedIncomeHRB - this.earnedIncomeBRB;
    }
      
    get savingsIncomeARB() {
        return this.taxableSavingsIncome - this.savingsIncomeHRB - this.savingsIncomeBRB;
    }
      
    get dividendIncomeARB() {
        return this.taxableDividendIncome - this.dividendIncomeHRB - this.dividendIncomeBRB;
    }

    get dividendIncomeARZero() {
        return Math.min(this.dividendIncomeARB, this.dividendAllowance - this.dividendIncomeHRZero - this.dividendIncomeBRZero);
    }
      
    get earnedIncomeARTax() {
        return this.earnedIncomeARB * this.ar;
    }
      
    get savingsIncomeARTax() {
        return this.savingsIncomeARB * this.ar;
    }
      
    get dividendIncomeARTax() {
        return (this.dividendIncomeARB - this.dividendIncomeARZero) * this.ardiv;
    }

    get allARTax() {
        return this.earnedIncomeARTax + this.savingsIncomeARTax + this.dividendIncomeARTax;
    }
      
    get allHRTax() {
        return this.earnedIncomeHRTax + this.savingsIncomeHRTax + this.dividendIncomeHRTax;
    }
      
    get allBRTax() {
        return this.earnedIncomeBRTax + this.savingsIncomeBRTax + this.dividendIncomeBRTax;
    }
      
    get allTax() {
        return this.allARTax + this.allHRTax + this.allBRTax;
    }

    get c4liability() {
        if (this.c4 === false) return 0;
        if (this.c4Income <= this.c4lpl) return 0;
        const sr_earnings = Math.min(this.c4upl - this.c4lpl, this.c4Income - this.c4lpl);
        const ur_earnings = Math.max(this.c4Income - this.c4upl, 0);
        return (sr_earnings * this.c4sr) + (ur_earnings * this.c4ur);
    }
    
    get allTaxNI() {
        return this.allTax + this.c4liability;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Comp;
} else {
    window.Comp = Comp;
}