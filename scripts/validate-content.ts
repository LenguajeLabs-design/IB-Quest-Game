import {
  collectPilotReadinessIssues,
  contentRegistry,
} from '../src/content/registry'

const readinessIssues = collectPilotReadinessIssues(contentRegistry)

console.log(
  `Content registry is structurally valid (${contentRegistry.regions.length} regions, ${contentRegistry.missions.length} mission).`,
)

if (readinessIssues.length > 0) {
  console.log(
    `Pilot readiness remains blocked by ${readinessIssues.length} explicit issue(s):`,
  )
  for (const issue of readinessIssues) {
    console.log(`- [${issue.code}] ${issue.message}`)
  }
}
