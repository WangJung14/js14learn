"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
    app.enableCors({
        origin: [frontendUrl, 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    const port = configService.get('PORT') || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map