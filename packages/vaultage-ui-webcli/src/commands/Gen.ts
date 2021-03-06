import { IVaultDBEntryAttrs, passwords } from 'vaultage-client';

import * as config from '../Config';
import { Context } from '../Context';
import { html } from '../security/xss';
import { ICommand } from '../webshell/ICommand';
import { Shell } from '../webshell/Shell';

export class GenCommand implements ICommand {
    public readonly name = 'gen';

    public readonly description = 'Generates a new strong password, and adds an entry to the local db. Then, pushes an encrypted version of the db to the server.';

    constructor(
        private shell: Shell,
        private ctx: Context) {
    }

    public async handle(args: string[]) {
        const password = passwords.generatePassword(
            config.PWD_GEN_LENGTH,
            config.PWD_GEN_USE_SYMBOLS,
            config.PWG_GEN_AVOID_VISUALLY_SIMILAR_CHARS,
            config.PWD_GEN_AVOID_PUNCTUATION_USED_IN_PROGRAMMING);

        let defaultValue: string = '';
        if (args.length > 0) {
            defaultValue = args.join(' ');
        }

        const title = await this.shell.prompt('Title:', defaultValue);
        const username = await this.shell.prompt('Username:');
        const url = await this.shell.prompt('Url:');

        const newEntry: IVaultDBEntryAttrs = {
            title: title,
            login: username,
            password: password,
            url: url
        };

        const hookname: keyof Window = 'copyPasswordToClipboard';

        const newEntryID = this.ctx.vault.addEntry(newEntry);
        this.shell.echoHTML(html`Added entry #${newEntryID}, generated password is
        <span class="blurred" ondblclick="${hookname}(event)">${password}</span>
        <span class="copied">Copied to the clipboard!</span>`);

        await this.ctx.vault.save();

        this.shell.echo('Push OK, revision ' + this.ctx.vault.getDBRevision() + '.');
    }
}
