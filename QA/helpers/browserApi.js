export async function importModule(page, modulePath, action, args = []) {
  return page.evaluate(
    async ({ modulePath: targetModulePath, actionName, actionArgs }) => {
      const mod = await import(targetModulePath);
      const target = mod[actionName];
      if (typeof target !== "function") {
        throw new Error(`Export "${actionName}" is not a function in ${targetModulePath}`);
      }
      return target(...actionArgs);
    },
    {
      modulePath,
      actionName: action,
      actionArgs: args,
    },
  );
}

export async function evaluateModule(page, modulePath, evaluator, payload = {}) {
  return page.evaluate(
    async ({ modulePath: targetModulePath, payload: inputPayload, evaluatorSource }) => {
      const mod = await import(targetModulePath);
      const fn = new Function("mod", "payload", evaluatorSource);
      return fn(mod, inputPayload);
    },
    {
      modulePath,
      payload,
      evaluatorSource: evaluator,
    },
  );
}

export async function resetBrowserStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
