export default interface ServiceProvider {
  defer: boolean;
  register();
  provides();
}
