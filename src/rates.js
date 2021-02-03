const Rates = {

    2021: {
        fullPA: 12500, // the standard Personal Allowance before income-related taper
        paTaperStartPoint: 100000, // the standard PA taper point before allowing for pension contributions
        brbTopStartPoint: 37500, // the top of the BRB before allowing for pension contributions
        hrbTop: 150000, // the top of the HR tax band - the point above which AR kicks in
        dividendAllowance: 2000, // dividend nil rate band
        brSavingsAllowance: 1000, // savings nil rate band for BR taxpayers
        hrSavingsAllowance: 500, // savings nil rate band for HR taxpayers
        br: 0.2, // basic rate of tax
        hr: 0.4, // higher rate of tax
        ar: 0.45, // additional rate of tax
        brdiv: 0.075, // basic rate of tax on dividends
        hrdiv: 0.325, // higher rate of tax on dividends
        ardiv: 0.381, // additional rate of tax on dividends
        c4lpl: 9500, // Class 4 NICs Lower Profit Limit
        c4upl: 50000, // Class 4 NICs Upper Profit Limit
        c4sr: 0.09, // Class 4 NIC standard rate on profit between lower and upper limits
        c4ur: 0.02 // Class 4 NIC rate on profit above upper limit
    },
    
    2020: {
        fullPA: 12500, // the standard Personal Allowance before income-related taper
        paTaperStartPoint: 100000, // the standard PA taper point before allowing for pension contributions
        brbTopStartPoint: 37500, // the top of the BRB before allowing for pension contributions
        hrbTop: 150000, // the top of the HR tax band - the point above which AR kicks in
        dividendAllowance: 2000, // dividend nil rate band
        brSavingsAllowance: 1000, // savings nil rate band for BR taxpayers
        hrSavingsAllowance: 500, // savings nil rate band for HR taxpayers
        br: 0.2, // basic rate of tax
        hr: 0.4, // higher rate of tax
        ar: 0.45, // additional rate of tax
        brdiv: 0.075, // basic rate of tax on dividends
        hrdiv: 0.325, // higher rate of tax on dividends
        ardiv: 0.381, // additional rate of tax on dividends
        c4lpl: 8632, // Class 4 NICs Lower Profit Limit
        c4upl: 50000, // Class 4 NICs Upper Profit Limit
        c4sr: 0.09, // Class 4 NIC standard rate on profit between lower and upper limits
        c4ur: 0.02 // Class 4 NIC rate on profit above upper limit
    },

    2019: {
        fullPA: 11850, // the standard Personal Allowance before income-related taper
        paTaperStartPoint: 100000, // the standard PA taper point before allowing for pension contributions
        brbTopStartPoint: 34500, // the top of the BRB before allowing for pension contributions
        hrbTop: 150000, // the top of the HR tax band - the point above which AR kicks in
        dividendAllowance: 2000, // dividend nil rate band
        brSavingsAllowance: 1000, // savings nil rate band for BR taxpayers
        hrSavingsAllowance: 500, // savings nil rate band for HR taxpayers
        br: 0.2, // basic rate of tax
        hr: 0.4, // higher rate of tax
        ar: 0.45, // additional rate of tax
        brdiv: 0.075, // basic rate of tax on dividends
        hrdiv: 0.325, // higher rate of tax on dividends
        ardiv: 0.381, // additional rate of tax on dividends
        c4lpl: 8424, // Class 4 NICs Lower Profit Limit
        c4upl: 46350, // Class 4 NICs Upper Profit Limit
        c4sr: 0.09, // Class 4 NIC standard rate on profit between lower and upper limits
        c4ur: 0.02 // Class 4 NIC rate on profit above upper limit
    }

}