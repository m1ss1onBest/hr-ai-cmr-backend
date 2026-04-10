import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Config } from '../config';

@Config()
export class StorageConfig {
  @IsString()
  @IsNotEmpty()
  public readonly STORAGE_HOST: string = process.env.STORAGE_HOST!;

  @IsNumber()
  @IsNotEmpty()
  public readonly STORAGE_PORT: number = Number.parseInt(
    process.env.STORAGE_PORT!,
  );

  @IsBoolean()
  @IsNotEmpty()
  public readonly STORAGE_USE_SSL: boolean =
    process.env.STORAGE_USE_SSL! === 'true';

  @IsString()
  @IsNotEmpty()
  public readonly STORAGE_ACCESS_KEY: string = process.env.STORAGE_ACCESS_KEY!;

  @IsString()
  @IsNotEmpty()
  public readonly STORAGE_SECRET_KEY: string = process.env.STORAGE_SECRET_KEY!;

  @IsString()
  @IsNotEmpty()
  public readonly STORAGE_BUCKET: string = process.env.STORAGE_BUCKET!;
}
