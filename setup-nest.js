//setup-nest.js
const fs = require("fs"); // Para leer/escribir archivos (File System)
const { execSync } = require("child_process");// Para ejecutar comandos de terminal
const path = require("path"); // Para gestionar rutas de carpetas (Windows/Mac)

//Se captura el nombre del proyecto se escriba en la terminal
//process.argv[2] es el tercer argumento (0 = node, 1 = archivo, 2 = argumento)
const projectName = process.argv[2];

if (!projectName) {
  console.error("Introduce el nombre del proyecto");
  process.exit(1); // se cierra el programa por error
}

try {
  // --skip-install: Importante para NO instalar nada hasta configurar Yarn.
  console.log("📦 Descargando andamiaje de NestJS...");
  execSync(
    `npx -y @nestjs/cli new ${projectName} --package-manager yarn --skip-install`,
    {
      stdio: "inherit", // Muestra el proceso en pantalla (colores, barras de carga)
    },
  );

  //se calcula la ruta completa de la nueva carpeta
  const projectPath = path.join(process.cwd(), projectName);

  //ahora se crea el .yarnrc.yml con node modules
  console.log("📄 Creando archivo .yarnrc.yml...");
  const yarnRcContent = "nodeLinker: node-modules\n";
  //dentro de la carpeta del proyecto
  fs.writeFileSync(path.join(projectPath, ".yarnrc.yml"), yarnRcContent);

  //ahora si ejecutamos yarn install con la config nueva
  console.log("🧶 Ejecutando 'yarn install' (con node_modules)...");
  //cwd le dice que ejecute el comando dentro de la carpeta nueva
  execSync("yarn install", { cwd: projectPath, stdio: "inherit" });

  // ahora se instala el módulo de Configuración (.env) y el archivo .env
  console.log("⚙️ Instalando @nestjs/config...");
  execSync("yarn add @nestjs/config", { cwd: projectPath, stdio: "inherit" });

  const envContent = "PORT=3000\nDATABASE_USER=root\nDATABASE_PASSWORD=secret";
  fs.writeFileSync(path.join(projectPath, ".env"), envContent);
  console.log("✅ Archivo .env creado.");

  //opcional por si quieres quitar el lint y el formateo

  //console.log("🧹 Eliminando Prettier y sus plugins...");
  //execSync('yarn remove prettier eslint-config-prettier eslint-plugin-prettier', { cwd: projectPath, stdio: 'inherit' });

  // por si se quieren borrar los archivos
  /*
  try {
    fs.unlinkSync(path.join(projectPath, '.prettierrc'));
  } catch (err) {
    
  }*/
  console.log(`\n✨ ¡TODO LISTO! ✨`);
  console.log(`📁 Entra con: cd ${projectName}`);
  console.log(`💻 Arranca con: yarn start:dev`);
} catch (error) {
  console.error("❌ Algo falló en el proceso.");
  process.exit(1);
}

// comando para lanzar y crear el proyecto (lanzar dentro de la carpeta donde tengamos este script)
//o si lo quieres lanzar desde cualquier lado hay que poner delante la ruta donde se encuentre este script
// node setup-nest.js nombreDelProyecto
