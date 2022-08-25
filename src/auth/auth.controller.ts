import { Body, Controller, ParseIntPipe, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    //because we have 'auth' set up, this post call below will be identical too...
    //POST /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log({dto,});
        return this.authService.signup(dto);
    }
    //Post /auth/signin
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}