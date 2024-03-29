import { ConstantCost, ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "the_equation";
var name = "The Equation";
var description = "A basic equation\nThat's it.";
var authors = "Marble178";
var version = 1;

var currency;
var c1, c2, q1, q2;
var c21, c22, c23, n;
var page;
var q = BigNumber.ONE;
var beta = BigNumber.ONE;
var c1Exp, c2Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    currency2 = theory.createCurrency();

    let baseId = 0

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }
    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}"
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(2, currency, new ExponentialCost(5, Math.log2(3)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }
    // q2
    {
        let getDesc = (level) => "q_2=2^{" + level + "}"
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(3, currency, new ExponentialCost(5, Math.log2(10)));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
    }
    // page number
    {
        let getDesc = (level) => "\\text{Page }" + getPage(level).toString(0);
        page = theory.createUpgrade(4, currency, new ConstantCost(0));
        page.getDescription = (_) => Utils.getMath(getDesc(page.level));
        page.getInfo = (amount) => Utils.getMathTo(getDesc(page.level), getDesc(page.level + amount));
    }

    baseId += 100;
    // Cost for c22
    let c22Cost = new CustomCost((level) =>
        {
            var cost = 1;
            cost = BigNumber.from(cost) * BigNumber.from(3.74447096981) ** level;
            return BigNumber.from(cost);
        });
    // Cost for c23
    let c23Cost = new CustomCost((level) =>
        {
            var cost = 1;
            cost = BigNumber.from(cost) * BigNumber.from(1e30) ** level;
            return BigNumber.from(cost);
        });

    // c1
    {
        let getDesc = (level) => "c_1=" + getC21(level).toString(0);
        c21 = theory.createUpgrade(baseId, currency2, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        c21.getDescription = (_) => Utils.getMath(getDesc(c21.level));
        c21.getInfo = (amount) => Utils.getMathTo(getDesc(c21.level), getDesc(c21.level + amount));
    }
    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC22(level).toString(0);
        c22 = theory.createUpgrade(baseId+1, currency2, c22Cost);
        c22.getDescription = (_) => Utils.getMath(getDesc(c22.level));
        c22.getInfo = (amount) => Utils.getMathTo(getInfo(c22.level), getInfo(c22.level + amount));
    }
    // c3
    {
        let getDesc = (level) => "c_3=" + getC23(level).toString(0);
        c23 = theory.createUpgrade(baseId+2, currency2, c23Cost)
        c23.getDescription = (_) => Utils.getMath(getDesc(c23.level));
        c23.getInfo = (amount) => Utils.getMathTo(getDesc(c23.level), getDesc(c23.level + amount));
    }
    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0);
        n = theory.createUpgrade(baseId+3, currency2, new ExponentialCost(10, Math.log2(2)));
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(1, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05");
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05");
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        q1Exp = theory.createMilestoneUpgrade(2, 3);
        q1Exp.description = Localization.getUpgradeIncCustomExpDesc("q_1", "0.1");
        q1Exp.info = Localization.getUpgradeIncCustomExpInfo("q_1", "0.1");
        q1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        q2Exp = theory.createMilestoneUpgrade(3, 3);
        q2Exp.description = Localization.getUpgradeIncCustomExpDesc("q_2", "0.1");
        q2Exp.info = Localization.getUpgradeIncCustomExpInfo("q_2", "0.1");
        q2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    aMoney = theory.createAchievementCategory(0, "Money");
    aPub = theory.createAchievementCategory(1, "Publications")
    aSecret = theory.createAchievementCategory(2, "Secrets")

    achievement1 = theory.createAchievement(0, aMoney, "Thousands", "You reached 1000p, nice", () => currency.value > 1000);
    achievement2 = theory.createAchievement(1, aMoney, "Millions", "You reached 1e6p, what", () => currency.value > 1000000);
    achievement3 = theory.createAchievement(2, aMoney, "Billions", "You reached 1e4 p" + ", nice", () => currency.value > 1e9);
    achievement3 = theory.createAchievement(3, aPub, "Starting Your Career", "You just unlocked publicztions, now get that one publications boy", () => theory.isPublicationAvailable)
    achievement4 = theory.createSecretAchievement(4, aSecret, "WHAT", "Haha funny number 69", "Do the funny number", () => c1.level == 69);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "The Start", "You started in this theory\nI don't know why\nBut you just started this theory\nThis is the only chapter\nGood luck", () => c1.level > 0);

    page.maxLevel = 1;
    n.maxLevel = 40;
    c23.maxLevel = 30;

    updateAvailability();
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level > 0;
    q2Exp.isAvailable = q1Exp.level > 0;

    c1.isAvailable = page.level == 0;
    c2.isAvailable = page.level == 0;
    q1.isAvailable = page.level == 0;
    q2.isAvailable = page.level == 0;

    c21.isAvailable = page.level == 1;
    c22.isAvailable = page.level == 1;
    c23.isAvailable = page.level == 1;
    n.isAvailable = page.level == 1;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    if (getC1(c1.level) < 1) {
        q = getQ1(q1.level).pow(getQ1Exponent(q1Exp.level));
        currency.value += dt * bonus * getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) * q;
    }
    else if (page.level == 0) {
    q += (getQ1(q1.level).pow(getQ1Exponent(q1Exp.level)) * getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))) / BigNumber.TWO
    beta = getC1(c1.level).pow(getC1Exponent(c1Exp.level)) / getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))
    currency.value += dt * bonus * getC1(c1.level).pow(BigNumber.TWO ** getC1Exponent(c1Exp.level)) * q /
                                   getC2(c2.level).pow(getC2Exponent(c2Exp.level)) + getC2(c2.level).pow(getC2Exponent(c2Exp.level)) * (q / BigNumber.TWO) + currency2.value * (getC2(c2.level).pow(getC2Exponent(c2Exp.level)) / getC1(c1.level).pow(getC1Exponent(c1Exp.level))) * q.pow(1.5);
    }
    else if (page.level == 1) {
    for(let i = 0; i < getN(n.level); i++) {
    currency2.value += dt * bonus * (((((BigNumber.TWO * getC21(c21.level))) * ((getC22(c22.level) / BigNumber.TWO))))/BigNumber.HUNDRED).pow(BigNumber.ONE + getC23(c23.level)/BigNumber.THOUSAND); 
    }
    }
    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
    updateAvailability();
}

