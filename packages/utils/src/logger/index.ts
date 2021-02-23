import debug from "debug";

export function createLogger(name: string) {
  return debug(name);
}
export function enableLogger(namespace = "*") {
  debug.enable(namespace);
}

export function disableLogger() {
  debug.disable();
}
