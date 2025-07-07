// import { Client as WorkflowClient } from "@upstash/workflow";

// import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

// export const WorkflowClient = new WorkflowClient({
//     baseUrl: QSTASH_URL,
//     token: QSTASH_TOKEN,
// });

import { Client as UpstashWorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

export const WorkflowClient = new UpstashWorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});