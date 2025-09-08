import { app } from "./app";
import { ENV } from "./config/env";

const host = "0.0.0.0";
app.listen(ENV.PORT, host, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[server] listening on http://${host}:${ENV.PORT} (NODE_ENV=${ENV.NODE_ENV})`
  );
});
