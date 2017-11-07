import { Vault } from 'vaultage-client';
import { ICommand } from '../webshell/ICommand';
import { Shell } from '../webshell/Shell';
import { VaultEntryFormatter } from '../VaultEntryFormatter'
import * as lang from '../lang';

export class RmCommand implements ICommand {
    public readonly name = 'rm';

    public readonly description = 'Removes an entry in the local db, then pushes an encrypted version of the db to the server.';

    constructor(
        private vault: Vault,
        private shell: Shell) {
    }

    public async handle(args: string[]) {

        if(!this.vault.isAuth()){
            this.shell.echoHTML(lang.ERR_NOT_AUTHENTICATED)
            return;
        }

        try {

            let id : string;
            if(args.length == 0) {
                id = await this.shell.prompt('Entry ID:');
            } else {
                id = args[0];
            }

            const e = this.vault.getEntry(id)
            this.shell.echoHTML(VaultEntryFormatter.formatSingle(e))

            const answer = await this.shell.prompt('Confirm removal of entry #'+id+' ? y/Y')
            
            if(answer != "y" && answer != "Y"){
                this.shell.echo("Cancelled.")
                return
            }
            
            this.vault.removeEntry(id)
            this.shell.echo("Remove entry #"+id)

            await new Promise((_resolve, reject) => this.vault.save(reject));
            this.shell.echo("Push OK, revision " + this.vault.getDBRevision()+".");
        } catch (e) {
            this.shell.echoError(e.toString());
        }
    }
}