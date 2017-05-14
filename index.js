// Convert a html page into Markdown

var toMarkdown = require('to-markdown')
var fs = require('fs')
var opts = require('commander')

opts
  .version('1.0.0')
  .description('Convert a html page to markdown')
  .option('--html [pathname]', 'name of html')
  .option('--md [pathname]', 'Output name')
  .parse(process.argv);

var html = fs.readFileSync(opts.html, 'utf8')
var md = toMarkdown(html)
var outFile = fs.createWriteStream(opts.md)
outFile.write(md, function () {
  outFile.end
})