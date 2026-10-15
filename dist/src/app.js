import {
  MODEL_VERSION,
  PRIMARY_CUTOFF,
  calculateBmi,
  calculatePackYears,
  calculateScore,
} from "./scoring.js";

const translations = {
  zh: {
    skip: "跳到计算器", brandSubtitle: "气流受限筛查评分", eyebrow: "研究用途 · 浏览器本地计算",
    title: "Clinical5 气流受限筛查评分", intro: "用于既往未诊断慢阻肺、年龄 ≥40 岁成人的初步筛查。总分 ≥3 分时建议接受肺功能检查。",
    privacy: "输入信息不会上传或保存", targetLabel: "目标结局", targetText: "支气管舒张前气流受限（FEV₁/FVC <0.70）",
    notDiagnosisLabel: "重要说明", notDiagnosisText: "筛查结果不是慢阻肺诊断。", eligibilityTitle: "确认适用人群",
    eligibilityHelp: "本工具仅适用于年龄 ≥40 岁且既往未诊断慢阻肺的人群。", priorCopd: "是否曾被医生诊断为慢阻肺？",
    no: "否", yes: "是", itemsTitle: "填写 5 项评分信息", itemsHelp: "请使用当前或最近一次可靠测量值。",
    age: "年龄（岁）", agePlaceholder: "例如：58", ageHelp: "年龄 ≥75 岁均计 7 分。", sex: "生物学性别", female: "女性", male: "男性",
    bmiTitle: "体质指数（BMI）", bmiHelp: "推荐使用实测身高和体重自动计算。", autoCalculate: "自动计算", directInput: "直接输入",
    height: "身高（cm）", heightPlaceholder: "例如：168", weight: "体重（kg）", weightPlaceholder: "例如：65", bmiDirect: "BMI（kg/m²）",
    smokingTitle: "累积吸烟暴露（包年）", smokingHelp: "包年 =（每日支数 ÷ 20）× 吸烟年数；不同时期分别计算后相加。",
    calculate: "计算", addPeriod: "添加另一吸烟时期", packYears: "总包年", asthma: "是否有哮喘病史？",
    calculateResult: "计算筛查结果", reset: "重新填写", resultReady: "结果将在这里显示",
    resultReadyHelp: "完成左侧 5 项信息后，工具将显示总分、各项得分和筛查建议。", outOf21: "/ 21 分", primaryCutoff: "主要筛查阈值",
    riskSummary: "查看开发队列估计概率", riskCaution: "该概率由开发队列的总分映射公式计算，仅作为补充信息；不能替代临床评估，也不能跨人群直接解释。",
    outsideScope: "超出工具适用范围", priorDiagnosisTitle: "既往已诊断慢阻肺者不应使用本筛查评分",
    priorDiagnosisAdvice: "请按临床诊疗与随访方案接受评估；本工具不会给出分数。", evidenceTitle: "如何解释结果",
    evidenceIntro: "阈值的目的，是在减少部分不必要检查的同时，优先保持较高敏感度。", positiveLabel: "筛查阳性",
    positiveExplain: "建议接受肺功能检查。阳性并不等于确诊慢阻肺。", negativeLabel: "筛查阴性",
    negativeExplain: "不能排除气流受限。若有持续呼吸道症状或临床疑虑，仍需进一步评估。", validationLabel: "时间验证敏感度",
    validationExplain: "在 6,510 人的独立时间验证队列中，特异度 33.3%，每 1,000 人预计避免 320.9 次肺功能检查。",
    resourcesEyebrow: "可复核材料", resourcesTitle: "冻结规则与评分卡", resourcesText: "网页计算逻辑与 Clinical5_integer_20260914_v1 完全对应，可下载评分卡或机器可读规则进行核对。",
    downloadCard: "下载评分卡 PDF", downloadSpec: "下载 JSON 规则", footerVersion: "规则版本 Clinical5_integer_20260914_v1",
    footerDisclaimer: "仅供研究与筛查流程辅助，不用于自我诊断、急症判断或替代专业医疗建议。",
    cigarettesPerDay: "每日支数", yearsSmoked: "吸烟年数", period: "时期", bmiPreview: "计算得到 BMI：{value} kg/m²",
    packPreview: "累计吸烟暴露：{value} 包年", missingPrior: "请先确认是否曾被诊断为慢阻肺。", missingFields: "请完整填写年龄、性别、BMI、吸烟暴露和哮喘病史。",
    invalidInput: "输入值不在允许范围内，请检查后重试。", screenPositive: "筛查阳性", screenNegative: "筛查阴性",
    positiveAdvice: "总分 ≥3：建议接受肺功能检查。该结果提示需要进一步检查，并不代表确诊慢阻肺。",
    negativeAdvice: "总分 <3：本工具筛查阴性，但不能排除气流受限。如存在持续呼吸道症状或临床疑虑，仍应进一步评估。",
    componentAge: "年龄", componentSex: "性别", componentBmi: "BMI", componentSmoking: "吸烟暴露", componentAsthma: "哮喘病史", points: "{value} 分",
    devRisk: "开发队列估计概率：{value}", removePeriod: "删除该时期"
  },
  en: {
    skip: "Skip to calculator", brandSubtitle: "Airflow limitation screening score", eyebrow: "Research use · calculated locally",
    title: "Clinical5 airflow limitation screening score", intro: "For preliminary screening in adults aged ≥40 years without a prior COPD diagnosis. Spirometry is recommended for a total score ≥3.",
    privacy: "Your entries are not uploaded or stored", targetLabel: "Target outcome", targetText: "Pre-bronchodilator airflow limitation (FEV₁/FVC <0.70)",
    notDiagnosisLabel: "Important", notDiagnosisText: "A screening result is not a COPD diagnosis.", eligibilityTitle: "Confirm eligibility",
    eligibilityHelp: "This tool is intended only for adults aged ≥40 years without a prior COPD diagnosis.", priorCopd: "Have you previously been diagnosed with COPD by a clinician?",
    no: "No", yes: "Yes", itemsTitle: "Enter the five score items", itemsHelp: "Use current or most recent reliable measurements.",
    age: "Age (years)", agePlaceholder: "e.g. 58", ageHelp: "Age is capped at 7 points from 75 years onward.", sex: "Biological sex", female: "Female", male: "Male",
    bmiTitle: "Body mass index (BMI)", bmiHelp: "Measured height and weight are recommended.", autoCalculate: "Calculate", directInput: "Enter directly",
    height: "Height (cm)", heightPlaceholder: "e.g. 168", weight: "Weight (kg)", weightPlaceholder: "e.g. 65", bmiDirect: "BMI (kg/m²)",
    smokingTitle: "Cumulative smoking exposure (pack-years)", smokingHelp: "Pack-years = (cigarettes per day ÷ 20) × years smoked; add separate periods together.",
    calculate: "Calculate", addPeriod: "Add another smoking period", packYears: "Total pack-years", asthma: "History of asthma?",
    calculateResult: "Calculate screening result", reset: "Reset", resultReady: "Your result will appear here",
    resultReadyHelp: "Complete the five items to see the total score, item breakdown, and screening recommendation.", outOf21: "/ 21 points", primaryCutoff: "Primary screening cutoff",
    riskSummary: "View development-derived estimated probability", riskCaution: "This probability is calculated from the development-cohort score mapping and is supplementary only. It does not replace clinical assessment and should not be transported uncritically to other populations.",
    outsideScope: "Outside the intended population", priorDiagnosisTitle: "Do not use this screening score after a COPD diagnosis",
    priorDiagnosisAdvice: "Please follow the appropriate clinical care and follow-up pathway. No score is reported.", evidenceTitle: "How to interpret the result",
    evidenceIntro: "The cutoff prioritizes high sensitivity while reducing some unnecessary tests.", positiveLabel: "Screen positive",
    positiveExplain: "Spirometry is recommended. A positive result is not a COPD diagnosis.", negativeLabel: "Screen negative",
    negativeExplain: "Airflow limitation is not ruled out. Persistent respiratory symptoms or clinical concern still warrant further assessment.", validationLabel: "Temporal-validation sensitivity",
    validationExplain: "In the independent temporal validation cohort of 6,510 participants, specificity was 33.3% and an estimated 320.9 spirometry examinations were avoided per 1,000 screened.",
    resourcesEyebrow: "Auditable materials", resourcesTitle: "Frozen rule and scorecard", resourcesText: "The calculator implements Clinical5_integer_20260914_v1. Download the scorecard or machine-readable rule for verification.",
    downloadCard: "Download scorecard PDF", downloadSpec: "Download JSON rule", footerVersion: "Rule version Clinical5_integer_20260914_v1",
    footerDisclaimer: "For research and screening-workflow support only. Not for self-diagnosis, emergencies, or replacement of professional medical advice.",
    cigarettesPerDay: "Cigarettes/day", yearsSmoked: "Years smoked", period: "Period", bmiPreview: "Calculated BMI: {value} kg/m²",
    packPreview: "Cumulative exposure: {value} pack-years", missingPrior: "First confirm whether COPD has previously been diagnosed.", missingFields: "Complete age, sex, BMI, smoking exposure, and asthma history.",
    invalidInput: "One or more values are outside the accepted range. Please check and try again.", screenPositive: "Screen positive", screenNegative: "Screen negative",
    positiveAdvice: "Score ≥3: spirometry is recommended. This indicates a need for further testing, not a COPD diagnosis.",
    negativeAdvice: "Score <3: screen negative, but airflow limitation is not ruled out. Persistent respiratory symptoms or clinical concern still warrant further assessment.",
    componentAge: "Age", componentSex: "Sex", componentBmi: "BMI", componentSmoking: "Smoking exposure", componentAsthma: "Asthma history", points: "{value} points",
    devRisk: "Development-derived estimated probability: {value}", removePeriod: "Remove this period"
  }
};

