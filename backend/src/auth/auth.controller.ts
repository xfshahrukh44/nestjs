import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Get,
    Request,
    UseGuards,
    UseInterceptors,
    UploadedFile, ParseFilePipe, MaxFileSizeValidator, Param, Inject
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { AuthGuard } from './auth.guard';
import {SigninDto} from "./dto/signin.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {
    deleteFileFromUploads,
    getRandomFileName,
    uploadFile
} from "../helpers/helper";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {SubmitOTPDto} from "./dto/submit-otp.dto";
import {UsersService} from "../users/users.service";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import { firebaseAdmin } from '../firebase/firebase-admin';
import {socketIoServer} from "../main";
import {BlockUserDto} from "./dto/block-user.dto";
import {UserInterface} from "../users/users.schema";
import {Model} from "mongoose";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        @Inject('USER_MODEL')
        private userModel: Model<UserInterface>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SigninDto) {
        let res = await this.authService.signIn(signInDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Sign In successful!',
            data: res.error ? [] : res,
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signUp(@Body() signUpDto: CreateUserDto) {
        signUpDto.created_at = Date.now().toString();
        let res = await this.authService.signup(signUpDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Sign Up successful!',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AuthGuard)
    @Get('me')
    @ApiBearerAuth()
    async me(@Request() req) {
        let user: any = await this.cacheManager.get('profile-user-' + req.user.id);

        if (user == null) {
            user = await this.authService.getUserByEmail(req.user.email);

            if (!user.error) {
                await this.cacheManager.set('profile-user-' + req.user.id, user, 1000);
            }
        }

        return {
            success: !user.error,
            message: user.error ? user.error : '',
            data: user.error ? [] : user,
        }
    }

    @UseGuards(AuthGuard)
    @Post('upload-profile-picture')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                profile_picture: {type: 'string', format: 'binary'}
            }
        }
    })
    @UseInterceptors(FileInterceptor('profile_picture'))
    async uploadProfilePicture(@Request() req, @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({maxSize: 100000000})
            ]
        })
    ) profile_picture: Express.Multer.File) {

        let user = await this.authService.getUserByEmail(req.user.email);
        let app_url = process.env.APP_URL + ':' + process.env.PORT;
        if (user.error) {
            return {
                success: false,
                message: user.error,
                data: [],
            }
        }

        //delete if present and get file_path
        if (user.profile_picture != null) {
            let app_url = process.env.APP_URL + ':' + process.env.PORT;
            await deleteFileFromUploads(app_url, user.profile_picture);
        }

        let dir_path = '/uploads/users/';
        let file_name = getRandomFileName(profile_picture);
        let file_path = '.' + dir_path + file_name;

        await uploadFile('.' + dir_path, file_path, profile_picture);

        file_path = app_url + dir_path + file_name;

        let res = await this.authService.uploadProfilePicture(user.id, file_path);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Profile picture updated successfully!',
            data: res.error ? [] : {profile_picture: file_path},
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('update-profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        let user = await this.authService.getUserByEmail(req.user.email);

        if (user.error) {
            return user;
        }

        let res = await this.authService.updateProfile(updateUserDto, user.id);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Profile updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        let res = await this.authService.forgotPassword(forgotPasswordDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'An OTP was sent to your email',
            data: res.error ? [] : res,
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('resend-otp')
    async resendOTP(@Body() forgotPasswordDto: ForgotPasswordDto) {
        let res = await this.authService.forgotPassword(forgotPasswordDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'An OTP was sent to your email',
            data: res.error ? [] : res,
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('submit-otp')
    async submitOTP(@Body() submitOTPDto: SubmitOTPDto) {
        let res = await this.authService.submitOTP(submitOTPDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Your OTP was correct.',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AuthGuard)
    @Post('reset-password')
    @ApiBearerAuth()
    async resetPassword(@Request() req, @Body() resetPasswordDto: ResetPasswordDto) {
        let user = await this.authService.getUserByEmail(req.user.email);

        let updateUserDto = new UpdateUserDto();
        updateUserDto.password = resetPasswordDto.password

        let res = await this.userService.update(user.id, updateUserDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Your password was reset',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AuthGuard)
    @Post('block-user/:flag')
    @ApiBearerAuth()
    async blockUser (@Request() req, @Body() blockUserDto: BlockUserDto, @Param('flag') flag: number) {
        let user = await this.userService.findOneByEmail(req.user.email);
        if (user.id == blockUserDto.user_id) {
            return {
                success: false,
                message: 'You cannot block yourself.',
                data: [],
            }
        }

        let user_to_block = await this.userService.findOne(blockUserDto.user_id);
        if (user_to_block.error) {
            return {
                success: false,
                message: user_to_block.error,
                data: [],
            }
        }

        let updateUserDto = new UpdateUserDto();
        if (flag == 1) {
            if (user.blocked_users == null) {
                updateUserDto.blocked_users = JSON.stringify([user_to_block.id]);
            } else {
                let blocked_users = JSON.parse(user.blocked_users);

                const isBlocked = blocked_users.some((member) => member === user_to_block.id);
                if (isBlocked) {
                    return {
                        success: false,
                        message: 'User is already blocked.',
                        data: [],
                    };
                }

                blocked_users.push(user_to_block.id);
                updateUserDto.blocked_users = JSON.stringify(blocked_users);
            }
        } else if (flag == 0) {
            if (user.blocked_users == null) {
                let updateUserDto = new UpdateUserDto();
                updateUserDto.blocked_users = JSON.stringify([]);
                await this.userService.update(user.id, updateUserDto);
                return {
                    success: false,
                    message: 'User is already un-blocked.',
                    data: [],
                };
            } else {
                let blocked_users = JSON.parse(user.blocked_users);

                const isBlocked = blocked_users.some((member) => member === user_to_block.id);
                if (!isBlocked) {
                    return {
                        success: false,
                        message: 'User is already un-blocked.',
                        data: [],
                    };
                }

                blocked_users = blocked_users.filter((user_id) => user_id !== user_to_block.id);
                updateUserDto.blocked_users = JSON.stringify(blocked_users);
            }
        } else {
            return {
                success: false,
                message: 'Invalid flag parameter. Expected values: [0, 1]',
                data: [],
            }
        }

        await this.userService.update(user.id, updateUserDto);
        return {
            success: true,
            message: 'User ' + ((flag == 0) ? 'un-' : '') + 'blocked successfully.',
            data: user_to_block,
        }
    }

    @UseGuards(AuthGuard)
    @Get('blocked-users')
    @ApiBearerAuth()
    async blockedUsers (@Request() req) {
        let user = await this.userService.findOneByEmail(req.user.email);
        if (user.error) {
            return {
                success: false,
                message: user.error,
                data: [],
            }
        }

        let blocked_users_ids = (user.blocked_users == null) ? JSON.stringify([]) : user.blocked_users;
        blocked_users_ids = JSON.parse(blocked_users_ids);

        let blocked_users = await Promise.all(
            blocked_users_ids.map(async (blocked_users_id) => {
                let blocked_user = await this.userService.findOne(blocked_users_id);

                if (!blocked_user.error) {
                    delete blocked_user.otp;
                    delete blocked_user.password;

                    return blocked_user;
                }

            }).filter((item) => item !== null && item !== undefined)
        );

        return {
            success: true,
            message: '',
            data: blocked_users,
        }
    }

    @Get('firebase/test')
    async firebaseTest() {
        const message = {
            notification: {
                title: 'Test Notification',
                body: 'Test Body',
            },
            // topic: 'test', // The topic to which the notification will be sent
            tokens: ['cK-GQIkDT065HxEaeydpBr:APA91bHZuskTSOaPArpLkRCU3D4iNYtEnRNZsZN-lA2aaEXGwtvbUIMrAN1u0qeOntdRWXVjgbxuE6rt40RBSfbzo21sBMwFCL6KhR7U8vZVHuK_KeMKTP9N6GQqz_O21va2ZvwzeXw6'], // The topic to which the notification will be sent
        };

        // let response = await firebaseAdmin.messaging().send(message);
        let response = await firebaseAdmin.messaging().sendMulticast(message);

        console.log(response);

        return response;
    }

    @Get('socketio/test')
    async socketioTest() {
        //emit notification
        socketIoServer.emit('test', {
            message: 'Test socketio notification'
        });

        return {
            success: true,
            message: 'Socket sent successfully!',
            data: []
        };
    }
}
