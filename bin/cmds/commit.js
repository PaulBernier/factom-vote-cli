#!/usr/bin/env node

const ora = require('ora'),
    chalk = require('chalk'),
    fs = require('fs'),
    crypto = require('crypto'),
    { FactomVoteManager } = require('factom-vote'),
    { getConnectionInformation } = require('../../src/util');

exports.command = 'commit <votejson>';
exports.describe = 'Commit a vote.';

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
    }).option('chain', {
        alias: 'c',
        required: true,
        type: 'string',
        describe: 'Chain ID of the vote to commit to.',
    }).positional('votejson', {
        describe: 'Path to a JSON file containing vote options selected.'
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
    const voteChainId = argv.chain;

    spinner = ora('Committing vote...').start();
    try {
        const revealJson = generateRevealJson(voteChainId, identity, JSON.parse(fs.readFileSync(argv.votejson)));
        const result = await manager.commitVote(voteChainId, revealJson.reveal, identity, argv.ecaddress);
        spinner.succeed(chalk.green('Vote committed'));
        onCommitSuccess(result, revealJson);
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        spinner.fail(chalk.red(message));
        return;
    }
};

function onCommitSuccess(result, revealJson) {
    const revealFilename = `${revealJson.identityChainId}@${revealJson.voteChainId}.reveal.json`;

    fs.writeFileSync(revealFilename, JSON.stringify(revealJson, null, 4));
    console.error(`Reveal file saved at ${chalk.yellow(revealFilename)}. Use that file to later reveal your vote.`);
    console.log(result);
}

function generateRevealJson(voteChainId, identity, options) {
    if (!Array.isArray(options)) {
        throw new Error('Vote JSON must be an array of the options to vote for.');
    }

    return {
        voteChainId,
        identityChainId: identity.chainId,
        reveal: {
            vote: options,
            secret: crypto.randomBytes(32).toString('hex'),
            hmacAlgo: 'sha512'
        }
    };

}