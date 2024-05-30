import { Octokit } from "@octokit/rest";
let cutoff = new Date("2022-01-01");
let verbose = false;
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
    const commitURLs = response.data.items
      .filter((item) => new Date(item.commit.author.date) > cutoff)
      .map((item) => ({
        url: item.html_url,
        message: item.commit.message,
        date: item.commit.author.date,
      }));

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
const allrepos = [];
const allcommits = [];
try {
  for (const language of ["typescript", "javascript"]) {
    if (verbose)
      console.log(`${language} Repositories that import ${packageName}:`);
    const repos = await findReposWithPackage(packageName, language);

    if (verbose) {
      for (const { url, pushed_at } of repos) {
        console.log(url, "last pushed_at:", pushed_at);
      }
    } else {
      allrepos.push(...repos);
    }
    for (const { url } of repos) {
      try {
        process.stdout.write(".");
        if (repos.length > 20) await new Promise((resolve) => setTimeout(resolve, 5_000));
        process.stdout.write("!");
        const commits = await findCommitsWithMentions(libraryName, url);
        if (verbose) {
          for (const commit of commits) {
            console.log(
              `     ${commit.url} (${commit.date}) ${commit.message}`
            );
          }
        } else {
          allcommits.push(...commits);
        }
      } catch (error) {
        console.error("Error finding commits:", error);
      }
    }
  }
} catch (error) {
  console.error("Error finding repos:", error);
}

if (!verbose) {
  // output json
  console.log('\n        "repositories": [');
  console.log(allrepos.map((repo) => `            "${repo.url}"`).join(",\n"));
  console.log("        ],");
  console.log('        "commits": [');
  console.log(
    allcommits.map((commit) => `            "${commit.url}"`).join(",\n")
  );
  console.log("        ]");
}