let language = (() => {
  try { return localStorage.getItem("clinical5-language") === "en" ? "en" : "zh"; }
  catch { return "zh"; }
})();
let lastResult = null;
let lastView = "empty";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const t = (key, values = {}) => Object.entries(values).reduce(
  (text, [name, value]) => text.replace(`{${name}}`, value),
  translations[language][key] ?? key
);

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = t("title");
  $$('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  $$('[data-lang]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
  try { localStorage.setItem("clinical5-language", language); } catch {}
  refreshPeriodLabels();
  updateBmiPreview();
  updatePackPreview();
  if (lastView === "result" && lastResult) renderResult(lastResult);
  if (lastView === "ineligible") showIneligible();
}

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
}

function addSmokingPeriod(cigarettes = "", years = "") {
  const fragment = $("#period-template").content.cloneNode(true);
  const row = fragment.querySelector(".period-row");
  row.querySelector(".cigarettes").value = cigarettes;
  row.querySelector(".years").value = years;
  row.querySelectorAll("input").forEach(input => input.addEventListener("input", updatePackPreview));
  row.querySelector(".remove-period").addEventListener("click", () => {
    if ($$(".period-row").length > 1) row.remove();
    else row.querySelectorAll("input").forEach(input => { input.value = ""; });
    refreshPeriodLabels();
    updatePackPreview();
  });
  $("#smoking-periods").append(fragment);
  refreshPeriodLabels();
}

