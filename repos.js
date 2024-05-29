import { Octokit } from "@octokit/rest";

/**
 * find repos that import a certain library
 * @param {string} packageName
 */
async function findReposWithPackage(packageName) {
  try {
    // Search for repositories that import the specified package
    const response = await octokit.search.code({
      q: `import ${packageName} in:file language:javascript`,
    });
    // Extract the repository URLs from the response
    /** @type {string[]} */
    const repoURLs = response.data.items.map(
      (item) => item.repository.html_url
    );

    return repoURLs;
  } catch (error) {
    console.error("Error occurred while searching for repositories:", error);
    return [];
  }
}

/**
 * find commits in a repo that mention "upgrading to a new version" and the package name
 * @param {string} packageName
 * @param {string} repoURL
 */
async function findCommitsWithMentions(packageName, repoURL) {
  try {
    // Get the owner and repo name from the repository URL
    const [owner, repo] = repoURL.split("/").slice(-2);

    // Search for commits that mention the package name and "upgrading to a new version"
    const response = await octokit.search.commits({
      q: `repo:${owner}/${repo} "${packageName}" "upgrade"`,
    });

    // Extract the commit URLs from the response
    /** @type {string[]} */
    const commitURLs = response.data.items.map((item) => item.html_url);

    return commitURLs;
  } catch (error) {
    console.error("Error occurred while searching for commits:", error);
    return [];
  }
}

// Usage example
const packageName = "lodash";
const octokit = new Octokit({
  auth: process.env.GH_API_TOKEN,
});
try {
  console.log(`Repositories that import ${packageName}:`);
  for (const repo of await findReposWithPackage(packageName)) {
    console.log(repo);
    try {
      console.log(
        `Commits that mention "${packageName}" and "upgrading to a new version" in ${repo}:`
      );
      for (const commit of await findCommitsWithMentions(packageName, repo)) {
        console.log(commit);
      }
    } catch (error) {
      console.error("Error finding commits:", error);
    }
  }
} catch (error) {
  console.error("Error finding repos:", error);
}
