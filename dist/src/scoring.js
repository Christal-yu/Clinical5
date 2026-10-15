export const MODEL_VERSION = "Clinical5_integer_20260914_v1";
export const PRIMARY_CUTOFF = 3;
export const MAX_SCORE = 21;
export const RISK_INTERCEPT = -4.9031303382268;
export const RISK_SLOPE = 0.393767915695901;

export function agePoints(age) {
  const value = Number(age);
  if (!Number.isFinite(value) || value < 40 || value > 120) {
    throw new RangeError("Age must be between 40 and 120 years.");
  }
  return Math.min(7, Math.floor((value - 40) / 5));
}

export function sexPoints(sex) {
  if (sex === "female") return 0;
  if (sex === "male") return 2;
  throw new TypeError("Sex must be female or male.");
}

export function bmiPoints(bmi) {
  const value = Number(bmi);
  if (!Number.isFinite(value) || value <= 0 || value > 100) {
    throw new RangeError("BMI must be greater than 0 and no more than 100 kg/m².");
  }
  if (value < 18.5) return 3;
  if (value < 24) return 1;
  if (value < 28) return 0;
  return 1;
}

export function packYearsPoints(packYears) {
  const value = Number(packYears);
  if (!Number.isFinite(value) || value < 0 || value > 500) {
    throw new RangeError("Pack-years must be between 0 and 500.");
  }
  if (value === 0) return 0;
  if (value <= 10) return 1;
  if (value <= 20) return 2;
  if (value <= 40) return 2;
  return 3;
}

export function asthmaPoints(history) {
  if (history === "no") return 0;
  if (history === "yes") return 6;
  throw new TypeError("Asthma history must be yes or no.");
}

export function calculateBmi(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);
  if (!Number.isFinite(height) || height < 100 || height > 250) {
    throw new RangeError("Height must be between 100 and 250 cm.");
  }
  if (!Number.isFinite(weight) || weight < 20 || weight > 400) {
    throw new RangeError("Weight must be between 20 and 400 kg.");
  }
  return weight / ((height / 100) ** 2);
}

export function calculatePackYears(periods) {
  if (!Array.isArray(periods) || periods.length === 0) {
    throw new TypeError("At least one smoking period is required.");
  }
  return periods.reduce((total, period) => {
    const cigarettesPerDay = Number(period.cigarettesPerDay);
    const years = Number(period.years);
    if (!Number.isFinite(cigarettesPerDay) || cigarettesPerDay < 0 || cigarettesPerDay > 200) {
      throw new RangeError("Cigarettes per day must be between 0 and 200.");
    }
    if (!Number.isFinite(years) || years < 0 || years > 100) {
      throw new RangeError("Smoking years must be between 0 and 100.");
    }
    return total + (cigarettesPerDay / 20) * years;
  }, 0);
}

export function predictedRisk(totalScore) {
  const score = Number(totalScore);
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw new RangeError("Total score must be an integer between 0 and 21.");
  }
  const logit = RISK_INTERCEPT + RISK_SLOPE * score;
  return 1 / (1 + Math.exp(-logit));
}

export function calculateScore({ age, sex, bmi, packYears, asthma }) {
  const components = {
    age: agePoints(age),
    sex: sexPoints(sex),
    bmi: bmiPoints(bmi),
    packYears: packYearsPoints(packYears),
    asthma: asthmaPoints(asthma),
  };
  const total = Object.values(components).reduce((sum, points) => sum + points, 0);
  return {
    components,
    total,
    screenPositive: total >= PRIMARY_CUTOFF,
    predictedRisk: predictedRisk(total),
  };
}
