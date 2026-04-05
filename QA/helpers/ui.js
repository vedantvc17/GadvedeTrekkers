export async function closeSplashIfVisible(page) {
  const signInButton = page.getByRole("button", { name: /^sign in$/i });
  if (await signInButton.isVisible().catch(() => false)) {
    await signInButton.click();
  }
}

export async function openFirstVisibleDetails(page) {
  const viewButtons = page.getByRole("link", { name: /view details/i });
  const count = await viewButtons.count();
  for (let index = 0; index < count; index += 1) {
    const candidate = viewButtons.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click();
      return;
    }
  }

  throw new Error("No visible View Details link found.");
}
