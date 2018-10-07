#!/usr/bin/env node

const fs = require('fs'),
    { FactomVoteManager } = require('factom-vote'),
    { getConnectionInformation, printError } = require('../../src/util');

exports.command = 'add-voters <chainid> <votersjson>';
exports.describe = 'Append eligible voters to an existing list.';

exports.builder = function (yargs) {
    return yargs.option('socket', {
        alias: 's',
        type: 'string',
        describe: 'IPAddress:port of factomd API.',
        default: 'localhost:8088'
    }).option('wallet', {
        alias: 'w',
        type: 'string',
        describe: 'IPAddress:port of walletd API.',
        default: 'localhost:8089'
    }).option('ecaddress', {
        alias: 'ec',
        required: true,
        type: 'string',
        describe: 'EC address to pay for the created chains and entries.',
    }).option('identity', {
        alias: 'id',
        required: true,
        type: 'string',
        describe: 'Format: identity_chain:identity_key',
    }).positional('chainid', {
        describe: 'Chain id of the existing eligible voters list.'
    }).positional('votersjson', {
        describe: 'Path to a JSON file containing the list eligible voters.'
    });
};

exports.handler = function (argv) {
    const factomd = getConnectionInformation(argv.socket, 8088);
    const walletd = getConnectionInformation(argv.wallet, 8089);
    const manager = new FactomVoteManager({ factomd, walletd });

    const identityKey = argv.identity.split(':')[1];
    const eligibleVoters = JSON.parse(fs.readFileSync(argv.votersjson));

    console.log(`Adding eligible voters to ${argv.chainid}...`);
    const appendEligibleVotersData = { eligibleVoters, eligibleVotersChainId: argv.chainid, identityKey };
    manager.appendEligibleVoters(appendEligibleVotersData, argv.ecaddress)
        .then(console.log)
        .catch(printError);

};