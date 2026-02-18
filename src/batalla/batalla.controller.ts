import { Controller, UseGuards, Post, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.strategy/jwt-auth.guard';
import { StartBatallaDto } from './dto/start-batalla.dto';
import { BatallaService } from './batalla.service';

@Controller('batalla')
export class BatallaController {
    constructor(private readonly batallaService: BatallaService) {}

    @Post('start')
    @UseGuards(JwtAuthGuard)
    startBatalla(@Body() body: StartBatallaDto, @Req() req) {
        return this.batallaService.startBatalla(req.user.sub, body)
    }
}
