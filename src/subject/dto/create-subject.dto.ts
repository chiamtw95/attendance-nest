import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @IsString()
  @IsNotEmpty()
  subjectCode: string;

  @IsArray()
  @IsString({ each: true })
  sessions?: [];

  @IsArray()
  @IsString({ each: true })
  student?: [];

  @IsArray()
  @IsString({ each: true })
  lecturer?: [];
}
