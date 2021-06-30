import * as tl from "azure-pipelines-task-lib/task";
import * as tr from "azure-pipelines-task-lib/toolrunner";

const command = tl.getInput("command", true);

async function run() {    
    console.log(`Thanks for using this task! It is not ready yet though! ${command}`);
}

run();