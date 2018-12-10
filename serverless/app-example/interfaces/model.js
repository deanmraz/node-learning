export default interface Model {
  public async find(id: string);
  public async findAll();
  public async query(params: object);
  public async create();
  public async update(id: string);
  public async delete(id: string);
}
