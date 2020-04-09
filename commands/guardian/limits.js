const { Command } = require('discord-akairo');

class LimitsCommand extends Command {
    constructor() {
        super('limits', {
            aliases: ['limits', 'limit'],
            args: [
                {
                    id: 'index',
                    type: 'integer'
                },
                {
                    id: 'value',
                    type: 'integer'
                }
            ],
            channel: 'guild'
        });
    }



    async exec(message, args) {

        const embed = this.client.util.embed();
        const guild = message.guild;

        if (args.value) {
            if (!message.member.hasPermission('ADMINISTRATOR')) embed.setDescription('*You don\'t have the **\`ADMINISTRATOR\`** permission to do that.*');
            else {

                if (args.index > 10 || args.index < 1) return message.channel.send('Index is not between 1-10.');
                if (args.value > 30 || args.value < 1) return message.channel.send('Value is not between 1-30.');

                let key = Object.keys(require('../../config.js').limits)[Math.ceil(args.index / 2) - 1];
                let duration = args.index % 2 === 0 ? 'hour' : 'minute';

                guild.set(`limits.${key}.${duration}`, args.value);
                embed.setDescription(`*${this.client.Utils.toProperCase(key)} per ${duration} has been changed to **\`${args.value}\`**.*`);

            }
        }

        embed.setTitle(`Server Limits for ${message.guild.name}`)
            .setColor(0x7289DA)
            .setFooter("If any of the defined limits are met, all of the user's roles will be automatically removed.");
        if (!embed.description) embed.setDescription(`***\`${message.guild.prefix}limits <index> <value>\`** to update the limits.*\n***\`${message.guild.prefix}reset limits\`** to reset the limits.*\n***\`${message.guild.prefix}config\`** for additional options.*`);

        var index = 1;
        var limits = guild.limits;
        for (var k in limits) {

            let minuteText = `**${index++}.** Per Minute: **\`${limits[k].minute}\`**`;
            let hourText = `**${index++}.** Per Hour: **\`${limits[k].hour}\`**`;

            embed.addField(this.client.Utils.toProperCase(k), `${minuteText}\n${hourText}`, true);
        }

        message.channel.send(embed.addField('\u200B', '\u200B', true));

    }
}

module.exports = LimitsCommand;