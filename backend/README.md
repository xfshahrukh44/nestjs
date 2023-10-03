<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


## Setup

```bash
# 1. install nest cli
$ npm i -g @nestjs/cli
$ cd project-name

# 2. create folder named 'backend' for your nestjs application
$ nest new backend
$ cd backend

# 3. install packages
$ npm i @nestjs/swagger @nestjs/jwt @nestjs/config @types/multer class-validator typeorm firebase firebase-admin nodemailer socket.io mysql2 dotenv class-transformer bcrypt

# 4. copy the following folders from 'src' directory 
-auth 
-contacts
-database 
-firebase 
-groups (for group chats) 
-group-requests (for group chats) 
-helpers 
-mail 
-messages (for group chats) 
-middlewares 
-notifications
-ssl
-users 

# 5. create backend/uploads directory

# 6. create backend/images directory

# 7. create backend/ssl directory and place key.txt and cert.txt files
 
# 8. copy .env.example file and prepare .env file according to .env.example

# 9. add following code to backend/.gitignore file
.env
uploads/*

# 10. copy backend/pm2.json file

# 11. import modules in app module, modify src/app.module.ts as follows
convert:
imports: [],
to:
imports: [
      ConfigModule.forRoot(),
      UsersModule,
      AuthModule,
      ContactsModule,
      MailModule,
      GroupsModule,
      MessagesModule,
      NotificationsModule,
      GroupRequestsModule,
  ],
  
//apply abusive words filter
convert:
export class AppModule {}
to:
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AbusiveWordsMiddleware).forRoutes('*');
    }
}

# 12. setup src/main.ts file 

-add following code above 'bootstrap' method

//import code
import * as fs from "fs";
import * as path from 'path';

//https config
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '', '/ssl/key.txt').replace('dist', 'src')),
    cert: fs.readFileSync(path.join(__dirname, '', '/ssl/cert.txt').replace('dist', 'src')),
};

//socket.io deps
import * as express from 'express';
const socket_app = express();
import * as https from 'https';
const socket_io_server = https.createServer(httpsOptions, socket_app);
const { Server } = require("socket.io");
const io = new Server(socket_io_server);

io.on('connection', (socket) => {
    // console.log('socket', socket);
    console.log('a user connected');
});

socket_io_server.listen(process.env.SOCKET_IO_PORT, () => {
    console.log('listening on *:' + process.env.SOCKET_IO_PORT);
});

export const socketIoServer = io;


convert:
const app = await NestFactory.create(AppModule);
await app.listen(3000);
to:
const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
    app.useGlobalPipes(new ValidationPipe());
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    app.use('/images', express.static(path.join(__dirname, '..', 'images')));

    config({path: join(__dirname, '../.env')});

    //swagger
    const swagger_config = new DocumentBuilder()
        .setTitle('<project name>')
        .setDescription('<project name> API Documentation')
        .setVersion('1.0')
        .addTag('Auth')
        .addTag('Contacts')
        .addTag('Groups')
        .addTag('Group Requests')
        .addTag('Messages')
        .addTag('Notifications')
        .addTag('Users')
        .addSecurity('bearer', {
            type: 'http',
            scheme: 'bearer',
        })
        .build();
    const document = SwaggerModule.createDocument(app, swagger_config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);
    
# 13. copy backend/README.md file

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

##Database
Database configuration is located in ./src/database/database.providers.ts

##JWT
JWT auth middleware is present in ./src/auth/auth.guard.ts

##Firebase
Firebase credentials located in ./src/firebase/fbase.json

##Helpers
Located in ./src/helpers/helper.ts

##Mailing (smtp)
Located in ./src/mail

SMTP credentials located in .env

##Middlewares
Located in ./src/middlewares

##Socket-io
Initialised in ./src/main.ts

Socket port is defined in .env file [SOCKET_IO_PORT]

##SSL (for https):
Generate .key and .cert files and place them in ./src/ssl directory

Include certificate and key in main.ts file

Example (main.ts):

```
//https config
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '', '/ssl/<key-filename>').replace('dist', 'src')),
    cert: fs.readFileSync(path.join(__dirname, '', '/ssl/<cert-filename>').replace('dist', 'src')),
};
```
