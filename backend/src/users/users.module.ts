import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {DatabaseModule} from "../database/database.module";
import {userProviders} from "./users.provider";

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [...userProviders, UsersService],
    exports: [UsersService, ...userProviders],
})
export class UsersModule {
}
