import { ServerConfig } from "../../../server/configs/server-config";

export const Backend = {
  test: `${ServerConfig.apiPrefix}/test`,
  Tasks: `${ServerConfig.apiPrefix}/tasks`,
};
