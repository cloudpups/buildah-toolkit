import * as tl from "azure-pipelines-task-lib/task";
import * as tr from "azure-pipelines-task-lib/toolrunner";

const additional_args = tl.getInput("additional_args", false);
const tag = tl.getInput("tag", true);

function run() {
    console.log("Thanks for using this task! It is not ready yet though!");
}