import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GqlContextType, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as jwt from 'jsonwebtoken';
import {
  ApolloServerPluginLandingPageLocalDefault,
  Context,
} from 'apollo-server-core';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './project/project.module';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          subscriptions: {
            'graphql-ws': {
              path: '/subscriptions',
              onConnect: async (context: Context<any>) => {
                const { connectionParams, extra } = context;
                let token: string = '';
                if (connectionParams.auth_token) {
                  token = connectionParams.auth_token.split(' ')[1];
                }
                const user: any = await jwt.verify(
                  token,
                  process.env.JWT_SECRET as string,
                );
                const { iat, ...rest } = user;
                extra.user = rest;
              },
            },
          },
          context: ({
            req,
            res,
            extra,
          }: {
            req: Request;
            res: Response;
            extra: any;
          }) => ({
            req,
            res,
            extra,
          }),
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20d' },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
