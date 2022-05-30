import * as tl from "azure-pipelines-task-lib/task";
import * as tr from "azure-pipelines-task-lib/toolrunner";

function getBasicCredentials() {
    const basicCredentialsId = tl.getInput("basicCredentials", true);
    const username = tl.getEndpointAuthorizationParameter(basicCredentialsId, "username", false)
    const password = tl.getEndpointAuthorizationParameter(basicCredentialsId, "password", false)

    return {
        username: username,
        password: password
    }
}

type MaybeValue = ValueNotFound | ValueFound | NoValue;

class ValueNotFound {
    Type: "ValueNotFound" = "ValueNotFound";
    Message: string = "";
}

class ValueFound {
    Type: "ValueFound" = "ValueFound";
    Value: string = "";
    RawValue: string = "";
}

class NoValue {
    Type: "NoValue" = "NoValue";
}

function tryGetValue(inputName: string, required: boolean): MaybeValue {
    const value = tl.getInput(inputName, required);

    if (!required && (value == 'bad' || value == undefined)) {
        return {
            Type: "NoValue"
        }
    }

    if (value == 'bad' || value == undefined) {
        return {
            Type: "ValueNotFound",
            Message: `Bad input was given for ${inputName}`
        };
    }

    // Force fetching here in case it is a recognized build variable.
    // If not, that is just a small performance hit that we can 
    // swallow.
    // There has to be a better way to do this.
    const pipelineVariableValue = tl.getVariable(value)

    if (pipelineVariableValue == undefined) {
        return {
            Type: "ValueFound",
            Value: value,
            RawValue: value
        }
    }

    return {
        Type: "ValueFound",
        Value: pipelineVariableValue,
        RawValue: value
    };
}

async function run() {
    const maybeCommand = tryGetValue("command", true);
    const maybeArgs = tryGetValue("arguments", false);
    const maybeLoginType = tryGetValue("loginType", true);

    if (maybeCommand.Type != "ValueFound" ||
        maybeLoginType.Type != "ValueFound") {
        tl.setResult(tl.TaskResult.Failed, "Missing required parameters.", true);
        return;
    }

    let argument = maybeCommand.Value;

    if (maybeLoginType.Value == "basic") {
        const basicCredentials = getBasicCredentials();

        argument += ` --creds=${basicCredentials.username}:${basicCredentials.password}`;
    }

    if(maybeArgs.Type == "ValueFound") {
        argument += ` ${maybeArgs.Value}`;
    }        

    tl.debug(`Running buildah ${argument}`);

    try{
        const result = await tl.exec("buildah", argument);

        tl.setResult(result, null, true);
    }    
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed', true);
    }
}

run();