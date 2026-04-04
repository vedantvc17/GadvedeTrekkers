const CONTENT_KEY = "gt_training_content";
const LEGACY_OVERRIDE_KEY = "gt_training_overrides";
const UPDATE_EVENT = "gt:training-updated";

function canUseWindow() {
  return typeof window !== "undefined";
}

function emitUpdate() {
  if (!canUseWindow()) return;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyLegacyVideoOverrides(modules) {
  const overrides = readJson(LEGACY_OVERRIDE_KEY, {});
  if (!overrides || typeof overrides !== "object") return modules;

  return modules.map((module) => {
    const override = overrides[module.id];
    if (!override?.videos) return module;
    return { ...module, videos: clone(override.videos) };
  });
}

function ensureContentShape(content, defaultModules, defaultQuestions) {
  const modules = Array.isArray(content?.modules) && content.modules.length > 0
    ? clone(content.modules)
    : applyLegacyVideoOverrides(clone(defaultModules));

  const questions = Array.isArray(content?.questions) && content.questions.length > 0
    ? clone(content.questions)
    : clone(defaultQuestions);

  return { modules, questions };
}

export function getTrainingUpdateEventName() {
  return UPDATE_EVENT;
}

export function getTrainingContent(defaultModules = [], defaultQuestions = []) {
  const stored = readJson(CONTENT_KEY, null);
  return ensureContentShape(stored, defaultModules, defaultQuestions);
}

export function getManagedTrainingModules(defaultModules = []) {
  return getTrainingContent(defaultModules, []).modules;
}

export function getManagedTrainingQuestions(defaultQuestions = []) {
  return getTrainingContent([], defaultQuestions).questions;
}

export function saveTrainingContent(content, defaultModules = [], defaultQuestions = []) {
  const next = ensureContentShape(content, defaultModules, defaultQuestions);
  writeJson(CONTENT_KEY, next);
  emitUpdate();
  return next;
}

export function saveTrainingModules(modules, defaultQuestions = []) {
  const current = getTrainingContent([], defaultQuestions);
  return saveTrainingContent({ ...current, modules }, [], defaultQuestions);
}

export function saveTrainingQuestions(questions, defaultModules = []) {
  const current = getTrainingContent(defaultModules, []);
  return saveTrainingContent({ ...current, questions }, defaultModules, []);
}

export function resetTrainingContent() {
  localStorage.removeItem(CONTENT_KEY);
  emitUpdate();
}
