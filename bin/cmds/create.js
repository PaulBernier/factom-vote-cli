#!/usr/bin/env node

const ora = require('ora'),
    chalk = require('chalk'),
    fs = require('fs'),
    { FactomVoteManager } = require('factom-vote'),
    { getConnectionInformation } = require('../../src/util');

exports.command = 'create <votedefjson> [votersjson]';
exports.describe = 'Create a vote.';

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
    }).option('register', {
        alias: 'r',
        type: 'string',
        describe: 'Chain id of a custom registration chain of votes.',
        // TODO: Edit to mainnet main chain
        default: 'd5c6f97cda8ccb104a2827a27f2033f20405419a0cedb8514845d2cc938cb597'
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
    }).positional('votedefjson', {
        describe: 'Path to a JSON file containing a vote definition.'
    }).positional('votersjson', {
        describe: 'Path to a JSON file containing eligible voters.'
    });
};

exports.handler = async function (argv) {
    const factomd = getConnectionInformation(argv.socket, 8088);
    const walletd = getConnectionInformation(argv.wallet, 8089);
    const manager = new FactomVoteManager({ factomd, walletd });

    let spinner = ora('Checking connections...').start();
    try {
        await manager.verifyConnections();
        spinner.succeed('Connections ok');
    } catch (e) {
        spinner.fail(e);
        return;
    }

    const [chainId, key] = argv.identity.split(':');
    const identity = { chainId, key };

    const definition = JSON.parse(fs.readFileSync(argv.votedefjson));
    const eligibleVoters = argv.votersjson ? JSON.parse(fs.readFileSync(argv.votersjson)) : [];

    const voteData = { definition, registrationChainId: argv.register, eligibleVoters, identity };
    spinner = ora('Creating vote...').start();

    try {
        const result = await manager.createVote(voteData, argv.ecaddress);
        spinner.succeed(chalk.green('Vote created'));
        console.log(result);
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        spinner.fail(chalk.red(message));
        return;
    }
};