
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const isLocal: boolean = Boolean(configService.get('DB_HOST') === 'localhost');
                const extraOptions = isLocal ? { } : { ssl: { rejectUnauthorized: false }};

                return ({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT, 10),
                    username: process.env.DB_USERNAME,
                    database: process.env.DB_NAME,
                    password: process.env.DB_PASSWORD,
                    extra: extraOptions,
                    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
                    // namingStrategy: new SnakeNamingStrategy(),
                    synchronize: true,
                    keepConnectionAlive: true
                });
            }
        })
    ]
})
export class DatabaseModule { }