function refreshPeriodLabels() {
  $$(".period-row").forEach((row, index) => {
    row.querySelector(".period-index").textContent = String(index + 1);
    row.querySelector(".cig-label").textContent = t("cigarettesPerDay");
    row.querySelector(".years-label").textContent = t("yearsSmoked");
    row.querySelector(".remove-period").setAttribute("aria-label", t("removePeriod"));
  });
}

function updateBmiMode() {
  const direct = selectedValue("bmiMode") === "direct";
  $("#bmi-auto").classList.toggle("hidden", direct);
  $("#bmi-direct-wrap").classList.toggle("hidden", !direct);
  updateBmiPreview();
}

function readBmi() {
  if (selectedValue("bmiMode") === "direct") {
    if ($("#bmi-direct").value === "") throw new Error("missing");
    return Number($("#bmi-direct").value);
  }
  if ($("#height").value === "" || $("#weight").value === "") throw new Error("missing");
  return calculateBmi($("#height").value, $("#weight").value);
}

function updateBmiPreview() {
  try { $("#bmi-preview").textContent = t("bmiPreview", { value: readBmi().toFixed(1) }); }
  catch { $("#bmi-preview").textContent = ""; }
}

function updateSmokingMode() {
  const direct = selectedValue("smokingMode") === "direct";
  $("#periods-wrap").classList.toggle("hidden", direct);
  $("#pack-direct-wrap").classList.toggle("hidden", !direct);
  updatePackPreview();
}

