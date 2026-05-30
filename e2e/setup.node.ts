// Node.js e2e test setup
// Handle unhandled rejections to prevent Jest worker crashes

process.on('unhandledRejection', (reason) => {
  // Suppress unhandled rejection warnings for expected test failures
});