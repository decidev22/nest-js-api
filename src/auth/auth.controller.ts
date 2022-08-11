import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    //because we have 'auth' set up, this post call below will be identical too...
    //POST /auth/signup
    @Post('signup')
    signup() {
        return this.authService.signup();
    }
    //Post /auth/signin
    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}