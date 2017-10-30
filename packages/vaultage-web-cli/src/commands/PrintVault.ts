import { Vault } from 'vaultage-client';
import { ICommand } from '../webshell/ICommand';
import { Shell } from '../webshell/Shell';

export class PrintVaultCommand implements ICommand {
    public readonly name = 'print';

    public readonly description = 'Demonstrates how to do stuff with the vault.';

    constructor(
            private vault: Vault,
            private shell: Shell) {
    }

    public async handle() {
        this.shell.echo(JSON.stringify(this.vault));
    }
}
