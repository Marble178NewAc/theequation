import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "test_test";
var name = "The Equation";
var description = "A basic equation\nThat's it.";
var authors = "Marble178";
var version = 1;

var currency;
var c1, c2, q1, q2;
var q = BigNumber.ONE;
var beta = BigNumber.ONE;
var c1Exp, c2Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();

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

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
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

    updateAvailability();
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level > 0;
    q2Exp.isAvailable = q1Exp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    if (getC1(c1.level) < 1) {
        q = getQ1(q1.level).pow(getQ1Exponent(q1Exp.level));
        currency.value += dt * bonus * getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) * q;
    }
    else {
    q += (getQ1(q1.level).pow(getQ1Exponent(q1Exp.level)) * getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))) / BigNumber.TWO
    beta = getC1(c1.level).pow(getC1Exponent(c1Exp.level)) / getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))
    currency.value += dt * bonus * getC1(c1.level).pow(BigNumber.TWO ** getC1Exponent(c1Exp.level)) * q /
                                   getC2(c2.level).pow(getC2Exponent(c2Exp.level)) + getC2(c2.level).pow(getC2Exponent(c2Exp.level)) * (q / BigNumber.TWO) + (getC2(c2.level).pow(getC2Exponent(c2Exp.level)) / getC1(c1.level).pow(getC1Exponent(c1Exp.level))) * q.square();
    }
    theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = \\frac{c_1";

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

    result += "\\frac{q}{2}+\\frac{c_2";
    
    if (c2Exp.level == 1) result += "^{1.05}";
    if (c2Exp.level == 2) result += "^{1.1}";
    if (c2Exp.level == 3) result += "^{1.15}";

    result += "}{c_1";

    if (c1Exp.level == 1) result += "^{1.05}";
    if (c1Exp.level == 2) result += "^{1.1}";
    if (c1Exp.level == 3) result += "^{1.15}";

    result += "}q^{2}\\quad \\dot{q}=\\frac{q_1"
    

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

    theory.primaryEquationHeight = 100;
    theory.primaryEquationScale = 0.9;

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";

var getTertiaryEquation = () => {
    let result = "q = ";

    result += q.toString(3);

    result += "\\quad ";

    result += "\\frac{c_1}{c_2} = ";

    result += (getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) / getC2(c2.level).pow(getC2Exponent(c2Exp.level))).toString(3);

    result += "\\quad";

    result += "\\beta = ";

    result += (getC1(c1.level).pow(getC1Exponent(c1Exp.level).square()) / getQ2(q2.level).pow(getQ2Exponent(q2Exp.level))).toString(3);

    return result;
}
var getInternalState = () => `${q}`;
var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) q = parseBigNumber(values[0]);
}
var getPublicationMultiplier = (tau) => tau.pow(1.1) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{1.1}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getQ1 = (level) => Utils.getStepwisePowerSum(level+1, 2, 4, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getQ1Exponent = (level) => BigNumber.from(1 + 0.1 * level);
var getQ2Exponent = (level) => BigNumber.from(1 + 0.1 * level);

init();
