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