#!/usr/bin/env node

const ora = require('ora'),
    chalk = require('chalk'),
    { FactomVoteManager } = require('factom-vote'),
    { getConnectionInformation } = require('../../src/util');

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

    spinner = ora(`Retrieving vote information from ${chalk.yellow(argv.chainid)}...`).start();

    try {
        const vote = await manager.getVote(argv.chainid);
        spinner.succeed(`Vote information retrieved from ${chalk.yellow(argv.chainid)}`);
        console.log(JSON.stringify(vote, null, 4));
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        spinner.fail(chalk.red(message));
        return;
    }



};

