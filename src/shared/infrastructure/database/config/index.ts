import { IsNotEmpty } from 'class-validator';
import { Config } from '../../config';

@Config()
export class DatabaseConfig {
  @IsNotEmpty()
  public readonly DATABASE_URL = process.env.DATABASE_URL;
}
