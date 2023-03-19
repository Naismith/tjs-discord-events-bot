// @ts-check
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("clear-messages")
  .setDescription("Clear all messages in a room")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export const execute = async (interaction) => {
  const channel = interaction.channel;

  await interaction.reply({ content: "Clearing messages!", ephemeral: true });

  const messages = Array.from(
    (await channel.messages.fetch({ limit: 100 })).values()
  );

  await Promise.all(messages.map((message) => message.delete()));
};
