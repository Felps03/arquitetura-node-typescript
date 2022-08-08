import App from './app';

const app = new App();

app.init().listen(process.env.PORT, () => {
  console.info(`App starting at http://localhost:${process.env.PORT}`);
  console.info(`Envs: ${process.env.TARGET || 'local'}`);
});
