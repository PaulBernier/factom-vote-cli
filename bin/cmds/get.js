#!/usr/bin/env node

const { FactomVoteManager } = require('factom-vote'),
    { getConnectionInformation, printError } = require('../../src/util');

exports.command = 'get <chainid>';
exports.describe = 'Get vote details.';

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
    }).positional('chainid', {
        describe: 'Chain id of the vote.'
    });
};

exports.handler = function (argv) {
    const factomd = getConnectionInformation(argv.socket, 8088);
    const walletd = getConnectionInformation(argv.wallet, 8089);
    const manager = new FactomVoteManager({ factomd, walletd });

    console.log(`Retrieving vote information from [${argv.chainid}]...`);
    manager.getVote(argv.chainid)
        .then(console.log)
        .catch(printError);

};