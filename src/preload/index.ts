import { Octokit } from '@octokit/rest'
import { readFileSync } from 'fs'

const octokit = new Octokit()

const owner = 'ethan-davies'
const repo = 'gliss'

// Load your project's package.json file
const packageInfo = JSON.parse(readFileSync('package.json', 'utf-8'))

async function checkForLatestRelease() {
    try {
        const { data: releases } = await octokit.rest.repos.listReleases({
            owner,
            repo,
        })

        if (releases.length === 0) {
            // No releases found on GitHub
            return
        }

        const latestRelease = releases[0]
        const latestVersion = latestRelease.tag_name
        const currentVersion = packageInfo.version

        console.log(`Latest version on GitHub: ${latestVersion}`) // Example: 1.0.0
        console.log(`Current version in package.json: ${currentVersion}`) // Example: 1.0.0

        if (latestVersion !== currentVersion) { 
            console.log('A newer version is available on GitHub.') // TODO: Add section for an update available 
        } else {
            return // No update available
        }
    } catch (error) {
        console.error('Error:', error.message)
    }
}

export default checkForLatestRelease

checkForLatestRelease()