function readPackYears() {
  if (selectedValue("smokingMode") === "direct") {
    if ($("#pack-direct").value === "") throw new Error("missing");
    return Number($("#pack-direct").value);
  }
  const periods = $$(".period-row").map(row => ({
    cigarettesPerDay: row.querySelector(".cigarettes").value,
    years: row.querySelector(".years").value,
  }));
  if (periods.some(period => period.cigarettesPerDay === "" || period.years === "")) throw new Error("missing");
  return calculatePackYears(periods);
}

function updatePackPreview() {
  try { $("#pack-preview").textContent = t("packPreview", { value: readPackYears().toFixed(1) }); }
  catch { $("#pack-preview").textContent = ""; }
}

function setResultView(view) {
  lastView = view;
  $("#result-empty").hidden = view !== "empty";
  $("#result-content").hidden = view !== "result";
  $("#result-ineligible").hidden = view !== "ineligible";
}

function showIneligible() {
  lastResult = null;
  setResultView("ineligible");
  $("#result-card").className = "result-card";
}

function renderResult(result) {
  lastResult = result;
  setResultView("result");
  const positive = result.screenPositive;
  $("#result-card").className = `result-card ${positive ? "positive" : "negative"}`;
  $("#result-kicker").textContent = positive ? t("screenPositive") : t("screenNegative");
  $("#score-value").textContent = String(result.total);
  $("#result-title").textContent = positive ? t("screenPositive") : t("screenNegative");
  $("#result-advice").textContent = positive ? t("positiveAdvice") : t("negativeAdvice");
  const labels = ["componentAge", "componentSex", "componentBmi", "componentSmoking", "componentAsthma"];
  const values = [result.components.age, result.components.sex, result.components.bmi, result.components.packYears, result.components.asthma];
  $("#breakdown").innerHTML = labels.map((label, index) =>
    `<div class="breakdown-row"><span>${t(label)}</span><strong>${t("points", { value: values[index] })}</strong></div>`
  ).join("");
  const formattedRisk = new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(result.predictedRisk);
  $("#risk-value").textContent = t("devRisk", { value: formattedRisk });
}

function showError(message) {
  const box = $("#form-error");
  box.textContent = message;
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("#score-form").addEventListener("submit", event => {
  event.preventDefault();
  $("#form-error").hidden = true;
  const priorCopd = selectedValue("priorCopd");
  if (!priorCopd) return showError(t("missingPrior"));
  if (priorCopd === "yes") return showIneligible();
  try {
    const sex = selectedValue("sex");
    const asthma = selectedValue("asthma");
    if ($("#age").value === "" || !sex || !asthma) throw new Error("missing");
    const result = calculateScore({
      age: $("#age").value,
      sex,
      bmi: readBmi(),
      packYears: readPackYears(),
      asthma,
    });
    renderResult(result);
    if (window.matchMedia("(max-width: 900px)").matches) $("#result-card").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showError(error.message === "missing" ? t("missingFields") : t("invalidInput"));
  }
});

$("#score-form").addEventListener("reset", () => {
  setTimeout(() => {
    $("#smoking-periods").innerHTML = "";
    addSmokingPeriod();
    $("#form-error").hidden = true;
    lastResult = null;
    setResultView("empty");
    $("#result-card").className = "result-card";
    updateBmiMode();
    updateSmokingMode();
  });
});

$$('[data-lang]').forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
$$('input[name="bmiMode"]').forEach(input => input.addEventListener("change", updateBmiMode));
$$('input[name="smokingMode"]').forEach(input => input.addEventListener("change", updateSmokingMode));
[$("#height"), $("#weight"), $("#bmi-direct")].forEach(input => input.addEventListener("input", updateBmiPreview));
$("#pack-direct").addEventListener("input", updatePackPreview);
$("#add-period").addEventListener("click", () => addSmokingPeriod());

addSmokingPeriod();
setLanguage(language);
console.info(`Clinical5 ${MODEL_VERSION}; primary cutoff ≥${PRIMARY_CUTOFF}`);
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js");
