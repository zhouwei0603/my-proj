export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const enum Operation {
  InlineCreate = "InlineCreate",
  InlineUpdate = "InlineUpdate",
  StandaloneCreate = "StandaloneCreate",
  StandaloneUpdate = "StandaloneUpdate",
}