var githubKey = process.argv[2];
var issuesStartIndex = parseInt(process.argv[3], 10);
var numberOfIssues = parseInt(process.argv[4], 10);

var request = require('request');
var _ = require('lodash');

var labels = ['bug', 'critical', 'enhancement', 'trivial', 'user error', null];

var users = ['heinzelmannchen-tool', 'danistrebel', null];

function createIssue(issueIndex) {

  var previousIssues = _.range(issuesStartIndex, issueIndex, 1);
  var issueDependencies = _.sampleSize(previousIssues, _.sampleSize(previousIssues, _.random[8]), _.random[8]);

  var issuelabels = _.sampleSize(labels, 1);
  var assignee = _.sample(users);

  var previousIssuesReferences = '### Dependencies' + _.map(issueDependencies, function(dep) { return '\n* [ ] #' + dep;}).join('');

  var issue = {
    'title': 'Demo Issue ' + issueIndex,
    'body': 'This is just a generated demo issue. Nothing too interesting to see :)\n\n' + previousIssuesReferences,
    'assignee': assignee,
    'labels': issuelabels
  };

  console.info(JSON.stringify(issue));

  request.post(
    {
      url: 'https://api.github.com/repos/heinzelmannchen-tool/heinzelmannchen-demo/issues',
      json: issue,
      headers: {
        'User-Agent': 'Heinzelmannchen-Demo-Issues',
        'Authorization': 'token ' + githubKey
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      } else {
        console.error(JSON.stringify(response));
      }
    }
  );
}

for (var i = issuesStartIndex; i < (issuesStartIndex + numberOfIssues); i++) {
  createIssue(i);
}
