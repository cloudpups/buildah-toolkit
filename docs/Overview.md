‼ Please note that this extension assumes that `buildah` is properly configured and added to the agent's `path`.

# Buildah Toolkit

An unofficial (from the perspective of `buildah`) extension that allows for a better built-in experience around using [buildah](https://buildah.io/) with Azure DevOps.

## Features

* ✔ Run `buildah` commands
* ✔ Supply basic credentials via Service Connection
* ◻ Supply credentials specific to AWS via Service Connection
* ◻ Supply credentials specific to Azure via Service Connection

## Example

Please note that `basicCredentials: 'Buildah DockerHub'` was configured with a [Service Connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml).

```yml
variables:
- name: tag
  value: docker.io/trfc/buildah-sample:latest

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
- task: BuildahCli@0
  inputs:
    command: 'bud'
    arguments: '-f $(System.DefaultWorkingDirectory)/test/Dockerfile -t $(tag)'
- task: BuildahCli@0
  inputs:
    command: 'push'
    arguments: '$(tag)'
    loginType: 'basic'
    basicCredentials: 'Buildah DockerHub'
```

## Motivation

At the time this was created, no other extensions existed to make interacting with `buildah` *cleaner* (i.e. leverage specific built in capabilities of Azure DevOps, like Service Connections).

## EULA

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.