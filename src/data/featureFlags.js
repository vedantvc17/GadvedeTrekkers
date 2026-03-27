const HERITAGE_KEY = "gt_feature_heritage_enabled";

export function isHeritageEnabled() {
  return localStorage.getItem(HERITAGE_KEY) === "true";
}

export function setHeritageEnabled(val) {
  localStorage.setItem(HERITAGE_KEY, val ? "true" : "false");
}
