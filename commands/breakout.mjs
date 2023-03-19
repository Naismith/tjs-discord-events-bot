// @ts-check
import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { chunk, shuffle } from "lodash-es";

export const data = new SlashCommandBuilder()
  .setName("breakout")
  .setDescription("Manage breakout rooms")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("create")
      .setDescription("Create breakout rooms")
      .addNumberOption((option) =>
        option
          .setName("rooms")
          .setDescription("Number of breakout rooms to create")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("delete").setDescription("Delete breakout rooms")
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .setDMPermission(false);

const createBreakoutRooms = async (interaction) => {
  const numberOfRooms = interaction.options.getNumber("rooms");
  const interactionChannel = interaction.channel;
  const category = interactionChannel.parent;

  await interaction.reply({
    content: `Creating ${numberOfRooms} breakout rooms in ${category.name}!`,
    ephemeral: true,
  });

  // Find the lobby channel where users start
  const lobby = Array.from(category.children.cache.values()).find(({ name }) =>
    name.includes("lobby")
  );

  if (!lobby) return;

  // Get all users in the lobby, and chunk them into groups after shuffling.
  const usersInLobby = shuffle(Array.from(lobby.members.values()));

  const chunks = chunk(
    usersInLobby,
    Math.ceil(usersInLobby.length / numberOfRooms)
  );

  // Create number of voice channels.
  const rooms = await Promise.all(
    Array(numberOfRooms)
      .fill("")
      .map((_, i) => {
        return interaction.guild.channels.create({
          name: `[Breakout Room] ${i + 1}`,
          type: ChannelType.GuildVoice,
          parent: category.id,
        });
      })
  );

  // Move users to appropriate channels
  await Promise.all(
    chunks.reduce((acc, users, index) => {
      const room = rooms.at(index);

      users.forEach((user) => {
        console.log(`Moving ${user.nickname} to ${room.name}`);
        acc.push(user.voice.setChannel(room));
      });

      return acc;
    }, [])
  );

  return;
};

const deleteBreakoutRooms = async (interaction) => {
  const category = interaction.channel.parent;
  const channels = Array.from(category.children.cache.values());

  await interaction.reply({
    content: "Deleting breakout rooms",
    ephemeral: true,
  });

  const breakoutRooms = channels.filter(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name.startsWith("[Breakout Room]")
  );

  // Find the lobby channel where users start
  const lobby = Array.from(category.children.cache.values()).find(({ name }) =>
    name.includes("lobby")
  );

  // Move users to Lobby
  await Promise.all(
    breakoutRooms.reduce((acc, room) => {
      Array.from(room.members.values()).forEach((member) => {
        acc.push(member.voice.setChannel(lobby));
      });

      return acc;
    }, [])
  );

  // Delete Channels
  await Promise.all(breakoutRooms.map((channel) => channel.delete()));
};

const subcommands = {
  create: createBreakoutRooms,
  delete: deleteBreakoutRooms,
};

export const execute = async (interaction) => {
  const subcommand = subcommands[interaction.options.getSubcommand()];

  if (subcommand) await subcommand(interaction);
  else
    await interaction.reply({
      content: "Unhandled subcommand",
      ephemeral: true,
    });
};
