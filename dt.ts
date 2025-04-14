import fs from "fs"
type Pull = {
  number: number
  title: string
  author: string
  createdAt: string
  labels: string[]
  comments: Array<{ body: string; author: string }>
  files: Array<{ path: string; additions: number; deletions: number; changeType: string }>
}
const pulls = JSON.parse(fs.readFileSync("dt-prs.json", "utf-8")) as Pull[]
let i = 0
for (const pull of pulls) {
  if (
    pull.labels.includes("Abandoned") ||
    pull.labels.includes("The CI failed") ||
    pull.labels.includes("Revision needed")
  ) {
    continue
  }
  i++
  if (pull.labels.includes("Check Config") || pull.labels.includes("Critical package")) {
    continue
  }
  let message
  // log easily mergable PRs
  if (
    pull.author === "hkleungai" &&
    pull.files.every(
      f => f.changeType === "DELETED" || (f.changeType === "MODIFIED" && f.path === "notNeededPackages.json")
    )
  ) {
    const deletedPackage = pull.files.find(f => f.changeType === "DELETED")
    let downloads = "N/A"
    if (deletedPackage) {
      const packageName = deletedPackage.path.replace("types/", "").replace("/.npmignore", "")
      const npmApiUrl = `https://api.npmjs.org/downloads/point/last-week/${packageName}`
      try {
        const response = await fetch(npmApiUrl)
        if (response.ok) {
          const data = await response.json()
          downloads = data.downloads.toString()
        } else {
          console.log(`Failed to fetch download count for package ${packageName}: ${response.statusText}`)
        }
      } catch (error) {
        console.log(`Error fetching download count for package ${packageName}: ${error.message}`)
      }
    }
    message = "hkleungai (downloads: " + downloads + ")"
  } else if (pull.labels.includes("New Definition")) {
    message = "New Definition"
  } else if (pull.labels.includes("Owner Approved")) {
    message = "Owner Approved"
  }
  // log easily closeable PRs
  // 1. if it's over 3 years old
  if (new Date().getTime() - new Date(pull.createdAt).getTime() > 1000 * 60 * 60 * 24 * 365 * 3) {
    message = "Over 3 years old"
  }
  if (message) {
    console.log(`${message}: ${pull.title} by ${pull.author} (${pull.number})`)
  }
}
console.log(`Total: ${i}`)
