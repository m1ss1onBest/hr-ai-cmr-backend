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

  // WIP come up with some smart ass way of injecting storage instance
  // e.g. switching from MinIO to S3
  @IsString()
  @IsNotEmpty()
  public readonly MINIO_ROOT_USER: string = process.env.MINIO_ROOT_USER!;

  // WIP read previous comment
  @IsString()
  @IsNotEmpty()
  public readonly MINIO_ROOT_PASSWORD: string =
    process.env.MINIO_ROOT_PASSWORD!;

  @IsString()
  @IsNotEmpty()
  public readonly STORAGE_BUCKET: string = process.env.STORAGE_BUCKET!;
}