var getPrimaryEquation = () => {
    let result = "";

    if (page.level == 0) {
    result = "\\dot{\\rho_1} = \\frac{c_1";

    if (c1Exp.level == 1) result += "^{1.05";
    if (c1Exp.level == 2) result += "^{1.1";
    if (c1Exp.level == 3) result += "^{1.15";

    result += "^{2}";

    if (c1Exp.level >= 1) result += "}";

    result += "q";

    result += "}{c_2}";

    if (c2Exp.level == 1) result += "^{1.05}";
    if (c2Exp.level == 2) result += "^{1.1}";
    if (c2Exp.level == 3) result += "^{1.15}";

    result += "+\\beta c_2";

    if (c2Exp.level == 1) result += "^{1.05}";
    if (c2Exp.level == 2) result += "^{1.1}";
    if (c2Exp.level == 3) result += "^{1.15}";

    result += "\\frac{q}{2}+\\frac{\\rho_2}{1000}\\frac{c_2";
    
    if (c2Exp.level == 1) result += "^{1.05}";
    if (c2Exp.level == 2) result += "^{1.1}";
    if (c2Exp.level == 3) result += "^{1.15}";

    result += "}{c_1";

    if (c1Exp.level == 1) result += "^{1.05}";
    if (c1Exp.level == 2) result += "^{1.1}";
    if (c1Exp.level == 3) result += "^{1.15}";

    result += "}q^{1.5}\\quad \\dot{q}=\\frac{q_1"
    

    if (q1Exp.level == 1) result += "^{1.1}";
    if (q1Exp.level == 2) result += "^{1.2}";
    if (q1Exp.level == 3) result += "^{1.3}";

    result += "q_2"

    if (q2Exp.level == 1) result += "^{1.1}";
    if (q2Exp.level == 2) result += "^{1.2}";
    if (q2Exp.level == 3) result += "^{1.3}";

    result += "}{2}"

    result += "\\quad \\beta = \\frac{c_1";

    if (c1Exp.level == 1) result += "^{1.05}";
    if (c1Exp.level == 2) result += "^{1.1}";
    if (c1Exp.level == 3) result += "^{1.15}";

    result += "}{q_2";

    if (q2Exp.level == 1) result += "^{1.1}";
    if (q2Exp.level == 2) result += "^{1.2}";
    if (q2Exp.level == 3) result += "^{1.3}";

    result += "}"
    }
    else if (page.level == 1) {
    result += "\\dot{\\rho_2}=\\sum_{a=1}^{n} (\\frac{2c_1\\frac{c_2}{2}}{100})^{1+\\frac{c_3}{100}}"
    }

    if (page.level == 0) theory.primaryEquationScale = 0.9;
    if (page.level == 1) theory.primaryEquationScale = 1.2;
    theory.primaryEquationHeight = 100;
    
    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho_1";

var getTertiaryEquation = () => {
    let result = "";

    if (page.level == 0) {
    result = "q = ";

    result += q.toString(3);

    result += "\\quad ";

    result += "\\frac{c_1}{c_2} = ";

    result += (getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) / getC2(c2.level).pow(getC2Exponent(c2Exp.level))).toString(3);

    result += "\\quad";

    result += "\\beta = ";

    result += (getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) / getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))).toString(3);
    }

    return result;
}
var getInternalState = () => `${q}`;
var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) q = parseBigNumber(values[0]);
}
var alwaysShowRefundButtons = () => true;
var getPublicationMultiplier = (tau) => BigNumber.ONE;
var getPublicationMultiplierFormula = (symbol) => "1";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getQ1 = (level) => Utils.getStepwisePowerSum(level+1, 2, 4, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getPage = (level) => BigNumber.from(level+1);
var getC21 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC22 = (level) => BigNumber.TWO.pow(level);
var getC23 = (level) => BigNumber.TWO * BigNumber.from(level);
var getN = (level) => BigNumber.from(level+1);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getQ1Exponent = (level) => BigNumber.from(1 + 0.1 * level);
var getQ2Exponent = (level) => BigNumber.from(1 + 0.1 * level);

init();
