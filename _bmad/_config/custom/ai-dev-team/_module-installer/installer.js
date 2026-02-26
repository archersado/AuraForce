const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * AI Dev Team Module Installer
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('🏗️ Installing AI Dev Team...'));

    // Create artifacts directory
    if (config['artifacts_folder']) {
      const dirConfig = config['artifacts_folder'].replace('{project-root}/', '');
      const dirPath = path.join(projectRoot, dirConfig);
      if (!(await fs.pathExists(dirPath))) {
        logger.log(chalk.yellow(`Creating artifacts directory: ${dirConfig}`));
        await fs.ensureDir(dirPath);
      }
    }

    // Create dev-docs directory
    if (config['dev_docs_folder']) {
      const dirConfig = config['dev_docs_folder'].replace('{project-root}/', '');
      const dirPath = path.join(projectRoot, dirConfig);
      if (!(await fs.pathExists(dirPath))) {
        logger.log(chalk.yellow(`Creating dev-docs directory: ${dirConfig}`));
        await fs.ensureDir(dirPath);
      }
    }

    // Create subdirectories in dev-docs
    if (config['dev_docs_folder']) {
      const baseDir = config['dev_docs_folder'].replace('{project-root}/', '');
      const basePath = path.join(projectRoot, baseDir);

      const subdirs = ['prd', 'interaction-design', 'technical-design', 'test-cases'];
      for (const subdir of subdirs) {
        const subPath = path.join(basePath, subdir);
        if (!(await fs.pathExists(subPath))) {
          await fs.ensureDir(subPath);
        }
      }

      logger.log(chalk.green('✓ Created dev-docs subdirectories'));
    }

    // IDE-specific configuration
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring AI Dev Team for IDEs: ${installedIDEs.join(', ')}`));

      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ AI Dev Team installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing AI Dev Team: ${error.message}`));
    return false;
  }
}

async function configureForIDE(ide, projectRoot, config, logger) {
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`  Warning: Unknown platform '${ide}'. Skipping.`));
    return;
  }

  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);
      if (typeof platformHandler.install === 'function') {
        await platformHandler.install({ projectRoot, config, logger });
      }
    }
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: Could not configure ${ide}: ${error.message}`));
  }
}

module.exports = { install };
