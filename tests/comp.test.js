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

    const comp = new Comp(0,0,0,0,0,0,0,0,12000);
    
    it("includes pension contributions in the personal allowance taper income trigger", () => {
        expect(comp.paTaperThreshold).toBe(100000 + 12000);
    });

    it("extends the BR band by gross amount of pension contributions", () => {
        expect(comp.brbTop).toBe(37500 + 12000);
    });

});

describe("availablePA", () => {

    it("reduces the PA to nil where income high enough", () => {
        const comp = new Comp(140000,0,0,0,0,0,0,0,0);
        expect(comp.availablePA).toBe(0);
    })

    it("calculates full PA where income below threshold", () => {
        const comp = new Comp(80000,0,0,0,0,0,0,0,0);
        expect(comp.availablePA).toBe(12500);
    });

    it("calculates full PA where income above threshold but pension contributions extend the threshold greater than the excess", () => {
        const comp = new Comp(110000,0,0,0,0,0,0,0,12000);
        expect(comp.availablePA).toBe(12500);
    });

    it("restricts the PA and allows for pension contributions", () => {
        const comp = new Comp(120000,0,0,0,0,0,0,0,10000);
        expect(comp.availablePA).toBe(7500);
    });

});

describe("availableSavingsAllowance", () => {

    it("allocates full allowance for BR taxpayer", () => {
        const comp = new Comp(40000,0,0,0,0,0,0,0,2000);
        expect(comp.availableSavingsAllowance).toBe(1000);
    });

    it("allocates full allowance for BR taxpayer - pension on the margin", () => {
        const comp = new Comp(51000,0,0,0,0,0,0,0,2000);
        expect(comp.availableSavingsAllowance).toBe(1000);
    });

    it("allocates reduced allowance for HR taxpayer", () => {
        const comp = new Comp(80000,0,0,0,0,0,0,0,2000);
        expect(comp.availableSavingsAllowance).toBe(500);
    });

    it("allocates zero allowance for AR taxpayer", () => {
        const comp = new Comp(180000,0,0,0,0,0,0,0,2000);
        expect(comp.availableSavingsAllowance).toBe(0);
    });

});

describe("earnedIncomePA", () => {
    it("allocates no PA where no earned income", () => {
        const comp = new Comp(0,0,0,0,0,0,1000,40000,0);
        expect(comp.earnedIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of earned income where that is lower", () => {
        const comp = new Comp(5000,0,0,0,0,0,1000,40000,0);
        expect(comp.earnedIncomePA).toBe(5000);
    });

    it("allocates all available PA to earned income where that is greater", () => {
        const comp = new Comp(14000,0,0,0,0,0,1000,40000,0);
        expect(comp.earnedIncomePA).toBe(12500);
    });

});

describe("savingsIncomePA", () => {
    it("allocates no PA where no savings income", () => {
        const comp = new Comp(0,0,0,0,0,0,0,40000,0);
        expect(comp.savingsIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned income", () => {
        const comp = new Comp(13000,0,0,0,0,0,1000,40000,0);
        expect(comp.savingsIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of savings income where that is lower", () => {
        const comp = new Comp(5000,0,0,0,0,0,1000,40000,0);
        expect(comp.savingsIncomePA).toBe(1000);
    });

    it("allocates all available PA to savings income where that is greater", () => {
        const comp = new Comp(0,0,0,0,0,0,20000,40000,0);
        expect(comp.savingsIncomePA).toBe(12500);
    });

    it("allocates all available PA to savings income where that is greater (with some earned income)", () => {
        const comp = new Comp(8000,0,0,0,0,0,20000,40000,0);
        expect(comp.savingsIncomePA).toBe(4500);
    });

});

describe("dividendIncomePA", () => {
    it("allocates no PA where no dividend income", () => {
        const comp = new Comp(0,0,0,0,0,0,0,0,0);
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned income", () => {
        const comp = new Comp(13000,0,0,0,0,0,0,40000,0);
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to savings income", () => {
        const comp = new Comp(0,0,0,0,0,0,13000,40000,0);
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("allocates no PA where all allocated to earned & savings income combined", () => {
        const comp = new Comp(10000,0,0,0,0,0,2500,40000,0);
        expect(comp.dividendIncomePA).toBe(0);
    });

    it("restricts allocated PA to level of dividend income where that is lower", () => {
        const comp = new Comp(5000,0,0,0,0,0,500,1000,0);
        expect(comp.dividendIncomePA).toBe(1000);
    });

    it("allocates all available PA to dividend income where that is greater", () => {
        const comp = new Comp(0,0,0,0,0,0,0,40000,0);
        expect(comp.dividendIncomePA).toBe(12500);
    });

    it("allocates all available PA to dividend income where that is greater (with some earned & savings income)", () => {
        const comp = new Comp(8000,0,0,0,0,0,2000,40000,0);
        expect(comp.dividendIncomePA).toBe(12500-8000-2000);
    });

});

describe("taxable income - all three types", () => {
    it("calculates taxable earned income of 0 when earned income is 0", () => {
        const comp = new Comp(0,0,0,0,0,0,0,0,0);
        expect(comp.taxableEarnedIncome).toBe(0);
    });

    it("calculates taxable earned income of 0 when earned income below PA", () => {
        const comp = new Comp(6000,0,0,0,0,0,0,0,0);
        expect(comp.taxableEarnedIncome).toBe(0);
    });

    it("calculates taxable earned income when earned income above PA", () => {
        const comp = new Comp(60000,0,0,0,0,0,0,0,0);
        expect(comp.taxableEarnedIncome).toBe(60000-12500);
    });

    it("calculates taxable earned income when PA fully tapered because of total income", () => {
        const comp = new Comp(150000,0,0,0,0,0,0,0,0);
        expect(comp.taxableEarnedIncome).toBe(150000);
    });

    it("calculates taxable savings income of 0 when savings income is 0", () => {
        const comp = new Comp(0,0,0,0,0,0,0,0,0);
        expect(comp.taxableSavingsIncome).toBe(0);
    });

    it("calculates taxable savings income of 0 when savings income below available PA", () => {
        const comp = new Comp(6000,0,0,0,0,0,5000,0,0);
        expect(comp.taxableSavingsIncome).toBe(0);
    });

    it("calculates taxable savings income when savings income above available PA", () => {
        const comp = new Comp(6000,0,0,0,0,0,10000,0,0);
        expect(comp.taxableSavingsIncome).toBe(10000-(12500-6000));
    });

    it("calculates taxable savings income when PA fully tapered because of total income" ,() => {
        const comp = new Comp(0,0,0,0,0,0,150000,0,0);
        expect(comp.taxableSavingsIncome).toBe(150000);
    });

    it("calculates taxable dividend income of 0 when dividend income is 0", () => {
        const comp = new Comp(0,0,0,0,0,0,0,0,0);
        expect(comp.taxableDividendIncome).toBe(0);
    });

    it("calculates taxable dividend income of 0 when dividend income below available PA", () => {
        const comp = new Comp(6000,0,0,0,0,0,0,5000,0);
        expect(comp.taxableDividendIncome).toBe(0);
    });

    it("calculates taxable dividend income when dividend income above available PA", () => {
        const comp = new Comp(6000,0,0,0,0,0,0,10000,0);
        expect(comp.taxableDividendIncome).toBe(10000-(12500-6000));
    });

    it("calculates taxable dividend income when PA fully tapered because of total income", () => {
        const comp = new Comp(0,0,0,0,0,0,0,150000,0);
        expect(comp.taxableDividendIncome).toBe(150000);
    });
});