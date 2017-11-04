import { Vault } from 'vaultage-client';
import { ICommand } from '../webshell/ICommand';
import { Shell } from '../webshell/Shell';
import * as lang from '../lang';

export class PullCommand implements ICommand {
    public readonly name = 'pull';

    public readonly description = 'Pulls the encrypted database, and decrypts it locally.';

    constructor(
        private vault: Vault,
        private shell: Shell) {
    }

    public async handle() {
        if(!this.vault.isAuth()){
            this.shell.echoHTML(lang.ERR_NOT_AUTHENTICATED)
            return;
        }

        try {
            this.shell.echo(`Attempting to pull the encrypted database ...`);

            let p = new Promise(resolve => this.vault.pull(function(err) {
                if(err == null){
                    resolve("")
                } else {
                    resolve('<span class="error">'+err.toString()+'</span>')
                }
            }));

            await p;
            p.then((err : string) => {
                //if no error
                if(err=="") {
                    this.shell.echo("Pull OK, got " + this.vault.getNbEntries()+" entries (revision "+this.vault.getDBRevision()+").")
                } else {
                    this.shell.echoHTML(err)
                }                
            })

        } catch (e) {
            this.shell.echoHTML('<span class="error">Failed. ' + e.toString()+'</span>'); 
        }
    }
}