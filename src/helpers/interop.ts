export async function interop<I extends object>(module: Promise<I>): Promise<I extends { default: any } ? I['default']['default'] : I> {
  const loadedModule = await module;
  console.log(loadedModule)

  if("default" in loadedModule) {
    return loadedModule.default as any;
  }

  return loadedModule as any;
}
