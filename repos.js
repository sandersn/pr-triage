import { Octokit } from "@octokit/rest";
let cutoff = new Date("2022-01-01");
let verbose = true;
/**
 * find repos that import a certain library
 * @param {string} packageName
 * @param {string} language
 */
async function findReposWithPackage(packageName, language) {
  try {
    // Search for repositories that import the specified package
    const response = await octokit.search.repos({
      q: `import ${packageName} in:file language:${language}`,
    });
    // Extract the repository URLs from the response
    /** @type {Array<{ url: string, pushed_at: string }>} */
    const repoURLs = response.data.items
      .filter((item) => new Date(item.pushed_at) > cutoff)
      .map((item) => ({ url: item.html_url, pushed_at: item.pushed_at }));

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
    /** @type {Array<{url:string, message: string, date: string}>} */
    const commitURLs = response.data.items.map((item) => ({url: item.html_url, message: item.commit.message, date: item.commit.author.date}));

    return commitURLs;
  } catch (error) {
    console.error("Error occurred while searching for commits:", error);
    return [];
  }
}

// Usage example
const packageName = process.argv[2];
const libraryName = process.argv[3] ?? packageName;
const octokit = new Octokit({
  auth: process.env.GH_API_TOKEN,
});
try {
  for (const language of ["javascript", "typescript"]) {
    console.log(`${language} Repositories that import ${packageName}:`);
    for (const { url: repo, pushed_at } of await findReposWithPackage(
      packageName,
      language
    )) {
      if (verbose) console.log(repo, "last pushed_at:", pushed_at);
      else console.log(repo);
      try {
        for (const commit of await findCommitsWithMentions(libraryName, repo)) {
            if (verbose) console.log(`     ${commit.url} (${commit.date}) ${commit.message}`);
            else console.log("    " + commit.url);
        }
      } catch (error) {
        console.error("Error finding commits:", error);
      }
    }
  }
} catch (error) {
  console.error("Error finding repos:", error);
}
