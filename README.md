# Factom vote CLI

## Help

```bash
$ factom-vote-cli --help
```

## Display template

Command to display a JSON examples. Supported types:
* `vote-def`: a full vote definition
* `voters`: list of eligible voters

```bash
# factom-vote-cli template <type>
$ factom-vote-cli template vote-def
```

Save it in a file to later edit it and feed the file to another command:
```bash
$ factom-vote-cli template voters > voters.json
```

## Create vote

```bash
# factom-vote-cli create --id <id_chain:id_key> --ec <ec_address> <vote_def_json> [voters_json]
$ factom-vote-cli create --id 3a6c770d8b152dcc80fa0a54fa931c6208e96f14f76dd616e51502a58836e9f8:idpub3Doj5fqXye8PkX8w83hzPh3PXbiLhrxTZjT6sXmtFQdDyzwymz --ec EC2vXWYkAPduo3oo2tPuzA44Tm7W6Cj7SeBr3fBnzswbG5rrkSTD vote-def.json voters.json
```

## Append eligible voters

```bash
# factom-vote-cli add-voters --id <id_chain:id_key> --ec <ec_address> -c <voters_chain_id> <voters_json>
$ factom-vote-cli add-voters --id 3a6c770d8b152dcc80fa0a54fa931c6208e96f14f76dd616e51502a58836e9f8:idpub3Doj5fqXye8PkX8w83hzPh3PXbiLhrxTZjT6sXmtFQdDyzwymz --ec EC2vXWYkAPduo3oo2tPuzA44Tm7W6Cj7SeBr3fBnzswbG5rrkSTD c973b2db5a4959c64606f7df7903918737f226a0ffaf93911f192582878b29eb voters.json
```

## Commit vote

```bash
# factom-vote-cli commit --id <id_chain:id_key> --ec <ec_address> -c <vote_chain_id> <options_json>
$ factom-vote-cli commit --id 3a6c770d8b152dcc80fa0a54fa931c6208e96f14f76dd616e51502a58836e9f8:idpub3Doj5fqXye8PkX8w83hzPh3PXbiLhrxTZjT6sXmtFQdDyzwymz --ec EC2vXWYkAPduo3oo2tPuzA44Tm7W6Cj7SeBr3fBnzswbG5rrkSTD c973b2db5a4959c64606f7df7903918737f226a0ffaf93911f192582878b29eb options.json
```

This command will generate a file with the format `<identity_chain_id>@<vote_chain_id>.reveal.json` to be used in the reval command.

## Reveal vote

Use the `*.reveal.json` file generated by the commit command to reveal your vote.

```bash
# factom-vote-cli reveal --ec <ec_address> <reveal_json>
$ factom-vote-cli reveal --ec EC2vXWYkAPduo3oo2tPuzA44Tm7W6Cj7SeBr3fBnzswbG5rrkSTD 3a6c770d8b152dcc80fa0a54fa931c6208e96f14f76dd616e51502a58836e9f8@c973b2db5a4959c64606f7df7903918737f226a0ffaf93911f192582878b29eb.reveal.json
```


## Get vote details and results

```bash
# factom-vote-cli get <vote_chain_id>
$ factom-vote-cli get c973b2db5a4959c64606f7df7903918737f226a0ffaf93911f192582878b29eb
```

