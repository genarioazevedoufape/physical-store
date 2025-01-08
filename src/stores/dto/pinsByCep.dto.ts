import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class PinsByCepDto {
    @IsString()
    cep: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    limit?: number = 10;

    @IsInt()
    @Min(0)
    @IsOptional()
    offset?: number = 0;
}
