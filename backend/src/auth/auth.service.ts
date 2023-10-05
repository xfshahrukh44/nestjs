import {Inject, Injectable} from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {SigninDto} from "./dto/signin.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {generateOTP} from "../helpers/helper";
import {MailService} from "../mail/mail.service";
import {SubmitOTPDto} from "./dto/submit-otp.dto";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {MongooseError} from "mongoose";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SigninDto): Promise<any> {
        const user = await this.usersService.findOneByEmail(signInDto.email);

        if (user.error) {
            return user;
        }

        if (user.blocked_at && user.blocked_at != "") {
            return {
                error: 'Your account has been blocked.'
            }
        }

        if (!await bcrypt.compare(signInDto.password, user?.password)) {
            return {
                error: 'Unauthorized'
            };
        }
        const { password, ...result } = user;
        const payload = { sub: user.id, ...user};

        return {
            ...payload,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signup(signUpDto: CreateUserDto): Promise<any> {
        const user = await this.usersService.create(signUpDto);

        if (user.error) {
            return user;
        }

        const payload = { sub: user.id, ...user};

        return {
            ...payload,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async uploadProfilePicture(user_id: string, file_path): Promise<any> {
        try {
            let user = await this.usersService.findOne(user_id);

            if (user.error) {
                return user;
            }

            let updateUserDto = new UpdateUserDto()
            updateUserDto.profile_picture = file_path;

            return await this.usersService.update(user.id, updateUserDto);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async updateProfile(updateUserDto: UpdateUserDto, user_id: string): Promise<any> {
        try {
            let user = await this.usersService.findOne(user_id);

            if (user.error) {
                return user;
            }

            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            return await this.usersService.update(user.id, updateUserDto);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async getUserByEmail (email: string): Promise<any> {
        // try {
            const user = await this.usersService.findOneByEmail(email);

            if (user.error) {
                return user;
            }

            delete user.password;
            return user;
        // } catch (error) {
        //     if (error instanceof MongooseError) {
        //         return {
        //             error: error.message
        //         };
        //     }
        // }
    }

    async forgotPassword (forgotPasswordDto: ForgotPasswordDto): Promise<any> {
        try {
            const user = await this.usersService.findOneByEmail(forgotPasswordDto.email);

            if (user.error) {
                return user;
            }

            let generated_otp = generateOTP();

            //save otp to database
            let updateUserDto = new UpdateUserDto()
            updateUserDto.otp = generated_otp;
            updateUserDto.otp_expires_at = (Date.now() + 60 * 60 * 1000).toString();
            await this.usersService.update(user.id, updateUserDto);


            let mailService = new MailService();
            let html = "Dear "+ (user.first_name + ' ' + user.last_name) +",<br/><br/>Thank you for using our service! Please find your One-Time Password (OTP) below:<br/><br/>OTP: "+ generated_otp +"<br/><br/>Please use this OTP to complete your action or verification. This code is valid for a single use and will expire in an hour.<br/><br/>If you did not request this OTP, please ignore this email. Your account and information are safe.<br/><br/>Thank you,<br/>Texas Christian Ashram.";
            await mailService.sendEmail(user.email, 'OTP', html);

            return 'An OTP was sent to your email';
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async submitOTP (submitOTPDto: SubmitOTPDto): Promise<any> {
        try {
            let user;

            //bypass otp by 111111
            if (submitOTPDto.otp == '111111') {
                user = await this.usersService.findOneByEmail(submitOTPDto.email);
            } else {
                user = await this.usersService.findOneByEmail(submitOTPDto.email, [ { $match: { otp: submitOTPDto.otp } } ]);
            }

            if (user.error) {
                return {
                    error: 'Your OTP was incorrect'
                };
            }

            //if OTP has expired
            if (parseInt(user.otp_expires_at) <= Date.now() || user.otp_expires_at == null) {
                return {
                    error: 'Your OTP has expired. You could request for another one.'
                };
            }

            //clear OTP fields

            //save otp to database
            let updateUserDto = new UpdateUserDto()
            updateUserDto.otp = null;
            updateUserDto.otp_expires_at = null;
            await this.usersService.update(user.id, updateUserDto);

            const payload = { sub: user.id, ...user};

            return {
                ...payload,
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
