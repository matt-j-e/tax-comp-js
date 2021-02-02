const Comp = require("../src/comp.js");

describe("Comp initialisation", () => {

    it("can be instantiated", () => {
        expect(new Comp()).toBeInstanceOf(Object);
    });

});

describe("income groupings", () => {

    const comp = new Comp(30000, 5000, 12000, 2500, 0, 4000, 500, 6000, 0);

    it("calculates total income", () => {
        expect(comp.totalIncome).toBe(30000+5000+12000+2500+4000+500+6000);
    });

    it("identifies earned income", () => {
        expect(comp.earnedIncome).toBe(30000+5000+12000+2500+4000);
    });

    it("identifies savings income", () => {
        expect(comp.savingsIncome).toBe(500);
    });

    it("identifies dividend income", () => {
        expect(comp.dividendIncome).toBe(6000);
    });

});

describe("allowances whose values are dependent on income levels", () => {

    const comp = new Comp();
    comp.pensionContrib = 12000;
    
    it("includes pension contributions in the personal allowance taper income trigger", () => {
        expect(comp.paTaperThreshold).toBe(100000 + 12000);
    });

    it("extends the BR band by gross amount of pension contributions", () => {
        expect(comp.brbTop).toBe(37500 + 12000);
    });

});

describe("availablePA", () => {

    const comp = new Comp();

    it("reduces the PA to nil where income high enough", () => {
        comp.employment = 140000;
        expect(comp.availablePA).toBe(0);
    })

    it("calculates full PA where income below threshold", () => {
        comp.employment = 80000;
        expect(comp.availablePA).toBe(12500);
    });

    it("calculates full PA where income above threshold but pension contributions extend the threshold greater than the excess", () => {
        comp.employment = 110000;
        comp.pensionContrib = 12000;
        expect(comp.availablePA).toBe(12500);
    });

    it("restricts the PA and allows for pension contributions", () => {
        comp.employment = 120000;
        comp.pensionContrib = 10000;
        expect(comp.availablePA).toBe(7500);
    });

});

describe("availableSavingsAllowance", () => {

    const comp = new Comp();
    comp.pensionContrib = 2000;

    it("allocates full allowance for BR taxpayer", () => {
        comp.employment = 40000;
        expect(comp.availableSavingsAllowance).toBe(1000);
    });

    it("allocates full allowance for BR taxpayer - pension across the margin", () => {
        comp.employment = 51000;
        expect(comp.availableSavingsAllowance).toBe(1000);
    });

    it("allocates reduced allowance for HR taxpayer", () => {
        comp.employment = 80000;
        expect(comp.availableSavingsAllowance).toBe(500);
    });

    it("allocates zero allowance for AR taxpayer", () => {
        comp.employment = 180000;
        expect(comp.availableSavingsAllowance).toBe(0);
    });

});

