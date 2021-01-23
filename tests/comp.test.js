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

describe("PA calculation", () => {

    it("reducs the PA to nil where income high enough", () => {
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