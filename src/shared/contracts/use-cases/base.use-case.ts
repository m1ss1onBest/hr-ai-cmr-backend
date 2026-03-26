export abstract class IBaseUseCase<Request, Result> {
  abstract run(request: Request): Promise<Result>;
}
