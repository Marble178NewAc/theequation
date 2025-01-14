import { ConstantCost, ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { Popup } from "./api/ui/Popup";
import { ui } from "./api/ui/UI"
import { ImageSource } from "./api/ui/properties/ImageSource";

var id = "the_equation";
var name = "The Equation";
var description = "A basic equation\nThat's it.";
var authors = "Marble178";
var version = 1;

var currency;
var c1, c2, q1, q2;
var c21, c22, c23, n;
var c31, c32;
var unlocked1;
var page;
var q = BigNumber.ONE;
var beta = BigNumber.ONE;

var init = () => {
    currency = theory.createCurrency();
    currency2 = theory.createCurrency();
    currency3 = theory.createCurrency();

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
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(12, Math.log2(7.4)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(2, currency, new ExponentialCost(8, Math.log2(3.4)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }
    // q2
    {
        let getDesc = (level) => "q_2=2^{" + level + "}"
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(3, currency, new ExponentialCost(14, Math.log2(8)));
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

    // Page 2
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

    // c21
    {
        let getDesc = (level) => "c_1=" + getC21(level).toString(0);
        c21 = theory.createUpgrade(baseId, currency2, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        c21.getDescription = (_) => Utils.getMath(getDesc(c21.level));
        c21.getInfo = (amount) => Utils.getMathTo(getDesc(c21.level), getDesc(c21.level + amount));
    }
    // c22
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC22(level).toString(0);
        c22 = theory.createUpgrade(baseId+1, currency2, c22Cost);
        c22.getDescription = (_) => Utils.getMath(getDesc(c22.level));
        c22.getInfo = (amount) => Utils.getMathTo(getInfo(c22.level), getInfo(c22.level + amount));
    }
    // c23
    {
        let getDesc = (level) => "c_3=" + getC23(level).toString(0);
        c23 = theory.createUpgrade(baseId+2, currency2, c23Cost);
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

    // Page 3
    /*
    baseId += 100;
    // c31
    {
        let getDesc = (level) => "c_1=" + getC31(level).toString(0);
        c31 = theory.createUpgrade(baseId, currency, new FreeCost());
        c31.getDescription = (_) => Utils.getMath(getDesc(c31.level));
        c31.getInfo = (amount) => Utils.getMathTo(getDesc(c31.level), getDesc(c31.level + amount));
    }
    // c32
    {
        let getDesc = (level) => "c_2=1.67^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC32(level).toString(0);
        c32 = theory.createUpgrade(baseId+1, currency, new FreeCost());
        c32.getDescription = (_) => Utils.getMath(getDesc(c32.level));
        c32.getInfo = (amount) => Utils.getMathTo(getInfo(c32.level), getInfo(c32.level + amount));
    }
    */

    ///////////////////////////
    // Unlocking equation lolol
    unlock1 = theory.createSingularUpgrade(0, currency, new ConstantCost(BigNumber.from(1e7)))
    unlock1.getDescription = (_) => "Unlock second equation";
    unlock1.getInfo = (_) => "Yes";
    unlock1.boughtOrRefunded = (_) => { unlocked1 = 1; }

    ////////////////////
    // The real upgrades
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);
    
    /////////////////
    //// Achievements
    aMoney = theory.createAchievementCategory(0, "Money");
    aSecond = theory.createAchievementCategory(1, "Second Money");
    aSecret = theory.createAchievementCategory(2, "Super Secrets");

    achievementM1 = theory.createAchievement(0, aMoney, "Thousands", "You reached 1000p, nice", () => currency.value > 1e3);
    achievementM2 = theory.createAchievement(1, aMoney, "Millions", "You reached 1e6p, what", () => currency.value > 1e6);
    achievementM3 = theory.createAchievement(2, aMoney, "Billions", "You reached 1e9p, how are you still playing this?", () => currency.value > 1e9);
    achievementM4 = theory.createAchievement(3, aMoney, "Trillions", "You reached 1e12p, is my equation inflated?", () => currency.value > 1e12);
    achievementM5 = theory.createAchievement(4, aMoney, "Quadrillions", "You reached 1e15p, i think i have my answer", () => currency.value > 1e15);
    achievementM6 = theory.createAchievement(5, aMoney, "The 30", "You reached 1e30p, good enough for the autobuyer", () => currency.value > 1e30);
    achievementS1 = theory.createAchievement(6, aSecond, "Pain", "You reached 100 on the second currency, is the second equation slow?", () => currency2.value > 100);
    achievementSS1 = theory.createSecretAchievement(7, aSecret, "WHAT", "Haha dead meme 69", "Do the funny number", () => c1.level == 69);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "The Start", "You started in this theory\nThis is my attempt at making a CT\nMy code looked like a 5 star meal with this spaghetti coding stuff\nSo for you who played this CT\nGood luck", () => c1.level > 0);
    chapter2 = theory.createStoryChapter(1, "The Time You See The Second Equation", "You're probably curious and check the second page\nthat's when you see the second equation\nThis second equation is slow but helps the first equation to grow faster", () => page.level == 1);
    // chapter3 = theory.createStoryChapter(2, "WIP", "If you see this code, this chapter is reserved for equation 3", () => page.level == 2);

    page.maxLevel = 2;
    n.maxLevel = 40;
    c23.maxLevel = 100;
    unlock1.maxLevel = 1;

    updateAvailability();
}

var updateAvailability = () => {
    c1.isAvailable = page.level == 0;
    c2.isAvailable = page.level == 0;
    q1.isAvailable = page.level == 0;
    q2.isAvailable = page.level == 0;

    c21.isAvailable = page.level == 1;
    c22.isAvailable = page.level == 1;
    c23.isAvailable = page.level == 1;
    n.isAvailable = page.level == 1;

    /*
    c31.isAvailable = page.level == 2;
    c32.isAvailable = page.level == 2 && c31.level > 0;
    */

    page.isAvailable = false;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    if (getC1(c1.level) < 1) {
        q = getQ1(q1.level);
        currency.value += dt * bonus * getC1(c1.level).square() * q;
    }
    q += BigNumber.from((getQ1(q1.level) * getQ2(q2.level)) / BigNumber.TWO);
    beta = BigNumber.from(getC2(c2.level) / getQ2(q2.level));
    currency.value += dt * BigNumber.from(((getC1(c1.level).square()) / (BigNumber.TWO * getC2(c2.level))) + ((beta / BigNumber.THREE * getC2(c2.level) * q) / BigNumber.SIX) + ((currency2.value / BigNumber.from(2000)) * (getC2(c2.level) / getC1(c1.level)) * q.pow(1.3)));
    for (let i = 0; i < getN(n.level); i++) {
        currency2.value += dt * bonus * (((getC21(c21.level)) * getC22(c22.level)) / BigNumber.from(63)).pow(BigNumber.ONE + (getC23(c23.level) / BigNumber.from(300))); 
    }
    /*
    if (c31.level < 1) {
        currency3.value += dt * getC31(c31.level);
    }
    else if (c31.level >= 1) {
        currency3.value += dt * (getC31(c31.level) * getC32(c32.level));
    }
    */
    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
    updateAvailability();
}

var getPrimaryEquation = () => {
    let result = "";

    if (page.level == 0) {
        result = "\\dot{\\rho_1}=\\frac{c_1^{2}}{2c_2}+\\frac{\\beta c_2q}{6}+\\frac{\\rho_2}{1000}\\frac{c_2}{c_1}q^{1.3}\\quad \\dot{q}=\\frac{q_1q_2}{2}\\quad \\beta =\\frac{c_2}{q_2}";
    }
    else if (page.level == 1) {
        result += "\\dot{\\rho_2}=\\sum_{a=1}^{n} (\\frac{c_1c_2}{63})^{1+\\frac{c_3}{300}}"
    }
    /*
    else if (page.level == 2) {
        result += "\\dot{\\rho_3}=c_1 + c_2";
    }
    */

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
        result += "\\quad \\frac{c_1^{2}}{c_2} = ";
        result += ((getC1(c1.level).square()) / getC2(c2.level)).toString(3);
        result += "\\quad \\beta = ";
        result += (getC2(c2.level) / getQ2(q2.level)).toString(3);
    }

    return result;
}

var getInternalState = () => `${q}`;
var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) q = parseBigNumber(values[0]);
}

var popup = ui.createPopup({
    title: "BOO"
})

var alwaysShowRefundButtons = () => true;
var getPublicationMultiplier = (tau) => BigNumber.ONE;
var getPublicationMultiplierFormula = (symbol) => "1";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 4, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getC21 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC22 = (level) => BigNumber.TWO.pow(level);
var getC23 = (level) => BigNumber.TWO * BigNumber.from(level);
var getN = (level) => BigNumber.from(level+1);
/*
var getC31 = (level) => BigNumber.from(level);
var getC32 = (level) => BigNumber.from("1.67").pow(level);
*/
var getPage = (level) => BigNumber.from(level+1);

var canGoToPreviousStage = () => true && page.level > 0;
var goToNextStage = () => page.level += 1;
var canGoToNextStage = () => true && page.level < unlocked1;
var goToPreviousStage = () => page.level -= 1;

init();
