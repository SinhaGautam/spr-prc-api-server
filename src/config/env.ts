export { config, environment, loadEnvironment } from "../core/config/Environment";
export type { Environment } from "../core/config/Environment";

import { config } from "../core/config/Environment";

export function getPort(): number {
  return config.port;
}
