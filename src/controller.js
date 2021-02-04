class Controller {
    constructor() {
        document.querySelector("#submit").addEventListener("click", (e) => {
            this.collectData(e);
            this.renderComp();
        });
    }

    collectData(event) {
        event.preventDefault();

        this.taxYearInput = document.querySelector('select[name="taxYear"]');
        this.employmentInput = document.querySelector('input[name="employment"]');
        this.pensionStateInput = document.querySelector('input[name="pensionState"]');
        this.pensionPrivateInput = document.querySelector('input[name="pensionPrivate"]');
        this.selfEmploymentInput = document.querySelector('input[name="selfEmployment"]');
        this.partnershipInput = document.querySelector('input[name="partnership"]');
        this.rentalInput = document.querySelector('input[name="rental"]');
        this.interestInput = document.querySelector('input[name="interest"]');
        this.dividendInput = document.querySelector('input[name="dividends"]');
        this.pensionContribInput = document.querySelector('input[name="pensionContrib"]');
        this.c4Inputs = document.querySelectorAll('input[name="c4"]');

        const taxYear = this.taxYearInput.value;
        const employment = parseInt(this.employmentInput.value || 0);
        const pensionState = parseInt(this.pensionStateInput.value || 0);
        const pensionPrivate = parseInt(this.pensionPrivateInput.value || 0);
        const selfEmployment = parseInt(this.selfEmploymentInput.value || 0);
        const partnership = parseInt(this.partnershipInput.value || 0);
        const rental = parseInt(this.rentalInput.value || 0);
        const interest = parseInt(this.interestInput.value || 0);
        const dividend = parseInt(this.dividendInput.value || 0);
        const pensionContrib = parseInt(this.pensionContribInput.value || 0);
        let c4;
        this.c4Inputs.forEach((input) => {
            if(input.checked) c4 = input.value === "Yes";
        });

        const profile = new Profile(employment, pensionState, pensionPrivate, selfEmployment, partnership, rental, interest, dividend, pensionContrib, c4);
        const comp = new Comp(profile, Rates[taxYear]);
        this.comp = comp;
        this.taxYear = taxYear;
        
    }

    renderComp() {
        // grab computation table elements
        document.querySelector("#comp-taxYear").innerText = this.taxYear;
        document.querySelector("#comp-employment").innerText = this.comp.employment;
        document.querySelector("#comp-pension").innerText = this.comp.pensionState + this.comp.pensionPrivate;
        document.querySelector("#comp-selfEmployment").innerText = this.comp.selfEmployment;
        document.querySelector("#comp-partnership").innerText = this.comp.partnership;
        document.querySelector("#comp-rental").innerText = this.comp.rental;
        document.querySelector("#comp-interest").innerText = this.comp.interest;
        document.querySelector("#comp-dividend").innerText = this.comp.dividend;
        document.querySelector("#comp-totalIncome").innerText = this.comp.totalIncome;
        document.querySelector("#comp-personalAllowance").innerText = this.comp.availablePA;
        document.querySelector("#comp-taxableIncome").innerText = this.comp.totalIncome - this.comp.availablePA;
        //Earned Income
        document.querySelector("#comp-earnedIncomeBRB").innerText = this.comp.earnedIncomeBRB;
        document.querySelector("#comp-earned-br").innerText = `at ${this.comp.br * 100}%`;
        document.querySelector("#comp-earnedIncomeBRTax").innerText = this.comp.earnedIncomeBRTax;

        document.querySelector("#comp-earnedIncomeHRB").innerText = this.comp.earnedIncomeHRB;
        document.querySelector("#comp-earned-hr").innerText = `at ${this.comp.hr * 100}%`;
        document.querySelector("#comp-earnedIncomeHRTax").innerText = this.comp.earnedIncomeHRTax;

        document.querySelector("#comp-earnedIncomeARB").innerText = this.comp.earnedIncomeARB;
        document.querySelector("#comp-earned-ar").innerText = `at ${this.comp.ar * 100}%`;
        document.querySelector("#comp-earnedIncomeARTax").innerText = this.comp.earnedIncomeARTax;
        //Savings Income
        document.querySelector("#comp-savingsIncomeBRB").innerText = this.comp.savingsIncomeBRB;
        document.querySelector("#comp-savings-br").innerText = `at ${this.comp.br * 100}%`;
        document.querySelector("#comp-savingsIncomeBRTax").innerText = this.comp.savingsIncomeBRTax;

        document.querySelector("#comp-savingsIncomeHRB").innerText = this.comp.savingsIncomeHRB;
        document.querySelector("#comp-savings-hr").innerText = `at ${this.comp.hr * 100}%`;
        document.querySelector("#comp-savingsIncomeHRTax").innerText = this.comp.savingsIncomeHRTax;

        document.querySelector("#comp-savingsIncomeARB").innerText = this.comp.savingsIncomeARB;
        document.querySelector("#comp-savings-ar").innerText = `at ${this.comp.ar * 100}%`;
        document.querySelector("#comp-savingsIncomeARTax").innerText = this.comp.savingsIncomeARTax;
        //Dividend Income
        document.querySelector("#comp-dividendIncomeBRB").innerText = this.comp.dividendIncomeBRB;
        document.querySelector("#comp-dividend-br").innerText = `at ${this.comp.brdiv * 100}%`;
        document.querySelector("#comp-dividendIncomeBRTax").innerText = this.comp.dividendIncomeBRTax;

        document.querySelector("#comp-dividendIncomeHRB").innerText = this.comp.dividendIncomeHRB;
        document.querySelector("#comp-dividend-hr").innerText = `at ${this.comp.hrdiv * 100}%`;
        document.querySelector("#comp-dividendIncomeHRTax").innerText = this.comp.dividendIncomeHRTax;

        document.querySelector("#comp-dividendIncomeARB").innerText = this.comp.dividendIncomeARB;
        document.querySelector("#comp-dividend-ar").innerText = `at ${this.comp.ardiv * 100}%`;
        document.querySelector("#comp-dividendIncomeARTax").innerText = this.comp.dividendIncomeARTax;

        document.querySelector("#comp-allTax").innerText = this.comp.allTax;
        document.querySelector("#comp-c4liability").innerText = this.comp.c4liability;
        document.querySelector("#comp-allTaxNI").innerText = this.comp.allTaxNI;
    }




}