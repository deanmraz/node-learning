export default interface RestController {
  public async middlewares();
  public async get();
  public async post();
  public async patch();
  public async put();
  public async delete();
}
