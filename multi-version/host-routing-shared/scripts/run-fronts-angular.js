const { loadManifestLocal } = require('./load-manifest');
const concurrently = require('concurrently');
const inquirer = require('inquirer');
const path = require('path');

(async () => {
  const modulesManifest = await loadManifestLocal();
  const prompt = inquirer.createPromptModule();

  prompt({
    type: 'checkbox',
    name: 'projects',
    message: '¿Qué microfrontend deseas correr?',
    choices: [new inquirer.Separator(), ...Object.keys(modulesManifest)],
  }).then(({ projects }) => {
    const modulesToServe = projects.length
      ? projects.map(getModuleLaunchConfig)
      : Object.keys(modulesManifest).map(getModuleLaunchConfig);

    concurrently([
      {
        name: 'Host',
        command: 'ng serve host',
        cwd: path.resolve(__dirname, '../host'),
      },
      ...modulesToServe,
    ]);
  });
})();

const getModuleLaunchConfig = (project) => {
  return {
    name: `${project}`,
    command: `ng serve ${project}`,
    cwd: path.resolve(__dirname, `../${project}`),
  };
};
