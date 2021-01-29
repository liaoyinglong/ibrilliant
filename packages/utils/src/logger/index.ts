import debug from "debug";

export function createLogger(name: string) {
  return debug(name);
}
export function enableLogger() {
  debug.enable("*");
}
