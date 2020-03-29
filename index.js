#!/usr/bin/env node
const program = require("commander");
const inputWizard = require("./src/input-wizard");
const events = require("events");

events.EventEmitter.defaultMaxListeners = 1000;

program.version("0.0.8", "-v, --vers", "output the current version");

program
  .option(
    "-t, --template <filename>",
    "Template file name",
    "serverless.template"
  )
  .option("-f, --format <JSON|YAML>", "Output format", "JSON")
  .option("-o, --output <console|clipboard>", "Policy output", "console")
  .action(async cmd => {
    await inputWizard.start(cmd.template, cmd.format, cmd.output);
  });

// eslint-disable-next-line no-undef
program.parse(process.argv);
