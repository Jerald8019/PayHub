const fs = require('fs');
const path = require('path');

/**
 * Offline filter for already-fetched job runs
 * Use this to filter existing JSON files without re-fetching from the server
 * 
 * Usage:
 *   node scripts/filter-job-runs.js <input-file> [options]
 *   
 * Examples:
 *   node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED
 *   node scripts/filter-job-runs.js slfcab-group-job-runs.json --submission="Awaiting Approval"
 *   node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --submission="Awaiting Approval"
 */

function filterJobRuns(inputFile, options = {}) {
  const { statusFilter, submissionFilter, outputFile } = options;
  
  console.log('\n' + '='.repeat(70));
  console.log('OFFLINE JOB RUNS FILTER');
  console.log('='.repeat(70));
  
  // Read input file
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }
  
  console.log(`\nReading: ${inputFile}`);
  const allRuns = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`Loaded ${allRuns.length} job runs`);
  
  // Apply filters
  let filtered = [...allRuns];
  
  if (statusFilter) {
    console.log(`\nFiltering by status: ${statusFilter}`);
    const before = filtered.length;
    filtered = filtered.filter(run => 
      run.status.toUpperCase() === statusFilter.toUpperCase()
    );
    console.log(`  ${before} → ${filtered.length} runs`);
  }
  
  if (submissionFilter) {
    console.log(`\nFiltering by submission status: ${submissionFilter}`);
    const before = filtered.length;
    filtered = filtered.filter(run => 
      run.submissionStatus.toLowerCase().includes(submissionFilter.toLowerCase())
    );
    console.log(`  ${before} → ${filtered.length} runs`);
  }
  
  // Show summary
  console.log('\n' + '='.repeat(70));
  console.log('RESULTS');
  console.log('='.repeat(70));
  
  if (filtered.length === 0) {
    console.log('\n⚠ No runs match the filters');
    return;
  }
  
  console.log(`\nTotal: ${filtered.length} runs`);
  
  // Count by status
  const byStatus = {};
  filtered.forEach(run => {
    byStatus[run.status] = (byStatus[run.status] || 0) + 1;
  });
  
  console.log('\nBy Status:');
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  // Count by submission
  const bySubmission = {};
  filtered.forEach(run => {
    bySubmission[run.submissionStatus] = (bySubmission[run.submissionStatus] || 0) + 1;
  });
  
  console.log('\nBy Submission Status:');
  Object.entries(bySubmission).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  // Show sample
  console.log('\n--- SAMPLE RUNS ---');
  filtered.slice(0, 5).forEach((run, i) => {
    console.log(`\n${i + 1}. ${run.id}`);
    console.log(`   Status: ${run.status}`);
    console.log(`   Submission: ${run.submissionStatus}`);
    console.log(`   Triggered: ${run.triggeredAt}`);
    console.log(`   Pay Period: ${run.payPeriod}`);
  });
  
  // Save to output file
  const defaultOutput = inputFile.replace('.json', '-filtered.json');
  const finalOutput = outputFile || defaultOutput;
  
  fs.writeFileSync(finalOutput, JSON.stringify(filtered, null, 2));
  console.log(`\n✓ Saved ${filtered.length} filtered runs to: ${finalOutput}`);
  console.log('='.repeat(70) + '\n');
  
  return filtered;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node scripts/filter-job-runs.js <input-file> [options]

Options:
  --status=<SUCCEEDED|FAILED>       Filter by status
  --submission=<status>             Filter by submission status
  --output=<filename>               Output filename

Examples:
  node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED
  node scripts/filter-job-runs.js slfcab-group-job-runs.json --submission="Awaiting Approval"
  node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --submission="Awaiting Approval"
    `);
    process.exit(0);
  }
  
  const options = {
    inputFile: args[0],
    statusFilter: null,
    submissionFilter: null,
    outputFile: null
  };
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--status=')) {
      options.statusFilter = arg.split('=')[1];
    } else if (arg.startsWith('--submission=')) {
      options.submissionFilter = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.outputFile = arg.split('=')[1];
    }
  }
  
  return options;
}

// Run if called directly
if (require.main === module) {
  try {
    const options = parseArgs();
    const { inputFile, ...filterOptions } = options;
    filterJobRuns(inputFile, filterOptions);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { filterJobRuns };
