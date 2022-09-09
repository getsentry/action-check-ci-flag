import * as core from '@actions/core';
import * as github from '@actions/github';
import getToken from 'github-app-token';

async function readPrDescription(): Promise<string | null> {
  const privateKey = core.getInput('privateKey');
  const id = core.getInput('appId');

  const pullRequestPayload = github.context.payload.pull_request;

  if (!pullRequestPayload) {
    core.error('This action only works for pull requests');
    return null;
  }

  const {owner, repo} = github.context.repo;
  const token = await getToken(id, privateKey);
  const octokit = github.getOctokit(token);
  const pullRequest = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullRequestPayload.number,
  });

  return pullRequest?.data.body;
}

export function parseFlagList(flagList: string): string[] {
  return flagList
    .split(/\s+|,/)
    .map(t => t.trim())
    .filter(t => t);
}

export function checkTextForFlag(
  targetFlagList: string,
  label: string,
  text: string
): boolean {
  const targetFlags = parseFlagList(targetFlagList);

  const textFlagList = text.match(new RegExp(`^\\s*${label}:?\\s+(.*)$`, 'im'));
  const flagsInText = textFlagList && parseFlagList(textFlagList[1]);

  if (!flagsInText) {
    return false;
  }
  return flagsInText.some(flagInText =>
    targetFlags.some(
      targetFlag => flagInText.toLowerCase() === targetFlag.toLowerCase()
    )
  );
}

async function run(): Promise<void> {
  try {
    const prDescription = await readPrDescription();
    const targets = core.getInput('targets');
    const label = core.getInput('label');
    const isFlagPresent =
      (prDescription && checkTextForFlag(targets, label, prDescription)) ||
      false;

    core.setOutput('isFlagPresent', isFlagPresent);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