describe("earnedIncomePA", () => {

    const comp = new Comp();

    it("allocates no PA where no earned income", () => {
        expect(comp.earnedIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of earned income where that is lower", () => {
        comp.employment = 5000;
        expect(comp.earnedIncomePA).toBe(5000);
    });

    it("allocates all available PA to earned income where that is greater", () => {
        comp.employment = 14000;
        expect(comp.earnedIncomePA).toBe(12500);
    });

});

describe("savingsIncomePA", () => {

    const comp = new Comp();

    it("allocates no PA where no savings income", () => {
        expect(comp.savingsIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned income", () => {
        comp.employment = 13000;
        comp.interest = 1000;
        expect(comp.savingsIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of savings income where that is lower", () => {
        comp.employment = 5000;
        comp.interest = 1000;
        expect(comp.savingsIncomePA).toBe(1000);
    });

    it("allocates all available PA to savings income where that is greater", () => {
        comp.employment = 0; // override employment in prev. test
        comp.interest = 20000;
        expect(comp.savingsIncomePA).toBe(12500);
    });

    it("allocates all available PA to savings income where that is greater (with some earned income)", () => {
        comp.employment = 8000;
        comp.interest = 20000;
        expect(comp.savingsIncomePA).toBe(4500);
    });

});

describe("dividendIncomePA", () => {

    const comp = new Comp();

    it("allocates no PA where no dividend income", () => {
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned income", () => {
        comp.employment = 13000;
        comp.dividend = 4000;
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to savings income", () => {
        comp.employment = 0;
        comp.interest = 13000;
        comp.dividend = 4000;
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned & savings income combined", () => {
        comp.employment = 10000;
        comp.interest = 2500;
        comp.dividend = 4000;
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of dividend income where that is lower", () => {
        comp.employment = 5000;
        comp.interest = 500;
        comp.dividend = 1000;
        expect(comp.dividendIncomePA).toBe(1000);
    });

    it("allocates all available PA to dividend income where that is greater", () => {
        comp.employment = 0;
        comp.interest = 0;
        comp.dividend = 20000;
        expect(comp.dividendIncomePA).toBe(12500);
    });

    it("allocates all available PA to dividend income where that is greater (with some earned & savings income)", () => {
        comp.employment = 8000;
        comp.interest = 2000;
        comp.dividend = 20000;
        expect(comp.dividendIncomePA).toBe(12500-8000-2000);
    });

});

describe("taxable income - all three types", () => {

    const comp = new Comp();

    it("calculates taxable earned income of 0 when earned income is 0", () => {
        expect(comp.taxableEarnedIncome).toBe(0);
    });

    it("calculates taxable earned income of 0 when earned income below PA", () => {
        comp.employment = 8000;
        expect(comp.taxableEarnedIncome).toBe(0);
    });

    it("calculates taxable earned income when earned income above PA", () => {
        comp.employment = 60000;
        expect(comp.taxableEarnedIncome).toBe(60000-12500);
    });

    it("calculates taxable earned income when PA fully tapered because of total income", () => {
        comp.employment = 150000;
        expect(comp.taxableEarnedIncome).toBe(150000);
    });

    it("calculates taxable savings income of 0 when savings income is 0", () => {
        comp.employment = 0;
        expect(comp.taxableSavingsIncome).toBe(0);
    });

    it("calculates taxable savings income of 0 when savings income below available PA", () => {
        comp.employment = 6000;
        comp.interest = 5000;
        expect(comp.taxableSavingsIncome).toBe(0);
    });

    it("calculates taxable savings income when savings income above available PA", () => {
        comp.employment = 6000;
        comp.interest = 10000;
        expect(comp.taxableSavingsIncome).toBe(10000-(12500-6000));
    });

    it("calculates taxable savings income when PA fully tapered because of total income" ,() => {
        comp.employment = 0;
        comp.interest = 150000;
        expect(comp.taxableSavingsIncome).toBe(150000);
    });

    it("calculates taxable dividend income of 0 when dividend income is 0", () => {
        comp.employment = 0;
        comp.interest = 0;
        expect(comp.taxableDividendIncome).toBe(0);
    });

    it("calculates taxable dividend income of 0 when dividend income below available PA", () => {
        comp.employment = 6000;
        comp.dividend = 5000;
        expect(comp.taxableDividendIncome).toBe(0);
    });

    it("calculates taxable dividend income when dividend income above available PA", () => {
        comp.employment = 6000;
        comp.dividend = 10000;
        expect(comp.taxableDividendIncome).toBe(10000-(12500-6000));
    });

    it("calculates taxable dividend income when PA fully tapered because of total income", () => {
        comp.employment = 0;
        comp.dividend = 150000;
        expect(comp.taxableDividendIncome).toBe(150000);
    });
});

describe("application of the basic rate band to earned income", () => {

    const comp = new Comp();

    it("determines the chunk of earned income that sits in the BR band for BR taxpayer", () => {
        comp.employment = 40000;
        expect(comp.earnedIncomeBRB).toBe(40000-12500);
    });

    it("determines the chunk of earned income that sits in the BR band for HR+ taxpayer", () => {
        comp.employment = 80000;
        expect(comp.earnedIncomeBRB).toBe(37500);
    });
});

describe("application of the basic rate band to savings income", () => {

    const comp = new Comp();

    it("determines savings income that sits in the BR band for BR taxpayer with no earned income", () => {
        comp.interest = 40000;
        expect(comp.savingsIncomeBRB).toBe(40000-12500);
    });

    it("determines savings income that sits in the BR band for HR+ taxpayer with no earned income", () => {
        comp.interest = 60000;
        expect(comp.savingsIncomeBRB).toBe(37500);
    });

    it("determines savings income that sits in the BR band for BR taxpayer with earned income using the PA", () => {
        comp.employment = 20000;
        comp.interest = 10000;
        expect(comp.savingsIncomeBRB).toBe(10000);
    });

    it("determines savings income that sits in the BR band for HR+ taxpayer where savings chunk straddles top of BR band", () => {
        comp.employment = 40000;
        comp.interest = 15000;
        expect(comp.savingsIncomeBRB).toBe(10000);
    });

    it("determines that no BR band is available for savings income where it's all used up by earned income", () => {
        comp.employment = 60000;
        comp.interest = 1000;
        expect(comp.savingsIncomeBRB).toBe(0);
    });

});

describe("the application of the zero rate savings allowance within the BR band" ,() => {

    const comp = new Comp();

    it("restricts the savings allowance to BR savings income where that is less than the available savings allowance", () => {
        comp.employment = 20000;
        comp.interest = 200;
        expect(comp.savingsIncomeBRZero).toBe(200);
    });

    it("is nil when BR band all used by earned income", () => {
        comp.employment = 60000;
        comp.interest = 1000;
        expect(comp.savingsIncomeBRZero).toBe(0);
    });

    it("applies full available savings allowance where it is less than BR band savings income", () => {
        comp.employment = 20000;
        comp.interest = 4000;
        expect(comp.savingsIncomeBRZero).toBe(1000);
    });

    it("applies the reduced rate where dividend income causes HR tax liability", () => {
        comp.employment = 20000;
        comp.interest = 4000;
        comp.dividend = 40000;
        expect(comp.savingsIncomeBRZero).toBe(500);
    });

    it("is nil when dividend income causes AR tax liability", () => {
        comp.employment = 20000;
        comp.interest = 4000;
        comp.dividend = 140000;
        expect(comp.savingsIncomeBRZero).toBe(0);
    });

});

describe("application of the basic rate band to dividend income", () => {

    const comp = new Comp();

    it("determines dividend income that sits in the BR band for BR taxpayer with no earned or savings", () => {
        comp.dividend = 40000;
        expect(comp.dividendIncomeBRB).toBe(40000-12500);
    });

    it("determines dividend income that sits in the BR band for HR+ taxpayer with no earned or savings income", () => {
        comp.dividend = 60000;
        expect(comp.dividendIncomeBRB).toBe(37500);
    });

    it("determines dividend income that sits in the BR band for BR taxpayer with earned and/or savings income using the PA", () => {
        comp.employment = 20000;
        comp.dividend = 10000;
        expect(comp.dividendIncomeBRB).toBe(10000);
    });

    it("determines dividend income that sits in the BR band for HR+ taxpayer where dividend chunk straddles top of BR band", () => {
        comp.employment = 40000;
        comp.dividend = 15000;
        expect(comp.dividendIncomeBRB).toBe(10000);
    });

    it("determines that no BR band is available for dividend income where it's all used up by earned and/or savings income", () => {
        comp.employment = 60000;
        comp.dividend = 1000;
        expect(comp.dividendIncomeBRB).toBe(0);
    });

});

describe("the application of the zero rate dividend allowance within the BR band" ,() => {

    const comp = new Comp();

    it("restricts the dividend allowance to BR dividend income where that is less than the available dividend allowance", () => {
        comp.employment = 20000;
        comp.dividend = 1000;
        expect(comp.dividendIncomeBRZero).toBe(1000);
    });

    it("is nil when BR band all used by earned and/or savings income", () => {
        comp.employment = 60000;
        comp.dividend = 1000;
        expect(comp.dividendIncomeBRZero).toBe(0);
    });

    it("applies full available dividend allowance where it is less than BR band dividend income", () => {
        comp.employment = 20000;
        comp.dividend = 4000;
        expect(comp.dividendIncomeBRZero).toBe(2000);
    });

});

describe("basic rate tax liabilities", () => {

    const comp = new Comp();

    it("calculates BR tax of nil on earnings within PA", () => {
        comp.employment = 8000;
        expect(comp.earnedIncomeBRTax).toBe(0);
    });

    it("calculates BR tax on earned income for an overall BR taxpayer", () => {
        comp.employment = 40000;
        expect(comp.earnedIncomeBRTax).toBe(5500);
    });

    it("calculates BR tax on earned income for an overall HR taxpayer", () => {
        comp.employment = 40000;
        comp.interest = 10000;
        comp.dividends = 40000;
        expect(comp.earnedIncomeBRTax).toBe(5500);
    });

    it("calculates BR tax on earned income for a taxpayer with HR earnings income", () => {
        comp.employment = 60000;
        comp.interest = 10000;
        comp.dividends = 40000;
        expect(comp.earnedIncomeBRTax).toBe(7500);
    });
    
});