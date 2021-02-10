# User Acceptance Tests

## Purpose

The purpose of these tests is to ensure that key deployment configurations remain deployable, through the changes we introduce into the repo. They mainly serve as safeguards against regressions, but new deployments & tests can be added as new features are added.

## Definitions

Before we go too far, some definitions for clarity:

* `deployment configuration, deploy config` - a file containing the state of an environment that will be created (or torn down).

* `scenario` - a deployment configuration meant to exercise some specific story or use case.

## Setup

The files within this directory are used in the execution of the test GitHub Actions workflow, found [here](../.github/workflows/deployment_tests.yml).

In the `deploy_configs` folder, you will find a deployment configuration for each (`scenario`, `cloud_provider`) combination we want to test. Deployment configurations in this folder match the following naming convention: `{scenario_name}`-`{cloud_provider}`.deploy.config.json

In the `tests` folder, you will find a test file for each `scenario` we want to test. Test files in this folder match the following naming convention: `{scenario_name}`.rb

## Execution

The complete workflow can be seen [here](../.github/workflows/deployment_tests.yml), but the high level overview is:

1. The workflow creates a job for each (scenario, cloud_provider) combination.
2. Within each job:
    * a deployment runs using the corresponding config that matches the scenario, cloud_provider combination.
    * a ruby test file is run for the corresponding scenario.

### Example

If a workflow is triggered for `(production, aws)`, the following will occur:

* a deployment runs using `production-aws.deploy.config.json` deployment config.
* tests defined within `production.rb` will run.

## Adding new scenarios, new deployment configurations, new tests

As seen above, each (scenario, cloud_provider) combination represents a testcase that we believe is valuable to test. The scenario is the important functional component, and the cloud provider just ensures that the scenario runs for that given environment.

The current setup is:

* 1 conceptual scenario.
* 3 deploy configs (duplicate the scenario pieces for each cloud_provider).
* 1 test file for the scenario, that runs 3x, for each deployment. This file can contain any number of tests as well as any setup needed in order for the tests to run.

The deploy configs will under the [deploy_configs](./deploy_configs) folder with a name matching `{scenario}-{cloud_provider}.deploy.config.json`

The test file will live under the [tests](./tests) folder with a name matching `{scenario}.rb`
