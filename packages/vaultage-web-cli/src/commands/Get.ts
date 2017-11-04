import { VaultEntryFormatter } from '../VaultFormatter'
import { Vault } from 'vaultage-client';
import { ICommand } from '../webshell/ICommand';
import { Shell } from '../webshell/Shell';
import * as lang from '../lang';

export class GetCommand implements ICommand {
    public readonly name = 'get';

    public readonly description = 'Get [keyword1] [keyword2] ... searches for keyword1 or keyword2 in all entries.';

    constructor(
        private vault: Vault,
        private shell: Shell) {
    }

    public async handle(searchTerms : string[]) {

        if(!this.vault.isAuth()){
            this.shell.echoHTML(lang.ERR_NOT_AUTHENTICATED)
            return;
        }

        if(searchTerms.length == 0){
            this.shell.echoHTML('Usage: get <i>term1</i> <i>[term2]</i>... (use \'ls\' to list all entries).');
            return;
        }

        try {
            const results = this.vault.findEntries(...searchTerms)
            const searchString = searchTerms.join(',')
            this.shell.echo('Searching for '+searchString+', '+results.length+' matching entries.');

            for (let entry of results) {
                let html = VaultEntryFormatter.formatAndHighlight(entry, searchTerms);
                this.shell.echoHTML(html);
            }

        } catch (e) {
            this.shell.echoHTML('<span class="error">Failed. ' + e.toString()+'</span>');        
        }
    }
}