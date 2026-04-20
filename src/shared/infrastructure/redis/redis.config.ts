import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Config } from '../config';

@Config()
export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  public readonly REDIS_HOST: string = process.env.REDIS_HOST!;

  @IsNumber()
  @IsNumber()
  public readonly REDIS_PORT: number = Number.parseInt(process.env.REDIS_PORT!);

  @IsString()
  @IsNotEmpty()
  public readonly REDIS_PASSWORD: string = process.env.REDIS_PASSWORD!;
}
