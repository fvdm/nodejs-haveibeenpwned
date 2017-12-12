// Load module
const pwned = require ('haveibeenpwned') ();

// Fancy console.log
function output (err, data) {
  console.dir (err || data, {
    depth: null,
    colors: true
  });
}

// Get all Linkedin breaches
pwned.breaches ({ domain: 'linkedin.com' }, output);
