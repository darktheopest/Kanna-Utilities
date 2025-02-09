# 🚧 This project is in development 🚧

⚠️ **This project is currently a work in progress. There may be bugs and unfinished features.**

If you encounter any issues, please report them!

---

# Kanna Utilities

![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.1.6-blue)

## 📌 About
**Kanna Utilities** is a utility package for Discord bot development using the [Sapphire Framework](https://www.sapphirejs.dev/). It includes various helper functions, subcommands, and tools to enhance bot functionality. This project is built using TypeScript and follows best coding practices with ESLint.

## 🚀 Features
- **Sapphire Framework Integration**: Built on top of the Sapphire framework for modular and scalable bot development.
- **Discord.js Support**: Works seamlessly with the latest version of [discord.js](https://discord.js.org/).
- **Mongoose for Database**: Supports MongoDB interactions using [Mongoose](https://mongoosejs.com/).
- **GIF Generation**: Utilizes `gifencoder` and `canvas` to create custom GIFs and images.
- **Progress Bars**: Includes `cli-progress` and `string-progressbar` for visual progress tracking.
- **Day.js for Date Handling**: Simplifies date and time manipulation.
- **Environment Configuration**: Uses `dotenv` to manage environment variables.

## 📂 Project Structure
```
/kanna-utilities
│── /dist          # Compiled JavaScript files
│── /src           # Source TypeScript files
│── /node_modules  # Dependencies
│── .eslintrc.json # ESLint configuration
│── .gitignore     # Ignored files for Git
│── package.json   # Project metadata & scripts
│── tsconfig.json  # TypeScript configuration
│── README.md      # Project documentation
```

## 📜 Prerequisites
- **Node.js v16+**
- **npm or yarn**
- **MongoDB (Optional, if using database features)**

## 📦 Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/darktheopest/kanna-utilities.git
cd kanna-utilities
npm install
```

## ⚡ Usage
### Running the Bot
```sh
npm start
```
This will compile the TypeScript files and run the bot.

### Development Mode
For active development with automatic rebuilding:
```sh
npm run watch
```

### Linting the Code
To ensure code consistency and best practices:
```sh
npm run lint
```

## 🛠 Scripts
| Script   | Description |
|----------|------------|
| `build`  | Compiles TypeScript files into JavaScript |
| `run`    | Runs the compiled bot from `dist/index.js` |
| `start`  | Builds and runs the bot |
| `lint`   | Runs ESLint to check for errors |
| `watch`  | Watches files and restarts bot on changes |

## 📜 Environment Variables
Create a `.env` file in the root directory and define:
```
DISCORD_TOKEN=your_discord_bot_token
```

## 📖 Dependencies
### Core Dependencies
- `discord.js` - Library for interacting with Discord API
- `@sapphire/framework` - Advanced framework for Discord bots
- `mongoose` - MongoDB ODM for managing database interactions
- `canvas` - Image manipulation and graphics generation
- `gifencoder` - Creating GIFs programmatically
- `dotenv` - Handling environment variables

### Dev Dependencies
- `typescript` - Statically typed JavaScript
- `eslint` - Linting tool for maintaining code quality
- `@typescript-eslint/parser` - ESLint parser for TypeScript
- `pm2` - Process manager for keeping the bot alive

## 🤝 Contributing
Contributions are welcome! Feel free to open issues and pull requests to improve the project.

## 📜 License
This project is licensed under the **ISC License**.

## 📞 Contact
- **Author**: Dark
- **GitHub**: [https://github.com/darktheopest](https://github.com/darktheopest)
- **Discord**: [darktheages](https://discord.com/users/926643835419910184)  

