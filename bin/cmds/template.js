#!/usr/bin/env node
const colors = require('colors');

const eligibleVotersTemplate = require('../../src/templates/eligible-voters.json'),
    voteDefinitionTemplate = require('../../src/templates//vote-definition.json');

exports.command = 'template <type>';
exports.describe = 'Output a given template of JSON.';

exports.builder = function (yargs) {
    return yargs.positional('type', {
        describe: 'Type of the template to display. Supported types are: vote-def, voters'
    });
};

exports.handler = function (argv) {
    switch (argv.type) {
        case 'vote-def':
            console.log(JSON.stringify(voteDefinitionTemplate, null, 4));
            break;
        case 'voters':
            console.log(JSON.stringify(eligibleVotersTemplate, null, 4));
            break;
        default:
            console.error(colors.red(`Invalid template type: ${argv.type}`));
    }

};