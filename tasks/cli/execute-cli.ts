import * as tl from "azure-pipelines-task-lib/task";
import * as tr from "azure-pipelines-task-lib/toolrunner";

const command = tl.getInput("command", true);
const args = tl.getInput("arguments", false);
const loginType = tl.getInput("loginType", true);

function getBasicCredentials() {
    const basicCredentialsId = tl.getInput("basicCredentials", true);
    const username = tl.getEndpointAuthorizationParameter(basicCredentialsId, "username", false)
    const password = tl.getEndpointAuthorizationParameter(basicCredentialsId, "password", false)

    return {
        username: username,
        password: password
    }
}

async function run() {

    const argArray = [command];

    if (loginType == "basic") {
        const basicCredentials = getBasicCredentials();

        argArray.push(`--creds=${basicCredentials.username}:${basicCredentials.password}`);
    }

    if (args.length > 0) {
        argArray.push(args);
    }

    tl.debug(`Running buildah ${argArray}`);
    return tl.exec("buildah", argArray);
}

run();