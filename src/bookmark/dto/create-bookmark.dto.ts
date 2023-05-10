import {
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsNotEmpty()
  link: string;
}
