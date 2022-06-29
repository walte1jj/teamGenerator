const inquirer = require("inquierer");
const path = require("path");
const fs = require("fs");

const engineer = require("./lib/engineer");
const intern = require("./lib/engineer");
const manager = require("./lib/manager");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
